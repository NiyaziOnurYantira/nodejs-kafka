import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "order-app",
  brokers: ["localhost:9092"],
});
