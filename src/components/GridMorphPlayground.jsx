import { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import GridMorph from './GridMorph'
import gridMorphSource from './GridMorph.jsx?raw'
import { handleEditorBeforeMount } from './monacoTheme'
import './Playground.css'

const TABS = ['Preview', 'Code']
const PROPS = [
  { name: 'gridSize', type: 'number', default: '12', desc: 'Number of grid cells per row' },
  { name: 'color1', type: 'string', default: '#6366f1', desc: 'Primary grid color' },
  { name: 'color2', type: 'string', default: '#ec4899', desc: 'Secondary grid color' },
  { name: 'bgColor', type: 'string', default: '#0a0a0f', desc: 'Background color' },
  { name: 'speed', type: 'number', default: '1', desc: 'Animation speed multiplier' },
  { name: 'intensity', type: 'number', default: '0.08', desc: 'Ripple distortion strength' },
  { name: 'waveRadius', type: 'number', default: '0.3', desc: 'Mouse influence radius (UV space)' },
  { name: 'thickness', type: 'number', default: '15', desc: 'Grid line thickness' },
  { name: 'glowIntensity', type: 'number', default: '0.15', desc: 'Grid line glow strength' },
  { name: 'fadeDistance', type: 'number', default: '1.5', desc: 'Edge fade falloff power' },
  { name: 'vignetteStrength', type: 'number', default: '2.0', desc: 'Vignette darkening strength' },
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

export default function GridMorphPlayground() {
  const [tab, setTab] = useState('Preview')
  const [gridSize, setGridSize] = useState(12)
  const [color1, setColor1] = useState('#6366f1')
  const [color2, setColor2] = useState('#ec4899')
  const [bgColor, setBgColor] = useState('#0a0a0f')
  const [speed, setSpeed] = useState(1)
  const [intensity, setIntensity] = useState(0.08)
  const [waveRadius, setWaveRadius] = useState(0.3)
  const [thickness, setThickness] = useState(15)
  const [glowIntensity, setGlowIntensity] = useState(0.15)
  const [fadeDistance, setFadeDistance] = useState(3.0)
  const [vignetteStrength, setVignetteStrength] = useState(4.0)
  const [showOverlay, setShowOverlay] = useState(true)

  const reset = useCallback(() => {
    setGridSize(12)
    setColor1('#6366f1')
    setColor2('#ec4899')
    setBgColor('#0a0a0f')
    setSpeed(1)
    setIntensity(0.08)
    setWaveRadius(0.3)
    setThickness(15)
    setGlowIntensity(0.15)
    setFadeDistance(3.0)
    setVignetteStrength(4.0)
  }, [])

  return (
    <div className="gp-page">
      <style>{`
        .gm-demo-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
        }
        .gm-demo-card {
          background: rgba(10,10,15,0.15);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 36px 40px;
          max-width: 420px;
          width: 100%;
          text-align: center;
          box-shadow: 0 8px 48px rgba(0,0,0,0.5);
        }
        .gm-demo-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          color: #fff;
          margin-bottom: 16px;
        }
        .gm-demo-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 12px;
          background: linear-gradient(135deg, #6366f1, #ec4899, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }
        .gm-demo-text {
          font-size: 13px;
          line-height: 1.7;
          color: rgba(255,255,255,0.55);
          margin: 0 0 24px;
        }
        .gm-demo-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        .gm-demo-btn {
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .gm-demo-btn.primary {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          color: #fff;
          border: none;
        }
        .gm-demo-btn.secondary {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .gm-demo-btn.secondary:hover {
          background: rgba(255,255,255,0.1);
        }
        .gm-toggle {
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
        .gm-toggle:hover {
          background: rgba(0,0,0,0.7);
        }
        .gm-toggle-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .gm-toggle-track {
          width: 32px;
          height: 18px;
          border-radius: 10px;
          background: rgba(255,255,255,0.12);
          position: relative;
          transition: background 0.3s ease;
        }
        .gm-toggle-track.on {
          background: linear-gradient(135deg, #6366f1, #ec4899);
        }
        .gm-toggle-thumb {
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
        .gm-toggle-track.on .gm-toggle-thumb {
          transform: translateX(14px);
        }
      `}</style>
      <div className="gp-hero">
        <h1 className="gp-title">GridMorph</h1>
        <p className="gp-desc">
          A continuously animated grid that ripples like water — GPU-accelerated GLSL shader
          draws crisp grid lines with wave distortion, mouse interaction, glow, and vignette.
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
                <GridMorph
                  gridSize={gridSize}
                  color1={color1}
                  color2={color2}
                  bgColor={bgColor}
                  speed={speed}
                  intensity={intensity}
                  waveRadius={waveRadius}
                  thickness={thickness}
                  glowIntensity={glowIntensity}
                  fadeDistance={fadeDistance}
                  vignetteStrength={vignetteStrength}
                >
                  {showOverlay && (
                    <div className="gm-demo-content">
                      <div className="gm-demo-card">
                        <div className="gm-demo-badge">Background Effect</div>
                        <h2 className="gm-demo-title">GridMorph</h2>
                        <p className="gm-demo-text">
                          GPU-accelerated ripple grid with real-time wave distortion,
                          mouse interaction, and multi-color blending.
                        </p>
                        <div className="gm-demo-actions">
                          <span className="gm-demo-btn primary">Get Started</span>
                          <span className="gm-demo-btn secondary">Learn More</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <label className="gm-toggle" onClick={e => { e.stopPropagation(); setShowOverlay(v => !v) }}>
                    <span className="gm-toggle-label">Overlay</span>
                    <span className={`gm-toggle-track ${showOverlay ? 'on' : ''}`}>
                      <span className="gm-toggle-thumb" />
                    </span>
                  </label>
                </GridMorph>
              </div>
              <div className="gp-preview-bottom">
                <div className="gp-preview-controls">
                  <Section title="GRID">
                    <RangeRow label="Size" value={gridSize} min={3} max={30} step={1} onChange={setGridSize} />
                    <RangeRow label="Thickness" value={thickness} min={2} max={40} step={1} onChange={setThickness} />
                    <RangeRow label="Glow" value={glowIntensity} min={0} max={1} step={0.01} onChange={setGlowIntensity} />
                  </Section>
                  <Section title="COLORS">
                    <ColorRow label="Primary" value={color1} onChange={e => setColor1(e.target.value)} />
                    <ColorRow label="Secondary" value={color2} onChange={e => setColor2(e.target.value)} />
                    <ColorRow label="BG" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                  </Section>
                  <Section title="WAVE">
                    <RangeRow label="Speed" value={speed} min={0} max={4} step={0.1} onChange={setSpeed} />
                    <RangeRow label="Intensity" value={intensity} min={0} max={0.5} step={0.005} onChange={setIntensity} />
                    <RangeRow label="Mouse Radius" value={waveRadius} min={0.05} max={1} step={0.05} onChange={setWaveRadius} />
                  </Section>
                  <Section title="FADE">
                    <RangeRow label="Edge Fade" value={fadeDistance} min={0.5} max={4} step={0.1} onChange={setFadeDistance} />
                    <RangeRow label="Vignette" value={vignetteStrength} min={0} max={5} step={0.1} onChange={setVignetteStrength} />
                  </Section>
                </div>
                <div className="gp-usage-panel">
                  <div className="gp-doc-section">
                    <h2 className="gp-doc-h2">Usage</h2>
                    <pre className="gp-doc-code">{`import GridMorph from './components/GridMorph'

function Demo() {
  return <GridMorph gridSize={12} />
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
                value={gridMorphSource}
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
          <p className="gp-doc-p">Requires <code className="gp-doc-inline">three</code>. Copy <code className="gp-doc-inline">GridMorph.jsx</code> and <code className="gp-doc-inline">GridMorph.css</code> into your project.</p>
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
