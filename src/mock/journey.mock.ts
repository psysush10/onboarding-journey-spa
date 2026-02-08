import { Journey } from "../data/journey";

export const mockJourney: Journey = {
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
      completedAt: undefined,
      tasks: [
        { id: 1, title: "Schedule kickoff call", done: true },
      ],
    },
    {
      id: "data",
      name: "Access & Data Collection",
      owner: "Customer",
      dependsOn: ["kickoff"],
      dueDate: "2026-02-05",
      order: 2,
      completedAt: undefined,
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
      order: 3,
      completedAt: undefined,
      tasks: [
        { id: 3, title: "Configure workflows", done: false },
      ],
    },
  ],
};