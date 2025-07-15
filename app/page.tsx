"use client";
import { useState } from "react";
import { Inter } from "next/font/google";
import { easeInOut } from "framer-motion";
import Hero from "@/features/home/components/hero/hero";
import Installation from "@/features/home/components/installation/installation";
import CurrentFeatures from "@/features/home/components/currentFeatures/currentFeatures";
import UpcomingFeatures from "@/features/home/components/upcomingFeatures/upcomingFeatures";
import InteractiveCommands from "@/features/home/components/interactiveCommands/interactiveCommands";
import WindowsInstallPage from "@/features/home/components/windows/windows";
import Contributors from "@/features/home/components/contributors/contributors";

// Initialize Inter font with Next.js optimization
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [activeCommand, setActiveCommand] = useState<string>("github");
  const [copiedCommand, setCopiedCommand] = useState<string>("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(""), 2000); // reset after 2 seconds
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const glowVariants = {
    initial: { scale: 1, opacity: 0.3 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };

  return (
    <>
      <div
        className={`min-h-screen bg-slate-900 text-white ${inter.className}`}
      >
        <Hero glowVariants={glowVariants} />

        {/* Installation Process Section */}
        <Installation />

        {/* Windows Setup for Git Bash & WSL */}
        <WindowsInstallPage />

        {/* Current Features Section */}
        <CurrentFeatures
          containerVariants={containerVariants}
          itemVariants={itemVariants}
          setActiveCommand={setActiveCommand}
        />

        {/* Upcoming Features Section */}
        <UpcomingFeatures
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />

        {/* Interactive Commands Section */}
        <InteractiveCommands
          setActiveCommand={setActiveCommand}
          activeCommand={activeCommand}
          copyToClipboard={copyToClipboard}
          copiedCommand={copiedCommand}
        />

        {/* Contributors Section */}
        <Contributors
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />
      </div>
    </>
  );
}
