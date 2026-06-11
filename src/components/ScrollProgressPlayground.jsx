import { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import ScrollProgress from './ScrollProgress'
import scrollSource from './ScrollProgress.jsx?raw'
import { handleEditorBeforeMount } from './monacoTheme'
import './Playground.css'

const TABS = ['Preview', 'Code']
const PROPS = [
  { name: 'color', type: 'string', default: "'#a855f7'", desc: 'Primary accent color' },
  { name: 'height', type: 'number', default: '2', desc: 'Bar height in pixels' },
  { name: 'glowIntensity', type: 'number', default: '1', desc: 'Glow brightness multiplier (0-3)' },
  { name: 'zIndex', type: 'number', default: '9999', desc: 'z-index of the fixed bar' },
]

function Section({ title, children }) {
  return (
    <div className="gp-section">
      <div className="gp-section-title">{title}</div>
      {children}
    </div>
  )
}

function ColorRow({ label, value, onChange }) {
  return (
    <div className="gp-row">
      <span className="gp-label">{label}</span>
      <input type="color" value={value} onChange={onChange} className="gp-color" />
      <span className="gp-hex">{value}</span>
    </div>
  )
}

function RangeRow({ label, value, min, max, step, onChange }) {
  return (
    <div className="gp-row">
      <span className="gp-label">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="gp-range" />
      <span className="gp-hex">{value}</span>
    </div>
  )
}

const SECTIONS = [
  {
    title: 'Getting Started',
    subtitle: 'A brief introduction to the component',
    lines: ['The scroll progress component provides a subtle visual cue', 'that keeps users oriented as they navigate long content.', 'It appears as a thin bar at the top of the viewport,', 'smoothly animating from left to right as the user scrolls.', 'The component works in any container and respects', 'both window and element-level scroll containers.'],
  },
  {
    title: 'Core Features',
    subtitle: 'What makes it stand out',
    lines: ['Customizable accent color with real-time preview.', 'Adjustable bar height from subtle to prominent.', 'Configurable glow intensity for the ambient light effect.', 'Automatic positioning relative to the scroll container.', 'Zero external dependencies — pure CSS and JS.', 'Smooth requestAnimationFrame-based animation.'],
  },
  {
    title: 'Integration Guide',
    subtitle: 'Adding it to your project',
    lines: ['Simply copy the component and CSS into your project.', 'Import and place it at the top of your component tree.', 'Pass optional props to customize appearance.', 'The component automatically detects the scroll container.', 'Works with both dark and light themes out of the box.', 'TypeScript definitions included in the source.'],
  },
  {
    title: 'API Reference',
    subtitle: 'Understanding the props',
    lines: ['color — controls the progress bar accent color.', 'height — sets the bar thickness in pixels (1-6).', 'glowIntensity — multiplier for the ambient glow effect.', 'zIndex — controls the stacking order of the bar.', 'Each prop has sensible defaults for immediate use.', 'All props are optional and reactive to changes.'],
  },
  {
    title: 'Performance',
    subtitle: 'Optimized for smooth scrolling',
    lines: ['Uses requestAnimationFrame for optimal animation timing.', 'Minimal DOM updates — only updates the bar width.', 'No layout thrashing — uses transform properties.', 'Lightweight at under 1KB gzipped.', 'No additional network requests or dependencies.', 'Works seamlessly with React 18 concurrent features.'],
  },
  {
    title: 'Customization',
    subtitle: 'Making it your own',
    lines: ['The gradient effect uses your chosen color as a base.', 'The glow creates a subtle ambient light effect.', 'Bar smoothly fades in at the top of the page.', 'Disappears gracefully when scrolled back to top.', 'The z-index can be adjusted for your layout needs.', 'All colors and sizes integrate with your design system.'],
  },
]

export default function ScrollProgressPlayground() {
  const [tab, setTab] = useState('Preview')
  const [color, setColor] = useState('#a855f7')
  const [height, setHeight] = useState(2)
  const [glowIntensity, setGlowIntensity] = useState(1)
  const [zIndex, setZIndex] = useState(9999)

  const reset = useCallback(() => {
    setColor('#a855f7')
    setHeight(2)
    setGlowIntensity(1)
    setZIndex(9999)
  }, [])

  return (
    <div className="gp-page">
      <ScrollProgress
        color={color}
        height={height}
        glowIntensity={glowIntensity}
        zIndex={zIndex}
      />

      <div className="gp-hero">
        <h1 className="gp-title">Scroll Progress</h1>
        <p className="gp-desc">
          A sleek, minimal progress bar that tracks scroll position. Customize the color,
          height, and glow intensity. Scroll down to see it in action.
        </p>
      </div>

      <div className="gp-demo-tabs">
        {TABS.map(t => (
          <button key={t} className={`gp-demo-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
        <button className="gp-demo-reset" onClick={reset}>Reset</button>
      </div>

      <div className="gp-demo">
        {tab === 'Preview' ? (
          <div className="gp-demo-inner">
            <div className="gp-preview-col">
              <div className="gp-preview-scene" style={{ background: 'var(--bg)', overflow: 'auto', height: 'auto', minHeight: '480px' }}>
                <div style={{ padding: '40px 32px' }}>
                  <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    <div className="gp-preview-controls" style={{ flex: '1', minWidth: '240px', borderRight: 'none', maxHeight: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                      <Section title="APPEARANCE">
                        <ColorRow label="Color" value={color} onChange={e => setColor(e.target.value)} />
                        <RangeRow label="Height" value={height} min={1} max={6} step={1} onChange={setHeight} />
                        <RangeRow label="Glow" value={glowIntensity} min={0} max={3} step={0.1} onChange={setGlowIntensity} />
                      </Section>
                      <Section title="LAYER">
                        <RangeRow label="zIndex" value={zIndex} min={1} max={99999} step={1} onChange={setZIndex} />
                      </Section>
                    </div>
                    <div className="gp-usage-panel" style={{ width: '280px', maxHeight: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                      <div className="gp-doc-section">
                        <h2 className="gp-doc-h2">Usage</h2>
                        <pre className="gp-doc-code">{`import ScrollProgress from './components/ScrollProgress'

function Demo() {
  return (
                    <ScrollProgress
      color="#a855f7"
      height={2}
      glowIntensity={1}
    />
  )
}`}</pre>
                      </div>
                    </div>
                  </div>

                  <p className="gp-doc-p" style={{ marginBottom: '32px', color: 'var(--text-dim)', fontSize: '12px' }}>
                    Scroll down to see the progress bar advance smoothly.
                  </p>

                  {SECTIONS.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        minHeight: '320px',
                        padding: '40px',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: '32px',
                        border: '1px solid var(--border)',
                        background: `linear-gradient(135deg, rgba(168, 85, 247, ${0.02 * (i + 1)}), transparent)`,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                        opacity: 0.4,
                      }} />
                      <div style={{ maxWidth: '520px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '8px',
                        }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '1.2px',
                            textTransform: 'uppercase',
                            color: 'var(--accent)',
                            fontFamily: 'var(--font-mono)',
                          }}>
                            Section {String(i + 1).padStart(2, '0')}
                          </span>
                          <span style={{ width: '24px', height: '1px', background: 'var(--border)' }} />
                        </div>
                        <h3 style={{
                          fontSize: '22px',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginBottom: '6px',
                          letterSpacing: '-0.4px',
                        }}>{s.title}</h3>
                        <p style={{
                          fontSize: '13px',
                          color: 'var(--text-dim)',
                          marginBottom: '20px',
                          fontFamily: 'var(--font-mono)',
                        }}>{s.subtitle}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {s.lines.map((line, li) => (
                            <p key={li} style={{
                              fontSize: '13px',
                              lineHeight: '1.7',
                              color: 'var(--text-secondary)',
                              margin: 0,
                              paddingLeft: '12px',
                              borderLeft: `2px solid var(--${li % 2 === 0 ? 'border' : 'border-light'})`,
                            }}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="gp-code-col">
            <div className="gp-code-editor">
              <Editor
                height="100%"
                language="javascript"
                theme="single-color"
                beforeMount={handleEditorBeforeMount}
                value={scrollSource}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                  renderWhitespace: 'selection',
                  fontFamily: "'SF Mono','Fira Code','Consolas',monospace",
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="gp-docs">
        <section className="gp-doc-section">
          <h2 className="gp-doc-h2">Installation</h2>
          <p className="gp-doc-p">No external dependencies required. Copy <code className="gp-doc-inline">ScrollProgress.jsx</code> and <code className="gp-doc-inline">ScrollProgress.css</code> into your project.</p>
        </section>

        <section className="gp-doc-section">
          <h2 className="gp-doc-h2">Props</h2>
          <div className="gp-table-wrap">
            <table className="gp-props-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {PROPS.map(p => (
                  <tr key={p.name}>
                    <td><code>{p.name}</code></td>
                    <td><code>{p.type}</code></td>
                    <td><code>{p.default}</code></td>
                    <td>{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
