import React, { useState } from 'react';
import { 
  Lock, Unlock, User, Eye, EyeOff, ShieldAlert, Check, Loader2,
  Smartphone, Monitor, Tablet, Database, Landmark, HeartHandshake, Shield, Activity
} from 'lucide-react';

interface PanelLoginProps {
  role: string;
  roleName: string;
  roleColor: string;
  onSuccess: () => void;
}

export const PanelLogin: React.FC<PanelLoginProps> = ({ role, roleName, roleColor, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  // Predefined correct credentials & visual theme configurations for each role
  const credentialsMap: Record<string, { username: string; password: string; device: 'phone' | 'tablet' | 'desktop'; logo: string; desc: string; authLogs: string[] }> = {
    customer: {
      username: 'anjali@dairyfresh.com',
      password: 'customer_password',
      device: 'phone',
      logo: '🥛 DairyFresh Customer Go',
      desc: 'Consumer-facing retail and Milk subscription client.',
      authLogs: [
        'Connecting to customer database...',
        'Checking secure digital milk wallet balance...',
        'Syncing custom delivery coordinates...'
      ]
    },
    vendor: {
      username: 'krishna_dairy',
      password: 'vendor_password',
      device: 'tablet',
      logo: '🌾 Farm Vendor Hub',
      desc: 'Dairy farm processing plant, laboratory, and inventory dashboard.',
      authLogs: [
        'Verifying Dairy Farm FSSAI licence token...',
        'Connecting pasture telemetry feeds...',
        'Syncing milk processing silos...'
      ]
    },
    delivery: {
      username: 'ramesh_rider',
      password: 'rider_password',
      device: 'phone',
      logo: '⚡ Courier Dispatch App',
      desc: 'On-road delivery agent routing, OTP, and cash-on-delivery registry.',
      authLogs: [
        'Booting GPS navigation coordinate stream...',
        'Fetching pending geo-locked route orders...',
        'Checking rider vehicle registration ID...'
      ]
    },
    distributor: {
      username: 'distributor_zone_a',
      password: 'zone_a_password',
      device: 'desktop',
      logo: '🌐 Logistics Console',
      desc: 'Regional hub administration, distributor truck routing, and dispatch allocations.',
      authLogs: [
        'Connecting Zone-A routing servers...',
        'Resolving franchisee wholesale catalogs...',
        'Staging logistics dispatch arrays...'
      ]
    },
    warehouse: {
      username: 'warehouse_node_b',
      password: 'warehouse_password',
      device: 'tablet',
      logo: '❄️ Cold-Suite IoT Sensor Terminal',
      desc: 'Sub-zero storage, temperature safeguarding system, and batch chemistry scanner.',
      authLogs: [
        'Retrieving RF temperature sensor calibration indices...',
        'Syncing nitrogen storage chamber compressors...',
        'Refreshing shelf-life warning safeguards...'
      ]
    },
    accountant: {
      username: 'finance@dairyfresh.com',
      password: 'accountant_password',
      device: 'desktop',
      logo: '📈 Ledger Audit Workstation',
      desc: 'Tax compliance desk, financial receipts log, and cumulative standard GST calculator.',
      authLogs: [
        'Sourcing sales ledger balance sheets...',
        'Syncing central tax GSTR-1 portals...',
        'Generating operating surplus curves...'
      ]
    },
    support: {
      username: 'support@dairyfresh.com',
      password: 'support_password',
      device: 'desktop',
      logo: '💬 Support Desk Center',
      desc: 'CRM ticket queue, chat moderator desks, and express buyer refund keys.',
      authLogs: [
        'Staging instant-resolution refund portals...',
        'Synchronizing unresolved chat tickets...',
        'Launching agent-presence channels...'
      ]
    },
    admin: {
      username: 'admin@dairyfresh.com',
      password: 'admin_password',
      device: 'desktop',
      logo: '👑 Corporate Operations Command',
      desc: 'Executive telemetry aggregation, KYC manual controls, and neural forecast forecasting.',
      authLogs: [
        'Summoning Gemini API forecasting engine...',
        'Restricting master security override logs...',
        'Verifying core enterprise keys...'
      ]
    }
  };

  const config = credentialsMap[role] || credentialsMap.customer;

  // Run simulated high-fidelity animations on successful auth
  const handleAuth = (u: string, p: string) => {
    if (u.trim() === config.username && p.trim() === config.password) {
      setErrorMsg('');
      setIsAuthenticating(true);
      
      // Step through auth log messages for immersive realism
      let stepIndex = 0;
      setProgressMsg(config.authLogs[0]);

      const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < config.authLogs.length) {
          setProgressMsg(config.authLogs[stepIndex]);
        } else {
          clearInterval(interval);
          setSuccess(true);
          setProgressMsg('Authentication authorized! Safe Tunnel Established.');
          setTimeout(() => {
            onSuccess();
          }, 800);
        }
      }, 500);
    } else {
      setErrorMsg('Invalid authentication details! Please check username or use Auto-Fill.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(username, password);
  };

  const handleAutoFill = () => {
    setUsername(config.username);
    setPassword(config.password);
    setErrorMsg('');
    // Auto login
    handleAuth(config.username, config.password);
  };

  return (
    <div className="flex items-center justify-center py-6 px-2 min-h-[550px] bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Background Ambient Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-teal-100/40 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-sky-100/20 pointer-events-none"></div>

      {/* Frame selector for Smartphone/Tablet/Web */}
      <div className={`w-full max-w-md ${config.device === 'phone' ? 'max-w-sm border-8 border-slate-900 rounded-[3rem] bg-white shadow-2xl p-6 relative overflow-hidden' : 'p-6 bg-white rounded-3xl border border-gray-100 shadow-xl'}`}>
        
        {/* Smartphone screen top notch mock */}
        {config.device === 'phone' && (
          <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 flex justify-center items-center z-20">
            <div className="w-24 h-4 bg-slate-950 rounded-b-xl flex justify-between items-center px-4">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
              <div className="w-8 h-1 bg-slate-800 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Smartphone screen mini-header */}
        {config.device === 'phone' && (
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mb-4 pt-2">
            <span>9:41 AM 📲</span>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-500" />
              <span>5G LTE</span>
            </div>
          </div>
        )}

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex py-1 px-3 bg-teal-50 border border-teal-100/55 rounded-full text-[10px] uppercase font-mono font-bold text-teal-700 tracking-wider items-center gap-1">
            <Lock className="w-3 h-3" /> Secure Gateway
          </div>
          <h2 className="text-lg font-display font-extrabold text-slate-800 leading-tight">
            {config.logo}
          </h2>
          <p className="text-xs text-slate-400 px-4 leading-relaxed font-sans font-medium">
            {config.desc}
          </p>
        </div>

        {isAuthenticating ? (
          /* Authentication Screen Loader animation and log telemetry outputs */
          <div className="py-8 space-y-6 text-center animate-in fade-in duration-300">
            <div className="relative inline-flex items-center justify-center">
              <div className="relative w-16 h-16 rounded-full border-4 border-teal-100 flex items-center justify-center">
                {success ? (
                  <Check className="w-8 h-8 text-emerald-500 scale-110 transition-transform duration-300" />
                ) : (
                  <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                )}
              </div>
              {!success && (
                <div className="absolute inset-0 rounded-full border-4 border-t-teal-600 animate-spin"></div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold font-mono text-cyan-800 uppercase tracking-widest">{success ? 'ACCESS GRANTED':'VERIFYING AUTH TOKEN'}</h4>
              <p className="text-xs text-slate-500 font-mono font-medium max-w-[280px] mx-auto min-h-[32px] flex items-center justify-center line-clamp-2">
                {progressMsg}
              </p>
            </div>
            
            <div className="bg-slate-900 rounded-xl p-3 text-left font-mono text-[9px] text-emerald-400/90 h-28 overflow-hidden relative shadow-inner">
              <div className="absolute top-1 right-2 text-slate-600 text-[8px] uppercase">Telemetry Tunnel</div>
              <div className="space-y-1 select-none pointer-events-none">
                <div>[SYSTEM]: Initiating Handshake on SSL v3...</div>
                <div>[SYSTEM]: Resolving remote host {role}.dairyfresh.internal...</div>
                {isAuthenticating && <div>[HANDSHAKE]: ECDHE-RSA-AES128-GCM-SHA256 connection active...</div>}
                {success && <div className="text-emerald-300">[SUCCESS]: Client authenticated successfully.</div>}
                {success && <div className="text-emerald-300">[SESSION]: Initializing {roleName} workspace module.</div>}
              </div>
            </div>
          </div>
        ) : (
          /* Form Interface */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Direct credentials quick help banner */}
            <div className="p-3 bg-linear-to-b from-gray-50 to-gray-50/40 border border-gray-100 rounded-2xl space-y-1.5">
              <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold text-gray-400">
                <span>Demo Account Available</span>
                <span className="text-teal-600">Fixed Match</span>
              </div>
              <div className="text-[11px] text-gray-600 space-y-1 font-mono">
                <div>User ID: <span className="font-bold text-slate-700 select-all">{config.username}</span></div>
                <div>Access Key: <span className="font-bold text-slate-700 select-all">{config.password}</span></div>
              </div>
              <button 
                type="button"
                onClick={handleAutoFill}
                className="w-full mt-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer hover:shadow-md"
                id="auto-fill-btn"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Express Login (Auto-Fill)</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-center gap-1.5 font-semibold animate-bounce">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Account ID / Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter Account ID" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500 focus:bg-white focus:border-teal-500 transition-colors"
                  required
                  id="login-username-input"
                />
                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Access Pass Key</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter Pass Key" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-9 text-xs text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500 focus:bg-white focus:border-teal-500 transition-colors"
                  required
                  id="login-password-input"
                />
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-hidden"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Verify & Launch Workspace</span>
              <Loader2 className="w-3.5 h-3.5 shrink-0 hidden group-focus:inline" />
            </button>
          </form>
        )}

        {/* Smartphone bottom Home line indicator */}
        {config.device === 'phone' && (
          <div className="w-28 h-1 bg-gray-200 rounded-full mx-auto mt-6"></div>
        )}
      </div>
    </div>
  );
};
