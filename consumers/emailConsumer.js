import { kafka } from "../kafka/kafkaClient.js";

const consumer = kafka.consumer({ groupId: "email-group" });

export async function startEmailConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "order-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      console.log("[EMAIL] Mail gönderiliyor:", order.userEmail);
      // Mail servisi entegre edilebilir
    },
  });
}
