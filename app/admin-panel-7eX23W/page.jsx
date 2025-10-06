import React from "react";
import EventDashboard from "@/features/admin-dashboard/dashboard/Dashboard";
import { ProtectedRoute } from "@/features/authentication";
export default function adminPanel() {
  return (
    <ProtectedRoute>
      <EventDashboard />
    </ProtectedRoute>
  );
}
