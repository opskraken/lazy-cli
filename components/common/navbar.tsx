"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Terminal, Menu, X } from "lucide-react";

export default function Navbar() {
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="relative">
                <Terminal className="h-8 w-8 text-cyan-400 mr-3" />
                <motion.div
                  className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-20"
                  variants={glowVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Lazycli
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {["Features", "Installation", "Upcoming", "Commands"].map(
                (item) => (
                  <motion.a
                    key={item}
                    whileHover={{ scale: 1.05, y: -2 }}
                    href={`#${item.toLowerCase()}`}
                    className="text-slate-300 hover:text-cyan-400 transition-colors relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300" />
                  </motion.a>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-cyan-400 p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-slate-700"
            >
              <div className="px-4 py-2 space-y-1">
                {["Features", "Installation", "Upcoming", "Commands"].map(
                  (item) => (
                    <motion.a
                      key={item}
                      whileHover={{ x: 10 }}
                      href={`#${item.toLowerCase()}`}
                      className="block px-3 py-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </motion.a>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
