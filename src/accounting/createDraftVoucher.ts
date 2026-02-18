import { PrismaClient, Prisma } from "@prisma/client";
import {
    generateEntriesFromTemplate,
    VoucherTemplateInput,
} from "./templates/voucherTemplateEngine";

const prisma = new PrismaClient();

/**
 * Input for creating a draft voucher.
 * Business intent only — no debit/credit exposed.
 */
export type CreateDraftVoucherInput = VoucherTemplateInput & {
    companyId: string;
    voucherDate: Date;
    narration?: string;
};

/**
 * Create a DRAFT voucher with system-generated accounting entries.
 * Deterministic, atomic, and schema-aligned.
 */
export async function createDraftVoucher(
    input: CreateDraftVoucherInput
) {
    return await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
            // 1. Create voucher header (DRAFT only)
            const voucher = await tx.voucher.create({
                data: {
                    companyId: input.companyId,
                    voucherTypeId: input.voucherTypeId,
                    status: "DRAFT",
                    voucherDate: input.voucherDate,
                    narration: input.narration ?? null,
                },
            });

            // 2. Generate entries from template engine
            const entries = generateEntriesFromTemplate({
                voucherTypeId: input.voucherTypeId,
                subType: input.subType,
                amount: input.amount,
                paymentAccountId: input.paymentAccountId,
            });

            // 3. Enforce Debit = Credit (HARD RULE)
            const totalDebit = entries
                .filter((e) => e.side === "DEBIT")
                .reduce((sum, e) => sum + e.amount, 0);

            const totalCredit = entries
                .filter((e) => e.side === "CREDIT")
                .reduce((sum, e) => sum + e.amount, 0);

            if (totalDebit !== totalCredit) {
                throw new Error("Debit and Credit totals do not match");
            }

            // 4. Persist entries
            for (const entry of entries) {
                await tx.entry.create({
                    data: {
                        voucherId: voucher.id,
                        accountId: entry.accountId,
                        side: entry.side,
                        amount: entry.amount,
                    },
                });
            }

            return voucher;
        }
    );
}
