import { completeStage, getEligibleStages, isJourneyCompleted} from "./journey.logic";
import { JourneyStage } from "../data/journey";

let mockStages: JourneyStage[] = [
      {
        id: "stage-1",
        name: "Create Account",
        owner: "CSM",
        dependsOn: [],
        completedAt: "2026-02-05T10:00:00Z",
        dueDate: "2026-02-01",
        optional: true,
        optionalReason: "Typically skipped for self-serve customers",
        order: 1,
        tasks: [
          { id: 1, title: "Schedule kickoff call", done: true },
        ],
      },
      {
        id: "stage-2",
        name: "Invite Team",
        owner: "Customer",
        dependsOn: ["stage-1"],
        dueDate: "2026-02-07",
        order: 2,
        tasks: [
          { id: 2, title: "Provide admin access", done: false },
        ],
      },
      {
        id: "stage-3",
        name: "Configure Product",
        owner: "CSM",
        dependsOn: ["stage-1"],
        dueDate: "2026-02-09",
        order:3,
        tasks: [
          { id: 3, title: "Configure workflows", done: false },
        ],
      },
      {
        id: "stage-4",
        name: "Compliance Review",
        owner: "CSM",
        dependsOn: ["stage-2", "stage-3"],
        dueDate: "2026-02-09",
        order:4,
        tasks: [
          { id: 3, title: "Configure workflows", done: false },
        ],
      }
    ];

// Initial eligible stages
console.log(
  "Initial eligible:",
  getEligibleStages(mockStages).map(s => s.name)
);

// Complete Invite Team
mockStages = completeStage(mockStages, "stage-2");

console.log(
  "After completing Invite Team:",
  getEligibleStages(mockStages).map(s => s.name)
);

// Complete Configure Product
mockStages = completeStage(mockStages, "stage-3");

console.log(
  "After completing Configure Product:",
  getEligibleStages(mockStages).map(s => s.name)
);

// Check journey completion
console.log("Journey completed?", isJourneyCompleted(mockStages));