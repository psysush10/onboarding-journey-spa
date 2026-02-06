// ================================
// Types — backend-shaped contracts
// ================================


// Represents a customer's full onboarding lifecycle.
// Progress should always be resumable.
export type Journey = {
  id: string;
  customerId: string;
  customerName: string;
  journeyType: string;
  journeyMode: "self-serve" | "guided" | "enterprise";
  startDate: string;
  targetCompletion: string;
  successOutcome: string;
  stages: JourneyStage[];
};


// A single step in a journey. Only one stage can be active at a time.
export type JourneyStage = {
  id: string;
  name: string;
  owner: "Customer" | "CSM";
  dependsOn: string[]; // stage IDs this stage depends on
  dueDate: string;
  optional?: boolean;
  optionalReason?: string;
  tasks: StageTask[];
  order: number;
  completedAt?: string;
};

export type StageTask = {
  id: number;
  title: string;
  done: boolean;
};

// ================================
// Mock data — simulates API response
// ================================

// ================================
// Mock data — simulates API response
// ================================

export const journeys: Record<string, Journey> = {
  acme: {
    id: "journey-acme",
    customerId: "acme",
    customerName: "Acme Corp",
    journeyType: "Standard Onboarding",
    journeyMode: "self-serve",
    startDate: "2026-01-28",
    targetCompletion: "2026-02-10",
    successOutcome: "Customer is live with first usable dashboard",

    stages: [
      {
        id: "kickoff",
        name: "Kickoff & Alignment",
        owner: "CSM",
        dependsOn: [],
        dueDate: "2026-02-01",
        optional: true,
        optionalReason: "Typically skipped for self-serve customers",
        order: 1,
        tasks: [
          { id: 1, title: "Schedule kickoff call", done: true },
        ],
      },
      {
        id: "data",
        name: "Access & Data Collection",
        owner: "Customer",
        dependsOn: ["kickoff"],
        dueDate: "2026-02-07",
        order: 2,
        tasks: [
          { id: 2, title: "Provide admin access", done: false },
        ],
      },
      {
        id: "config",
        name: "Product Configuration",
        owner: "CSM",
        dependsOn: ["data"],
        dueDate: "2026-02-09",
        order:3,
        tasks: [
          { id: 3, title: "Configure workflows", done: false },
        ],
      },
    ],
  },

  globex: {
    id: "journey-globex",
    customerId: "globex",
    customerName: "Globex Inc",
    journeyType: "Guided Onboarding",
    journeyMode: "guided",
    startDate: "2026-02-01",
    targetCompletion: "2026-02-15",
    successOutcome: "Customer completes guided configuration",

    stages: [
      {
        id: "data",
        name: "System Access & Integrations",
        owner: "Customer",
        dependsOn: [],
        dueDate: "2026-02-10",
        order: 1,
        tasks: [
          { id: 1, title: "Grant system access", done: false },
        ],
      },
      {
        id: "config",
        name: "Guided Configuration",
        owner: "CSM",
        dependsOn: ["data"],
        dueDate: "2026-02-15",
        order: 2,
        tasks: [
          { id: 2, title: "Run guided setup session", done: false },
        ],
      },
    ],
  },
};

// ================================
// Selectors — simulate backend queries
// ================================

export function getJourneyByCustomerId(customerId: string): Journey {
  const journey = journeys[customerId];
  if (!journey) {
    throw new Error(`Journey not found for customerId: ${customerId}`);
  }
  return journey;
}