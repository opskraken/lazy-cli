import {
  BookOpen,
  GitBranch,
  Info,
  Shield,
  Terminal,
  Wrench,
} from "lucide-react";

export default function DesktopSidebarNavigation({
  setActiveSection,
  activeSection,
}: {
  setActiveSection: (section: string) => void;
  activeSection: string;
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
      <div className="hidden md:block w-80 h-screen bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 p-6 pt-24 sticky top-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Windows Setup Guide
          </h1>
          <p className="text-slate-400">
            Complete development environment setup
          </p>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-gradient-to-r from-cyan-400 to-blue-400 text-white cursor-pointer"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50 cursor-pointer"
              }`}
            >
              {section.icon}
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
