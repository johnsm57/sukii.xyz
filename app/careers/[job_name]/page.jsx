import React from "react";
import JobDetailsPage from "@/features/careers/pages/JobDetails";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProtectedRoute } from "@/features/authentication";

export default function JobDetails() {
  return (
    <div>
      <Header />
      <ProtectedRoute redirectTo="/register?page=careers">
        <JobDetailsPage />
      </ProtectedRoute>
      <Footer />
    </div>
  );
}
