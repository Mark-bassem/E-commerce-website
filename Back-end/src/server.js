import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "node:path";

import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import ordersRoutes from "./routes/orders.js";

const app = express();
const PORT = process.env.PORT || 5000;

const corsOrigin = process.env.CORS_ORIGIN || "*";
app.use(cors({ origin: corsOrigin, credentials: true }));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Connect Mongo
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Mongo connection error:", err.message);
    process.exit(1);
  });

// Routes (prefix /api)
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);

// health
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`API listening on port ${PORT}`));