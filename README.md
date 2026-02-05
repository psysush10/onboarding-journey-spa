# Onboarding Journey SPA

A role-aware onboarding journey interface designed for B2B SaaS products, focused on clarity, dependency management, and realistic internal vs customer experiences.

---

## Problem

In many B2B SaaS products, onboarding progress is either:
- too detailed and overwhelming for customers, or
- too high-level for internal teams to manage dependencies and risk.

Customers need confidence and clarity.  
Internal teams need operational truth.

Most onboarding tools fail to serve both well.

---

## Solution

This project models a **single onboarding journey** that adapts its behavior and messaging based on who is viewing it.

The same underlying data powers:
- a **calm, confidence-building Customer view**
- a **transparent, operational Internal view**

without duplicating logic or hardcoding states.

---

## Key Product Decisions

### 1. Stage-level modeling (not just tasks)
Tasks roll up into stages, which:
- have dependencies
- have due dates
- can be blocked by upstream work

This reflects how real onboarding actually works.

---

### 2. Derived state (no hardcoded status)
Stage status, risk, and overall health are **derived**, not stored:
- Completion comes from task state
- Blocked state comes from dependencies
- Risk comes from due dates

This makes the system resilient and backend-ready.

---

### 3. Dependency-aware blocking
A stage can be:
- on track
- due soon
- overdue
- blocked by another stage

Blocked ≠ overdue — a subtle but important distinction.

---

### 4. Role-based views (Internal vs Customer)

**Internal View**
- Shows owners
- Shows risk signals (due soon, overdue)
- Shows blocked reasons
- Allows inspection of blocked stages

**Customer View**
- Hides internal ownership
- Softens risk language
- Prevents interaction with blocked stages
- Focuses on progress and reassurance

The goal is trust, not pressure.

---

### 5. Overall onboarding health
A single health indicator (Green / Amber / Red) summarizes the entire journey:
- Red if any stage is overdue
- Amber if any stage is due soon
- Green otherwise

This answers the executive question:  
> “Are we okay?”

---

## UX Philosophy

- Stage cards summarize by default
- Tasks are available on demand
- No auto-expansion or noise
- Calm visuals over aggressive alerts

This mirrors real SaaS products used daily by CSMs and customers.

---

## Tech Stack

- React
- React Router
- Plain state + derived logic
- No external UI libraries (intentional)

The logic is structured so it can move to a backend (e.g., APIs, DB, auth) with minimal changes.

---

## What’s Next (Intentionally Out of Scope)

- Authentication & permissions
- Backend persistence
- Notifications & reminders
- Activity timelines

These were intentionally skipped to focus on **core product behavior and modeling**.

---

## Why This Project Exists

This is not a UI exercise.

It’s a demonstration of:
- product thinking
- state modeling
- realistic SaaS constraints
- empathy for different user roles

---

## Demo Tips

- Start in Internal View
- Walk through dependencies and risk
- Switch to Customer View
- Show how the same data tells a different story

---

## Day 2 Progress Summary

Day 2 focused on extending the onboarding journey from high-level tracking into **stage-level activation**, while preserving clarity and empathy for different user roles.

### What was added

- Introduced **stage detail views** that allow drilling into individual onboarding stages
- Enabled navigation flow: **Dashboard → Journey → Stage → Back to Journey**
- Made stage detail experiences **persona-aware**, adapting tone and guidance for:
  - Internal users (CS / Onboarding / TAM)
  - Customer users
- Explicitly framed each stage around:
  - Why the stage exists
  - What needs to be done next
  - What value is unlocked after completion
- Added “first value” previews to reinforce progress and motivation

### Product decisions reinforced

- Kept the same underlying data model for both personas, changing **messaging and signals**, not structure
- Avoided premature abstraction and backend integration to validate UX and product flow first
- Focused on activation and confidence, not just onboarding completion

This milestone represents a complete, believable onboarding slice rather than a static UI demo.


### Day 3 — Stage Detail Views & Persona-Aware Guidance

On Day 3, the focus shifted from the journey overview to stage-level depth, while keeping the experience realistic and intentionally read-only.

### Key outcomes:
	•	Implemented a dedicated Stage Detail view for onboarding stages
	•	Introduced a clear separation of responsibilities:
	•	Journey view owns progress, health, and operational state
	•	Stage Detail view focuses on guidance, expectations, and outcomes
	•	Built persona-aware rendering:
	•	Customer view shows clear, actionable steps with reassurance
	•	Internal view shows observational notes and recommended actions
	•	Ensured all stage detail content is config-driven (stageConfig), making future customization straightforward
	•	Explicitly avoided premature interactivity:
	•	No task completion or progress mutation on the stage detail screen
	•	Read-only by design, mirroring how real onboarding tools often work
	•	Improved visual hierarchy and scanability so each stage can be understood in seconds

### Design decisions:
	•	Not all stages are drill-downable (e.g. Kickoff), by intent
	•	Routing state is handled defensively to support both internal and customer contexts
	•	The UI prioritizes clarity and trust over feature density

By the end of Day 3, the onboarding flow supports realistic stage-level exploration while maintaining clean boundaries between operational state and user guidance.

### Design Philosophy

This project models customer onboarding as a guided journey rather than a checklist.

### Key principles:

1. Clarity over completeness
The UI prioritizes progress visibility and next steps instead of exposing every possible action.

2. Signals before controls
Momentum, risk, and ownership are communicated through copy and visual cues rather than alerts or workflows.

3. Adaptability without fragmentation
The same journey structure supports different onboarding modes (self-serve, guided) through contextual copy, not branching UIs.

4. Intentional constraints
Stage completion and progress updates are read-only in this demo to keep the focus on structure, guidance, and system behavior.
