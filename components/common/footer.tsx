"use client";
import { easeInOut, motion } from "framer-motion";
import {
  Terminal,
  BookOpen,
  ExternalLink,
  Star,
  Github,
  Zap,
  Download,
  Command,
  FileText,
  Users,
  Tag,
  Monitor,
  Scale,
} from "lucide-react";

import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

  // Use window.location.origin as fallback when NEXT_PUBLIC_LIVE_URL is not available
  const baseUrl = process.env.NEXT_PUBLIC_LIVE_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '');
    
  const { data } = useSWR(
    `${baseUrl}/api/stars`,
    fetcher,
    { refreshInterval: 60000 }
  );

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between lg:items-start"
        >
          {/* Brand Section */}
          <div className="mb-8 lg:mb-0 text-center lg:text-left lg:max-w-md">
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <div className="relative">
                <Terminal className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400 mr-3" />
                <motion.div
                  className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-20"
                  variants={glowVariants}
                  initial="initial"
                  animate="animate"
                />
              </div>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                LazyCLI
              </span>
            </div>
            <p className="text-slate-400 text-sm sm:text-base mb-4 px-4 sm:px-0">
              Automating development workflows, one command at a time. Built
              with ❤️ for developers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center text-slate-400 text-sm">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{data?.stars} GitHub Stars</span>
              </div>
              <div className="hidden sm:block text-slate-400 text-sm">•</div>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="https://github.com/iammhador/lazycli?tab=MIT-1-ov-file#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors text-sm flex items-center"
              >
                <Scale className="w-4 h-4 mr-1" />
                MIT License
              </motion.a>
            </div>
          </div>

          {/* Links Section */}
          <div className="w-full lg:w-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">
                  Navigation
                </h3>
                <div className="space-y-2">
                  {[
                    { name: "Features", href: "#features", icon: Zap },
                    {
                      name: "Installation",
                      href: "#installation",
                      icon: Download,
                    },
                    { name: "Commands", href: "#commands", icon: Command },
                  ].map((item) => (
                    <motion.a
                      key={item.name}
                      whileHover={{ x: 5 }}
                      href={item.href}
                      className="block text-slate-400 hover:text-cyan-400 transition-colors text-xs sm:text-sm flex items-center"
                    >
                      <item.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">
                  Pages
                </h3>
                <div className="space-y-2">
                  {[
                    { name: "Guideline", href: "/guideline", icon: FileText },
                    { name: "Contribute", href: "/contribute", icon: Users },
                    { name: "Versions", href: "/versions", icon: Tag },
                    { name: "Windows", href: "/windows", icon: Monitor },
                  ].map((item) => (
                    <motion.a
                      key={item.name}
                      whileHover={{ x: 5 }}
                      href={item.href}
                      className="block text-slate-400 hover:text-cyan-400 transition-colors text-xs sm:text-sm flex items-center"
                    >
                      <item.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">
                  Resources
                </h3>
                <div className="space-y-2">
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="https://github.com/iammhador/lazycli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-slate-400 hover:text-cyan-400 transition-colors text-xs sm:text-sm flex items-center"
                  >
                    <Github className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">GitHub</span>
                  </motion.a>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="/guideline"
                    className="block text-slate-400 hover:text-cyan-400 transition-colors text-xs sm:text-sm flex items-center"
                  >
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Documentation</span>
                  </motion.a>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">
                  Support
                </h3>
                <div className="space-y-2">
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="/contribute"
                    className="block text-slate-400 hover:text-cyan-400 transition-colors text-xs sm:text-sm flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">Contribute</span>
                  </motion.a>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="https://github.com/iammhador/lazycli?tab=MIT-1-ov-file#readme"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-slate-400 hover:text-cyan-400 transition-colors text-xs sm:text-sm flex items-center"
                  >
                    <Scale className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">MIT License</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="border-t border-slate-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-slate-500"
        >
          <p>
            &copy; 2025 LazyCLI. All rights reserved. Empowering developers
            globally.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
