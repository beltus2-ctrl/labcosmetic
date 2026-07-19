import type { VesselType } from '../types/formulation'
import { useTranslation } from '../i18n/useTranslation'

interface Props {
  vessel: VesselType
  onChange: (vessel: VesselType) => void
}

const VESSELS: VesselType[] = ['beaker', 'erlenmeyer', 'test-tube', 'flask', 'buret']

const LABEL_KEY: Record<VesselType, string> = {
  beaker: 'glassware.beaker',
  erlenmeyer: 'glassware.erlenmeyer',
  'test-tube': 'glassware.testTube',
  flask: 'glassware.flask',
  buret: 'glassware.buret',
}

export default function GlasswareSelector({ vessel, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap gap-1.5">
      {VESSELS.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`rounded px-2.5 py-1 text-xs transition ${
            vessel === v ? 'bg-accent text-white' : 'bg-panel-2 text-fg/60 hover:text-fg'
          }`}
        >
          {t(LABEL_KEY[v])}
        </button>
      ))}
    </div>
  )
}
