"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/Button";
import { getAllJobs, getCategories } from "@/json-data/careersData";

const CareersPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const allJobs = getAllJobs();
  const allCategories = getCategories();

  const filteredCareers =
    selectedCategory === "all"
      ? allJobs
      : allJobs.filter((job) => job.category === selectedCategory);

  const handleApply = (job_name) => {
    router.push("/careers/" + job_name);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-800 via-purple-800 to-slate-800 text-white py-20 px-6 border-b border-purple-700/30">
          <div className="max-w-7xl mx-auto">
            <motion.h1
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Join Our Team
            </motion.h1>
            <motion.p
              className="text-xl text-purple-200 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We're looking for talented individuals who are passionate about
              making a difference. Explore opportunities to grow your career
              with us.
            </motion.p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-3 mb-8">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                    : "bg-slate-800 text-gray-300 hover:bg-slate-400/20 hover:border-purple-600 border border-slate-700"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((job, index) => (
              <motion.div
                key={job.id}
                className="bg-slate-800 rounded-xl shadow-lg hover:shadow-purple-800 hover:border-purple-600 transition-all duration-300 overflow-hidden border border-slate-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-purple-900/50 text-purple-300 text-xs font-semibold rounded-full mb-3 border border-purple-700/50">
                      {job.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                      <span className="flex items-center">
                        📍 {job.location}
                      </span>
                      <span className="flex items-center">⏰ {job.type}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {job.description}
                  </p>

                  {/* Responsibilities */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-300 mb-2">
                      Key Responsibilities:
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {job.responsibilities.slice(0, 3).map((resp, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-gray-300 mr-2">•</span>
                          <span className="line-clamp-1">{resp}</span>
                        </li>
                      ))}
                      {job.responsibilities.length > 3 && (
                        <li className="ext-gray-300 text-xs font-medium">
                          +{job.responsibilities.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Requirements */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-300 mb-2">
                      Requirements:
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {job.requirements.slice(0, 2).map((req, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green mr-2">✓</span>
                          <span className="line-clamp-1">{req}</span>
                        </li>
                      ))}
                      {job.requirements.length > 2 && (
                        <li className="text-purple-400 text-xs font-medium">
                          +{job.requirements.length - 2} more...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Apply Button */}
                  <Button
                    name="Apply Now"
                    onClick={() => handleApply(job.job_name)}
                    className="w-full"
                  ></Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCareers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No positions available in this category.
              </p>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="bg-black flex items-center justify-center py-16 px-6 mt-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Don't see the right role?
            </h2>
            <p className="text-gray-300 mb-6">
              We're always looking for talented people. Send us your resume and
              we'll keep you in mind for future opportunities.
            </p>
            <div className="flex justify-center">
              <Button
                name="Submit General Application"
                onClick={() => router.push("/submit-application")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CareersPage;
