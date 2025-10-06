import { NextRequest, NextResponse } from "next/server";
import { EventEmailSignup, Event } from "@/models/createEvent";
import connectDB from "@/shared/config/database";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, eventId } = body; // ← Add eventId to request

    // Validation
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    if (!eventId) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const existingSignup = await EventEmailSignup.findOne({ email });
    if (existingSignup && event.attendeesEmail.includes(existingSignup._id)) {
      return NextResponse.json(
        { message: "You have already joined this event" },
        { status: 400 }
      );
    }

    // Create email signup (or reuse existing one)
    let emailSignup;
    if (existingSignup) {
      emailSignup = existingSignup; // Reuse existing email document
    } else {
      emailSignup = new EventEmailSignup({ email });
      await emailSignup.save();
    }
    event.attendeesEmail.push(emailSignup._id);
    await event.save();

    return NextResponse.json(
      {
        success: true,
        message: "Successfully registered for event",
        data: {
          email: emailSignup.email,
          eventId: event._id,
          eventTitle: event.title,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Failed to register for event", error: error.message },
      { status: 500 }
    );
  }
}
