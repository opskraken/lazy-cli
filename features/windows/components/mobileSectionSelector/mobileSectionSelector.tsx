import {
  BookOpen,
  ChevronDown,
  GitBranch,
  Info,
  Shield,
  Terminal,
  Wrench,
} from "lucide-react";
import React from "react";

export default function MobileSectionSelector({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  const sections = [
    { id: "overview", label: "Overview", icon: <Info className="w-4 h-4" /> },
    {
      id: "requirements",
      label: "Requirements",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "git-bash",
      label: "Git Bash Setup",
      icon: <GitBranch className="w-4 h-4" />,
    },
    {
      id: "wsl",
      label: "WSL Installation",
      icon: <Terminal className="w-4 h-4" />,
    },
    {
      id: "troubleshooting",
      label: "Troubleshooting",
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      id: "resources",
      label: "Resources",
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];
  return (
    <>
      <div className="md:hidden sticky top-16 z-20 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Windows Setup Guide</h1>
          <div className="relative">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="appearance-none bg-slate-800 text-white px-4 py-2 pr-8 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </>
  );
}
