import type { KeyboardKey, KeyboardLayout, KeyboardType } from "@/types";

export const tabs: { label: string; type: KeyboardType }[] = [
  { label: "בסיסי", type: "basic" }, // basic + logic + differential
  { label: "גיאומטריה", type: "geometry" }, // geometry + others
  { label: "עברית", type: "hebrew" },
  { label: "אנגלית", type: "english" },
];
export const pattern = {
  superscriptRight: () => (
    <svg viewBox="0 0 35 50" width="100%" height="100%" className="text-white" aria-hidden="true">
      <rect x="0" y="16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} />
      <rect x="22" y="10" width="10" height="10" fill="currentColor" />
    </svg>
  ),
  subscriptRight: () => (
    <svg viewBox="0 0 35 50" width="100%" height="100%" className="text-white" aria-hidden="true">
      <rect x="0" y="16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} />
      <rect x="22" y="28" width="10" height="10" fill="currentColor" />
    </svg>
  ),
  subSupRight: () => (
    <svg viewBox="0 0 35 50" width="100%" height="100%" className="text-white" aria-hidden="true">
      <rect x="0" y="16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} />
      <rect x="22" y="10" width="10" height="10" fill="currentColor" />
      <rect x="22" y="28" width="10" height="10" fill="currentColor" />
    </svg>
  ),
  mixedFraction: () => (
    <svg viewBox="0 0 40 50" width="100%" height="100%" className="text-white" aria-hidden="true">
      <rect x="2" y="15" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={3} />
      <rect x="22" y="5" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={3} />
      <line x1="22" y1="25" x2="36" y2="25" stroke="currentColor" strokeWidth={3} />
      <rect
        x="22"
        y="31"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
      />
    </svg>
  ),
  simpleFraction: () => (
    <svg viewBox="0 0 30 50" width="100%" height="100%" className="text-white" aria-hidden="true">
      <rect x="8" y="5" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={3} />
      <line x1="8" y1="25" x2="22" y2="25" stroke="currentColor" strokeWidth={3} />
      <rect x="8" y="31" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={3} />
    </svg>
  ),
  sigmaBounds: () => (
    <svg viewBox="0 0 35 50" width="100%" height="100%" className="text-white" aria-hidden="true">
      <text x="0" y="36" fontSize="38" fill="currentColor">
        Σ
      </text>
      <rect x="22" y="10" width="10" height="10" fill="currentColor" />
      <rect x="22" y="28" width="10" height="10" fill="currentColor" />
    </svg>
  ),
  integralBounds: () => (
    <svg viewBox="0 0 35 50" width="100%" height="100%" className="text-white" aria-hidden="true">
      <text x="4" y="38" fontSize="40" fill="currentColor">
        ∫
      </text>
      <rect x="22" y="10" width="10" height="10" fill="currentColor" />
      <rect x="22" y="28" width="10" height="10" fill="currentColor" />
    </svg>
  ),
  limToInfPlus: () => (
    <svg viewBox="0 0 70 28" width="100%" height="100%" className="text-white" aria-hidden="true">
      <text x="0" y="18" fontSize="16" fill="currentColor">
        lim
      </text>
      <text x="6" y="26" fontSize="10" fill="currentColor">
        x→∞
      </text>
      <text x="30" y="26" fontSize="10" fill="currentColor">
        ⁺
      </text>
    </svg>
  ),
  limToInfMinus: () => (
    <svg viewBox="0 0 70 28" width="100%" height="100%" className="text-white" aria-hidden="true">
      <text x="0" y="18" fontSize="16" fill="currentColor">
        lim
      </text>
      <text x="6" y="26" fontSize="10" fill="currentColor">
        x→∞
      </text>
      <text x="30" y="26" fontSize="10" fill="currentColor">
        ⁻
      </text>
    </svg>
  ),
  limToZeroPlus: () => (
    <svg viewBox="0 0 70 28" width="100%" height="100%" className="text-white" aria-hidden="true">
      <text x="0" y="18" fontSize="16" fill="currentColor">
        lim
      </text>
      <text x="6" y="26" fontSize="10" fill="currentColor">
        x→0
      </text>
      <text x="26" y="26" fontSize="10" fill="currentColor">
        ⁺
      </text>
    </svg>
  ),
  limToZeroMinus: () => (
    <svg viewBox="0 0 70 28" width="100%" height="100%" className="text-white" aria-hidden="true">
      <text x="0" y="18" fontSize="16" fill="currentColor">
        lim
      </text>
      <text x="6" y="26" fontSize="10" fill="currentColor">
        x→0
      </text>
      <text x="26" y="26" fontSize="10" fill="currentColor">
        ⁻
      </text>
    </svg>
  ),
  limGeneric: () => (
    <svg viewBox="0 0 70 28" width="100%" height="100%" className="text-white" aria-hidden="true">
      <text x="0" y="18" fontSize="16" fill="currentColor">
        lim
      </text>
      <rect x="6" y="18" width="8" height="8" fill="none" stroke="currentColor" strokeWidth={1.5} />
      <text x="16" y="26" fontSize="10" fill="currentColor">
        →
      </text>
      <rect
        x="24"
        y="18"
        width="8"
        height="8"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  ),
};

