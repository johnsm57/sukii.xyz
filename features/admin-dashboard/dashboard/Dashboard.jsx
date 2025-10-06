"use client";

// EventDashboard.js
import React, { useEffect, useState } from "react";
import { Plus, Calendar, Users, MapPin } from "lucide-react";
import StatsCard from "./components/StatsCard";
import EventCard from "./components/EventCard";
import CreateEventModal from "./components/CreateEventModal";
import AttendeesModal from "./components/AttendeesModal";
import axios from "axios";

const EventDashboard = () => {
  const [events, setEvents] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    title: "",
    name: "",
    description: "",
    date: "",
    time: "",
    medium: "virtual",
    imgUrl: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCurrentEvent({
      title: "",
      name: "",
      date: "",
      time: "",
      description: "",
      medium: "virtual",
      imgUrl: null,
    });
  };

  const handleCreateEvent = async () => {
    // Add detailed validation logging
    if (
      !currentEvent.title ||
      !currentEvent.description ||
      !currentEvent.date ||
      !currentEvent.time ||
      !currentEvent.description ||
      !currentEvent.imgUrl ||
      !currentEvent.medium
    ) {
      const missing = [];
      if (!currentEvent.title) missing.push("title");
      if (!currentEvent.description) missing.push("description");
      if (!currentEvent.date) missing.push("date");
      if (!currentEvent.time) missing.push("time");
      if (!currentEvent.imgUrl) missing.push("image");
      if (!currentEvent.medium) missing.push("medium");

      setError(`Please fill in all required fields: ${missing.join(", ")}`);
      console.log("Current event state:", currentEvent); // Debug log
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/create-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentEvent.title,
          description: currentEvent.description,
          date: currentEvent.date,
          time: currentEvent.time,
          imgUrl: currentEvent.imgUrl,
          eventMedium: currentEvent.medium,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      console.log("Event created:", data);

      // Ensure the created event has the required properties
      const newEvent = {
        ...data.event,
        joinedPeople: data.event.joinedPeople || [],
        totalSlots: data.event.totalSlots || 50, // Default to 50 if not provided
      };

      setEvents([...events, newEvent]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error("Create event error:", error);
      setError(`Failed to create event: ${(error.message, error.toString())}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event._id !== eventId));
  };

  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openAttendeesModal = async (event) => {
    setSelectedEvent(event);
    setShowAttendeesModal(true);

    try {
      //Fetch fresh attendee data for this specific event
      const response = await axios.get(
        `/api/fetch-event-signups/${event._id}/attendees`
      );
      const attendeesData = response.data?.data;
      console.log("Attendees Data:", attendeesData);
      // Update selected event with fresh data
      setSelectedEvent({
        ...event,
        attendeesEmail: attendeesData?.attendees,
      });
    } catch (error) {
      console.error("Error fetching attendees:", error);
    }
  };

  const totalEvents = events.length;

  // Fixed: Add null checks and default values
  const totalAttendees = Array.isArray(events)
    ? events.reduce(
        (total, event) => total + (event?.joinedPeople?.length || 0),
        0
      )
    : 0;
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/fetch-events");
        const eventsArray = response.data?.data || [];
        setEvents(eventsArray);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Event Dashboard</h1>
              <p className="text-gray-300 mt-1">
                Manage your events and track attendees
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
              style={{ backgroundColor: "oklch(0.21 0.034 264.665)" }}
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Events"
            value={totalEvents}
            icon={Calendar}
            iconColor="text-blue-400"
          />
          <StatsCard
            title="Total Attendees"
            value={totalAttendees}
            icon={Users}
            iconColor="text-green-400"
          />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              eventId={event._id} // Pass eventId separately
              event={event}
              onDelete={() => handleDeleteEvent(event._id)}
              onViewAttendees={() => openAttendeesModal(event)}
            />
          ))}

          {events.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No events yet
              </h3>
              <p className="text-gray-400 mb-6">
                Create your first event to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "oklch(0.21 0.034 264.665)" }}
              >
                Create Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        onSave={handleCreateEvent}
        error={error}
        loading={loading}
      />
      <AttendeesModal
        isOpen={showAttendeesModal}
        onClose={() => {
          setShowAttendeesModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </div>
  );
};

export default EventDashboard;
