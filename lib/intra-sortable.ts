'use client'

// intra-sortable.ts - Novel approach to sortable lists

let isDragging = false
let draggedElement: HTMLElement | null = null
let clonedElement: HTMLElement | null = null
let dragHandleOffset = { x: 0, y: 0 }
let debugInfo = {
  isDragging: false,
  draggedElementId: null,
  hasClone: false,
  mousePos: { x: 0, y: 0 },
  lastEvent: 'none',
  clonePos: { x: 0, y: 0 },
  handleOffset: { x: 0, y: 0 }
}

// Debug state updater
function updateDebug() {
  const debugEl = document.getElementById('drag-debug')
  if (debugEl) {
    debugEl.innerHTML = `
      <div>Is Dragging: ${debugInfo.isDragging}</div>
      <div>Dragged Element: ${debugInfo.draggedElementId}</div>
      <div>Has Clone: ${debugInfo.hasClone}</div>
      <div>Mouse: ${debugInfo.mousePos.x}, ${debugInfo.mousePos.y}</div>
      <div>Clone Pos: ${debugInfo.clonePos.x}, ${debugInfo.clonePos.y}</div>
      <div>Handle Offset: ${debugInfo.handleOffset.x}, ${debugInfo.handleOffset.y}</div>
      <div>Last Event: ${debugInfo.lastEvent}</div>
    `
  }
}

export function initSortable() {
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleMouseDown(e: MouseEvent) {
  const target = e.target as HTMLElement
  debugInfo.lastEvent = 'mousedown'
  debugInfo.mousePos = { x: e.clientX, y: e.clientY }
  
  // Check if clicked element is a drag handle
  if (target.closest('[data-drag-handle]')) {
    const dragHandle = target.closest('[data-drag-handle]') as HTMLElement
    const item = dragHandle.closest('[data-sortable-item]') as HTMLElement
    
    if (item) {
      isDragging = true
      draggedElement = item
      debugInfo.isDragging = true
      debugInfo.draggedElementId = item.getAttribute('data-sortable-item') || 'unknown'
      
      // Calculate drag handle offset
      const handleRect = dragHandle.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()
      dragHandleOffset.x = handleRect.left + handleRect.width / 2 - itemRect.left
      dragHandleOffset.y = handleRect.top + handleRect.height / 2 - itemRect.top
      debugInfo.handleOffset = { x: dragHandleOffset.x, y: dragHandleOffset.y }
      
      // Create clone
      clonedElement = item.cloneNode(true) as HTMLElement
      clonedElement.style.position = 'fixed'
      clonedElement.style.pointerEvents = 'none'
      clonedElement.style.zIndex = '9999'
      clonedElement.style.opacity = '0.9'
      clonedElement.style.left = (e.clientX - dragHandleOffset.x) + 'px'
      clonedElement.style.top = (e.clientY - dragHandleOffset.y) + 'px'
      clonedElement.style.transform = 'scale(1.05)'
      clonedElement.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)'
      clonedElement.style.width = item.offsetWidth + 'px'
      clonedElement.style.height = item.offsetHeight + 'px'
      debugInfo.clonePos = { x: e.clientX, y: e.clientY }
      debugInfo.handleOffset = { x: 0, y: 0 }
      
      document.body.appendChild(clonedElement)
      debugInfo.hasClone = true
      
      // Dim original
      item.style.opacity = '0.4'
      
      // Set cursor to grabbing
      document.body.style.cursor = 'grabbing'
      
      e.preventDefault()
    }
  }
  updateDebug()
}

function handleMouseMove(e: MouseEvent) {
  debugInfo.mousePos = { x: e.clientX, y: e.clientY }
  debugInfo.lastEvent = 'mousemove'
  
  if (isDragging && clonedElement) {
    // Move clone so drag handle follows cursor
    const cloneX = e.clientX - dragHandleOffset.x
    const cloneY = e.clientY - dragHandleOffset.y
    clonedElement.style.left = cloneX + 'px'
    clonedElement.style.top = cloneY + 'px'
    debugInfo.clonePos = { x: cloneX, y: cloneY }
  }
  updateDebug()
}

function handleMouseUp(e: MouseEvent) {
  debugInfo.lastEvent = 'mouseup'
  
  if (isDragging) {
    // Cleanup
    if (clonedElement) {
      document.body.removeChild(clonedElement)
      clonedElement = null
      debugInfo.hasClone = false
    }
    
    if (draggedElement) {
      draggedElement.style.opacity = '1'
      draggedElement = null
    }
    
    isDragging = false
    debugInfo.isDragging = false
    debugInfo.draggedElementId = null
    document.body.style.cursor = 'auto'
  }
  updateDebug()
}

export function cleanupSortable() {
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}