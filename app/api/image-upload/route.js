// app/api/image-upload/route.js
import imagekit from "@/shared/utils/imagekit"; // Fixed: Changed from @/shared/lib/imagekit to @/lib/imagekit
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit
    const result = await imagekit.upload({
      file: buffer,
      fileName: file.name || "event-thumbnail",
      folder: "/event-thumbnails",
      useUniqueFileName: true,
    });

    console.log("ImageKit upload successful:", result.name); // Added success log

    // Return the response your component expects
    return NextResponse.json({
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      filePath: result.filePath,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
