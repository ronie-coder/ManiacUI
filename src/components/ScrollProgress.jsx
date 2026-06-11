import { useState, useEffect, useRef } from 'react'
import './ScrollProgress.css'

export default function ScrollProgress({
  color = '#a855f7',
  height = 2,
  glowIntensity = 1,
  zIndex = 9999,
}) {
  const [progress, setProgress] = useState(0)
  const frame = useRef(null)

  useEffect(() => {
    const el = document.querySelector('.app-content')
    if (!el) return

    const handleScroll = () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = el
        const max = scrollHeight - clientHeight
        setProgress(max > 0 ? Math.min(1, scrollTop / max) : 0)
      })
    }

    handleScroll()
    el.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div className="sp-root" style={{ zIndex, height: `${height}px` }}>
      <div
        className="sp-bar"
        style={{
          width: `${progress * 100}%`,
          height: `${height}px`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow: `0 0 ${6 * glowIntensity}px ${color}66, 0 0 ${20 * glowIntensity}px ${color}22`,
        }}
      />
    </div>
  )
}
