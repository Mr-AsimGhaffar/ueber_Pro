"use client";

import { disconnectMqtt, subscribeToTopic } from "@/config/mqttService";
import { message } from "antd";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { useUser } from "./AuthContext";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  link?: string;
}

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useUser();

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [
      ...prev,
      { ...notification, id: Date.now().toString() },
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  useEffect(() => {
    if (!user) return;

    // Determine topics based on user role
    const topics: string[] = ["notifications/global"]; // Common to all users
    const companyId = user.company?.id;

    if (user.company?.type === "DRIVERS") {
      topics.push(
        "notifications/admins/global",
        "notifications/driver_company_admins/global",
        `notifications/admins/company/${companyId}`
      );
    } else if (user.company?.type === "CARS") {
      topics.push(
        "notifications/admins/global",
        "notifications/car_company_admins/global",
        `notifications/admins/company/${companyId}`
      );
    }

    // Subscribe to topics and handle messages
    topics.forEach((topic) => {
      subscribeToTopic(topic, (mqttMessage: string) => {
        try {
          const parsedMessage = JSON.parse(mqttMessage);
          addNotification(parsedMessage);
          message.success(parsedMessage.message || "New notification received");
        } catch (error) {
          console.error(`Error parsing MQTT message from ${topic}:`, error);
        }
      });
    });

    // Cleanup on unmount
    return () => {
      disconnectMqtt();
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
