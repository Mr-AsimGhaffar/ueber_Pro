import React, { useEffect, useState } from "react";
import { List, message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/context/NotificationContext";

type Notification = {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function NotificationList({
  refreshTrigger,
}: {
  refreshTrigger: boolean;
}) {
  const { removeNotification } = useNotification();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications/getAllNotifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      message.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [refreshTrigger]);

  const handleNotificationClick = (notif: any) => {
    if (notif.link) {
      router.push(notif.link);
    }
    removeNotification(notif.id);
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notif.id)
    );
  };

  return (
    <Spin spinning={loading} tip="Loading notifications...">
      <List
        size="small"
        bordered
        dataSource={notifications}
        renderItem={(notif) => (
          <List.Item
            onClick={() => handleNotificationClick(notif)}
            className="cursor-pointer bg-white rounded-lg font-workSans hover:bg-gray-100"
          >
            {notif.message}
          </List.Item>
        )}
      />
    </Spin>
  );
}
