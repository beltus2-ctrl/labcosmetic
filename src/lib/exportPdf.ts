import { jsPDF } from 'jspdf'
import { COMPOUNDS, type Compound } from '../data/compounds'
import { analyzeFormulation, STABILITY_LABELS } from './mixingEngine'
import type { Formulation } from '../types/formulation'

export function exportFormulationPdf(
  projectTitle: string,
  formulation: Formulation,
  compounds: Compound[] = COMPOUNDS,
): void {
  const analysis = analyzeFormulation(formulation.ingredients, compounds)
  const doc = new jsPDF()
  const marginX = 18
  let y = 20

  doc.setFontSize(18)
  doc.text(projectTitle, marginX, y)
  y += 8

  doc.setFontSize(10)
  doc.setTextColor(120)
  doc.text(`Fiche technique générée par LabCosmetic — ${new Date().toLocaleDateString('fr-FR')}`, marginX, y)
  y += 10

  doc.setTextColor(0)
  doc.setFontSize(13)
  doc.text('Ingrédients', marginX, y)
  y += 7

  doc.setFontSize(10)
  for (const ingredient of formulation.ingredients) {
    const compound = compounds.find((c) => c.id === ingredient.compoundId)
    if (!compound) continue
    const inci = compound.inciName ? ` (INCI : ${compound.inciName})` : ''
    doc.text(`• ${compound.name}${inci} — ${ingredient.percentage}%`, marginX, y)
    y += 6
    if (y > 270) {
      doc.addPage()
      y = 20
    }
  }

  y += 4
  doc.setFontSize(13)
  doc.text('Analyse', marginX, y)
  y += 7
  doc.setFontSize(10)
  doc.text(
    `pH estimé : ${analysis.estimatedPh !== null ? analysis.estimatedPh : 'non déterminable'}`,
    marginX,
    y,
  )
  y += 6
  doc.text(`Stabilité : ${STABILITY_LABELS[analysis.stability]}`, marginX, y)
  y += 6
  doc.text(`Total des proportions : ${Math.round(analysis.totalPercentage)}%`, marginX, y)
  y += 10

  if (analysis.issues.length > 0) {
    doc.setFontSize(13)
    doc.text('Points de vigilance', marginX, y)
    y += 7
    doc.setFontSize(10)
    for (const issue of analysis.issues) {
      const lines = doc.splitTextToSize(`• ${issue.message}`, 175)
      doc.text(lines, marginX, y)
      y += 6 * lines.length
      if (y > 270) {
        doc.addPage()
        y = 20
      }
    }
    y += 4
  }

  doc.setFontSize(8)
  doc.setTextColor(140)
  const disclaimer = doc.splitTextToSize(
    "Document généré automatiquement à titre éducatif par LabCosmetic. Ne constitue pas une évaluation de sécurité réglementaire (type CPSR) ni une fiche technique certifiée — usage informatif uniquement.",
    175,
  )
  doc.text(disclaimer, marginX, y)

  const safeTitle = projectTitle.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  doc.save(`fiche-technique-${safeTitle || 'projet'}.pdf`)
}
