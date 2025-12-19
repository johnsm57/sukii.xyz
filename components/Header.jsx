"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Globe, User2Icon, LogOutIcon } from "lucide-react";
import orbitalLogo from "@/public/logos/orbital-logo-full.svg";
import { useAuth } from "@/features/authentication";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTranslateLoaded, setIsTranslateLoaded] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About Us", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Testing", href: "/testing" },
    { name: "Careers", href: "/careers" },
  ];

  // Aggressive banner removal function - targets specific iframe
  const removeBanner = () => {
    // Remove the specific banner iframe and all possible banner elements
    const bannerSelectors = [
      'iframe[id=":2.container"]', // Specific iframe causing the banner
      'iframe[id*=".container"]', // Any similar iframe patterns
      ".goog-te-banner-frame",
      ".goog-te-banner-frame.skiptranslate",
      'iframe[id^="goog-te-banner-frame"]',
      ".goog-te-banner",
      "#goog-te-banner",
      ".goog-te-banner-content",
      '[class*="goog-te-banner"]',
      'div[style*="position: fixed"][style*="top: 0"]',
      ".goog-te-ftab", // Remove floating widget
      'iframe[src*="translate.google.com/translate_nmt"]', // Remove translation iframes
    ];

    bannerSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        console.log("Removing banner element:", el);
        el.remove();
      });
    });

    // Reset body positioning forcefully
    document.body.style.top = "0px";
    document.body.style.position = "static";
    document.body.style.marginTop = "0px";
    document.body.style.paddingTop = "0px";
    document.documentElement.style.marginTop = "0px";

    // Remove all Google translate classes from body
    document.body.classList.remove("goog-te-banner-body");
    document.body.className = document.body.className
      .replace(/goog-te-[^\s]*/g, "")
      .trim();
  };

  // Initialize Google Translate
  useEffect(() => {
    // Define the initialization function globally
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,th",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
          gaTrack: false, // Disable Google Analytics tracking
          gaId: null, // No Google Analytics ID
        },
        "google_translate_element"
      );

      // Duplicate for mobile
      setTimeout(() => {
        if (document.getElementById("google_translate_element_mobile")) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,th",
              layout:
                window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true,
              gaTrack: false,
              gaId: null,
            },
            "google_translate_element_mobile"
          );
        }
      }, 100);

      setIsTranslateLoaded(true);

      // Immediate and aggressive banner removal
      setTimeout(removeBanner, 10);
      setTimeout(removeBanner, 50);
      setTimeout(removeBanner, 100);
      setTimeout(removeBanner, 200);
      setTimeout(removeBanner, 500);
      setTimeout(removeBanner, 1000);
    };

    // Load the Google Translate script if not already loaded
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    } else if (window.google && window.google.translate) {
      // If script is already loaded, initialize immediately
      window.googleTranslateElementInit();
    }

    // Continuous monitoring for banner appearance with specific iframe targeting
    const observer = new MutationObserver((mutations) => {
      let shouldRemoveBanner = false;

      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Check for the specific problematic iframe
              const isProblematicIframe =
                node.tagName === "IFRAME" &&
                (node.id === ":2.container" ||
                  node.id?.includes(".container") ||
                  node.src?.includes("translate.google.com"));

              // Check for any banner elements
              const isBanner =
                node.classList?.contains("goog-te-banner-frame") ||
                node.querySelector?.(".goog-te-banner-frame") ||
                node.id?.includes("goog-te-banner") ||
                node.classList?.contains("goog-te-ftab") || // floating widget
                (node.tagName === "DIV" &&
                  node.style?.position === "fixed" &&
                  node.style?.top === "0px");

              if (isProblematicIframe || isBanner) {
                console.log("Detected problematic element:", node);
                shouldRemoveBanner = true;
              }
            }
          });
        }

        // Check for attribute changes that might indicate banner styling
        if (
          mutation.type === "attributes" &&
          mutation.target === document.body
        ) {
          if (
            mutation.attributeName === "style" ||
            mutation.attributeName === "class"
          ) {
            if (
              document.body.style.top !== "0px" ||
              document.body.classList.contains("goog-te-banner-body") ||
              document.body.className.includes("goog-te-")
            ) {
              shouldRemoveBanner = true;
            }
          }
        }
      });

      if (shouldRemoveBanner) {
        setTimeout(removeBanner, 0);
        setTimeout(removeBanner, 10); // Double check
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Periodic cleanup (fallback)
    const cleanupInterval = setInterval(removeBanner, 1000);

    return () => {
      observer.disconnect();
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <>
      <header className="text-gray-800 shadow-lg bg-white relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src={orbitalLogo || "/placeholder.svg"}
                  alt="Orbital Logo"
                  className="h-12 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-[#8500d1] px-3 py-2 text-lg font-medium transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#8500d1] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Account */}
            {isAuthenticated && (
              <div
                className="hidden md:flex items-center space-x-4 hover:text-[#8500d1] hover:cursor-pointer"
                onClick={logout}
              >
                <User2Icon className="w-6 pl-2" style={{ marginRight: "0" }} />
                <span className="ml-2">Logout</span>
              </div>
            )}

            {/* Right side - Language Selector + Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Language Selector - Desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-600" />
                <div
                  id="google_translate_element"
                  className="translate-dropdown"
                ></div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-700 hover:text-[#8500d1] p-2 rounded-md transition-colors duration-200"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-[#8500d1] block px-3 py-2 text-base font-medium transition-colors duration-200 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Account */}
                {isAuthenticated && (
                  <div
                    className="px-1 py-2 flex items-center space-x-4 hover:text-[#8500d1] hover:cursor-pointer"
                    onClick={logout}
                  >
                    <LogOutIcon className="w-6 pl-2" style={{ marginRight: "0" }} />
                  </div>
                )}

                {/* Language Selector - Mobile */}
                <div className="flex items-center space-x-2 px-3 py-2">
                  <Globe className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-600 text-sm">Language:</span>
                  <div
                    id="google_translate_element_mobile"
                    className="translate-dropdown-mobile"
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Global Styles for Google Translate */}
      <style jsx global>{`
        /* CRITICAL: Remove specific banner iframe and all Google widgets */
        iframe[id=":2.container"],
        iframe[id*=".container"],
        iframe[src*="translate.google.com/translate_nmt"],
        .goog-te-banner-frame,
        .goog-te-banner-frame.skiptranslate,
        iframe[id^="goog-te-banner-frame"],
        .goog-te-banner,
        #goog-te-banner,
        .goog-te-banner-content,
        [class*="goog-te-banner"],
        .goog-te-ftab,
        .goog-te-balloon-frame,
        div[id^="goog-te-balloon"],
        .goog-te-spinner-pos,
        div[style*="position: fixed"][style*="top: 0px"][style*="width: 100%"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          position: absolute !important;
          top: -10000px !important;
          left: -10000px !important;
          z-index: -999999 !important;
          pointer-events: none !important;
          overflow: hidden !important;
        }

        /* Reset body positioning forcefully */
        body,
        body.goog-te-banner-body {
          top: 0 !important;
          position: static !important;
          margin-top: 0 !important;
          padding-top: 0 !important;
        }

        html {
          margin-top: 0 !important;
          padding-top: 0 !important;
        }

        /* Enhanced Desktop Translate Dropdown */
        .translate-dropdown {
          position: relative;
        }

        .translate-dropdown .goog-te-gadget {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", sans-serif !important;
          font-size: 0 !important;
          color: transparent !important;
          line-height: 1 !important;
        }

        .translate-dropdown .goog-te-combo {
          background: linear-gradient(
            145deg,
            #ffffff 0%,
            #f8fafc 100%
          ) !important;
          border: 2px solid #e2e8f0 !important;
          border-radius: 12px !important;
          padding: 10px 40px 10px 16px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          font-family: inherit !important;
          color: #1e293b !important;
          outline: none !important;
          cursor: pointer !important;
          min-width: 140px !important;
          height: 44px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          appearance: none !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06) !important;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 18px !important;
        }

        .translate-dropdown .goog-te-combo:hover {
          border-color: #8500d1 !important;
          background: linear-gradient(
            145deg,
            #ffffff 0%,
            #fdf4ff 100%
          ) !important;
          box-shadow: 0 4px 12px rgba(133, 0, 209, 0.15) !important;
          transform: translateY(-1px) !important;
        }

        .translate-dropdown .goog-te-combo:focus {
          border-color: #8500d1 !important;
          background: linear-gradient(
            145deg,
            #ffffff 0%,
            #fdf4ff 100%
          ) !important;
          box-shadow: 0 0 0 4px rgba(133, 0, 209, 0.1),
            0 4px 12px rgba(133, 0, 209, 0.15) !important;
          transform: translateY(-1px) !important;
        }

        /* Enhanced Mobile Translate Dropdown */
        .translate-dropdown-mobile .goog-te-gadget {
          font-family: inherit !important;
          font-size: 0 !important;
          color: transparent !important;
        }

        .translate-dropdown-mobile .goog-te-combo {
          background: linear-gradient(
            145deg,
            #ffffff 0%,
            #f8fafc 100%
          ) !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 8px !important;
          padding: 8px 32px 8px 12px !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          font-family: inherit !important;
          color: #1e293b !important;
          outline: none !important;
          cursor: pointer !important;
          min-width: 120px !important;
          height: 36px !important;
          appearance: none !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 8px center !important;
          background-size: 14px !important;
        }

        /* Enhanced Dropdown Options */
        .goog-te-combo option {
          background-color: #ffffff !important;
          color: #1e293b !important;
          padding: 12px 16px !important;
          font-weight: 500 !important;
          font-family: inherit !important;
          border: none !important;
        }

        .goog-te-combo option:hover,
        .goog-te-combo option:focus {
          background: linear-gradient(
            145deg,
            #f1f5f9 0%,
            #e2e8f0 100%
          ) !important;
          color: #8500d1 !important;
        }

        .goog-te-combo option[value="en"]:before {
          content: "🇺🇸 ";
          margin-right: 8px;
        }

        .goog-te-combo option[value="th"]:before {
          content: "🇹🇭 ";
          margin-right: 8px;
        }

        /* Remove floating widget */
        .goog-te-ftab {
          display: none !important;
          visibility: hidden !important;
        }

        /* Style the dropdown menu frame */
        .goog-te-menu-frame {
          border-radius: 12px !important;
          border: 2px solid #e2e8f0 !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1),
            0 4px 10px rgba(0, 0, 0, 0.05) !important;
          margin-top: 4px !important;
          overflow: hidden !important;
          backdrop-filter: blur(10px) !important;
        }

        .goog-te-menu2 {
          background: rgba(255, 255, 255, 0.98) !important;
          border-radius: 12px !important;
          padding: 8px !important;
        }

        .goog-te-menu2-item {
          padding: 12px 20px !important;
          margin: 2px 0 !important;
          border-radius: 8px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          font-family: inherit !important;
          font-weight: 500 !important;
          display: flex !important;
          align-items: center !important;
        }

        .goog-te-menu2-item:hover {
          background: linear-gradient(
            145deg,
            #f8fafc 0%,
            #f1f5f9 100%
          ) !important;
          color: #8500d1 !important;
          transform: translateX(2px) !important;
        }

        .goog-te-menu2-item-selected {
          background: linear-gradient(
            145deg,
            #8500d1 0%,
            #7c2d92 100%
          ) !important;
          color: white !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 8px rgba(133, 0, 209, 0.3) !important;
        }

        /* Hide all Google branding */
        .goog-logo-link,
        .goog-te-gadget-icon,
        [id*="google_translate_element"] .goog-logo-link {
          display: none !important;
          visibility: hidden !important;
        }

        /* Clean up gadget styling */
        .goog-te-gadget-simple {
          background: transparent !important;
          border: none !important;
        }

        .goog-te-gadget-simple .goog-te-menu-value {
          color: transparent !important;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .translate-dropdown-mobile .goog-te-combo {
            min-width: 100px !important;
            font-size: 12px !important;
            padding: 6px 28px 6px 10px !important;
            height: 32px !important;
          }
        }

        /* Force override any dynamic styles */
        * {
          --goog-te-banner-display: none !important;
        }

        /* Additional failsafes for specific iframe and widgets */
        body > iframe[src*="translate.google.com"],
        body > iframe[id*=".container"],
        body > div[style*="position: fixed"][style*="top: 0px"],
        body > div[id*="goog-te"] {
          display: none !important;
          remove: true !important;
        }

        /* Prevent any Google Translate widgets from appearing */
        .goog-te-menu-frame .goog-te-ftab-frame,
        .goog-te-menu-frame iframe,
        [class*="goog-te-ftab"],
        [id*="goog-te-ftab"] {
          display: none !important;
        }

        /* Only allow dropdown functionality */
        .goog-te-gadget-simple .goog-te-menu-value span:first-child {
          display: none !important;
        }
      `}</style>
    </>
  );
}
