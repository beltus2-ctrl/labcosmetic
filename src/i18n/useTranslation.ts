import { useLocaleStore } from '../store/useLocaleStore'
import { translations } from './translations'

function getPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`))
}

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale)

  const t = (key: string, vars?: Record<string, string | number>): string => {
    const value = getPath(translations[locale], key)
    if (typeof value !== 'string') return key
    return interpolate(value, vars)
  }

  return { t, locale }
}
