import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  MapPin,
  Users,
  Video,
  Globe,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import Image from "next/image";

const EventCard = ({
  event = {},
  onEdit = () => {},
  onDelete = () => {},
  onViewAttendees = () => {},
}) => {
  const {
    imageUrl = "",
    title = "Untitled Event",
    description = "",
    date = "",
    time = "",
    isVirtual = "",
    attendeesEmail = [],
    totalSlots = 0,
    id,
    eventId,
  } = event;

  // Format date to be more readable
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-700">
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={200}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-gray-900/80 px-3 py-1 rounded-full">
            {isVirtual === "virtual" ? (
              <div className="flex items-center gap-1 text-cyan-400">
                <Video className="w-4 h-4" />
                <span className="text-xs font-medium">Virtual</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-green-400">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium">In-Person</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Title and Description Section */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <div className="flex items-center text-gray-400 mb-2">
            <FileText className="w-4 h-4 mr-2" />
            <p className="text-sm line-clamp-2">{description}</p>
          </div>
        </div>

        {/* Date and Time Section */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{time}</span>
          </div>
        </div>

        {/* Attendees Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{attendeesEmail.length} joined</span>
            </div>
            <span>{totalSlots} total slots</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(attendeesEmail.length / totalSlots) * 100}%`,
                backgroundColor: "oklch(0.21 0.034 264.665)",
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewAttendees(event)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Attendees
          </button>
          <button
            onClick={() => onEdit(event)}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-xl transition-colors"
            title="Edit Event"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-colors"
            title="Delete Event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
