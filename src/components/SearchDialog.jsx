import { useState, useEffect, useRef, useCallback } from 'react'
import './SearchDialog.css'

const COMPONENTS = [
  { id: 'carousel', name: '3D Carousel', desc: '3D spinning carousel with drag physics' },
  { id: 'lanyard', name: 'Lanyard', desc: '3D ID badge with physics strap' },
  { id: 'blob', name: 'Blob', desc: 'Organic morphing 3D shape' },
  { id: 'cubepit', name: 'CubePit', desc: 'Physics-driven pit of colorful cubes' },

  { id: 'fluidorb', name: 'Fluid Orb', desc: 'Liquid gradient blob tracking cursor' },
  { id: 'shockbutton', name: 'Shock Button', desc: 'Ripple shockwave on click' },
  { id: 'scrambletext', name: 'Scramble Text', desc: 'Character scramble with glitch' },
  { id: 'warpcard', name: 'Warp Card', desc: 'Gravitational lensing card' },
  { id: 'infinitemarquee', name: 'Infinite Marquee', desc: '3D perspective scroll tunnel' },
  { id: 'gridmorph', name: 'Grid Morph', desc: 'Proximity wave grid cells' },
  { id: 'liquidchrome', name: 'Liquid Chrome', desc: 'Flowing metallic chrome surface' },
  { id: 'particleimage', name: 'Particle Image', desc: 'Image as interactive particles' },
  { id: 'ripplereveal', name: 'Ripple Reveal', desc: 'Click ripples reveal content' },
  { id: 'magneticstack', name: 'Magnetic Stack', desc: 'Cards with staggered magnetic mouse tracking' },
  { id: 'cursortrail', name: 'Cursor Trail', desc: 'Glowing gradient trail following cursor' },
  { id: 'kinetictext', name: 'Kinetic Text', desc: 'Physics-based letter particles' },
  { id: 'gradientmesh', name: 'Gradient Mesh', desc: 'Living mesh with drifting vertices' },
  { id: 'noiseborder', name: 'Noise Border', desc: 'Crawling SVG noise border' },
  { id: 'scrollprogress', name: 'Scroll Progress', desc: 'Sleek scroll progress bar with glow' },
]

const PAGES = [
  { id: 'home', name: 'Home', desc: 'Back to landing page' },
  { id: 'docs', name: 'Docs', desc: 'View documentation' },
  { id: 'github', name: 'GitHub', desc: 'View source on GitHub' },
]

const ACTIONS = [
  { id: 'theme', name: 'Toggle Theme', desc: 'Switch between dark and light mode' },
]

function matchScore(query, text) {
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  const idx = t.indexOf(q)
  if (idx === -1) return -1
  if (idx === 0) return 10 - t.length * 0.01
  return 5 - idx * 0.1 - t.length * 0.01
}

