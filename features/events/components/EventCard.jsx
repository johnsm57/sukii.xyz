"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext"; // Adjust import path as needed
// Alternative: import { useAuth } from "@/hooks/useAuth";

const EventCard = ({
  eventId, // Add eventId prop for backend identification
  isVirtual = false,
  title = "Event Title",
  description = "Event description goes here...",
  time = "10:00 AM",
  date = "Dec 15, 2024",
  imageUrl = "/modern-event-venue.png",
  onActionClick = () => {},
  className = "",
}) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user from Firebase Auth context
  const { user } = useAuthContext();

  const handleJoinClick = async () => {
    // Prevent multiple clicks or if already joined
    if (isJoined || isLoading) return;

    // Check if user is authenticated
    if (!user?.email) {
      setError("Please sign in to join events");
      return;
    }

    // Check if eventId is provided
    if (!eventId) {
      setError("Event ID is missing");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/event-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          eventId: eventId,
          userDisplayName: user.displayName || null,
          userId: user.uid,
        }),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to join event`
        );
      }

      const data = await response.json();

      // Success handling
      setIsJoined(true);
      onActionClick(data); // Pass response data to parent component

      // Optional: Show success toast/notification
      console.log("Successfully joined event:", data);
    } catch (error) {
      console.error("Error joining event:", error);
      setError(error.message || "Failed to join event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative w-full max-w-sm mx-auto",
        "bg-slate-900/80 backdrop-blur-xl border border-white/30",
        "rounded-2xl overflow-hidden shadow-2xl",
        "hover:bg-slate-900/90 hover:border-white/40 hover:shadow-purple-500/30",
        "hover:-translate-y-2 hover:shadow-2xl",
        "transition-all duration-500 ease-out",
        className
      )}
    >
      {/* Event Type Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold",
            "backdrop-blur-md border transition-all duration-300",
            "group-hover:translate-x-1 group-hover:scale-105",
            isVirtual
              ? "bg-emerald-600/90 border-emerald-500/70 text-white"
              : "bg-blue-600/90 border-blue-500/70 text-white"
          )}
        >
          {isVirtual ? "Virtual Event" : "In-Person"}
        </div>
      </div>

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Date and Time */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-white transition-all duration-300 group-hover:translate-x-1">
            <svg
              className="w-4 h-4 text-purple-300 group-hover:rotate-12 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-white transition-all duration-300 group-hover:translate-x-1">
            <svg
              className="w-4 h-4 text-indigo-300 group-hover:rotate-12 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{time}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white text-pretty leading-tight group-hover:text-purple-100 transition-all duration-300 drop-shadow-sm group-hover:translate-x-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/95 text-sm leading-relaxed text-pretty line-clamp-3 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
          {description}
        </p>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Join Button */}
        <button
          onClick={handleJoinClick}
          disabled={isJoined || isLoading || !user?.email}
          className={cn(
            "w-full mt-4 py-3 px-6 rounded-xl",
            "border shadow-lg",
            "text-white font-semibold text-sm",
            "transition-all duration-300 ease-out",
            "group/join relative overflow-hidden",
            isJoined
              ? "bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-400/30 shadow-emerald-500/20"
              : isLoading
              ? "bg-gradient-to-r from-purple-500/70 to-indigo-500/70 border-purple-400/20 shadow-purple-500/10"
              : !user?.email
              ? "bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400/30 shadow-gray-500/20 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-indigo-500 border-purple-400/30 shadow-purple-500/20 hover:from-purple-400 hover:to-indigo-400 hover:border-purple-300/50 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]",
            (isJoined || isLoading || !user?.email) && "cursor-not-allowed"
          )}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          )}

          <span className="flex items-center justify-center gap-2 relative z-10">
            {isLoading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Joining...
              </>
            ) : isJoined ? (
              <>
                <svg
                  className="w-4 h-4 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Joined Successfully!
              </>
            ) : !user?.email ? (
              "Sign In to Join"
            ) : (
              <>
                Join Event
                <svg
                  className="w-4 h-4 group-hover/join:translate-x-2 group-hover/join:-translate-y-0.5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </span>
        </button>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500/0 via-indigo-500/0 to-transparent group-hover:from-purple-500/15 group-hover:via-indigo-500/8 transition-all duration-500 pointer-events-none" />
    </div>
  );
};

export default EventCard;
