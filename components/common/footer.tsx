"use client";
import { easeInOut, motion } from "framer-motion";
import { Terminal, BookOpen, ExternalLink, Star, Github } from "lucide-react";
export default function Footer() {
  const glowVariants = {
    initial: { scale: 1, opacity: 0.3 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  };
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="relative">
                <Terminal className="h-10 w-10 text-cyan-400 mr-3" />
                <motion.div
                  className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-20"
                  variants={glowVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Lazycli
              </span>
            </div>
            <p className="text-slate-400 max-w-md">
              Automating development workflows, one command at a time. Built
              with ❤️ for developers worldwide.
            </p>
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center text-slate-400 text-sm">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>0 GitHub Stars</span>
              </div>
              <div className="text-slate-400 text-sm">•</div>
              <div className="text-slate-400 text-sm">MIT License</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Navigation</h3>
              <div className="space-y-2">
                {[
                  { name: "Features", href: "#features" },
                  { name: "Installation", href: "#installation" },
                  { name: "Commands", href: "#commands" }
                ].map((item) => (
                  <motion.a
                    key={item.name}
                    whileHover={{ x: 5 }}
                    href={item.href}
                    className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Pages</h3>
              <div className="space-y-2">
                {[
                  { name: "Guideline", href: "/guideline" },
                  { name: "Contribute", href: "/contribute" },
                  { name: "Version", href: "/version" },
                  { name: "Windows", href: "/windows" }
                ].map((item) => (
                  <motion.a
                    key={item.name}
                    whileHover={{ x: 5 }}
                    href={item.href}
                    className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Resources</h3>
              <div className="space-y-2">
                <motion.a
                  whileHover={{ x: 5 }}
                  href="https://github.com/lazycli/lazycli"
                  className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm flex items-center"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </motion.a>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/guideline"
                  className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm flex items-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documentation
                </motion.a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Support</h3>
              <div className="space-y-2">
                <motion.a
                  whileHover={{ x: 5 }}
                  href="/contribute"
                  className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Contribute
                </motion.a>
                <span className="block text-slate-400 text-sm">MIT License</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500"
        >
          <p>
            &copy; 2025 Lazycli. All rights reserved. Empowering developers
            globally.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
