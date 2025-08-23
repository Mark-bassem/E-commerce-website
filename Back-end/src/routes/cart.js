import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.use(authRequired);

// Helper: get or create cart
async function getCartForUser(userId) {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate("items.product");
  }
  return cart;
}

// Get cart
router.get("/", async (req, res) => {
  const cart = await getCartForUser(req.user._id);
  const items = cart.items.map((it) => ({
    product: {
      id: it.product._id.toString(),
      name: it.product.name,
      price: it.product.price,
      image: it.product.image,
      description: it.product.description,
    },
    quantity: it.quantity,
  }));
  res.json(items);
});

// Add/update item: body { productId, quantity }
router.post("/", async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ error: "productId required" });

  const product = await Product.findById(productId);
  if (!product || !product.active)
    return res.status(400).json({ error: "Invalid product" });

  const cart = await getCartForUser(req.user._id);
  const idx = cart.items.findIndex((i) => i.product._id.equals(product._id));
  if (idx >= 0) {
    cart.items[idx].quantity = quantity;
  } else {
    cart.items.push({ product: product._id, quantity });
  }
  cart.updatedAt = new Date();
  await cart.save();
  res.json({ message: "Cart updated" });
});

// Remove item by productId
router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;
  const cart = await getCartForUser(req.user._id);
  cart.items = cart.items.filter((i) => !i.product._id.equals(productId));
  await cart.save();
  res.json({ message: "Removed" });
});

export default router;