import { kafka } from "../kafka/kafkaClient.js";

const producer = kafka.producer();

export async function sendToDLQ(message, reason = "Unknown Error") {
  await producer.connect();
  await producer.send({
    topic: "order-topic-dlq",
    messages: [
      {
        value: JSON.stringify({
          failedMessage: message,
          error: reason,
          timestamp: new Date().toISOString(),
        }),
      },
    ],
  });
  await producer.disconnect();
}
