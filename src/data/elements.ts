export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown'

export type MatterState = 'solid' | 'liquid' | 'gas' | 'unknown'

export interface ChemicalElement {
  number: number
  symbol: string
  name: string
  mass: number
  category: ElementCategory
  period: number
  gridRow: number
  gridColumn: number
  radioactive?: boolean
  state: MatterState
}

type RawElement = Omit<ChemicalElement, 'state'>

const el = (
  number: number,
  symbol: string,
  name: string,
  mass: number,
  category: ElementCategory,
  period: number,
  gridRow: number,
  gridColumn: number,
  radioactive = false,
): RawElement => ({ number, symbol, name, mass, category, period, gridRow, gridColumn, radioactive })

const GAS_NUMBERS = new Set([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86])
const LIQUID_NUMBERS = new Set([35, 80])
// Éléments synthétiques/trop rares pour qu'un état de la matière ait jamais été observé en quantité macroscopique
const UNKNOWN_STATE_NUMBERS = new Set([
  87, 85, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118,
])

function withState(raw: RawElement): ChemicalElement {
  const state: MatterState = GAS_NUMBERS.has(raw.number)
    ? 'gas'
    : LIQUID_NUMBERS.has(raw.number)
      ? 'liquid'
      : UNKNOWN_STATE_NUMBERS.has(raw.number)
        ? 'unknown'
        : 'solid'
  return { ...raw, state }
}

