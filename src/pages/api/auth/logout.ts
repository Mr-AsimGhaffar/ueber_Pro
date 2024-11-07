import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Clear the auth cookie by setting it to max age 0
    const cookie = serialize("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire the cookie immediately
      path: "/",
    });
    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ message: "Successfully logged out" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
