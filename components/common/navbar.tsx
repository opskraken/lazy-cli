"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Terminal, Menu, X, Home, Bell, ChevronDown, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  // const [mobileVersionsOpen, setMobileVersionsOpen] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Version notification data
  const latestVersion = {
    version: "v1.0.2",
    title: "Cross-Platform Support",
    date: "2025-07-10",
    isNew: true,
    type: "patch",
  };

  const recentVersions = [
    {
      version: "v1.0.2",
      title: "Cross-Platform Support",
      date: "2025-07-10",
      status: "current",
      type: "patch",
    },
    {
      version: "v1.0.1",
      title: "Initial Integration Suite",
      date: "2025-7-9",
      status: "previous",
      type: "patch",
    },
  ];

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setNotificationOpen(false);

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

  // Handle navigation to specific version
  const handleVersionNavigation = (version: string) => {
    setNotificationOpen(false);
    setMobileMenuOpen(false);
    router.push(`/versions?v=${version}`);
  };

  const navigationItems = [
    { name: "Features", href: "#features" },
    { name: "Installation", href: "#installation" },
    { name: "Commands", href: "#commands" },
    { name: "Contributors", href: "#contributors" },
    { name: "Guideline", href: "/guideline" },
    { name: "Contribute", href: "/contribute" },
    { name: "Versions", href: "/versions" },
    { name: "Windows", href: "/windows" },
  ];

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "current":
  //       return "from-cyan-400 to-blue-400";
  //     case "new":
  //       return "from-green-400 to-emerald-400";
  //     case "enhanced":
  //       return "from-purple-400 to-pink-400";
  //     case "planned":
  //       return "from-yellow-400 to-orange-400";
  //     default:
  //       return "from-slate-400 to-slate-500";
  //   }
  // };

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
                  LazyCLI
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
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

              {/* Version Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative flex items-center text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {latestVersion.isNew && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />
                  )}
                  <ChevronDown
                    className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                      notificationOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                {/* Version Notification Dropdown */}
                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-72 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-medium">
                            Version Updates
                          </h3>
                          <Link
                            href={`/versions?v=${latestVersion.version.replace(
                              "v",
                              ""
                            )}`}
                          >
                            <span className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
                              Latest: {latestVersion.version}
                            </span>
                          </Link>
                        </div>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {recentVersions.map((version) => (
                          <motion.button
                            key={version.version}
                            whileHover={{
                              backgroundColor: "rgba(8, 145, 178, 0.1)",
                            }}
                            onClick={() =>
                              handleVersionNavigation(
                                version.version.replace("v", "")
                              )
                            }
                            className={`w-full p-3 flex items-start border-b border-slate-700/30 last:border-0 ${
                              version.status === "current"
                                ? "bg-cyan-400/10"
                                : ""
                            }`}
                          >
                            <Tag
                              className={`w-4 h-4 mt-0.5 mr-3 ${
                                version.status === "current"
                                  ? "text-cyan-400"
                                  : "text-slate-400"
                              }`}
                            />
                            <div className="text-left">
                              <div className="flex items-center">
                                <span className="text-white font-medium">
                                  {version.version}
                                </span>
                                {version.status === "current" && (
                                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-cyan-400/20 text-cyan-400 rounded-full">
                                    Current
                                  </span>
                                )}
                                <span className="ml-2 px-1.5 py-0.5 text-xs bg-slate-700/50 text-slate-300 rounded-full">
                                  {version.type}
                                </span>
                              </div>
                              <p className="text-sm text-slate-400 mt-1">
                                {version.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {version.date}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      <div className="p-3 bg-slate-800/80 border-t border-slate-700/50">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleNavigation("/versions")}
                          className="w-full py-2 text-center text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                        >
                          View All Versions
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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

                  {/* Version Updates in Mobile Menu */}
                  <div className="w-full">
                    {/* <motion.div
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
                      className="w-full"
                    >
                      <button
                        onClick={() =>
                          setMobileVersionsOpen(!mobileVersionsOpen)
                        }
                        className="w-full flex items-center px-4 py-3 text-slate-300 hover:text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-400/10 rounded-xl transition-all duration-300 group"
                      >
                        <div className="relative">
                          <Bell className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                          {latestVersion.isNew && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full" />
                          )}
                        </div>
                        <span className="font-medium">Version Updates</span>
                        <div className="ml-auto flex items-center space-x-2">
                          <span className="text-xs px-1.5 py-0.5 bg-cyan-400/20 text-cyan-400 rounded-full">
                            {latestVersion.version}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                              mobileVersionsOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                        {mobileVersionsOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden px-4 py-2"
                          >
                            <div className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/30 max-h-80 overflow-y-auto">
                              <div
                                className="p-3 border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors cursor-pointer"
                                onClick={() => {
                                  handleVersionNavigation(
                                    latestVersion.version.replace("v", "")
                                  );
                                  setMobileVersionsOpen(false);
                                }}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center space-x-1.5">
                                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                                      <span className="font-medium text-white">
                                        {latestVersion.version}
                                      </span>
                                      <span className="px-1.5 py-0.5 text-xs bg-cyan-500/20 text-cyan-300 rounded">
                                        new
                                      </span>
                                      <span className="px-1.5 py-0.5 text-xs bg-slate-700/50 text-slate-300 rounded">
                                        {latestVersion.type}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1">
                                      Latest version
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {recentVersions.slice(0, 3).map((version) => (
                                <div
                                  key={version.version}
                                  className="p-3 border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors cursor-pointer"
                                  onClick={() => {
                                    handleVersionNavigation(
                                      version.version.replace("v", "")
                                    );
                                    setMobileVersionsOpen(false);
                                  }}
                                >
                                  <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-1.5 flex-wrap">
                                        <span
                                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${getStatusColor(
                                            version.status
                                          )}`}
                                        ></span>
                                        <span className="font-medium text-white">
                                          {version.version}
                                        </span>
                                        <span className="px-1.5 py-0.5 text-xs bg-slate-700/50 text-slate-300 rounded whitespace-nowrap">
                                          {version.type}
                                        </span>
                                      </div>
                                      <p className="text-sm text-slate-400 mt-1 break-words">
                                        {version.title}
                                      </p>
                                    </div>
                                    <span className="text-xs text-slate-500 whitespace-nowrap sm:ml-2">
                                      {version.date}
                                    </span>
                                  </div>
                                </div>
                              ))}

                              <div
                                className="p-3 hover:bg-slate-700/30 transition-colors cursor-pointer text-center"
                                onClick={() => {
                                  handleNavigation("/versions");
                                  setMobileVersionsOpen(false);
                                }}
                              >
                                <span className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                                  View All Versions
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div> */}
                  </div>
                </div>

                {/* Mobile Menu Footer */}
                <div className="border-t border-slate-700/50 px-4 py-4">
                  <motion.div
                    custom={navigationItems.length + 2}
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
                          delay: (navigationItems.length + 2) * 0.1,
                          duration: 0.3,
                          ease: "easeOut",
                        },
                      },
                    }}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className="flex items-center justify-center space-x-2 text-slate-400">
                      <Terminal className="w-4 h-4" />
                      <span className="text-sm">
                        Made with ❤️ for developers
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-slate-500 text-xs">
                      <Tag className="w-3 h-3" />
                      <span>{recentVersions.length} versions available</span>
                    </div>
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
