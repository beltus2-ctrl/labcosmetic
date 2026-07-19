import { useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { buildLatheProfile, getCameraPosition, VESSEL_SHAPES } from '../lib/glasswareProfiles'
import { useCompoundStore } from '../store/useCompoundStore'
import type { Formulation, VesselType } from '../types/formulation'

interface Props {
  formulation?: Formulation
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function CameraRig({ vessel }: { vessel: VesselType }) {
  const { camera } = useThree()

  useEffect(() => {
    const [x, y, z] = getCameraPosition(vessel)
    camera.position.set(x, y, z)
    camera.lookAt(0, 0, 0)
  }, [vessel, camera])

  return null
}

function GlassVessel({ vessel }: { vessel: VesselType }) {
  const height = VESSEL_SHAPES[vessel].height
  const points = useMemo(() => buildLatheProfile(vessel), [vessel])

  return (
    <mesh position={[0, -height / 2, 0]}>
      <latheGeometry args={[points, 32]} />
      <meshPhysicalMaterial
        color="#bcd9ec"
        transparent
        opacity={0.18}
        roughness={0.1}
        transmission={0.9}
        thickness={0.3}
        side={2}
      />
    </mesh>
  )
}

function Liquid({ formulation, vessel }: { formulation: Formulation; vessel: VesselType }) {
  const allCompounds = useCompoundStore((s) => s.allCompounds)

  const { color, fillRatio } = useMemo(() => {
    const ingredients = formulation.ingredients
    if (ingredients.length === 0) {
      return { color: [0.74, 0.85, 0.93] as [number, number, number], fillRatio: 0 }
    }

    const totalPct = ingredients.reduce((sum, i) => sum + i.percentage, 0) || 1
    let r = 0
    let g = 0
    let b = 0
    for (const ingredient of ingredients) {
      const compound = allCompounds.find((c) => c.id === ingredient.compoundId)
      if (!compound) continue
      const [cr, cg, cb] = hexToRgb(compound.color)
      const weight = ingredient.percentage / totalPct
      r += cr * weight
      g += cg * weight
      b += cb * weight
    }

    const ratio = Math.min(1, Math.max(0.12, totalPct / 100))
    return { color: [r, g, b] as [number, number, number], fillRatio: ratio }
  }, [formulation, allCompounds])

  const height = VESSEL_SHAPES[vessel].height
  const points = useMemo(() => buildLatheProfile(vessel, fillRatio, 24), [vessel, fillRatio])

  if (fillRatio <= 0) return null

  return (
    <mesh position={[0, -height / 2, 0]}>
      <latheGeometry args={[points, 32]} />
      <meshPhysicalMaterial color={color} transparent opacity={0.85} roughness={0.2} transmission={0.4} side={2} />
    </mesh>
  )
}

export default function Workspace3D({ formulation }: Props) {
  const vessel = formulation?.vessel ?? 'beaker'
  const initialCameraPosition = useMemo(() => getCameraPosition('beaker'), [])

  return (
    <div className="h-full w-full rounded-lg border border-border bg-deep">
      <Canvas camera={{ position: initialCameraPosition, fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={1} />
        <CameraRig vessel={vessel} />
        {formulation && <Liquid formulation={formulation} vessel={vessel} />}
        <GlassVessel vessel={vessel} />
        <Environment preset="city" />
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  )
}
