import { User, Report, TeamMember, Activity } from "@/lib/definitions";
import { cookies } from "next/headers";
import Cookies from "js-cookie";

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    }
  );

  if (!response.ok) {
    throw new Error("Refresh token expired. Please log in again.");
  }

  const data = await response.json();
  const newAccessToken = data.data.token.token;
  Cookies.set("accessToken", newAccessToken, { expires: 1 }); // Save new access token in cookies
  return newAccessToken;
};

const getAccessToken = async (): Promise<string> => {
  let accessToken = cookies().get("accessToken")?.value;

  // If the access token is expired, attempt to refresh it using the refresh token
  if (!accessToken) {
    const refreshToken = cookies().get("refreshToken")?.value;
    if (!refreshToken) {
      throw new Error(
        "Both access token and refresh token are missing. Please log in."
      );
    }
    accessToken = await refreshAccessToken(refreshToken); // Refresh the access token
  }

  return accessToken;
};

export async function getUser(): Promise<User> {
  const accessToken = await getAccessToken();
  const id = cookies().get("id")?.value;

  if (!id) {
    throw new Error("User ID not found. Please log in.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // body: JSON.stringify({ clientType: "web" }),
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized. Please log in again.");
    }
    throw new Error("Failed to fetch user data");
  }

  const user = await response.json();
  return user.data;
}

export async function getReports(): Promise<Report[]> {
  return new Promise((resolve) => {
    const reports: Report[] = [];

    setTimeout(() => resolve(reports), 500);
  });
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return new Promise((resolve) => {
    const teamMembers: TeamMember[] = [
      {
        firstName: "Dries",
        lastName: "Vincent",
        username: "@driesvincent",
        profileImage:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        firstName: "Lindsay",
        lastName: "Walton",
        username: "@lindsaywalton",
        profileImage:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        firstName: "Courtney",
        lastName: "Henry",
        username: "@courtneyhenry",
        profileImage:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        firstName: "Whitney",
        lastName: "Francis",
        username: "@whitneyfrancis",
        profileImage:
          "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        firstName: "Leonard",
        lastName: "Krasner",
        username: "@leonardkrasner",
        profileImage:
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        firstName: "Floyd",
        lastName: "Miles",
        username: "@floydmiles",
        profileImage:
          "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      {
        firstName: "Emily",
        lastName: "Selman",
        username: "@emilyselman",
        profileImage:
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
    ];

    setTimeout(() => resolve(teamMembers), 500);
  });
}

export async function getActivities(): Promise<Activity[]> {
  return new Promise((resolve) => {
    const activities: Activity[] = [
      {
        firstName: "Dries",
        lastName: "Vincent",
        action: "COMMENT",
        ts: 1717514696008,
      },
      {
        firstName: "Whitney",
        lastName: "Francis",
        action: "COMMENT",
        ts: 1717427841000,
      },
      {
        firstName: "Floyd",
        lastName: "Miles",
        action: "ACTIVATE",
        ts: 1717340641000,
      },
      {
        firstName: "Emily",
        lastName: "Selman",
        action: "STOP",
        ts: 1717253241000,
      },
    ];

    setTimeout(() => resolve(activities), 500);
  });
}
