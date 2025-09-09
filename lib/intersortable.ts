// intersortable.ts - Novel approach to sortable lists between containers

// Configuration interface
export interface IntersortableConfig {
  onDragStart?: (data: {
    itemId: string
    element: HTMLElement
  }) => void
  onMove?: (data: {
    itemId: string
    fromContainer: string
    toContainer: string
    newIndex: number
    allContainers: Record<string, string[]>
  }) => void
  onDOMStart?: (data: {
    itemId: string
    fromContainer: string
    toContainer: string
  }) => void
  onDOMComplete?: (allContainers: Record<string, string[]>) => void
  onDragEnd?: () => void
  getItemId?: (element: HTMLElement) => string
  getContainerId?: (element: HTMLElement) => string
}

// Global state
let isDragging = false
let draggedElement: HTMLElement | null = null
let draggedHandle: HTMLElement | null = null
let clonedElement: HTMLElement | null = null
const dragHandleOffset = { x: 0, y: 0 }

let draggedItemCenter = { x: 0, y: 0 }
let targetedItem: HTMLElement | null = null
let insertionPosition: 'above' | 'below' = 'above'
let lastTargetedItem: HTMLElement | null = null
let lastInsertionPosition: 'above' | 'below' = 'above'

// Configuration
let config: IntersortableConfig = {}

// MutationObserver for detecting new items
let mutationObserver: MutationObserver | null = null

// Helper functions
function calculateDistance(point1: {x: number, y: number}, point2: {x: number, y: number}) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}

