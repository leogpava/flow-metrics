'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface SliderInputProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  label: string;
  hint?: string;
}

export function SliderInput({
  min,
  max,
  step = 1,
  value,
  onChange,
  unit,
  label,
  hint
}: SliderInputProps) {
  const fillPercent = `${((value - min) / (max - min)) * 100}%`;

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-sm font-medium text-flow-text-soft">{label}</p>
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block text-5xl font-bold tracking-tight text-flow-text"
            >
              {Number.isInteger(value) ? value : value.toFixed(1)}
            </motion.span>
          </AnimatePresence>
          <span className="block text-base text-flow-text-soft">{unit}</span>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="slider-range"
        style={{ ['--fill-percent' as string]: fillPercent }}
      />

      {hint && <p className="text-center text-sm text-flow-text-muted">{hint}</p>}
    </div>
  );
}

