import { useState, useEffect, useRef } from 'react'
import './Landing.css'

const FEATURES = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
    title: '3D Physics Components',
    desc: 'Drag, swing, and interact with physics-driven 3D components powered by Rapier and React Three Fiber.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><circle cx="13.5" cy="6.5" r="4.5" /><circle cx="17.5" cy="17.5" r="4.5" /><circle cx="6.5" cy="14.5" r="4.5" /><path d="M9 6.5 13.5 6.5" /><path d="M13.5 11 13.5 13.5" /><path d="M11 14.5 13.5 14.5" /></svg>,
    title: 'Real-time Customization',
    desc: 'Tweak colors, text, images, and more with live preview. See your changes instantly in the 3D viewport.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" /></svg>,
    title: 'Monaco Code Viewer',
    desc: 'Full source code displayed alongside the preview with syntax highlighting and file tabs.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11v6" /><path d="M9 14h6" /></svg>,
    title: 'Copy-Ready Snippets',
    desc: 'Usage snippets auto-update with your props. Copy and paste directly into your project.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
    title: 'Image Upload & Fit',
    desc: 'Upload front and back card images with cover or contain fit modes for the perfect layout.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    title: 'More Components Coming',
    desc: 'Interactive 3D globe and additional components are in development. Component library grows weekly.',
  },
]

const STEPS = [
  { num: '01', title: 'Choose a Component', desc: 'Browse the component library and pick the 3D element you need for your project.' },
  { num: '02', title: 'Customize in Real Time', desc: 'Adjust colors, text, images, and props with instant visual feedback in the 3D viewport.' },
  { num: '03', title: 'Preview & Iterate', desc: 'Toggle between the 3D preview and full source code. Refine until it feels right.' },
  { num: '04', title: 'Copy & Ship', desc: 'Export your tailored component snippet with one click. Paste into your React app and you\'re done.' },
]

const TESTIMONIALS = [
  {
    quote: 'The physics-driven lanyard is unlike anything I\'ve seen in a UI library. The drag interaction feels incredibly natural.',
    author: 'Alex Chen',
    role: 'Frontend Engineer at Vercel',
  },
  {
    quote: 'Real-time customization with instant 3D preview completely changed our design iteration workflow. Game changer.',
    author: 'Sarah Kim',
    role: 'Product Designer at Stripe',
  },
  {
    quote: 'Drop-in 3D components that actually work. No fighting with Three.js config — just props and preview.',
    author: 'Marcus Johnson',
    role: 'Creative Developer at Linear',
  },
]

