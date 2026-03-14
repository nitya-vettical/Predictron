import React from 'react';
import { Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PredictionResultProps {
  energy: number;
  comparisonValue?: number;
}

export default function PredictionResult({ energy, comparisonValue = 100 }: PredictionResultProps) {
  const difference = energy - comparisonValue;
  const percentChange = ((difference / comparisonValue) * 100).toFixed(1);

  const getEfficiencyRating = (energy: number) => {
    if (energy < 80) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (energy < 120) return { label: 'Good', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (energy < 160) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    return { label: 'High', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const rating = getEfficiencyRating(energy);

  return (
    <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-50 rounded-2xl p-8 border border-cyan-100 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-700">Prediction Result</h3>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${rating.bg} ${rating.border} border`}>
          <Zap className={`w-4 h-4 ${rating.color}`} />
          <span className={`text-sm font-semibold ${rating.color}`}>{rating.label}</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-baseline gap-2">
          <span className="text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            {energy.toFixed(2)}
          </span>
          <span className="text-2xl font-medium text-slate-500">Watts</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white rounded-xl border border-slate-100">
          <div className="flex items-center justify-center gap-1 mb-1">
            {difference > 0 ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : difference < 0 ? (
              <TrendingDown className="w-4 h-4 text-emerald-500" />
            ) : (
              <Minus className="w-4 h-4 text-slate-400" />
            )}
            <span className={`text-sm font-semibold ${difference > 0 ? 'text-red-600' : difference < 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
              {percentChange}%
            </span>
          </div>
          <p className="text-xs text-slate-500">vs Baseline</p>
        </div>

        <div className="text-center p-4 bg-white rounded-xl border border-slate-100">
          <p className="text-lg font-bold text-slate-700">{(energy * 24).toFixed(0)}</p>
          <p className="text-xs text-slate-500">Daily (Wh)</p>
        </div>

        <div className="text-center p-4 bg-white rounded-xl border border-slate-100">
          <p className="text-lg font-bold text-slate-700">{(energy * 24 * 30 / 1000).toFixed(2)}</p>
          <p className="text-xs text-slate-500">Monthly (kWh)</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded-xl border border-slate-100">
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Energy Insight:</span>{' '}
          {energy < 80 && 'Excellent efficiency! The current configuration minimizes energy consumption.'}
          {energy >= 80 && energy < 120 && 'Good energy profile. Minor optimizations could further reduce consumption.'}
          {energy >= 120 && energy < 160 && 'Moderate consumption. Consider enabling higher energy saving modes.'}
          {energy >= 160 && 'High energy usage detected. Review load distribution and power settings.'}
        </p>
      </div>
    </div>
  );
}
