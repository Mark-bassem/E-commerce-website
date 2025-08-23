import express from "express";
import Product from "../models/Product.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// List active products
router.get("/", async (req, res) => {
  const products = await Product.find({ active: true }).sort({ createdAt: -1 });
  // map to fields frontend expects: id, name, description, price, image
  res.json(
    products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
    }))
  );
});

// Single product
router.get("/:id", async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p || !p.active) return res.status(404).json({ error: "Not found" });
  res.json({
    id: p._id.toString(),
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
  });
});

// (Optional) Admin CRUD - requires admin flag on user — omitted here for brevity
export default router;