const DEMO_COMPONENTS = [
  {
    name: 'Lanyard',
    desc: 'Physics-based ID badge with realistic strap simulation',
    gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M9 8h6" /><path d="M9 12h6" /><path d="M9 16h4" /><path d="M12 4v-2" /></svg>,
  },
  {
    name: 'Blob',
    desc: 'Organic morphing 3D shape that follows your cursor',
    gradient: 'linear-gradient(135deg, #a855f7, #d946ef)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M12 3c-4.5 0-8 3-8 8 0 5 3 10 8 10s8-5 8-10c0-5-3.5-8-8-8z" /><path d="M12 3v20" /></svg>,
  },
  {
    name: 'Carousel',
    desc: '3D spinning carousel with drag physics and inertia',
    gradient: 'linear-gradient(135deg, #c084fc, #a855f7)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  },
  {
    name: 'Fluid Orb',
    desc: 'Liquid gradient blob with magnetic cursor tracking',
    gradient: 'linear-gradient(135deg, #818cf8, #a855f7)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10" /><path d="M8 12c0-4 2-8 4-8s4 4 4 8-2 8-4 8-4-4-4-8z" /></svg>,
  },
  {
    name: 'Cursor Trail',
    desc: 'Glowing gradient trail that follows your cursor',
    gradient: 'linear-gradient(135deg, #d946ef, #f472b6)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path d="M13 13l6 6" /></svg>,
  },
  {
    name: 'Scroll Progress',
    desc: 'Sleek scroll progress bar with smooth glow',
    gradient: 'linear-gradient(135deg, #a855f7, #c084fc)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  },
  {
    name: 'Warp Card',
    desc: 'Card with gravitational lensing hover distortion',
    gradient: 'linear-gradient(135deg, #7c3aed, #d946ef)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="3" /><path d="M12 2v4" /><path d="M12 18v4" /><path d="M2 12h4" /><path d="M18 12h4" /></svg>,
  },
  {
    name: 'CubePit',
    desc: 'Physics-driven pit of colorful cubes',
    gradient: 'linear-gradient(135deg, #a855f7, #818cf8)',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  },
]

const FAQS = [
  { q: 'What dependencies does the Lanyard component require?', a: 'It requires @react-three/fiber, @react-three/drei, @react-three/rapier, three, and meshline. All are listed in the installation guide.' },
  { q: 'Can I use custom images on both sides of the card?', a: 'Yes. Upload separate images for the front and back of the card. Each supports both cover and contain fit modes.' },
  { q: 'Does the strap physics work on mobile devices?', a: 'Yes. The physics engine adapts to mobile with a lower time step and optimized pixel ratio for smooth performance.' },
  { q: 'Is the source code available for modification?', a: 'Yes. The full source is displayed in the Monaco editor tab. You can copy, modify, and use it freely in your own projects.' },
  { q: 'Are more 3D components planned?', a: 'Yes. An interactive 3D globe is in development, with more physics-driven components on the roadmap.' },
]

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed') }),
      { threshold: 0.15 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function Counter({ to, label, suffix }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true
        let start = 0
        const dur = 1200
        const step = (to + (suffix === 'ms' ? 0 : 0)) * 0.03
        const cb = () => {
          start += 16
          const p = Math.min(start / dur, 1)
          setVal(Math.floor(p * to))
          if (p < 1) requestAnimationFrame(cb)
        }
        requestAnimationFrame(cb)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to, suffix])

  return (
    <div className="landing-stat" ref={ref}>
      <span className="landing-stat-value">{val}{suffix || ''}</span>
      <span className="landing-stat-label">{label}</span>
    </div>
  )
}

function FAQItem({ q, a, isOpen, toggle }) {
  return (
    <div className={`landing-faq-item ${isOpen ? 'open' : ''}`}>
      <button className="landing-faq-q" onClick={toggle}>
        <span>{q}</span>
        <span className="landing-faq-icon">{isOpen ? '\u2212' : '+'}</span>
      </button>
      <div className="landing-faq-a-wrap">
        <div className="landing-faq-a">{a}</div>
      </div>
    </div>
  )
}

export default function Landing({ onEnter, theme, onToggleTheme }) {
  const [openFaq, setOpenFaq] = useState(null)
  const [navOpen, setNavOpen] = useState(false)
  const [showThemeHint, setShowThemeHint] = useState(false)

  useEffect(() => {
    if (theme === 'light') {
      setShowThemeHint(true)
      const t = setTimeout(() => setShowThemeHint(false), 4000)
      return () => clearTimeout(t)
    } else {
      setShowThemeHint(false)
    }
  }, [theme])

  useReveal()

  return (
    <div className="landing">
      <div className="landing-gradient" />
      <div className="landing-grid" />

      <header className="landing-header">
        <div className="landing-header-inner">
          <span className="landing-logo">{'\u25A0'} ManiacUI</span>
          <nav className={`landing-nav ${navOpen ? 'open' : ''}`}>
            <a href="#features" onClick={e => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); setNavOpen(false) }}>Features</a>
            <a href="#components" onClick={e => { e.preventDefault(); document.getElementById('components')?.scrollIntoView({ behavior: 'smooth' }); setNavOpen(false) }}>Components</a>
            <a href="#how-it-works" onClick={e => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); setNavOpen(false) }}>How it Works</a>
            <a href="https://github.com/ronie-coder/ManiacUI" target="_blank" rel="noopener noreferrer" className="landing-nav-mobile-link">Docs</a>
            <a href="https://github.com/ronie-coder/ManiacUI" target="_blank" rel="noopener noreferrer" className="landing-nav-mobile-link">GitHub</a>
            <button className="landing-nav-btn" onClick={() => { onEnter(); setNavOpen(false) }}>Components</button>
            <div className="theme-btn-wrap">
              <button className="landing-theme-btn" onClick={() => { onToggleTheme(); setNavOpen(false) }} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                {theme === 'dark' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )}
              </button>
              {showThemeHint && <div className="theme-btn-pop">Switch to dark</div>}
            </div>
            <button className="landing-nav-mobile-toggle" onClick={() => setNavOpen(!navOpen)}>
              {navOpen ? '\u2715' : '\u2630'}
            </button>
          </nav>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="landing-hero" data-reveal>
        <div className="landing-hero-ring" />
        <div className="landing-hero-content">
          <span className="landing-badge">Interactive 3D Component Library</span>
          <h1 className="landing-hero-title">
            Build with <span className="landing-gradient-text">physics-driven</span> 3D components
          </h1>
          <p className="landing-hero-desc">
            Explore, customize, and integrate immersive 3D UI components into your React projects.
            Powered by Rapier physics, Three.js, and React Three Fiber.
          </p>
          <div className="landing-hero-actions">
            <button className="landing-btn landing-btn-primary" onClick={onEnter}>
              Explore Components
              <span className="landing-btn-arrow">&rarr;</span>
            </button>
            <a href="https://github.com/ronie-coder/ManiacUI" target="_blank" rel="noopener noreferrer" className="landing-btn landing-btn-secondary">
              View on GitHub
            </a>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="landing-hero-orb landing-hero-orb-1" />
          <div className="landing-hero-orb landing-hero-orb-2" />
          <div className="landing-hero-orb landing-hero-orb-3" />
          <div className="landing-hero-card-container">
            <div className="landing-hero-card">
              <div className="landing-hero-card-strap" />
              <div className="landing-hero-card-body">
                <div className="landing-hero-card-line landing-hero-card-line-lg" />
                <div className="landing-hero-card-line landing-hero-card-line-sm" />
                <div className="landing-hero-card-line landing-hero-card-line-xs" />
              </div>
            </div>
            <div className="landing-hero-card-shadow" />
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="landing-stats" data-reveal>
        <div className="landing-stats-inner">
          <Counter to={1} suffix="ms" label="Physics Tick Rate" />
          <Counter to={8} suffix="+" label="Customizable Props" />
          <Counter to={3} suffix="D" label="Rendering Engine" />
          <Counter to={100} suffix="%" label="Open Source" />
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="landing-features" data-reveal>
        <div className="landing-features-inner">
          <div className="landing-section-label">Features</div>
          <h2 className="landing-section-title">Everything you need to build immersive&nbsp;UIs</h2>
          <p className="landing-section-desc">
            Drop in ready-made 3D components, customize them in real time, and export the code.
          </p>
          <div className="landing-features-grid">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="landing-feature-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="landing-feature-icon">{f.icon}</span>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="landing-how" data-reveal>
        <div className="landing-how-inner">
          <div className="landing-section-label">How it Works</div>
          <h2 className="landing-section-title">From component to production in four&nbsp;steps</h2>
          <p className="landing-section-desc">
            No complex setup. Just pick, tweak, preview, and deploy.
          </p>
          <div className="landing-how-steps">
            {STEPS.map((s, i) => (
              <div key={s.num} className="landing-how-step" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="landing-how-num">{s.num}</div>
                <div className="landing-how-line" />
                <h3 className="landing-how-title">{s.title}</h3>
                <p className="landing-how-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="landing-testimonials" data-reveal>
        <div className="landing-testimonials-inner">
          <div className="landing-section-label">Testimonials</div>
          <h2 className="landing-section-title">Loved by designers and developers&nbsp;alike</h2>
          <p className="landing-section-desc">See what early adopters are saying about the component library.</p>
          <div className="landing-testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.author} className="landing-testimonial-card">
                <div className="landing-testimonial-quote">{'\u201C'}</div>
                <p className="landing-testimonial-text">{t.quote}</p>
                <div className="landing-testimonial-author">
                  <div className="landing-testimonial-avatar">{t.author[0]}</div>
                  <div>
                    <div className="landing-testimonial-name">{t.author}</div>
                    <div className="landing-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Demo Components ─── */}
      <section id="components" className="landing-demo" data-reveal>
        <div className="landing-demo-inner">
          <div className="landing-section-label">Components</div>
          <h2 className="landing-section-title">Explore the component&nbsp;library</h2>
          <p className="landing-section-desc">Each component is fully customizable with real-time preview and copy-ready code.</p>
          <div className="landing-demo-grid">
            {DEMO_COMPONENTS.map(c => (
              <div key={c.name} className="landing-demo-card" onClick={onEnter}>
                <div className="landing-demo-visual" style={{ background: c.gradient }}>
                  <div className="landing-demo-icon">{c.icon}</div>
                </div>
                <div className="landing-demo-info">
                  <h3 className="landing-demo-name">{c.name}</h3>
                  <p className="landing-demo-desc">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="landing-demo-cta">
            <button className="landing-btn landing-btn-primary" onClick={onEnter}>
              See All Components
              <span className="landing-btn-arrow">&rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="landing-faq" data-reveal>
        <div className="landing-faq-inner">
          <div className="landing-section-label">FAQ</div>
          <h2 className="landing-section-title">Frequently asked questions</h2>
          <div className="landing-faq-list">
            {FAQS.map((item, i) => (
              <FAQItem key={i} {...item} isOpen={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="landing-cta" data-reveal>
        <div className="landing-cta-inner">
          <h2 className="landing-cta-title">Ready to explore?</h2>
          <p className="landing-cta-desc">
            Try the interactive lanyard playground. Customize colors, upload images, and see the physics in action.
          </p>
          <button className="landing-btn landing-btn-primary" onClick={onEnter}>
            Open Component Library
            <span className="landing-btn-arrow">&rarr;</span>
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <span className="landing-footer-logo">{'\u25A0'} ManiacUI</span>
          <span className="landing-footer-text">Built with React, Three.js &amp; Rapier</span>
        </div>
      </footer>
    </div>
  )
}
