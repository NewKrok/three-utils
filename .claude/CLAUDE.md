# THREE Utils - Claude Context Documentation

## Project Overview

**three-utils** is a comprehensive TypeScript utility library for Three.js applications, providing essential tools for asset management, audio integration, geometry operations, and various utility functions.

### Key Information
- **Package**: `@newkrok/three-utils`
- **Version**: 2.0.1
- **Author**: Istvan Krisztian Somoracz
- **License**: MIT
- **Repository**: https://github.com/NewKrok/three-utils
- **Documentation**: https://newkrok.github.io/three-utils/

### Main Dependencies
- Three.js ^0.180.0 (peer dependency)
- TypeScript 5.7.3
- Jest for testing
- Webpack for bundling
- TypeDoc for documentation generation

## Architecture & Project Structure

```
three-utils/
├── src/
│   ├── assets/          # Asset loading and management
│   │   ├── assets.ts
│   │   ├── loaders.ts
│   │   └── index.ts
│   ├── audio/           # Audio management for 3D environments
│   │   ├── audio.ts
│   │   └── index.ts
│   ├── __tests__/       # Unit tests
│   ├── callback-utils.ts
│   ├── dispose-utils.ts
│   ├── geom-utils.ts
│   ├── object-utils.ts
│   ├── time-utils.ts
│   ├── token.ts
│   ├── vector3-utils.ts
│   └── index.ts
├── dist/                # Compiled output
├── docs/                # TypeDoc generated documentation
└── .claude/             # Claude configuration and documentation
    ├── CLAUDE.md        # This file
    └── doc/             # Additional architecture documentation
```

## Core Modules

### 1. Assets (`src/assets/`)
Handles loading and management of 3D models, textures, and other assets for Three.js scenes.

**Key Components**:
- Asset loaders (GLTF, textures, etc.)
- Asset caching and management
- Progress tracking

### 2. Audio (`src/audio/`)
Provides audio management capabilities for 3D spatial audio in Three.js environments.

**Key Components**:
- 3D audio positioning
- Audio playback control
- Volume and spatial audio management

### 3. Utility Modules

- **callback-utils.ts**: Callback management, throttling, and reducer functions
- **dispose-utils.ts**: Memory management and cleanup for Three.js objects
- **geom-utils.ts**: Geometric calculations (point in triangle, distance calculations, etc.)
- **object-utils.ts**: Deep object operations (merge, clone, comparison)
- **time-utils.ts**: Time formatting and manipulation
- **token.ts**: Unique ID generation and token management
- **vector3-utils.ts**: Enhanced Three.js Vector3 operations

## Development Guidelines

### Code Style
- **Language**: TypeScript with strict mode enabled
- **Formatting**: Prettier with configuration in `.prettierrc`
- **Linting**: ESLint with TypeScript support
- **Testing**: Jest with comprehensive test coverage

### Best Practices
1. **Modular Design**: Each utility module should be independent and tree-shakeable
2. **Type Safety**: Full TypeScript support with exported types
3. **Performance**: Optimize for Three.js runtime performance
4. **Memory Management**: Always provide dispose/cleanup utilities for Three.js objects
5. **Testing**: Write unit tests for all utility functions
6. **Documentation**: Use JSDoc comments for TypeDoc generation

### Code Patterns
```typescript
// Export pattern for utilities
export const ModuleUtils = {
  functionName: (...args) => {
    // Implementation
  },
};

// Type exports for public APIs
export type { TypeName } from './module';
```

### Testing
- Tests located in `src/__tests__/`
- Run tests: `npm test`
- Watch mode: `npm run test:watch`
- Coverage reports generated in `coverage/`

### Build Process
```bash
npm run build    # Clean build with TypeScript + Webpack
npm run docs     # Generate TypeDoc documentation
npm run lint     # Run ESLint
```

## Module Export Strategy

The package uses a modular export strategy for optimal tree-shaking:

```javascript
// Main entry point
"." → "./dist/index.js"

// Subpath exports
"./assets" → "./dist/assets/index.js"
"./audio" → "./dist/audio/index.js"
```

This allows users to import only what they need:
```typescript
import { CallbackUtils } from '@newkrok/three-utils';
import { Assets } from '@newkrok/three-utils/assets';
```

## Integration with Three.js

This library is designed to work seamlessly with Three.js applications:

- **Compatible with Three.js 0.180.0+**
- Utilities accept and return Three.js objects (Vector3, Object3D, etc.)
- Follows Three.js patterns and conventions
- Memory management aligned with Three.js lifecycle

## Used By

- [three-game](https://github.com/NewKrok/three-game) - 3D game development framework

## Git Workflow

### Commit Convention
Uses Conventional Commits with commitlint:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Maintenance tasks

### Husky Hooks
Pre-commit hooks configured for:
- Linting
- Testing
- Commit message validation

### Branches
- `master` - Main branch (production)
- Feature branches - For new development

## Publishing

### NPM Publishing
```bash
npm run prepublishOnly  # Runs build + docs generation automatically
npm publish            # Publish to NPM
```

Package is published as: `@newkrok/three-utils`

### Distribution
- NPM: https://www.npmjs.com/package/@newkrok/three-utils
- CDN: jsDelivr and unpkg support
- Bundle: Webpack-optimized minified bundle

## Performance Considerations

1. **Tree-shaking**: Modular exports enable optimal bundle sizes
2. **Callback Throttling**: Use `CallbackUtils.callWithReducer` for performance-critical loops
3. **Memory Management**: Always dispose of Three.js objects using `DisposeUtils`
4. **Vector Operations**: Reuse Vector3 instances where possible

## Common Development Tasks

### Adding a New Utility Module
1. Create file in `src/[module-name].ts`
2. Export as object with named functions
3. Add unit tests in `src/__tests__/[module-name].test.ts`
4. Export from `src/index.ts`
5. Add JSDoc comments for documentation

### Updating Dependencies
```bash
npm update              # Update within semver ranges
npm outdated           # Check for outdated packages
```

### Analyzing Bundle Size
```bash
npm run build          # Generates bundle-report.json
# Review with webpack-bundle-analyzer
```

## Troubleshooting

### Common Issues
- **Build Errors**: Ensure TypeScript version compatibility
- **Test Failures**: Check Three.js peer dependency version
- **Type Errors**: Verify @types/three matches three version

### Debug Mode
```bash
npm run test -- --verbose  # Detailed test output
npm run lint -- --debug    # ESLint debug info
```

## Future Enhancements

Planned improvements:
- Live demo site with interactive examples
- Expanded geometry utilities
- Additional asset loaders
- Performance monitoring utilities

## Questions for Claude

When working on this project, consider:

1. **Compatibility**: Does the change maintain Three.js compatibility?
2. **Tree-shaking**: Will this addition be tree-shakeable?
3. **Performance**: Is this optimized for runtime performance?
4. **Types**: Are all public APIs fully typed?
5. **Tests**: Are unit tests provided?
6. **Documentation**: Is JSDoc present for TypeDoc?

## Additional Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Project Documentation](https://newkrok.github.io/three-utils/)
- [GitHub Repository](https://github.com/NewKrok/three-utils)
