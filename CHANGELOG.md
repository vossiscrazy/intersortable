# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-12-XX

### 🚀 Complete Rewrite - Breaking Changes

This version represents a complete rewrite of Intersortable with a focus on real-time movement, smooth animations, and developer-friendly callback APIs.

### ✨ New Features

- **Real-time DOM Manipulation**: Items now move during drag operations, not just on drop
- **FLIP Animations**: Smooth transitions for all affected elements using the FLIP technique
- **Ghost Items**: Invisible placeholder items automatically appear in empty containers
- **Callback-based API**: Simple `onPickup` and `onDrop` callbacks instead of complex event systems
- **TypeScript First**: Full type definitions with `ContainerState` and `IntersortableCallbacks` types
- **5.6kb Bundle**: Optimized build size, down from 7.4kb
- **React 19 Compatible**: Tested with latest React and Next.js versions

### 💥 Breaking Changes

- **API Complete Rewrite**: The entire initialization API has changed from attribute-based to callback-based
- **HTML Attributes**: Changed from `data-intersortable-container` to `data-intersortable-container-id`
- **HTML Attributes**: Changed from `data-intersortable-item` to `data-intersortable-item-id`
- **Initialization**: Now uses `new Intersortable(callbacks)` instead of auto-initialization
- **Removed Features**: No more `data-drag-handle`, `restoreSortOrder()`, or complex configuration options
- **State Format**: State structure changed to simple `{ [containerId]: string[] }` format

### 🎨 Visual Improvements

- **Smooth Animations**: All items animate to their new positions using Web Animations API
- **Visual Feedback**: Dragged items become semi-transparent while clone follows cursor
- **Clone Styling**: Clone appears slightly larger (1.05x scale) with subtle shadow
- **Empty State Handling**: Ghost items provide better targeting for empty containers

### 🏗️ Technical Changes

- **Performance**: Significant performance improvements for large lists
- **Browser Support**: Updated minimum requirements (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- **Dependencies**: Zero runtime dependencies maintained
- **Build System**: Updated build process with better TypeScript declarations

### 📝 Documentation

- **Complete README Rewrite**: New examples, API documentation, and usage patterns
- **TypeScript Examples**: Full TypeScript integration examples
- **React Patterns**: Best practices for React state management integration
- **Migration Guide**: Clear migration path from v1.x (see README)

### 🐛 Bug Fixes

- Fixed ghost item animations not working properly
- Fixed items sometimes flying back and forth during drag
- Fixed targeting issues with nested elements
- Improved cleanup and memory management

### 🔄 Migration from v1.x

This is a major breaking change. See the README for new usage patterns:

```tsx
// v1.x (old)
initSortable({
  onMove: (data) => { /* complex event handling */ }
})

// v2.0 (new)
new Intersortable({
  onDrop: (state) => { /* simple state object */ }
})
```

## [1.2.0] - Previous Versions

See git history for previous version changes.