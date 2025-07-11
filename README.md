<div align="center">
  <img src="./public/logo.png" alt="LazyCLI Logo" width="120" height="120">
  
  # ⚡ LazyCLI – The Universal CLI Vault
  
  **Automate your development workflow like a lazy pro** 💤
  
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![Version](https://img.shields.io/badge/version-1.0.2-blue.svg)](https://github.com/iammhador/lazycli)
  [![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)
  
  *A powerful, Bash-based command-line interface that simplifies your development and deployment workflow — from initializing projects to pushing code to GitHub — all in a single CLI tool.*
</div>

---

## 🚀 Quick Installation

Install globally with one command:

```bash
# Standard installation
curl -s https://lazycli.xyz/install.sh | bash

# Custom version installation
curl -s https://lazycli.xyz/install.sh | bash -s version_name
```

> 💡 **Windows users:** Requires WSL or Git Bash — [See installation guide →](https://lazycli.xyz/windows)

---

## ✨ Features Overview

### 🐙 GitHub Automation
- **`lazy github init`** - Initialize a new Git repository
- **`lazy github clone <repo-url>`** - Clone repository with auto-setup
- **`lazy github push "<message>"`** - Stage, commit, and push changes
- **`lazy github pull <base-branch> "<title>"`** - Create simple pull request
- **`lazy github pr <base-branch> "<message>"`** - Full PR workflow (pull, build, commit, push, create PR)

### 📦 Node.js Development
- **`lazy node-js init`** - Initialize Node.js + TypeScript project
- Auto-detects package manager (bun > pnpm > yarn > npm)
- Optional boilerplate with TypeScript setup
- Nodemon integration for development

### ⚛️ Next.js Scaffolding
- **`lazy next-js create`** - Create Next.js app with modern defaults
- TypeScript, Tailwind CSS, and ESLint pre-configured
- Optional packages: Zod, bcrypt, js-cookie, SWR, Lucide React, react-hot-toast
- shadcn/ui integration support

### ⚡ Vite.js Projects
- **`lazy vite-js create`** - Multi-framework Vite project creation
- Supports: Vanilla JS, React, Vue, Svelte
- Optional packages: axios, clsx, zod, react-hot-toast, react-router-dom, lucide-react
- Modern Tailwind CSS integration with DaisyUI support

### 🔧 System Features
- **`lazy --version`** - Show current version
- **`lazy upgrade`** - Auto-upgrade to latest version
- **`lazy --help`** - Comprehensive help system
- Smart package manager detection
- Cross-platform compatibility

---

## 📖 Usage Examples

### GitHub Workflow
```bash
# Initialize new repository
lazy github init

# Clone and setup project
lazy github clone https://github.com/user/repo.git

# Quick commit and push
lazy github push "Add new feature"

# Create pull request with full workflow
lazy github pr main "Implement user authentication"
```

### Project Creation
```bash
# Node.js with TypeScript
lazy node-js init

# Next.js with modern stack
lazy next-js create

# Vite + React with Tailwind
lazy vite-js create
```

---

## 🖥️ Platform Support

| Platform | Status | Requirements |
|----------|--------|--------------|
| 🍎 **macOS** | ✅ Full Support | Bash 4.0+ |
| 🐧 **Linux** | ✅ Full Support | Bash 4.0+ |
| 🪟 **Windows** | ⚠️ Partial Support | WSL or Git Bash |

---

## 🤝 Contributing

We welcome contributions! LazyCLI is an open-source project built for the developer community.

### Quick Start
```bash
# Fork and clone the repository
git clone https://github.com/your-username/lazycli.git
cd lazycli

# Test your changes
bash public/scripts/lazy.sh --help

# Submit your contribution
git add .
git commit -m "Add: new feature"
git push origin feature/your-feature
```

### Contribution Guidelines
- 📝 Follow existing code style and patterns
- 🧪 Test your changes thoroughly
- 📚 Update documentation for new features
- 🔍 Ensure cross-platform compatibility

For detailed guidelines, visit [lazycli.xyz/contribute](https://lazycli.xyz/contribute)

---

## 🔮 Roadmap

### Coming Soon
- 🐍 Python project scaffolding
- 🐳 Docker containerization support
- 🚀 Deployment automation (PM2, SSH)
- 📱 Flutter & React Native support
- 🦀 Rust & Go project templates
- 🔐 Environment & secret management
- 🌐 Multi-language support

### Future Versions
- Plugin system for custom commands
- GUI companion app
- Cloud integration (AWS, Vercel, Netlify)
- Team collaboration features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgments

**Built with ❤️ by [iammhador](https://iammhador.xyz)**

- Inspired by the developer community's need for workflow automation
- Special thanks to all contributors and users
- Powered by the simplicity of Bash scripting

---

<div align="center">
  
  **⭐ Star this repo if LazyCLI helps you stay lazy and code smart!**
  
  [🌐 Website](https://lazycli.xyz) • [📚 Documentation](https://lazycli.xyz/guideline) • [🤝 Contribute](https://lazycli.xyz/contribute) • [📋 Versions](https://lazycli.xyz/versions)
  
</div>