export default function SearchDialog({ open, onClose, onNavigate, onGoHome, onToggleTheme, onNavigateToDocs }) {
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const results = useCallback(() => {
    if (!query.trim()) {
      return [
        { category: 'Pages', items: PAGES },
        { category: 'Components', items: COMPONENTS },
        { category: 'Actions', items: ACTIONS },
      ]
    }

    const q = query.trim().toLowerCase()
    const scoredPages = PAGES.map(p => ({
      ...p,
      score: Math.max(matchScore(q, p.name), matchScore(q, p.desc)),
    })).filter(p => p.score >= 0)
    scoredPages.sort((a, b) => b.score - a.score)

    const scoredComps = COMPONENTS.map(c => ({
      ...c,
      score: Math.max(matchScore(q, c.name), matchScore(q, c.desc)),
    })).filter(c => c.score >= 0)
    scoredComps.sort((a, b) => b.score - a.score)

    const scoredActions = ACTIONS.map(a => ({
      ...a,
      score: Math.max(matchScore(q, a.name), matchScore(q, a.desc)),
    })).filter(a => a.score >= 0)
    scoredActions.sort((a, b) => b.score - a.score)

    const groups = []
    if (scoredPages.length) groups.push({ category: 'Pages', items: scoredPages })
    if (scoredComps.length) groups.push({ category: 'Components', items: scoredComps })
    if (scoredActions.length) groups.push({ category: 'Actions', items: scoredActions })
    return groups
  }, [query])

  const groups = results()
  const flatItems = groups.flatMap(g => g.items)

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selectedIdx}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIdx])

  function executeItem(item) {
    if (item.id === 'home') { onGoHome(); onClose(); return }
    if (item.id === 'docs') { onNavigateToDocs(); onClose(); return }
    if (item.id === 'github') { window.open('https://github.com/ronie-coder/ManiacUI', '_blank'); onClose(); return }
    if (item.id === 'theme') { onToggleTheme(); onClose(); return }
    onNavigate(item.id)
    onClose()
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx(i => Math.min(i + 1, flatItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && flatItems[selectedIdx]) {
      e.preventDefault()
      executeItem(flatItems[selectedIdx])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!open) return null

  let globalIdx = -1

  return (
    <div className="sd-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="sd-dialog" onClick={e => e.stopPropagation()}>
        <div className="sd-input-wrap">
          <svg className="sd-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className="sd-input"
            type="text"
            placeholder="Search components, pages, and actions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="sd-close-btn" onClick={onClose} title="Close search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <kbd className="sd-kbd-shortcut">
            <span className="sd-kbd-key">ESC</span>
          </kbd>
        </div>

        <div className="sd-results" ref={listRef}>
          {groups.length === 0 ? (
            <div className="sd-empty">
              <span className="sd-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35M8 11h6" />
                </svg>
              </span>
              <span className="sd-empty-text">No results found</span>
              <span className="sd-empty-hint">Try a different search term</span>
            </div>
          ) : (
            groups.map(group => (
              <div key={group.category} className="sd-group">
                <div className="sd-group-header">
                  <svg className="sd-group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                    {group.category === 'Pages' ? (
                      <><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" /><path d="M12 3v6" /></>
                    ) : group.category === 'Components' ? (
                      <><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></>
                    ) : (
                      <><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></>
                    )}
                  </svg>
                  {group.category}
                </div>
                {group.items.map(item => {
                  globalIdx++
                  const isSelected = globalIdx === selectedIdx
                  return (
                    <button
                      key={item.id}
                      className={`sd-item ${isSelected ? 'selected' : ''}`}
                      data-idx={globalIdx}
                      onClick={() => executeItem(item)}
                      onMouseEnter={() => setSelectedIdx(globalIdx)}
                    >
                      <span className="sd-item-icon">
                        {group.category === 'Pages' ? (
                          item.id === 'home' ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                          )
                        ) : group.category === 'Actions' ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                        )}
                      </span>
                      <div className="sd-item-content">
                        <span className="sd-item-name">{item.name}</span>
                        <span className="sd-item-desc">{item.desc}</span>
                      </div>
                      <kbd className="sd-item-kbd">
                        <span className="sd-kbd-key">{'\u23CE'}</span>
                      </kbd>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="sd-footer">
          <div className="sd-footer-hints">
            <span className="sd-footer-hint">
              <kbd className="sd-kbd"><span className="sd-kbd-key">{'\u2191'}</span></kbd>
              <kbd className="sd-kbd"><span className="sd-kbd-key">{'\u2193'}</span></kbd>
              <span className="sd-footer-label">navigate</span>
            </span>
            <span className="sd-footer-hint">
              <kbd className="sd-kbd"><span className="sd-kbd-key">{'\u23CE'}</span></kbd>
              <span className="sd-footer-label">select</span>
            </span>
            <span className="sd-footer-hint">
              <kbd className="sd-kbd"><span className="sd-kbd-key">ESC</span></kbd>
              <span className="sd-footer-label">close</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
