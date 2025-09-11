# Intersortable

Zero-config sortable items between multiple containers with smooth animations. Lightweight drag-and-drop for Next.js and React with real-time DOM manipulation.

## Why Intersortable?

Most drag-and-drop libraries are built for complex use cases that require extensive configuration. **Intersortable** focuses on the most common need: moving items between containers with smooth animations and real-time feedback.

**What makes it different:**
- Items move in real-time during drag (not just on drop)
- Smooth FLIP animations for all affected elements
- Ghost items automatically appear in empty containers
- Callback-based state management that works perfectly with React

## Features

- 🚀 **Zero Configuration** - Two HTML attributes and you're done
- 📦 **Lightweight** - 6.8kb minified, zero dependencies  
- ⚡ **Real-time Movement** - Items move during drag, not just on drop
- 🎯 **TypeScript Ready** - Full type definitions included
- 📱 **Mobile Friendly** - Works smoothly on touch devices
- 🎨 **FLIP Animations** - Smooth transitions for all affected elements
- 👻 **Smart Empty States** - Ghost items automatically appear in empty containers
- 🎛️ **Drag Handle Support** - Optional drag handles for precise control

## Installation

```bash
npm install intersortable
```

## Quick Start

### 1. Add HTML Attributes

```html
<!-- Your containers -->
<div data-intersortable-container-id="todo">
  <div data-intersortable-item-id="task-1">Build awesome app</div>
  <div data-intersortable-item-id="task-2">
    <span>Deploy to production</span>
    <!-- Optional: Add drag handle for precise control -->
    <img src="/drag-handle.svg" data-intersortable-drag-handle />
  </div>
</div>

<div data-intersortable-container-id="done">
  <div data-intersortable-item-id="task-3">Write documentation</div>
</div>

<!-- Empty containers automatically show ghost items when dragging -->
<div data-intersortable-container-id="archive"></div>
```

### 2. Initialize in Your React Component

```tsx
'use client'

import { useEffect, useState } from 'react'
import Intersortable, { type ContainerState } from 'intersortable'

export default function TaskBoard() {
  const [currentState, setCurrentState] = useState<ContainerState | null>(null)

  useEffect(() => {
    const intersortable = new Intersortable({
      onPickup: (state) => {
        console.log('Started dragging, current state:', state)
        // Optional: Update UI to show drag started
      },
      onDrop: (state) => {
        console.log('Finished dragging, new state:', state)
        setCurrentState(state)
        
        // Save to your backend, localStorage, etc.
        localStorage.setItem('taskState', JSON.stringify(state))
        // Or: await saveToAPI(state)
      }
    })

    // Cleanup on unmount
    return () => {
      // Cleanup happens automatically when the instance is garbage collected
    }
  }, [])

  return (
    <div className="grid grid-cols-3 gap-4">
      <div data-intersortable-container-id="todo" className="p-4 bg-gray-100 rounded">
        <h3>Todo</h3>
        <div data-intersortable-item-id="task-1" className="p-2 bg-white rounded mb-2">
          Build awesome app
        </div>
        <div data-intersortable-item-id="task-2" className="p-2 bg-white rounded">
          Deploy to production
        </div>
      </div>
      
      <div data-intersortable-container-id="done" className="p-4 bg-gray-100 rounded">
        <h3>Done</h3>
        <div data-intersortable-item-id="task-3" className="p-2 bg-white rounded">
          Write documentation
        </div>
      </div>
      
      <div data-intersortable-container-id="archive" className="p-4 bg-gray-100 rounded">
        <h3>Archive</h3>
        {/* Ghost items appear automatically when dragging over empty containers */}
      </div>
    </div>
  )
}
```

## Drag Handles (Optional)

For precise control, you can add drag handles to items. When a drag handle is present, only the handle will be draggable:

```html
<div data-intersortable-item-id="task-1">
  <span>Task content here</span>
  <!-- Only this handle will be draggable -->
  <button data-intersortable-drag-handle>⋮⋮</button>
</div>
```

**Drag Handle Behavior:**
- Items **without** handles: Entire item is draggable
- Items **with** handles: Only the handle element is draggable
- Automatic cursor management: `grab` on hover, `grabbing` during drag

## Built-in Styling

Intersortable includes all necessary styles out-of-the-box:
- Automatic cursor management (`grab` → `grabbing`)
- Drag handle detection and cursor override
- Clone styling with subtle shadow and scale

No CSS required! The library is completely self-contained.

## API Reference

### `new Intersortable(callbacks?)`

Creates a new intersortable instance.