export const keyboards: Record<KeyboardType, KeyboardLayout> = {
  // ───────────────── basic = basic + logic + differntial ─────────────────
  basic: {
    label: "basic",
    rows: [
      // --- basic (הקיים) ---
      [
        { value: "(", width: 0.8 },
        { value: ")", width: 0.8 },
        { value: "!", width: 0.8 },
        { value: ",", width: 0.8 },
        { value: ";", width: 0.8 },
        { value: "|", width: 0.8 },
      ],
      [
        { value: "=", width: 0.9 },
        { value: "≠", width: 0.9 },
        { value: "±", width: 0.9 },
        { value: "<", width: 0.9 },
        { value: ">", width: 0.9 },
        { value: "≤", width: 0.9 },
        { value: "≥", width: 0.9 },
      ],
      [
        { value: "x" },
        { value: "y" },
        { value: "z" },
        { value: "∞" },
        { value: "%" },
        { value: "π", width: 0.9 },
      ],
      [
        { value: "²", label: "□²", width: 0.95 },
        { value: "³", label: "□³", width: 0.95 },
        { value: "^", label: "□▘", width: 0.95 },
        { value: "□▖", render: pattern.subscriptRight(), width: 0.95 },
        { value: "√", width: 0.95 },
        { value: "▝√", width: 0.95 },
        { value: "──", render: pattern.simpleFraction(), width: 0.95 },
        { value: "□─", render: pattern.mixedFraction(), width: 0.95 },
      ],

      // --- logic (נוסף) ---
      [
        { value: "7", width: 0.7 },
        { value: "8", width: 0.7 },
        { value: "9", width: 0.7 },
        { value: "∈" },
        { value: "∉" },
        { value: "∅" },
        { value: "⊂" },
        { value: "⊃" },
        { value: "⊆" },
        { value: "⊇" },
      ],
      [
        { value: "4", width: 0.7 },
        { value: "5", width: 0.7 },
        { value: "6", width: 0.7 },
        { value: "∪" },
        { value: "∩" },
        { value: "∀" },
        { value: "∃" },
        { value: "¬" },
        { value: "⇒" },
        { value: "⇔" },
      ],
      [
        { value: "1", width: 0.7 },
        { value: "2", width: 0.7 },
        { value: "3", width: 0.7 },
        { value: "⊢" },
        { value: "⊨" },
        { value: "⊕" },
        { value: "⊗" },
        { value: "⊙" },
      ],

      // --- differntial (נוסף) ---
      [
        { value: "f(x)" },
        { value: "f'(x)" },
        { value: 'f"(x)' },
        { value: "f▘(x)", width: 1.2 },
        { value: "|x|" },
        { value: "∞" },
        { value: "n" },
        { value: "e" },
        { value: "eˣ", display: "e▘" },
      ],
      [
        { value: "∫" },
        { value: "∫ ▖▘", render: pattern.integralBounds() },
        { value: "dx" },
        { value: "dy" },
        { value: "dt" },
      ],
      [
        { value: "∑▖▘", render: pattern.sigmaBounds() },
        { value: "ln" },
        { value: "log" },
        { value: "log₂", display: "log₂" },
        { value: "logx_x", display: "logₐ(x)" },
      ],
      [
        {
          value: "lim_x_to_infplus",
          render: pattern.limToInfPlus(),
          width: 1.3,
        },
        {
          value: "lim_x_to_infminus",
          render: pattern.limToInfMinus(),
          width: 1.3,
        },
        {
          value: "lim_x_to_zeroplus",
          render: pattern.limToZeroPlus(),
          width: 1.3,
        },
        {
          value: "lim_x_to_zerominus",
          render: pattern.limToZeroMinus(),
          width: 1.3,
        },
        { value: "lim_x_to_x", render: pattern.limGeneric(), width: 1.3 },
      ],
    ],
  },

  // ───────────── geometry = geometry + others (השאר כרטיסיה שנייה) ─────────────
  geometry: {
    label: "geometry",
    rows: [
      // --- geometry (הקיים) ---
      [
        { value: "(", width: 0.8 },
        { value: ")", width: 0.8 },
        { value: "∢", width: 0.9 },
        { value: "∟", width: 0.9 },
        { value: "⟂", width: 0.9 },
        { value: "∥", width: 0.9 },
        { value: "□▖", render: pattern.subscriptRight(), width: 0.9 },
        { value: "≅", width: 0.9 },
        { value: "∼", width: 0.9 },
        { value: "△", width: 0.9 },
        { value: "◯", width: 0.9 },
        { value: "□", width: 0.9 },
        { value: "°", width: 0.9 },
        { value: "π", width: 0.9 },
        { value: "⇓", width: 0.9 },
      ],
      [
        { value: "α", width: 1 },
        { value: "β", width: 1 },
        { value: "γ", width: 1 },
        { value: "δ", width: 1 },
        { value: "θ", width: 1 },
        { value: "φ", width: 1 },
        { value: "Δ", width: 1 },
        { value: "sin(", display: "sin", width: 1.1 },
        { value: "cos(", display: "cos", width: 1.1 },
        { value: "tan(", display: "tan", width: 1.1 },
      ],
      [
        { value: "cot(", display: "cot", width: 1.1 },
        { value: "sec(", display: "sec", width: 1.1 },
        { value: "csc(", display: "csc", width: 1.1 },
        { value: "arcsin(", display: "arcsin", width: 1.2 },
        { value: "arccos(", display: "arccos", width: 1.25 },
        { value: "arctan(", display: "arctan", width: 1.25 },
        { value: "arccot(", display: "arccot", width: 1.25 },
      ],
      [
        { value: "arcsin⁻¹(", display: "arcsin⁻¹", width: 1.2 },
        { value: "arccos⁻¹(", display: "arccos⁻¹", width: 1.2 },
        { value: "sinh(", display: "sinh", width: 1.1 },
        { value: "cosh(", display: "cosh", width: 1.1 },
        { value: "tanh(", display: "tanh", width: 1.1 },
      ],

      // --- others (נוסף) ---
      [
        { value: "\\mathbb{N}", display: "ℕ" },
        { value: "\\mathbb{Z}", display: "ℤ" },
        { value: "\\mathbb{Q}", display: "ℚ" },
        { value: "\\mathbb{R}", display: "ℝ" },
        { value: "\\mathbb{C}", display: "ℂ" },
      ],
      [
        { value: "∑" },
        { value: "∏" },
        {
          value: "──",
          render: (
            <span className="leading-none">
              <span className="block">▄</span>
              <span className="block">──</span>
              <span className="block">▀</span>
            </span>
          ),
          width: 0.9,
        },
      ],
    ],
  },

  // ───────────── hebrew ─────────────
  hebrew: {
    label: "hebrew",
    rows: [
      [
        { value: "א", width: 1 },
        { value: "ב", width: 1 },
        { value: "ג", width: 1 },
        { value: "ד", width: 1 },
        { value: "ה", width: 1 },
        { value: "ו", width: 1 },
        { value: "ז", width: 1 },
        { value: "ח", width: 1 },
        { value: "ט", width: 1 },
      ],
      [
        { value: "י", width: 1 },
        { value: "כ", width: 1 },
        { value: "ך", width: 1 },
        { value: "ל", width: 1 },
        { value: "מ", width: 1 },
        { value: "ם", width: 1 },
        { value: "נ", width: 1 },
        { value: "ן", width: 1 },
        { value: "ס", width: 1 },
      ],
      [
        { value: "ע", width: 1 },
        { value: "פ", width: 1 },
        { value: "ף", width: 1 },
        { value: "צ", width: 1 },
        { value: "ץ", width: 1 },
        { value: "ק", width: 1 },
        { value: "ר", width: 1 },
        { value: "ש", width: 1 },
        { value: "ת", width: 1 },
      ],
    ],
  },

  // ───────────── english ─────────────
  english: {
    label: "english",
    rows: [
      [
        { value: "q", width: 1 },
        { value: "w", width: 1 },
        { value: "e", width: 1 },
        { value: "r", width: 1 },
        { value: "t", width: 1 },
        { value: "y", width: 1 },
        { value: "u", width: 1 },
        { value: "i", width: 1 },
        { value: "o", width: 1 },
        { value: "p", width: 1 },
      ],
      [
        { value: "a", width: 1 },
        { value: "s", width: 1 },
        { value: "d", width: 1 },
        { value: "f", width: 1 },
        { value: "g", width: 1 },
        { value: "h", width: 1 },
        { value: "j", width: 1 },
        { value: "k", width: 1 },
        { value: "l", width: 1 },
      ],
      [
        { value: "z", width: 1 },
        { value: "x", width: 1 },
        { value: "c", width: 1 },
        { value: "v", width: 1 },
        { value: "b", width: 1 },
        { value: "n", width: 1 },
        { value: "m", width: 1 },
      ],
    ],
  },

  // ───────────── logic ─────────────
  logic: {
    label: "logic",
    rows: [
      [
        { value: "∧", display: "∧", width: 1 },
        { value: "∨", display: "∨", width: 1 },
        { value: "¬", display: "¬", width: 1 },
        { value: "→", display: "→", width: 1 },
        { value: "↔", display: "↔", width: 1 },
        { value: "∀", display: "∀", width: 1 },
        { value: "∃", display: "∃", width: 1 },
      ],
      [
        { value: "⊤", display: "⊤", width: 1 },
        { value: "⊥", display: "⊥", width: 1 },
        { value: "⊢", display: "⊢", width: 1 },
        { value: "⊨", display: "⊨", width: 1 },
      ],
    ],
  },

  // ───────────── differntial ─────────────
  differntial: {
    label: "differntial",
    rows: [
      [
        { value: "∫", display: "∫", width: 1 },
        { value: "∂", display: "∂", width: 1 },
        { value: "d", display: "d", width: 1 },
        { value: "'", display: "'", width: 1 },
        { value: "''", display: "''", width: 1 },
      ],
    ],
  },

  // ───────────── others ─────────────
  others: {
    label: "others",
    rows: [
      [
        { value: "∞", display: "∞", width: 1 },
        { value: "±", display: "±", width: 1 },
        { value: "∓", display: "∓", width: 1 },
      ],
    ],
  },
};

