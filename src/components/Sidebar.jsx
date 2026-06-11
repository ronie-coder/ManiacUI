import { useState, useMemo } from 'react'
import './Sidebar.css'

const GROUPS = [
  {
    label: '3D & Physics',
    items: [
      { id: 'carousel', name: '3D Carousel' },
      { id: 'lanyard', name: 'Lanyard' },
      { id: 'blob', name: 'Blob' },

      { id: 'fluidorb', name: 'Fluid Orb' },
      { id: 'cubepit', name: 'CubePit' },
    ],
  },
  {
    label: 'Effects',
    items: [
      { id: 'shockbutton', name: 'Shock Button' },
      { id: 'scrambletext', name: 'Scramble Text' },
      { id: 'warpcard', name: 'Warp Card' },
      { id: 'infinitemarquee', name: 'Infinite Marquee' },
      { id: 'gridmorph', name: 'Grid Morph' },
      { id: 'liquidchrome', name: 'Liquid Chrome' },
    ],
  },
  {
    label: 'Interactive',
    items: [
      { id: 'particleimage', name: 'Particle Image' },
      { id: 'ripplereveal', name: 'Ripple Reveal' },
      { id: 'magneticstack', name: 'Magnetic Stack' },
      { id: 'cursortrail', name: 'Cursor Trail' },
      { id: 'kinetictext', name: 'Kinetic Text' },
    ],
  },
  {
    label: 'Utilities',
    items: [
      { id: 'gradientmesh', name: 'Gradient Mesh' },
      { id: 'noiseborder', name: 'Noise Border' },
      { id: 'scrollprogress', name: 'Scroll Progress' },
    ],
  },
]

export default function Sidebar({ activeId, onSelect, open }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return GROUPS
    const q = query.toLowerCase()
    return GROUPS.map(g => ({
      ...g,
      items: g.items.filter(i => i.name.toLowerCase().includes(q)),
    })).filter(g => g.items.length > 0)
  }, [query])

  return (
    <aside className={`sb-root ${open ? 'open' : ''}`}>
      <div className="sb-search">
        <svg className="sb-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          className="sb-search-input"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div className="sb-list">
        {filtered.map(group => (
          <div key={group.label} className="sb-group">
            <div className="sb-group-label">{group.label}</div>
            {group.items.map(c => (
              <button
                key={c.id}
                className={`sb-item ${activeId === c.id ? 'active' : ''}`}
                onClick={() => onSelect(c.id)}
              >
                <span className="sb-item-dot" />
                <span className="sb-item-name">{c.name}</span>
              </button>
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="sb-empty">No results</div>
        )}
      </div>
    </aside>
  )
}
