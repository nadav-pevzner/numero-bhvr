/** biome-ignore-all lint/a11y/useSemanticElements: for keyboard keys */

import type { KeyboardKey, KeyboardType } from "@/types";
import type React from "react";
import { memo, useCallback, useMemo } from "react";
import { KeyButton } from "./KeyButton";
import { keyboards, specialTooltips, staticKeys, staticOpKeys, tabs } from "./layouts";

interface KeyboardPanelProps {
  activeTab: KeyboardType;
  onTabChange: (tab: KeyboardType) => void;
  onKeyClick: (key: KeyboardKey) => void;
  onStaticAction: (value: string) => void;
  onCursorMove: (direction: "left" | "right") => void;
  onBackspace: () => void;
  onSpace: () => void;
  onEnterStructure: () => void;
  onExitPlaceholder: () => void;
  onNextPlaceholder: () => void;
  onPrevPlaceholder: () => void;
  onClearAll: () => void;
  hasStructures: boolean;
  activePlaceholder: {
    structureIndex: number;
    placeholderIndex: number;
  } | null;
  totalLength: number;
}

// Memoized tab button
const TabButton = memo<{
  type: KeyboardType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}>(({ label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 font-semibold border-b-2 -mb-0.5 transition ${
      isActive
        ? "text-indigo-600 border-indigo-600"
        : "text-slate-600 border-transparent hover:text-indigo-600"
    }`}
    aria-pressed={isActive}
  >
    {label}
  </button>
));
TabButton.displayName = "TabButton";

// Memoized number pad
const NumberPad = memo<{
  onKeyClick: (key: KeyboardKey) => void;
  onStaticAction: (value: string) => void;
}>(({ onKeyClick, onStaticAction }) => {
  const digits = useMemo(
    () => [
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-2">
      {digits.map((row, rowIdx) => (
        <div key={`digit-row-${rowIdx}`} className="flex gap-2">
          {row.map((digit) => (
            <KeyButton
              key={digit}
              k={{ value: digit }}
              onClick={() => onKeyClick({ value: digit })}
            />
          ))}
        </div>
      ))}
      <div className="flex gap-2">
        <KeyButton k={{ value: "0" }} onClick={() => onKeyClick({ value: "0" })} />
        <KeyButton k={{ value: "." }} onClick={() => onKeyClick({ value: "." })} />
        {staticKeys.map((k) => (
          <KeyButton
            key={`st-${k.label}`}
            k={k}
            tooltip={specialTooltips[k.value] || undefined}
            onClick={() => onStaticAction(k.value)}
          />
        ))}
      </div>
    </div>
  );
});
NumberPad.displayName = "NumberPad";

// Memoized operators column
const OperatorsColumn = memo<{
  onKeyClick: (key: KeyboardKey) => void;
}>(({ onKeyClick }) => (
  <div className="flex flex-col gap-2">
    {staticOpKeys.map((k) => (
      <KeyButton key={`op-${k.label}`} k={k} onClick={() => onKeyClick(k)} />
    ))}
  </div>
));
OperatorsColumn.displayName = "OperatorsColumn";

// Control button component
const ControlButton = memo<{
  onClick: () => void;
  disabled?: boolean;
  title: string;
  colorClass: string;
  children: React.ReactNode;
}>(({ onClick, disabled = false, title, colorClass, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-2 py-2 rounded-lg border font-semibold transition text-sm ${colorClass} disabled:opacity-50 disabled:cursor-not-allowed`}
    title={title}
  >
    {children}
  </button>
));
ControlButton.displayName = "ControlButton";

