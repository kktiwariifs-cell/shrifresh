/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CustomerApp } from './components/CustomerApp';
import { VendorApp } from './components/VendorApp';
import { DeliveryApp } from './components/DeliveryApp';
import { DistributorPanel } from './components/DistributorPanel';
import { WarehousePanel } from './components/WarehousePanel';
import { AccountantPanel } from './components/AccountantPanel';
import { SupportPanel } from './components/SupportPanel';
import { AdminPanel } from './components/AdminPanel';
import { PanelLogin } from './components/PanelLogin';

import { 
  ShoppingBag, Milk, Bike, Network, Snowflake, IndianRupee, MessageSquare, Building, AppWindow,
  Compass, HelpCircle, Activity, Info, Sparkles, Lock, Unlock, ShieldAlert,
  MapPin, Bell, CreditCard, Tag, History, Star, BarChart3, ChevronRight, CheckCircle2
} from 'lucide-react';

type StakeholderRole = 
  | 'customer'
  | 'vendor'
  | 'delivery'
  | 'distributor'
  | 'warehouse'
  | 'accountant'
  | 'support'
  | 'admin';

const MainAppContent: React.FC = () => {
  const { orders, tickets, coldUnits } = useApp();
  const [activeRole, setActiveRole] = useState<StakeholderRole>('customer');
  const [showGuide, setShowGuide] = useState(true);

  // Authenticated state sessions map synchronized with localStorage
  const [authSessions, setAuthSessions] = useState<Record<StakeholderRole, boolean>>(() => {
    try {
      const saved = localStorage.getItem('df_auth_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all roles default to true if not explicitly set to false
        return {
          customer: parsed.hasOwnProperty('customer') ? !!parsed.customer : true,
          vendor: parsed.hasOwnProperty('vendor') ? !!parsed.vendor : true,
          delivery: parsed.hasOwnProperty('delivery') ? !!parsed.delivery : true,
          distributor: parsed.hasOwnProperty('distributor') ? !!parsed.distributor : true,
          warehouse: parsed.hasOwnProperty('warehouse') ? !!parsed.warehouse : true,
          accountant: parsed.hasOwnProperty('accountant') ? !!parsed.accountant : true,
          support: parsed.hasOwnProperty('support') ? !!parsed.support : true,
          admin: parsed.hasOwnProperty('admin') ? !!parsed.admin : true
        };
      }
      return {
        customer: true,
        vendor: true,
        delivery: true,
        distributor: true,
        warehouse: true,
        accountant: true,
        support: true,
        admin: true
      };
    } catch {
      return {
        customer: true,
        vendor: true,
        delivery: true,
        distributor: true,
        warehouse: true,
        accountant: true,
        support: true,
        admin: true
      };
    }
  });

  const handleSetAuth = (role: StakeholderRole, isAuthorized: boolean) => {
    setAuthSessions(prev => {
      const updated = { ...prev, [role]: isAuthorized };
      localStorage.setItem('df_auth_sessions', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSignOut = (role: StakeholderRole) => {
    handleSetAuth(role, false);
  };

  // Quick State alerts to guide the user in testing!
  const hasPendingOrders = orders.filter(o => o.status === 'pending').length > 0;
  const hasOpenTickets = tickets.filter(t => t.status === 'open').length > 0;
  const hasTempWarning = coldUnits.filter(u => u.alertStatus === 'warning' || u.alertStatus === 'alert').length > 0;

  const rolesList: { id: StakeholderRole; name: string; icon: React.ReactNode; color: string; desc: string }[] = [
    { 
      id: 'customer', 
      name: 'Customer App', 
      icon: <ShoppingBag className="w-5 h-5" />, 
      color: 'bg-teal-600',
      desc: 'Browse fresh dairy, subscribe, top-up smart milk wallet, checkout & track farm milking details.',
    },
    { 
      id: 'vendor', 
      name: 'Farm / Vendor', 
      icon: <Milk className="w-5 h-5" />, 
      color: 'bg-indigo-600',
      desc: 'Verify incoming orders, update raw/processed milk stocks, track batches & upload FSSAI labs.',
    },
    { 
      id: 'delivery', 
      name: 'Delivery Agent', 
      icon: <Bike className="w-5 h-5" />, 
      color: 'bg-cyan-600',
      desc: 'Go online/offline, accept orders, trace delivery routes, verify drop-offs with OTP codes & track fees.',
    },
    { 
      id: 'distributor', 
      name: 'Franchise Panel', 
      icon: <Network className="w-5 h-5" />, 
      color: 'bg-emerald-600',
      desc: 'Manage geographical franchise zones, monitor assigned vendors & dispatch bulk trucks.',
    },
    { 
      id: 'warehouse', 
      name: 'Cold Storage B', 
      icon: <Snowflake className="w-5 h-5" />, 
      color: 'bg-blue-600',
      desc: 'Real-time temperature telemetry monitoring, drift warning safeguards & batch tracking shelf-lives.',
    },
    { 
      id: 'accountant', 
      name: 'Accountant Desk', 
      icon: <IndianRupee className="w-5 h-5" />, 
      color: 'bg-rose-600',
      desc: 'Income & operating logs ledger audits, auto cumulative GSTR-1 / GSTR-3B GST calculators.',
    },
    { 
      id: 'support', 
      name: 'Support Office', 
      icon: <MessageSquare className="w-5 h-5" />, 
      color: 'bg-amber-600',
      desc: 'View user complaint tickets, respond instantly using quick-refund/resolved templates.',
    },
    { 
      id: 'admin', 
      name: 'Corporate Admin', 
      icon: <Building className="w-5 h-5" />, 
      color: 'bg-slate-800',
      desc: 'Live high-level logs, promote discount custom coupons, KYC review documents & AI demand forecasting.',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Corporate Dashboard Header */}
      <header className="bg-slate-900 text-white shadow-xl px-6 py-4.5 shrink-0 border-b border-sky-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-sky-400 to-teal-500 p-2.5 rounded-2xl text-slate-900 shadow-md">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="font-display font-extrabold tracking-tight text-xl text-white flex items-center gap-2">
                DairyFresh <span className="text-teal-400 font-mono text-xs font-medium">Enterprise Suite v2.5</span>
              </h1>
              <p className="text-slate-400 text-xs">Dairy Products E-Commerce Multi-Stakeholder Core Operations Platform</p>
            </div>
          </div>

          {/* Guide toggle button */}
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs bg-slate-800 hover:bg-slate-700 font-medium px-3.5 py-2 rounded-xl transition border border-slate-700/60 flex items-center gap-1.5"
          >
            <Info className="w-4 h-4 text-sky-400" />
            {showGuide ? 'Dismiss Simulation Simulator Guide':'Show Simulation Simulator Guide'}
          </button>
        </div>
      </header>

      {/* Guide Banner */}
      {showGuide && (
        <div className="bg-gradient-to-r from-sky-950 via-teal-950 to-indigo-950 text-white px-6 py-4 mr-0 shrink-0 border-b border-sky-900/60 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
            <div className="space-y-1">
              <h3 className="font-display font-semibold text-sky-200 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-sky-300 animate-pulse" />
                <span>Synchronized Multi-Role Simulation Console Guide</span>
              </h3>
              <p className="text-slate-300 leading-relaxed font-sans max-w-4xl">
                This is a fully synchronized simulation environment representing **all 8 enterprise roles**. State updates are unified: 
                (1) Place a retail milk order or file a support ticket inside the **Customer App**. 
                (2) Instantly switch to the **Farm Vendor App** or **Support Office** to audit raw milking telemetry, approve dispatches, or settle chats. 
                (3) Complete delivery routes inside the **Delivery Agent App** using matching security OTP codes.
              </p>
            </div>
            {/* Quick telemetry alerts indicator */}
            <div className="flex flex-wrap gap-2 shrink-0 font-mono text-[10px]">
              {hasPendingOrders && (
                <span className="bg-amber-400 text-slate-900 font-extrabold py-1 px-2.5 rounded-lg animate-pulse">
                  ⚠️ PENDING DISPATCHES
                </span>
              )}
              {hasOpenTickets && (
                <span className="bg-cyan-400 text-slate-900 font-extrabold py-1 px-2.5 rounded-lg animate-pulse">
                  💬 ACTIVE COMPLAINTS
                </span>
              )}
              {hasTempWarning && (
                <span className="bg-red-400 text-slate-900 font-extrabold py-1 px-2.5 rounded-lg">
                  ❄️ COLD WARPING ALERT
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CORE INTEGRATION: 8 KEY FEATURES INTERACTIVE MATRIX */}
      <div className="bg-white border-b border-slate-150 py-5 px-6 shadow-xs shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4.5 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-[9.5px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest font-mono">
                KEY FEATURES OVERVIEW
              </span>
              <p className="text-xs text-slate-500 font-sans hidden sm:block">Click any capability below to auto-navigate and test its matching live workflow step!</p>
            </div>
            <span className="text-[10px] text-indigo-600 font-mono font-bold uppercase animate-pulse">
              ● All 8 Channels Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              {
                id: 'tracking',
                label: 'Live Tracking',
                icon: <MapPin className="w-5 h-5 text-red-500" />,
                desc: 'Simulated real-time maps with distance-based estimations & step-forward routes.',
                targetRole: 'customer' as StakeholderRole,
                hint: 'Open Order tracking tab'
              },
              {
                id: 'notifications',
                label: 'Push Alerts',
                icon: <Bell className="w-5 h-5 text-amber-500 animate-swing" />,
                desc: 'Instant sound alerts, system log entries, and reactive client dispatch notifications.',
                targetRole: 'delivery' as StakeholderRole,
                hint: 'Ring 4.1 dispatch chime'
              },
              {
                id: 'payments',
                label: 'Multiple Payment',
                icon: <CreditCard className="w-5 h-5 text-blue-500" />,
                desc: 'Supports dynamic milk wallet, secure UPI credentials, mock credit cards & COD cash gates.',
                targetRole: 'customer' as StakeholderRole,
                hint: 'Add custom funds or select UPI'
              },
              {
                id: 'offers',
                label: 'Offers & Coupons',
                icon: <Tag className="w-5 h-5 text-emerald-500" />,
                desc: 'Apply DAIRY20 & FRESHMILK promos, scratch cashback cards & spend customer loyalty points.',
                targetRole: 'customer' as StakeholderRole,
                hint: 'Redeem coupons on checkout'
              },
              {
                id: 'otp',
                label: 'OTP Verification',
                icon: <Lock className="w-5 h-5 text-violet-500" />,
                desc: 'Secure 4-digit pickup pins at farm counter and last-mile customer drop validation codes.',
                targetRole: 'delivery' as StakeholderRole,
                hint: 'Review 4.4 and 4.6 steps'
              },
              {
                id: 'history',
                label: 'Order History',
                icon: <History className="w-5 h-5 text-cyan-500" />,
                desc: 'Comprehensive customer order logs containing real-time milestone timelines.',
                targetRole: 'customer' as StakeholderRole,
                hint: 'Inspect previous invoices'
              },
              {
                id: 'ratings',
                label: 'Ratings & Reviews',
                icon: <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />,
                desc: 'Direct post-delivery feedback survey star selector & quality assurance reviews.',
                targetRole: 'customer' as StakeholderRole,
                hint: 'Write delivery feedback'
              },
              {
                id: 'earnings',
                label: 'Earnings Reports',
                icon: <BarChart3 className="w-5 h-5 text-rose-500" />,
                desc: 'Automated tax spreadsheets (GSTR-1, GSTR-3B) & instant delivery boy trip wallets.',
                targetRole: 'accountant' as StakeholderRole,
                hint: 'Audit global financial books'
              }
            ].map((feat) => {
              const belongsToActive = activeRole === feat.targetRole;
              return (
                <button
                  key={feat.id}
                  onClick={() => {
                    setActiveRole(feat.targetRole);
                    handleSetAuth(feat.targetRole, true);
                    const el = document.getElementById('delivery-view-container') || document.getElementById('vendor-view') || document.getElementById('disconnect-session-btn');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-3 rounded-2xl border text-left transition duration-200 cursor-pointer hover:border-indigo-400 group relative flex flex-col justify-between min-h-[148px] ${
                    belongsToActive 
                      ? 'bg-indigo-50/40 border-indigo-200' 
                      : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="p-1 px-1 rounded-xl bg-white border border-slate-100 shadow-3xs group-hover:scale-105 transition shrink-0">
                        {feat.icon}
                      </div>
                      <span className="text-[9px] font-bold font-mono tracking-wider text-slate-400 group-hover:text-indigo-600 transition uppercase">
                        {belongsToActive ? 'Viewing' : 'Inspect'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-sans font-extrabold text-[11.5px] text-slate-800 leading-tight">
                        {feat.label}
                      </h4>
                      <p className="text-[9.5px] text-slate-400 leading-normal line-clamp-3 mt-1 font-sans">
                        {feat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-2 pt-1 border-t border-slate-100/50 text-[9px] font-bold text-indigo-700/80 font-mono">
                    <span>{feat.hint}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Role Switcher Grid System */}
      <div className="bg-white border-b border-slate-200 shadow-xs px-5 py-4 shrink-0 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-3.5 pb-1">
          {rolesList.map((rl) => {
            const isActive = activeRole === rl.id;
            const isAuthorized = authSessions[rl.id];
            return (
              <button
                key={rl.id}
                onClick={() => setActiveRole(rl.id)}
                className={`px-4 py-3 rounded-2xl text-left border flex items-start gap-3 transition min-w-[210px] cursor-pointer relative ${
                  isActive 
                    ? 'border-indigo-600 bg-linear-to-b from-indigo-50/20 to-indigo-50/60 shadow-sm ring-1 ring-indigo-500/20' 
                    : 'border-slate-100 bg-white hover:bg-slate-50'
                }`}
              >
                {/* Visual lock status indicator at upper right corner */}
                <div className="absolute top-2 right-2 flex items-center pr-1 pt-0.5 z-10">
                  {isAuthorized ? (
                    <span className="text-[8px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-emerald-100" title="Authorized Access">
                      <Unlock className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                      <span>LIVE</span>
                    </span>
                  ) : (
                    <span className="text-[8px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-100" title="Auth Gate Enabled">
                      <Lock className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                      <span>LOCK</span>
                    </span>
                  )}
                </div>

                <div className={`p-2.5 rounded-xl text-white ${rl.color} shrink-0`}>
                  {rl.icon}
                </div>
                <div>
                  <h4 className={`font-display font-bold text-xs ${isActive ? 'text-indigo-900':'text-slate-700'}`}>{rl.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-sans leading-tight pr-6">{rl.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Component Render Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 overflow-hidden space-y-4">
        
        {/* Session Status Bar when logged in */}
        {authSessions[activeRole] && (
          <div className="bg-slate-900 text-white rounded-2xl py-3 px-5 flex items-center justify-between text-xs font-mono shadow-md border-b border-sky-950/40 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-gray-300">Session Secure:</span>
              <strong className="text-teal-400 font-bold uppercase tracking-wider">
                {rolesList.find(r => r.id === activeRole)?.name}
              </strong>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-slate-400 hidden sm:inline">Encrypted Tunnel Conn-Key: df_ss_{activeRole}_38</span>
            </div>
            <button 
              onClick={() => handleSignOut(activeRole)}
              className="px-3 py-1.5 bg-red-800 hover:bg-red-700 font-bold rounded-xl text-[11px] transition text-white hover:scale-[1.02] active:scale-95 flex items-center gap-1 cursor-pointer"
              id="disconnect-session-btn"
            >
              <Lock className="w-3 h-3 text-red-100 shrink-0" />
              <span>Lock / Sign Out</span>
            </button>
          </div>
        )}

        {/* If NOT logged in, show PanelLogin first */}
        {!authSessions[activeRole] ? (
          <PanelLogin 
            role={activeRole} 
            roleName={rolesList.find(r => r.id === activeRole)?.name || 'Stakeholder'}
            roleColor={rolesList.find(r => r.id === activeRole)?.color || 'bg-slate-800'}
            onSuccess={() => handleSetAuth(activeRole, true)}
          />
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {activeRole === 'customer' && <CustomerApp />}
            {activeRole === 'vendor' && <VendorApp />}
            {activeRole === 'delivery' && <DeliveryApp />}
            {activeRole === 'distributor' && <DistributorPanel />}
            {activeRole === 'warehouse' && <WarehousePanel />}
            {activeRole === 'accountant' && <AccountantPanel />}
            {activeRole === 'support' && <SupportPanel />}
            {activeRole === 'admin' && <AdminPanel />}
          </div>
        )}
      </main>

      {/* Footer bar */}
      <footer className="bg-slate-950 text-slate-500 py-4.5 px-6 shrink-0 text-center border-t border-slate-900 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>DairyFresh Enterprise Logistics Suite Integration</span>
          <span className="text-slate-600">Simulating 20+ functional features securely</span>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
