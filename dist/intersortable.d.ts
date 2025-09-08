export interface IntersortableConfig {
    onMove?: (data: {
        itemId: string;
        fromContainer: string;
        toContainer: string;
        newIndex: number;
        allContainers: Record<string, string[]>;
    }) => void;
    onComplete?: (allContainers: Record<string, string[]>) => void;
    getItemId?: (element: HTMLElement) => string;
    getContainerId?: (element: HTMLElement) => string;
}
export declare function initSortable(userConfig?: IntersortableConfig): void;
export declare function restoreSortOrder(savedOrder: Record<string, string[]>): void;
export declare function cleanupSortable(): void;
