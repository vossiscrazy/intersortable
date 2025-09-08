'use client'

import { useEffect } from 'react'
import { initSortable, cleanupSortable } from '@/lib/intersortable'

export default function Home() {
  useEffect(() => {
    initSortable({
      onMove: ({ itemId, fromContainer, toContainer, newIndex, allContainers }) => {
        console.log(`Moved ${itemId} from ${fromContainer} to ${toContainer} at index ${newIndex}`)
        console.log('All containers:', allContainers)
        // Here you would save to your backend/localStorage
        localStorage.setItem('sortOrder', JSON.stringify(allContainers))
      },
      onComplete: (allContainers) => {
        console.log('Drag complete. Final state:', allContainers)
      }
    })
    return () => cleanupSortable()
  }, [])
  
  return (
    <div className="min-h-screen bg-[#282828] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[#ebdbb2] text-4xl font-bold text-center mb-8">Intersortable</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* List A */}
          <div>
            <div className="bg-[#3c3836] rounded-lg p-6">
              <h2 className="text-[#ebdbb2] text-2xl font-semibold mb-4">List A</h2>
              <div className="space-y-2" data-intersortable-container data-container-id="list-a">
                <div className="bg-[#504945] rounded p-3 text-[#ebdbb2] flex justify-between items-center" data-intersortable-item data-item-id="item-1">
                  <div className="flex items-center gap-2">
                    <img src="/icons/info.svg" alt="Info" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(92%) sepia(14%) saturate(218%) hue-rotate(16deg) brightness(97%) contrast(91%)'}} />
                    <span>Drag handle only</span>
                  </div>
                  <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6 cursor-grab active:cursor-grabbing" style={{filter: 'brightness(0) saturate(100%) invert(92%) sepia(14%) saturate(218%) hue-rotate(16deg) brightness(97%) contrast(91%)'}} data-drag-handle />
                </div>
                <div className="bg-[#98971a] rounded p-3 text-[#282828] cursor-grab active:cursor-grabbing" data-intersortable-item data-item-id="item-3">
                  <div className="flex items-center gap-2">
                    <img src="/icons/sort-intra-container.svg" alt="Intra sort" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(21%) sepia(7%) saturate(2019%) hue-rotate(356deg) brightness(90%) contrast(91%)'}} />
                    <span>Reorder & sort</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* List B */}
          <div>
            <div className="bg-[#3c3836] rounded-lg p-6">
              <h2 className="text-[#ebdbb2] text-2xl font-semibold mb-4">List B</h2>
              <div className="space-y-2" data-intersortable-container data-container-id="list-b">
                <div className="bg-[#d79921] rounded p-3 text-[#282828] cursor-grab active:cursor-grabbing" data-intersortable-item data-item-id="item-4">
                  <div className="flex items-center gap-2">
                    <img src="/icons/sort-inter-container.svg" alt="Inter sort" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(21%) sepia(7%) saturate(2019%) hue-rotate(356deg) brightness(90%) contrast(91%)'}} />
                    <span>Between lists</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}