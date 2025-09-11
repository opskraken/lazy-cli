"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Users, Star, GitFork } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

interface ApiResponse {
  stars: number;
  forks: number;
  openIssues: number;
  contributors: Contributor[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Contributors({
  containerVariants,
  itemVariants,
}: {
  containerVariants: import("framer-motion").Variants;
  itemVariants: import("framer-motion").Variants;
}) {
  const { data, isLoading, error, mutate } = useSWR<ApiResponse>(
    `  ${process.env.NEXT_PUBLIC_LIVE_URL}/api/stars`,
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: false,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      suspense: false,
      revalidateOnMount: true,
      dedupingInterval: 10000, // Deduplicate requests within 10 seconds
    }
  );

  // Force revalidation when component mounts
  useEffect(() => {
    mutate();
  }, [mutate]);

  // Fallback data when API fails
  const fallbackData = {
    stars: 0,
    forks: 0,
    openIssues: 0,
    contributors: [],
  };

  // Use data if available, otherwise use fallback
  const displayData = data || fallbackData;

  // Track if we've attempted to load data
  const [dataAttempted, setDataAttempted] = useState(false);

  // Mark data as attempted after first load attempt
  useEffect(() => {
    if (!dataAttempted && (data || error)) {
      setDataAttempted(true);
    }
  }, [data, error, dataAttempted]);

  console.log(displayData?.contributors, "displayData?.contributors");
  console.log(
    displayData.contributors.length,
    "displayData.contributors.length"
  );

  return (
    <section id="contributors" className="py-20 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Our Contributors
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Meet the amazing developers who help make LazyCLI better every day
          </p>
        </motion.div>

        {/* Repository Stats */}
        {displayData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6 text-center">
              <Star className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {displayData.stars}
              </div>
              <div className="text-slate-400">Stars</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6 text-center">
              <GitFork className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {displayData.forks}
              </div>
              <div className="text-slate-400">Forks</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {displayData.contributors?.length || 0}
              </div>
              <div className="text-slate-400">Contributors</div>
            </div>
          </motion.div>
        )}

        {/* Contributors Grid */}
        {displayData ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-2 max-w-4xl mx-auto"
          >
            {displayData.contributors
              .filter((contributor) => contributor.type === "User")
              .slice(0, 20) // Show more contributors in compact view
              .map((contributor) => (
                <motion.div
                  key={contributor.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group cursor-pointer"
                  onClick={() => window.open(contributor.html_url, "_blank")}
                >
                  <Image
                    src={contributor.avatar_url}
                    alt={`${contributor.login} - ${contributor.contributions} contributions`}
                    width={64}
                    height={64}
                    quality={95}
                    priority={true}
                    loading="eager"
                    className="w-16 h-16 rounded-full border-2 border-slate-600 group-hover:border-purple-400 transition-all duration-200 shadow-lg"
                    onLoad={(e) => {
                      // Ensure image is visible after load
                      const img = e.target as HTMLImageElement;
                      if (img.style.opacity !== "1") {
                        img.style.opacity = "1";
                      }
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 border border-slate-600">
                    <div className="font-medium">{contributor.login}</div>
                    <div className="text-slate-400 text-xs">
                      {contributor.contributions} contribution
                      {contributor.contributions !== 1 ? "s" : ""}
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              {isLoading && !dataAttempted ? (
                <>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Loading Contributors...
                  </h3>
                  <p className="text-slate-400">
                    Fetching the latest contributor information from GitHub
                  </p>
                </>
              ) : error ? (
                <>
                  <h3 className="text-xl font-semibold text-red-400 mb-2">
                    Failed to Load Contributors
                  </h3>
                  <p className="text-slate-400">
                    Unable to fetch contributor data. Please try again later.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Contributors Found
                  </h3>
                  <p className="text-slate-400">
                    No contributor data available at the moment.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.a
            href="https://github.com/iammhador/lazycli"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-400/10 to-pink-400/10 hover:from-purple-400/20 hover:to-pink-400/20 border border-purple-400/20 hover:border-purple-400/40 text-slate-600 hover:text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5" />
            <span>Contribute to LazyCLI</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
