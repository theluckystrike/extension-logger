# Contributing to extension-logger

Thank you for your interest in contributing to extension-logger! This guide will help you get started.

## How to Fork and Clone

1. **Fork the repository**: Click the "Fork" button on the [extension-logger repository](https://github.com/theluckystrike/extension-logger)
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/extension-logger.git
   cd extension-logger
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/theluckystrike/extension-logger.git
   ```

## Development Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Watch mode for development
npm run dev
```

### Project Structure

```
extension-logger/
├── src/              # Source code
├── dist/             # Compiled output
├── .github/          # GitHub workflows
├── jest.config.js    # Jest configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Project dependencies
```

## Code Style Guidelines

### General Rules

- Use TypeScript for all new code
- Follow the existing code patterns in the project
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and concise
- Maximum line length: 100 characters

### Type Conventions

- Use `unknown` instead of `any` when the type is not known
- Use explicit return types for exported functions
- Prefer interfaces over type aliases for object shapes

### Formatting

- Use 4 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects and arrays

## How to Submit Pull Requests

1. **Sync your fork**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b my-feature-branch
   ```

3. **Make your changes**:
   - Write your code following the code style guidelines
   - Add or update tests as needed
   - Update documentation if required

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push to your fork**:
   ```bash
   git push origin my-feature-branch
   ```

6. **Submit a Pull Request**:
   - Go to the [original repository](https://github.com/theluckystrike/extension-logger)
   - Click "New Pull Request"
   - Select your fork and feature branch
   - Fill in the PR template with details about your changes
   - Submit the PR

### PR Guidelines

- Ensure all tests pass before submitting
- Keep PRs focused on a single feature or fix
- Include a clear description of what the PR does
- Link any related issues

## Issue Reporting Guidelines

When reporting issues, please include:

- **A clear description of the problem**
- **Steps to reproduce the issue**
- **The expected behavior versus actual behavior**
- **Your environment** (Chrome version, OS, extension type)
- **Any relevant code samples or error messages**

Please check existing issues before creating a new one to avoid duplicates.

---

Built at [zovo.one](https://zovo.one) by [theluckystrike](https://github.com/theluckystrike)
