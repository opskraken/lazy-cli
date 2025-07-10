import { motion } from "framer-motion";
import {
  Terminal,
  Zap,
  Users,
  CheckCircle,
  Workflow,
  Rocket,
} from "lucide-react";
export default function Who() {
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
    </>
  );
}
