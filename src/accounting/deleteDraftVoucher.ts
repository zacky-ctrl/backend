import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteDraftVoucher(voucherId: string) {
    return await prisma.$transaction(async (tx) => {
        const voucher = await tx.voucher.findUnique({
            where: { id: voucherId },
        });

        if (!voucher) {
            throw new Error("Voucher not found");
        }

        if (voucher.status !== "DRAFT") {
            throw new Error("Only DRAFT vouchers can be deleted");
        }

        await tx.entry.deleteMany({
            where: { voucherId },
        });

        await tx.voucher.delete({
            where: { id: voucherId },
        });

        return { deleted: true };
    });
}
