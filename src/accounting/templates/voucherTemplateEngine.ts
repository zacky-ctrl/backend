// =====================================
// Voucher Template Engine
// SINGLE SOURCE OF ACCOUNTING TRUTH
// =====================================

// -------------------------------------
// Types
// -------------------------------------

export type VoucherType = "SALE" | "PURCHASE" | "RECEIPT" | "PAYMENT";
export type EntrySide = "DEBIT" | "CREDIT";

/**
 * Business intent input.
 * No accounting freedom here.
 */
export type VoucherTemplateInput = {
    voucherType: VoucherType;
    subType: string;

    /**
     * Total business amount.
     * Split happens at UI / higher layer later.
     */
    totalAmount: number;

    /**
     * Cash / Bank account ID (for RECEIPT / PAYMENT / CASH cases)
     */
    paymentAccountId?: string;

    /**
     * Control accounts resolved BEFORE calling template
     */
    accounts: {
        salesAccountId: string;
        purchaseExpenseAccountId: string;
        accountsReceivableId: string;
        accountsPayableId: string;
        ownerCapitalId: string;
    };
};

/**
 * Final output — schema aligned
 */
export type GeneratedEntry = {
    accountId: string;
    side: EntrySide;
    amount: number;
};

// -------------------------------------
// Public API
// -------------------------------------

export function generateEntriesFromTemplate(
    input: VoucherTemplateInput
): GeneratedEntry[] {
    switch (input.voucherType) {
        case "SALE":
            return saleTemplate(input);

        case "PURCHASE":
            return purchaseTemplate(input);

        case "RECEIPT":
            return receiptTemplate(input);

        case "PAYMENT":
            return paymentTemplate(input);

        default:
            throw new Error("Unsupported voucher type");
    }
}

// -------------------------------------
// Templates
// -------------------------------------

function saleTemplate(input: VoucherTemplateInput): GeneratedEntry[] {
    switch (input.subType) {
        case "CASH_SALE":
            if (!input.paymentAccountId) {
                throw new Error("paymentAccountId required for CASH_SALE");
            }

            return [
                {
                    accountId: input.paymentAccountId,
                    side: "DEBIT",
                    amount: input.totalAmount,
                },
                {
                    accountId: input.accounts.salesAccountId,
                    side: "CREDIT",
                    amount: input.totalAmount,
                },
            ];

        case "CREDIT_SALE":
            return [
                {
                    accountId: input.accounts.accountsReceivableId,
                    side: "DEBIT",
                    amount: input.totalAmount,
                },
                {
                    accountId: input.accounts.salesAccountId,
                    side: "CREDIT",
                    amount: input.totalAmount,
                },
            ];

        default:
            throw new Error("Unsupported SALE subType");
    }
}

function purchaseTemplate(input: VoucherTemplateInput): GeneratedEntry[] {
    switch (input.subType) {
        case "CASH_PURCHASE":
            if (!input.paymentAccountId) {
                throw new Error("paymentAccountId required for CASH_PURCHASE");
            }

            return [
                {
                    accountId: input.accounts.purchaseExpenseAccountId,
                    side: "DEBIT",
                    amount: input.totalAmount,
                },
                {
                    accountId: input.paymentAccountId,
                    side: "CREDIT",
                    amount: input.totalAmount,
                },
            ];

        case "CREDIT_PURCHASE":
            return [
                {
                    accountId: input.accounts.purchaseExpenseAccountId,
                    side: "DEBIT",
                    amount: input.totalAmount,
                },
                {
                    accountId: input.accounts.accountsPayableId,
                    side: "CREDIT",
                    amount: input.totalAmount,
                },
            ];

        default:
            throw new Error("Unsupported PURCHASE subType");
    }
}

function receiptTemplate(input: VoucherTemplateInput): GeneratedEntry[] {
    if (!input.paymentAccountId) {
        throw new Error("paymentAccountId required for RECEIPT");
    }

    return [
        {
            accountId: input.paymentAccountId,
            side: "DEBIT",
            amount: input.totalAmount,
        },
        {
            accountId: input.accounts.accountsReceivableId,
            side: "CREDIT",
            amount: input.totalAmount,
        },
    ];
}

function paymentTemplate(input: VoucherTemplateInput): GeneratedEntry[] {
    if (!input.paymentAccountId) {
        throw new Error("paymentAccountId required for PAYMENT");
    }

    switch (input.subType) {
        case "VENDOR_PAYMENT":
            return [
                {
                    accountId: input.accounts.accountsPayableId,
                    side: "DEBIT",
                    amount: input.totalAmount,
                },
                {
                    accountId: input.paymentAccountId,
                    side: "CREDIT",
                    amount: input.totalAmount,
                },
            ];

        case "OWNER_WITHDRAWAL":
            return [
                {
                    accountId: input.accounts.ownerCapitalId,
                    side: "DEBIT",
                    amount: input.totalAmount,
                },
                {
                    accountId: input.paymentAccountId,
                    side: "CREDIT",
                    amount: input.totalAmount,
                },
            ];

        default:
            throw new Error("Unsupported PAYMENT subType");
    }
}
