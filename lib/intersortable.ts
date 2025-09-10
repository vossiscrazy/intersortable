// intersortable.ts - Clean slate rework

interface DragState {
  isDragging: boolean;
  originalItem: HTMLElement | null;
  cloneItem: HTMLElement | null;
  startX: number;
  startY: number;
  nearestItem: HTMLElement | null;
  lastTargetedElement: HTMLElement | null;
  ghostItems: HTMLElement[];
  animatingElements: Set<HTMLElement>;
}

interface IntersortableCallbacks {
  onPickup?: (state: ContainerState) => void;
  onDrop?: (state: ContainerState) => void;
}

interface ItemInfo {
  id: string;
  text: string;
  position: number;
}

interface ContainerState {
  [containerId: string]: ItemInfo[];
}

class Intersortable {
  private dragState: DragState = {
    isDragging: false,
    originalItem: null,
    cloneItem: null,
    startX: 0,
    startY: 0,
    nearestItem: null,
    lastTargetedElement: null,
    ghostItems: [],
    animatingElements: new Set()
  };
  private callbacks: IntersortableCallbacks = {};

  constructor(callbacks?: IntersortableCallbacks) {
    if (callbacks) {
      this.callbacks = callbacks;
    }
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
    
    // Trigger onPickup callback
    if (this.callbacks.onPickup) {
      this.callbacks.onPickup(this.getCurrentState());
    }
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

    // Trigger onDrop callback
    if (this.callbacks.onDrop) {
      this.callbacks.onDrop(this.getCurrentState());
    }

    // Reset drag state
    this.dragState = {
      isDragging: false,
      originalItem: null,
      cloneItem: null,
      startX: 0,
      startY: 0,
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
        // Empty container - create ghost item
        const ghostItem = this.createGhostItem();
        container.appendChild(ghostItem);
        this.dragState.ghostItems.push(ghostItem);
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


  private updateTargetingSystem() {
    if (!this.dragState.cloneItem) return;
    
    const cloneRect = this.dragState.cloneItem.getBoundingClientRect();
    const cloneCenterX = cloneRect.left + cloneRect.width / 2;
    const cloneCenterY = cloneRect.top + cloneRect.height / 2;
    
    let nearestDistance = Infinity;
    let nearestElement: HTMLElement | null = null;
    
    // Get all targetable elements (items and ghosts)
    const allItems = document.querySelectorAll('[data-intersortable-item-id]') as NodeListOf<HTMLElement>;
    
    // Find nearest element by calculating distances
    allItems.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const itemCenterX = itemRect.left + itemRect.width / 2;
      const itemCenterY = itemRect.top + itemRect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(cloneCenterX - itemCenterX, 2) + 
        Math.pow(cloneCenterY - itemCenterY, 2)
      );
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestElement = item;
      }
    });
    
    // Update nearest item and move original item
    if (nearestElement) {
      this.dragState.nearestItem = nearestElement;
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
      // Insert original item above the ghost (always before)
      const ghostParent = nearestElement.parentNode;
      if (ghostParent && originalItem.parentNode !== ghostParent) {
        targetParent = ghostParent;
        insertionPoint = nearestElement;  // Always insert before the ghost
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
      this.performFLIPAnimation(targetParent, insertionPoint);
    }
    
    // Only recreate targeting system if DOM structure actually changed
    if (needsRecreate) {
      this.recreateTargetingSystem();
    }
  }

  private performFLIPAnimation(targetParent: Node, insertionPoint: Node | null) {
    // FIRST: Capture all current positions
    const allItems = document.querySelectorAll('[data-intersortable-item-id]');
    const beforePositions = new Map<HTMLElement, DOMRect>();
    
    allItems.forEach(item => {
      beforePositions.set(item as HTMLElement, item.getBoundingClientRect());
    });
    
    // LAST: Make the DOM changes - always insert, never replace
    if (insertionPoint) {
      targetParent.insertBefore(this.dragState.originalItem!, insertionPoint);
    } else {
      targetParent.appendChild(this.dragState.originalItem!);
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
    // Recreate ghosts for empty containers
    const allContainers = document.querySelectorAll('[data-intersortable-container-id]') as NodeListOf<HTMLElement>;
    
    allContainers.forEach(container => {
      const items = container.querySelectorAll('[data-intersortable-item-id]');
      
      if (items.length === 0) {
        // Empty container - create ghost item
        const ghostItem = this.createGhostItem();
        container.appendChild(ghostItem);
        this.dragState.ghostItems.push(ghostItem);
      }
    });
  }

  private cleanupTargetingSystem() {
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

  private getCurrentState(): ContainerState {
    const state: ContainerState = {};
    const containers = document.querySelectorAll('[data-intersortable-container-id]') as NodeListOf<HTMLElement>;
    
    containers.forEach(container => {
      const containerId = container.getAttribute('data-intersortable-container-id')!;
      const items = container.querySelectorAll('[data-intersortable-item-id]') as NodeListOf<HTMLElement>;
      
      // Filter out ghost items by checking if they have ghost IDs or are in our ghost items array
      const realItems = Array.from(items).filter(item => {
        const itemId = item.getAttribute('data-intersortable-item-id') || '';
        const isGhost = itemId.startsWith('ghost-') || this.dragState.ghostItems.includes(item);
        return !isGhost;
      });
      
      state[containerId] = realItems.map((item, index) => ({
        id: item.getAttribute('data-intersortable-item-id') || '',
        text: item.textContent || '',
        position: index
      }));
    });
    
    return state;
  }

  // Static method to initialize with callbacks
  static init(callbacks?: IntersortableCallbacks): Intersortable {
    return new Intersortable(callbacks);
  }
}

// Export for manual initialization
export default Intersortable;
export type { IntersortableCallbacks, ContainerState, ItemInfo };