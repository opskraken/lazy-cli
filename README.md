# LazyCLI

Automate your dev flow like a lazy pro 💤

---

## About

LazyCLI is a command line interface tool that streamlines your development workflow with automated GitHub operations, Node.js project setup, and scaffolding for Next.js and Vite projects.

More info and scripts are available at the [LazyCLI website](https://lazycli.vercel.app/).

---

## Installation

Run this command in your bash shell (Linux, WSL, or Git Bash on Windows):

```bash
curl -s https://lazycli.vercel.app/scripts/install.sh | bash
```

````

This will install the `lazy` command-line tool to `~/.lazycli` and add it to your PATH.

After installation, restart your terminal or run:

```bash
source ~/.bashrc
```

---

## Usage

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
