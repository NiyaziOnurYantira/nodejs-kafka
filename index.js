import express from "express";
import { sendOrder } from "./producers/orderProducer.js";
import { startInvoiceConsumer } from "./consumers/invoiceConsumer.js";
import { startEmailConsumer } from "./consumers/emailConsumer.js";
import { startDLQConsumer } from "./consumers/dlqConsumer.js";

const app = express();
app.use(express.json());

app.post("/order", async (req, res) => {
  const order = {
    id: Date.now(),
    userEmail: req.body.userEmail,
    product: req.body.product,
    amount: req.body.amount, // Hatalı veri testi için buraya "abc" de verebilirsin
  };

  try {
    await sendOrder(order);
    res.status(200).json({ message: "Order received", order });
  } catch (err) {
    console.error("Order send error:", err);
    res.status(500).json({ error: "Order failed" });
  }
});

app.listen(3000, async () => {
  console.log("API running at http://localhost:3000");
  await startInvoiceConsumer();
  await startEmailConsumer();
  await startDLQConsumer(); // DLQ dinlemeyi başlat
});
