import { NextRequest, NextResponse } from "next/server";
import { EventEmailSignup } from "@/models/createEvent";
import connectDB from "@/shared/config/database";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }
    const Email = new EventEmailSignup({ email });
    const savedEmail = await Email.save();
    console.log("Email is Saved!!", savedEmail);
    return NextResponse.json(
      { message: "Email saved successfully", data: savedEmail },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Email is required" }, { status: 500 });
  }
}
