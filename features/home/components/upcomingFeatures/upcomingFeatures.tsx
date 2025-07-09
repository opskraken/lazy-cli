import { motion } from "framer-motion";
import {
  Code,
  Smartphone,
  Container,
  Database,
  Layers,
  Cpu,
  Diamond,
} from "lucide-react";

interface UpcomingFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: string;
  color: string;
}

export default function UpcomingFeatures({
  containerVariants,
  itemVariants,
}: {
  containerVariants: import("framer-motion").Variants;
  itemVariants: import("framer-motion").Variants;
}) {
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
  return (
    <>
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
    </>
  );
}
