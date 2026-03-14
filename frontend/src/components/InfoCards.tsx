import React from 'react';
import { Cpu, Wifi, Battery } from 'lucide-react';

export default function InfoCards() {
  const features = [
    {
      icon: Cpu,
      title: 'ML-Powered',
      description: 'XGBoost regression model trained on real 5G network data',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Wifi,
      title: 'Real-Time',
      description: 'Instant predictions for different network configurations',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Battery,
      title: 'Energy Efficient',
      description: 'Optimize power consumption across your 5G infrastructure',
      color: 'from-emerald-500 to-cyan-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          <div className="relative">
            <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-600">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