function getElementCenter(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

function setupClone(clone: HTMLElement, item: HTMLElement, mouseX: number, mouseY: number, handleOffset: {x: number, y: number}) {
  clone.removeAttribute('data-intersortable-item')
  
  // Add class for CSS targeting
  clone.classList.add('intersortable-clone')
  clone.setAttribute('data-intersortable-state', 'clone')
  
  // Base positioning and sizing (always needed)
  clone.style.position = 'fixed'
  clone.style.pointerEvents = 'none'
  clone.style.left = (mouseX - handleOffset.x) + 'px'
  clone.style.top = (mouseY - handleOffset.y) + 'px'
  clone.style.width = item.offsetWidth + 'px'
  clone.style.height = item.offsetHeight + 'px'
  
  // Customizable styles using CSS custom properties
  clone.style.zIndex = 'var(--intersortable-clone-z-index, 9999)'
  clone.style.opacity = 'var(--intersortable-clone-opacity, 1)'
  clone.style.transform = 'scale(var(--intersortable-clone-scale, 1.05))'
  clone.style.boxShadow = 'var(--intersortable-clone-shadow, 0 10px 25px rgba(0, 0, 0, 0.3))'
  clone.style.transition = 'var(--intersortable-clone-transition, none)'
}

function resetDragState() {
  isDragging = false
  document.body.style.cursor = 'var(--intersortable-cursor-default, auto)'
  targetedItem = null
  lastTargetedItem = null
  lastInsertionPosition = 'above'
  
  // Clean up any transition styles left on items and restore pointer events
  const allItems = document.querySelectorAll('[data-intersortable-item]') as NodeListOf<HTMLElement>
  allItems.forEach(item => {
    // Remove dragging classes and attributes
    item.classList.remove('intersortable-dragging')
    item.removeAttribute('data-intersortable-state')
    
    // Restore pointer events
    item.style.pointerEvents = ''
    // Also restore pointer events on drag handles
    const handles = item.querySelectorAll('[data-drag-handle]') as NodeListOf<HTMLElement>
    handles.forEach(handle => {
      handle.style.pointerEvents = ''
    })
    
    setTimeout(() => {
      item.style.transition = ''
      item.style.transform = ''
    }, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--intersortable-animation-duration') || '250')) // Use CSS custom property or default
  })
}

// Function to move an item to the insertion point with smooth animations
function moveItemToInsertionPoint(itemToMove: HTMLElement, targetItem: HTMLElement, position: 'above' | 'below') {
  // Store original container before DOM manipulation for onMove callback
  const originalFromContainer = (config.getContainerId || defaultGetContainerId)(itemToMove)
  const targetToContainer = targetItem.hasAttribute('data-intersortable-container') 
    ? (config.getContainerId || defaultGetContainerId)(targetItem)
    : (config.getContainerId || defaultGetContainerId)(targetItem.closest('[data-intersortable-container]') as HTMLElement || targetItem)
  
  // Call onDOMStart callback before any DOM manipulation
  if (config.onDOMStart) {
    const itemId = (config.getItemId || defaultGetItemId)(itemToMove)
    config.onDOMStart({ itemId, fromContainer: originalFromContainer, toContainer: targetToContainer })
  }
  
  // FLIP technique: First - capture current positions of all affected items
  const affectedItems: {element: HTMLElement, rect: DOMRect}[] = []
  
  // Find all sortable items that might be affected by this move
  const allItems = document.querySelectorAll('[data-intersortable-item]') as NodeListOf<HTMLElement>
  allItems.forEach(item => {
    if (item !== itemToMove) { // Don't track the dragged item itself
      affectedItems.push({
        element: item,
        rect: item.getBoundingClientRect()
      })
    }
  })
  
  // Capture the moving item's current position
  const movingItemRect = itemToMove.getBoundingClientRect()
  
  // Remove the item from its current position
  if (itemToMove.parentNode) {
    itemToMove.parentNode.removeChild(itemToMove)
  }
  
  // Check if target is an empty container (data-intersortable-container attribute)
  if (targetItem.hasAttribute('data-intersortable-container')) {
    // Empty container - just append the item to it
    targetItem.appendChild(itemToMove)
  } else {
    // Normal item-to-item insertion
    const targetParent = targetItem.parentNode
    if (!targetParent) return
    
    // Insert directly relative to the target item
    if (position === 'above') {
      targetParent.insertBefore(itemToMove, targetItem)
    } else {
      // Insert after the target item
      const nextSibling = targetItem.nextSibling
      if (nextSibling) {
        targetParent.insertBefore(itemToMove, nextSibling)
      } else {
        targetParent.appendChild(itemToMove)
      }
    }
  }
  
  // Call onDOMComplete callback after DOM manipulation is complete
  if (config.onDOMComplete) {
    const allContainers = getCurrentSortOrder()
    config.onDOMComplete(allContainers)
  }
  
  // Call onMove callback for real-time React state updates
  if (config.onMove) {
    const itemId = (config.getItemId || defaultGetItemId)(itemToMove)
    const allContainers = getCurrentSortOrder()
    const newIndex = allContainers[targetToContainer]?.indexOf(itemId) ?? -1
    
    config.onMove({
      itemId,
      fromContainer: originalFromContainer, // Where it came from (stored before DOM manipulation)
      toContainer: targetToContainer,       // Where it went to (calculated before DOM manipulation)
      newIndex,
      allContainers
    })
  }
  
  // FLIP technique: Last - get new positions, Invert - calculate differences, Play - animate
  const newMovingItemRect = itemToMove.getBoundingClientRect()
  
  // Animate the moving item from its old position to new position
  const deltaX = movingItemRect.left - newMovingItemRect.left
  const deltaY = movingItemRect.top - newMovingItemRect.top
  
  if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
    itemToMove.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    itemToMove.style.transition = 'none'
    
    requestAnimationFrame(() => {
      const duration = getComputedStyle(document.documentElement).getPropertyValue('--intersortable-animation-duration') || '0.2s'
      const easing = getComputedStyle(document.documentElement).getPropertyValue('--intersortable-animation-easing') || 'ease-out'
      itemToMove.style.transition = `transform ${duration} ${easing}`
      itemToMove.style.transform = 'translate(0, 0)'
    })
  }
  
  // Animate displaced items
  affectedItems.forEach(({element, rect}) => {
    const newRect = element.getBoundingClientRect()
    const deltaX = rect.left - newRect.left
    const deltaY = rect.top - newRect.top
    
    if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`
      element.style.transition = 'none'
      
      requestAnimationFrame(() => {
        const duration = getComputedStyle(document.documentElement).getPropertyValue('--intersortable-displaced-duration') || '0.15s'
        const easing = getComputedStyle(document.documentElement).getPropertyValue('--intersortable-animation-easing') || 'ease-out'
        element.style.transition = `transform ${duration} ${easing}`
        element.style.transform = 'translate(0, 0)'
      })
    }
  })
}


// Calculate targeting for real-time item movement
function calculateTargeting() {
  // Calculate dragged item center position
  if (clonedElement) {
    draggedItemCenter = getElementCenter(clonedElement)
  }
  
  // Find all sortable items and calculate distances
  const allItems = document.querySelectorAll('[data-intersortable-item]') as NodeListOf<HTMLElement>
  let nearestTarget: HTMLElement | null = null
  let nearestDistance = Infinity
  
  // Check all sortable items
  allItems.forEach(item => {
    const itemCenter = getElementCenter(item)
    const distance = calculateDistance(itemCenter, draggedItemCenter)
    
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestTarget = item
    }
  })
  
  // Also check empty containers
  const containers = document.querySelectorAll('[data-intersortable-container]') as NodeListOf<HTMLElement>
  containers.forEach(container => {
    const sortableItems = container.querySelectorAll('[data-intersortable-item]')
    if (sortableItems.length === 0) { // Empty container
      const containerCenter = getElementCenter(container)
      const distance = calculateDistance(containerCenter, draggedItemCenter)
      
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestTarget = container
      }
    }
  })
  
  const nearestItem = nearestTarget
  
  targetedItem = nearestItem
  
  // Calculate insertion position based on dragged item center vs nearest item center
  if (nearestItem) {
    if (nearestItem === draggedElement) {
      // Targeting self - no change needed
      insertionPosition = 'above'
    } else {
      const targetCenter = getElementCenter(nearestItem)
      insertionPosition = draggedItemCenter.y <= targetCenter.y ? 'above' : 'below'
    }
  }
  
  // Move the original dragged element to the insertion point in real-time
  // Only move if the target or position has changed
  if (nearestItem && draggedElement && nearestItem !== draggedElement) {
    if (nearestItem !== lastTargetedItem || insertionPosition !== lastInsertionPosition) {
      moveItemToInsertionPoint(draggedElement, nearestItem, insertionPosition)
      
      lastTargetedItem = nearestItem
      lastInsertionPosition = insertionPosition
    }
  }
}



// Default helper functions
function defaultGetItemId(element: HTMLElement): string {
  return element.dataset.itemId || element.id || ''
}

function defaultGetContainerId(element: HTMLElement): string {
  const container = element.closest('[data-intersortable-container]') as HTMLElement
  return container?.dataset.containerId || container?.id || ''
}

// Helper function to get current sort order
function getCurrentSortOrder(): Record<string, string[]> {
  const containers = document.querySelectorAll('[data-intersortable-container]') as NodeListOf<HTMLElement>
  const sortOrder: Record<string, string[]> = {}
  
  containers.forEach(container => {
    const containerId = (config.getContainerId || defaultGetContainerId)(container)
    if (containerId) {
      const items = container.querySelectorAll('[data-intersortable-item]') as NodeListOf<HTMLElement>
      sortOrder[containerId] = Array.from(items).map(item => 
        (config.getItemId || defaultGetItemId)(item)
      ).filter(id => id) // Filter out empty IDs
    }
  })
  
  return sortOrder
}

function applyCursorStyles() {
  // Apply default grab cursor to all intersortable items
  const items = document.querySelectorAll('[data-intersortable-item]') as NodeListOf<HTMLElement>
  items.forEach(item => {
    applyCursorStyleToItem(item)
  })
}

function applyCursorStyleToItem(item: HTMLElement) {
  // Check if item has a drag handle
  const hasHandle = item.querySelector('[data-drag-handle]')
  if (hasHandle) {
    // Item has handle - only the handle should be grabbable
    const handles = item.querySelectorAll('[data-drag-handle]') as NodeListOf<HTMLElement>
    handles.forEach(handle => {
      if (!handle.style.cursor) {
        handle.style.cursor = 'var(--intersortable-cursor-grab, grab)'
      }
    })
  } else {
    // No handle - entire item is grabbable
    if (!item.style.cursor) {
      item.style.cursor = 'var(--intersortable-cursor-grab, grab)'
    }
  }
}

function handleMutations(mutations: MutationRecord[]) {
  mutations.forEach(mutation => {
    // Handle added nodes
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        
        // Check if the added node is an intersortable item
        if (element.hasAttribute('data-intersortable-item')) {
          applyCursorStyleToItem(element)
        }
        
        // Check if the added node contains intersortable items
        const items = element.querySelectorAll('[data-intersortable-item]') as NodeListOf<HTMLElement>
        items.forEach(item => {
          applyCursorStyleToItem(item)
        })
        
        // Check if the added node is a drag handle
        if (element.hasAttribute('data-drag-handle')) {
          if (!element.style.cursor) {
            element.style.cursor = 'var(--intersortable-cursor-grab, grab)'
          }
        }
        
        // Check if the added node contains drag handles
        const handles = element.querySelectorAll('[data-drag-handle]') as NodeListOf<HTMLElement>
        handles.forEach(handle => {
          if (!handle.style.cursor) {
            handle.style.cursor = 'var(--intersortable-cursor-grab, grab)'
          }
        })
      }
    })
  })
}

function setupMutationObserver() {
  // Clean up existing observer if any
  if (mutationObserver) {
    mutationObserver.disconnect()
  }
  
  // Create new observer
  mutationObserver = new MutationObserver(handleMutations)
  
  // Start observing the document for changes
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  })
}

function cleanupMutationObserver() {
  if (mutationObserver) {
    mutationObserver.disconnect()
    mutationObserver = null
  }
}

export function initSortable(userConfig: IntersortableConfig = {}) {
  config = { ...userConfig }
  
  // Apply default cursor styles to intersortable items
  applyCursorStyles()
  
  // Set up MutationObserver to watch for new items
  setupMutationObserver()
  
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseDown(e: MouseEvent) {
  const target = e.target as HTMLElement
  let dragHandle: HTMLElement | null = null
  let item: HTMLElement | null = null
  
  // First, check if clicked element is or contains a drag handle
  if (target.closest('[data-drag-handle]')) {
    dragHandle = target.closest('[data-drag-handle]') as HTMLElement
    item = dragHandle.closest('[data-intersortable-item]') as HTMLElement
  } else {
    // No drag handle found, check if we clicked directly on a sortable item
    item = target.closest('[data-intersortable-item]') as HTMLElement
    if (item) {
      // Check if this item has a drag handle - if so, ignore clicks outside the handle
      const hasHandle = item.querySelector('[data-drag-handle]')
      if (hasHandle) {
        return // Item has a handle but we didn't click on it, so don't start drag
      }
      // No handle exists, so the entire item is draggable
      dragHandle = item
    }
  }
  
  if (item && dragHandle) {
    isDragging = true
    draggedElement = item
    draggedHandle = dragHandle
    
    // Call onDragStart callback
    if (config.onDragStart) {
      const itemId = (config.getItemId || defaultGetItemId)(item)
      config.onDragStart({ itemId, element: item })
    }
    
    // Reset tracking variables for real-time movement
    lastTargetedItem = null
    lastInsertionPosition = 'above'
    
    // Calculate drag handle offset - always preserve click position
    const itemRect = item.getBoundingClientRect()
    dragHandleOffset.x = e.clientX - itemRect.left
    dragHandleOffset.y = e.clientY - itemRect.top
    
    // Create clone
    clonedElement = item.cloneNode(true) as HTMLElement
    setupClone(clonedElement, item, e.clientX, e.clientY, dragHandleOffset)
    document.body.appendChild(clonedElement)
    
    // Calculate initial targeting
    calculateTargeting()
    
    // Add dragging state
    item.classList.add('intersortable-dragging')
    item.setAttribute('data-intersortable-state', 'dragging')
    
    // Apply dragging styles with CSS custom properties
    item.style.opacity = 'var(--intersortable-dragging-opacity, 0.4)'
    
    // Set cursor to grabbing on body and the specific draggable element
    document.body.style.cursor = 'var(--intersortable-cursor-grabbing, grabbing)'
    dragHandle.style.cursor = 'var(--intersortable-cursor-grabbing, grabbing)'
    
    // Disable pointer events on all other intersortable items to prevent cursor conflicts
    const allItems = document.querySelectorAll('[data-intersortable-item]') as NodeListOf<HTMLElement>
    allItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.style.pointerEvents = 'none'
        // Also disable pointer events on their drag handles
        const otherHandles = otherItem.querySelectorAll('[data-drag-handle]') as NodeListOf<HTMLElement>
        otherHandles.forEach(handle => {
          handle.style.pointerEvents = 'none'
        })
      }
    })
    
    e.preventDefault()
  }
}

function handleMouseMove(e: MouseEvent) {
  if (isDragging && clonedElement) {
    // Move clone so drag handle follows cursor
    const cloneX = e.clientX - dragHandleOffset.x
    const cloneY = e.clientY - dragHandleOffset.y
    clonedElement.style.left = cloneX + 'px'
    clonedElement.style.top = cloneY + 'px'
    
    // Update targeting calculations
    calculateTargeting()
  }
}

function handleMouseUp(_e: MouseEvent) {
  if (isDragging) {
    // Call onDragEnd callback before cleanup
    if (config.onDragEnd) {
      config.onDragEnd()
    }
    
    // Cleanup
    if (clonedElement) {
      clonedElement.classList.remove('intersortable-clone')
      clonedElement.removeAttribute('data-intersortable-state')
      document.body.removeChild(clonedElement)
      clonedElement = null
    }
    
    if (draggedElement) {
      draggedElement.style.opacity = '1'
      draggedElement.classList.remove('intersortable-dragging')
      draggedElement.removeAttribute('data-intersortable-state')
      draggedElement = null
    }
    
    if (draggedHandle) {
      // Reset cursor on the specific handle that was dragged
      draggedHandle.style.cursor = 'var(--intersortable-cursor-grab, grab)'
      draggedHandle = null
    }
    
    resetDragState()
  }
}

export function restoreSortOrder(savedOrder: Record<string, string[]>) {
  Object.entries(savedOrder).forEach(([containerId, itemIds]) => {
    const container = document.querySelector(`[data-container-id="${containerId}"], #${containerId}`) as HTMLElement
    if (!container) return
    
    // Create a map of current items by their IDs for quick lookup
    const currentItems = new Map<string, HTMLElement>()
    const items = container.querySelectorAll('[data-intersortable-item]') as NodeListOf<HTMLElement>
    items.forEach(item => {
      const itemId = (config.getItemId || defaultGetItemId)(item)
      if (itemId) currentItems.set(itemId, item)
    })
    
    // Reorder items according to saved order
    itemIds.forEach(itemId => {
      const item = currentItems.get(itemId)
      if (item) {
        container.appendChild(item) // This moves the item to the end
      }
    })
  })
}

export function cleanupSortable() {
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  
  // Clean up MutationObserver
  cleanupMutationObserver()
}