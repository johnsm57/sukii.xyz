import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/shared/config/database";
import { Event } from "@/models/createEvent";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { eventId } = await params;

    // Fetch ONE event and populate its emails
    const event = await Event.findById(eventId)
      .populate("attendeesEmail", "email") // Get actual email addresses
      .lean();

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // Return only the attendees array
    return NextResponse.json(
      {
        success: true,
        data: {
          eventId: event._id,
          title: event.title,
          attendees: event.attendeesEmail, // Array of { _id, email }
          totalAttendees: event.attendeesEmail.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Attendees Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch attendees" },
      { status: 500 }
    );
  }
}
