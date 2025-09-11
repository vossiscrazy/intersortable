'use client'

import { useState, useEffect } from 'react'
import Intersortable, { type ContainerState } from '@/lib/intersortable'

export default function Home() {
  const [onPickupState, setOnPickupState] = useState<ContainerState | null>(null)
  const [onDropState, setOnDropState] = useState<ContainerState | null>(null)

  useEffect(() => {
    // Initialize intersortable with callbacks
    const intersortable = new Intersortable({
      onPickup: (state) => {
        setOnPickupState(state);
        setOnDropState(null); // Clear previous drop state
      },
      onDrop: (state) => setOnDropState(state)
    });

    // Cleanup function
    return () => {
      // No cleanup needed as the instance will be garbage collected
    };
  }, []);
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Intersortable</h1>
          <p className="text-xl text-neutral-400">Sort items between containers with smooth animations</p>
        </div>
        
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-neutral-900 rounded-lg p-6 min-h-32 flex flex-col gap-3" data-intersortable-container-id="watch">
            <h2 className="text-lg font-semibold text-neutral-300 mb-2">Watch</h2>
            <div className="bg-neutral-800 rounded px-4 py-3 text-neutral-200 text-sm" data-intersortable-item-id="task-1">Build AGI lab</div>
            <div className="bg-neutral-800 rounded px-4 py-3 text-neutral-200 text-sm flex items-center justify-between" data-intersortable-item-id="task-2">
              <span>Ship fusion reactor</span>
              <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-4 h-4 text-neutral-500" data-intersortable-drag-handle />
            </div>
            <div className="bg-neutral-800 rounded px-4 py-3 text-neutral-200 text-sm" data-intersortable-item-id="task-3">Launch Mars mission</div>
            <div className="bg-neutral-800 rounded px-4 py-3 text-neutral-200 text-sm" data-intersortable-item-id="task-4">Build quantum computer</div>
          </div>
          <div className="bg-neutral-900 rounded-lg p-6 min-h-32 flex flex-col gap-3" data-intersortable-container-id="todo">
            <h2 className="text-lg font-semibold text-neutral-300 mb-2">Todo</h2>
            <div className="bg-neutral-800 rounded px-4 py-3 text-neutral-200 text-sm" data-intersortable-item-id="task-5">Scale compute cluster</div>
            <div className="bg-neutral-800 rounded px-4 py-3 text-neutral-200 text-sm flex items-center justify-between" data-intersortable-item-id="task-6">
              <span>Optimize energy grid</span>
              <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-4 h-4 text-neutral-500" data-intersortable-drag-handle />
            </div>
          </div>
          <div className="bg-neutral-900 rounded-lg p-6 min-h-32 flex flex-col gap-3" data-intersortable-container-id="later">
            <h2 className="text-lg font-semibold text-neutral-300 mb-2">Later</h2>
          </div>
        </div>
        
        {/* Dashboard */}
        <div className="mt-16 pt-16 border-t border-neutral-800">
          <h2 className="text-2xl font-semibold text-white mb-8">State Dashboard</h2>
          <div className="grid grid-cols-3 gap-8">
            
            {/* On Pickup State */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h3 className="text-lg font-medium text-neutral-300 mb-4">On Pickup</h3>
              {onPickupState ? (
                <div className="space-y-4">
                  {Object.entries(onPickupState).map(([containerId, items]) => (
                    <div key={containerId} className="bg-neutral-800 rounded p-3">
                      <div className="text-sm font-medium text-neutral-400 mb-2 capitalize">{containerId}</div>
                      {items.length > 0 ? (
                        <div className="space-y-1">
                          {items.map((item, index) => (
                            <div key={index} className="text-xs text-neutral-300 bg-neutral-700 px-2 py-1 rounded">
                              <span className="font-medium">{item.text}</span>
                              <span className="text-neutral-500 ml-2">#{item.id}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-500 italic">Empty</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-500 text-sm">Waiting for pickup...</div>
              )}
            </div>
            
            {/* On Drop State */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h3 className="text-lg font-medium text-neutral-300 mb-4">On Drop</h3>
              {onDropState ? (
                <div className="space-y-4">
                  {Object.entries(onDropState).map(([containerId, items]) => (
                    <div key={containerId} className="bg-neutral-800 rounded p-3">
                      <div className="text-sm font-medium text-neutral-400 mb-2 capitalize">{containerId}</div>
                      {items.length > 0 ? (
                        <div className="space-y-1">
                          {items.map((item, index) => (
                            <div key={index} className="text-xs text-neutral-300 bg-neutral-700 px-2 py-1 rounded">
                              <span className="font-medium">{item.text}</span>
                              <span className="text-neutral-500 ml-2">#{item.id}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-500 italic">Empty</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-neutral-500 text-sm">Waiting for drop...</div>
              )}
            </div>
            
            {/* Third column - placeholder for now */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h3 className="text-lg font-medium text-neutral-300 mb-4">Future Callbacks</h3>
              <div className="text-neutral-500 text-sm">Additional callbacks will appear here</div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}