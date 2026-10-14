import React from 'react';
import { BatteryLow, BatteryMedium, BatteryCharging } from 'lucide-react';

const ENERGY_OPTIONS = [
  {
    key: 'Low',
    label: 'Low Energy',
    hint: 'Quick wins & light tasks',
    icon: BatteryLow,
    activeClass: 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200',
    inactiveIcon: 'text-emerald-600',
  },
  {
    key: 'Medium',
    label: 'Medium Energy',
    hint: 'Steady flow & routines',
    icon: BatteryMedium,
    activeClass: 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200',
    inactiveIcon: 'text-amber-600',
  },
  {
    key: 'High',
    label: 'High Energy',
    hint: 'Peak focus & deep work',
    icon: BatteryCharging,
    activeClass: 'bg-accent-600 border-accent-600 text-white shadow-md shadow-accent-200',
    inactiveIcon: 'text-accent-600',
  },
];

export default function EnergySelector({ currentEnergy, onEnergyChange }) {
  const current = ENERGY_OPTIONS.find(o => o.key === currentEnergy);

  return (
    <div className="bg-white rounded-2xl p-4 border border-paper-300 shadow-sm card-enter">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-charcoal-700 uppercase tracking-widest">
          How's Your Energy Right Now?
        </span>
        {current && (
          <span className="text-[11px] text-charcoal-400 italic">{current.hint}</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {ENERGY_OPTIONS.map(opt => {
          const isSelected = currentEnergy === opt.key;
          const Icon = opt.icon;

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onEnergyChange(opt.key)}
              className={`relative flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all duration-200 active:scale-95 ${
                isSelected
                  ? opt.activeClass
                  : 'bg-paper-50 border-paper-300 text-charcoal-600 hover:border-charcoal-200 hover:bg-paper-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : opt.inactiveIcon}`} />
              <span className="leading-none">{opt.key}</span>
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-current flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-current block" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
