**@newkrok/three-utils v2.0.0**

***

# THREE Utils

[![Run Tests](https://github.com/NewKrok/three-utils/actions/workflows/test.yml/badge.svg)](https://github.com/NewKrok/three-utils/actions/workflows/test.yml)
[![NPM Version](https://img.shields.io/npm/v/@newkrok/three-utils)](https://www.npmjs.com/package/@newkrok/three-utils)
[![NPM Downloads](https://img.shields.io/npm/dm/@newkrok/three-utils)](https://www.npmjs.com/package/@newkrok/three-utils)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@newkrok/three-utils)](https://bundlephobia.com/package/@newkrok/three-utils)

Three.js-based utility library providing essential tools for THREE.js applications including assets loading, audio management, geometry utilities, and more.

## Features

• **Asset Management** - Streamlined loading and management of 3D models, textures, and other assets
• **Audio Integration** - Easy-to-use audio management for 3D environments
• **Geometry Utilities** - Helper functions for geometric calculations and operations
• **Object Utilities** - Deep object manipulation, merging, and comparison tools
• **Time Utilities** - Time formatting and management functions
• **Vector3 Utilities** - Enhanced Vector3 operations and calculations
• **Callback Utilities** - Advanced callback management and throttling
• **Dispose Utilities** - Memory management and cleanup helpers
• **Token Utilities** - Unique ID generation and token management
• **TypeScript Support** - Full TypeScript definitions included
• **Modular Exports** - Import only what you need for optimal bundle size

## Live Demo & Examples

🚀 **Coming Soon** - Interactive examples and live demonstrations

## Installation

### NPM

```bash
npm install @newkrok/three-utils
```

### CDN (Browser)

Include the script directly in your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/@newkrok/three-utils@latest/dist/three-utils.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/@newkrok/three-utils@latest/dist/three-utils.min.js"></script>
```

## Usage

### Basic Import

```typescript
import { 
  CallbackUtils, 
  DisposeUtils, 
  ObjectUtils, 
  TimeUtils, 
  TokenUtils, 
  Vector3Utils, 
  GeomUtils 
} from '@newkrok/three-utils';

// Generate a unique ID
const uniqueId = TokenUtils.getUniqueId();

// Format time display
const formattedTime = TimeUtils.formatTime(65432); // "01:05"

// Deep merge objects
const merged = ObjectUtils.deepMerge(obj1, obj2);

// Vector3 operations
const absVector = Vector3Utils.absVector3(someVector);
```

### Modular Import

```typescript
// Import specific modules only
import { CallbackUtils } from '@newkrok/three-utils';
import { GeomUtils } from '@newkrok/three-utils';

// Use callback throttling
CallbackUtils.callWithReducer('myKey', myFunction, 16); // ~60fps

// Check if point is in triangle
const isInside = GeomUtils.isPointInATriangle(point, triangle);
```

### Asset Loading

```typescript
import { Assets } from '@newkrok/three-utils/assets';

// Load 3D models, textures, and other assets
// (See API documentation for detailed usage)
```

### Audio Management

```typescript
import { Audio } from '@newkrok/three-utils/audio';

// Manage 3D audio in your Three.js scenes
// (See API documentation for detailed usage)
```

## Used In

This utility library is actively used in various Three.js projects:
- [Three Game](https://github.com/NewKrok/three-game) - 3D game development framework

## Documentation

Automatically generated TypeDoc: [https://newkrok.github.io/three-utils/](https://newkrok.github.io/three-utils/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Istvan Krisztian Somoracz](https://github.com/NewKrok)
