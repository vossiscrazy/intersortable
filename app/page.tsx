'use client'

import '@/lib/intersortable'

export default function Home() {
  return (
    <div className="h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="grid grid-cols-3 gap-6 min-w-max">
        <div className="bg-neutral-900 rounded-lg p-4 w-64 h-48 flex flex-col gap-2" data-intersortable-container-id="ai-research">
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="agi-lab">Build AGI lab</div>
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="compute-cluster">Scale compute cluster</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4 w-64 h-48 flex flex-col gap-2" data-intersortable-container-id="energy">
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="fusion-reactor">Ship fusion reactor</div>
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="energy-grid">Optimize energy grid</div>
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="solar-array">Deploy solar array</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4 w-64 h-48 flex flex-col gap-2" data-intersortable-container-id="space">
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="mars-mission">Launch Mars mission</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4 w-64 h-48 flex flex-col gap-2" data-intersortable-container-id="automation">
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="automate-factories">Automate factories</div>
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="robot-workforce">Build robot workforce</div>
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="scale-production">Scale production 10x</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4 w-64 h-48 flex flex-col gap-2" data-intersortable-container-id="backlog"></div>
        <div className="bg-neutral-900 rounded-lg p-4 w-64 h-48 flex flex-col gap-2" data-intersortable-container-id="biotech">
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="genome-sequence">Sequence entire genome</div>
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="longevity-engineering">Engineer longevity</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4 w-64 h-48 flex flex-col gap-2" data-intersortable-container-id="quantum">
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="quantum-computer">Build quantum computer</div>
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="crack-encryption">Crack encryption</div>
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="simulate-universe">Simulate universe</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4 w-64 h-48 flex flex-col gap-2" data-intersortable-container-id="acceleration">
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="accelerate-progress">Accelerate progress</div>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4 w-64 h-48 flex flex-col gap-2" data-intersortable-container-id="enhancement">
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="neural-implants">Deploy neural implants</div>
          <div className="bg-neutral-800 rounded px-3 py-2 text-neutral-200 text-sm" data-intersortable-item-id="enhance-cognition">Enhance cognition</div>
        </div>
      </div>
    </div>
  )
}