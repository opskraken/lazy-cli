"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Terminal, Menu, X, Home } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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

  // Handle navigation for hash links
  const handleNavigation = (href: string) => {
    setMobileMenuOpen(false);

    if (href.startsWith("#")) {
      // If we're not on the home page and it's a hash link, go to home first
      if (pathname !== "/") {
        router.push("/" + href);
      } else {
        // If we're on home page, scroll to the element
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      // Regular navigation
      router.push(href);
    }
  };

  const navigationItems = [
    { name: "Features", href: "#features" },
    { name: "Installation", href: "#installation" },
    { name: "Commands", href: "#commands" },
    { name: "Guideline", href: "/guideline" },
    { name: "Contribute", href: "/contribute" },
    { name: "Version", href: "/version" },
    { name: "Windows", href: "/windows" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/50 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
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
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.05, y: -2 }}
                  onClick={() => handleNavigation(item.href)}
                  className="text-slate-300 hover:text-cyan-400 transition-colors relative group cursor-pointer"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300" />
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative p-2 text-slate-300 hover:text-cyan-400 transition-colors rounded-lg hover:bg-slate-800/50"
              >
                <AnimatePresence mode="wait">
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Modern Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={{
                closed: {
                  opacity: 0,
                  height: 0,
                  transition: {
                    duration: 0.3,
                    ease: easeInOut,
                  },
                },
                open: {
                  opacity: 1,
                  height: "auto",
                  transition: {
                    duration: 0.3,
                    ease: easeInOut,
                  },
                },
              }}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden overflow-hidden"
            >
              <div className="bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/50 shadow-xl">
                <div className="px-4 py-6 space-y-2">
                  {/* Home Link */}
                  <motion.button
                    custom={0}
                    variants={{
                      closed: {
                        x: -20,
                        opacity: 0,
                        transition: { duration: 0.2 },
                      },
                      open: {
                        x: 0,
                        opacity: 1,
                        transition: {
                          delay: 0 * 0.1,
                          duration: 0.3,
                          ease: "easeOut",
                        },
                      },
                    }}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    onClick={() => handleNavigation("/")}
                    className="w-full flex items-center px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-400/10 rounded-xl transition-all duration-300 group"
                  >
                    <Home className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Home</span>
                    <motion.div
                      className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.5 }}
                    />
                  </motion.button>

                  {/* Navigation Items */}
                  {navigationItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      custom={index + 1}
                      variants={{
                        closed: {
                          x: -20,
                          opacity: 0,
                          transition: { duration: 0.2 },
                        },
                        open: {
                          x: 0,
                          opacity: 1,
                          transition: {
                            delay: (index + 1) * 0.1,
                            duration: 0.3,
                            ease: "easeOut",
                          },
                        },
                      }}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      onClick={() => handleNavigation(item.href)}
                      className="w-full flex items-center px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-400/10 rounded-xl transition-all duration-300 group"
                    >
                      <span className="font-medium">{item.name}</span>
                      <motion.div
                        className="ml-auto w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.5 }}
                      />
                    </motion.button>
                  ))}
                </div>

                {/* Mobile Menu Footer */}
                <div className="border-t border-slate-700/50 px-4 py-4">
                  <motion.div
                    custom={navigationItems.length + 1}
                    variants={{
                      closed: {
                        x: -20,
                        opacity: 0,
                        transition: { duration: 0.2 },
                      },
                      open: {
                        x: 0,
                        opacity: 1,
                        transition: {
                          delay: (navigationItems.length + 1) * 0.1,
                          duration: 0.3,
                          ease: "easeOut",
                        },
                      },
                    }}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="flex items-center justify-center space-x-2 text-slate-400"
                  >
                    <Terminal className="w-4 h-4" />
                    <span className="text-sm">Made with ❤️ for developers</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
