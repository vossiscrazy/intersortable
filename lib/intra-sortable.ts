'use client'

// intra-sortable.ts - Novel approach to sortable lists

let isDragging = false
let draggedElement: HTMLElement | null = null
let clonedElement: HTMLElement | null = null
let dragHandleOffset = { x: 0, y: 0 }

let draggedItemCenter = { x: 0, y: 0 }
let targetedItem: HTMLElement | null = null
let insertionPosition: 'above' | 'below' = 'above'
let lastTargetedItem: HTMLElement | null = null
let lastInsertionPosition: 'above' | 'below' = 'above'

// Helper functions
function calculateDistance(point1: {x: number, y: number}, point2: {x: number, y: number}) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}

function getElementCenter(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

function setupClone(clone: HTMLElement, item: HTMLElement, mouseX: number, mouseY: number, handleOffset: {x: number, y: number}) {
  clone.removeAttribute('data-sortable-item')
  clone.style.position = 'fixed'
  clone.style.pointerEvents = 'none'
  clone.style.zIndex = '9999'
  clone.style.opacity = '1'
  clone.style.left = (mouseX - handleOffset.x) + 'px'
  clone.style.top = (mouseY - handleOffset.y) + 'px'
  clone.style.transform = 'scale(1.05)'
  clone.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)'
  clone.style.width = item.offsetWidth + 'px'
  clone.style.height = item.offsetHeight + 'px'
}

function resetDragState() {
  isDragging = false
  document.body.style.cursor = 'auto'
  targetedItem = null
  lastTargetedItem = null
  lastInsertionPosition = 'above'
  
  // Clean up any transition styles left on items
  const allItems = document.querySelectorAll('[data-sortable-item]') as NodeListOf<HTMLElement>
  allItems.forEach(item => {
    setTimeout(() => {
      item.style.transition = ''
      item.style.transform = ''
    }, 250) // Wait for animations to complete
  })
}

// Function to move an item to the insertion point with smooth animations
function moveItemToInsertionPoint(itemToMove: HTMLElement, targetItem: HTMLElement, position: 'above' | 'below') {
  // FLIP technique: First - capture current positions of all affected items
  const affectedItems: {element: HTMLElement, rect: DOMRect}[] = []
  
  // Find all sortable items that might be affected by this move
  const allItems = document.querySelectorAll('[data-sortable-item]') as NodeListOf<HTMLElement>
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
  
  // Check if target is an empty board (data-board attribute)
  if (targetItem.hasAttribute('data-board')) {
    // Empty board - just append the item to it
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
  
  // FLIP technique: Last - get new positions, Invert - calculate differences, Play - animate
  const newMovingItemRect = itemToMove.getBoundingClientRect()
  
  // Animate the moving item from its old position to new position
  const deltaX = movingItemRect.left - newMovingItemRect.left
  const deltaY = movingItemRect.top - newMovingItemRect.top
  
  if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
    itemToMove.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    itemToMove.style.transition = 'none'
    
    requestAnimationFrame(() => {
      itemToMove.style.transition = 'transform 0.2s ease-out'
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
        element.style.transition = 'transform 0.15s ease-out'
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
  const allItems = document.querySelectorAll('[data-sortable-item]') as NodeListOf<HTMLElement>
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
  
  // Also check empty boards
  const boards = document.querySelectorAll('[data-board]') as NodeListOf<HTMLElement>
  boards.forEach(board => {
    const sortableItems = board.querySelectorAll('[data-sortable-item]')
    if (sortableItems.length === 0) { // Empty board
      const boardCenter = getElementCenter(board)
      const distance = calculateDistance(boardCenter, draggedItemCenter)
      
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestTarget = board
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



export function initSortable() {
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseDown(e: MouseEvent) {
  const target = e.target as HTMLElement
  
  // Check if clicked element is a drag handle
  if (target.closest('[data-drag-handle]')) {
    const dragHandle = target.closest('[data-drag-handle]') as HTMLElement
    const item = dragHandle.closest('[data-sortable-item]') as HTMLElement
    
    if (item) {
      isDragging = true
      draggedElement = item
      
      // Reset tracking variables for real-time movement
      lastTargetedItem = null
      lastInsertionPosition = 'above'
      
      // Calculate drag handle offset
      const handleRect = dragHandle.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()
      dragHandleOffset.x = handleRect.left + handleRect.width / 2 - itemRect.left
      dragHandleOffset.y = handleRect.top + handleRect.height / 2 - itemRect.top
      
      // Create clone
      clonedElement = item.cloneNode(true) as HTMLElement
      setupClone(clonedElement, item, e.clientX, e.clientY, dragHandleOffset)
      document.body.appendChild(clonedElement)
      
      
      // Calculate initial targeting
      calculateTargeting()
      
      // Dim original
      item.style.opacity = '0.4'
      
      // Set cursor to grabbing
      document.body.style.cursor = 'grabbing'
      
      e.preventDefault()
    }
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

function handleMouseUp(e: MouseEvent) {
  if (isDragging) {
    // Cleanup
    if (clonedElement) {
      document.body.removeChild(clonedElement)
      clonedElement = null
    }
    
    if (draggedElement) {
      draggedElement.style.opacity = '1'
      draggedElement = null
    }
    
    resetDragState()
  }
}

export function cleanupSortable() {
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}