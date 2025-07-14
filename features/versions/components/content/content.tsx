/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Code,
  Zap,
  Globe,
  Server,
  Database,
  Cloud,
  Monitor,
  Workflow,
  Shield,
  Users,
  Calendar,
  Github,
  Target,
  Award,
  Activity,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
export default function Content({
  containerVariants,
  selectedVersion,
  activeTab,
  renderVersionDetails,
  setSelectedVersion,
  cardVariants,
  getStatusColor,
}: {
  containerVariants: any;
  selectedVersion: any;
  activeTab: any;
  renderVersionDetails: any;
  setSelectedVersion: any;
  cardVariants: any;
  getStatusColor: any;
}) {
  const [filteredVersions, setFilteredVersions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter versions based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = versions.filter(
        (version) =>
          version.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
          version.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          version.features.some(
            (feature) =>
              feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              feature.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
      );
      setFilteredVersions(filtered);

      // If we have filtered results and the currently selected version is not in the filtered list,
      // select the first filtered version
      if (
        filtered.length > 0 &&
        !filtered.some((v) => v.version === selectedVersion)
      ) {
        setSelectedVersion(filtered[0].version);
      }
    } else {
      setFilteredVersions(filteredVersions);
    }
  }, [searchQuery, selectedVersion, filteredVersions]);
  const versions = [
    {
      version: "v1.0.2",
      title: "Cross-Platform Support",
      date: "2024-01-15",
      status: "current",
      type: "major",
      features: [
        {
          icon: <Globe className="w-5 h-5" />,
          title: "Cross-Platform Compatibility",
          description:
            "Full support for Windows, macOS, and Linux environments",
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: "Enhanced Security",
          description: "Improved credential handling and secure authentication",
        },
        {
          icon: <Zap className="w-5 h-5" />,
          title: "Performance Optimization",
          description: "Faster command execution and reduced resource usage",
        },
        {
          icon: <Settings className="w-5 h-5" />,
          title: "Configuration Management",
          description: "Centralized config file for easy customization",
        },
      ],
      integrations: [
        {
          name: "GitHub",
          icon: <Github className="w-4 h-4" />,
          status: "enhanced",
        },
        { name: "Vite", icon: <Zap className="w-4 h-4" />, status: "enhanced" },
        {
          name: "Next.js",
          icon: <Code className="w-4 h-4" />,
          status: "enhanced",
        },
        {
          name: "Node.js",
          icon: <Server className="w-4 h-4" />,
          status: "enhanced",
        },
      ],
      commands: [
        'git-auto push "commit message"',
        "git-auto pull --sync",
        "git-auto deploy --platform vercel",
        "git-auto config --setup",
      ],
    },
    {
      version: "v1.0.1",
      title: "Initial Integration Suite",
      date: "2023-12-20",
      status: "previous",
      type: "minor",
      features: [
        {
          icon: <Github className="w-5 h-5" />,
          title: "GitHub Integration",
          description: "Seamless Git operations with GitHub repositories",
        },
        {
          icon: <Zap className="w-5 h-5" />,
          title: "Vite Support",
          description: "Automated build and deployment for Vite projects",
        },
        {
          icon: <Code className="w-5 h-5" />,
          title: "Next.js Integration",
          description: "Full support for Next.js development workflow",
        },
        {
          icon: <Server className="w-5 h-5" />,
          title: "Node.js Compatibility",
          description: "Native Node.js project management and deployment",
        },
      ],
      integrations: [
        { name: "GitHub", icon: <Github className="w-4 h-4" />, status: "new" },
        { name: "Vite", icon: <Zap className="w-4 h-4" />, status: "new" },
        { name: "Next.js", icon: <Code className="w-4 h-4" />, status: "new" },
        {
          name: "Node.js",
          icon: <Server className="w-4 h-4" />,
          status: "new",
        },
      ],
      commands: [
        "git-auto push",
        "git-auto pull",
        "git-auto init",
        "git-auto status",
      ],
    },
  ];
  const roadmapItems = [
    {
      version: "v1.1.0",
      title: "Process Management",
      quarter: "Q2 2024",
      status: "planned",
      features: [
        {
          icon: <Activity className="w-5 h-5" />,
          title: "PM2 Integration",
          description: "Advanced process management for Node.js applications",
        },
        {
          icon: <Monitor className="w-5 h-5" />,
          title: "Process Monitoring",
          description: "Real-time application monitoring and health checks",
        },
        {
          icon: <Workflow className="w-5 h-5" />,
          title: "Auto-restart Policies",
          description: "Intelligent application restart and recovery",
        },
      ],
    },
    {
      version: "v1.2.0",
      title: "Cloud Integration",
      quarter: "Q3 2024",
      status: "planned",
      features: [
        {
          icon: <Cloud className="w-5 h-5" />,
          title: "AWS Integration",
          description: "Deploy and manage applications on AWS infrastructure",
        },
        {
          icon: <Database className="w-5 h-5" />,
          title: "Database Management",
          description: "Automated database migrations and backups",
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: "Security Scanning",
          description: "Automated security vulnerability detection",
        },
      ],
    },
    {
      version: "v1.3.0",
      title: "Enterprise Features",
      quarter: "Q4 2024",
      status: "planned",
      features: [
        {
          icon: <Users className="w-5 h-5" />,
          title: "Team Collaboration",
          description: "Multi-user workflows and team management",
        },
        {
          icon: <Award className="w-5 h-5" />,
          title: "Quality Gates",
          description: "Automated code quality checks and standards",
        },
        {
          icon: <Target className="w-5 h-5" />,
          title: "Custom Pipelines",
          description: "Build custom CI/CD pipelines with visual editor",
        },
      ],
    },
  ];
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {activeTab === "current" && renderVersionDetails(versions[0])}

          {activeTab === "history" && (
            <div className="space-y-8">
              {/* Search and filter */}
              <div className="flex flex-col items-center mb-8 space-y-4">
                <div className="w-full max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by version or title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white cursor-alias-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm p-2 rounded-xl border border-slate-700/50 w-full max-w-4xl overflow-x-auto">
                  <div className="flex space-x-2 min-w-max">
                    {filteredVersions.length > 0 ? (
                      filteredVersions.map((version: any) => (
                        <motion.button
                          key={version.version}
                          onClick={() => setSelectedVersion(version.version)}
                          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                            selectedVersion === version.version
                              ? "bg-gradient-to-r from-cyan-400 to-blue-400 text-white"
                              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {version.version}
                        </motion.button>
                      ))
                    ) : (
                      <div className="px-6 py-3 text-slate-400">
                        No versions found
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {filteredVersions.length > 0 &&
                renderVersionDetails(
                  filteredVersions.find(
                    (v: any) => v.version === selectedVersion
                  ) || filteredVersions[0]
                )}
            </div>
          )}

          {activeTab === "roadmap" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Development Roadmap
                </h2>
                <p className="text-slate-400 text-lg">
                  Upcoming features and integrations planned for future releases
                </p>
              </div>

              <div className="space-y-8">
                {roadmapItems.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.version}
                        </span>
                        <h3 className="text-2xl font-bold text-white">
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>{item.quarter}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {item.features.map(
                        (feature: any, featureIndex: number) => (
                          <div
                            key={featureIndex}
                            className="bg-slate-900/40 rounded-xl p-4"
                          >
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="text-cyan-400">
                                {feature.icon}
                              </div>
                              <h4 className="font-semibold text-white">
                                {feature.title}
                              </h4>
                            </div>
                            <p className="text-sm text-slate-400">
                              {feature.description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
