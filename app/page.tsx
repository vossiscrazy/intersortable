'use client'

import { useEffect } from 'react'
import { initSortable, cleanupSortable } from '@/lib/intra-sortable'

export default function Home() {
  useEffect(() => {
    initSortable()
    return () => cleanupSortable()
  }, [])
  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-neutral-100 text-4xl font-bold text-center mb-8">Todo Lists</h1>
        
        <div className="relative">
          <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-900 px-1">GRID CONTAINER</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-neutral-600 p-4">
            {/* Todo List */}
            <div className="relative">
              <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-900 px-1">LIST CONTAINER</span>
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-600">
                <div className="relative">
                  <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-800 px-1">LIST HEADER</span>
                  <h2 className="text-neutral-100 text-2xl font-semibold mb-4 border border-neutral-600 p-2">Todo</h2>
                </div>
                <div className="relative">
                  <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-800 px-1">ITEMS CONTAINER</span>
                  <div className="space-y-2 border border-neutral-600 p-2" data-board="todo">
                    <div className="relative">
                      <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-700 px-1">ITEM</span>
                      <div className="bg-neutral-700 rounded p-3 text-neutral-100 border border-neutral-500 flex justify-between items-center" data-sortable-item="todo-1">
                        <span>Build AGI to accelerate technological progress</span>
                        <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6 opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing" data-drag-handle />
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-700 px-1">ITEM</span>
                      <div className="bg-neutral-700 rounded p-3 text-neutral-100 border border-neutral-500 flex justify-between items-center" data-sortable-item="todo-2">
                        <span>Optimize energy production for civilization</span>
                        <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6 opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing" data-drag-handle />
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-700 px-1">ITEM</span>
                      <div className="bg-neutral-700 rounded p-3 text-neutral-100 border border-neutral-500 flex justify-between items-center" data-sortable-item="todo-3">
                        <span>Develop sustainable space colonization tech</span>
                        <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6 opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing" data-drag-handle />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Done List */}
            <div className="relative">
              <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-900 px-1">LIST CONTAINER</span>
              <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-600">
                <div className="relative">
                  <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-800 px-1">LIST HEADER</span>
                  <h2 className="text-neutral-100 text-2xl font-semibold mb-4 border border-neutral-600 p-2">Done</h2>
                </div>
                <div className="relative">
                  <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-800 px-1">ITEMS CONTAINER</span>
                  <div className="space-y-2 border border-neutral-600 p-2" data-board="done">
                    <div className="relative">
                      <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-700 px-1">ITEM</span>
                      <div className="bg-neutral-700 rounded p-3 text-neutral-300 line-through border border-neutral-500 flex justify-between items-center" data-sortable-item="done-1">
                        <span>Launch nuclear fusion startup</span>
                        <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6 opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing" data-drag-handle />
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute -top-4 left-0 text-xs text-neutral-400 bg-neutral-700 px-1">ITEM</span>
                      <div className="bg-neutral-700 rounded p-3 text-neutral-300 line-through border border-neutral-500 flex justify-between items-center" data-sortable-item="done-2">
                        <span>Scale renewable battery manufacturing</span>
                        <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6 opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing" data-drag-handle />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Debug Dashboard */}
        <div className="mt-8 bg-neutral-800 rounded-lg p-4">
          <h3 className="text-neutral-100 text-lg font-semibold mb-2">Debug Dashboard</h3>
          <div id="drag-debug" className="text-neutral-300 text-sm space-y-1">
            <div>Is Dragging: false</div>
            <div>Dragged Element: null</div>
            <div>Has Clone: false</div>
            <div>Mouse: 0, 0</div>
            <div>Last Event: none</div>
          </div>
        </div>
      </div>
    </div>
  );
}
