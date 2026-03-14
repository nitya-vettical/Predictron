import React, { useState } from 'react';
import { Activity, Zap, Radio, Power, Clock } from 'lucide-react';

interface PredictionFormProps {
  onPredict: (data: PredictionInput) => void;
  loading: boolean;
}

export interface PredictionInput {
  time: number;
  bs: string;
  load: number;
  esmode: number;
  txpower: number;
}

export default function PredictionForm({ onPredict, loading }: PredictionFormProps) {
  const [formData, setFormData] = useState<PredictionInput>({
    time: 12,
    bs: 'BS1',
    load: 50,
    esmode: 1,
    txpower: 25,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  const handleChange = (field: keyof PredictionInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Clock className="w-4 h-4 text-cyan-600" />
            Time (Hour)
          </label>
          <input
            type="number"
            min="0"
            max="23"
            value={formData.time}
            onChange={(e) => handleChange('time', Number(e.target.value))}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none"
            required
          />
          <input
            type="range"
            min="0"
            max="23"
            value={formData.time}
            onChange={(e) => handleChange('time', Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Radio className="w-4 h-4 text-cyan-600" />
            Base Station
          </label>
          <select
            value={formData.bs}
            onChange={(e) => handleChange('bs', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none appearance-none cursor-pointer"
            required
          >
            <option value="BS1">Base Station 1</option>
            <option value="BS2">Base Station 2</option>
            <option value="BS3">Base Station 3</option>
            <option value="BS4">Base Station 4</option>
            <option value="BS5">Base Station 5</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Activity className="w-4 h-4 text-cyan-600" />
            Network Load (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.load}
            onChange={(e) => handleChange('load', Number(e.target.value))}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none"
            required
          />
          <input
            type="range"
            min="0"
            max="100"
            value={formData.load}
            onChange={(e) => handleChange('load', Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Zap className="w-4 h-4 text-cyan-600" />
            Energy Saving Mode
          </label>
          <select
            value={formData.esmode}
            onChange={(e) => handleChange('esmode', Number(e.target.value))}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none appearance-none cursor-pointer"
            required
          >
            <option value="0">Disabled</option>
            <option value="1">Mode 1 - Low</option>
            <option value="2">Mode 2 - Medium</option>
            <option value="3">Mode 3 - High</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Power className="w-4 h-4 text-cyan-600" />
            Transmission Power (dBm)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={formData.txpower}
            onChange={(e) => handleChange('txpower', Number(e.target.value))}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none"
            required
          />
          <input
            type="range"
            min="0"
            max="50"
            value={formData.txpower}
            onChange={(e) => handleChange('txpower', Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Calculating...
          </span>
        ) : (
          'Predict Energy Consumption'
        )}
      </button>
    </form>
  );
}
