import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import type { SkinState } from '../lib/skinEffectEngine'

interface Props {
  state: SkinState
}

const BASE_COLOR: [number, number, number] = [0.75, 0.55, 0.42]
const IRRITATION_COLOR: [number, number, number] = [0.85, 0.2, 0.15]
const PIGMENT_COLOR: [number, number, number] = [0.8, 0.55, 0.1]

function mix(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function Face({ state }: Props) {
  const [r, g, b] = useMemo(() => {
    let color = BASE_COLOR
    color = mix(color, IRRITATION_COLOR, (state.irritation / 100) * 0.5)
    color = mix(color, PIGMENT_COLOR, (state.pigmentation / 100) * 0.45)
    return color
  }, [state])

  const roughness = 1 - (state.hydration / 100) * 0.6
  const emissiveIntensity = (state.radiance / 100) * 0.18

  const skinMaterial = (
    <meshPhysicalMaterial
      color={[r, g, b]}
      roughness={roughness}
      clearcoat={(state.hydration / 100) * 0.5}
      emissive={[r * 0.3, g * 0.3, b * 0.2]}
      emissiveIntensity={emissiveIntensity}
    />
  )

  return (
    <group>
      {/* Tête */}
      <mesh scale={[1, 1.15, 0.92]}>
        <sphereGeometry args={[0.62, 48, 48]} />
        {skinMaterial}
      </mesh>

      {/* Oreilles */}
      <mesh position={[-0.6, 0, 0]} scale={[0.35, 0.55, 0.4]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        {skinMaterial}
      </mesh>
      <mesh position={[0.6, 0, 0]} scale={[0.35, 0.55, 0.4]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        {skinMaterial}
      </mesh>

      {/* Nez */}
      <mesh position={[0, -0.03, 0.58]} scale={[0.55, 0.75, 0.6]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        {skinMaterial}
      </mesh>

      {/* Sourcils */}
      <mesh position={[-0.22, 0.28, 0.5]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.16, 0.025, 0.02]} />
        <meshStandardMaterial color="#3a2a20" />
      </mesh>
      <mesh position={[0.22, 0.28, 0.5]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.16, 0.025, 0.02]} />
        <meshStandardMaterial color="#3a2a20" />
      </mesh>

      {/* Yeux */}
      <mesh position={[-0.22, 0.15, 0.52]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>
      <mesh position={[0.22, 0.15, 0.52]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#1a1410" />
      </mesh>

      {/* Bouche */}
      <mesh position={[0, -0.32, 0.53]}>
        <boxGeometry args={[0.22, 0.03, 0.02]} />
        <meshStandardMaterial color="#7a4a42" />
      </mesh>
    </group>
  )
}

export default function SkinAvatar3D({ state }: Props) {
  return (
    <div className="h-full w-full rounded-lg border border-border bg-deep">
      <Canvas camera={{ position: [0, 0, 2.6], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 2]} intensity={1} />
        <Face state={state} />
        <Environment preset="apartment" />
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  )
}
