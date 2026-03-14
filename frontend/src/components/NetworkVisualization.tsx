import React, { useEffect, useRef } from 'react';

interface NetworkVisualizationProps {
  energy: number;
  load: number;
}

export default function NetworkVisualization({ energy, load }: NetworkVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.3;

    const pulseIntensity = load / 100;
    const energyIntensity = Math.min(energy / 200, 1);

    for (let i = 3; i >= 0; i--) {
      const alpha = 0.1 - i * 0.02;
      const radius = baseRadius + i * 20 * pulseIntensity;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, `rgba(6, 182, 212, ${alpha * energyIntensity})`);
      gradient.addColorStop(0.5, `rgba(14, 165, 233, ${alpha * 0.5 * energyIntensity})`);
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fill();

    const numNodes = 5;
    const nodeRadius = baseRadius * 0.8;

    for (let i = 0; i < numNodes; i++) {
      const angle = (i / numNodes) * Math.PI * 2 - Math.PI / 2;
      const nodeX = centerX + Math.cos(angle) * nodeRadius;
      const nodeY = centerY + Math.sin(angle) * nodeRadius;

      ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 * energyIntensity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(nodeX, nodeY);
      ctx.stroke();

      const nodeGradient = ctx.createRadialGradient(nodeX, nodeY, 0, nodeX, nodeY, 12);
      nodeGradient.addColorStop(0, '#06b6d4');
      nodeGradient.addColorStop(1, '#0891b2');

      ctx.fillStyle = nodeGradient;
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

  }, [energy, load]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
      <canvas
        ref={canvasRef}
        className="w-full h-64 relative z-10"
      />
      <div className="mt-4 text-center relative z-10">
        <p className="text-sm text-slate-400">Network Activity Visualization</p>
      </div>
    </div>
  );
}
