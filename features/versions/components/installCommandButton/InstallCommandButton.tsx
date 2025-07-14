import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ChevronRight, CheckCircle } from "lucide-react";

const InstallCommandButton = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      "curl -s https://lazycli.xyz/install.sh | bash"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="text-center mt-16 relative">
      <motion.button
        onClick={handleCopy}
        className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-cyan-400/25 cursor-pointer"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Download className="w-5 h-5 cursor-pointer" />
        <span>Copy Install Command</span>
        <ChevronRight className="w-4 h-4 " />
      </motion.button>
 
      {/* Feedback message */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="absolute left-1/2 transform -translate-x-1/2 mt-3 text-green-400 flex items-center gap-2 text-sm font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            Command copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InstallCommandButton;
