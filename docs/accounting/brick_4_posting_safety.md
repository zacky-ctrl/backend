# Brick 4 — Posting Safety & Atomicity

## Purpose
This document defines the non-negotiable safety rules
for posting accounting vouchers.

Posting is the moment when accounting becomes truth.
This operation must be atomic, deterministic, and safe.

---

## Core Rule

Posting a voucher must be an ALL-OR-NOTHING operation.

Either:
- The voucher is fully posted correctly

Or:
- Nothing changes at all

Partial posting is forbidden.

---

## Atomicity Rule

When a voucher is posted, the following actions must occur together:

1. Validate posting rules
2. Assign voucher number
3. Change voucher status to POSTED

If any step fails:
- All changes must be rolled back
- Voucher must remain in DRAFT state

---

## Concurrency Rule

Multiple users may attempt to post vouchers at the same time.

The system must guarantee:
- No duplicate voucher numbers
- No partially posted vouchers
- No race-condition corruption

Voucher number uniqueness must be enforced
at the database level as the final safeguard.

---

## Failure Handling

If posting fails due to concurrency or validation:

- The failure must be explicit
- The user must retry intentionally
- No silent auto-repair is allowed

---

## Forbidden Behaviors

The system must NEVER:
- Assign voucher numbers outside posting
- Allow half-posted vouchers
- Allow POSTED vouchers without valid entries
- Auto-post vouchers without human action

---

## Scope

This brick applies only to:
- Voucher posting logic

It does NOT include:
- Authorization
- Deletion
- Corrections
- UI behavior

Those belong to Brick 5.
