// components/AttendeesModal.js
import React from "react";
import { Users } from "lucide-react";
import Modal from "./Modal";

const AttendeesModal = ({ isOpen, onClose, event }) => {
  console.log("Event: ", event);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? `${event.title} - Attendees` : "Attendees"}
    >
      {event && (
        <div>
          <div className="flex items-center gap-2 mb-4 text-gray-600">
            <Users size={20} />
            <span>
              {event.totalAttendees || event.attendeesEmail?.length || 0}{" "}
              attendees
            </span>
          </div>
          {event.attendeesEmail && event.attendeesEmail.length > 0 ? (
            <div className="space-y-3">
              {event.attendeesEmail.map((attendee) => (
                <div
                  key={attendee._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {attendee.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-900">
                    Email: {attendee.email}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No attendees registered for this event yet.</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default AttendeesModal;
