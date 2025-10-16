# GitHub Copilot Instructions for THREE Utils

This file contains coding conventions and guidelines for the THREE Utils project to help GitHub Copilot generate consistent and appropriate code suggestions.

## TypeScript Conventions

- Use `type` instead of `interface` for object type definitions
- Import types with `import type { ... }` syntax
- Place complex type definitions in `src/types/` directory
- Export types with descriptive names

## Code Style Guidelines

- Follow existing project patterns and naming conventions
- Ensure all exported functions have JSDoc documentation
- Use strict TypeScript settings and explicit return types
- Prefer functional programming patterns where appropriate

## Three.js Specific Guidelines

- Always clone Three.js objects (Vector3, Matrix4, Quaternion) before modification
- Implement proper dispose patterns for Three.js resources (geometries, materials, textures)
- Use namespace-based exports for utility modules (e.g., `CallbackUtils`, `GeomUtils`)
- Maintain performance considerations for animation loops and real-time rendering

## Testing Requirements

- Write unit tests for all new functionality using Jest
- Place test files in `src/__tests__/` directory
- Aim for minimum 80% code coverage
- Include both positive and negative test cases

## Module Organization

- Keep utilities in separate files by functionality
- Use modular exports to support tree-shaking
- Maintain separate entry points for `assets` and `audio` modules
- Follow the existing file naming pattern (kebab-case)