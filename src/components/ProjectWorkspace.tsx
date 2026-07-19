import { useEffect, useState } from 'react'
import Workspace3D from './Workspace3D'
import FormulationPanel from './FormulationPanel'
import AvatarPanel from './AvatarPanel'
import VersionHistory from './VersionHistory'
import GlasswareSelector from './GlasswareSelector'
import { getProject, saveFormulation } from '../services/projects'
import { createVersion } from '../services/versions'
import { useTranslation } from '../i18n/useTranslation'
import { useToastStore } from '../store/useToastStore'
import { EMPTY_FORMULATION, type Formulation, type VesselType } from '../types/formulation'

interface Props {
  projectId: string
  userId: string
}

type Tab = 'mix' | 'avatar'

export default function ProjectWorkspace({ projectId, userId }: Props) {
  const [title, setTitle] = useState<string | null>(null)
  const [formulation, setFormulation] = useState<Formulation>(EMPTY_FORMULATION)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<Tab>('mix')
  const [showHistory, setShowHistory] = useState(false)
  const { t } = useTranslation()
  const addToast = useToastStore((s) => s.addToast)

  useEffect(() => {
    setLoading(true)
    getProject(projectId)
      .then((project) => {
        setTitle(project.title)
        setFormulation(project.formulation)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [projectId])

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveFormulation(projectId, formulation)
      await createVersion(projectId, userId, formulation)
      addToast(t('workspace.saved'), 'success')
    } catch (e) {
      const message = (e as Error).message
      setError(message)
      addToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const setVessel = (vessel: VesselType) => {
    setFormulation({ ...formulation, vessel })
  }

  if (loading) {
    return <p className="text-sm text-fg/40">{t('workspace.loadingProject')}</p>
  }

  return (
    <div className="flex flex-col gap-3 lg:h-[70svh]">
      <div className="flex items-center justify-between">
        {title && <h2 className="font-display text-lg font-medium text-fg">{title}</h2>}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('mix')}
            className={`rounded px-3 py-1.5 text-sm ${
              tab === 'mix' ? 'bg-accent text-white' : 'text-fg/60 hover:text-fg'
            }`}
          >
            {t('workspace.mix')}
          </button>
          <button
            onClick={() => setTab('avatar')}
            className={`rounded px-3 py-1.5 text-sm ${
              tab === 'avatar' ? 'bg-accent text-white' : 'text-fg/60 hover:text-fg'
            }`}
          >
            {t('workspace.avatar')}
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="rounded border border-border px-3 py-1.5 text-sm text-fg/70 hover:border-accent hover:text-fg"
          >
            {t('workspace.history')}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}

      {tab === 'mix' ? (
        <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr] lg:overflow-hidden">
          <div className="flex flex-col gap-2 lg:overflow-hidden">
            <GlasswareSelector vessel={formulation.vessel ?? 'beaker'} onChange={setVessel} />
            <div className="h-64 lg:h-auto lg:flex-1 lg:overflow-hidden">
              <Workspace3D formulation={formulation} />
            </div>
          </div>
          <FormulationPanel
            projectTitle={title ?? 'Projet'}
            formulation={formulation}
            onChange={setFormulation}
            onSave={handleSave}
            saving={saving}
          />
        </div>
      ) : (
        <div className="flex-1 lg:overflow-hidden">
          <AvatarPanel formulation={formulation} mode="topique" />
        </div>
      )}

      {showHistory && (
        <VersionHistory
          projectId={projectId}
          onRestore={(f) => {
            setFormulation(f)
            addToast(t('history.restored'), 'success')
          }}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  )
}
