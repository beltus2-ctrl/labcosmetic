import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useProjectStore } from '../store/useProjectStore'
import { createProject, deleteProject, listProjects } from '../services/projects'
import { useTranslation } from '../i18n/useTranslation'
import { useToastStore } from '../store/useToastStore'

interface Props {
  userId: string
}

export default function ProjectGallery({ userId }: Props) {
  const { projects, setProjects, openProject } = useProjectStore()
  const { t } = useTranslation()
  const addToast = useToastStore((s) => s.addToast)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const refresh = () => {
    setLoading(true)
    listProjects(userId)
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const project = await createProject(userId, newTitle.trim())
      setProjects([project, ...projects])
      setNewTitle('')
      setCreating(false)
      addToast(t('gallery.created'), 'success')
      openProject(project.id)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(t('gallery.confirmDelete'))) return
    try {
      await deleteProject(id)
      setProjects(projects.filter((p) => p.id !== id))
      addToast(t('gallery.deleted'), 'success')
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-fg/70">{t('gallery.title')}</h2>
        {!creating && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setCreating(true)}
            className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-white transition hover:bg-accent-hover"
          >
            {t('gallery.newProject')}
          </motion.button>
        )}
      </div>

      {creating && (
        <motion.form
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="flex gap-2"
        >
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={t('gallery.projectNamePlaceholder')}
            className="flex-1 rounded border border-border bg-panel px-3 py-2 text-sm text-fg placeholder:text-fg/40 focus:border-accent focus:outline-none"
          />
          <button type="submit" className="rounded bg-accent px-3 py-2 text-sm font-medium text-white">
            {t('gallery.create')}
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="rounded border border-border px-3 py-2 text-sm text-fg/70"
          >
            {t('gallery.cancel')}
          </button>
        </motion.form>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {loading ? (
        <p className="text-sm text-fg/40">{t('gallery.loading')}</p>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-12 text-center text-fg/50">
          <p>{t('gallery.empty')}</p>
          <p className="text-sm">{t('gallery.emptyHint')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                whileHover={{ y: -2 }}
                role="button"
                tabIndex={0}
                onClick={() => openProject(project.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') openProject(project.id)
                }}
                className="group relative cursor-pointer rounded-lg border border-border bg-panel p-4 text-left transition hover:border-accent"
              >
                <button
                  onClick={(e) => handleDelete(project.id, e)}
                  className="absolute right-2 top-2 hidden text-fg/40 hover:text-danger group-hover:block"
                  title={t('gallery.delete')}
                >
                  ✕
                </button>
                <h3 className="pr-4 font-medium text-fg">{project.title}</h3>
                <p className="mt-1 text-xs text-fg/50">{t('gallery.modifiedOn', { date: project.updatedAt })}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
