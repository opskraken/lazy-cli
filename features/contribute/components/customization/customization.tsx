import { motion } from "framer-motion";
import { Code2, Users, Zap } from "lucide-react";
export default function Customization() {
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
    <>
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
    </>
  );
}
