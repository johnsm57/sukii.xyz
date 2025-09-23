"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import EventCard from "./components/EventCard";
import { useAuthContext } from "@/contexts/AuthContext"; // Adjust import path as needed

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const { user } = useAuthContext();

  // Fetch events from backend
  const fetchEvents = async (isRetry = false) => {
    try {
      setLoading(true);
      if (!isRetry) {
        setError(null);
      }

      // Get Firebase ID token if user is authenticated
      const headers = {
        "Content-Type": "application/json",
      };

      if (user) {
        try {
          const idToken = await user.getIdToken();
          headers["Authorization"] = `Bearer ${idToken}`;
        } catch (tokenError) {
          console.warn("Failed to get ID token:", tokenError);
          // Continue without token for public events
        }
      }

      const response = await fetch("/api/events", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch events`);
      }

      const data = await response.json();

      // Validate response structure
      if (!Array.isArray(data.events)) {
        throw new Error("Invalid response format: events should be an array");
      }

      setEvents(data.events);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message || "Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchEvents();
  }, [user]); // Refetch when user authentication changes

  // Handle retry
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchEvents(true);
  };

  // Handle successful event join
  const handleEventJoin = (eventId, responseData) => {
    // Update the events state to reflect the join status
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, isJoined: true, joinedAt: new Date().toISOString() }
          : event
      )
    );

    // Optional: Show success notification
    console.log(`Successfully joined event ${eventId}:`, responseData);
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-500/50 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <p className="text-white/80 text-lg mt-6 animate-pulse">
        Loading amazing events...
      </p>
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="flex flex-col items-center justify-center py-16 max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-white/70 text-center mb-6 text-balance">{error}</p>

      <button
        onClick={handleRetry}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {retryCount > 0 ? `Retry (${retryCount})` : "Try Again"}
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 max-w-md mx-auto">
      <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-indigo-400"
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
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
      <p className="text-white/70 text-center text-balance">
        There are no events available at the moment. Check back later for
        exciting new events!
      </p>

      <button
        onClick={() => fetchEvents()}
        className="mt-6 px-6 py-3 border border-white/30 hover:border-white/50 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white/10"
      >
        Refresh
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <Header />

        {/* Main Content */}
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance drop-shadow-lg">
                Discover Amazing Events
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto text-balance drop-shadow-sm">
                Connect, learn, and grow with our curated selection of premium
                events
              </p>

              {/* Event count indicator */}
              {!loading && !error && events.length > 0 && (
                <div className="mt-6">
                  <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-medium">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    {events.length} {events.length === 1 ? "Event" : "Events"}{" "}
                    Available
                  </span>
                </div>
              )}
            </div>

            {/* Content based on state */}
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage />
            ) : events.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    eventId={event.id}
                    isVirtual={event.isVirtual || false}
                    title={event.title || "Event Title"}
                    description={
                      event.description || "Event description goes here..."
                    }
                    time={event.time || "10:00 AM"}
                    date={event.date || "Dec 15, 2024"}
                    imageUrl={
                      event.imageUrl || event.image || "/modern-event-venue.png"
                    }
                    isJoined={event.isJoined || false}
                    onActionClick={(responseData) =>
                      handleEventJoin(event.id, responseData)
                    }
                    className={
                      event.featured ? "ring-2 ring-purple-400/50" : ""
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
