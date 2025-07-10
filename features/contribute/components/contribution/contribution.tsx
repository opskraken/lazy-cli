import { motion } from "framer-motion";
import {
  GitBranch,
  FolderPlus,
  TerminalSquare,
  Code2,
  Github,
  Copy,
  ExternalLink,
} from "lucide-react";
export default function Contribution({
  copyToClipboard,
  copiedText,
}: {
  copyToClipboard: (text: string, label?: string) => void;
  copiedText: string;
}) {
  const contributionSteps = [
    {
      icon: GitBranch,
      title: "Fork the Repository",
      description:
        "Start by forking the main LazyCLI repository to your GitHub account.",
      action: "Fork on GitHub",
      link: "https://github.com/iammhador/lazycli",
    },
    {
      icon: Code2,
      title: "Clone & Create Branch",
      description:
        "Clone your fork locally and create a new feature branch for your contribution.",
      code: "git clone https://github.com/your-username/lazycli.git\ncd lazycli\ngit checkout -b feature/your-command",
    },
    {
      icon: FolderPlus,
      title: "Add Your Script",
      description: "Create a new folder under /public with your custom script.",
      structure: true,
    },
    {
      icon: TerminalSquare,
      title: "Test Your Command",
      description: "Test your script locally to ensure it works as expected.",
      code: "curl -s https://lazycli.xyz/scripts/myscript/lazy.sh | bash",
    },
    {
      icon: Github,
      title: "Submit Pull Request",
      description:
        "Push your changes and create a pull request with a clear description.",
      code: "git add .\ngit commit -m 'Add: new command for [feature]'\ngit push origin feature/your-command",
    },
  ];
  return (
    <>
      {" "}
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
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3 sm:mb-4">
            How to Contribute
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Follow these steps to add your custom commands or improvements to
            LazyCLI.
          </p>
        </div>

        <div className="space-y-8">
          {contributionSteps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-4 sm:p-6 md:p-8 hover:bg-slate-800/70 transition-all"
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
              <div className="flex flex-col sm:flex-row items-start sm:space-x-6 space-y-4 sm:space-y-0">
                <div className="bg-cyan-400/10 p-3 rounded-lg self-center sm:self-start">
                  <step.icon className="w-8 h-8 text-cyan-400" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center mb-3">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      {step.action}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  )}

                  {step.code && (
                    <div className="bg-gray-900 rounded-lg p-4 relative group w-full">
                      <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap break-words max-w-full">
                        <code className="block w-full">{step.code}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(step.code, `step-${index}`)}
                        className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                      >
                        <Copy className="w-4 h-4 text-gray-300" />
                      </button>
                      {copiedText === `step-${index}` && (
                        <span className="absolute top-3 right-16 text-green-400 text-sm">
                          Copied!
                        </span>
                      )}
                    </div>
                  )}

                  {step.structure && (
                    <div className="bg-slate-900/50 rounded-lg p-4 sm:p-6 border border-slate-600">
                      <h4 className="font-semibold text-white mb-3">
                        Directory Structure:
                      </h4>
                      <div className="bg-black/30 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                        <div className="text-blue-400">/public</div>
                        <div className="text-slate-400 ml-2 sm:ml-4">
                          └── myscript/
                        </div>
                        <div className="text-green-400 ml-4 sm:ml-8">
                          └── lazy.sh
                        </div>
                      </div>
                      <p className="text-slate-300 mt-4 text-sm">
                        Write your script once, install it anytime with:
                      </p>
                      <div className="bg-gray-900 rounded-lg p-3 mt-2 relative group w-full">
                        <code className="text-green-400 text-sm block whitespace-pre-wrap break-words max-w-full">
                          curl -s https://lazycli.xyz/scripts/myscript/lazy.sh |
                          bash
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              "curl -s https://lazycli.xyz/scripts/myscript/lazy.sh | bash",
                              "install-command"
                            )
                          }
                          className="absolute top-2 right-2 p-1 bg-gray-800 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                        >
                          <Copy className="w-3 h-3 text-gray-300" />
                        </button>
                        {copiedText === "install-command" && (
                          <span className="absolute top-2 right-12 text-green-400 text-xs">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </>
  );
}
