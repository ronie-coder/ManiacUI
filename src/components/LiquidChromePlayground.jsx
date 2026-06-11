import { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import LiquidChrome from './LiquidChrome'
import liquidChromeSource from './LiquidChrome.jsx?raw'
import { handleEditorBeforeMount } from './monacoTheme'
import './Playground.css'

const TABS = ['Preview', 'Code']
const PROPS = [
  { name: 'color1', type: 'string', default: '#2a1a3a', desc: 'Dark chrome accent color' },
  { name: 'color2', type: 'string', default: '#6366f1', desc: 'Mid-tone chrome color' },
  { name: 'color3', type: 'string', default: '#06b6d4', desc: 'Highlight chrome color' },
  { name: 'speed', type: 'number', default: '0.15', desc: 'Flow animation speed' },
  { name: 'scale', type: 'number', default: '1.5', desc: 'Noise scale / zoom level' },
  { name: 'distortion', type: 'number', default: '1.5', desc: 'Domain warp strength' },
  { name: 'reflectivity', type: 'number', default: '0.6', desc: 'Edge reflection intensity' },
  { name: 'interactive', type: 'boolean', default: 'true', desc: 'Enable mouse/touch interaction' },
  { name: 'customCursor', type: 'boolean', default: 'true', desc: 'Replace system cursor with custom ring' },
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

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="gp-row">
      <span className="gp-label">{label}</span>
      <button className={`gp-toggle ${value ? 'active' : ''}`} onClick={() => onChange(!value)}>
        {value ? 'On' : 'Off'}
      </button>
    </div>
  )
}

