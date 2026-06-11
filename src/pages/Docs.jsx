import { useState } from 'react'
import './Docs.css'

const SECTIONS = [
  { id: 'getting-started', title: 'Getting Started' },
  { id: 'installation', title: 'Installation' },
  { id: 'usage', title: 'Component Usage' },
  { id: 'props', title: 'Props Reference' },
  { id: 'theming', title: 'Theming' },
  { id: 'examples', title: 'Examples' },
]

const SNIPPETS = {
  install: `npm install @react-three/fiber @react-three/drei @react-three/rapier three meshline`,
  import: `import { Lanyard } from './components/Lanyard'
import { Blob } from './components/Blob'
import { Carousel } from './components/Carousel'`,
  basic: `<Lanyard
  frontImg="/images/id-front.png"
  backImg="/images/id-back.png"
  strapColor="#ff4444"
  strapLength={3.5}
/>`,
  props: `<Blob
  color="#7c3aed"
  speed={0.6}
  intensity={1.2}
  className="my-blob"
/>`,
  theme: `// The library uses CSS custom properties.
// Override them in your own stylesheet:

[data-theme='dark'] {
  --accent: #a855f7;
  --bg: #08080a;
}

[data-theme='light'] {
  --accent: #4a9ab8;
  --bg: #f5f5f7;
}`,
}

const PROP_TABLE = [
  { prop: 'color', type: 'string', default: '#a855f7', desc: 'Primary accent color for the component' },
  { prop: 'speed', type: 'number', default: '0.5', desc: 'Animation speed multiplier (0–2)' },
  { prop: 'intensity', type: 'number', default: '1.0', desc: 'Visual intensity of the effect' },
  { prop: 'className', type: 'string', default: '—', desc: 'Additional CSS class name' },
  { prop: 'style', type: 'object', default: '—', desc: 'Inline style object' },
]

