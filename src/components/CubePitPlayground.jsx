import { useState, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import CubePit from './CubePit'
import cubePitSource from './CubePit.jsx?raw'
import { handleEditorBeforeMount } from './monacoTheme'
import './Playground.css'

const TABS = ['Preview', 'Code']
const PROPS = [
  { name: 'cubeCount', type: 'number', default: '200', desc: 'Number of cubes in the pit' },
  { name: 'paletteIndex', type: 'number', default: '0', desc: 'Color palette (0-2)' },
  { name: 'followCursor', type: 'boolean', default: 'false', desc: 'Enable cursor-following control cube' },
  { name: 'className', type: 'string', default: "''", desc: 'Additional CSS class for the canvas' },
]

const PALETTE_NAMES = ['Violet Dream', 'Sunset Vibes', 'Neon Pulse']

function Section({ title, children }) {
  return (
    <div className="gp-section">
      <div className="gp-section-title">{title}</div>
      {children}
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

export default function CubePitPlayground() {
  const [tab, setTab] = useState('Preview')
  const [cubeCount, setCubeCount] = useState(200)
  const [paletteIndex, setPaletteIndex] = useState(0)

  const reset = useCallback(() => {
    setCubeCount(200)
    setPaletteIndex(0)
  }, [])

  return (
    <div className="gp-page">
      <div className="gp-hero">
        <h1 className="gp-title">CubePit</h1>
        <p className="gp-desc">
          A physics-driven pit of colorful cubes. Move your cursor through the pit
          to push cubes around as they tumble and collide in real time.
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
              <div className="gp-preview-scene" style={{ height: '520px' }}>
                <CubePit
                  cubeCount={cubeCount}
                  paletteIndex={paletteIndex}
                />
              </div>
              <div className="gp-preview-bottom">
                <div className="gp-preview-controls">
                  <Section title="CUBES">
                    <RangeRow label="Count" value={cubeCount} min={20} max={400} step={10} onChange={setCubeCount} />
                  </Section>
                  <Section title="STYLE">
                    <div className="gp-row">
                      <span className="gp-label">Palette</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {PALETTE_NAMES.map((name, i) => (
                          <button
                            key={name}
                            className={`gp-toggle ${paletteIndex === i ? 'active' : ''}`}
                            onClick={() => setPaletteIndex(i)}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Section>
                </div>
                <div className="gp-usage-panel">
                  <div className="gp-doc-section">
                    <h2 className="gp-doc-h2">Usage</h2>
                    <pre className="gp-doc-code">{`import CubePit from './components/CubePit'

function Demo() {
  return (
                    <CubePit
      cubeCount={200}
      paletteIndex={0}
    />
  )
}`}</pre>
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
                value={cubePitSource}
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
          <p className="gp-doc-p">Requires <code className="gp-doc-inline">three</code>. Already included in this project — no additional dependencies needed.</p>
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
