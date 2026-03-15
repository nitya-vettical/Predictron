import { BarChart3, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ModelInsights() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const importances = [
    { feature: 'Transmission Power', value: 64.6, color: 'bg-cyan-500' },
    { feature: 'Network Load', value: 25.1, color: 'bg-blue-500' },
    { feature: 'Energy Saving Mode', value: 8.9, color: 'bg-indigo-500' },
    { feature: 'Base Station ID', value: 1.2, color: 'bg-slate-500' },
    { feature: 'Time', value: 0.2, color: 'bg-slate-400' },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-600" />
          <h2 className="text-2xl font-bold text-slate-800">Model Insights</h2>
        </div>
        <div className="group relative">
          <Info className="w-5 h-5 text-slate-400 cursor-help" />
          <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
            This chart shows the global feature importance of our XGBoost model. It indicates which parameters have the most influence on the energy consumption prediction.
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-8">
        According to our XGBoost regressor, <span className="font-semibold text-cyan-600">Transmission Power</span> is the strongest predictor of energy consumption, followed by Network Load.
      </p>

      <div className="space-y-6">
        {importances.map((item) => (
          <div key={item.feature} className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-700">{item.feature}</span>
              <span className="text-slate-500">{item.value}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: mounted ? `${item.value}%` : '0%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
