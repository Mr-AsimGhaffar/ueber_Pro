"use client";
import React from "react";
import { Card, List, Typography, Tag } from "antd";
import moment from "moment";
import { useActivity } from "@/hooks/context/ActivityContext";
import { Activity } from "@/lib/definitions";

const { Title, Text } = Typography;

const ActivityPage = () => {
  const { activity } = useActivity();

  const activitiesArray: Activity[] = Array.isArray(activity) ? activity : [];

  return (
    <div className="p-6 bg-gradient-to-r from-blue-400 to-purple-500 min-h-screen rounded-lg">
      <div className="max-w-4xl mx-auto">
        <Title
          level={2}
          className="text-center text-3xl font-bold font-montserrat mb-6"
        >
          Activities
        </Title>

        <Card className="shadow-lg">
          <List
            dataSource={activitiesArray}
            renderItem={(item: Activity) => (
              <List.Item className="border-b border-gray-200 py-4">
                <div className="w-full flex flex-col md:flex-row md:justify-between items-start md:items-center">
                  <div>
                    <Title level={5} className="text-blue-600 font-sansInter">
                      Action: {item.action}
                    </Title>
                    <Text className="font-sansInter">
                      Table: <Tag color="blue">{item.table}</Tag>
                    </Text>
                    <Text className="font-sansInter">
                      Endpoint: <Tag color="green">{item.endpoint}</Tag>
                    </Text>
                    <Text className="font-sansInter">
                      Resource ID: <Tag color="purple">{item.resourceId}</Tag>
                    </Text>
                    <Text className="font-sansInter">
                      User: {item.User.firstName} {item.User.lastName}
                    </Text>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Text className="text-gray-500 font-sansInter">
                      Created At:{" "}
                      {moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default ActivityPage;
