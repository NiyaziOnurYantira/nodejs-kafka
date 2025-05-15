import { kafka } from "../kafka/kafkaClient.js";

const consumer = kafka.consumer({ groupId: "dlq-group" });

export async function startDLQConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "order-topic-dlq", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("[DLQ] Hatalı Mesaj:", data.failedMessage);
      console.log("[DLQ] Hata Nedeni:", data.error);
      console.log("[DLQ] Zaman:", data.timestamp);
    },
  });
}
