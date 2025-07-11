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

## 🚀 Installation

Install globally with one command (macOS/Linux):

```bash
# Standard installation
curl -s https://lazycli.xyz/install.sh | bash

# Custom version installation
curl -s https://lazycli.xyz/install.sh | bash -s version_name
```

> 💡 **Windows users:** Requires WSL or Git Bash — [See installation guide →](https://lazycli.xyz/windows)

---

## ✅ Current Features

| Feature   | Description                                  |
| --------- | -------------------------------------------- |
| `github`  | Automate git add, commit, and push           |
| `node-js` | Initialize a Node.js project with `npm init` |
| `next-js` | Create a Next.js app using `create-next-app` |
| `vite-js` | Bootstrap a Vite.js project                  |

---

## 🔮 Upcoming Features

These features are planned for future updates:

- Python project bootstrapping
- Docker containerization support
- Deployment via PM2 and SSH
- Flutter, React Native, Go, Rust, .NET support
- Environment and secret management
- Auto-updating CLI (`lazycli update`)

---

## 🧪 Usage

Run commands globally from anywhere in your terminal:

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

| Platform       | Status             | Requirements    |
| -------------- | ------------------ | --------------- |
| 🍎 **macOS**   | ✅ Full Support    | Bash 4.0+       |
| 🐧 **Linux**   | ✅ Full Support    | Bash 4.0+       |
| 🪟 **Windows** | ⚠️ Partial Support | WSL or Git Bash |

---

## 🤝 Contributing

We welcome contributions! LazyCLI is an open-source project built for the developer community.

### Quick Start

```bash
git clone https://github.com/your-username/lazycli
cd lazycli
```

Please read the [contributing guidelines](CONTRIBUTING.md) before opening a PR.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Credits

Built and maintained by [iammhador](https://iammhador.xyz).
Inspired by the simplicity of automation.

---

```

---

Let me know if you want:
- A `CONTRIBUTING.md`
- A `LICENSE`
- A version that dynamically pulls features from a JSON or config

You're almost ready to launch 🚀
```

```

```
