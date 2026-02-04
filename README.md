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