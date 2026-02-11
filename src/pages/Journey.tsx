// ================================
// Imports
// ================================
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type {Journey, JourneyStage } from "../data/journey";
import { stageMeta } from "../data/stages";
import { useAuth } from "../auth/AuthContext";

import {
  getEligibleStages,
  isJourneyCompleted,
} from "../domain/journey.logic";

import { fetchJourney, saveJourney } from "../api/journeyApi";

// ================================
// Constants
// ================================
const JOURNEY_STORAGE_KEY = "onboarding_journey";

// ================================
// Helper Functions — PURE LOGIC
// Safe to move to backend unchanged
// ================================
function isStageComplete(stage: JourneyStage): boolean {
  return stage.tasks.every(t => t.done);
}

function isStageBlocked(
  stage: JourneyStage,
  allStages: JourneyStage[]
): boolean {
  return stage.dependsOn.some(depId => {
    const depStage = allStages.find(s => s.id === depId);
    if (!depStage) return false;
    if (depStage.optional) return false;
    return !isStageComplete(depStage);
  });
}

function daysBetween(today: Date, dueDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((dueDate.getTime() - today.getTime()) / msPerDay);
}

function getDueRisk(stage: JourneyStage): "done" | "overdue" | "due-soon" | "on-track" {
  if (isStageComplete(stage)) return "done";

  const today = new Date();
  const due = new Date(stage.dueDate);
  const daysLeft = daysBetween(today, due);

  if (daysLeft < 0) return "overdue";
  if (daysLeft <= 2) return "due-soon";
  return "on-track";
}

function getOverallHealth(stages: JourneyStage[]): "green" | "amber" | "red" {
  let hasDueSoon = false;

  for (const stage of stages) {
    const risk = getDueRisk(stage);
    if (risk === "overdue") return "red";
    if (risk === "due-soon") hasDueSoon = true;
  }

  return hasDueSoon ? "amber" : "green";
}

// ================================
// Stage Component
// ================================
type StageProps = {
  stage: JourneyStage;
  allStages: JourneyStage[];
  view: "internal" | "customer";
  journeyMode: string;
  customerId: string;
  onToggleTask: (stageId: string, taskId: number) => void;
};

function Stage({
  stage,
  allStages,
  view,
  journeyMode,
  customerId,
  onToggleTask,
}: StageProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const blocked = isStageBlocked(stage, allStages);
  const risk = getDueRisk(stage);

  return (
    <div
      style={{
        border:
          risk === "overdue"
            ? "2px solid #f44336"
            : risk === "due-soon"
            ? "2px solid #ff9800"
            : "1px solid #e0e0e0",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        opacity: blocked ? 0.6 : 1,
      }}
    >
      {/* Header */}
      <div
        style={{ cursor: blocked ? "not-allowed" : "pointer" }}
        onClick={() => {
          if (blocked && view === "customer") return;
          setOpen(!open);
        }}
      >
        <h4>{stageMeta[stage.id]?.title ?? stage.name}</h4>
        <div>Due: {stage.dueDate}</div>

        {view === "internal" && (
          <div>
            {risk === "overdue" && "🔥 Overdue"}
            {risk === "due-soon" && "⚠️ Due soon"}
            {risk === "on-track" && "🟢 On track"}
            {risk === "done" && "✅ Completed"}
          </div>
        )}

        {view === "customer" && (
          <div>
            {isStageComplete(stage)
              ? "Completed"
              : blocked
              ? "Waiting for previous step"
              : "In progress"}
          </div>
        )}
      </div>

      {/* Tasks */}
      {open && (
        <ul style={{ marginTop: 12 }}>
          {stage.tasks.map(task => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => onToggleTask(stage.id, task.id)}
                />
                {task.title}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ================================
// Journey Page
// ================================
export default function Journey() {

const auth = useAuth();
const user = auth.user!; // safe because RequireAuth guarantees it
const isInternal = user.role === "internal";

  // -------------------------------
  // State (hydrated)
  // -------------------------------
  const [activeCustomerId, setActiveCustomerId] = useState<string>(() => {
    if (user.role === "customer") {
    return user.customerId!;
  }
  return localStorage.getItem("active_customer_id") ?? "acme";
  });

const [journeyData, setJourneyData] = useState<Journey | null>(null);
const [loading, setLoading] = useState(false);

    // ================================
  // EFFECT — LOAD JOURNEY ON CUSTOMER CHANGE 
  // ================================

  useEffect(() => {
  if (user.role === "customer") {
    setActiveCustomerId(user.customerId!);
  }
}, [user]);

  // -------------------------------
  // Persistence
  // -------------------------------

   useEffect(() => {
  let cancelled = false;

  async function loadJourney() {
    setLoading(true);
    try {
      const journey = await fetchJourney(activeCustomerId);
      if (!cancelled) {
        setJourneyData(journey);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadJourney();

  return () => {
    cancelled = true;
  };
}, [activeCustomerId]);


    // ================================
  // EFFECT — PERSIST ACTIVE CUSTOMER 
  // ================================

    useEffect(() => {
  if (user.role === "internal") {
    localStorage.setItem(
      "active_customer_id",
      activeCustomerId
    );
  }
}, [activeCustomerId, user.role]);

   // ================================
  // EFFECT — SAVE JOURNEY (API) 
  // ================================

  useEffect(() => {
  if (!journeyData) return;
  saveJourney(activeCustomerId, journeyData);
}, [journeyData, activeCustomerId]);


  if (loading) {
  return <div style={{ padding: 32 }}>Loading journey…</div>;
}

  if (!journeyData) {
    return (
      <div style={{ padding: 32 }}>
        Failed to load journey.
      </div>
    );
  }

  // -------------------------------
  // Derived data
  // -------------------------------
  const eligibleStages = getEligibleStages(journeyData.stages);
  const health = getOverallHealth(journeyData.stages);

  // -------------------------------
  // Handlers
  // -------------------------------
  function toggleTask(stageId: string, taskId: number) {
     if (!journeyData) return;
    const updatedStages = journeyData.stages.map(stage => {
      if (stage.id !== stageId) return stage;

      const updatedTasks = stage.tasks.map(task =>
        task.id === taskId
          ? { ...task, done: !task.done }
          : task
      );

      const allTasksDone =
        updatedTasks.length > 0 &&
        updatedTasks.every(t => t.done);

      return {
        ...stage,
        tasks: updatedTasks,
        completedAt: allTasksDone
          ? stage.completedAt ?? new Date().toISOString()
          : undefined,
      };
    });

    setJourneyData({
      ...journeyData,
      stages: updatedStages
    });
  }


  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div>
      {isInternal && (
<div style={{ marginBottom: 16 }}>
  <label>
    Customer:&nbsp;
    <select
      value={activeCustomerId}
      onChange={(e) => {
        const nextCustomerId = e.target.value;
        setActiveCustomerId(nextCustomerId);
      }}
    >
      <option value="acme">Acme Corp</option>
      <option value="globex">Globex Inc</option>
    </select>
  </label>
</div>
      )}
      
      <h2>{journeyData.customerName} – Onboarding</h2>
      <div>Overall health: {health.toUpperCase()}</div>

      {journeyData.stages.map(stage => (
        <Stage
          key={stage.id}
          stage={stage}
          allStages={journeyData.stages}
          view={isInternal ? "internal" : "customer"}
          journeyMode={journeyData.journeyMode}
          customerId={activeCustomerId}
          onToggleTask={toggleTask}
        />
      ))}
    </div>
  );
}