**Parameters:**
- `callbacks` (optional): Object with callback functions

**Callback Options:**
- `onPickup?: (state: ContainerState) => void` - Called when drag starts
- `onDrop?: (state: ContainerState) => void` - Called when drag ends

**Example:**
```tsx
const intersortable = new Intersortable({
  onPickup: (state) => {
    // Drag started - perfect for UI updates
    console.log('Current state when drag started:', state)
  },
  onDrop: (state) => {
    // Drag ended - perfect for persistence
    console.log('Final state after drop:', state)
    saveToBackend(state)
  }
})
```

### `ContainerState` Type

The state object passed to callbacks provides complete information for database persistence:

```tsx
interface ItemInfo {
  id: string;        // The data-intersortable-item-id attribute
  text: string;      // The visible text content of the item
  position: number;  // Zero-based position within the container
}

type ContainerState = {
  [containerId: string]: ItemInfo[]
}

// Example state:
{
  "todo": [
    { id: "task-1", text: "Build awesome app", position: 0 },
    { id: "task-2", text: "Deploy to production", position: 1 }
  ],
  "done": [
    { id: "task-3", text: "Write documentation", position: 0 }
  ],
  "archive": []
}
```

### `Intersortable.init(callbacks?)`

Static method for one-line initialization:

```tsx
import Intersortable from 'intersortable'

// One-line setup
Intersortable.init({
  onDrop: (state) => localStorage.setItem('tasks', JSON.stringify(state))
})
```

## HTML Attributes

### Required

- `data-intersortable-container-id="unique-id"` - Marks containers that hold sortable items
- `data-intersortable-item-id="unique-id"` - Marks items that can be dragged between containers

### Optional

- `data-intersortable-drag-handle` - When present, only this element will be draggable (instead of the entire item)

### Important Notes

- Container and item IDs should be unique within the page
- Items can be moved between any containers on the page
- Empty containers automatically show ghost items during drag operations
- Ghost items are invisible but provide targeting for empty containers
- Drag handles provide precise control - useful for items with interactive content like buttons or links

## Advanced Usage

### Persistence with React State

```tsx
function TaskBoard() {
  const [tasks, setTasks] = useState<ContainerState>({
    todo: [
      { id: 'task-1', text: 'Task 1', position: 0 },
      { id: 'task-2', text: 'Task 2', position: 1 }
    ],
    done: [
      { id: 'task-3', text: 'Task 3', position: 0 }
    ],
    archive: []
  })

  useEffect(() => {
    new Intersortable({
      onDrop: (state) => {
        setTasks(state)  // Update React state
        saveToAPI(state) // Persist to backend
      }
    })
  }, [])

  // Render your UI based on tasks state
  return (
    <div>
      {Object.entries(tasks).map(([containerId, items]) => (
        <div key={containerId} data-intersortable-container-id={containerId}>
          <h3>{containerId}</h3>
          {items.map((item) => (
            <div key={item.id} data-intersortable-item-id={item.id}>
              {item.text}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
```

### Database Integration

With the rich state information, you can easily persist to any database:

```tsx
new Intersortable({
  onDrop: async (state) => {
    try {
      // You have access to item IDs, positions, and container assignments
      for (const [containerId, items] of Object.entries(state)) {
        for (const item of items) {
          await updateTaskInDB({
            id: item.id,           // Database record ID
            container: containerId, // New container assignment  
            position: item.position // New position in container
          })
        }
      }
      console.log('Saved successfully')
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }
})
```

**Or batch update all at once:**

```tsx
new Intersortable({
  onDrop: async (state) => {
    const updates = []
    
    for (const [containerId, items] of Object.entries(state)) {
      items.forEach(item => {
        updates.push({
          id: item.id,
          container: containerId,
          position: item.position,
          // You can also access item.text if needed
        })
      })
    }
    
    await fetch('/api/tasks/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ updates })
    })
  }
})
```

## How It Works

1. **Real-time Movement**: Unlike other libraries, items move immediately during drag using FLIP animations
2. **Ghost Items**: Empty containers automatically get invisible ghost items that serve as drop targets
3. **FLIP Animations**: All affected elements smoothly animate to their new positions
4. **Callback-based**: Simple callbacks for pickup/drop events instead of complex event systems

## Browser Support

- Chrome 60+ (Web Animations API)
- Firefox 55+
- Safari 12+
- Edge 79+

## Examples

Check out the included demo by running `npm run dev` to see it in action.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Austin Voss

---

**Built for developers who need drag-and-drop that just works.**