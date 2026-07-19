import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { listVersions, type ProjectVersion } from '../services/versions'
import { useTranslation } from '../i18n/useTranslation'
import type { Formulation } from '../types/formulation'

interface Props {
  projectId: string
  onRestore: (formulation: Formulation) => void
  onClose: () => void
}

export default function VersionHistory({ projectId, onRestore, onClose }: Props) {
  const [versions, setVersions] = useState<ProjectVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    listVersions(projectId)
      .then(setVersions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [projectId])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="max-h-[80svh] w-full max-w-md overflow-y-auto rounded-lg border border-border bg-panel p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-fg">{t('history.title')}</h3>
          <button onClick={onClose} className="text-fg/50 hover:text-fg">
            ✕
          </button>
        </div>

        {loading && <p className="mt-4 text-sm text-fg/40">{t('history.loading')}</p>}
        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        {!loading && versions.length === 0 && <p className="mt-4 text-sm text-fg/40">{t('history.empty')}</p>}

        <div className="mt-4 flex flex-col gap-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className="flex items-center justify-between rounded border border-border bg-deep px-3 py-2"
            >
              <div>
                <p className="text-sm text-fg">{version.createdAt}</p>
                <p className="text-xs text-fg/40">
                  {t(
                    version.ingredientCount > 1 ? 'history.ingredientCountPlural' : 'history.ingredientCount',
                    { count: version.ingredientCount },
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  onRestore(version.formulation)
                  onClose()
                }}
                className="rounded border border-border px-2.5 py-1 text-xs text-fg/70 hover:border-accent hover:text-fg"
              >
                {t('history.restore')}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
