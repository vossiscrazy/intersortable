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
declare class Intersortable {
    private dragState;
    private callbacks;
    constructor(callbacks?: IntersortableCallbacks);
    private init;
    private handleMouseDown;
    private createClone;
    private handleMouseMove;
    private handleMouseUp;
    private initializeTargetingSystem;
    private createGhostItem;
    private updateTargetingSystem;
    private moveOriginalItem;
    private performFLIPAnimation;
    private animateElement;
    private recreateTargetingSystem;
    private cleanupTargetingSystem;
    private cleanupGhostItems;
    private getCurrentState;
    static init(callbacks?: IntersortableCallbacks): Intersortable;
}
export default Intersortable;
export type { IntersortableCallbacks, ContainerState, ItemInfo };
