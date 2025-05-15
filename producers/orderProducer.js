import { kafka } from "../kafka/kafkaClient.js";

const producer = kafka.producer();

export async function sendOrder(order) {
  await producer.connect();
  await producer.send({
    topic: "order-topic",
    messages: [{ value: JSON.stringify(order) }],
  });
  await producer.disconnect();
}
