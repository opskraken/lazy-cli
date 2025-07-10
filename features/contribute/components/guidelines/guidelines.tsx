import { motion } from "framer-motion";
import { FileText, CheckCircle } from "lucide-react";
export default function Guidelines() {
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
              type: "tween",
              duration: 0.6,
              ease: "easeOut",
            },
          },
        }}
      >
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-12">
          <div className="text-center mb-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Contribution Guidelines
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Please follow these guidelines to ensure your contribution is
              accepted.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Code Standards
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-slate-300">
                    Write clear, documented bash scripts
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-slate-300">
                    Include error handling and validation
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-slate-300">
                    Test on multiple environments
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-slate-300">
                    Follow existing naming conventions
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                Pull Request Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-slate-300">
                    Provide clear description of changes
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-slate-300">Include usage examples</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-slate-300">
                    Update documentation if needed
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-slate-300">
                    Be responsive to feedback
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
