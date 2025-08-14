"use client";
import { motion } from "framer-motion";
import { Wrench, Clock, Sparkles, Zap, Globe } from "lucide-react";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function MaintenanceAnnouncement() {
  const [isClient, setIsClient] = useState(false);
  const [floatingElements, setFloatingElements] = useState<
    Array<{ left: string; top: string }>
  >([]);

  useEffect(() => {
    setIsClient(true);
    // Generate floating elements positions on client side only
    const elements = Array.from({ length: 15 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setFloatingElements(elements);
  }, []);

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
    },
  };

  const newFeatures = [
    {
      icon: Sparkles,
      title: "Better UI",
      description:
        "Completely redesigned interface with modern aesthetics and improved user experience",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Globe,
      title: "More Language Integration",
      description:
        "Extended support for multiple programming languages and frameworks",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Zap,
      title: "Optimized Scripts",
      description:
        "Enhanced performance with faster execution and reduced resource usage",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-slate-900 text-white ${inter.className} relative overflow-hidden`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20" />

        {/* Grid Pattern */}
        <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23334155" fill-opacity="0.1"%3E%3Ccircle cx="3" cy="3" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)]' />

        {/* Floating Elements */}
        {isClient &&
          floatingElements.map((element, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                i % 4 === 0
                  ? "w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400"
                  : i % 4 === 1
                  ? "w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400"
                  : i % 4 === 2
                  ? "w-1 h-1 bg-gradient-to-r from-emerald-400 to-teal-400"
                  : "w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-red-400"
              }`}
              style={{
                left: element.left,
                top: element.top,
              }}
              variants={floatingVariants}
              initial="initial"
              animate="animate"
              transition={{
                delay: i * 0.2,
                duration: 4 + (i % 4),
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1],
              }}
            />
          ))}

        {/* Large Glowing Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"
          variants={{
            initial: { scale: 1, opacity: 0.3 },
            animate: {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
            },
          }}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          variants={{
            initial: { scale: 1, opacity: 0.3 },
            animate: {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
            },
          }}
          initial="initial"
          animate="animate"
          transition={{ delay: 2 }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          {/* Maintenance Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full mb-10 backdrop-blur-sm shadow-lg shadow-orange-500/10"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Wrench className="w-5 h-5 text-orange-400 mr-3" />
            </motion.div>
            <span className="text-orange-400 text-base font-semibold tracking-wide">
              Maintenance Mode
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="block bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent drop-shadow-sm"
              >
                We&#39;re Upgrading
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                }}
                className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg"
              >
                LazyCLI Experience
              </motion.span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            We&lsquo;re working hard to bring you an even better LazyCLI
            experience. Our new version includes exciting features and
            improvements that will revolutionize your development workflow.
          </motion.p>

          {/* Maintenance Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-600/50 rounded-3xl p-10 mx-4 sm:mx-8 lg:mx-auto max-w-2xl mb-16 shadow-2xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all duration-500"
          >
            <div className="flex items-center justify-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Clock className="w-10 h-10 text-cyan-400 mr-4" />
              </motion.div>
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Expected Downtime
              </span>
            </div>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
              className="text-5xl font-black bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-4 drop-shadow-lg"
            >
              5-7 Days
            </motion.div>
            <div className="text-slate-300 text-lg font-medium">
              We&lsquo;re taking time to deliver exceptional improvements!
            </div>
          </motion.div>

          {/* What's Coming */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                What&lsquo;s Coming in the New Version
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {newFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{
                      delay: 1.2 + index * 0.2,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-8 hover:border-cyan-400/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20"
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-100 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed group-hover:text-slate-200 transition-colors">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Status Updates */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.8 }}
            className="mt-20 mb-12 text-center px-4"
          >
            <p className="text-slate-400 text-sm">
              For real-time updates, follow us on{" "}
              <a
                href="https://github.com/iammhador/lazycli"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                GitHub
              </a>{" "}
              or contact our support team.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar styles */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1e293b;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #3b82f6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #2563eb);
        }
      `}</style>
    </div>
  );
}
