import { motion } from "framer-motion";
import { Terminal, Copy, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";

interface InstallationStep {
  step: number;
  title: string;
  command: string;
  description: string;
}

export default function Installation() {
  const [copiedCommand, setCopiedCommand] = useState<string>("");
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(""), 2000); // reset after 2 seconds
  };

  // Installation steps
  const installationSteps: InstallationStep[] = [
    {
      step: 1,
      title: "Install via Bash",
      command: "curl -s https://lazycli.xyz/install.sh | bash",
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
                          <Copy className="w-3 h-3 cursor-pointer" />
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
    </>
  );
}
