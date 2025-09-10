// intersortable.ts - Clean slate rework

interface DragState {
  isDragging: boolean;
  originalItem: HTMLElement | null;
  cloneItem: HTMLElement | null;
  startX: number;
  startY: number;
  targetingMarkers: HTMLElement[];
  nearestItem: HTMLElement | null;
  lastTargetedElement: HTMLElement | null;
  ghostItems: HTMLElement[];
  animatingElements: Set<HTMLElement>;
}

class Intersortable {
  private dragState: DragState = {
    isDragging: false,
    originalItem: null,
    cloneItem: null,
    startX: 0,
    startY: 0,
    targetingMarkers: [],
    nearestItem: null,
    lastTargetedElement: null,
    ghostItems: [],
    animatingElements: new Set()
  };

  constructor() {
    this.init();
  }

  private init() {
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  private handleMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const item = target.closest('[data-intersortable-item-id]') as HTMLElement;
    
    if (!item) return;

    event.preventDefault();
    
    this.dragState.isDragging = true;
    this.dragState.originalItem = item;
    this.dragState.startX = event.clientX;
    this.dragState.startY = event.clientY;

    // Set original item to 40% opacity
    item.style.opacity = '0.4';

    // Create clone
    this.createClone(item, event.clientX, event.clientY);
    
    // Initialize targeting system
    this.initializeTargetingSystem();
  }

  private createClone(originalItem: HTMLElement, x: number, y: number) {
    const clone = originalItem.cloneNode(true) as HTMLElement;
    const rect = originalItem.getBoundingClientRect();
    
    // Style the clone
    clone.style.position = 'fixed';
    clone.style.left = `${rect.left}px`;
    clone.style.top = `${rect.top}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.transform = 'scale(1.05)';
    clone.style.transformOrigin = 'center';
    clone.style.pointerEvents = 'none';
    clone.style.zIndex = '1000';
    clone.style.opacity = '1';
    
    // Add style hook class
    clone.classList.add('intersortable-drag-clone');
    
    // Remove the data attribute to avoid conflicts
    clone.removeAttribute('data-intersortable-item-id');
    
    document.body.appendChild(clone);
    this.dragState.cloneItem = clone;
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.dragState.isDragging || !this.dragState.cloneItem) return;

    const deltaX = event.clientX - this.dragState.startX;
    const deltaY = event.clientY - this.dragState.startY;
    
    // Keep clone attached to cursor based on initial position
    const rect = this.dragState.cloneItem.getBoundingClientRect();
    const initialLeft = parseFloat(this.dragState.cloneItem.style.left);
    const initialTop = parseFloat(this.dragState.cloneItem.style.top);
    
    this.dragState.cloneItem.style.left = `${initialLeft + deltaX}px`;
    this.dragState.cloneItem.style.top = `${initialTop + deltaY}px`;
    
    // Update start position for next movement calculation
    this.dragState.startX = event.clientX;
    this.dragState.startY = event.clientY;
    
    // Update targeting system
    this.updateTargetingSystem();
  }

  private handleMouseUp(event: MouseEvent) {
    if (!this.dragState.isDragging) return;

    // Restore original item opacity
    if (this.dragState.originalItem) {
      this.dragState.originalItem.style.opacity = '';
    }

    // Remove clone
    if (this.dragState.cloneItem) {
      document.body.removeChild(this.dragState.cloneItem);
    }

    // Clean up targeting system
    this.cleanupTargetingSystem();

    // Clean up ghost items
    this.cleanupGhostItems();

    // Reset drag state
    this.dragState = {
      isDragging: false,
      originalItem: null,
      cloneItem: null,
      startX: 0,
      startY: 0,
      targetingMarkers: [],
      nearestItem: null,
      lastTargetedElement: null,
      ghostItems: [],
      animatingElements: new Set()
    };
  }

  private initializeTargetingSystem() {
    // Get all intersortable containers
    const allContainers = document.querySelectorAll('[data-intersortable-container-id]') as NodeListOf<HTMLElement>;
    
    allContainers.forEach(container => {
      const items = container.querySelectorAll('[data-intersortable-item-id]');
      
      if (items.length === 0) {
        // Empty container - create ghost item and target it
        const ghostItem = this.createGhostItem();
        container.appendChild(ghostItem);
        this.dragState.ghostItems.push(ghostItem);
        
        const marker = this.createTargetingMarker(ghostItem, 'item');
        this.dragState.targetingMarkers.push(marker);
        document.body.appendChild(marker);
      } else {
        // Container has items - target each item
        items.forEach(item => {
          const marker = this.createTargetingMarker(item as HTMLElement, 'item');
          this.dragState.targetingMarkers.push(marker);
          document.body.appendChild(marker);
        });
      }
    });
    
    this.updateTargetingSystem();
  }

  private createGhostItem(): HTMLElement {
    // Create a simple ghost item
    const ghost = document.createElement('div');
    ghost.className = 'bg-neutral-700 rounded px-3 py-2 text-neutral-300 text-sm';
    ghost.setAttribute('data-intersortable-item-id', `ghost-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    ghost.textContent = '👻 Drop here';
    ghost.style.opacity = '0';
    ghost.style.pointerEvents = 'none';
    
    return ghost;
  }

