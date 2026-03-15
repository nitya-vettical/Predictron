import { useEffect, useState } from 'react';
import { History, Calendar, Zap, AlertTriangle } from 'lucide-react';

export interface Prediction {
  id: number;
  time_value: number;
  bs_station: string;
  load: number;
  esmode: number;
  txpower: number;
  predicted_energy: number;
  created_at: string;
}

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<boolean>(false);

  useEffect(() => {
    fetchPredictions();

    const handleRefresh = () => fetchPredictions();
    window.addEventListener('refreshHistory', handleRefresh);
    return () => window.removeEventListener('refreshHistory', handleRefresh);
  }, []);

  const fetchPredictions = async () => {
    try {
      setFetchError(false);
      const apiUrl = `${import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5000'}/history`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch predictions from backend');
      }
      
      const data = await response.json();
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-cyan-600" />
          <h3 className="text-lg font-semibold text-slate-800">Recent Predictions</h3>
        </div>
        {fetchError ? (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">
              Failed to connect to the backend server to fetch history.
            </p>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No predictions yet. Make your first prediction above!</p>
        )}
      </div>
    );
  }


  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-cyan-600" />
        <h3 className="text-lg font-semibold text-slate-800">Recent Predictions</h3>
      </div>

      <div className="space-y-3">
        {predictions.map((pred) => (
          <div
            key={pred.id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-cyan-50 rounded-xl border border-slate-100 hover:border-cyan-200 transition-all duration-200"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{formatDate(pred.created_at)}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Time:</span>{' '}
                  <span className="font-semibold text-slate-700">{pred.time_value}h</span>
                </div>
                <div>
                  <span className="text-slate-500">BS:</span>{' '}
                  <span className="font-semibold text-slate-700">{pred.bs_station}</span>
                </div>
                <div>
                  <span className="text-slate-500">Load:</span>{' '}
                  <span className="font-semibold text-slate-700">{pred.load}%</span>
                </div>
                <div>
                  <span className="text-slate-500">ES Mode:</span>{' '}
                  <span className="font-semibold text-slate-700">{pred.esmode}</span>
                </div>
                <div>
                  <span className="text-slate-500">Power:</span>{' '}
                  <span className="font-semibold text-slate-700">{pred.txpower}dBm</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-cyan-100">
              <Zap className="w-4 h-4 text-cyan-600" />
              <span className="font-bold text-cyan-600">{pred.predicted_energy}</span>
              <span className="text-xs text-slate-500">W</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
