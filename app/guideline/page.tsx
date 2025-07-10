"use client";

import Commands from "@/features/guideline/components/commands/commands";
import Hero from "@/features/guideline/components/hero/hero";
import How from "@/features/guideline/components/how/how";
import Who from "@/features/guideline/components/who/who";
import Why from "@/features/guideline/components/why/why";
import { motion } from "framer-motion";

const GuidelinePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <motion.div
        className="max-w-6xl mx-auto px-4 pt-24 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <Hero />

        {/* Why LazyCLI Section */}
        <Why />

        {/* Who is it for Section */}
        <Who />

        {/* Supported Commands Section */}
        <Commands />

        {/* How to Use */}
        <How />
      </motion.div>
    </div>
  );
};

export default GuidelinePage;
