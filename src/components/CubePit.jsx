import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import './CubePit.css'

const { randFloat, randFloatSpread } = THREE.MathUtils
const _dummy = new THREE.Object3D()

const PALETTES = [
  ['#a855f7', '#d946ef', '#f472b6', '#818cf8', '#c084fc', '#e879f9'],
  ['#f97316', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'],
  ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
]

function generateColors(hexColors, count) {
  const base = hexColors.map(c => new THREE.Color(c))
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const t = count <= 1 ? 0 : i / (count - 1)
    const scaled = t * (base.length - 1)
    const idx = Math.min(Math.floor(scaled), base.length - 2)
    const alpha = scaled - idx
    const c = base[idx].clone()
    if (idx < base.length - 1) {
      const n = base[idx + 1]
      c.r += (n.r - c.r) * alpha
      c.g += (n.g - c.g) * alpha
      c.b += (n.b - c.b) * alpha
    }
    out[i * 3] = c.r; out[i * 3 + 1] = c.g; out[i * 3 + 2] = c.b
  }
  return out
}

const v = () => new THREE.Vector3()

function createPhysics(count) {
  const cfg = {
    count, gravity: 0.01, friction: 0.9975, wallBounce: 0.95, maxVelocity: 0.15,
    maxX: 5, maxY: 5, maxZ: 2, minSize: 0.6, maxSize: 1.4, size0: 1.4, controlSphere0: false,
  }
  const pos = new Float32Array(3 * count)
  const vel = new Float32Array(3 * count)
  const size = new Float32Array(count)
  const center = new THREE.Vector3()

  new THREE.Vector3().toArray(pos, 0)
  size[0] = cfg.size0
  for (let i = 1; i < count; i++) {
    const j = 3 * i
    pos[j] = randFloatSpread(2 * cfg.maxX)
    pos[j + 1] = randFloatSpread(2 * cfg.maxY)
    pos[j + 2] = randFloatSpread(2 * cfg.maxZ)
    size[i] = randFloat(cfg.minSize, cfg.maxSize)
  }

  const rotX = new Float32Array(count)
  const rotY = new Float32Array(count)
  const _p = v(), _v = v(), _d = v(), _c = v(), _n = v(), _m = v()

  function update(delta) {
    let si = 0
    if (cfg.controlSphere0) {
      si = 1
      v().fromArray(pos, 0).lerp(center, 0.1).toArray(pos, 0)
      vel[0] = 0; vel[1] = 0; vel[2] = 0
    }
    for (let i = si; i < count; i++) {
      const j = 3 * i
      vel[j + 1] -= delta * cfg.gravity * size[i]
      vel[j] *= cfg.friction; vel[j + 1] *= cfg.friction; vel[j + 2] *= cfg.friction
      const len = Math.sqrt(vel[j] ** 2 + vel[j + 1] ** 2 + vel[j + 2] ** 2)
      if (len > cfg.maxVelocity) {
        const s = cfg.maxVelocity / len
        vel[j] *= s; vel[j + 1] *= s; vel[j + 2] *= s
      }
      pos[j] += vel[j]; pos[j + 1] += vel[j + 1]; pos[j + 2] += vel[j + 2]
    }
    for (let i = si; i < count; i++) {
      const j = 3 * i; const ri = size[i]
      for (let k = i + 1; k < count; k++) {
        const l = 3 * k
        const dx = pos[l] - pos[j]; const dy = pos[l + 1] - pos[j + 1]; const dz = pos[l + 2] - pos[j + 2]
        const distSq = dx * dx + dy * dy + dz * dz
        const sr = ri + size[k]
        if (distSq < sr * sr && distSq > 1e-4) {
          const dist = Math.sqrt(distSq)
          _n.set(dx / dist, dy / dist, dz / dist).multiplyScalar((sr - dist) / 2)
          _p.fromArray(pos, j); _v.fromArray(vel, j)
          _d.fromArray(pos, l); _c.fromArray(vel, l)
          _p.sub(_n); _v.sub(_m.copy(_n).multiplyScalar(Math.max(_v.length(), 1)))
          _d.add(_n); _c.add(_m.copy(_n).multiplyScalar(Math.max(_c.length(), 1)))
          _p.toArray(pos, j); _v.toArray(vel, j)
          _d.toArray(pos, l); _c.toArray(vel, l)
        }
      }
      if (cfg.controlSphere0) {
        const dx = pos[j] - pos[0]; const dy = pos[j + 1] - pos[1]; const dz = pos[j + 2] - pos[2]
        const distSq = dx * dx + dy * dy + dz * dz
        const sr = ri + size[0]
        if (distSq < sr * sr && distSq > 1e-4) {
          const dist = Math.sqrt(distSq)
          const nx = dx / dist; const ny = dy / dist; const nz = dz / dist
          pos[j] += nx * (sr - dist); pos[j + 1] += ny * (sr - dist); pos[j + 2] += nz * (sr - dist)
          vel[j] += nx * 0.4; vel[j + 1] += ny * 0.4 + 0.15; vel[j + 2] += nz * 0.4
        }
      }
      const r = size[i]
      if (Math.abs(pos[j]) + r > cfg.maxX) {
        pos[j] = Math.sign(pos[j]) * (cfg.maxX - r)
        vel[j] = -vel[j] * cfg.wallBounce
      }
      if (pos[j + 1] - r < -cfg.maxY) {
        pos[j + 1] = -cfg.maxY + r
        vel[j + 1] = -vel[j + 1] * cfg.wallBounce
      }
      if (pos[j + 1] + r > cfg.maxY) {
        pos[j + 1] = cfg.maxY - r
        vel[j + 1] = -vel[j + 1] * cfg.wallBounce
      }
      const mz = Math.max(cfg.maxZ, cfg.maxSize)
      if (Math.abs(pos[j + 2]) + r > mz) {
        pos[j + 2] = Math.sign(pos[j + 2]) * (cfg.maxZ - r)
        vel[j + 2] = -vel[j + 2] * cfg.wallBounce
      }
    }
    for (let i = si; i < count; i++) {
      const j = 3 * i
      const len = Math.sqrt(vel[j] ** 2 + vel[j + 1] ** 2 + vel[j + 2] ** 2)
      if (len < 0.002) {
        vel[j] += (Math.random() - 0.5) * 0.002
        vel[j + 1] += (Math.random() - 0.5) * 0.002
        vel[j + 2] += (Math.random() - 0.5) * 0.002
      }
    }
  }
  return { cfg, pos, vel, size, center, rotX, rotY, update }
}

