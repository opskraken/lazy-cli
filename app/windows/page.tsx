"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  CheckCircle,
  ExternalLink,
  Monitor,
  GitBranch,
  AlertTriangle,
  Info,
  BookOpen,
  Shield,
  Cpu,
  HardDrive,
  Wifi,
  User,
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const CompleteWindowsGuide = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

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

  const sections = [
    { id: "overview", label: "Overview", icon: <Info className="w-4 h-4" /> },
    {
      id: "requirements",
      label: "Requirements",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "git-bash",
      label: "Git Bash Setup",
      icon: <GitBranch className="w-4 h-4" />,
    },
    {
      id: "wsl",
      label: "WSL Installation",
      icon: <Terminal className="w-4 h-4" />,
    },
    {
      id: "troubleshooting",
      label: "Troubleshooting",
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      id: "resources",
      label: "Resources",
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  const requirements = [
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Windows 10/11",
      description: "Version 1903 or higher for WSL2",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "64-bit Processor",
      description: "x64 or ARM64 architecture",
    },
    {
      icon: <HardDrive className="w-6 h-6" />,
      title: "4GB+ RAM",
      description: "Minimum for smooth operation",
    },
    {
      icon: <User className="w-6 h-6" />,
      title: "Admin Rights",
      description: "Required for installation",
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Internet Connection",
      description: "For downloading components",
    },
  ];

  const gitBashSteps = [
    {
      title: "Download Git for Windows",
      description:
        "Visit the official Git website and download the latest installer",
      details: [
        "Go to https://git-scm.com/download/win",
        "Click 'Download for Windows' button",
        "The download should start automatically",
        "File size is approximately 50-60MB",
      ],
      code: "# Verify download integrity (optional)\nGet-FileHash -Path 'Git-2.XX.X-64-bit.exe' -Algorithm SHA256",
      tips: "Always download from the official site to ensure security",
    },
    {
      title: "Run the Installer",
      description: "Execute the downloaded file with appropriate settings",
      details: [
        "Right-click the installer and select 'Run as administrator'",
        "Choose installation directory (default: C:\\Program Files\\Git)",
        "Select components (recommended: Git Bash, Git GUI, Git LFS)",
        "Choose default editor (VS Code recommended if installed)",
      ],
      code: "# Silent installation (PowerShell as admin)\nStart-Process -FilePath 'Git-2.XX.X-64-bit.exe' -ArgumentList '/SILENT' -Wait",
      tips: "Keep default settings unless you have specific requirements",
    },
    {
      title: "Configure Git Settings",
      description: "Set up your identity and preferences",
      details: [
        "Open Git Bash from Start menu",
        "Configure your name and email",
        "Set up line ending preferences",
        "Configure credential helper",
      ],
      code: `git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global core.autocrlf true
git config --global credential.helper manager`,
      tips: "Use the same email as your GitHub/GitLab account",
    },
    {
      title: "Verify Installation",
      description: "Test that Git is working correctly",
      details: [
        "Check Git version",
        "Verify configuration settings",
        "Test basic Git commands",
        "Confirm Git Bash functionality",
      ],
      code: `git --version
git config --list
git help
ls -la`,
      tips: "If commands don't work, restart your terminal or computer",
    },
  ];

  const wslSteps = [
    {
      title: "Enable WSL Feature",
      description: "Activate Windows Subsystem for Linux",
      details: [
        "Open PowerShell as Administrator",
        "Run the feature enablement command",
        "This enables the WSL1 foundation",
        "No restart required yet",
      ],
      code: "dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart",
      tips: "Keep PowerShell open for the next steps",
    },
    {
      title: "Enable Virtual Machine Platform",
      description: "Required for WSL2 functionality",
      details: [
        "Still in PowerShell as Administrator",
        "Enable the Virtual Machine Platform feature",
        "This allows WSL2 to run with better performance",
        "Uses Windows Hypervisor Platform",
      ],
      code: "dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart",
      tips: "WSL2 provides better performance than WSL1",
    },
    {
      title: "Restart Computer",
      description: "Restart to apply the changes",
      details: [
        "Close all applications",
        "Restart your computer",
        "This activates the enabled features",
        "Wait for complete startup",
      ],
      code: "# PowerShell restart command\nRestart-Computer -Force",
      tips: "Don't skip this step - features won't work without restart",
    },
    {
      title: "Install WSL2 Kernel Update",
      description: "Download and install the Linux kernel update",
      details: [
        "Visit Microsoft's WSL2 kernel update page",
        "Download the x64 kernel update package",
        "Run the installer as administrator",
        "This provides the Linux kernel for WSL2",
      ],
      code: "# Download URL\nhttps://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi",
      tips: "This step is crucial for WSL2 functionality",
    },
    {
      title: "Set WSL2 as Default",
      description: "Configure WSL to use version 2 by default",
      details: [
        "Open PowerShell or Command Prompt",
        "Set WSL2 as the default version",
        "This ensures new distributions use WSL2",
        "Better performance and full system compatibility",
      ],
      code: "wsl --set-default-version 2",
      tips: "You can change this later if needed",
    },
    {
      title: "Install Linux Distribution",
      description: "Choose and install your preferred Linux distribution",
      details: [
        "Open Microsoft Store",
        "Search for Linux distributions",
        "Popular choices: Ubuntu, Debian, openSUSE",
        "Click 'Install' on your preferred distribution",
      ],
      code: `# Alternative: Install via PowerShell
wsl --install -d Ubuntu
wsl --list --online`,
      tips: "Ubuntu is recommended for beginners",
    },
    {
      title: "Initial Setup",
      description: "Configure your Linux environment",
      details: [
        "Launch your installed distribution",
        "Create a Unix username and password",
        "Update package lists",
        "Install essential tools",
      ],
      code: `sudo apt update && sudo apt upgrade -y
sudo apt install curl wget git build-essential -y`,
      tips: "Choose a simple username - you'll type it often",
    },
  ];

  const troubleshootingItems = [
    {
      problem: "Git Bash not found in Start menu",
      solution:
        "Check if Git is installed in Program Files. If not, reinstall Git with default settings.",
      code: "ls 'C:\\Program Files\\Git\\bin\\bash.exe'",
    },
    {
      problem: "WSL2 installation fails",
      solution:
        "Ensure virtualization is enabled in BIOS and Windows features are properly enabled.",
      code: 'systeminfo | find "Hyper-V"',
    },
    {
      problem: "Linux distribution won't start",
      solution: "Check WSL version and restart WSL service.",
      code: "wsl --list --verbose\nwsl --shutdown\nwsl",
    },
    {
      problem: "Permission denied errors",
      solution: "Run terminal as administrator or check file permissions.",
      code: 'icacls "C:\\path\\to\\file" /grant %USERNAME%:F',
    },
  ];

  const faqs = [
    {
      question: "Which option should I choose: Git Bash or WSL?",
      answer:
        "Git Bash is simpler and sufficient for basic Git operations. WSL provides a full Linux environment and is better for complex development workflows.",
    },
    {
      question: "Can I use both Git Bash and WSL?",
      answer:
        "Yes! They can coexist. You might use Git Bash for quick Git operations and WSL for development environments.",
    },
    {
      question: "Is WSL2 better than WSL1?",
      answer:
        "Yes, WSL2 offers better performance, full system call compatibility, and can run Docker containers natively.",
    },
    {
      question: "Do I need Windows Pro for WSL?",
      answer:
        "No, WSL works on Windows 10 Home (version 1903+) and Windows 11. Windows Pro is not required.",
    },
  ];

  const renderSteps = (steps: typeof gitBashSteps) => (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300"
        >
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {index + 1}
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-slate-400 text-lg">{step.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Detailed Steps:</h4>
              <ul className="space-y-2">
                {step.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 text-slate-300"
                  >
                    <CheckCircle className="w-4 h-4 mt-1 text-cyan-400 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {step.code && (
              <div>
                <h4 className="text-white font-medium mb-2">Commands:</h4>
                <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                  <pre className="text-cyan-300 text-sm overflow-x-auto whitespace-pre-wrap">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            )}

            <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-blue-300 text-sm">{step.tips}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Windows Development Setup
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                This comprehensive guide will help you set up a powerful
                development environment on Windows. You have two main options:
                Git Bash for simple Git operations and basic Unix commands, or
                Windows Subsystem for Linux (WSL) for a full Linux development
                environment.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <GitBranch className="w-8 h-8 text-cyan-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Git Bash
                    </h3>
                  </div>
                  <p className="text-slate-400 mb-4">
                    Lightweight solution that provides Git version control and
                    basic Unix commands in a familiar terminal.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Quick to install</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Minimal system impact</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Perfect for Git workflows</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <Terminal className="w-8 h-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">WSL</h3>
                  </div>
                  <p className="text-slate-400 mb-4">
                    Full Linux environment running natively on Windows with
                    excellent performance and compatibility.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">
                        Complete Linux environment
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Native Docker support</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">
                        Advanced development tools
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case "requirements":
        return (
          <div className="space-y-8">
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                System Requirements
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requirements.map((req, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/50"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-cyan-400">{req.icon}</div>
                      <h3 className="text-lg font-semibold text-white">
                        {req.title}
                      </h3>
                    </div>
                    <p className="text-slate-400">{req.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case "git-bash":
        return (
          <div className="space-y-8">
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Git Bash Installation Guide
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Git Bash provides a BASH emulation used to run Git from the
                command line. It&lsquo;s the easiest way to get started with Git
                on Windows.
              </p>
            </motion.div>
            {renderSteps(gitBashSteps)}
          </div>
        );

      case "wsl":
        return (
          <div className="space-y-8">
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                WSL Installation Guide
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Windows Subsystem for Linux (WSL) lets you run a Linux
                environment directly on Windows, providing powerful development
                capabilities.
              </p>
            </motion.div>
            {renderSteps(wslSteps)}
          </div>
        );

      case "troubleshooting":
        return (
          <div className="space-y-8">
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Common Issues & Solutions
              </h2>
              <div className="space-y-6">
                {troubleshootingItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/50"
                  >
                    <div className="flex items-start space-x-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {item.problem}
                        </h3>
                        <p className="text-slate-300 mb-4">{item.solution}</p>
                        <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
                          <pre className="text-cyan-300 text-sm overflow-x-auto">
                            <code>{item.code}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case "resources":
        return (
          <div className="space-y-8">
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Additional Resources
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Official Documentation
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="https://git-scm.com/doc"
                      className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Git Documentation</span>
                    </a>
                    <a
                      href="https://docs.microsoft.com/en-us/windows/wsl/"
                      className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>WSL Documentation</span>
                    </a>
                  </div>
                </div>

                <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Community Resources
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="https://stackoverflow.com/questions/tagged/git"
                      className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Stack Overflow - Git</span>
                    </a>
                    <a
                      href="https://stackoverflow.com/questions/tagged/wsl"
                      className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Stack Overflow - WSL</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-slate-700/50 pb-4 last:border-b-0"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(
                            expandedFaq === `faq-${index}`
                              ? null
                              : `faq-${index}`
                          )
                        }
                        className="flex items-center justify-between w-full text-left"
                      >
                        <span className="text-white font-medium">
                          {faq.question}
                        </span>
                        {expandedFaq === `faq-${index}` ? (
                          <ChevronUp className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-cyan-400" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedFaq === `faq-${index}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3"
                          >
                            <p className="text-slate-300">{faq.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar Navigation */}
        <div className="w-80 h-screen bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 p-6 sticky top-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Windows Setup Guide
            </h1>
            <p className="text-slate-400">
              Complete development environment setup
            </p>
          </div>

          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-cyan-400 to-blue-400 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {section.icon}
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <motion.div
          className="flex-1 p-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteWindowsGuide;