export function keyToLatex(key: string): {
  latex?: string;
  placeholders?: boolean;
  insertText?: string;
} {
  // Symbols directly supported by KaTeX command or unicode:
  const simpleMap: Record<string, string> = {
    π: "\\pi",
    "∞": "\\infty",
    "±": "\\pm",
    "≤": "\\leq",
    "≥": "\\geq",
    "≠": "\\neq",
    "×": "\\times",
    "÷": "\\div",
    "∈": "\\in",
    "∉": "\\notin",
    "∅": "\\emptyset",
    "⊂": "\\subset",
    "⊃": "\\supset",
    "⊆": "\\subseteq",
    "⊇": "\\supseteq",
    "∪": "\\cup",
    "∩": "\\cap",
    "∀": "\\forall",
    "∃": "\\exists",
    "¬": "\\neg",
    "⇒": "\\Rightarrow",
    "⇔": "\\Leftrightarrow",
    "⊢": "\\vdash",
    "⊨": "\\vDash",
    "⊕": "\\oplus",
    "⊗": "\\otimes",
    "⊙": "\\odot",
    "∑": "\\sum",
    "∏": "\\prod",
    "∟": "\\angle",
    "∢": "\\measuredangle",
    "⟂": "\\perp",
    "∥": "\\parallel",
    "°": "^{\\circ}",
    Δ: "\\Delta",
    α: "\\alpha",
    β: "\\beta",
    γ: "\\gamma",
    δ: "\\delta",
    θ: "\\theta",
    φ: "\\phi",
    Σ: "\\Sigma",
    "∫": "\\int",
    log: "\\log",
    ln: "\\ln",
    "|": "\\mid",
  };

  if (key in simpleMap) return { latex: simpleMap[key] };

  // Functions with parentheses
  if (/(sin|cos|tan|cot|sec|csc|arcsin|arccos|arctan|arccot|sinh|cosh|tanh)\($/.test(key)) {
    const fn = key.slice(0, -1);
    return { latex: `\\${fn}\\left(@\\right)`, placeholders: true };
  }

  // Special patterns
  switch (key) {
    case "²":
      return { latex: "^{2}", placeholders: false };
    case "³":
      return { latex: "^{3}", placeholders: false };
    case "^":
      return { latex: "^{@}", placeholders: true };
    case "□▖": // subscript
      return { latex: "_{@}", placeholders: true };
    case "√":
      return { latex: "\\sqrt{@}", placeholders: true };
    case "▝√":
      return { latex: "\\sqrt[@]{@}", placeholders: true };
    case "──": // fraction
      return { latex: "\\frac{@}{@}", placeholders: true };
    case "□─": // mixed fraction: a \frac{b}{c}
      return { latex: "@\\frac{@}{@}", placeholders: true };
    case "∑▖▘":
      return { latex: "\\sum_{@}^{@}", placeholders: true };
    case "∫ ▖▘":
      return { latex: "\\int_{@}^{@}", placeholders: true };
    case "f▘(x)":
      return { latex: "f^{@}(x)", placeholders: true };
    case "log₂":
      return { latex: "\\log_{2}\\left(@\\right)", placeholders: true };
    case "logx_x":
      return { latex: "\\log_{@}\\left(@\\right)", placeholders: true };
    case "eˣ":
      return { latex: "e^{@}", placeholders: true };
    case "lim_x_to_infplus":
      return {
        latex: "\\lim_{x\\to\\infty^{+}}\\left(@\\right)",
        placeholders: true,
      };
    case "lim_x_to_infminus":
      return {
        latex: "\\lim_{x\\to\\infty^{-}}\\left(@\\right)",
        placeholders: true,
      };
    case "lim_x_to_zeroplus":
      return {
        latex: "\\lim_{x\\to 0^{+}}\\left(@\\right)",
        placeholders: true,
      };
    case "lim_x_to_zerominus":
      return {
        latex: "\\lim_{x\\to 0^{-}}\\left(@\\right)",
        placeholders: true,
      };
    case "lim_x_to_x":
      return { latex: "\\lim_{@\\to @}\\left(@\\right)", placeholders: true };
    case "\\mathbb{N}":
    case "\\mathbb{Z}":
    case "\\mathbb{Q}":
    case "\\mathbb{R}":
    case "\\mathbb{C}":
      return { latex: key, placeholders: false };
    default:
      break;
  }

  return { insertText: key };
}

export const staticOpKeys: KeyboardKey[] = [
  {
    value: "+",
    label: "+",
    className: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  {
    value: "-",
    label: "-",
    className: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  {
    value: "×",
    label: "×",
    className: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  {
    value: "÷",
    label: "÷",
    className: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
];

export const specialTooltips: Record<string, string> = {
  "□▖": "משתנה עם אינדקס",
  "□▁□/□": "שבר מעורב",
  "□/□": "שבר פשוט",
  "√": "שורש",
  "▝√": "שורש מסומן",
  "²": "חזקה שנייה",
  "³": "חזקה שלישית",
  "^": "העלאה בחזקה",
  "──": "שבר",
  lim_x_to_infplus: "גבול כש-x שואף לאינסוף מימין",
  lim_x_to_infminus: "גבול כש-x שואף לאינסוף משמאל",
  lim_x_to_zeroplus: "גבול כש-x שואף ל-0 מימין",
  lim_x_to_zerominus: "גבול כש-x שואף ל-0 משמאל",
  lim_x_to_x: "גבול כללי",
  "∑▖▘": "סכום עם גבולות",
  "∫ ▖▘": "אינטגרל עם גבולות",
  "f▘(x)": "פונקציה עם חזקה",
  logx_x: "לוג לערך כללי",
  eˣ: "e בחזקה",
  "\\mathbb{N}": "המספרים הטבעיים",
  "\\mathbb{Z}": "המספרים השלמים",
  "\\mathbb{Q}": "המספרים הרציונליים",
  "\\mathbb{R}": "המספרים הממשיים",
  "\\mathbb{C}": "המספרים המרוכבים",
};

export const staticKeys: KeyboardKey[] = [
  { value: "=", width: 0.7 },
  { value: "\n", label: "⏎", width: 0.7 },
];

export const digitNumpadRows: (string | { value: string; width?: number })[][] = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [
    { value: "0", width: 2 },
    { value: ".", width: 1 },
  ],
];
