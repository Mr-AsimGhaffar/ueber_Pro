import { i18n } from "@/config/i18n";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  contacts: string;
  profilePicture: string;
};

export type Report = {
  filename: string;
  url: string;
};

export type TeamMember = {
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string;
};

export type Activity = {
  firstName: string;
  lastName: string;
  action: "COMMENT" | "ACTIVATE" | "STOP";
  ts: number;
};

export type Locale = (typeof i18n)["locales"][number];
