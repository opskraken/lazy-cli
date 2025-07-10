import { motion } from "framer-motion";
import { Command, Globe, Package, Users } from "lucide-react";

export default function Stats() {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const stats = [
    {
      label: "Total Commands",
      value: "45+",
      icon: <Command className="w-6 h-6" />,
    },
    {
      label: "Integrations",
      value: "4",
      icon: <Package className="w-6 h-6" />,
    },
    { label: "Platforms", value: "3", icon: <Globe className="w-6 h-6" /> },
    {
      label: "Active Users",
      value: "1.2K+",
      icon: <Users className="w-6 h-6" />,
    },
  ];
  return (
    <>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        variants={itemVariants}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-center mb-3">
              <div className="text-cyan-400">{stat.icon}</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