// Memoized control panel
const ControlPanel = memo<{
  onCursorMove: (direction: "left" | "right") => void;
  onBackspace: () => void;
  onSpace: () => void;
  onEnterStructure: () => void;
  onExitPlaceholder: () => void;
  onNextPlaceholder: () => void;
  onPrevPlaceholder: () => void;
  onClearAll: () => void;
  hasStructures: boolean;
  activePlaceholder: {
    structureIndex: number;
    placeholderIndex: number;
  } | null;
}>(
  ({
    onCursorMove,
    onBackspace,
    onSpace,
    onEnterStructure,
    onExitPlaceholder,
    onNextPlaceholder,
    onPrevPlaceholder,
    onClearAll,
    hasStructures,
    activePlaceholder,
  }) => {
    const handleLeftMove = useCallback(() => onCursorMove("left"), [onCursorMove]);
    const handleRightMove = useCallback(() => onCursorMove("right"), [onCursorMove]);

    return (
      <div className="p-3 rounded-lg bg-indigo-50/50">
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          <ControlButton
            onClick={handleLeftMove}
            title="הזז סמן שמאלה"
            colorClass="bg-sky-100 hover:bg-sky-200 border-sky-300 text-sky-900"
          >
            ←
          </ControlButton>
          <ControlButton
            onClick={handleRightMove}
            title="הזז סמן ימינה"
            colorClass="bg-sky-100 hover:bg-sky-200 border-sky-300 text-sky-900"
          >
            →
          </ControlButton>
          <ControlButton
            onClick={onBackspace}
            title="מחיקה"
            colorClass="bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-900"
          >
            ⌫
          </ControlButton>
          <ControlButton
            onClick={onSpace}
            title="רווח"
            colorClass="bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900"
          >
            ⎵
          </ControlButton>
          <ControlButton
            onClick={onEnterStructure}
            title="ערוך מבנה קרוב"
            colorClass="bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-900"
            disabled={!hasStructures}
          >
            ✏️
          </ControlButton>
          <ControlButton
            onClick={onExitPlaceholder}
            title="צא מעריכת מבנה"
            colorClass="bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900"
            disabled={activePlaceholder === null}
          >
            ↩️
          </ControlButton>
          <ControlButton
            onClick={onNextPlaceholder}
            title="שדה הבא (Tab)"
            colorClass="bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-900"
            disabled={activePlaceholder === null}
          >
            ⇥
          </ControlButton>
          <ControlButton
            onClick={onPrevPlaceholder}
            title="שדה קודם (Shift+Tab)"
            colorClass="bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-900"
            disabled={activePlaceholder === null || activePlaceholder.placeholderIndex === 0}
          >
            ⇤
          </ControlButton>
          <ControlButton
            onClick={onClearAll}
            title="נקה הכל"
            colorClass="bg-rose-100 hover:bg-rose-200 border-rose-300 text-rose-900"
          >
            🗑️
          </ControlButton>
        </div>
      </div>
    );
  },
);
ControlPanel.displayName = "ControlPanel";

export const KeyboardPanel = memo<KeyboardPanelProps>(
  ({
    activeTab,
    onTabChange,
    onKeyClick,
    onStaticAction,
    onCursorMove,
    onBackspace,
    onSpace,
    onEnterStructure,
    onExitPlaceholder,
    onNextPlaceholder,
    onPrevPlaceholder,
    onClearAll,
    hasStructures,
    activePlaceholder,
  }) => {
    const currentKeyboard = useMemo(() => keyboards[activeTab], [activeTab]);

    // Flatten all rows into a single array of keys
    const allKeys = useMemo(
      () => currentKeyboard.rows.flat(),
      [currentKeyboard.rows],
    );

    return (
      <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-4">
        <div className="flex flex-wrap gap-2 border-b pb-2 mb-4" role="tablist">
          {tabs.map((t) => (
            <TabButton
              key={t.type}
              type={t.type}
              label={t.label}
              isActive={activeTab === t.type}
              onClick={() => onTabChange(t.type)}
            />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 flex flex-row flex-wrap gap-2" role="group" aria-label="מקשי מתמטיקה">
            {allKeys.map((k, i) => (
              <KeyButton
                key={`${k.value}-${i}`}
                k={k}
                tooltip={specialTooltips[k.value] || undefined}
                onClick={() => onKeyClick(k)}
              />
            ))}
          </div>

          <div className="flex gap-2" role="group" aria-label="מקלדת מספרים ופעולות">
            <NumberPad onKeyClick={onKeyClick} onStaticAction={onStaticAction} />
            <OperatorsColumn onKeyClick={onKeyClick} />
          </div>
        </div>

        <ControlPanel
          onCursorMove={onCursorMove}
          onBackspace={onBackspace}
          onSpace={onSpace}
          onEnterStructure={onEnterStructure}
          onExitPlaceholder={onExitPlaceholder}
          onNextPlaceholder={onNextPlaceholder}
          onPrevPlaceholder={onPrevPlaceholder}
          onClearAll={onClearAll}
          hasStructures={hasStructures}
          activePlaceholder={activePlaceholder}
        />
      </div>
    );
  },
);

KeyboardPanel.displayName = "KeyboardPanel";
