# Architecture Documentation

## System Overview

three-utils is designed as a collection of independent, modular utilities for Three.js applications. The architecture emphasizes:

- **Modularity**: Each utility module is self-contained
- **Tree-shakeable**: Import only what you need
- **Type-safe**: Full TypeScript support
- **Performance-optimized**: Minimal runtime overhead
- **Memory-conscious**: Proper cleanup and disposal patterns

## Module Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     @newkrok/three-utils                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Assets     │  │    Audio     │  │  Core Utils  │     │
│  │   Module     │  │   Module     │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│        │                  │                   │             │
│        │                  │                   │             │
│        v                  v                   v             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             Three.js Core (peer dependency)          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Core Utility Modules

### 1. CallbackUtils
**Purpose**: Manage callback execution with throttling and deduplication

**Key Functions**:
- `callWithReducer()`: Throttle callback execution (useful for render loops)
- Prevents excessive function calls in high-frequency scenarios

**Use Cases**:
- Animation frame callbacks
- Event handlers that fire frequently
- Performance optimization in render loops

### 2. DisposeUtils
**Purpose**: Memory management and cleanup for Three.js objects

**Key Functions**:
- Dispose geometries
- Dispose materials
- Clean up textures
- Object3D hierarchy cleanup

**Use Cases**:
- Scene cleanup
- Asset unloading
- Memory leak prevention

### 3. GeomUtils
**Purpose**: Geometric calculations and spatial operations

**Key Functions**:
- Point-in-triangle tests
- Distance calculations
- Geometric predicates

**Use Cases**:
- Collision detection
- Spatial queries
- Physics calculations

### 4. ObjectUtils
**Purpose**: Deep object manipulation utilities

**Key Functions**:
- `deepMerge()`: Merge objects recursively
- `deepClone()`: Clone objects deeply
- Object comparison

**Use Cases**:
- Configuration merging
- State management
- Data transformation

### 5. TimeUtils
**Purpose**: Time formatting and display

**Key Functions**:
- `formatTime()`: Convert milliseconds to readable format

**Use Cases**:
- Game timers
- Animation duration display
- Performance metrics

### 6. TokenUtils
**Purpose**: Unique identifier generation

**Key Functions**:
- `getUniqueId()`: Generate unique IDs

**Use Cases**:
- Object identification
- Key generation
- Entity management

### 7. Vector3Utils
**Purpose**: Enhanced Vector3 operations

**Key Functions**:
- `absVector3()`: Absolute value of vector components
- Vector transformations
- Vector utilities

**Use Cases**:
- 3D math operations
- Position calculations
- Direction vectors

## Asset Management System

```
┌──────────────────────────────────────────────┐
│         Asset Management Layer                │
├──────────────────────────────────────────────┤
│                                               │
│  ┌─────────────┐      ┌─────────────┐       │
│  │   Loaders   │─────▶│   Assets    │       │
│  │             │      │   Manager   │       │
│  └─────────────┘      └─────────────┘       │
│        │                     │               │
│        │                     │               │
│        v                     v               │
│  ┌────────────────────────────────┐         │
│  │    Three.js LoadingManager     │         │
│  └────────────────────────────────┘         │
│                                               │
└──────────────────────────────────────────────┘
```

### Asset Module Structure
- **Loaders**: Wrapper around Three.js loaders (GLTFLoader, TextureLoader, etc.)
- **Caching**: Asset reuse and memory optimization
- **Progress Tracking**: Loading state management
- **Error Handling**: Graceful failure handling

### Features
- Lazy loading support
- Asset preloading
- Cache management
- Progress callbacks

## Audio System

```
┌──────────────────────────────────────────────┐
│           Audio Management Layer              │
├──────────────────────────────────────────────┤
│                                               │
│  ┌─────────────┐      ┌─────────────┐       │
│  │   Audio     │─────▶│  Positional │       │
│  │  Manager    │      │    Audio    │       │
│  └─────────────┘      └─────────────┘       │
│        │                     │               │
│        │                     │               │
│        v                     v               │
│  ┌────────────────────────────────┐         │
│  │  Three.js Audio & AudioListener│         │
│  └────────────────────────────────┘         │
│                                               │
└──────────────────────────────────────────────┘
```

### Audio Module Features
- 3D spatial audio positioning
- Volume control
- Audio source management
- Integration with Three.js AudioListener

