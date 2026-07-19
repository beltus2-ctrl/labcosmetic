import { AnimatePresence, motion } from 'motion/react'
import { useToastStore, type ToastType } from '../store/useToastStore'

const TYPE_STYLES: Record<ToastType, string> = {
  success: 'border-success/40 text-success',
  error: 'border-danger/40 text-danger',
  info: 'border-accent/40 text-accent',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto cursor-pointer rounded-lg border bg-panel px-4 py-2.5 text-sm shadow-lg ${TYPE_STYLES[toast.type]}`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
