import { motion } from 'motion/react'
import Logo from './Logo'

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-deep"
    >
      {/* Halo lumineux derrière le logo */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute h-48 w-48 rounded-full opacity-25 blur-3xl"
          style={{ background: 'var(--color-accent)' }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Logo size={112} animated />
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <motion.h1
          initial={{ opacity: 0, y: 12, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.14em' }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          className="font-display text-2xl font-semibold uppercase text-fg"
        >
          LabCosmetic
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xs uppercase tracking-[0.3em] text-fg/40"
        >
          Virtual Lab
        </motion.p>
      </div>

      {/* Barre de progression shimmer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="h-0.5 w-44 overflow-hidden rounded-full bg-fg/10"
      >
        <div
          className="h-full w-1/4 rounded-full"
          style={{
            background: 'var(--color-accent)',
            animation: 'lc-shimmer 1.1s ease-in-out infinite',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
