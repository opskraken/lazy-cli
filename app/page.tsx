"use client";
import Head from "next/head";
import { useState } from "react";
import { Inter } from "next/font/google";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import {
  Terminal,
  Github,
  Zap,
  Settings,
  Download,
  Copy,
  CheckCircle,
  ArrowRight,
  Code,
  Smartphone,
  Container,
  Database,
  Layers,
  Cpu,
  Diamond,
  Command,
  BookOpen,
  ExternalLink,
  Menu,
  X,
  Star,
  Sparkles,
  Rocket,
} from "lucide-react";

// Initialize Inter font with Next.js optimization
const inter = Inter({ subsets: ["latin"] });

interface Command {
  command: string;
  description: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  commands: Command[];
}

interface UpcomingFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: string;
  color: string;
}

interface InstallationStep {
  step: number;
  title: string;
  command: string;
  description: string;
}

export default function Home() {
  // State for managing which command section is active
  const [activeCommand, setActiveCommand] = useState<string>("github");
  const [copiedCommand, setCopiedCommand] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const installCommand = "curl -s https://lazycli.vercel.app/install.sh | bash";

  // Copy to clipboard function with feedback
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(""), 2000); // reset after 2 seconds
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
    },
  };

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

  // Current features data with Lucide icons
  const currentFeatures: Feature[] = [
    {
      id: "github",
      title: "GitHub Automation",
      description:
        "Streamline your GitHub workflow with automated repository management and CI/CD integration",
      icon: Github,
      color: "from-purple-500 via-pink-500 to-red-500",
      commands: [
        {
          command: "lazycli github init",
          description:
            "Initialize a new GitHub repository with standard configuration",
        },
        {
          command: "lazycli github clone",
          description: "Clone a GitHub repository and setup the project",
        },
        {
          command: "lazycli github push",
          description: "Push changes to GitHub with automated commit messages",
        },
        {
          command: "lazycli github pr",
          description: "Create pull requests with predefined templates",
        },
      ],
    },
    {
      id: "nodejs",
      title: "Node.js Project Setup",
      description:
        "Bootstrap Node.js projects with best practices, TypeScript, and modern configurations",
      icon: Settings,
      color: "from-green-400 via-emerald-500 to-teal-500",
      commands: [
        {
          command: "lazycli node-js init",
          description:
            "Create a new Node.js project with package.json and basic structure",
        },
        {
          command: "lazycli node-js deps",
          description: "Install common dependencies and dev tools",
        },
        {
          command: "lazycli node-js scripts",
          description:
            "Add standard npm scripts for development and production",
        },
      ],
    },
    {
      id: "nextjs",
      title: "Next.js Scaffolding",
      description:
        "Generate optimized Next.js applications with TypeScript, Tailwind, and modern tooling",
      icon: Zap,
      color: "from-blue-400 via-cyan-500 to-teal-500",
      commands: [
        {
          command: "lazycli next-js i",
          description:
            "Initialize a new Next.js project with TypeScript and Tailwind CSS",
        },
        {
          command: "lazycli next-js api",
          description: "Generate API routes with authentication boilerplate",
        },
        {
          command: "lazycli next-js deploy",
          description: "Configure deployment settings for Vercel",
        },
      ],
    },
    {
      id: "vitejs",
      title: "Vite.js Project Setup",
      description:
        "Create lightning-fast Vite.js projects with modern tooling and optimized builds",
      icon: Terminal,
      color: "from-orange-400 via-red-500 to-pink-500",
      commands: [
        {
          command: "lazycli vite init",
          description: "Bootstrap a new Vite project with React or Vue",
        },
        {
          command: "lazycli vite config",
          description: "Configure build optimization and environment variables",
        },
        {
          command: "lazycli vite preview",
          description: "Set up local preview server with hot reload",
        },
      ],
    },
  ];

  // Upcoming features data with Lucide icons
  const upcomingFeatures: UpcomingFeature[] = [
    {
      title: "Python Environment",
      description:
        "Virtual environment setup, package management, and ML project scaffolding",
      icon: Code,
      status: "Coming Soon",
      color: "from-yellow-400 via-orange-500 to-red-500",
    },
    {
      title: "Docker Automation",
      description:
        "Container deployment, orchestration tools, and Kubernetes integration",
      icon: Container,
      status: "In Development",
      color: "from-blue-400 via-indigo-500 to-purple-500",
    },
    {
      title: "Flutter Support",
      description:
        "Cross-platform mobile app development with automated setup and deployment",
      icon: Smartphone,
      status: "Planned",
      color: "from-teal-400 via-cyan-500 to-blue-500",
    },
    {
      title: "React Native",
      description:
        "Native mobile app development with React and automated store deployment",
      icon: Layers,
      status: "Planned",
      color: "from-purple-400 via-pink-500 to-red-500",
    },
    {
      title: "Rust Integration",
      description:
        "Systems programming project scaffolding with Cargo and WebAssembly support",
      icon: Cpu,
      status: "Planned",
      color: "from-orange-400 via-red-500 to-pink-500",
    },
    {
      title: "Go Projects",
      description:
        "Backend service development, microservices, and CLI tool scaffolding",
      icon: Database,
      status: "Planned",
      color: "from-cyan-400 via-blue-500 to-indigo-500",
    },
    {
      title: ".NET Support",
      description:
        "Enterprise application development with C#, ASP.NET, and Azure integration",
      icon: Diamond,
      status: "Planned",
      color: "from-indigo-400 via-purple-500 to-pink-500",
    },
  ];

  // Installation steps
  const installationSteps: InstallationStep[] = [
    {
      step: 1,
      title: "Install via Bash",
      command: "curl -s https://lazycli.vercel.app/install.sh | bash",
      description:
        "Install LazyCLI globally using a simple shell script. No config required.",
    },
    {
      step: 2,
      title: "Verify Installation",
      command: "lazy --version",
      description:
        "Check if LazyCLI is installed correctly and view the current version.",
    },
    {
      step: 3,
      title: "Initialize Your Project",
      command: "lazy node-js init",
      description:
        "Start your first Node.js project with an interactive setup.",
    },
    {
      step: 4,
      title: "Explore Commands",
      command: "lazy --help",
      description: "View all available LazyCLI commands and their usage.",
    },
  ];

  return (
    <>
      <Head>
        <title>
          Lazycli- Modern CLI Tool for Developer Workflow Automation
        </title>
        <meta
          name="description"
          content="Lazycliis a powerful CLI tool that automates GitHub workflows, Node.js setup, Next.js scaffolding, and more. Streamline your development process with intelligent automation."
        />
        <meta
          name="keywords"
          content="CLI tool, developer automation, GitHub automation, Node.js setup, Next.js scaffolding, Vite.js, developer workflow, TypeScript, modern development"
        />
        <meta name="author" content="LazycliTeam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />

        <meta
          property="og:title"
          content="Lazycli- Modern CLI Tool for Developer Workflow Automation"
        />
        <meta
          property="og:description"
          content="Automate your development workflow with Lazycli- supporting GitHub, Node.js, Next.js, Vite.js and more platforms."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lazycli.vercel.app/" />
        <meta
          property="og:image"
          content="https://lazycli.vercel.app//og-image.png"
        />
        <meta property="og:site_name" content="Lazycli" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Lazycli- Modern CLI Tool for Developer Automation"
        />
        <meta
          name="twitter:description"
          content="Streamline your development process with intelligent CLI automation."
        />
        <meta
          name="twitter:image"
          content="https://lazycli.vercel.app//twitter-image.png"
        />
        <meta name="twitter:creator" content="@lazycli" />

        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="canonical" href="https://lazycli.vercel.app/" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Lazycli",
              description: "Modern CLI tool for developer workflow automation",
              url: "https://lazycli.vercel.app/",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Cross-platform",
            }),
          }}
        />
      </Head>
      <div
        className={`min-h-screen bg-slate-900 text-white ${inter.className}`}
      >
        {/* Navigation */}
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

        {/* Hero Section */}
        <section className="pt-24 pb-16 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20" />

            {/* Grid Pattern */}
            {/* Grid Pattern */}
            <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23334155" fill-opacity="0.1"%3E%3Ccircle cx="3" cy="3" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-40' />

            {/* Floating Elements */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                variants={floatingVariants}
                initial="initial"
                animate="animate"
                transition={{
                  delay: Math.random() * 5,
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  ease: [0.42, 0, 0.58, 1],
                }}
              />
            ))}

            {/* Large Glowing Orbs */}
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"
              variants={glowVariants}
              initial="initial"
              animate="animate"
            />
            <motion.div
              className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
              variants={glowVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 2 }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
                <span className="text-cyan-400 text-sm font-medium">
                  The Future of CLI Automation
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                  Automate Your
                </span>
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  Development Workflow
                </motion.span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Lazycliis a powerful CLI tool that streamlines GitHub automation,
              project scaffolding, and development workflows. Build faster,
              deploy smarter, code better.
            </motion.p>

            {/* Install Command */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 max-w-3xl mx-auto mb-12"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-sm flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Quick Install
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyToClipboard(installCommand)}
                  className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center px-3 py-1 bg-cyan-400/10 rounded-lg border border-cyan-400/20 transition-colors"
                >
                  {copiedCommand === installCommand ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </motion.button>
              </div>
              <code className="text-cyan-400 text-lg md:text-xl font-mono block break-all">
                $ {installCommand}
              </code>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#features"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center group"
              >
                <Rocket className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Explore Features
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="#installation"
                className="border-2 border-slate-600 text-slate-300 px-8 py-4 rounded-xl hover:bg-slate-800 hover:border-cyan-400 transition-all flex items-center justify-center group"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Installation Guide
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              {[
                { label: "Commands Available", value: "50+" },
                { label: "Projects Scaffolded", value: "10K+" },
                { label: "GitHub Stars", value: "2.5K+" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Installation Process Section */}
        <section id="installation" className="py-20 bg-slate-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Get Started in Minutes
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Follow these simple steps to install and start using{" "}
                <strong>LazyCLI</strong> in your development workflow.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {installationSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                        {step.step}
                      </div>
                      {index < installationSteps.length - 1 && (
                        <ArrowRight className="w-5 h-5 text-slate-600 hidden lg:block group-hover:text-cyan-400 transition-colors" />
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-4">
                      {step.title}
                    </h3>

                    <div className="bg-slate-900/50 rounded-lg p-4 mb-4 border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-xs flex items-center">
                          <Terminal className="w-3 h-3 mr-1" />
                          Terminal
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyToClipboard(step.command)}
                          className="text-cyan-400 hover:text-cyan-300 text-xs"
                        >
                          {copiedCommand === step.command ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </motion.button>
                      </div>
                      <code className="text-cyan-400 text-sm font-mono block">
                        {step.command}
                      </code>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Current Features Section */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Powerful Features
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Advanced automation tools available right now to supercharge
                your development workflow
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {currentFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    variants={itemVariants}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    className="group relative"
                  >
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all h-full">
                      <div className="relative mb-6">
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div
                          className={`absolute inset-0 w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} blur-lg opacity-0 group-hover:opacity-30 transition-opacity`}
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveCommand(feature.id)}
                        className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center group-hover:translate-x-1 transition-transform"
                      >
                        View Commands
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Upcoming Features Section */}
        <section id="upcoming" className="py-20 bg-slate-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Coming Soon
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Exciting new integrations and tools coming soon to expand your
                development capabilities
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {upcomingFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group relative"
                  >
                    <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl p-6 border-2 border-dashed border-slate-600 hover:border-cyan-400/50 transition-all h-full">
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <motion.span
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          viewport={{ once: true }}
                          className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-full font-medium"
                        >
                          {feature.status}
                        </motion.span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Interactive Commands Section */}
        <section id="commands" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Commands & Usage
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Explore detailed command examples and usage patterns for each
                platform
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden"
            >
              {/* Command Tabs */}
              <div className="flex flex-wrap border-b border-slate-700">
                {currentFeatures.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.button
                      key={feature.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveCommand(feature.id)}
                      className={`flex-1 min-w-0 py-6 px-6 text-center font-medium transition-all ${
                        activeCommand === feature.id
                          ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-700/50"
                          : "text-slate-400 hover:text-white hover:bg-slate-700/30"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mx-auto mb-2" />
                      <span className="hidden sm:inline text-sm">
                        {feature.title}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Command Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {currentFeatures.map((feature) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`${
                        activeCommand === feature.id ? "block" : "hidden"
                      }`}
                    >
                      <div className="mb-8">
                        <div className="flex items-center mb-4">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mr-4`}
                          >
                            <feature.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">
                              {feature.title}
                            </h3>
                            <p className="text-slate-400">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {feature.commands.map((cmd, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6 group hover:border-cyan-400/50 transition-all"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-slate-400 text-sm flex items-center">
                                <Command className="w-4 h-4 mr-2" />
                                Command
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => copyToClipboard(cmd.command)}
                                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center px-3 py-1 bg-cyan-400/10 rounded-lg border border-cyan-400/20 transition-colors"
                              >
                                {copiedCommand === cmd.command ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                  </>
                                )}
                              </motion.button>
                            </div>
                            <code className="text-cyan-400 text-lg font-mono block mb-4 group-hover:text-cyan-300 transition-colors">
                              $ {cmd.command}
                            </code>
                            <p className="text-slate-300 text-sm leading-relaxed">
                              {cmd.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-center"
            >
              <div className="mb-8 md:mb-0">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <Terminal className="h-10 w-10 text-cyan-400 mr-3" />
                    <motion.div
                      className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-20"
                      variants={glowVariants}
                      initial="initial"
                      animate="animate"
                    />
                  </div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Lazycli
                  </span>
                </div>
                <p className="text-slate-400 max-w-md">
                  Automating development workflows, one command at a time. Built
                  with ❤️ for developers worldwide.
                </p>
                <div className="flex items-center mt-4 space-x-4">
                  <div className="flex items-center text-slate-400 text-sm">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>2.5K+ GitHub Stars</span>
                  </div>
                  <div className="text-slate-400 text-sm">•</div>
                  <div className="text-slate-400 text-sm">MIT License</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.a
                  whileHover={{ scale: 1.05, y: -2 }}
                  href="#"
                  className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-400/50"
                >
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05, y: -2 }}
                  href="#"
                  className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-400/50"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Documentation
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05, y: -2 }}
                  href="#"
                  className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-400/50"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Support
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500"
            >
              <p>
                &copy; 2025 Lazycli. All rights reserved. Empowering developers
                globally.
              </p>
            </motion.div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar styles */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1e293b;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #2563eb);
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </>
  );
}
