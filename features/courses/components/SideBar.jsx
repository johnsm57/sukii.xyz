"use client";
import {
  ChevronRight,
  LogOut,
  Computer,
  Code,
  Cloud,
  Mic,
  Blocks,
  Menu,
  X,
} from "lucide-react";
import Logo from "@/public/logos/orbital-logo-full.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/authentication";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth(); // Get logout function from context

  const navLinks = [
    { name: "CCSA", icon: Computer, href: "/courses/categories/CCSA" },
    { name: "PASI", icon: Code, href: "/courses/categories/PASI" },
    { name: "CASI", icon: Cloud, href: "/courses/categories/CASI" },
    { name: "BASI", icon: Blocks, href: "/courses/categories/BASI" },
    { name: "Podcasts", icon: Mic, href: "/courses/categories/podcasts" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header - Hidden on lg screens and above */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#0f1221] z-50 px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-[#0f1221] rounded-full flex items-center justify-center">
              <Image className="w-5 h-5" src={Logo} alt="Logo" />
            </div>
          </div>
          <span className="text-white font-semibold text-lg">Orbital</span>
        </div>

        <button
          onClick={toggleMenu}
          className="p-2 text-white hover:bg-slate-800 rounded-lg transition-colors duration-200"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 right-0 w-80 h-screen bg-[#0f1221] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-[#0f1221] rounded-full flex items-center justify-center">
                  <Image className="w-6 h-6" src={Logo} alt="Logo" />
                </div>
              </div>
              <span className="text-white font-semibold text-xl">Orbital</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 text-white hover:bg-slate-800 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 space-y-3">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="hover:bg-slate-800 transition-colors duration-200 rounded-lg p-4 flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-gray-400" />
                    <span className="text-white font-medium text-lg">
                      {link.name}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              );
            })}
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="mt-8">
            <div className="hover:bg-slate-800 transition-colors duration-200 rounded-lg p-3 flex items-center space-x-3 cursor-pointer">
              <LogOut className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-medium">Log out</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      <div className="hidden lg:flex fixed left-0 top-0 w-80 h-screen bg-[#0f1221] flex-col p-6 z-50">
        {/* Logo Section */}
        <div className="flex justify-center mb-12">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-[#0f1221] rounded-full flex items-center justify-center">
              <div className="text-white text-xl font-bold">
                <Image className="w-8 h-8" src={Logo} alt="Logo" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 space-y-4">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="hover:bg-slate-800 transition-colors duration-200 rounded-lg p-4 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 text-gray-400" />
                  <span className="text-white font-medium text-lg">
                    {link.name}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            );
          })}

          {/* Donate Button 
          <div className="mt-8">
            <button className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-200 rounded-lg p-4 text-white font-medium text-lg">
              Donate
            </button>
          </div> */}
        </div>

        {/* Bottom Navigation */}
        <div className="space-y-2 mt-8">
          {/* Log out */}
          <div
            className="hover:bg-slate-800 transition-colors duration-200 rounded-lg p-3 flex items-center space-x-3 cursor-pointer"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 font-medium">Log out</span>
          </div>
        </div>
      </div>

      {/* Spacer for mobile header - only on small screens */}
      <div className="lg:hidden h-16" />
    </>
  );
}