const RAW_ELEMENTS: RawElement[] = [
  el(1, 'H', 'Hydrogène', 1.008, 'nonmetal', 1, 1, 1),
  el(2, 'He', 'Hélium', 4.003, 'noble-gas', 1, 1, 18),

  el(3, 'Li', 'Lithium', 6.94, 'alkali-metal', 2, 2, 1),
  el(4, 'Be', 'Béryllium', 9.012, 'alkaline-earth-metal', 2, 2, 2),
  el(5, 'B', 'Bore', 10.81, 'metalloid', 2, 2, 13),
  el(6, 'C', 'Carbone', 12.011, 'nonmetal', 2, 2, 14),
  el(7, 'N', 'Azote', 14.007, 'nonmetal', 2, 2, 15),
  el(8, 'O', 'Oxygène', 15.999, 'nonmetal', 2, 2, 16),
  el(9, 'F', 'Fluor', 18.998, 'halogen', 2, 2, 17),
  el(10, 'Ne', 'Néon', 20.18, 'noble-gas', 2, 2, 18),

  el(11, 'Na', 'Sodium', 22.99, 'alkali-metal', 3, 3, 1),
  el(12, 'Mg', 'Magnésium', 24.305, 'alkaline-earth-metal', 3, 3, 2),
  el(13, 'Al', 'Aluminium', 26.982, 'post-transition-metal', 3, 3, 13),
  el(14, 'Si', 'Silicium', 28.085, 'metalloid', 3, 3, 14),
  el(15, 'P', 'Phosphore', 30.974, 'nonmetal', 3, 3, 15),
  el(16, 'S', 'Soufre', 32.06, 'nonmetal', 3, 3, 16),
  el(17, 'Cl', 'Chlore', 35.45, 'halogen', 3, 3, 17),
  el(18, 'Ar', 'Argon', 39.948, 'noble-gas', 3, 3, 18),

  el(19, 'K', 'Potassium', 39.098, 'alkali-metal', 4, 4, 1),
  el(20, 'Ca', 'Calcium', 40.078, 'alkaline-earth-metal', 4, 4, 2),
  el(21, 'Sc', 'Scandium', 44.956, 'transition-metal', 4, 4, 3),
  el(22, 'Ti', 'Titane', 47.867, 'transition-metal', 4, 4, 4),
  el(23, 'V', 'Vanadium', 50.942, 'transition-metal', 4, 4, 5),
  el(24, 'Cr', 'Chrome', 51.996, 'transition-metal', 4, 4, 6),
  el(25, 'Mn', 'Manganèse', 54.938, 'transition-metal', 4, 4, 7),
  el(26, 'Fe', 'Fer', 55.845, 'transition-metal', 4, 4, 8),
  el(27, 'Co', 'Cobalt', 58.933, 'transition-metal', 4, 4, 9),
  el(28, 'Ni', 'Nickel', 58.693, 'transition-metal', 4, 4, 10),
  el(29, 'Cu', 'Cuivre', 63.546, 'transition-metal', 4, 4, 11),
  el(30, 'Zn', 'Zinc', 65.38, 'transition-metal', 4, 4, 12),
  el(31, 'Ga', 'Gallium', 69.723, 'post-transition-metal', 4, 4, 13),
  el(32, 'Ge', 'Germanium', 72.63, 'metalloid', 4, 4, 14),
  el(33, 'As', 'Arsenic', 74.922, 'metalloid', 4, 4, 15),
  el(34, 'Se', 'Sélénium', 78.971, 'nonmetal', 4, 4, 16),
  el(35, 'Br', 'Brome', 79.904, 'halogen', 4, 4, 17),
  el(36, 'Kr', 'Krypton', 83.798, 'noble-gas', 4, 4, 18),

  el(37, 'Rb', 'Rubidium', 85.468, 'alkali-metal', 5, 5, 1),
  el(38, 'Sr', 'Strontium', 87.62, 'alkaline-earth-metal', 5, 5, 2),
  el(39, 'Y', 'Yttrium', 88.906, 'transition-metal', 5, 5, 3),
  el(40, 'Zr', 'Zirconium', 91.224, 'transition-metal', 5, 5, 4),
  el(41, 'Nb', 'Niobium', 92.906, 'transition-metal', 5, 5, 5),
  el(42, 'Mo', 'Molybdène', 95.95, 'transition-metal', 5, 5, 6),
  el(43, 'Tc', 'Technétium', 98, 'transition-metal', 5, 5, 7, true),
  el(44, 'Ru', 'Ruthénium', 101.07, 'transition-metal', 5, 5, 8),
  el(45, 'Rh', 'Rhodium', 102.906, 'transition-metal', 5, 5, 9),
  el(46, 'Pd', 'Palladium', 106.42, 'transition-metal', 5, 5, 10),
  el(47, 'Ag', 'Argent', 107.868, 'transition-metal', 5, 5, 11),
  el(48, 'Cd', 'Cadmium', 112.414, 'transition-metal', 5, 5, 12),
  el(49, 'In', 'Indium', 114.818, 'post-transition-metal', 5, 5, 13),
  el(50, 'Sn', 'Étain', 118.71, 'post-transition-metal', 5, 5, 14),
  el(51, 'Sb', 'Antimoine', 121.76, 'metalloid', 5, 5, 15),
  el(52, 'Te', 'Tellure', 127.6, 'metalloid', 5, 5, 16),
  el(53, 'I', 'Iode', 126.904, 'halogen', 5, 5, 17),
  el(54, 'Xe', 'Xénon', 131.293, 'noble-gas', 5, 5, 18),

  el(55, 'Cs', 'Césium', 132.905, 'alkali-metal', 6, 6, 1),
  el(56, 'Ba', 'Baryum', 137.327, 'alkaline-earth-metal', 6, 6, 2),
  el(57, 'La', 'Lanthane', 138.905, 'lanthanide', 6, 6, 3),
  el(72, 'Hf', 'Hafnium', 178.49, 'transition-metal', 6, 6, 4),
  el(73, 'Ta', 'Tantale', 180.948, 'transition-metal', 6, 6, 5),
  el(74, 'W', 'Tungstène', 183.84, 'transition-metal', 6, 6, 6),
  el(75, 'Re', 'Rhénium', 186.207, 'transition-metal', 6, 6, 7),
  el(76, 'Os', 'Osmium', 190.23, 'transition-metal', 6, 6, 8),
  el(77, 'Ir', 'Iridium', 192.217, 'transition-metal', 6, 6, 9),
  el(78, 'Pt', 'Platine', 195.085, 'transition-metal', 6, 6, 10),
  el(79, 'Au', 'Or', 196.967, 'transition-metal', 6, 6, 11),
  el(80, 'Hg', 'Mercure', 200.592, 'transition-metal', 6, 6, 12),
  el(81, 'Tl', 'Thallium', 204.38, 'post-transition-metal', 6, 6, 13),
  el(82, 'Pb', 'Plomb', 207.2, 'post-transition-metal', 6, 6, 14),
  el(83, 'Bi', 'Bismuth', 208.98, 'post-transition-metal', 6, 6, 15),
  el(84, 'Po', 'Polonium', 209, 'metalloid', 6, 6, 16, true),
  el(85, 'At', 'Astate', 210, 'halogen', 6, 6, 17, true),
  el(86, 'Rn', 'Radon', 222, 'noble-gas', 6, 6, 18, true),

  el(87, 'Fr', 'Francium', 223, 'alkali-metal', 7, 7, 1, true),
  el(88, 'Ra', 'Radium', 226, 'alkaline-earth-metal', 7, 7, 2, true),
  el(89, 'Ac', 'Actinium', 227, 'actinide', 7, 7, 3, true),
  el(104, 'Rf', 'Rutherfordium', 267, 'transition-metal', 7, 7, 4, true),
  el(105, 'Db', 'Dubnium', 268, 'transition-metal', 7, 7, 5, true),
  el(106, 'Sg', 'Seaborgium', 269, 'transition-metal', 7, 7, 6, true),
  el(107, 'Bh', 'Bohrium', 270, 'transition-metal', 7, 7, 7, true),
  el(108, 'Hs', 'Hassium', 269, 'transition-metal', 7, 7, 8, true),
  el(109, 'Mt', 'Meitnérium', 278, 'unknown', 7, 7, 9, true),
  el(110, 'Ds', 'Darmstadtium', 281, 'unknown', 7, 7, 10, true),
  el(111, 'Rg', 'Roentgenium', 282, 'unknown', 7, 7, 11, true),
  el(112, 'Cn', 'Copernicium', 285, 'transition-metal', 7, 7, 12, true),
  el(113, 'Nh', 'Nihonium', 286, 'post-transition-metal', 7, 7, 13, true),
  el(114, 'Fl', 'Flérovium', 289, 'post-transition-metal', 7, 7, 14, true),
  el(115, 'Mc', 'Moscovium', 290, 'post-transition-metal', 7, 7, 15, true),
  el(116, 'Lv', 'Livermorium', 293, 'post-transition-metal', 7, 7, 16, true),
  el(117, 'Ts', 'Tennesse', 294, 'halogen', 7, 7, 17, true),
  el(118, 'Og', 'Oganesson', 294, 'noble-gas', 7, 7, 18, true),

  // Lanthanides Ce-Lu (bloc f, période 6)
  el(58, 'Ce', 'Cérium', 140.116, 'lanthanide', 6, 9, 4),
  el(59, 'Pr', 'Praséodyme', 140.908, 'lanthanide', 6, 9, 5),
  el(60, 'Nd', 'Néodyme', 144.242, 'lanthanide', 6, 9, 6),
  el(61, 'Pm', 'Prométhium', 145, 'lanthanide', 6, 9, 7, true),
  el(62, 'Sm', 'Samarium', 150.36, 'lanthanide', 6, 9, 8),
  el(63, 'Eu', 'Europium', 151.964, 'lanthanide', 6, 9, 9),
  el(64, 'Gd', 'Gadolinium', 157.25, 'lanthanide', 6, 9, 10),
  el(65, 'Tb', 'Terbium', 158.925, 'lanthanide', 6, 9, 11),
  el(66, 'Dy', 'Dysprosium', 162.5, 'lanthanide', 6, 9, 12),
  el(67, 'Ho', 'Holmium', 164.93, 'lanthanide', 6, 9, 13),
  el(68, 'Er', 'Erbium', 167.259, 'lanthanide', 6, 9, 14),
  el(69, 'Tm', 'Thulium', 168.934, 'lanthanide', 6, 9, 15),
  el(70, 'Yb', 'Ytterbium', 173.045, 'lanthanide', 6, 9, 16),
  el(71, 'Lu', 'Lutécium', 174.967, 'lanthanide', 6, 9, 17),

  // Actinides Th-Lr (bloc f, période 7)
  el(90, 'Th', 'Thorium', 232.038, 'actinide', 7, 10, 4, true),
  el(91, 'Pa', 'Protactinium', 231.036, 'actinide', 7, 10, 5, true),
  el(92, 'U', 'Uranium', 238.029, 'actinide', 7, 10, 6, true),
  el(93, 'Np', 'Neptunium', 237, 'actinide', 7, 10, 7, true),
  el(94, 'Pu', 'Plutonium', 244, 'actinide', 7, 10, 8, true),
  el(95, 'Am', 'Américium', 243, 'actinide', 7, 10, 9, true),
  el(96, 'Cm', 'Curium', 247, 'actinide', 7, 10, 10, true),
  el(97, 'Bk', 'Berkélium', 247, 'actinide', 7, 10, 11, true),
  el(98, 'Cf', 'Californium', 251, 'actinide', 7, 10, 12, true),
  el(99, 'Es', 'Einsteinium', 252, 'actinide', 7, 10, 13, true),
  el(100, 'Fm', 'Fermium', 257, 'actinide', 7, 10, 14, true),
  el(101, 'Md', 'Mendélévium', 258, 'actinide', 7, 10, 15, true),
  el(102, 'No', 'Nobélium', 259, 'actinide', 7, 10, 16, true),
  el(103, 'Lr', 'Lawrencium', 266, 'actinide', 7, 10, 17, true),
]

