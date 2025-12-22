"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { useAuth } from "@/features/authentication";
import { getAllJobs } from "@/json-data/careersData";

const JobDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const allJobs = getAllJobs();

  useEffect(() => {
    const foundJob = allJobs.find((j) => j.job_name === params.job_name);

    if (foundJob) {
      setJob(foundJob);
    } else {
      router.push("/careers");
    }
  });


  const handleApplyNow = () => {
    setApplicationStatus("submitting");

    // Simulate application submission
    setTimeout(() => {
      setApplicationStatus("success");

      // Reset after 3 seconds
      setTimeout(() => {
        setApplicationStatus(null);
      }, 3000);
    }, 2000);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 via-purple-800 to-slate-800 border-b border-purple-700/30">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <button
            onClick={() => router.push("/careers")}
            className="text-purple-400 hover:text-purple-300 mb-6 inline-flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to All Jobs
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-purple-900/50 text-purple-300 text-sm font-semibold rounded-full mb-3 border border-purple-700/50">
                  {job.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {job.title}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-gray-300">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {job.location}
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {job.type}
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {job.salary}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About the Role */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                About the Role
              </h2>
              <p className="text-gray-300 leading-relaxed">{job.description}</p>
            </motion.section>

            {/* Responsibilities */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Key Responsibilities
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((resp, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <span className="text-purple-400 mt-1 flex-shrink-0">
                      ✓
                    </span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Requirements */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <span className="text-green-400 mt-1 flex-shrink-0">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Nice to Have */}
            {job.niceToHave && job.niceToHave.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  Nice to Have
                </h2>
                <ul className="space-y-3">
                  {job.niceToHave.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <span className="text-blue-400 mt-1 flex-shrink-0">
                        +
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  What We Offer
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <span className="text-yellow-400 mt-1 flex-shrink-0">
                        ★
                      </span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Apply for this position
              </h3>

              {user && (
                <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <p className="text-sm text-gray-400 mb-1">Applying as:</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              )}

              {applicationStatus === "success" ? (
                <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 text-green-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold">Application Submitted!</p>
                      <p className="text-sm text-green-300">
                        We'll review your application soon.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  name={
                    applicationStatus === "submitting"
                      ? "Submitting..."
                      : "Apply Now"
                  }
                  onClick={handleApplyNow}
                  className="w-full mb-4"
                  disabled={applicationStatus === "submitting"}
                />
              )}

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 text-gray-400">
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>We'll review your application within 5-7 business days</p>
                </div>
                <div className="flex items-start gap-3 text-gray-400">
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p>Your information is kept confidential</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-gray-400 text-sm mb-3">Share this job:</p>
                <div className="flex gap-2">
                  {/* facebook */}
                  <button className="flex-1 bg-slate-900 hover:bg-slate-700 text-gray-300 py-2 rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  {/* twitter */}
                  <button className="flex-1 bg-slate-900 hover:bg-slate-700 text-gray-300 py-2 rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  {/* linkedin */}
                  <button className="flex-1 bg-slate-900 hover:bg-slate-700 text-gray-300 py-2 rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
