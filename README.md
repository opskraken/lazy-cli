# ⚡ LazyCLI– The Universal CLI Vault

LazyCLI a powerful, Bash-based command-line interface that simplifies your development and deployment workflow — from initializing projects to pushing code to GitHub — all in a single CLI tool.

> ✅ Currently supports Node.js, Next.js, Vite.js, and GitHub automation.  
> 🔜 Python, Docker, Flutter, Rust, and more are coming soon.

---

## About

LazyCLI is a command line interface tool that streamlines your development workflow with automated GitHub operations, Node.js project setup, and scaffolding for Next.js and Vite projects.

More info and scripts are available at the [LazyCLI website](https://lazycli.vercel.app/).

---

## Installation

Run this command in your bash shell (Linux, WSL, or Git Bash on Windows):

```bash
curl -s https://lazycli.xyz/install.sh | bash

```

````

> ℹ️ On Windows? [See installation guide →](https://lazycli.xyz/windows)

After installation, restart your terminal or run:

```bash
lazycli github push
lazycli node-js init
lazycli next-js init
lazycli vite-js init
```

More commands and options can be found on [lazycli.xyz](https://lazycli.xyz/).

---

## 🖥️ Works On

- ✅ macOS
- ✅ Linux (Ubuntu, Arch, etc.)
- ⚠️ Windows (requires WSL or Git Bash — [see guide](https://lazycli.xyz/windows))

---

## 🤝 Contributing

Pull requests are welcome!
If you’d like to contribute commands, improvements, or docs:

```bash
lazy [command] [subcommand] [arguments]
```

### Examples:

- Push changes to GitHub with a commit message:

  ```bash
  lazy github push "Fixed: API error handling"
  ```

- Clone a GitHub repo and auto install dependencies:

  ```bash
  lazy github clone https://github.com/iammhador/lazycli.git
  ```

- Initialize a Node.js project:

  ```bash
  lazy node-js init
  ```

- Create a Next.js app:

  ```bash
  lazy next-js create
  ```

- Create a Vite app:

  ```bash
  lazy vite-js create
  ```

---

## Git Line Endings Warning (Windows Users)

If you see this warning when committing:

```
warning: in the working copy of 'public/scripts/lazy.sh', LF will be replaced by CRLF the next time Git touches it
```

This is Git notifying you about line ending conversions between Unix (LF) and Windows (CRLF).

To fix or avoid this warning, you can:

1. Configure Git to handle line endings consistently:

   ```bash
   git config --global core.autocrlf input
   ```

2. Add a `.gitattributes` file to your project root with:

   ```
   *.sh text eol=lf
   ```

3. Convert existing files to LF line endings using tools like `dos2unix` or editor features.

---

## Contributing

Contributions and suggestions are welcome! Please open issues or pull requests on the repository.

---

## License

MIT License © 2025 LazyCLI

---

For more information, visit: [https://lazycli.vercel.app/](https://lazycli.vercel.app/)

```

---

If you want, I can also help generate a `.gitattributes` file content or commands for users to run!
```
````
