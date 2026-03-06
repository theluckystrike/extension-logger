# Contributing to extension-logger

Thank you for your interest in contributing to extension-logger. This document outlines the process for contributing to the project.

## REPORTING ISSUES

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce the issue
- The expected behavior versus actual behavior
- Your environment (Chrome version, OS, extension type)
- Any relevant code samples or error messages

Please check existing issues before creating a new one to avoid duplicates.

## DEVELOPMENT WORKFLOW

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes following the code style guidelines
4. Write tests for new functionality
5. Ensure all tests pass
6. Commit with clear, descriptive messages
7. Push to your fork and submit a pull request

### Building the Project

```bash
npm install
npm run build
```

### Running Tests

```bash
npm test
```

## CODE STYLE

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

## TESTING

All new features should include appropriate tests. The project uses Jest for testing.

- Test files should be placed alongside the source files with `.test.ts` extension
- Cover edge cases and error conditions
- Keep tests focused and independent

## LICENSE

By contributing to extension-logger, you agree that your contributions will be licensed under the MIT License.
