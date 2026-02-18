import express from "express";
import vouchersRouter from "./routes/vouchers";
import reportsRouter from "./routes/reports";

const app = express();

app.use(express.json());

// Routes
app.use("/api/vouchers", vouchersRouter);
app.use("/api/reports", reportsRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
