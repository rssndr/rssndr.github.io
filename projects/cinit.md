# cinit

Quick C project initialisation

GitHub repo: <a href="https://https://github.com/rssndr/cinit" target="_blank">cinit</a> <br>
Last update: 2026/04/24

## **Description**
Cinit is a **bash script** designed to automate the initialization of C projects. It generates a standardized directory structure, including a `Makefile`, `.gitignore`, `main.c`, `README.md`, and a dynamically generated `LICENSE` file. The tool is built to save time, reduce manual errors, and enforce consistency across projects.

## **Features**
- **Dynamic License Generation**: Automatically creates a `LICENSE` file with your name and the current year. Supports multiple license types (MIT, GPL, etc.).
- **Customizable Templates**: Configure default files, license types, and project settings via a config file (`~/.config/cinit/cinit.conf`).
- **Easy Installation**: Install with a single command and start using it immediately.
- **Command-Line Options**: Override defaults with flags like `--owner`, `--license`, and `--files`.

## **Technologies**
- **Bash**: Scripting language for automation.
- **Makefile**: Default build system for C projects.
- **Git**: Version control integration with a pre-configured `.gitignore`.

## **Why It Matters**
I built Cinit to solve a personal pain point: **spending too much time copying and pasting files** for every new C project. By automating this process, I can focus on writing code instead of setting up repositories. The project is open-source, so others can use it, contribute, or adapt it to their needs.

## **Demo**

![](../assets/cinit.gif)

