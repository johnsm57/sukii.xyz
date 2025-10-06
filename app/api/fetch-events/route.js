import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/shared/config/database";
import { Event } from "@/models/createEvent"; // Adjust path as needed

export async function GET() {
  try {
    await connectDB();

    // Fetch all events, exclude sensitive fields if any
    const events = await Event.find({}, "-__v").lean();

    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error) {
    // Log error for debugging (avoid leaking sensitive info to client)
    console.error("Fetch Events Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
