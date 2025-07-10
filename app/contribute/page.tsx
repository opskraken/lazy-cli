"use client";
import { motion } from "framer-motion";
import {
  GitBranch,
  FolderPlus,
  TerminalSquare,
  Code2,
  Github,
  Copy,
  FileText,
  Users,
  Zap,
  CheckCircle,
  ExternalLink,
  Heart,
} from "lucide-react";
import { useState } from "react";

const ContributePage = () => {
  const [copiedText, setCopiedText] = useState<string>("");

  const copyToClipboard = (text: string, label: string) => {
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

  const contributionSteps = [
    {
      icon: GitBranch,
      title: "Fork the Repository",
      description:
        "Start by forking the main LazyCLI repository to your GitHub account.",
      action: "Fork on GitHub",
      link: "https://github.com/iammhador/lazycli",
    },
    {
      icon: Code2,
      title: "Clone & Create Branch",
      description:
        "Clone your fork locally and create a new feature branch for your contribution.",
      code: "git clone https://github.com/your-username/lazycli.git\ncd lazycli\ngit checkout -b feature/your-command",
    },
    {
      icon: FolderPlus,
      title: "Add Your Script",
      description: "Create a new folder under /public with your custom script.",
      structure: true,
    },
    {
      icon: TerminalSquare,
      title: "Test Your Command",
      description: "Test your script locally to ensure it works as expected.",
      code: "curl -s https://lazycli.xyz/scripts/myscript/lazy.sh | bash",
    },
    {
      icon: Github,
      title: "Submit Pull Request",
      description:
        "Push your changes and create a pull request with a clear description.",
      code: "git add .\ngit commit -m 'Add: new command for [feature]'\ngit push origin feature/your-command",
    },
  ];

  const customizationOptions = [
    {
      icon: Zap,
      title: "Minimal Custom Builds",
      description:
        "Create lightweight versions with only the commands you need (pm2, aws, github, etc.)",
    },
    {
      icon: Code2,
      title: "Copy Core Components",
      description:
        "Fork the core repository and remove unnecessary commands to create your custom version",
    },
    {
      icon: Users,
      title: "Team-Specific Scripts",
      description:
        "Build organization-specific CLI tools with your team's preferred workflows",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <motion.div
        className="max-w-6xl mx-auto px-4 pt-24 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-center mb-16"
        >
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-cyan-400/20 to-blue-400/20 p-6 rounded-2xl backdrop-blur-sm border border-cyan-500/20">
              <Heart className="w-16 h-16 text-cyan-500" />
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contribute to LazyCLI
          </motion.h1>

          <motion.p
            className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Help us build the ultimate CLI automation tool. Contribute custom
            commands, improvements, or create your own minimal versions.
          </motion.p>
        </motion.div>

        {/* GitHub Repository Link */}
        <motion.div
          className="text-center mb-16"
          variants={{
            hidden: { y: 30, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "tween",
                duration: 0.6,
                ease: "easeOut",
              },
            },
          }}
        >
          <a
            href="https://github.com/iammhador/lazycli"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all group"
          >
            <Github className="w-6 h-6 mr-3" />
            View on GitHub
            <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Contribution Steps */}
        <motion.section
          className="mb-20"
          variants={{
            hidden: { y: 30, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "tween",
                duration: 0.6,
                ease: "easeOut",
              },
            },
          }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              How to Contribute
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Follow these steps to add your custom commands or improvements to
              LazyCLI.
            </p>
          </div>

          <div className="space-y-8">
            {contributionSteps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8 hover:bg-slate-800/70 transition-all"
                variants={{
                  hidden: { y: 30, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      type: "tween",
                      duration: 0.6,
                      ease: "easeOut",
                    },
                  },
                }}
              >
                <div className="flex items-start space-x-6">
                  <div className="bg-cyan-400/10 p-3 rounded-lg">
                    <step.icon className="w-8 h-8 text-cyan-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-slate-300 mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium"
                      >
                        {step.action}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}

                    {step.code && (
                      <div className="bg-gray-900 rounded-lg p-4 relative group">
                        <pre className="text-green-400 text-sm overflow-x-auto">
                          <code>{step.code}</code>
                        </pre>
                        <button
                          onClick={() =>
                            copyToClipboard(step.code, `step-${index}`)
                          }
                          className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Copy className="w-4 h-4 text-gray-300" />
                        </button>
                        {copiedText === `step-${index}` && (
                          <span className="absolute top-3 right-16 text-green-400 text-sm">
                            Copied!
                          </span>
                        )}
                      </div>
                    )}

                    {step.structure && (
                      <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                        <h4 className="font-semibold text-white mb-3">
                          Directory Structure:
                        </h4>
                        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                          <div className="text-blue-400">/public</div>
                          <div className="text-slate-400 ml-4">
                            └── myscript/
                          </div>
                          <div className="text-green-400 ml-8">└── lazy.sh</div>
                        </div>
                        <p className="text-slate-300 mt-4 text-sm">
                          Write your script once, install it anytime with:
                        </p>
                        <div className="bg-gray-900 rounded-lg p-3 mt-2 relative group">
                          <code className="text-green-400 text-sm">
                            curl -s https://lazycli.xyz/scripts/myscript/lazy.sh
                            | bash
                          </code>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                "curl -s https://lazycli.xyz/scripts/myscript/lazy.sh | bash",
                                "install-command"
                              )
                            }
                            className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Copy className="w-3 h-3 text-gray-300" />
                          </button>
                          {copiedText === "install-command" && (
                            <span className="absolute top-2 right-12 text-green-400 text-xs">
                              Copied!
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Customization Options */}
        <motion.section
          className="mb-20"
          variants={{
            hidden: { y: 30, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "tween",
                duration: 0.6,
                ease: "easeOut",
              },
            },
          }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Create Custom Versions
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Build your own minimal CLI tools with only the features you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {customizationOptions.map((option, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-xl hover:bg-slate-800/70 transition-all"
                variants={{
                  hidden: { y: 30, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      type: "tween",
                      duration: 0.6,
                      ease: "easeOut",
                    },
                  },
                }}
                whileHover={{ y: -4 }}
              >
                <option.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  {option.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {option.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Guidelines */}
        <motion.section
          className="mb-16"
          variants={{
            hidden: { y: 30, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "tween",
                duration: 0.6,
                ease: "easeOut",
              },
            },
          }}
        >
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Contribution Guidelines
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Please follow these guidelines to ensure your contribution is
                accepted.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Code Standards
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-slate-300">
                      Write clear, documented bash scripts
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-slate-300">
                      Include error handling and validation
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-slate-300">
                      Test on multiple environments
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-slate-300">
                      Follow existing naming conventions
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Pull Request Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-slate-300">
                      Provide clear description of changes
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-slate-300">
                      Include usage examples
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-slate-300">
                      Update documentation if needed
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-slate-300">
                      Be responsive to feedback
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default ContributePage;
