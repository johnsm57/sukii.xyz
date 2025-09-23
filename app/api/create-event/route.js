import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/shared/config/database";
import { Event } from "@/models/createEvent";
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log("Request Body:", body); // Debugging line
    const { title, description, date, imgUrl, eventMedium, attendeesEmail } =
      body;

    if (!title || !description || !date || !imgUrl || !eventMedium) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    const newEvent = new Event({
      title,
      description,
      date,
      attendeesEmail,
      imgUrl,
      eventMedium,
    });
    const savedEvent = await newEvent.save();
    return NextResponse.json(
      { message: "Event created successfully", event: savedEvent },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error connecting to database", error: error.message },
      { status: 500 }
    );
  }
}
