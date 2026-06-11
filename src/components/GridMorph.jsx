import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './GridMorph.css'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uGridSize;
uniform float uThickness;
uniform float uRippleIntensity;
uniform float uSpeed;
uniform float uGlowIntensity;
uniform float uVignetteStrength;
uniform float uFadeDistance;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform float uMouseRadius;

varying vec2 vUv;

const float PI = 3.14159265359;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  float dist = length(uv);
  float rippleFn = sin(PI * (uTime * uSpeed - dist));
  vec2 ripUv = uv + uv * rippleFn * uRippleIntensity;

  if (uMouseInfluence > 0.001) {
    vec2 muv = uMouse * 2.0 - 1.0;
    muv.x *= uResolution.x / uResolution.y;
    float md = length(uv - muv);
    float inf = uMouseInfluence * exp(-(md * md) / (uMouseRadius * uMouseRadius));
    float mw = sin(PI * (uTime * uSpeed * 1.4 - md * 2.5)) * inf;
    ripUv += normalize(uv - muv) * mw * uRippleIntensity * 0.35;
  }

  vec2 g = sin(uGridSize * PI * 0.5 * ripUv - PI / 2.0);
  vec2 ag = abs(g);

  float aaWidth = 0.5;
  vec2 sm = vec2(smoothstep(0.0, aaWidth, ag.x), smoothstep(0.0, aaWidth, ag.y));

  float lx = exp(-uThickness * sm.x * (0.8 + 0.5 * sin(PI * uTime)));
  float ly = exp(-uThickness * sm.y);
  float li = lx + ly;

  li += uGlowIntensity * exp(-uThickness * 0.4 * sm.x);
  li += uGlowIntensity * exp(-uThickness * 0.4 * sm.y);

  float hueShift = sin(uTime * 0.3 + dist * 1.5) * 0.5 + 0.5;
  vec3 col = mix(uColor1, uColor2, hueShift);
  vec3 lc = col * li;

  float fade = exp(-2.0 * clamp(pow(dist, uFadeDistance), 0.0, 1.0));

  vec2 vc = vUv - 0.5;
  float vd = length(vc);
  float vig = 1.0 - pow(vd * 2.0, uVignetteStrength);
  vig = clamp(vig, 0.0, 1.0);

  float a = li * fade * vig;
  gl_FragColor = vec4(lc * fade * vig, a);
}`

export default function GridMorph({
  children,
  gridSize = 12,
  color1 = '#6366f1',
  color2 = '#ec4899',
  bgColor = '#0a0a0f',
  speed = 1,
  intensity = 0.08,
  waveRadius = 0.3,
  thickness = 15,
  glowIntensity = 0.15,
  fadeDistance = 3.0,
  vignetteStrength = 4.0,
}) {
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const hex = h => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
      return m
        ? new THREE.Color(parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255)
        : new THREE.Color(0.4, 0.4, 0.8)
    }

    const bg = new THREE.Color(bgColor)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3))
    renderer.setClearColor(bg, 1)
    container.prepend(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor1: { value: hex(color1) },
      uColor2: { value: hex(color2) },
      uGridSize: { value: gridSize },
      uThickness: { value: thickness },
      uRippleIntensity: { value: intensity },
      uSpeed: { value: speed },
      uGlowIntensity: { value: glowIntensity },
      uVignetteStrength: { value: vignetteStrength },
      uFadeDistance: { value: fadeDistance },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseInfluence: { value: 0 },
      uMouseRadius: { value: waveRadius },
    }

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const resize = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      renderer.setSize(rect.width, rect.height)
      uniforms.uResolution.value.set(rect.width, rect.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const mouse = mouseRef.current

    const onMove = e => {
      const rect = container.getBoundingClientRect()
      mouse.tx = (e.clientX - rect.left) / rect.width
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height
      mouse.active = 1
    }

    const onLeave = () => { mouse.active = 0 }
    const onEnter = e => {
      const rect = container.getBoundingClientRect()
      mouse.tx = (e.clientX - rect.left) / rect.width
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height
      mouse.active = 1
    }

    const onTouchMove = e => {
      e.preventDefault()
      const t = e.touches[0]
      if (t) {
        const rect = container.getBoundingClientRect()
        mouse.tx = (t.clientX - rect.left) / rect.width
        mouse.ty = 1 - (t.clientY - rect.top) / rect.height
        mouse.active = 1
      }
    }
    const onTouchEnd = () => { mouse.active = 0 }

    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseleave', onLeave)
    container.addEventListener('mouseenter', onEnter)
    container.addEventListener('touchmove', onTouchMove, { passive: false })
    container.addEventListener('touchend', onTouchEnd)

    let raf
    const tick = time => {
      raf = requestAnimationFrame(tick)
      uniforms.uTime.value = time * 0.001
      mouse.x += (mouse.tx - mouse.x) * 0.08
      mouse.y += (mouse.ty - mouse.y) * 0.08
      uniforms.uMouse.value.set(mouse.x, mouse.y)
      const mi = uniforms.uMouseInfluence.value
      uniforms.uMouseInfluence.value += (mouse.active - mi) * 0.05
      renderer.render(scene, camera)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      container.removeEventListener('mouseenter', onEnter)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchend', onTouchEnd)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      const canvas = renderer.domElement
      if (container.contains(canvas)) {
        container.removeChild(canvas)
      }
    }
  }, [gridSize, color1, color2, bgColor, speed, intensity, waveRadius, thickness, glowIntensity, fadeDistance, vignetteStrength])

  return (
    <div ref={containerRef} className="gm-container">
      {children && <div className="gm-overlay">{children}</div>}
    </div>
  )
}
