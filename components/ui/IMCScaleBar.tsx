'use client';

const SCALE_MIN = 15;
const SCALE_MAX = 40;
const SCALE_RANGE = SCALE_MAX - SCALE_MIN;

const segments = [
  { key: 'underweight', min: SCALE_MIN, max: 18.5, color: 'bg-[#3B82F6]' },
  { key: 'normal', min: 18.5, max: 25, color: 'bg-[#22C55E]' },
  { key: 'overweight', min: 25, max: 30, color: 'bg-[#F59E0B]' },
  { key: 'obesity', min: 30, max: SCALE_MAX, color: 'bg-[#EF4444]' }
] as const;

interface IMCScaleBarProps {
  imc: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function IMCScaleBar({ imc }: IMCScaleBarProps) {
  const clampedImc = clamp(imc, SCALE_MIN, SCALE_MAX);
  const markerPercent = ((clampedImc - SCALE_MIN) / SCALE_RANGE) * 100;

  return (
    <div className="mt-3">
      <div className="relative px-1">
        <div className="flex h-3 overflow-hidden rounded-full bg-white/20 ring-1 ring-black/5">
          {segments.map((segment) => {
            const widthPercent = ((segment.max - segment.min) / SCALE_RANGE) * 100;

            return (
              <div
                key={segment.key}
                className={`${segment.color} h-full border-r border-white/60 last:border-r-0`}
                style={{ width: `${widthPercent}%` }}
                aria-hidden="true"
              />
            );
          })}
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 transition-[left] duration-300 ease-out"
          style={{ left: `${markerPercent}%` }}
          aria-label={`IMC atual ${imc.toFixed(1)}`}
        >
          <div className="absolute left-1/2 top-1/2 h-5 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-900/28" />
          <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-950 shadow-[0_0_0_3px_rgba(255,255,255,0.38),0_8px_18px_rgba(15,23,42,0.22)]" />
        </div>
      </div>
    </div>
  );
}
