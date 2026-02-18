# Brick 6 — Voucher Entry (Template-Driven, Draft-First)

## Purpose
Define how users create vouchers without needing accounting knowledge,
while ensuring accounting correctness through deterministic templates.

This brick focuses on DRAFT creation only.
Posting logic is handled separately (Brick 3–5).

---

## Core Principles

1. Users describe BUSINESS EVENTS, not accounting.
2. The system generates accounting entries deterministically.
3. Debit/Credit is hidden from non-admin users.
4. Drafts are flexible; posting is strict.
5. Voucher Types are minimal and fixed.

---

## Voucher Types (Fixed)

The system supports exactly four voucher types:

- SALE
- PURCHASE
- RECEIPT
- PAYMENT

No additional voucher types are allowed.

JOURNAL vouchers exist but are Admin-only and out of scope for this brick.

---

## Sub-Types / Reasons (Template Selectors)

Each voucher type has sub-types that select a fixed accounting template.
Sub-types do NOT introduce new accounting logic.

### SALE — Sub-Types
- Fully paid
- Partially paid
- On credit

### PURCHASE — Sub-Types
- Fully paid
- Partially paid
- On credit

### RECEIPT — Sub-Types
- Against sale (old dues)
- Customer advance
- Scrap sale
- Capital introduced
- Refund received

### PAYMENT — Sub-Types
- Expense payment
- Supplier payment (old dues)
- Supplier advance
- Owner withdrawal
- Bank charges

Sub-types are business language only.

---

## SALE Voucher Behavior (Locked)

SALE represents VALUE CREATION.
Payment timing does not change the sale value.

For a SALE of amount X:

- Sales is always credited by X.
- Debit side is split automatically:
  - Cash/Bank (amount received now)
  - Accounts Receivable (balance)

Example:
Sale = 10,000
Paid now = 3,000

Entries (system-generated):
- Debit Cash → 3,000
- Debit Accounts Receivable → 7,000
- Credit Sales → 10,000

Users do not see or edit these entries.

---

## PURCHASE Voucher Behavior (Locked)

PURCHASE represents VALUE CONSUMPTION.

For a PURCHASE of amount X:

- Expense/Inventory is always debited by X.
- Credit side is split automatically:
  - Cash/Bank (amount paid now)
  - Accounts Payable (balance)

---

## RECEIPT / PAYMENT Behavior (Locked)

RECEIPT and PAYMENT represent MONEY MOVEMENT ONLY.

They never create income or expense by themselves.
They only settle balances or record advances.

Accounting is selected by sub-type.

---

## User Interaction Rules

### Non-Admin Users
- Cannot see debit/credit
- Cannot choose accounts
- Cannot override templates
- Only fill business fields:
  - Voucher Type
  - Sub-Type
  - Party
  - Amount
  - Payment Mode
  - Date
  - Narration

### Admin Users
- Can view generated entries
- Can override templates if needed
- Can delete posted vouchers with reason (Brick 5)

---

## Draft Rules

- All vouchers are created as DRAFT.
- Drafts can be edited or deleted freely.
- Drafts do not affect reports or balances.
- Posting requires explicit action and validation.

---

## Explicit Non-Goals (Out of Scope)

This brick does NOT include:
- Invoice allocation
- Posting rules
- Reports
- Inventory
- Taxes
- UI design details

Those are separate bricks.

---

## Success Criteria

A normal accountant can:
- Record daily transactions quickly
- Without knowing debit/credit
- Without creating accounting mistakes

An admin can:
- Audit and correct when necessary
- Without breaking accounting truth
