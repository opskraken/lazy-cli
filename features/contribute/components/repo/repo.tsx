import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
export default function Repo() {
  return (
    <>
      <motion.div
        className="text-center mb-16"
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
        <a
          href="https://github.com/iammhador/lazycli"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all group"
        >
          <Github className="w-6 h-6 mr-3" />
          View on GitHub
          <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
    </>
  );
}
