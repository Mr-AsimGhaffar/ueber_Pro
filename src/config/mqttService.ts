import mqtt from "mqtt";

const client = mqtt.connect("tcp://0.tcp.ap.ngrok.io:18429", {
  protocol: "tcp",
  protocolVersion: 4,
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");
});

client.on("error", (error) => {
  console.error("MQTT connection error:", error);
});

export const subscribeToTopic = (
  topic: string,
  callback: (message: string) => void
) => {
  client.subscribe(topic, (err) => {
    if (err) {
      console.error(`Failed to subscribe to topic ${topic}:`, err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });

  client.on("message", (receivedTopic, message) => {
    if (receivedTopic === topic) {
      callback(message.toString());
    }
  });
};

export const disconnectMqtt = () => {
  client.end();
};
