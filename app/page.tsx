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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Todo List */}
          <div>
            <div className="bg-neutral-800 rounded-lg p-6">
              <h2 className="text-neutral-100 text-2xl font-semibold mb-4">Todo</h2>
              <div className="space-y-2" data-board="todo">
                <div className="bg-neutral-700 rounded p-3 text-neutral-100 flex justify-between items-center" data-sortable-item="todo-1">
                  <span>Build AGI to accelerate technological progress</span>
                  <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6 opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing" data-drag-handle />
                </div>
                <div className="bg-neutral-700 rounded p-3 text-neutral-100 flex justify-between items-center" data-sortable-item="todo-2">
                  <span>Optimize energy production for civilization</span>
                  <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6 opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing" data-drag-handle />
                </div>
                <div className="bg-neutral-700 rounded p-3 text-neutral-100 flex justify-between items-center" data-sortable-item="todo-3">
                  <span>Develop sustainable space colonization tech</span>
                  <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6 opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing" data-drag-handle />
                </div>
              </div>
            </div>
          </div>

          {/* Done List */}
          <div>
            <div className="bg-neutral-800 rounded-lg p-6">
              <h2 className="text-neutral-100 text-2xl font-semibold mb-4">Done</h2>
              <div className="space-y-2" data-board="done">
                <div className="bg-neutral-700 rounded p-3 text-neutral-300 line-through flex justify-between items-center" data-sortable-item="done-1">
                  <span>Launch nuclear fusion startup</span>
                  <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6 opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing" data-drag-handle />
                </div>
                <div className="bg-neutral-700 rounded p-3 text-neutral-300 line-through flex justify-between items-center" data-sortable-item="done-2">
                  <span>Scale renewable battery manufacturing</span>
                  <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6 opacity-60 hover:opacity-100 cursor-grab active:cursor-grabbing" data-drag-handle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}