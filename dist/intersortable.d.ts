export interface IntersortableConfig {
    onDragStart?: (data: {
        itemId: string;
        element: HTMLElement;
    }) => void;
    onMove?: (data: {
        itemId: string;
        fromContainer: string;
        toContainer: string;
        newIndex: number;
        allContainers: Record<string, string[]>;
    }) => void;
    onDOMStart?: (data: {
        itemId: string;
        fromContainer: string;
        toContainer: string;
    }) => void;
    onDOMComplete?: (allContainers: Record<string, string[]>) => void;
    onDragEnd?: () => void;
    getItemId?: (element: HTMLElement) => string;
    getContainerId?: (element: HTMLElement) => string;
}
export declare function initSortable(userConfig?: IntersortableConfig): void;
export declare function restoreSortOrder(savedOrder: Record<string, string[]>): void;
export declare function cleanupSortable(): void;