export default function LiquidChromePlayground() {
  const [tab, setTab] = useState('Preview')
  const [color1, setColor1] = useState('#2a1a3a')
  const [color2, setColor2] = useState('#6366f1')
  const [color3, setColor3] = useState('#06b6d4')
  const [speed, setSpeed] = useState(0.6)
  const [scale, setScale] = useState(1.5)
  const [distortion, setDistortion] = useState(1.5)
  const [reflectivity, setReflectivity] = useState(0.6)
  const [interactive, setInteractive] = useState(true)
  const [customCursor, setCustomCursor] = useState(true)
  const [showOverlay, setShowOverlay] = useState(true)

  const reset = useCallback(() => {
    setColor1('#2a1a3a')
    setColor2('#6366f1')
    setColor3('#06b6d4')
    setSpeed(0.6)
    setScale(1.5)
    setDistortion(1.5)
    setReflectivity(0.6)
    setInteractive(true)
    setCustomCursor(true)
    setShowOverlay(true)
  }, [])

  return (
    <div className="gp-page">
      <style>{`
        .lc-demo-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
        }
        .lc-demo-card {
          background: rgba(10,10,15,0.15);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 32px 36px;
          max-width: 380px;
          width: 100%;
          text-align: center;
        }
        .lc-demo-badge {
          display: inline-block;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          color: #fff;
          margin-bottom: 14px;
        }
        .lc-demo-title {
          font-size: 26px;
          font-weight: 700;
          margin: 0 0 8px;
          background: linear-gradient(135deg, #6366f1, #06b6d4, #2a1a3a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.3px;
        }
        .lc-demo-text {
          font-size: 12px;
          line-height: 1.6;
          color: rgba(255,255,255,0.45);
          margin: 0 0 20px;
        }
        .lc-demo-actions {
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        .lc-demo-btn {
          padding: 7px 18px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }
        .lc-demo-btn.primary {
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          color: #fff;
          border: none;
        }
        .lc-demo-btn.secondary {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .lc-demo-btn.secondary:hover {
          background: rgba(255,255,255,0.1);
        }
        .lc-toggle {
          position: absolute;
          bottom: 12px;
          right: 12px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
          padding: 6px 10px;
          border-radius: 20px;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.08);
          transition: background 0.2s;
        }
        .lc-toggle:hover {
          background: rgba(0,0,0,0.7);
        }
        .lc-toggle-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .lc-toggle-track {
          width: 32px;
          height: 18px;
          border-radius: 10px;
          background: rgba(255,255,255,0.12);
          position: relative;
          transition: background 0.3s ease;
        }
        .lc-toggle-track.on {
          background: linear-gradient(135deg, #6366f1, #06b6d4);
        }
        .lc-toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .lc-toggle-track.on .lc-toggle-thumb {
          transform: translateX(14px);
        }
      `}</style>
      <div className="gp-hero">
        <h1 className="gp-title">Liquid Chrome</h1>
        <p className="gp-desc">
          A flowing metallic surface built with domain-warped fractal noise — organic chrome
          reflections ripple and shift with cursor interaction.
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
              <div className="gp-preview-scene">
                <LiquidChrome
                  color1={color1}
                  color2={color2}
                  color3={color3}
                  speed={speed}
                  scale={scale}
                  distortion={distortion}
                  reflectivity={reflectivity}
                  interactive={interactive}
                  customCursor={customCursor}
                >
                  {showOverlay && (
                    <div className="lc-demo-content">
                      <div className="lc-demo-card">
                        <div className="lc-demo-badge">Chrome Effect</div>
                        <h2 className="lc-demo-title">Liquid Chrome</h2>
                        <p className="lc-demo-text">
                          A flowing metallic surface with domain-warped fractal noise and real-time cursor interaction.
                        </p>
                        <div className="lc-demo-actions">
                          <span className="lc-demo-btn primary">Try now</span>
                          <span className="lc-demo-btn secondary">Learn more</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <label className="lc-toggle" onClick={e => { e.stopPropagation(); setShowOverlay(v => !v) }}>
                    <span className="lc-toggle-label">Overlay</span>
                    <span className={`lc-toggle-track ${showOverlay ? 'on' : ''}`}>
                      <span className="lc-toggle-thumb" />
                    </span>
                  </label>
                </LiquidChrome>
              </div>
              <div className="gp-preview-bottom">
                <div className="gp-preview-controls">
                  <Section title="FLOW">
                    <RangeRow label="Speed" value={speed} min={0} max={3} step={0.05} onChange={setSpeed} />
                    <RangeRow label="Scale" value={scale} min={0.5} max={5} step={0.1} onChange={setScale} />
                    <RangeRow label="Distortion" value={distortion} min={0} max={4} step={0.1} onChange={setDistortion} />
                    <RangeRow label="Reflectivity" value={reflectivity} min={0} max={1.5} step={0.05} onChange={setReflectivity} />
                  </Section>
                  <Section title="COLORS">
                    <ColorRow label="Dark" value={color1} onChange={e => setColor1(e.target.value)} />
                    <ColorRow label="Mid" value={color2} onChange={e => setColor2(e.target.value)} />
                    <ColorRow label="Light" value={color3} onChange={e => setColor3(e.target.value)} />
                  </Section>
                  <Section title="INTERACTION">
                    <ToggleRow label="Interactive" value={interactive} onChange={setInteractive} />
                    <ToggleRow label="Custom Cursor" value={customCursor} onChange={setCustomCursor} />
                  </Section>
                </div>
                <div className="gp-usage-panel">
                  <div className="gp-doc-section">
                    <h2 className="gp-doc-h2">Usage</h2>
                    <pre className="gp-doc-code">{`import LiquidChrome from './components/LiquidChrome'

function Demo() {
  return <LiquidChrome speed={0.15} scale={1.5} />
}`}</pre>
                  </div>
                  <div className="gp-doc-section">
                    <h2 className="gp-doc-h2">Dependencies</h2>
                    <p className="gp-doc-p">Requires <code className="gp-doc-inline">three</code>.</p>
                  </div>
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
                value={liquidChromeSource}
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
          <p className="gp-doc-p">Requires <code className="gp-doc-inline">three</code>. Copy <code className="gp-doc-inline">LiquidChrome.jsx</code> and <code className="gp-doc-inline">LiquidChrome.css</code> into your project.</p>
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
