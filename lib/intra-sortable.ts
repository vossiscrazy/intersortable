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
  handleOffset: { x: 0, y: 0 },
  totalItems: 0,
  nearestItemId: null,
  nearestDistance: 0,
  markersCreated: 0
}

let targetingMarkers: HTMLElement[] = []
let draggedItemCenter = { x: 0, y: 0 }

// Debug state updater
function updateDebug() {
  const debugEl = document.getElementById('drag-debug')
  if (debugEl) {
    debugEl.innerHTML = `
      <div>🎯 <strong>TARGETING DEBUG</strong></div>
      <div>Is Dragging: ${debugInfo.isDragging}</div>
      <div>Dragged Item Center: [${draggedItemCenter.x.toFixed(0)}, ${draggedItemCenter.y.toFixed(0)}]</div>
      <div>Total Items Found: ${debugInfo.totalItems}</div>
      <div>Nearest Item: ${debugInfo.nearestItemId || 'none'}</div>
      <div>Nearest Distance: ${debugInfo.nearestDistance.toFixed(0)}px</div>
      <div>Markers Created: ${debugInfo.markersCreated}</div>
      <div>Last Event: ${debugInfo.lastEvent}</div>
    `
  }
}

// Create targeting markers for all items
function createTargetingMarkers() {
  clearTargetingMarkers()
  
  // First, calculate dragged item center position
  if (clonedElement) {
    const cloneRect = clonedElement.getBoundingClientRect()
    draggedItemCenter.x = cloneRect.left + cloneRect.width / 2
    draggedItemCenter.y = cloneRect.top + cloneRect.height / 2
  }
  
  // Find all sortable items and calculate distances
  const allItems = document.querySelectorAll('[data-sortable-item]') as NodeListOf<HTMLElement>
  debugInfo.totalItems = allItems.length
  let nearestItem: HTMLElement | null = null
  let nearestDistance = Infinity
  
  // First pass: find the nearest item
  allItems.forEach(item => {
    const rect = item.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distance = Math.sqrt(
      Math.pow(centerX - draggedItemCenter.x, 2) + 
      Math.pow(centerY - draggedItemCenter.y, 2)
    )
    
    if (distance < 5) return // Skip items too close (likely the clone position)
    
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestItem = item
    }
  })
  
  // Update debug info
  debugInfo.nearestItemId = nearestItem ? nearestItem.getAttribute('data-sortable-item') : null
  debugInfo.nearestDistance = nearestDistance
  debugInfo.markersCreated = 0
  
  // Second pass: create markers for all items
  allItems.forEach(item => {
    const rect = item.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Skip if this is the cloned element's position (distance would be 0)
    const distance = Math.sqrt(
      Math.pow(centerX - draggedItemCenter.x, 2) + 
      Math.pow(centerY - draggedItemCenter.y, 2)
    )
    
    if (distance < 5) return // Skip items too close (likely the clone position)
    
    // Check if this is the nearest item for special styling
    const isNearest = item === nearestItem
    
    // Create glowing crosshair marker (different style for nearest)
    const marker = document.createElement('div')
    marker.style.position = 'fixed'
    marker.style.left = (centerX - (isNearest ? 12 : 8)) + 'px'
    marker.style.top = (centerY - (isNearest ? 12 : 8)) + 'px'
    marker.style.width = (isNearest ? 24 : 16) + 'px'
    marker.style.height = (isNearest ? 24 : 16) + 'px'
    
    if (isNearest) {
      // Nearest item gets special golden targeting
      marker.style.border = '3px solid #ffaa00'
      marker.style.backgroundColor = 'rgba(255, 170, 0, 0.3)'
      marker.style.boxShadow = '0 0 20px rgba(255, 170, 0, 1), inset 0 0 10px rgba(255, 170, 0, 0.4)'
      marker.style.animation = 'targetPulse 0.8s ease-in-out infinite'
      
      // Add targeting animation
      const targetStyle = document.createElement('style')
      targetStyle.textContent = `
        @keyframes targetPulse {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.1) rotate(180deg); opacity: 0.8; }
          100% { transform: scale(1) rotate(360deg); opacity: 1; }
        }
      `
      document.head.appendChild(targetStyle)
      targetingMarkers.push(targetStyle)
    } else {
      // Regular items keep red styling
      marker.style.border = '2px solid #ff4444'
      marker.style.backgroundColor = 'rgba(255, 68, 68, 0.2)'
      marker.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.6), inset 0 0 5px rgba(255, 68, 68, 0.3)'
    }
    
    marker.style.borderRadius = '50%'
    marker.style.zIndex = '10000'
    marker.style.pointerEvents = 'none'
    
    // Add crosshair lines
    const crosshair = document.createElement('div')
    crosshair.style.position = 'absolute'
    crosshair.style.top = '50%'
    crosshair.style.left = '50%'
    crosshair.style.width = (isNearest ? 4 : 2) + 'px'
    crosshair.style.height = (isNearest ? 4 : 2) + 'px'
    crosshair.style.backgroundColor = isNearest ? '#ffaa00' : '#ff4444'
    crosshair.style.transform = 'translate(-50%, -50%)'
    crosshair.style.boxShadow = isNearest ? '0 0 8px rgba(255, 170, 0, 1)' : '0 0 4px rgba(255, 68, 68, 0.8)'
    marker.appendChild(crosshair)
    
    // Create futuristic distance label (different style for nearest)
    const label = document.createElement('div')
    label.style.position = 'fixed'
    label.style.left = (centerX - 25) + 'px'
    label.style.top = (centerY + (isNearest ? 16 : 12)) + 'px'
    label.style.fontSize = '11px'
    label.style.fontFamily = 'monospace'
    label.style.fontWeight = 'bold'
    label.style.zIndex = '10000'
    label.style.pointerEvents = 'none'
    label.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    label.style.padding = '2px 6px'
    label.style.borderRadius = '4px'
    
    if (isNearest) {
      // Nearest item gets golden styling and "TARGET" prefix
      label.style.color = '#ffaa00'
      label.style.textShadow = '0 0 10px rgba(255, 170, 0, 1), 0 0 6px rgba(255, 170, 0, 0.8)'
      label.style.border = '2px solid rgba(255, 170, 0, 0.5)'
      label.textContent = `TARGET: ${Math.round(distance)}px`
    } else {
      // Regular items keep cyan styling
      label.style.color = '#00ffff'
      label.style.textShadow = '0 0 8px rgba(0, 255, 255, 0.8), 0 0 4px rgba(0, 255, 255, 0.6)'
      label.style.border = '1px solid rgba(0, 255, 255, 0.3)'
      label.textContent = Math.round(distance) + 'px'
    }
    
    document.body.appendChild(marker)
    document.body.appendChild(label)
    targetingMarkers.push(marker, label)
    debugInfo.markersCreated += 2 // marker + label
  })
  
  // Create pulsing energy marker for dragged item clone
  if (clonedElement) {
    const draggedMarker = document.createElement('div')
    draggedMarker.style.position = 'fixed'
    draggedMarker.style.left = (draggedItemCenter.x - 10) + 'px'
    draggedMarker.style.top = (draggedItemCenter.y - 10) + 'px'
    draggedMarker.style.width = '20px'
    draggedMarker.style.height = '20px'
    draggedMarker.style.border = '3px solid #00ff88'
    draggedMarker.style.borderRadius = '50%'
    draggedMarker.style.backgroundColor = 'rgba(0, 255, 136, 0.1)'
    draggedMarker.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.8), inset 0 0 10px rgba(0, 255, 136, 0.2)'
    draggedMarker.style.zIndex = '10001'
    draggedMarker.style.pointerEvents = 'none'
    draggedMarker.style.animation = 'pulse 1s ease-in-out infinite'
    
    // Add pulsing animation
    const style = document.createElement('style')
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
    `
    document.head.appendChild(style)
    targetingMarkers.push(style)
    
    // Add inner core
    const core = document.createElement('div')
    core.style.position = 'absolute'
    core.style.top = '50%'
    core.style.left = '50%'
    core.style.width = '4px'
    core.style.height = '4px'
    core.style.backgroundColor = '#00ff88'
    core.style.borderRadius = '50%'
    core.style.transform = 'translate(-50%, -50%)'
    core.style.boxShadow = '0 0 6px rgba(0, 255, 136, 1)'
    draggedMarker.appendChild(core)
    
    // Create holographic coordinate display
    const coordLabel = document.createElement('div')
    coordLabel.style.position = 'fixed'
    coordLabel.style.left = (draggedItemCenter.x - 35) + 'px'
    coordLabel.style.top = (draggedItemCenter.y + 18) + 'px'
    coordLabel.style.color = '#00ff88'
    coordLabel.style.fontSize = '10px'
    coordLabel.style.fontFamily = 'monospace'
    coordLabel.style.fontWeight = 'bold'
    coordLabel.style.zIndex = '10001'
    coordLabel.style.pointerEvents = 'none'
    coordLabel.style.textShadow = '0 0 10px rgba(0, 255, 136, 1), 0 0 5px rgba(0, 255, 136, 0.8)'
    coordLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    coordLabel.style.padding = '3px 8px'
    coordLabel.style.borderRadius = '6px'
    coordLabel.style.border = '2px solid rgba(0, 255, 136, 0.4)'
    coordLabel.style.backdropFilter = 'blur(4px)'
    coordLabel.textContent = `[${draggedItemCenter.x.toFixed(0)}, ${draggedItemCenter.y.toFixed(0)}]`
    
    document.body.appendChild(draggedMarker)
    document.body.appendChild(coordLabel)
    targetingMarkers.push(draggedMarker, coordLabel)
  }
}

// Clear all targeting markers
function clearTargetingMarkers() {
  targetingMarkers.forEach(marker => {
    try {
      if (marker.parentNode) {
        marker.parentNode.removeChild(marker)
      }
    } catch (e) {
      // Ignore if already removed
    }
  })
  targetingMarkers = []
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
      
      // Create targeting markers
      createTargetingMarkers()
      
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
    
    // Update targeting markers
    createTargetingMarkers()
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
    
    // Clear targeting markers
    clearTargetingMarkers()
  }
  updateDebug()
}

export function cleanupSortable() {
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}