export const ELEMENTS: ChemicalElement[] = RAW_ELEMENTS.map(withState).sort((a, b) => a.number - b.number)

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali-metal': 'Métal alcalin',
  'alkaline-earth-metal': 'Métal alcalino-terreux',
  'transition-metal': 'Métal de transition',
  'post-transition-metal': 'Métal pauvre',
  metalloid: 'Métalloïde',
  nonmetal: 'Non-métal',
  halogen: 'Halogène',
  'noble-gas': 'Gaz noble',
  lanthanide: 'Lanthanide',
  actinide: 'Actinide',
  unknown: 'Propriétés inconnues',
}

export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  'alkali-metal': '#e07a5f',
  'alkaline-earth-metal': '#f2b880',
  'transition-metal': '#4a90d9',
  'post-transition-metal': '#6fb3b8',
  metalloid: '#8dbf7c',
  nonmetal: '#7fd1ae',
  halogen: '#d9c14a',
  'noble-gas': '#a893d9',
  lanthanide: '#d97ab0',
  actinide: '#c96a6a',
  unknown: '#5c6472',
}

export const STATE_COLORS: Record<MatterState, string> = {
  solid: '#c9cdd6',
  liquid: '#4a90d9',
  gas: '#a893d9',
  unknown: '#5c6472',
}
