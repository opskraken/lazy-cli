import { motion } from "framer-motion";
import { Heart } from "lucide-react";
export default function Hero() {
  return (
    <>
      {" "}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        className="text-center mb-16"
      >
        <motion.div
          className="flex justify-center mb-6"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gradient-to-r from-cyan-400/20 to-blue-400/20 p-6 rounded-2xl backdrop-blur-sm border border-cyan-500/20">
            <Heart className="w-16 h-16 text-cyan-500" />
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Contribute to LazyCLI
        </motion.h1>

        <motion.p
          className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Help us build the ultimate CLI automation tool. Contribute custom
          commands, improvements, or create your own minimal versions.
        </motion.p>
      </motion.div>
    </>
  );
}
