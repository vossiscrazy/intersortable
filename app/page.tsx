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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Container A */}
          <div>
            <div className="bg-[#3c3836] rounded-lg p-6">
              <h2 className="text-[#ebdbb2] text-2xl font-semibold mb-4">Container A</h2>
              <div className="space-y-2" data-intersortable-container data-container-id="list-a">
                <div className="bg-[#504945] rounded p-3 text-[#ebdbb2] flex justify-between items-center" data-intersortable-item data-item-id="item-1">
                  <div className="flex items-center gap-2">
                    <img src="/icons/info.svg" alt="Info" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(92%) sepia(14%) saturate(218%) hue-rotate(16deg) brightness(97%) contrast(91%)'}} />
                    <span>Drag handle only</span>
                  </div>
                  <img src="/icons/drag-handle.svg" alt="Drag handle" className="w-6 h-6" style={{filter: 'brightness(0) saturate(100%) invert(92%) sepia(14%) saturate(218%) hue-rotate(16deg) brightness(97%) contrast(91%)'}} data-drag-handle />
                </div>
                <div className="bg-[#98971a] rounded p-3 text-[#282828]" data-intersortable-item data-item-id="item-3">
                  <div className="flex items-center gap-2">
                    <img src="/icons/sort-intra-container.svg" alt="Intra sort" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(21%) sepia(7%) saturate(2019%) hue-rotate(356deg) brightness(90%) contrast(91%)'}} />
                    <span>Reorder & sort</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Container B */}
          <div>
            <div className="bg-[#3c3836] rounded-lg p-6">
              <h2 className="text-[#ebdbb2] text-2xl font-semibold mb-4">Container B</h2>
              <div className="space-y-2" data-intersortable-container data-container-id="list-b">
                <div className="bg-[#d79921] rounded p-3 text-[#282828]" data-intersortable-item data-item-id="item-4">
                  <div className="flex items-center gap-2">
                    <img src="/icons/sort-inter-container.svg" alt="Inter sort" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(21%) sepia(7%) saturate(2019%) hue-rotate(356deg) brightness(90%) contrast(91%)'}} />
                    <span>Between containers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Documentation Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-[#3c3836] rounded-lg p-8">
            <h2 className="text-[#ebdbb2] text-3xl font-bold mb-6 text-center">Sortable Items Between Multiple Containers</h2>
            
            <div className="text-[#bdae93] text-lg leading-relaxed space-y-6">
              <p>
                The biggest mistake you can make when building sortable lists is choosing a library 
                built for every possible use case instead of{' '}
                <strong className="text-[#ebdbb2]">your specific need</strong>: moving items between containers. 
                Most developers waste weeks configuring complex solutions when they simply need to 
                drag tasks between Kanban columns or sort items across multiple lists.
              </p>
              
              <p>
                <strong className="text-[#ebdbb2]">Intersortable</strong> was designed by developers who understand that 
                your users don&apos;t care about your implementation—they care about results. 
                Built for <strong className="text-[#ebdbb2]">Next.js</strong> and React 18+, 
                it solves the inter-container sorting problem without the complexity overhead 
                that general-purpose libraries impose.
              </p>
              
              <div className="bg-[#282828] rounded-lg p-6 my-8">
                <h3 className="text-[#ebdbb2] text-xl font-semibold mb-4">The 60-Second Implementation</h3>
                <p className="text-[#bdae93] text-sm mb-4">
                  While others require configuration files and provider wrappers, we require two HTML attributes.
                </p>
                <pre className="text-sm overflow-x-auto">
                  <code>
                    <span className="text-[#928374]">{`<!-- Your HTML -->`}</span>{`
`}<span className="text-[#fe8019]">&lt;</span><span className="text-[#8ec07c]">div</span> <span className="text-[#fabd2f]">data-intersortable-container</span> <span className="text-[#fabd2f]">data-container-id</span>=<span className="text-[#b8bb26]">&quot;my-list&quot;</span><span className="text-[#fe8019]">&gt;</span>{`
  `}<span className="text-[#fe8019]">&lt;</span><span className="text-[#8ec07c]">div</span> <span className="text-[#fabd2f]">data-intersortable-item</span> <span className="text-[#fabd2f]">data-item-id</span>=<span className="text-[#b8bb26]">&quot;item-1&quot;</span><span className="text-[#fe8019]">&gt;</span>{`
    `}<span className="text-[#fe8019]">&lt;</span><span className="text-[#8ec07c]">span</span><span className="text-[#fe8019]">&gt;</span>Drag me anywhere<span className="text-[#fe8019]">&lt;/</span><span className="text-[#8ec07c]">span</span><span className="text-[#fe8019]">&gt;</span>{`
  `}<span className="text-[#fe8019]">&lt;/</span><span className="text-[#8ec07c]">div</span><span className="text-[#fe8019]">&gt;</span>{`
  `}<span className="text-[#fe8019]">&lt;</span><span className="text-[#8ec07c]">div</span> <span className="text-[#fabd2f]">data-intersortable-item</span> <span className="text-[#fabd2f]">data-item-id</span>=<span className="text-[#b8bb26]">&quot;item-2&quot;</span><span className="text-[#fe8019]">&gt;</span>{`
    `}<span className="text-[#fe8019]">&lt;</span><span className="text-[#8ec07c]">span</span><span className="text-[#fe8019]">&gt;</span>Or just this handle<span className="text-[#fe8019]">&lt;/</span><span className="text-[#8ec07c]">span</span><span className="text-[#fe8019]">&gt;</span>{`
    `}<span className="text-[#fe8019]">&lt;</span><span className="text-[#8ec07c]">div</span> <span className="text-[#fabd2f]">data-drag-handle</span><span className="text-[#fe8019]">&gt;</span>⋮⋮<span className="text-[#fe8019]">&lt;/</span><span className="text-[#8ec07c]">div</span><span className="text-[#fe8019]">&gt;</span>{`
  `}<span className="text-[#fe8019]">&lt;/</span><span className="text-[#8ec07c]">div</span><span className="text-[#fe8019]">&gt;</span>{`
`}<span className="text-[#fe8019]">&lt;/</span><span className="text-[#8ec07c]">div</span><span className="text-[#fe8019]">&gt;</span>{`

`}{/* Your JavaScript (entire implementation) */}{`
`}<span className="text-[#fb4934]">import</span> <span className="text-[#fe8019]">{`{`}</span> <span className="text-[#83a598]">initSortable</span> <span className="text-[#fe8019]">{`}`}</span> <span className="text-[#fb4934]">from</span> <span className="text-[#b8bb26]">&apos;./intersortable&apos;</span>{`

`}<span className="text-[#8ec07c]">initSortable</span><span className="text-[#fe8019]">(</span><span className="text-[#fe8019]">{`{`}</span>{`
  `}<span className="text-[#83a598]">onMove</span><span className="text-[#fe8019]">:</span> <span className="text-[#fe8019]">(</span><span className="text-[#fe8019]">{`{`}</span> <span className="text-[#fabd2f]">allContainers</span> <span className="text-[#fe8019]">{`}`}</span><span className="text-[#fe8019]">)</span> <span className="text-[#fb4934]">=&gt;</span> <span className="text-[#fe8019]">{`{`}</span>{`
    `}{/* State persistence in 60 seconds */}{`
    `}<span className="text-[#fabd2f]">localStorage</span><span className="text-[#fe8019]">.</span><span className="text-[#8ec07c]">setItem</span><span className="text-[#fe8019]">(</span><span className="text-[#b8bb26]">&apos;sortOrder&apos;</span><span className="text-[#fe8019]">,</span> <span className="text-[#d3869b]">JSON</span><span className="text-[#fe8019]">.</span><span className="text-[#8ec07c]">stringify</span><span className="text-[#fe8019]">(</span><span className="text-[#fabd2f]">allContainers</span><span className="text-[#fe8019]">)</span><span className="text-[#fe8019]">)</span>{`
  `}<span className="text-[#fe8019]">{`}`}</span>{`
`}<span className="text-[#fe8019]">{`}`}</span><span className="text-[#fe8019]">)</span>
                  </code>
                </pre>
              </div>
              
              <p>
                This is not an accident. Every line was written to solve real problems that real developers face.{' '}
                <strong className="text-[#ebdbb2]">No abstractions for the sake of abstractions.</strong>{' '}
                No features that sound impressive in documentation but fail in production.
              </p>
              
              <div className="bg-[#504945] rounded-lg p-6 my-8">
                <h4 className="text-[#ebdbb2] text-xl font-semibold mb-4">The Facts Speak for Themselves</h4>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-[#d79921] text-3xl font-bold">5.7kb</div>
                    <div className="text-[#bdae93] text-sm">Minified bundle size</div>
                  </div>
                  <div>
                    <div className="text-[#d79921] text-3xl font-bold">0</div>
                    <div className="text-[#bdae93] text-sm">Dependencies</div>
                  </div>
                  <div>
                    <div className="text-[#d79921] text-3xl font-bold">1</div>
                    <div className="text-[#bdae93] text-sm">Function call to implement</div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 my-8">
                <div className="bg-[#282828] rounded-lg p-6">
                  <h4 className="text-[#ebdbb2] text-lg font-semibold mb-3 flex items-center gap-2">
                    <img src="/icons/info.svg" alt="Info" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(92%) sepia(14%) saturate(218%) hue-rotate(16deg) brightness(97%) contrast(91%)'}} />
                    Intelligence, Not Configuration
                  </h4>
                  <p className="text-[#bdae93]">
                    Intersortable reads your intent from your HTML. Drag handles when present,{' '}
                    full-item dragging when not. No setup required.
                  </p>
                </div>
                
                <div className="bg-[#282828] rounded-lg p-6">
                  <h4 className="text-[#ebdbb2] text-lg font-semibold mb-3 flex items-center gap-2">
                    <img src="/icons/sort-inter-container.svg" alt="Inter sort" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(92%) sepia(14%) saturate(218%) hue-rotate(16deg) brightness(97%) contrast(91%)'}} />
                    Performance by Design
                  </h4>
                  <p className="text-[#bdae93]">
                    Built for Next.js Server Components. Minimal runtime overhead.{' '}
                    Natural mouse interactions that feel like desktop software.
                  </p>
                </div>
              </div>
              
              <div className="bg-[#504945] rounded-lg p-6 my-8 text-center">
                <h4 className="text-[#d79921] text-2xl font-bold mb-3">Why Developers Choose Intersortable</h4>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <div className="text-[#ebdbb2] font-semibold mb-2">Production Ready</div>
                    <div className="text-[#bdae93] text-sm">Zero configuration. Works with existing CSS frameworks. Handles edge cases you haven&apos;t thought of.</div>
                  </div>
                  <div>
                    <div className="text-[#ebdbb2] font-semibold mb-2">Developer Experience</div>
                    <div className="text-[#bdae93] text-sm">IntelliSense support. TypeScript definitions. Clear error messages when something goes wrong.</div>
                  </div>
                  <div>
                    <div className="text-[#ebdbb2] font-semibold mb-2">Performance First</div>
                    <div className="text-[#bdae93] text-sm">Native DOM events. Minimal re-renders. Works smoothly on mobile devices and low-end hardware.</div>
                  </div>
                  <div>
                    <div className="text-[#ebdbb2] font-semibold mb-2">Future Proof</div>
                    <div className="text-[#bdae93] text-sm">Built for React 18+ Server Components. Compatible with Suspense. Ready for concurrent features.</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#282828] rounded-lg p-6 my-8">
                <h3 className="text-[#ebdbb2] text-xl font-semibold mb-4">CSS Customization</h3>
                <p className="text-[#bdae93] mb-6">
                  Customize the drag appearance and animations using CSS custom properties and classes. 
                  No JavaScript configuration needed—just CSS!
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-[#3c3836] rounded p-4">
                    <h4 className="text-[#d79921] text-sm font-semibold mb-2">CSS Custom Properties</h4>
                    <pre className="text-xs text-[#bdae93] overflow-x-auto">
<code>{`:root {
  /* Clone appearance */
  --intersortable-clone-scale: 1.08;
  --intersortable-clone-opacity: 0.9;
  --intersortable-clone-shadow: 0 20px 40px rgba(0,0,0,0.3);
  --intersortable-clone-z-index: 10000;
  
  /* Dragged item opacity */
  --intersortable-dragging-opacity: 0.3;
  
  /* Animation timing */
  --intersortable-animation-duration: 0.3s;
  --intersortable-animation-easing: ease-out;
  --intersortable-displaced-duration: 0.25s;
  
  /* Cursors */
  --intersortable-cursor-grabbing: grabbing;
  --intersortable-cursor-default: auto;
}`}</code>
                    </pre>
                  </div>
                  
                  <div className="bg-[#3c3836] rounded p-4">
                    <h4 className="text-[#d79921] text-sm font-semibold mb-2">CSS Classes</h4>
                    <pre className="text-xs text-[#bdae93] overflow-x-auto">
<code>{`/* Style the clone */
.intersortable-clone {
  border: 2px solid #d79921;
  border-radius: 8px;
  backdrop-filter: blur(4px);
}

/* Style the original item while dragging */
.intersortable-dragging {
  transform: rotate(-2deg);
  filter: grayscale(50%);
}

/* Target by state */
[data-intersortable-state="clone"] {
  box-shadow: 0 0 0 3px rgba(215, 153, 33, 0.3);
}

[data-intersortable-state="dragging"] {
  outline: 2px dashed #d79921;
}`}</code>
                    </pre>
                  </div>
                </div>
                
                <div className="bg-[#504945] rounded p-4">
                  <h4 className="text-[#ebdbb2] text-sm font-semibold mb-2">💡 Pro Tip</h4>
                  <p className="text-[#bdae93] text-sm">
                    Use both CSS custom properties for values and CSS classes for complete style overrides. 
                    Custom properties are inherited, so you can set different styles per container!
                  </p>
                </div>
              </div>

              <div className="bg-[#282828] rounded-lg p-6 my-8">
                <h3 className="text-[#ebdbb2] text-xl font-semibold mb-4">Complete API Reference</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <code className="text-[#d79921]">npm install intersortable</code>
                    <div className="text-[#bdae93] mt-1">Install the library in your Next.js or React project.</div>
                  </div>
                  <div>
                    <code className="text-[#d79921]">{`onMove({ itemId, fromContainer, toContainer, newIndex, allContainers })`}</code>
                    <div className="text-[#bdae93] mt-1">Real-time callback with complete state context. Use for live persistence.</div>
                  </div>
                  <div>
                    <code className="text-[#d79921]">onComplete(allContainers)</code>
                    <div className="text-[#bdae93] mt-1">Fired when dragging ends. Perfect for batch operations and analytics.</div>
                  </div>
                  <div>
                    <code className="text-[#d79921]">restoreSortOrder(savedOrder)</code>
                    <div className="text-[#bdae93] mt-1">Restore state from JSON. Works with localStorage, databases, or any storage.</div>
                  </div>
                  <div>
                    <code className="text-[#d79921]">data-intersortable-container</code> + <code className="text-[#d79921]">data-intersortable-item</code>
                    <div className="text-[#bdae93] mt-1">The only HTML attributes you need. Everything else is automatic.</div>
                  </div>
                </div>
              </div>
              
              <p className="text-center text-[#ebdbb2] text-xl font-medium">
                Stop wasting time on complex implementations. 
                <br/>Your users deserve software that simply works.
              </p>
              
              <div className="text-center pt-4">
                <span className="text-[#928374] text-sm">
                  Every detail matters. Every line of code serves a purpose. No exceptions.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}