export default function Docs({ onBack }) {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [copiedId, setCopiedId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function copy(text, id) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  function CopyBtn({ text, id }) {
    return (
      <button className="docs-copy-btn" onClick={() => copy(text, id)}>
        {copiedId === id ? 'Copied!' : 'Copy'}
      </button>
    )
  }

  return (
    <div className="docs">
      <div className={`docs-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <aside className={`docs-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="docs-sidebar-header">
          <div className="docs-sidebar-top-row">
            <button className="docs-sidebar-toggle docs-sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
              {'\u2715'}
            </button>
            <div className="docs-sidebar-title">Documentation</div>
          </div>
          <button className="docs-back-btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
        <nav className="docs-nav">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`docs-nav-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(s.id)
                document.getElementById(`docs-${s.id}`)?.scrollIntoView({ behavior: 'smooth' })
                setSidebarOpen(false)
              }}
            >
              {s.title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="docs-content">
        <div className="docs-mobile-bar">
          <button className="docs-sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            {'\u2630'}
          </button>
          <span className="docs-mobile-title">Documentation</span>
          <button className="docs-mobile-back-btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
        <section id="docs-getting-started" className="docs-section">
          <h1 className="docs-h1">Documentation</h1>
          <p className="docs-p">
            ManiacUI is a curated collection of immersive, physics-driven 3D components for React.
            Each component is designed to be drop-in ready — import, configure with props, and ship.
          </p>
          <div className="docs-highlight">
            <strong>Prerequisites:</strong> React 18+, Node.js 18+, and a modern browser with WebGL support.
          </div>
        </section>

        <section id="docs-installation" className="docs-section">
          <h2 className="docs-h2">Installation</h2>
          <p className="docs-p">
            Install the required dependencies for 3D rendering and physics. All components share a
            common set of peer dependencies:
          </p>
          <div className="docs-code-wrap">
            <div className="docs-code-topbar">
              <span className="docs-code-lang">bash</span>
              <CopyBtn text={SNIPPETS.install} id="install" />
            </div>
            <pre className="docs-code">{SNIPPETS.install}</pre>
          </div>
          <p className="docs-p">
            Then copy any component folder from <code className="docs-inline">src/components/</code> into your project.
            Each component is self-contained with its own CSS file.
          </p>
        </section>

        <section id="docs-usage" className="docs-section">
          <h2 className="docs-h2">Component Usage</h2>
          <p className="docs-p">
            Import a component and use it like any other React element. All components support
            standard DOM props such as <code className="docs-inline">className</code> and <code className="docs-inline">style</code>.
          </p>
          <div className="docs-code-wrap">
            <div className="docs-code-topbar">
              <span className="docs-code-lang">jsx</span>
              <CopyBtn text={SNIPPETS.import} id="import" />
            </div>
            <pre className="docs-code">{SNIPPETS.import}</pre>
          </div>
          <div className="docs-code-wrap">
            <div className="docs-code-topbar">
              <span className="docs-code-lang">jsx</span>
              <CopyBtn text={SNIPPETS.basic} id="basic" />
            </div>
            <pre className="docs-code">{SNIPPETS.basic}</pre>
          </div>
          <p className="docs-p">
            Each component also includes a <strong>Playground</strong> wrapper that provides
            interactive controls for real-time customization — a great way to experiment before
            settling on values.
          </p>
        </section>

        <section id="docs-props" className="docs-section">
          <h2 className="docs-h2">Props Reference</h2>
          <p className="docs-p">
            While each component has its own unique props, the following common props are available
            across most components:
          </p>
          <div className="docs-table-wrap">
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {PROP_TABLE.map(row => (
                  <tr key={row.prop}>
                    <td><code>{row.prop}</code></td>
                    <td><code>{row.type}</code></td>
                    <td><code>{row.default}</code></td>
                    <td>{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="docs-highlight">
            See each component's Playground page for its full set of props and live controls.
          </div>
        </section>

        <section id="docs-theming" className="docs-section">
          <h2 className="docs-h2">Theming</h2>
          <p className="docs-p">
            ManiacUI supports dark and light modes via a <code className="docs-inline">data-theme</code> attribute on the
            <code className="docs-inline">&lt;html&gt;</code> element. The library uses CSS custom properties for all
            colors, making it easy to customize:
          </p>
          <div className="docs-code-wrap">
            <div className="docs-code-topbar">
              <span className="docs-code-lang">css</span>
              <CopyBtn text={SNIPPETS.theme} id="theme" />
            </div>
            <pre className="docs-code">{SNIPPETS.theme}</pre>
          </div>
          <p className="docs-p">
            Toggle themes with the <code className="docs-inline">&lt;ThemeBtn /&gt;</code> component or programmatically by
            setting <code className="docs-inline">document.documentElement.dataset.theme</code> to{' '}
            <code className="docs-inline">'dark'</code> or <code className="docs-inline">'light'</code>.
          </p>
        </section>

        <section id="docs-examples" className="docs-section">
          <h2 className="docs-h2">Examples</h2>
          <p className="docs-p">
            Here is a more complete example combining the <code className="docs-inline">Blob</code> component with
            a custom gradient background:
          </p>
          <div className="docs-code-wrap">
            <div className="docs-code-topbar">
              <span className="docs-code-lang">jsx</span>
              <CopyBtn text={`import { Blob } from './components/Blob'

export default function Hero() {
  return (
    <div style={{ position: 'relative', width: 400, height: 400 }}>
      <Blob
        color="#7c3aed"
        speed={0.6}
        intensity={1.2}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}`} id="example" />
            </div>
            <pre className="docs-code">{`import { Blob } from './components/Blob'

export default function Hero() {
  return (
    <div style={{ position: 'relative', width: 400, height: 400 }}>
      <Blob
        color="#7c3aed"
        speed={0.6}
        intensity={1.2}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}`}</pre>
          </div>
        </section>

        <footer className="docs-footer">
          <p>Built with React, Three.js &amp; Rapier.</p>
          <a href="https://github.com/ronie-coder/ManiacUI" target="_blank" rel="noopener noreferrer">GitHub</a>
        </footer>
      </main>
    </div>
  )
}
