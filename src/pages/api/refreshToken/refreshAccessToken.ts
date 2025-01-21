export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  cookies: { accessToken: string; refreshToken: string }
) => {
  const { accessToken, refreshToken } = cookies;

  if (!accessToken || !refreshToken) {
    throw new Error("Tokens not found. Please log in.");
  }

  const makeRequest = async (token: string) => {
    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, requestOptions);

    if (response.ok) return response;

    if (response.status === 401) {
      // If unauthorized, attempt to refresh token
      const newAccessToken = await refreshAccessToken(refreshToken);
      return makeRequest(newAccessToken); // Retry with the new token
    }

    throw response;
  };

  return makeRequest(accessToken);
};

const refreshAccessToken = async (refreshToken: string) => {
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

    if (response.ok) {
      const data = await response.json();
      return data.data.token.token;
    }

    throw new Error("Failed to refresh access token.");
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};