const toggleS = {
  position: 'absolute', bottom: 12, right: 12, zIndex: 10,
  display: 'flex', alignItems: 'center', gap: 8,
  cursor: 'pointer', userSelect: 'none',
  padding: '6px 10px', borderRadius: 20,
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.08)',
}

const toggleLabel = {
  fontSize: 10, fontWeight: 600, letterSpacing: '0.8px',
  textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
}

const toggleTrack = {
  width: 32, height: 18, borderRadius: 10,
  background: 'rgba(255,255,255,0.12)',
  position: 'relative', transition: 'background 0.3s ease',
}

const toggleThumb = {
  position: 'absolute', top: 2, left: 2,
  width: 14, height: 14, borderRadius: '50%',
  background: '#fff', transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
}

export default function CubePit({
  cubeCount = 200,
  paletteIndex = 0,
  followCursor = false,
  className = '',
  showOverlay = true,
  overlayToggle = true,
}) {
  const [visible, setVisible] = useState(showOverlay)
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const hexColors = PALETTES[paletteIndex % PALETTES.length]
    const count = cubeCount

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 4, 16)
    camera.lookAt(0, 0, 0)

    const scene = new THREE.Scene()

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(renderer)).texture
    pmrem.dispose()

    const mat = new THREE.MeshPhysicalMaterial({
      envMap: envTexture,
      envMapIntensity: 2,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.02,
    })
    mat.envMapRotation.x = -Math.PI / 2

    const geo = new THREE.BoxGeometry()
    const mesh = new THREE.InstancedMesh(geo, mat, count)
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    scene.add(mesh)

    const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry())
    const edgeMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.3,
    })
    const edgeMesh = new THREE.InstancedMesh(edgeGeo, edgeMat, count)
    edgeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    scene.add(edgeMesh)

    const colArr = generateColors(hexColors, count)
    const colAttr = new THREE.InstancedBufferAttribute(colArr, 3)
    mesh.instanceColor = colAttr
    colAttr.needsUpdate = true
    edgeMesh.instanceColor = colAttr

    const ambLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambLight)
    const ptLight = new THREE.PointLight(new THREE.Color(colArr[0], colArr[1], colArr[2]), 200)
    scene.add(ptLight)

    const physics = createPhysics(count)
    const { cfg, pos, vel, size, center, rotX, rotY } = physics

    function resize() {
      const parent = canvas.parentElement
      if (!parent) return
      const w = parent.clientWidth
      const h = parent.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      const fovRad = (camera.fov * Math.PI) / 180
      const wHeight = 2 * Math.tan(fovRad / 2) * camera.position.length()
      cfg.maxX = (wHeight * camera.aspect) / 2
      cfg.maxY = wHeight / 2
    }

    resize()
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    let active = false
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const hit = new THREE.Vector3()

    function onMove(clientX, clientY) {
      const rect = canvas.getBoundingClientRect()
      const px = ((clientX - rect.left) / rect.width) * 2 - 1
      const py = -((clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera({ x: px, y: py }, camera)
      camera.getWorldDirection(plane.normal)
      raycaster.ray.intersectPlane(plane, hit)
      center.copy(hit)
      if (!active) { active = true; cfg.controlSphere0 = true }
    }

    function onPointerMove(e) { onMove(e.clientX, e.clientY) }
    function onPointerDown(e) { onMove(e.clientX, e.clientY) }
    function onLeave() { active = false; cfg.controlSphere0 = false; center.set(0, 0, 0) }
    function onTouchStart(e) { if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY) }
    function onTouchMove(e) { if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY) }
    function onTouchEnd() { active = false; cfg.controlSphere0 = false; center.set(0, 0, 0) }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })
    canvas.addEventListener('touchend', onTouchEnd)
    canvas.addEventListener('touchcancel', onTouchEnd)
    canvas.style.touchAction = 'none'

    const clock = new THREE.Clock()
    let running = true

    function animate() {
      if (!running) return
      requestAnimationFrame(animate)
      const delta = Math.min(clock.getDelta(), 0.05)

      physics.update(delta)

      for (let i = 0; i < count; i++) {
        const j = 3 * i
        _dummy.position.set(pos[j], pos[j + 1], pos[j + 2])
        if (i === 0 && !followCursor) {
          _dummy.scale.setScalar(0)
        } else {
          _dummy.scale.setScalar(size[i])
          rotX[i] += delta * vel[j + 1] * 12
          rotY[i] += delta * vel[j] * 12
          _dummy.rotation.x = rotX[i]
          _dummy.rotation.y = rotY[i]
        }
        _dummy.updateMatrix()
        mesh.setMatrixAt(i, _dummy.matrix)
        const edgeScale = (i === 0 && !followCursor) ? 0 : size[i] * 1.04
        _dummy.scale.setScalar(edgeScale)
        _dummy.updateMatrix()
        edgeMesh.setMatrixAt(i, _dummy.matrix)
        if (i === 0) ptLight.position.copy(_dummy.position)
      }
      mesh.instanceMatrix.needsUpdate = true
      edgeMesh.instanceMatrix.needsUpdate = true
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      running = false
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('touchcancel', onTouchEnd)
      geo.dispose()
      edgeGeo.dispose()
      mat.dispose()
      edgeMat.dispose()
      renderer.dispose()
    }
  }, [cubeCount, paletteIndex, followCursor])

  return (
    <div className="cp-container">
      <canvas
        ref={ref}
        className={className}
      />
      {visible && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', userSelect: 'none',
        }}>
          <div style={{
            background: 'rgba(10,10,15,0.15)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            padding: '32px 36px',
            maxWidth: 380,
            width: '100%',
            textAlign: 'center',
            pointerEvents: 'auto',
          }}>
            <div style={{
              display: 'inline-block',
              fontSize: 9, fontWeight: 600, letterSpacing: '1.6px',
              textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: 20,
              background: 'linear-gradient(135deg, #a855f7, #818cf8)',
              color: '#fff', marginBottom: 14,
            }}>
              Interactive 3D
            </div>
            <h2 style={{
              fontSize: 26, fontWeight: 700, margin: '0 0 8px',
              background: 'linear-gradient(135deg, #a855f7, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.3px',
            }}>
              CubePit
            </h2>
            <p style={{
              fontSize: 12, lineHeight: 1.6,
              color: 'rgba(255,255,255,0.45)',
              margin: '0 0 20px',
            }}>
              A physics-driven pit of cubes. Move your cursor to push and tumble them in real time.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <span style={{
                padding: '7px 18px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                background: 'linear-gradient(135deg, #a855f7, #818cf8)',
                color: '#fff', cursor: 'pointer',
              }}>Try now</span>
              <span style={{
                padding: '7px 18px', borderRadius: 8, fontSize: 11, fontWeight: 500,
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
              }}>Learn more</span>
            </div>
          </div>
        </div>
      )}
      {overlayToggle && (
        <div style={toggleS} onClick={() => setVisible(v => !v)}>
          <span style={toggleLabel}>Overlay</span>
          <span style={{ ...toggleTrack, background: visible ? 'linear-gradient(135deg, #a855f7, #818cf8)' : 'rgba(255,255,255,0.12)' }}>
            <span style={{ ...toggleThumb, transform: visible ? 'translateX(14px)' : 'translateX(0)' }} />
          </span>
        </div>
      )}
    </div>
  )
}
