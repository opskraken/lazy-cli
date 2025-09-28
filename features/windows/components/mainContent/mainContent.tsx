import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  ExternalLink,
  GitBranch,
  HardDrive,
  Info,
  Monitor,
  Terminal,
  User,
  Wifi,
} from "lucide-react";
import { useState } from "react";
export default function MainContent({
  activeSection,
}: {
  activeSection: string;
}) {
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
    <div className="space-y-6 md:space-y-8">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 md:p-8 hover:border-cyan-500/30 transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 mb-4 sm:mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-3 sm:mb-0">
              {index + 1}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-slate-400 text-base sm:text-lg">
                {step.description}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Detailed Steps:</h4>
              <ul className="space-y-2">
                {step.details.map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2 text-slate-300 text-sm sm:text-base"
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
                <div className="bg-slate-900/60 rounded-lg p-3 sm:p-4 border border-slate-700/50">
                  <pre className="text-cyan-300 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            )}

            <div className="bg-blue-400/10 border border-blue-400/20 rounded-lg p-3 sm:p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-blue-300 text-xs sm:text-sm">{step.tips}</p>
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
          <div className="space-y-6 md:space-y-8">
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 md:p-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                Windows Development Setup
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                This comprehensive guide will help you set up a powerful
                development environment on Windows. You have two main options:
                Git Bash for simple Git operations and basic Unix commands, or
                Windows Subsystem for Linux (WSL) for a full Linux development
                environment.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-slate-900/40 rounded-xl p-4 sm:p-6 border border-slate-700/50">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <GitBranch className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      Git Bash
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm sm:text-base mb-3 sm:mb-4">
                    Lightweight solution that provides Git version control and
                    basic Unix commands in a familiar terminal.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        Quick to install
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        Minimal system impact
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        Perfect for Git workflows
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 rounded-xl p-4 sm:p-6 border border-slate-700/50">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      WSL
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm sm:text-base mb-3 sm:mb-4">
                    Full Linux environment running natively on Windows with
                    excellent performance and compatibility.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        Complete Linux environment
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
                        Native Docker support
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">
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
          <div className="space-y-6 md:space-y-8">
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 md:p-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                System Requirements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {requirements.map((req, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/40 rounded-xl p-4 sm:p-6 border border-slate-700/50"
                  >
                    <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                      <div className="text-cyan-400 flex-shrink-0">
                        {req.icon}
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {req.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 text-sm sm:text-base">
                      {req.description}
                    </p>
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
          <div className="space-y-6 md:space-y-8">
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 md:p-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                Common Issues & Solutions
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {troubleshootingItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/40 rounded-xl p-4 sm:p-6 border border-slate-700/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-3 mb-3 sm:mb-4">
                      <AlertTriangle className="w-6 h-6 text-yellow-400 mb-2 sm:mb-0 sm:mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                          {item.problem}
                        </h3>
                        <p className="text-slate-300 text-sm sm:text-base mb-3 sm:mb-4">
                          {item.solution}
                        </p>
                        <div className="bg-slate-900/60 rounded-lg p-3 sm:p-4 border border-slate-700/50">
                          <pre className="text-cyan-300 text-xs sm:text-sm overflow-x-auto">
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
          <div className="space-y-6 md:space-y-8">
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 md:p-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                Additional Resources
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
                <div className="bg-slate-900/40 rounded-xl p-4 sm:p-6 border border-slate-700/50">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                    Official Documentation
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="https://git-scm.com/doc"
                      className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm sm:text-base"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Git Documentation</span>
                    </a>
                    <a
                      href="https://docs.microsoft.com/en-us/windows/wsl/"
                      className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm sm:text-base"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>WSL Documentation</span>
                    </a>
                  </div>
                </div>

                <div className="bg-slate-900/40 rounded-xl p-4 sm:p-6 border border-slate-700/50">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                    Community Resources
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="https://stackoverflow.com/questions/tagged/git"
                      className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm sm:text-base"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Stack Overflow - Git</span>
                    </a>
                    <a
                      href="https://stackoverflow.com/questions/tagged/wsl"
                      className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm sm:text-base"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Stack Overflow - WSL</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 rounded-xl p-4 sm:p-6 border border-slate-700/50">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-slate-700/50 pb-3 sm:pb-4 last:border-b-0"
                    >
                      <button
                        onClick={() =>
                          setExpandedFaq(
                            expandedFaq === `faq-${index}`
                              ? null
                              : `faq-${index}`
                          )
                        }
                        className="flex items-center justify-between w-full text-left cursor-pointer hover:text-cyan-400 transition-colors"
                      >
                        <span className="text-white font-medium text-sm sm:text-base">
                          {faq.question}
                        </span>
                        {expandedFaq === `faq-${index}` ? (
                          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0 ml-2" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedFaq === `faq-${index}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-2 sm:mt-3"
                          >
                            <p className="text-slate-300 text-sm sm:text-base">
                              {faq.answer}
                            </p>
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
    <>
      <motion.div
        className="flex-1 p-4 sm:p-6 md:p-8 pt-20 md:pt-24 max-w-4xl mx-auto w-full"
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
    </>
  );
}
