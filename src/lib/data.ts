import { User, Cars, Report, TeamMember, Activity } from "@/lib/definitions";
import { fetchWithAuth } from "@/pages/api/refreshToken/refreshAccessToken";
import { cookies } from "next/headers";

export async function getUser(): Promise<User | null> {
  try {
    const id = cookies().get("id")?.value;
    const accessToken = cookies().get("accessToken")?.value;
    const refreshToken = cookies().get("refreshToken")?.value;

    if (!id || !accessToken || !refreshToken) {
      return null;
    }

    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`,
      {
        method: "GET",
      },
      { accessToken, refreshToken }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }
      throw new Error("Failed to fetch user data");
    }

    const user = await response.json();
    return user.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function getCars(
  filters: Record<string, string[]> = {}
): Promise<Cars | null> {
  try {
    const accessToken = cookies().get("accessToken")?.value;
    const refreshToken = cookies().get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
      throw new Error("Unauthorized. Please log in again.");
    }
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, values]) => {
      if (values.length) {
        queryParams.append(key, values.join(","));
      }
    });

    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cars/?${queryParams.toString()}`,
      {
        method: "GET",
      },
      { accessToken, refreshToken }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch car data");
    }

    const cars = await response.json();
    return cars;
  } catch (error) {
    console.error("Error fetching car data:", error);
    throw error;
  }
}

export async function getActivities(): Promise<Activity | null> {
  try {
    const id = cookies().get("id")?.value;
    const accessToken = cookies().get("accessToken")?.value;
    const refreshToken = cookies().get("refreshToken")?.value;

    if (!id || !accessToken || !refreshToken) {
      return null;
    }

    // Decode the JWT token to check the user's role
    const decodedToken: any = JSON.parse(atob(accessToken.split(".")[1]));
    if (decodedToken.role === "CUSTOMER") {
      return null;
    }

    const response = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/activities/`,
      { method: "GET" },
      { accessToken, refreshToken }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch activities data");
    }

    const activity = await response.json();
    return activity.data;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return null;
  }
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
