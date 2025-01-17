import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";

interface RequestInitWithDuplex extends RequestInit {
  duplex?: "half";
}

export const config = {
  api: {
    bodyParser: false, // Disables default body parser for file uploads
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = formidable({
      multiples: false, // Disable multiple file uploads
      keepExtensions: true, // Keep file extensions
      maxFileSize: 10 * 1024 * 1024,
    });

    try {
      // Parse the form data
      const [fields, files] = await form.parse(req);

      console.log("Form fields:", fields);
      console.log("Form files:", files);

      const fileEntry = files.profilePictureId;

      if (!fileEntry) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = Array.isArray(fileEntry) ? fileEntry[0] : fileEntry;

      try {
        const fileContent = fs.readFileSync(file.filepath);
        console.log(
          "File content read successfully:",
          fileContent.length,
          "bytes"
        );
      } catch (error) {
        console.error("Error reading file:", error);
        return res.status(500).json({ message: "Failed to read file" });
      }

      const acceptedFormats = ["image/jpeg", "image/png", "application/pdf"];
      if (!file.mimetype || !acceptedFormats.includes(file.mimetype)) {
        return res.status(400).json({
          message: "Invalid file format. Only JPG, PNG, and PDF are allowed.",
        });
      }

      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        throw new Error("Token not found. Please log in.");
      }
      // Construct FormData
      const formData = new FormData();
      formData.append("file", file);
      // Use the file size from the parsed file object
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        ...formData.getHeaders(),
      };
      console.log("FormData headers:", formData.getHeaders());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/files`,
        {
          method: "POST",
          headers,
          body: formData as any,
          //   duplex: "half",
        } as RequestInitWithDuplex
      );
      if (response.ok) {
        const apiResponse = await response.json();
        console.log("External API response:", apiResponse);
        return res.status(200).json({
          data: apiResponse.data,
          message: "File uploaded successfully",
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({
          message: errorData.message || "Failed to upload file",
        });
      }
    } catch (error) {
      console.error("File upload error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
