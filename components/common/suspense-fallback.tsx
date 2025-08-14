"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface SuspenseFallbackProps {
  message?: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

export default function SuspenseFallback({
  message = "Loading...",
  className = "",
  size = "medium",
}: SuspenseFallbackProps) {
  const sizeClasses = {
    small: "p-2",
    medium: "p-4",
    large: "p-6",
  };

  const iconSizes = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Loader2 className={`${iconSizes[size]} text-cyan-500`} />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}