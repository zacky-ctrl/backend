# Brick 5 — Guardrails, Authority & Human Control

## Purpose
This document defines roles, permissions,
and guardrails for interacting with accounting truth.

The system must support learning, correction,
and human judgment without breaking accounting integrity.

---

## Role Definitions

### Clerk
- Can create DRAFT vouchers
- Can edit DRAFT vouchers
- Cannot POST vouchers
- Cannot delete POSTED vouchers

---

### Accountant
- Can create and edit DRAFT vouchers
- Can POST vouchers
- Can create correction vouchers
- Cannot delete POSTED vouchers

---

### Admin (Owner)
- Full access
- Can POST vouchers
- Can delete POSTED vouchers
- Can correct any mistake intentionally

Admin powers exist to support learning and recovery,
not silent manipulation.

---

## Deletion Rules (Critical)

POSTED vouchers may be deleted ONLY by Admin.

Deletion must:
- Require explicit human intent
- Capture deletion reason
- Record who deleted the voucher
- Preserve historical trace (not silent erase)

Deleted vouchers:
- Must not appear in reports
- Must remain traceable for audit/debugging

---

## No Casual Unposting

The system must NOT support:
- Casual “unpost” actions
- Silent reverting of POSTED vouchers

Corrections must be done via:
- New vouchers
- Or explicit admin deletion with reason

---

## Draft Philosophy

- Draft vouchers are flexible
- Draft vouchers can be deleted freely
- Draft vouchers do not affect accounting truth

Posting is the point of no return.

---

## Human Review Rule

No voucher may become POSTED without
explicit human confirmation.

This applies to:
- Manual entry
- Imports
- OCR
- AI-assisted features

AI is advisory only.

---

## Scope

This brick governs:
- Authority
- Deletion
- Correction philosophy

It does NOT define:
- UI layout
- Authentication
- Visual permissions
