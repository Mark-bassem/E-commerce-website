import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [OrderItemSchema],
  total: Number,
  status: { type: String, default: "unpaid" },
  paymentProvider: String,
  providerRef: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", OrderSchema);