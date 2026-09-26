import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('commander.bharati@antarsetu.gov.in');
  const [password, setPassword] = useState('antarsetu123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    // Load pre-configured demo credentials
    api.auth.getDemoAccounts()
      .then((res) => {
        if (res.success) setDemoAccounts(res.data);
      })
      .catch((err) => console.warn('Could not fetch demo accounts:', err));
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication rejected by Polar Security Gate.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.default_password || 'antarsetu123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Polar Grids & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#050B16] to-[#030712] pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <img
            src="/antrasetu-logo.png.jpeg"
            alt="AntarSetu logo"
            className="inline-block w-14 h-14 rounded-2xl object-contain bg-cyan-950 border border-cyan-500/40 mb-3 shadow-[0_0_25px_rgba(0,229,255,0.3)]"
          />
          <h1 className="text-2xl font-mono font-bold tracking-wider text-white">
            ANTAR<span className="text-cyan-400">SETU</span>
          </h1>
          <p className="text-xs font-mono text-cyan-300/80 tracking-widest mt-1 uppercase">
            National Centre for Polar & Ocean Research
          </p>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Remote Operations Command • Indian Antarctic Programme
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-polar-900/90 border border-polar-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-polar-800 pb-3 mb-5 flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              MISSION PORTAL LOGIN
            </span>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
              ENCRYPTED TLS
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs font-mono flex items-start gap-2">
              <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase tracking-wide">
                Operator Email / ID
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@antarsetu.gov.in"
                  className="w-full pl-9 pr-3 py-2 bg-polar-950 border border-polar-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase tracking-wide">
                Mission Clearance Passcode
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-polar-950 border border-polar-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 shadow-[0_0_15px_rgba(0,229,255,0.25)] disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating with Mission Gateway...</span>
              ) : (
                <>
                  <span>Initialize Station Session</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-polar-800">
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2.5">
              Select Demo Profile for Immediate Access:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  className={`text-left p-2 rounded-lg border text-xs font-mono transition flex items-center justify-between ${
                    email === acc.email
                      ? 'bg-polar-800 border-cyan-500/60 text-cyan-300'
                      : 'bg-polar-950/70 border-polar-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-200">{acc.full_name}</div>
                    <div className="text-[10px] text-slate-400">{acc.role.replace(/_/g, ' ')} • {acc.station_code}</div>
                  </div>
                  <span className="text-[10px] bg-polar-800 px-1.5 py-0.5 rounded text-cyan-400">
                    Use
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer legal */}
        <div className="mt-5 text-center text-[10px] font-mono text-slate-400">
          Government of India • Ministry of Earth Sciences • NCPOR
        </div>
      </div>
    </div>
  );
}
