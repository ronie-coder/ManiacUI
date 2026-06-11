import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './LiquidChrome.css'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uSpeed;
uniform float uScale;
uniform float uDistortion;
uniform float uReflectivity;
uniform vec2 uMouse;
uniform bool uInteractive;

varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  for (int i = 0; i < 6; i++) {
    v += a * smoothNoise(p);
    p = p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

vec3 chromePalette(float t, vec3 c1, vec3 c2, vec3 c3) {
  float h = sin(t * 6.283 + 1.57) * 0.5 + 0.5;
  vec3 col = mix(mix(c1, c2, smoothstep(0.2, 0.6, t)), c3, smoothstep(0.5, 0.9, t));
  col = mix(col, c3, pow(t, 4.0) * 1.2);
  float hl = exp(-pow(abs(t - 0.75) * 8.0, 5.0));
  col += vec3(hl * 0.8);
  float dk = exp(-pow(abs(t - 0.1) * 6.0, 4.0));
  col -= vec3(dk * 0.35);
  return clamp(col, 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  float asp = uResolution.x / uResolution.y;
  vec2 p = (uv - 0.5) * vec2(asp, 1.0) * uScale;
  float t = uTime * uSpeed;

  vec2 q = vec2(
    fbm(p + vec2(t * 0.12, t * 0.08)),
    fbm(p + vec2(t * 0.07 + 4.7, t * 0.1 + 9.3))
  );

  if (uInteractive) {
    vec2 mp = (uMouse - 0.5) * vec2(asp, 1.0) * uScale;
    vec2 diff = p - mp;
    float md = length(diff);
    float inf = exp(-md * md * 2.5);
    q += normalize(diff + 0.001) * inf * uDistortion * 0.35;
    q += vec2(
      fbm(mp + vec2(t * 0.05)) * inf * 0.3,
      fbm(mp + vec2(t * 0.06 + 2.3)) * inf * 0.3
    );
  }

  vec2 r = vec2(
    fbm(p + q * uDistortion * 0.7 + vec2(t * 0.04, t * 0.03)),
    fbm(p + q * uDistortion * 0.7 + vec2(t * 0.03 + 3.1, t * 0.05 + 7.5))
  );

  float f = fbm(p + r * uDistortion * 0.5);

  vec3 col = chromePalette(f, uColor1, uColor2, uColor3);

  float dx = fbm(p + r * uDistortion * 0.5 + vec2(0.015, 0.0)) - f;
  float dy = fbm(p + r * uDistortion * 0.5 + vec2(0.0, 0.015)) - f;
  float edge = length(vec2(dx, dy)) * 10.0;
  col += vec3(edge * uReflectivity * 0.4);

  vec3 n = normalize(vec3(dx * 3.0, dy * 3.0, 1.0));
  vec3 vDir = normalize(vec3(uv - 0.5, 0.5));
  float fresnel = pow(1.0 - max(dot(n, vDir), 0.0), 2.0);
  col += vec3(fresnel * uReflectivity * 0.2);

  vec2 vigUv = uv - 0.5;
  float vig = 1.0 - dot(vigUv, vigUv) * 1.4;
  col *= clamp(vig, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`

export default function LiquidChrome({
  color1 = '#2a1a3a',
  color2 = '#6366f1',
  color3 = '#06b6d4',
  speed = 0.6,
  scale = 1.5,
  distortion = 1.5,
  reflectivity = 0.6,
  interactive = true,
  customCursor = false,
  children,
}) {
  const containerRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorRef2 = useRef({ x: -100, y: -100, tx: -100, ty: -100 })
  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 })
  const uniformsRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const hex = h => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
      return m
        ? new THREE.Color(parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255)
        : new THREE.Color(0.4, 0.4, 0.8)
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    container.prepend(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor1: { value: hex(color1) },
      uColor2: { value: hex(color2) },
      uColor3: { value: hex(color3) },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uDistortion: { value: distortion },
      uReflectivity: { value: reflectivity },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uInteractive: { value: interactive },
    }
    uniformsRef.current = uniforms

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: false,
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
    const cursor = cursorRef2.current

    const onMove = e => {
      const rect = container.getBoundingClientRect()
      mouse.tx = (e.clientX - rect.left) / rect.width
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height
      cursor.tx = e.clientX
      cursor.ty = e.clientY
    }

    const onTouchMove = e => {
      e.preventDefault()
      const t = e.touches[0]
      if (t) {
        const rect = container.getBoundingClientRect()
        mouse.tx = (t.clientX - rect.left) / rect.width
        mouse.ty = 1 - (t.clientY - rect.top) / rect.height
        cursor.tx = t.clientX
        cursor.ty = t.clientY
      }
    }

    if (interactive) {
      container.addEventListener('mousemove', onMove)
      container.addEventListener('touchmove', onTouchMove, { passive: false })
    }

    let raf
    const tick = time => {
      raf = requestAnimationFrame(tick)
      uniforms.uTime.value = time * 0.001
      mouse.x += (mouse.tx - mouse.x) * 0.12
      mouse.y += (mouse.ty - mouse.y) * 0.12
      uniforms.uMouse.value.set(mouse.x, mouse.y)
      if (cursorRef.current) {
        cursor.x += (cursor.tx - cursor.x) * 0.15
        cursor.y += (cursor.ty - cursor.y) * 0.15
        cursorRef.current.style.left = `${cursor.x}px`
        cursorRef.current.style.top = `${cursor.y}px`
      }
      renderer.render(scene, camera)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      if (interactive) {
        container.removeEventListener('mousemove', onMove)
        container.removeEventListener('touchmove', onTouchMove)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      const canvas = renderer.domElement
      if (container.contains(canvas)) {
        container.removeChild(canvas)
      }
    }
  }, [])

  useEffect(() => {
    if (!uniformsRef.current) return
    uniformsRef.current.uSpeed.value = speed
  }, [speed])

  useEffect(() => {
    if (!uniformsRef.current) return
    uniformsRef.current.uScale.value = scale
  }, [scale])

  useEffect(() => {
    if (!uniformsRef.current) return
    uniformsRef.current.uDistortion.value = distortion
  }, [distortion])

  useEffect(() => {
    if (!uniformsRef.current) return
    uniformsRef.current.uReflectivity.value = reflectivity
  }, [reflectivity])

  useEffect(() => {
    if (!uniformsRef.current) return
    uniformsRef.current.uInteractive.value = interactive
  }, [interactive])

  const hex = h => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
    return m
      ? new THREE.Color(parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255)
      : new THREE.Color(0.4, 0.4, 0.8)
  }

  useEffect(() => {
    if (!uniformsRef.current) return
    uniformsRef.current.uColor1.value.copy(hex(color1))
  }, [color1])

  useEffect(() => {
    if (!uniformsRef.current) return
    uniformsRef.current.uColor2.value.copy(hex(color2))
  }, [color2])

  useEffect(() => {
    if (!uniformsRef.current) return
    uniformsRef.current.uColor3.value.copy(hex(color3))
  }, [color3])

  return (
    <div
      ref={containerRef}
      className="lc-container"
      style={{ cursor: customCursor && interactive ? 'none' : undefined }}
    >
      {customCursor && interactive && (
        <div ref={cursorRef} className="lc-cursor">
          <div className="lc-cursor-dot" />
        </div>
      )}
      {children && <div className="lc-overlay">{children}</div>}
    </div>
  )
}
