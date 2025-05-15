import { kafka } from "../kafka/kafkaClient.js";
import { sendToDLQ } from "../producers/dlqProducer.js";

const consumer = kafka.consumer({ groupId: "invoice-group" });

export async function startInvoiceConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "order-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const order = JSON.parse(message.value.toString());

        // Hata kontrolü (örnek: amount sayı mı?)
        if (typeof order.amount !== "number" || isNaN(order.amount)) {
          throw new Error("Invalid amount");
        }

        console.log("[INVOICE] Fatura kesiliyor:", order);
      } catch (err) {
        console.error(
          "[INVOICE] Hata oluştu, DLQ’ya gönderiliyor:",
          err.message
        );
        await sendToDLQ(message.value.toString(), err.message);
      }
    },
  });
}
