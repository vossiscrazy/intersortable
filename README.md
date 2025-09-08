# Intersortable

Zero-config sortable items between multiple containers. Lightweight drag-and-drop for Next.js and React with automatic state persistence.

## Why Intersortable?

The biggest mistake you can make when building sortable lists is choosing a library built for every possible use case instead of **your specific need**: moving items between containers. Most developers waste weeks configuring complex solutions when they simply need to drag tasks between Kanban columns or sort items across multiple lists.

**Intersortable** was designed by developers who understand that your users don't care about your implementation—they care about results.

## Features

- 🚀 **Zero Configuration** - Two HTML attributes and you're done
- 📦 **Lightweight** - ~4kb minified, zero dependencies
- ⚡ **Performance First** - Built for Next.js Server Components and React 19
- 🎯 **TypeScript Ready** - Full type definitions included
- 📱 **Mobile Friendly** - Works smoothly on touch devices
- 💾 **State Persistence** - Built-in support for localStorage, databases, or any storage

## Installation

```bash
npm install intersortable
```

## Quick Start

### 1. Add HTML Attributes

```html
<!-- Your containers -->
<div data-intersortable-container data-container-id="list-a">
  <div data-intersortable-item data-item-id="item-1">
    <span>Drag me anywhere</span>
  </div>
  <div data-intersortable-item data-item-id="item-2">
    <span>Or just this handle</span>
    <div data-drag-handle>⋮⋮</div>
  </div>
</div>

<div data-intersortable-container data-container-id="list-b">
  <!-- Items can be moved between containers -->
</div>
```

### 2. Initialize in Your Component

```tsx
'use client'

import { useEffect } from 'react'
import { initSortable, cleanupSortable } from 'intersortable'

export default function MyComponent() {
  useEffect(() => {
    initSortable({
      onMove: ({ itemId, fromContainer, toContainer, newIndex, allContainers }) => {
        console.log(`Moved ${itemId} from ${fromContainer} to ${toContainer}`)
        // Save to your backend/localStorage
        localStorage.setItem('sortOrder', JSON.stringify(allContainers))
      },
      onComplete: (allContainers) => {
        console.log('Drag complete:', allContainers)
      }
    })
    
    return () => cleanupSortable()
  }, [])

  return (
    // Your JSX with data-intersortable attributes
  )
}
```

## API Reference

### `initSortable(config)`

Initialize the sortable functionality.

**Config Options:**
- `onMove?`: Real-time callback fired during dragging
- `onComplete?`: Callback fired when dragging ends
- `getItemId?`: Custom function to extract item IDs
- `getContainerId?`: Custom function to extract container IDs

### `restoreSortOrder(savedOrder)`

Restore items to previously saved positions.

```tsx
// Restore from localStorage
const savedOrder = JSON.parse(localStorage.getItem('sortOrder') || '{}')
restoreSortOrder(savedOrder)
```

### `cleanupSortable()`

Remove event listeners when component unmounts.

## HTML Attributes

### Required Attributes

- `data-intersortable-container` - Marks containers that can hold sortable items
- `data-container-id="unique-id"` - Unique identifier for each container
- `data-intersortable-item` - Marks items that can be dragged
- `data-item-id="unique-id"` - Unique identifier for each item

### Optional Attributes

- `data-drag-handle` - Restricts dragging to specific elements within an item

## Advanced Usage

### Custom ID Functions

```tsx
initSortable({
  getItemId: (element) => element.dataset.customItemId || '',
  getContainerId: (element) => element.dataset.customContainerId || '',
  onMove: ({ itemId, fromContainer, toContainer, newIndex, allContainers }) => {
    // Your logic here
  }
})
```

### State Persistence

```tsx
// Save state in real-time
onMove: ({ allContainers }) => {
  fetch('/api/save-order', {
    method: 'POST',
    body: JSON.stringify(allContainers)
  })
}

// Or batch saves
onComplete: (allContainers) => {
  localStorage.setItem('sortOrder', JSON.stringify(allContainers))
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Intersortable Team

---

**Stop wasting time on complex implementations. Your users deserve software that simply works.**
