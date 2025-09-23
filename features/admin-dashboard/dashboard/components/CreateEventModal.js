// components/CreateEventModal.js
import React, { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Modal from "./Modal";
import FormInput from "./FormInput";
import Image from "next/image";

const CreateEventModal = ({
  isOpen,
  onClose,
  currentEvent,
  setCurrentEvent,
  onSave,
}) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      try {
        console.log("Uploading file:", file.name); // Debug log
        const res = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        console.log("Upload response:", data); // Debug log

        if (res.ok && data.url) {
          setCurrentEvent({ ...currentEvent, imgUrl: data.url });
        } else {
          console.error("Upload failed:", data.message);
          alert(data.message || "Image upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        alert("Image upload error: " + err.message);
      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = () => {
    setCurrentEvent({ ...currentEvent, imgUrl: null });
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Event">
      <div className="space-y-6">
        <FormInput
          label="Event Title"
          value={currentEvent.title}
          onChange={(e) =>
            setCurrentEvent({ ...currentEvent, title: e.target.value })
          }
          placeholder="Enter event title"
          required
        />

        <FormInput
          label="Event Name"
          value={currentEvent.name}
          onChange={(e) =>
            setCurrentEvent({ ...currentEvent, name: e.target.value })
          }
          placeholder="Enter event name"
          required
        />

        <FormInput
          label="Description"
          type="textarea"
          value={currentEvent.description}
          onChange={(e) =>
            setCurrentEvent({ ...currentEvent, description: e.target.value })
          }
          placeholder="Describe your event"
          rows={4}
          required
        />

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Event Medium
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="physical"
                checked={currentEvent.medium === "physical"}
                onChange={(e) =>
                  setCurrentEvent({ ...currentEvent, medium: e.target.value })
                }
                className="mr-2 text-blue-500"
              />
              <span className="text-gray-300">Physical</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="virtual"
                checked={currentEvent.medium === "virtual"}
                onChange={(e) =>
                  setCurrentEvent({ ...currentEvent, medium: e.target.value })
                }
                className="mr-2 text-blue-500"
              />
              <span className="text-gray-300">Virtual</span>
            </label>
          </div>
        </div>

        <FormInput
          label="Date"
          type="date"
          value={currentEvent.date || ""}
          onChange={(e) =>
            setCurrentEvent({ ...currentEvent, date: e.target.value })
          }
          required
        />

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Event Thumbnail
          </label>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-600 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? "Uploading..." : "Upload Image"}
            </button>

            {/* Fixed: Changed from currentEvent.thumbnail to currentEvent.imgUrl */}
            {currentEvent.imgUrl && (
              <div className="relative">
                <Image
                  src={currentEvent.imgUrl}
                  alt="Event Thumbnail"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          {uploading && (
            <p className="text-sm text-blue-400 mt-2">
              Uploading image to ImageKit...
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex-1 px-6 py-3 border border-gray-600 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={uploading}
            className="flex-1 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "oklch(0.21 0.034 264.665)" }}
          >
            Create Event
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateEventModal;
