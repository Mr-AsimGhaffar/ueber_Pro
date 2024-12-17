import React from "react";
import { List } from "antd";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/context/NotificationContext";

export default function NotificationList() {
  const { notifications, removeNotification } = useNotification();
  const router = useRouter();

  const handleNotificationClick = (notif: any) => {
    if (notif.link) {
      router.push(notif.link);
    }
    removeNotification(notif.id);
  };

  return (
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
  );
}
