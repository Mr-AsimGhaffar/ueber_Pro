"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Activity } from "@/lib/definitions";

interface ActivityContextType {
  activity: Activity | null;
  setActivity: (activity: Activity) => void;
}

export const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
);

export const ActivityProvider = ({
  children,
  initialActivity,
}: {
  children: ReactNode;
  initialActivity: Activity | null;
}) => {
  const [activity, setActivity] = useState<Activity | null>(initialActivity);

  return (
    <ActivityContext.Provider value={{ activity, setActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within a UserProvider");
  }
  return context;
};
