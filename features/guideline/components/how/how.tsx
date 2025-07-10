import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
export default function How() {
  return (
    <>
      {" "}
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
              <h3 className="text-xl font-semibold mb-3 text-white">Install</h3>
              <p className="text-slate-300 mb-4">
                Install globally with one command
              </p>
              <code className="bg-black/30 px-3 py-2 rounded text-sm block text-cyan-300">
                curl -s https://lazycli.xyz/install.sh | bash
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
              <p className="text-slate-300 mb-4">Let LazyCLI handle the rest</p>
              <code className="bg-black/30 px-3 py-2 rounded text-sm block text-green-400">
                ✅ Task completed!
              </code>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
