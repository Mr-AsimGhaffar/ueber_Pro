"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/lib/definitions";

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) => {
  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
