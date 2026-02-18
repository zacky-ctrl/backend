# 🧱 Brick 7 — HTTP API Routes (Voucher Lifecycle)

## Status
DRAFT

This brick defines the **HTTP interface** for the accounting core.
It exposes existing backend services without introducing any new business logic.

Once frozen, this brick becomes a **hard contract** between:
- Backend accounting system
- Bolt UI client

---

## Purpose

- Expose voucher lifecycle operations over HTTP
- Preserve backend authority over accounting truth
- Enable Bolt UI development
- Keep HTTP layer thin, boring, and deterministic

---

## Non-Negotiable Rules

- HTTP layer contains **no accounting logic**
- HTTP layer does **not** decide debit/credit
- HTTP layer does **not** infer intent
- HTTP layer delegates to accounting services only
- Backend remains the single source of truth

---

## Route Ownership

All voucher routes live under:

/api/vouchers


Implemented in:

src/api/routes/vouchers.ts


---

## Authentication & Authorization

- All routes require authentication
- Role enforcement is done via middleware
- Voucher state validation is enforced in services, not routes

---

## Routes

### 1. Create Draft Voucher

**POST** `/api/vouchers/draft`

Purpose:
- Create a new DRAFT voucher
- Generate accounting entries via template engine

Delegates to:
src/accounting/createDraftVoucher.ts


Allowed Roles:
- Clerk
- Accountant
- Admin

---

### 2. Update Draft Voucher

**PUT** `/api/vouchers/draft/:voucherId`

Purpose:
- Replace draft voucher contents entirely
- Regenerate entries from scratch

Delegates to:
src/accounting/updateDraftVoucher.ts


Allowed Roles:
- Clerk
- Accountant
- Admin

Notes:
- POSTED vouchers must fail

---

### 3. Delete Draft Voucher

**DELETE** `/api/vouchers/draft/:voucherId`

Purpose:
- Permanently delete a DRAFT voucher

Delegates to:
src/accounting/deleteDraftVoucher.ts


Allowed Roles:
- Clerk
- Accountant
- Admin

---

### 4. Post Voucher

**POST** `/api/vouchers/:voucherId/post`

Purpose:
- Post a draft voucher
- Assign voucher number
- Persist entries atomically

Delegates to:
src/accounting/postVoucher.ts


Allowed Roles:
- Accountant
- Admin

Notes:
- Posting is atomic
- No retries
- No partial success

---

### 5. List Vouchers

**GET** `/api/vouchers`

Purpose:
- Display voucher list in UI
- No reporting or aggregation

Allowed Filters:
- status
- voucherType
- date range

Implementation:
- Read-only Prisma queries

---

### 6. Get Single Voucher

**GET** `/api/vouchers/:voucherId`

Purpose:
- View voucher and entries
- Backend returns full data
- UI controls visibility

Implementation:
- Read-only Prisma query

---

## Explicitly Out of Scope

- Reports
- Balances
- Inventory
- Invoice allocation
- OCR
- AI automation
- UI logic
- Validation beyond required fields

---

## Definition of Done

This brick is complete when:
- All routes are implemented exactly as specified
- No accounting logic exists in HTTP layer
- Bolt UI can operate fully against these endpoints
- This document is marked FROZEN

After freezing, changes require a new brick.