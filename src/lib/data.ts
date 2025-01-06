import { User, Cars, Report, TeamMember, Activity } from "@/lib/definitions";
import { cookies } from "next/headers";
import Cookies from "js-cookie";

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  try {
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
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

const getAccessToken = async (): Promise<string | null> => {
  let accessToken = cookies().get("accessToken")?.value;

  // If the access token is expired, attempt to refresh it using the refresh token
  if (!accessToken) {
    const refreshToken = cookies().get("refreshToken")?.value;
    if (!refreshToken) {
      return null;
    }
    accessToken = await refreshAccessToken(refreshToken); // Refresh the access token
  }

  return accessToken;
};

// Wrapper function for the fetch API
export const fetchWithTokenRefresh = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let accessToken = await getAccessToken();

  // If there is no access token (i.e., the user is not logged in)
  if (accessToken === null) {
    // Return a 401 Unauthorized status directly, indicating the user is not logged in
    return new Response(null, { status: 401 });
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  const response = await fetch(url, options);

  if (response.status === 401) {
    accessToken = await getAccessToken();
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
    return fetch(url, options);
  }

  return response;
};

export async function getUser(): Promise<User | null> {
  try {
    const id = cookies().get("id")?.value;

    if (!id) {
      return null;
    }

    const response = await fetchWithTokenRefresh(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`,
      {
        method: "GET",
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
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function getCars(
  filters: Record<string, string[]> = {}
): Promise<Cars | null> {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, values]) => {
      if (values.length) {
        queryParams.append(key, values.join(","));
      }
    });

    const response = await fetchWithTokenRefresh(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/cars/?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );
    if (response.status === 401) {
      // Handle unauthenticated state, e.g., redirect to login
      // Example: redirectToLoginPage();
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const cars = await response.json();
    return cars;
  } catch (error) {
    console.error("Error fetching car data:", error);
    throw error;
  }
}

export async function getActivities(): Promise<Activity | null> {
  const id = cookies().get("id")?.value;

  if (!id) {
    return null;
  }

  const response = await fetchWithTokenRefresh(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/activities/`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized. Please log in again.");
    }
    throw new Error("Failed to fetch activities data");
  }

  const activity = await response.json();
  return activity.data;
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
