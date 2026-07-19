interface Props {
  size?: number
  animated?: boolean
}

/**
 * Logo LabCosmetic : fiole stylisée dans un anneau hexagonal (motif moléculaire),
 * avec orbites d'électrons. Couleurs pilotées par les variables de thème.
 */
export default function Logo({ size = 32, animated = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LabCosmetic"
    >
      <defs>
        <linearGradient id="lc-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" style={{ stopColor: 'var(--color-accent)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--color-accent-hover)' }} />
        </linearGradient>
        <linearGradient id="lc-liquid" x1="30" y1="55" x2="70" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" style={{ stopColor: 'var(--color-accent)' }} stopOpacity="0.9" />
          <stop offset="100%" style={{ stopColor: 'var(--color-accent-hover)' }} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Anneau hexagonal (molécule) */}
      <path
        d="M50 4 L88 26 L88 74 L50 96 L12 74 L12 26 Z"
        stroke="url(#lc-grad)"
        strokeWidth="5"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Nœuds moléculaires aux sommets */}
      <circle cx="50" cy="4" r="4.5" fill="url(#lc-grad)" />
      <circle cx="88" cy="74" r="4.5" fill="url(#lc-grad)" />
      <circle cx="12" cy="74" r="4.5" fill="url(#lc-grad)" />

      {/* Fiole : col + corps conique */}
      <path
        d="M43 24 L43 46 L28 76 A6 6 0 0 0 33.5 84 L66.5 84 A6 6 0 0 0 72 76 L57 46 L57 24 Z"
        stroke="url(#lc-grad)"
        strokeWidth="4.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Ouverture du col */}
      <line x1="39" y1="24" x2="61" y2="24" stroke="url(#lc-grad)" strokeWidth="4.5" strokeLinecap="round" />

      {/* Liquide dans la fiole */}
      <path d="M36.5 60 L28.8 75.5 A4.5 4.5 0 0 0 33.5 81.5 L66.5 81.5 A4.5 4.5 0 0 0 71.2 75.5 L63.5 60 Q56 64 50 60 T36.5 60 Z" fill="url(#lc-liquid)" />

      {/* Bulles */}
      <circle cx="45" cy="70" r="2.5" fill="var(--color-deep, #0a1628)" opacity="0.5" />
      <circle cx="55" cy="74" r="1.8" fill="var(--color-deep, #0a1628)" opacity="0.5" />

      {/* Orbite d'électron */}
      <g
        style={
          animated
            ? { transformOrigin: '50px 50px', animation: 'lc-orbit 3.2s linear infinite' }
            : undefined
        }
      >
        <ellipse
          cx="50"
          cy="50"
          rx="46"
          ry="17"
          stroke="url(#lc-grad)"
          strokeWidth="2"
          opacity="0.45"
          transform="rotate(-24 50 50)"
        />
        <circle cx="92" cy="34" r="4" fill="url(#lc-grad)" />
      </g>
    </svg>
  )
}
