"use client";
import { motion } from "framer-motion";
import {
  Terminal,
  Github,
  Zap,
  Users,
  Clock,
  CheckCircle,
  Code2,
  Workflow,
  Rocket,
} from "lucide-react";

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

  const problems = [
    {
      icon: Clock,
      title: "Repetitive Setup Tasks",
      description:
        "Stop wasting time on manual project initialization and configuration.",
    },
    {
      icon: Terminal,
      title: "Complex Command Chains",
      description:
        "Eliminate the need to remember and type long command sequences.",
    },
    {
      icon: Workflow,
      title: "Inconsistent Workflows",
      description: "Standardize your development process across all projects.",
    },
  ];

  const supportedCommands = [
    {
      icon: Github,
      command: "github",
      description: "Automate git add, commit, and push workflows",
      example: "lazycli github push",
    },
    {
      icon: Code2,
      command: "node-js",
      description: "Initialize Node.js projects with npm setup",
      example: "lazycli node-js init",
    },
    {
      icon: Rocket,
      command: "next-js",
      description: "Bootstrap Next.js applications instantly",
      example: "lazycli next-js init",
    },
    {
      icon: Zap,
      command: "vite-js",
      description: "Create Vite.js projects with modern tooling",
      example: "lazycli vite-js init",
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent mb-6">
            How LazyCLI Works
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            LazyCLI is the universal CLI vault that transforms your development
            workflow from repetitive manual tasks to automated, efficient
            processes.
          </p>
        </motion.div>

        {/* Why LazyCLI Section */}
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
              Why LazyCLI?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Built for developers who value efficiency and consistency in their
              workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
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
              >
                <problem.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  {problem.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Who is it for Section */}
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
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12">
            <div className="flex items-center justify-center mb-8">
              <Users className="w-12 h-12 text-cyan-400 mr-4" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Who is it for?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Perfect for:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Frontend & Backend Developers
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    DevOps Engineers
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Full-Stack Developers
                  </li>
                  <li className="flex items-center text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Team Leads & Project Managers
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Benefits:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-300">
                    <Zap className="w-5 h-5 text-cyan-400 mr-3" />
                    Save hours of setup time
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Workflow className="w-5 h-5 text-cyan-400 mr-3" />
                    Standardize team workflows
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Terminal className="w-5 h-5 text-cyan-400 mr-3" />
                    Reduce command complexity
                  </li>
                  <li className="flex items-center text-slate-300">
                    <Rocket className="w-5 h-5 text-cyan-400 mr-3" />
                    Focus on building, not configuring
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Supported Commands Section */}
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
              Supported Commands
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Currently available automation commands with more coming soon.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {supportedCommands.map((cmd, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-xl hover:bg-slate-800/70 transition-all hover:border-cyan-400/30"
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
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start space-x-4">
                  <cmd.icon className="w-8 h-8 text-cyan-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {cmd.command}
                    </h3>
                    <p className="text-slate-300 mb-3">{cmd.description}</p>
                    <code className="bg-slate-900/50 px-3 py-1 rounded text-sm text-cyan-400 font-mono">
                      {cmd.example}
                    </code>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How to Use */}
        <motion.section
          className="mb-16"
          variants={{
            hidden: { y: 30, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                duration: 0.6,
                ease: "easeOut",
              },
            },
          }}
        >
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12">
            <div className="text-center mb-8">
              <Terminal className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                How to Use
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Get started with LazyCLI in just a few simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Install
                </h3>
                <p className="text-slate-300 mb-4">
                  Install globally with one command
                </p>
                <code className="bg-black/30 px-3 py-2 rounded text-sm block text-cyan-300">
                  curl -s lazycli.xyz | bash
                </code>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Choose Command
                </h3>
                <p className="text-slate-300 mb-4">
                  Select from available automation commands
                </p>
                <code className="bg-black/30 px-3 py-2 rounded text-sm block text-cyan-300">
                  lazycli [command] [action]
                </code>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Automate
                </h3>
                <p className="text-slate-300 mb-4">
                  Let LazyCLI handle the rest
                </p>
                <code className="bg-black/30 px-3 py-2 rounded text-sm block text-green-400">
                  ✅ Task completed!
                </code>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default GuidelinePage;
