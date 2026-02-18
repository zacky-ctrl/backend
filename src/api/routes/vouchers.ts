import { Router } from "express";
import { prisma } from "../../../prisma/client";
import { createDraftVoucher } from "../../accounting/createDraftVoucher";
import { postVoucher } from "../../accounting/postVoucher";

const router = Router();

/**
 * GET /api/vouchers/drafts
 * Return draft vouchers ONLY (no accounting joins)
 */
router.get("/drafts", async (_req, res, next) => {
  try {
    const drafts = await prisma.voucher.findMany({
      where: { status: "DRAFT" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        voucherDate: true,
        status: true,
        narration: true,
        createdAt: true,
        voucherType: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    });

    res.json(drafts);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/vouchers/draft
 */
router.post("/draft", async (req, res, next) => {
  try {
    const voucher = await createDraftVoucher(req.body);
    res.status(201).json(voucher);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/vouchers/:id/post
 */
router.post("/:id/post", async (req, res, next) => {
  try {
    const result = await postVoucher(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
