import { motion } from "framer-motion";
import { Star, Clock, Rocket } from "lucide-react";
export default function NavigationTabs({
  setActiveTab,
  activeTab,
}: {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };
  return (
    <>
      <motion.div className="flex justify-center mb-12" variants={itemVariants}>
        <div className="bg-slate-800/50 backdrop-blur-sm p-2 rounded-2xl border border-slate-700/50">
          <div className="flex space-x-2">
            {[
              {
                id: "current",
                label: "Current Version",
                icon: <Star className="w-5 h-5" />,
              },
              {
                id: "history",
                label: "Version History",
                icon: <Clock className="w-5 h-5" />,
              },
              {
                id: "roadmap",
                label: "Roadmap",
                icon: <Rocket className="w-5 h-5" />,
              },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-lg shadow-cyan-400/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
