import express from "express";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { authRequired } from "../middleware/auth.js";
import Stripe from "stripe";

const router = express.Router();

const stripeKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeKey ? new Stripe(stripeKey) : null;

router.use(authRequired);

// Get user orders
router.get("/", async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(
    orders.map((o) => ({
      id: o._id.toString(),
      createdAt: o.createdAt,
      status: o.status,
      total: o.total,
    }))
  );
});

// Checkout: create order from cart
router.post("/", async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  if (!cart || cart.items.length === 0)
    return res.status(400).json({ error: "Cart empty" });

  const items = cart.items.map((it) => ({
    productId: it.product._id.toString(),
    name: it.product.name,
    price: it.product.price,
    quantity: it.quantity,
  }));
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const order = await Order.create({
    user: req.user._id,
    items,
    total,
    status: stripe ? "processing" : "unpaid",
  });

  // clear cart
  cart.items = [];
  await cart.save();

  // If stripe enabled, create payment intent (optional)
  if (stripe) {
    try {
      const pi = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // cents
        currency: process.env.CURRENCY || "usd",
        metadata: {
          orderId: order._id.toString(),
          userId: req.user._id.toString(),
        },
      });
      order.paymentProvider = "stripe";
      order.providerRef = pi.id;
      await order.save();
      return res
        .status(201)
        .json({
          orderId: order._id.toString(),
          client_secret: pi.client_secret,
        });
    } catch (e) {
      order.status = "failed";
      await order.save();
      return res.status(500).json({ error: "Payment creation failed" });
    }
  }

  res
    .status(201)
    .json({ orderId: order._id.toString(), message: "Order created (unpaid)" });
});

export default router;