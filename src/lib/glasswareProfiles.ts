import { Vector2 } from 'three'
import type { VesselType } from '../types/formulation'

type ProfilePoint = [heightFraction: number, radius: number]

interface VesselShape {
  height: number
  profile: ProfilePoint[]
}

export const VESSEL_SHAPES: Record<VesselType, VesselShape> = {
  beaker: {
    height: 1.2,
    profile: [
      [0, 0.5],
      [1, 0.6],
    ],
  },
  erlenmeyer: {
    height: 1.3,
    profile: [
      [0, 0.55],
      [0.05, 0.55],
      [0.55, 0.3],
      [0.65, 0.14],
      [1, 0.14],
    ],
  },
  'test-tube': {
    height: 1.4,
    profile: [
      [0, 0],
      [0.03, 0.09],
      [0.07, 0.15],
      [0.12, 0.18],
      [1, 0.18],
    ],
  },
  flask: {
    height: 1.3,
    profile: [
      [0, 0],
      [0.05, 0.2],
      [0.15, 0.38],
      [0.3, 0.48],
      [0.45, 0.44],
      [0.58, 0.3],
      [0.62, 0.14],
      [1, 0.14],
    ],
  },
  buret: {
    height: 1.7,
    profile: [
      [0, 0],
      [0.03, 0.02],
      [0.06, 0.09],
      [1, 0.09],
    ],
  },
}

function sampleRadius(profile: ProfilePoint[], t: number): number {
  if (t <= profile[0][0]) return profile[0][1]
  for (let i = 1; i < profile.length; i++) {
    const [t1, r1] = profile[i]
    if (t <= t1) {
      const [t0, r0] = profile[i - 1]
      const f = (t - t0) / (t1 - t0 || 1)
      return r0 + (r1 - r0) * f
    }
  }
  return profile[profile.length - 1][1]
}

export function buildLatheProfile(vessel: VesselType, maxT = 1, samples = 40): Vector2[] {
  const { profile } = VESSEL_SHAPES[vessel]
  const points: Vector2[] = []
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * maxT
    points.push(new Vector2(Math.max(sampleRadius(profile, t), 0.001), t))
  }
  return points
}

// Direction de vue de référence (proportions de l'ancienne caméra fixe [2,2,3])
const REFERENCE_DIRECTION: [number, number, number] = [2, 2, 3]
const REFERENCE_LENGTH = Math.sqrt(2 ** 2 + 2 ** 2 + 3 ** 2)

export function getCameraPosition(vessel: VesselType): [number, number, number] {
  const { height, profile } = VESSEL_SHAPES[vessel]
  const maxRadius = Math.max(...profile.map(([, r]) => r))
  // Verrerie fine (burette, éprouvette) : la caméra se rapproche pour compenser sa faible largeur
  const effectiveRadius = Math.max(height * 0.5, maxRadius * 1.8)
  const distance = effectiveRadius * 3.6 + 1
  const scale = distance / REFERENCE_LENGTH
  return [REFERENCE_DIRECTION[0] * scale, REFERENCE_DIRECTION[1] * scale, REFERENCE_DIRECTION[2] * scale]
}
