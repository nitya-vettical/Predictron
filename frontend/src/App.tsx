import { useState } from 'react';
import { Zap, Radio } from 'lucide-react';
import PredictionForm, { PredictionInput } from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import PredictionHistory from './components/PredictionHistory';
import InfoCards from './components/InfoCards';
import NetworkVisualization from './components/NetworkVisualization';
import ModelInsights from './components/ModelInsights';

export default function App() {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentLoad, setCurrentLoad] = useState(50);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handlePredict = async (data: PredictionInput) => {
    setLoading(true);
    setError(null);
    setCurrentLoad(data.load);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5000'}/predict`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const result = await response.json();
      setPrediction(result.prediction);

      setTimeout(() => {
        window.dispatchEvent(new Event('refreshHistory'));
      }, 500);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      <div className="absolute inset-0 bg-grid-slate-200 bg-[size:60px_60px] opacity-30"></div>

      <div className="relative">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl shadow-lg">
                <Radio className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Predictron
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  AI-powered 5G energy consumption forecasting
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <InfoCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-6 h-6 text-cyan-600" />
                  <h2 className="text-2xl font-bold text-slate-800">Network Parameters</h2>
                </div>
                <PredictionForm onPredict={handlePredict} loading={loading} />

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>

              {prediction !== null && (
                <>
                  <PredictionResult energy={prediction} />
                  <NetworkVisualization energy={prediction} load={currentLoad} />
                </>
              )}
              {prediction === null && (
                <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-10 h-10 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      Ready to Predict
                    </h3>
                    <p className="text-slate-500">
                      Enter network parameters to predict energy consumption
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <ModelInsights />
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs font-semibold text-slate-400 hover:text-cyan-600 transition-colors uppercase tracking-widest flex items-center gap-2 mx-auto"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {showHistory ? 'Hide Prediction History' : 'Show Prediction History'}
                </button>
              </div>
            </div>
          </div>

          {showHistory && <PredictionHistory key={prediction?.toString()} />}

        </main>

        <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-md mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Powered by XGBoost Machine Learning
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Predictive analytics for sustainable 5G infrastructure
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
