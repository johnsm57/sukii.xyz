import mongoose from "mongoose";

const eventEmailSignupSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

export const EventEmailSignup =
  mongoose.model.EventEmailSignup ||
  mongoose.model("EventEmailSignup", eventEmailSignupSchema);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    imgUrl: { type: String, required: true },
    totalSlots: { type: Number, default: 50 },
    attendeesEmail: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EventEmailSignup",
      },
    ],
    eventMedium: {
      type: String,
      enum: ["virtual", "physical"],
      default: "virtual",
    },
  },
  { timestamps: true }
);

export const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);
