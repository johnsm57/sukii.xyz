"use client";
import SideBar from "@/features/courses/components/SideBar";
import { Check } from "lucide-react";
import Image from "next/image";
import RocketIcon from "@/public/courses-feature-images/rocket 2.png";
import Button from "@/components/Button";
import { ProtectedRoute } from "@/features/authentication";
import { useRouter } from "next/navigation";

const coursesData = [
  {
    id: 1,
    badge: "3 Section",
    title: "CASI - Certified Advanced Security Implementor",
    modules: "15 Modules",
    features: ["Strengthen network security.", "Mitigate security risks."],
    navLink: "/courses/categories/CASI",
  },
  {
    id: 2,
    badge: "3 Section",
    title: "BASI - Blockchain Solutions Architect",
    modules: "5 Modules",
    features: ["Design secure networks.", "Build decentralized systems."],
    navLink: "/courses/categories/BASI",
  },
  {
    id: 3,
    badge: "3 Section",
    title: "CCSA - Certified Computer Systems Analyst",
    modules: "5 Modules",
    features: ["Improve business efficiency", "Optimize IT infrastructure"],
    navLink: "/courses/categories/CCSA",
  },
  {
    id: 4,
    badge: "3 Section",
    title: "PASI - Project Application & Solution Integration",
    modules: "4 Modules",
    features: [
      "Ensure successful project deployments.",
      "Manage project lifecycles.",
    ],
    navLink: "/courses/categories/PASI",
  },
];

function CourseCard({ course }) {
  const router = useRouter();
  const handleNavigation = () => {
    router.push(course.navLink);
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 flex flex-col h-full">
      {/* Badge */}
      <div className="mb-4 sm:mb-6">
        <span className="bg-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
          {course.badge}
        </span>
      </div>

      {/* Title with Rocket Icon */}
      <div className="flex items-start gap-3 mb-4 sm:mb-6">
        <div className="flex-shrink-0 mt-1">
          {/* Rocket Icon */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center">
            <Image
              src={RocketIcon}
              alt="Rocket Icon"
              className="w-full h-full"
            />
          </div>
        </div>
        <h3 className="text-white text-lg sm:text-xl font-semibold leading-tight">
          {course.title}
        </h3>
      </div>

      {/* Modules */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
        <span className="text-white font-medium text-sm sm:text-base">
          {course.modules}
        </span>
      </div>

      {/* Features */}
      <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
        {course.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Start Course Button */}
      <Button
        name="Start Course"
        className="w-full sm:w-auto sm:flex sm:flex-start sm:w-2xs"
        onClick={handleNavigation}
      />
    </div>
  );
}

function Courses() {
  return (
    <ProtectedRoute redirectTo="/register?page=courses">
      <div className="flex min-h-screen bg-gray-900">
        <SideBar />

        {/* Main content area - responsive spacing */}
        <main className="flex-1 lg:ml-80 pt-16 lg:pt-0">
          <div className="h-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-12">
            {/* Header section */}
            <div className="flex justify-center items-center flex-col mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 text-center">
                Courses
              </h1>
              <p className="text-gray-400 text-sm sm:text-base text-center">
                Choose from our certification programs
              </p>
            </div>

            {/* Courses Grid - fully responsive */}
            <div className="w-full max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-6 xl:gap-8">
                {coursesData.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            {/* Bottom spacing for mobile */}
            <div className="h-8 lg:h-0" />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default Courses;
