"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Terminal,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Monitor,
  GitBranch,
  Settings,
  Play,
  Code,
  Zap,
} from "lucide-react";

const WindowsInstallPage = () => {
  const [activeTab, setActiveTab] = useState("git-bash");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const steps: Record<
    string,
    Array<{
      icon: React.ReactElement;
      title: string;
      description: string;
      action: string;
    }>
  > = {
    "git-bash": [
      {
        icon: <Download className="w-6 h-6" />,
        title: "Download Git for Windows",
        description: "Visit git-scm.com and download the latest version",
        action: "Download Now",
      },
      {
        icon: <Settings className="w-6 h-6" />,
        title: "Run the Installer",
        description:
          "Execute the downloaded .exe file with administrator privileges",
        action: "Install",
      },
      {
        icon: <Terminal className="w-6 h-6" />,
        title: "Launch Git Bash",
        description: "Find Git Bash in your Start menu and open it",
        action: "Open Terminal",
      },
      {
        icon: <CheckCircle className="w-6 h-6" />,
        title: "Verify Installation",
        description: "Type 'git --version' to confirm successful installation",
        action: "Verify",
      },
    ],
    wsl: [
      {
        icon: <Code className="w-6 h-6" />,
        title: "Enable WSL Feature",
        description:
          "Open PowerShell as admin and run: dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart",
        action: "Enable WSL",
      },
      {
        icon: <Zap className="w-6 h-6" />,
        title: "Enable Virtual Machine",
        description:
          "Run: dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart",
        action: "Enable VM",
      },
      {
        icon: <Download className="w-6 h-6" />,
        title: "Install WSL2 Kernel",
        description:
          "Download and install the WSL2 Linux kernel update package",
        action: "Download Kernel",
      },
      {
        icon: <Terminal className="w-6 h-6" />,
        title: "Install Linux Distribution",
        description:
          "Open Microsoft Store and install Ubuntu or your preferred Linux distribution",
        action: "Install Ubuntu",
      },
    ],
  };

  return (
    <div
      id="windows-guide"
      className="py-16 bg-slate-900/50 overflow-x-hidden relative"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-l from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 25, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-cyan-400/20 to-blue-400/20 p-6 rounded-2xl backdrop-blur-sm border border-cyan-500/20">
              <Monitor className="w-16 h-16 text-cyan-500" />
            </div>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Windows Setup
          </motion.h1>

          <motion.p
            className="text-xl text-slate-400 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Choose your preferred development environment for Windows. Both
            options provide powerful command-line tools for development.
          </motion.p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="flex justify-center mb-12 px-4"
          variants={itemVariants}
        >
          <div className="bg-slate-800/50 backdrop-blur-sm p-2 rounded-2xl border border-slate-700/50 w-full max-w-md">
            <div className="flex space-x-1 sm:space-x-2">
              {[
                {
                  id: "git-bash",
                  label: "Git Bash",
                  icon: <GitBranch className="w-4 h-4 sm:w-5 sm:h-5" />,
                },
                {
                  id: "wsl",
                  label: "WSL Install",
                  icon: <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />,
                },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300 flex-1 text-sm sm:text-base ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-lg shadow-cyan-400/25 cursor-pointer"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50 cursor-pointer"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.icon}
                  <span className="hidden xs:inline sm:inline">
                    {tab.label}
                  </span>
                  <span className="xs:hidden sm:hidden">
                    {tab.id === "git-bash" ? "Git" : "WSL"}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Steps Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {steps[activeTab].map((step, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group"
              >
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 lg:p-8 h-full hover:border-cyan-500/30 transition-all duration-300">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl flex items-center justify-center text-cyan-500 group-hover:from-cyan-400/30 group-hover:to-blue-400/30 transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      {step.icon}
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 group-hover:text-cyan-300 transition-colors duration-300 break-words">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-4 sm:mb-6 break-words">
                        {step.description}
                      </p>

                      <motion.button
                        className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-medium group-hover:translate-x-1 transition-all duration-300 text-sm sm:text-base"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (step.action === "Download Now") {
                            window.open(
                              "https://git-scm.com/download/win",
                              "_blank"
                            );
                          } else if (step.action === "Download Kernel") {
                            window.open(
                              "https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi",
                              "_blank"
                            );
                          } else if (step.action === "Install Ubuntu") {
                            window.open(
                              "https://www.microsoft.com/store/productId/9PDXGNCFSCZV",
                              "_blank"
                            );
                          } else {
                            // For other actions, show a helpful message or guide
                            const windowsSection =
                              document.getElementById("windows-guide");
                            if (windowsSection) {
                              windowsSection.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }
                          }
                        }}
                      >
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{step.action}</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Guide Link */}
        <motion.div className="text-center mt-16" variants={itemVariants}>
          <motion.a
            href="https://lazycli.xyz/windows"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-400/10 to-pink-400/10 hover:from-purple-400/20 hover:to-pink-400/20 border border-purple-400/20 hover:border-purple-400/40 text-slate-600 hover:text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-5 h-5" />
            <span>View Complete Guide</span>
          </motion.a>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-16 text-slate-500"
          variants={itemVariants}
        >
          <p>
            Need help? Check out our comprehensive installation guide for
            detailed instructions.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WindowsInstallPage;
