"use client";
import Contribution from "@/features/contribute/components/contribution/contribution";
import Customization from "@/features/contribute/components/customization/customization";
import Guidelines from "@/features/contribute/components/guidelines/guidelines";
import Hero from "@/features/contribute/components/hero/hero";
import Repo from "@/features/contribute/components/repo/repo";
import { motion } from "framer-motion";
import { useState } from "react";

const ContributePage = () => {
  const [copiedText, setCopiedText] = useState<string>("");

  const copyToClipboard = (text: string, label: string = "") => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

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

        {/* GitHub Repository Link */}
        <Repo />

        {/* Contribution Steps */}
        <Contribution
          copyToClipboard={copyToClipboard}
          copiedText={copiedText}
        />

        {/* Customization Options */}
        <Customization />

        {/* Guidelines */}
        <Guidelines />
      </motion.div>
    </div>
  );
};

export default ContributePage;
