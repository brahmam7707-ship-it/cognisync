import React from 'react';
import { BatteryLow, BatteryMedium, BatteryCharging } from 'lucide-react';

const ENERGY_OPTIONS = [
  {
    key: 'Low',
    label: 'Low Energy',
    hint: 'Quick wins & restorative tasks',
    icon: BatteryLow,
    activeClass: 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold shadow-xs'
  },
  {
    key: 'Medium',
    label: 'Medium Energy',
    hint: 'Steady flow & routine execution',
    icon: BatteryMedium,
    activeClass: 'bg-amber-50 border-amber-300 text-amber-900 font-semibold shadow-xs'
  },
  {
    key: 'High',
    label: 'High Energy',
    hint: 'Peak deep focus & architecture',
    icon: BatteryCharging,
    activeClass: 'bg-accent-50 border-accent-300 text-accent-900 font-semibold shadow-xs'
  }
];

export default function EnergySelector({ currentEnergy, onEnergyChange }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-paper-300 shadow-xs">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-charcoal-600 uppercase tracking-wider">
          Current Energy Level
        </span>
        <span className="text-xs text-charcoal-400">
          {ENERGY_OPTIONS.find(o => o.key === currentEnergy)?.hint}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {ENERGY_OPTIONS.map(opt => {
          const isSelected = currentEnergy === opt.key;
          const Icon = opt.icon;

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onEnergyChange(opt.key)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs transition-all ${
                isSelected
                  ? opt.activeClass
                  : 'bg-paper-50/70 border-paper-300 text-charcoal-600 hover:bg-paper-100 hover:text-charcoal-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