  private createTargetingMarker(element: HTMLElement, type: 'item' | 'container'): HTMLElement {
    const marker = document.createElement('div');
    marker.className = 'intersortable-targeting-marker';
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    marker.style.position = 'fixed';
    marker.style.left = `${centerX}px`;
    marker.style.top = `${centerY}px`;
    marker.style.transform = 'translate(-50%, -50%)';
    marker.style.pointerEvents = 'none';
    marker.style.zIndex = '999';
    
    // Store reference to the element
    if (type === 'item') {
      marker.setAttribute('data-target-item-id', element.getAttribute('data-intersortable-item-id') || '');
    } else {
      marker.setAttribute('data-target-container-id', element.getAttribute('data-intersortable-container-id') || '');
    }
    
    return marker;
  }

  private updateTargetingSystem() {
    if (!this.dragState.cloneItem) return;
    
    const cloneRect = this.dragState.cloneItem.getBoundingClientRect();
    const cloneCenterX = cloneRect.left + cloneRect.width / 2;
    const cloneCenterY = cloneRect.top + cloneRect.height / 2;
    
    let nearestDistance = Infinity;
    let nearestMarker: HTMLElement | null = null;
    
    // Update all markers and find nearest
    this.dragState.targetingMarkers.forEach(marker => {
      const markerRect = marker.getBoundingClientRect();
      const markerCenterX = markerRect.left + markerRect.width / 2;
      const markerCenterY = markerRect.top + markerRect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(cloneCenterX - markerCenterX, 2) + 
        Math.pow(cloneCenterY - markerCenterY, 2)
      );
      
      // Remove previous targeting state
      marker.classList.remove('intersortable-targeting-active');
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestMarker = marker;
      }
    });
    
    // Highlight nearest marker
    if (nearestMarker) {
      nearestMarker.classList.add('intersortable-targeting-active');
      
      // Find the corresponding element (item or container)
      const targetItemId = nearestMarker.getAttribute('data-target-item-id');
      const targetContainerId = nearestMarker.getAttribute('data-target-container-id');
      
      if (targetItemId) {
        this.dragState.nearestItem = document.querySelector(`[data-intersortable-item-id="${targetItemId}"]`) as HTMLElement;
      } else if (targetContainerId) {
        this.dragState.nearestItem = document.querySelector(`[data-intersortable-container-id="${targetContainerId}"]`) as HTMLElement;
      }
      
      // Move original item in real-time
      this.moveOriginalItem();
    }
  }

  private moveOriginalItem() {
    if (!this.dragState.originalItem || !this.dragState.nearestItem || !this.dragState.cloneItem) return;
    
    const nearestElement = this.dragState.nearestItem;
    const originalItem = this.dragState.originalItem;
    
    // Check if nearest element is a ghost item
    const isGhost = nearestElement.getAttribute('data-intersortable-item-id')?.startsWith('ghost-');
    
    let needsRecreate = false;
    let targetParent: Node | null = null;
    let insertionPoint: Node | null = null;
    
    if (isGhost) {
      // Replace ghost with original item
      const ghostParent = nearestElement.parentNode;
      if (ghostParent && originalItem.parentNode !== ghostParent) {
        // Remove the ghost from our tracking since it's being replaced
        const ghostIndex = this.dragState.ghostItems.indexOf(nearestElement);
        if (ghostIndex > -1) {
          this.dragState.ghostItems.splice(ghostIndex, 1);
        }
        
        targetParent = ghostParent;
        insertionPoint = nearestElement;
        needsRecreate = true;
      }
    } else {
      // Move above or below the targeted item (normal behavior)
      const cloneRect = this.dragState.cloneItem.getBoundingClientRect();
      const targetRect = nearestElement.getBoundingClientRect();
      
      const cloneCenterY = cloneRect.top + cloneRect.height / 2;
      const targetCenterY = targetRect.top + targetRect.height / 2;
      
      if (cloneCenterY < targetCenterY) {
        // Clone is above target - insert before
        if (originalItem.nextElementSibling !== nearestElement) {
          targetParent = nearestElement.parentNode!;
          insertionPoint = nearestElement;
          needsRecreate = true;
        }
      } else {
        // Clone is below target - insert after
        if (originalItem.previousElementSibling !== nearestElement) {
          targetParent = nearestElement.parentNode!;
          insertionPoint = nearestElement.nextSibling;
          needsRecreate = true;
        }
      }
    }
    
    // Perform FLIP animation if we need to move
    if (needsRecreate && targetParent && insertionPoint !== undefined) {
      this.performFLIPAnimation(targetParent, insertionPoint, isGhost);
    }
    
    // Only recreate targeting system if DOM structure actually changed
    if (needsRecreate) {
      this.recreateTargetingSystem();
    }
  }

  private performFLIPAnimation(targetParent: Node, insertionPoint: Node | null, isGhostReplacement: boolean) {
    // FIRST: Capture all current positions
    const allItems = document.querySelectorAll('[data-intersortable-item-id]');
    const beforePositions = new Map<HTMLElement, DOMRect>();
    
    allItems.forEach(item => {
      beforePositions.set(item as HTMLElement, item.getBoundingClientRect());
    });
    
    // LAST: Make the DOM changes
    if (isGhostReplacement) {
      // Replace ghost with original item
      targetParent.replaceChild(this.dragState.originalItem!, insertionPoint as Node);
    } else {
      // Insert original item at new position
      if (insertionPoint) {
        targetParent.insertBefore(this.dragState.originalItem!, insertionPoint);
      } else {
        targetParent.appendChild(this.dragState.originalItem!);
      }
    }
    
    // INVERT: Calculate differences and animate
    allItems.forEach(item => {
      const beforeRect = beforePositions.get(item as HTMLElement);
      if (!beforeRect) return;
      
      const afterRect = item.getBoundingClientRect();
      const deltaX = beforeRect.left - afterRect.left;
      const deltaY = beforeRect.top - afterRect.top;
      
      // Only animate if there's a meaningful change
      if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
        this.animateElement(item as HTMLElement, deltaX, deltaY);
      }
    });
  }

  private animateElement(element: HTMLElement, deltaX: number, deltaY: number) {
    // Mark element as animating
    this.dragState.animatingElements.add(element);
    
    // PLAY: Animate from old position to new position
    const animation = element.animate([
      { transform: `translate(${deltaX}px, ${deltaY}px)` },
      { transform: 'translate(0, 0)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
    
    // Remove from animating set when done
    animation.addEventListener('finish', () => {
      this.dragState.animatingElements.delete(element);
    });
  }


  private recreateTargetingSystem() {
    // Store current nearest item to restore targeting after recreation
    const currentNearestItem = this.dragState.nearestItem;
    
    // Clean up existing markers
    this.dragState.targetingMarkers.forEach(marker => {
      if (marker.parentNode) {
        document.body.removeChild(marker);
      }
    });
    this.dragState.targetingMarkers = [];
    
    // Recreate all markers
    const allContainers = document.querySelectorAll('[data-intersortable-container-id]') as NodeListOf<HTMLElement>;
    
    allContainers.forEach(container => {
      const items = container.querySelectorAll('[data-intersortable-item-id]');
      
      if (items.length === 0) {
        // Empty container - create ghost item and target it
        const ghostItem = this.createGhostItem();
        container.appendChild(ghostItem);
        this.dragState.ghostItems.push(ghostItem);
        
        const marker = this.createTargetingMarker(ghostItem, 'item');
        this.dragState.targetingMarkers.push(marker);
        document.body.appendChild(marker);
      } else {
        // Container has items - target each item
        items.forEach(item => {
          const marker = this.createTargetingMarker(item as HTMLElement, 'item');
          this.dragState.targetingMarkers.push(marker);
          document.body.appendChild(marker);
        });
      }
    });
    
    // Restore targeting state immediately
    if (currentNearestItem) {
      this.dragState.nearestItem = currentNearestItem;
      this.highlightNearestTarget();
    }
  }

  private highlightNearestTarget() {
    if (!this.dragState.nearestItem) return;

    // Clear all previous active states
    this.dragState.targetingMarkers.forEach(marker => {
      marker.classList.remove('intersortable-targeting-active');
    });

    // Find and highlight the marker for the current nearest item
    const targetItemId = this.dragState.nearestItem.getAttribute('data-intersortable-item-id');
    const targetContainerId = this.dragState.nearestItem.getAttribute('data-intersortable-container-id');

    this.dragState.targetingMarkers.forEach(marker => {
      const markerItemId = marker.getAttribute('data-target-item-id');
      const markerContainerId = marker.getAttribute('data-target-container-id');
      
      if ((targetItemId && markerItemId === targetItemId) || 
          (targetContainerId && markerContainerId === targetContainerId)) {
        marker.classList.add('intersortable-targeting-active');
      }
    });
  }

  private cleanupTargetingSystem() {
    this.dragState.targetingMarkers.forEach(marker => {
      if (marker.parentNode) {
        document.body.removeChild(marker);
      }
    });
    this.dragState.targetingMarkers = [];
    this.dragState.nearestItem = null;
    this.dragState.lastTargetedElement = null;
  }

  private cleanupGhostItems() {
    this.dragState.ghostItems.forEach(ghost => {
      if (ghost.parentNode) {
        ghost.parentNode.removeChild(ghost);
      }
    });
    this.dragState.ghostItems = [];
  }
}

// Auto-initialize when the DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Intersortable());
  } else {
    new Intersortable();
  }
}

export default Intersortable;