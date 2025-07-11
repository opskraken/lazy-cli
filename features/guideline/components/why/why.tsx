import { motion } from "framer-motion";
import { Terminal, Clock, Workflow } from "lucide-react";
export default function Why() {
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
    </>
  );
}
