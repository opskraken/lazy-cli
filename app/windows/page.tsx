"use client";
import React, { useState } from "react";

import AnimatedBackground from "@/features/windows/components/animatedBackground/animatedBackground";
import MobileSectionSelector from "@/features/windows/components/mobileSectionSelector/mobileSectionSelector";
import DesktopSidebarNavigation from "@/features/windows/components/desktopSidebarNavigation/desktopSidebarNavigation";
import MainContent from "@/features/windows/components/mainContent/mainContent";

const CompleteWindowsGuide = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col md:flex-row">
        {/* Mobile Section Selector */}
        <MobileSectionSelector
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        {/* Desktop Sidebar Navigation */}
        <DesktopSidebarNavigation
          setActiveSection={setActiveSection}
          activeSection={activeSection}
        />
        {/* Main Content */}
        <MainContent activeSection={activeSection} />
      </div>
    </div>
  );
};

export default CompleteWindowsGuide;
