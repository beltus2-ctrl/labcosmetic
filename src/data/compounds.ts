export type CompoundCategory = 'raw-natural' | 'pure-compound' | 'derived-component'

export type SafetyLevel = 'low' | 'moderate' | 'caution'

export interface Compound {
  id: string
  name: string
  formula?: string
  inciName?: string
  category: CompoundCategory
  function: string[]
  phRange?: [number, number]
  decomposesInto?: string[]
  color: string
  safety: {
    level: SafetyLevel
    notes: string[]
  }
  source: string
  custom?: boolean
}

export const COMPOUNDS: Compound[] = [
  // --- Extraits naturels bruts (décomposables) ---
  {
    id: 'curcuma',
    name: 'Curcuma (rhizome)',
    inciName: 'Curcuma Longa Root',
    category: 'raw-natural',
    function: ['colorant', 'antioxydant'],
    decomposesInto: ['curcumine', 'huile-essentielle-curcuma', 'amidon'],
    color: '#e8a33d',
    safety: {
      level: 'low',
      notes: ['Peut tacher la peau et les tissus (pigment jaune-orangé puissant)', 'Risque de photosensibilisation faible rapporté dans certaines études'],
    },
    source: 'Composition générale documentée dans la littérature phytochimique (curcuminoïdes ~2-5% du rhizome sec)',
  },
  {
    id: 'aloe-vera',
    name: 'Aloe Vera (gel de feuille)',
    inciName: 'Aloe Barbadensis Leaf Juice',
    category: 'raw-natural',
    function: ['hydratant', 'apaisant'],
    decomposesInto: ['acemannane', 'aloine', 'eau'],
    color: '#bfe0c0',
    safety: {
      level: 'low',
      notes: ["L'aloïne (présente dans le latex, pas le gel pur) est irritante et doit être filtrée en usage cosmétique"],
    },
    source: 'Composition typique du gel : >98% eau, polysaccharides (acémannane), traces de composés phénoliques',
  },
  {
    id: 'miel',
    name: 'Miel',
    inciName: 'Honey / Mel',
    category: 'raw-natural',
    function: ['humectant', 'émollient'],
    decomposesInto: ['fructose', 'glucose', 'acide-gluconique'],
    color: '#d9a441',
    safety: {
      level: 'low',
      notes: ['Allergène potentiel (traces de protéines de pollen)', 'Comédogène léger selon la peau'],
    },
    source: 'Composition moyenne : ~38% fructose, ~31% glucose, ~17% eau, acides organiques, enzymes',
  },
  {
    id: 'beurre-karite',
    name: 'Beurre de karité',
    inciName: 'Butyrospermum Parkii Butter',
    category: 'raw-natural',
    function: ['émollient', 'occlusif'],
    decomposesInto: ['acide-oleique', 'acide-stearique', 'insaponifiables'],
    color: '#f5eddb',
    safety: {
      level: 'low',
      notes: ['Comédogénicité faible à modérée selon les peaux grasses'],
    },
    source: "Composition typique : ~40-60% acide stéarique/oléique combinés, 5-17% fraction insaponifiable (riche en vitamines A/E)",
  },
  {
    id: 'huile-lavande',
    name: 'Huile essentielle de lavande',
    inciName: 'Lavandula Angustifolia Oil',
    category: 'raw-natural',
    function: ['parfum', 'apaisant'],
    decomposesInto: ['linalol', 'acetate-de-linalyle'],
    color: '#b9a7d9',
    safety: {
      level: 'moderate',
      notes: ['Allergène de contact reconnu (linalol/acétate de linalyle) — toujours diluer avant application cutanée'],
    },
    source: "Composition typique : ~30-40% linalol, ~25-45% acétate de linalyle selon la variété et l'origine",
  },
  {
    id: 'vinaigre-cidre',
    name: 'Vinaigre de cidre de pomme',
    inciName: 'Cider Vinegar',
    category: 'raw-natural',
    function: ['régulateur de pH', 'astringent'],
    decomposesInto: ['acide-acetique', 'pectine', 'eau'],
    color: '#c9963f',
    safety: {
      level: 'moderate',
      notes: ['Acide non tamponné, irritant si utilisé pur — diluer avant usage topique'],
    },
    source: 'Composition typique : ~4-6% acide acétique, traces de pectine et minéraux, reste eau',
  },
  {
    id: 'argile-verte',
    name: 'Argile verte',
    inciName: 'Illite / Montmorillonite',
    category: 'raw-natural',
    function: ['absorbant', 'purifiant'],
    decomposesInto: ['silice', 'oxydes-de-fer'],
    color: '#8a9a6b',
    safety: { level: 'low', notes: [] },
    source: "Argile minérale, composition dominée par silicates d'aluminium et oxydes de fer (teinte verte)",
  },

  // --- Composés dérivés (issus d'une décomposition) ---
  {
    id: 'curcumine',
    name: 'Curcumine',
    formula: 'C21H20O6',
    category: 'derived-component',
    function: ['antioxydant', 'colorant'],
    color: '#f2b705',
    safety: { level: 'low', notes: ['Faible biodisponibilité cutanée à l\'état pur', 'Peut tacher'] },
    source: 'Curcuminoïde principal du curcuma, structure diféruloylméthane',
  },
  {
    id: 'huile-essentielle-curcuma',
    name: 'Huile essentielle de curcuma (turmérone/curcumène)',
    category: 'derived-component',
    function: ['parfum', 'antioxydant'],
    color: '#c98a2b',
    safety: { level: 'moderate', notes: ['Fraction volatile, sensibilisante à forte concentration — dosage strict requis'] },
    source: 'Fraction volatile du rhizome, riche en sesquiterpènes (ar-turmérone, curcumène)',
  },
  { id: 'amidon', name: 'Amidon', formula: '(C6H10O5)n', category: 'derived-component', function: ['texturant', 'absorbant'], color: '#f5f0e6', safety: { level: 'low', notes: [] }, source: 'Polysaccharide de réserve, ~30-40% du rhizome sec de curcuma' },
  { id: 'acemannane', name: 'Acémannane', category: 'derived-component', function: ['hydratant', 'apaisant'], color: '#d8ecd9', safety: { level: 'low', notes: [] }, source: "Polysaccharide (mannose acétylé) principal actif du gel d'aloe vera" },
  {
    id: 'aloine',
    name: 'Aloïne',
    formula: 'C21H22O9',
    category: 'derived-component',
    function: ['laxatif (usage interne uniquement)'],
    color: '#8a6d3b',
    safety: { level: 'caution', notes: ["Irritant cutané et photosensibilisant — à exclure des formulations topiques", 'Usage interne réglementé, hors scope cosmétique'] },
    source: "Composé anthraquinonique présent dans le latex (pas le gel), doit être écarté par filtration",
  },
  { id: 'eau', name: 'Eau', formula: 'H2O', category: 'pure-compound', function: ['solvant', 'base'], phRange: [7, 7], color: '#bcd9ec', safety: { level: 'low', notes: [] }, source: 'Composé de référence, base de quasi toutes les formulations' },
  { id: 'fructose', name: 'Fructose', formula: 'C6H12O6', category: 'derived-component', function: ['humectant'], color: '#f7f2e0', safety: { level: 'low', notes: [] }, source: 'Sucre simple, composant majoritaire du miel' },
  { id: 'glucose', name: 'Glucose', formula: 'C6H12O6', category: 'derived-component', function: ['humectant'], color: '#f7f2e0', safety: { level: 'low', notes: [] }, source: 'Sucre simple, composant majoritaire du miel' },
  { id: 'acide-gluconique', name: 'Acide gluconique', formula: 'C6H12O7', category: 'derived-component', function: ['régulateur de pH', 'chélatant'], phRange: [2.5, 3.5], color: '#eee6c9', safety: { level: 'low', notes: [] }, source: 'Produit d\'oxydation du glucose par le miel (glucose oxydase)' },
  { id: 'acide-oleique', name: 'Acide oléique', formula: 'C18H34O2', category: 'derived-component', function: ['émollient'], color: '#f0e2b6', safety: { level: 'low', notes: ['Comédogène chez certains profils de peau'] }, source: 'Acide gras mono-insaturé, fraction majeure du beurre de karité' },
  { id: 'acide-stearique', name: 'Acide stéarique', formula: 'C18H36O2', category: 'derived-component', function: ['émulsifiant', 'texturant'], color: '#f5f0e0', safety: { level: 'low', notes: [] }, source: 'Acide gras saturé, fraction majeure du beurre de karité' },
  { id: 'insaponifiables', name: 'Insaponifiables (vitamines A/E)', category: 'derived-component', function: ['antioxydant', 'régénérant'], color: '#e8c46a', safety: { level: 'low', notes: [] }, source: 'Fraction non saponifiable du beurre de karité, riche en tocophérols et caroténoïdes' },
  {
    id: 'linalol',
    name: 'Linalol',
    formula: 'C10H18O',
    category: 'derived-component',
    function: ['parfum'],
    color: '#cfc0e8',
    safety: { level: 'moderate', notes: ['Allergène de contact reconnu, s\'oxyde à l\'air et devient plus sensibilisant avec le temps'] },
    source: 'Alcool terpénique majoritaire de la lavande',
  },
  {
    id: 'acetate-de-linalyle',
    name: 'Acétate de linalyle',
    formula: 'C12H20O2',
    category: 'derived-component',
    function: ['parfum'],
    color: '#c7b8e0',
    safety: { level: 'moderate', notes: ['Allergène de contact possible à forte concentration'] },
    source: 'Ester terpénique, second composant majoritaire de la lavande',
  },
  {
    id: 'acide-acetique',
    name: 'Acide acétique',
    formula: 'C2H4O2',
    category: 'derived-component',
    function: ['régulateur de pH', 'antibactérien'],
    phRange: [2.4, 3],
    color: '#e8dca0',
    safety: { level: 'moderate', notes: ['Irritant et corrosif à haute concentration — usage cosmétique uniquement très dilué'] },
    source: "Composant acide principal du vinaigre, ~4-6% dans le vinaigre de cidre",
  },
  { id: 'pectine', name: 'Pectine', category: 'derived-component', function: ['texturant', 'gélifiant'], color: '#ead9a8', safety: { level: 'low', notes: [] }, source: 'Polysaccharide présent en traces dans le vinaigre de cidre, issu de la pomme' },
  { id: 'silice', name: 'Silice', formula: 'SiO2', category: 'derived-component', function: ['absorbant', 'texturant'], color: '#dcd8cf', safety: { level: 'low', notes: [] }, source: "Composant minéral majoritaire de l'argile verte" },
  { id: 'oxydes-de-fer', name: 'Oxydes de fer', category: 'derived-component', function: ['colorant minéral'], color: '#8a9a6b', safety: { level: 'low', notes: [] }, source: "Responsables de la teinte verte/ocre de l'argile" },

  // --- Composés purs de formulation ---
  { id: 'glycerine', name: 'Glycérine', formula: 'C3H8O3', inciName: 'Glycerin', category: 'pure-compound', function: ['humectant'], phRange: [5, 7], color: '#eaf4fa', safety: { level: 'low', notes: [] }, source: "Ingrédient de formulation standard, GRAS, très bien toléré" },
  {
    id: 'acide-citrique',
    name: 'Acide citrique',
    formula: 'C6H8O7',
    inciName: 'Citric Acid',
    category: 'pure-compound',
    function: ['régulateur de pH', 'chélatant'],
    phRange: [2, 3],
    color: '#f5f2c8',
    safety: { level: 'moderate', notes: ['Irritant à forte concentration non tamponnée'] },
    source: 'Acide alpha-hydroxylé faible, très utilisé pour ajuster le pH final des formules',
  },
  {
    id: 'alcool-cetylique',
    name: 'Alcool cétylique',
    formula: 'C16H34O',
    inciName: 'Cetyl Alcohol',
    category: 'pure-compound',
    function: ['émulsifiant', 'épaississant'],
    color: '#f7f5f0',
    safety: { level: 'low', notes: ["Alcool gras, non desséchant, à ne pas confondre avec l'éthanol"] },
    source: 'Alcool gras saturé courant en émulsion cosmétique',
  },
  {
    id: 'tocopherol',
    name: 'Vitamine E (Tocophérol)',
    formula: 'C29H50O2',
    inciName: 'Tocopherol',
    category: 'pure-compound',
    function: ['antioxydant', 'conservateur naturel'],
    color: '#d9b95c',
    safety: { level: 'low', notes: [] },
    source: 'Antioxydant liposoluble, protège les huiles de la formule contre le rancissement',
  },
  {
    id: 'acide-hyaluronique',
    name: 'Acide hyaluronique',
    category: 'pure-compound',
    function: ['humectant', 'hydratant'],
    color: '#d6ecf7',
    safety: { level: 'low', notes: [] },
    source: 'Polysaccharide de haut poids moléculaire, agit en surface (film hydratant)',
  },
]

export const CATEGORY_LABELS: Record<CompoundCategory, string> = {
  'raw-natural': 'Extrait naturel brut',
  'pure-compound': 'Composé pur de formulation',
  'derived-component': 'Composant dérivé',
}

export const SAFETY_LABELS: Record<SafetyLevel, string> = {
  low: 'Faible risque',
  moderate: 'Risque modéré',
  caution: 'Prudence requise',
}

export const SAFETY_COLORS: Record<SafetyLevel, string> = {
  low: '#7fd1ae',
  moderate: '#f2b880',
  caution: '#e07a5f',
}
