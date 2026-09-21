import { useState, useEffect } from 'react'
import { Shield, Activity, Wifi, WifiOff, AlertTriangle } from 'lucide-react'

export default function App() {
  const [healthStatus, setHealthStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setHealthStatus(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to connect to backend health check:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-cyan-400" />
          <div>
            <h1 className="text-xl font-bold tracking-wider text-slate-100">AURORA</h1>
            <p className="text-xs text-cyan-400 font-mono uppercase tracking-widest">
              Polar Expedition Command Platform
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 text-xs font-mono">
          {healthStatus?.status === 'healthy' ? (
            <>
              <Wifi className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">BACKEND CONNECTED</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 font-semibold">DISCONNECTED / DEGRADED</span>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-cyan-400" />
              <h2 className="text-lg font-semibold text-slate-200">
                System Status
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">SIH MVP Core Setup</span>
          </div>

          {loading && (
            <div className="flex items-center space-x-3 text-slate-400 font-mono text-sm py-8">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent"></div>
              <span>Connecting to Aurora Command Core (http://localhost:8000/health)...</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-4 flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-rose-300">Backend Connection Warning</h3>
                <p className="text-xs text-rose-400/90 font-mono mt-1">
                  Failed to fetch backend status: {error}
                </p>
              </div>
            </div>
          )}

          {healthStatus && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Service Status</div>
                  <div className="text-emerald-400 font-bold font-mono text-lg mt-1 uppercase">
                    {healthStatus.status}
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Backend Ident</div>
                  <div className="text-cyan-300 font-bold font-mono text-lg mt-1">
                    {healthStatus.service}
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-lg">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Operational Mode</div>
                  <div className="text-slate-200 font-mono text-sm mt-1">
                    {healthStatus.mode}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800 py-4 px-6 text-center text-xs font-mono text-slate-500">
        Aurora Command Platform &bull; Offline-First Architecture
      </footer>
    </div>
  )
}