## Build & Distribution Architecture

### TypeScript Compilation Flow
```
src/           →  tsc  →  dist/
(TypeScript)              (JavaScript + .d.ts)
```

### Webpack Bundling Flow
```
dist/          →  webpack  →  dist/three-utils.min.js
(ES Modules)                  (UMD Bundle)
```

### Package Exports Strategy
```javascript
{
  ".": "./dist/index.js",           // Main entry
  "./assets": "./dist/assets/index.js",  // Assets module
  "./audio": "./dist/audio/index.js"     // Audio module
}
```

This enables:
- Tree-shaking for optimal bundle size
- Selective imports
- Module isolation

## Testing Architecture

```
┌──────────────────────────────────────────────┐
│              Testing Layer                    │
├──────────────────────────────────────────────┤
│                                               │
│  ┌─────────────────────────────────────┐    │
│  │        Unit Tests (Jest)            │    │
│  │  - callback-utils.test.ts           │    │
│  │  - dispose-utils.test.ts            │    │
│  │  - geom-utils.test.ts               │    │
│  │  - object-utils.test.ts             │    │
│  │  - time-utils.test.ts               │    │
│  │  - token.test.ts                    │    │
│  │  - vector3-utils.test.ts            │    │
│  └─────────────────────────────────────┘    │
│                                               │
└──────────────────────────────────────────────┘
```

### Test Strategy
- **Unit Tests**: Each utility module has dedicated tests
- **Coverage**: Comprehensive test coverage for all utilities
- **Isolation**: Tests run independently
- **Mocking**: Three.js objects mocked where necessary

## Documentation Architecture

```
Source Code (JSDoc)  →  TypeDoc  →  HTML Documentation
                                ↓
                         docs/ (GitHub Pages)
                                ↓
                    https://newkrok.github.io/three-utils/
```

### Documentation Generation
- JSDoc comments in source code
- TypeDoc generates Markdown and HTML
- Published to GitHub Pages
- API reference auto-generated

## Memory Management Patterns

### Disposal Pattern
```typescript
// Creation
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial();
const mesh = new THREE.Mesh(geometry, material);

// Usage
scene.add(mesh);

// Cleanup
scene.remove(mesh);
DisposeUtils.dispose(mesh);  // Handles geometry, material, textures
```

### Resource Lifecycle
1. **Creation**: Allocate Three.js resources
2. **Usage**: Add to scene, render
3. **Disposal**: Remove from scene, dispose resources
4. **Verification**: No memory leaks

## Performance Optimization Strategies

### 1. Callback Throttling
```typescript
// Without throttling (every frame)
renderer.render(scene, camera);

// With throttling (controlled frequency)
CallbackUtils.callWithReducer('render', () => {
  renderer.render(scene, camera);
}, 16); // ~60fps
```

### 2. Object Pooling (Future Enhancement)
- Reuse geometry instances
- Pool frequently created objects
- Reduce garbage collection pressure

### 3. Tree-shaking
```typescript
// User imports only what they need
import { TimeUtils } from '@newkrok/three-utils';
// Other unused utilities are excluded from final bundle
```

## Integration Patterns

### Usage in Applications
```typescript
// 1. Import utilities
import { Assets } from '@newkrok/three-utils/assets';
import { CallbackUtils } from '@newkrok/three-utils';

// 2. Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer();

// 3. Load assets
Assets.loadModel('model.gltf').then(gltf => {
  scene.add(gltf.scene);
});

// 4. Render loop with throttling
function animate() {
  requestAnimationFrame(animate);

  CallbackUtils.callWithReducer('render', () => {
    renderer.render(scene, camera);
  }, 16);
}
```

## Dependency Management

### Core Dependencies
- **Three.js**: Peer dependency (user provides)
- **TypeScript**: Development dependency
- **Jest**: Testing framework

### Philosophy
- Minimal runtime dependencies
- Three.js as peer dependency (user controls version)
- All other dependencies are dev-only

## Future Architecture Considerations

### Planned Enhancements
1. **Plugin System**: Allow extensions to core utilities
2. **WebWorker Support**: Offload heavy calculations
3. **WASM Integration**: Performance-critical operations
4. **State Management**: Optional state management utilities

### Scalability
- Architecture supports adding new modules without breaking changes
- Modular design allows independent module updates
- Export strategy enables gradual adoption
