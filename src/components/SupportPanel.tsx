import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, User, Clock, CheckCircle, Send, ShieldAlert, BadgeAlert, 
  HelpCircle, MessageCircle, Mail, Phone, Laptop, Settings, ArrowRight, Layers, Tag
} from 'lucide-react';

export const SupportPanel: React.FC = () => {
  const { tickets, sendTicketMessage, addSystemLog } = useApp();
  
  // States corresponding to requested specs
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'late_delivery' | 'product_quality' | 'refund' | 'missing_item'>('all');
  
  // Selected Communication Integration Tab
  const [commChannel, setCommChannel] = useState<'chat' | 'whatsapp' | 'email' | 'call'>('chat');

  // Custom states for simulations
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [callNotesText, setCallNotesText] = useState('');
  const [callNotesList, setCallNotesList] = useState<string[]>([
    'Customer explained they found dairy seal slightly loose; assured quality check.',
    'Rider was called; vehicle flat tyre delayed Sector 56 delivery by 20 mins.'
  ]);

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  // Filtering tickets dynamically based on selected Complaint Type filter
  const filteredTickets = tickets.filter(t => {
    if (complaintFilter === 'all') return true;
    return t.complaintType === complaintFilter;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    
    sendTicketMessage(activeTicket.id, 'support', replyText);
    addSystemLog('Support Desk', `Sent Live Chat reply to ticket ${activeTicket.id}: "${replyText.slice(0, 30)}..."`);
    setReplyText('');
  };

  const triggerQuickResolution = (templateText: string) => {
    if (!activeTicket) return;
    sendTicketMessage(activeTicket.id, 'support', templateText);
    addSystemLog('Support Desk', `Applied Quick Template to ticket ${activeTicket.id}`);
  };

  // WhatsApp Simulation Trigger
  const handleTriggerWhatsapp = () => {
    if (!activeTicket) return;
    setWhatsappSent(true);
    addSystemLog('WhatsApp Integration', `Dispatched API WhatsApp template to ${activeTicket.phone}: [Ticket ${activeTicket.id} Update]`);
    setTimeout(() => setWhatsappSent(false), 3000);
  };

  // Email Simulation Trigger
  const handleTriggerEmail = () => {
    if (!activeTicket) return;
    setEmailSent(true);
    addSystemLog('Email Service', `Dispatched official corporate support ticket email to customer for Ticket #${activeTicket.id}`);
    setTimeout(() => setEmailSent(false), 3000);
  };

  // Log Call Center Notes
  const handleAddCallNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callNotesText.trim() || !activeTicket) return;
    const noteLine = `[Ticket ${activeTicket.id}] - ${callNotesText.trim()}`;
    setCallNotesList(prev => [noteLine, ...prev]);
    addSystemLog('Call Center Core', `Authorized voice log recording notes for ${activeTicket.customerName}`);
    setCallNotesText('');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[580px]" id="support-view">
      
      {/* Title */}
      <div className="border-b border-gray-100 pb-4 mb-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <span className="text-teal-600 font-bold text-xs uppercase tracking-widest font-mono">Omnichannel Resolution Desk</span>
          <h2 className="font-display font-semibold text-gray-800 text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-600 animate-pulse" /> Customer support Ticket Center
          </h2>
        </div>
        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 py-1 px-3 rounded-full font-bold uppercase">
          Live SLAs Checked (98.4%)
        </span>
      </div>

      {/* Complaint Types filter ribbon */}
      <div className="mb-5 space-y-2 text-xs">
        <label className="block text-[10px] text-gray-450 uppercase font-mono font-bold">Filter Tickets by Complaint Type:</label>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Complaints' },
            { id: 'late_delivery', label: '🚚 Late Delivery' },
            { id: 'product_quality', label: '🥛 Product Quality' },
            { id: 'refund', label: '💳 Refund Issues' },
            { id: 'missing_item', label: '🥚 Missing Item' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setComplaintFilter(opt.id as any)}
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                complaintFilter === opt.id ? 'bg-teal-600 border-teal-600 text-white font-bold' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Filtered Ticket queues */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="flex justify-between items-center pb-1">
            <h3 className="font-display font-semibold text-gray-700 text-xs uppercase tracking-wider font-mono">Active Inboxes ({filteredTickets.length})</h3>
            <span className="text-[10px] text-gray-400 font-mono">Live Sync</span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto">
            {filteredTickets.map((t) => (
              <div 
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`border p-3.5 rounded-2xl cursor-pointer transition relative overflow-hidden ${selectedTicketId === t.id ? 'border-teal-500 bg-teal-50/10 shadow-xs':'border-gray-150 bg-white hover:bg-gray-50/30'}`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-gray-700">{t.id}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                    t.status === 'open' ? 'bg-amber-100 text-amber-800 animate-pulse':'bg-gray-100 text-gray-500'
                  }`}>
                    {t.status}
                  </span>
                </div>
                
                <h4 className="font-display font-bold text-gray-800 text-xs mt-1.5 truncate">{t.customerName}</h4>
                <p className="text-[10px] text-indigo-750 font-bold font-mono mt-0.5 uppercase tracking-wide">
                  Category: {t.complaintType.replace('_', ' ')}
                </p>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-1 font-sans">{t.message}</p>
              </div>
            ))}
            {filteredTickets.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed p-4">
                No active complaints registered under this category!
              </div>
            )}
          </div>
        </div>

        {/* Right: Omnichannel Action box */}
        <div className="lg:col-span-8 flex flex-col justify-between border border-gray-100 rounded-3xl overflow-hidden bg-gray-50/40 h-[460px]">
          {activeTicket ? (
            <>
              {/* Top Details bar & Smart Templates */}
              <div className="bg-white border-b border-gray-100 p-4 shrink-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <div>
                    <h4 className="font-display font-bold text-gray-800 text-sm flex items-center gap-1.5">
                      <User className="w-4 h-4 text-gray-400" /> {activeTicket.customerName}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono block">Query Code: {activeTicket.id} | Contact: {activeTicket.phone}</span>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    <button 
                      onClick={() => triggerQuickResolution('We apologize. A full refund of the product amount has been credited to your Smart Wallet instantly.')}
                      className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[9px] py-1 px-2 rounded-lg transition"
                    >
                      Quick Refund
                    </button>
                    <button 
                      onClick={() => triggerQuickResolution('Apologies for the delay. The dispatch rider Ramesh is only 1.2 km away. ETA 4 mins.')}
                      className="bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 font-bold text-[9px] py-1 px-2 rounded-lg transition"
                    >
                      Quick ETA
                    </button>
                  </div>
                </div>

                {/* Omnichannel Selector buttons bar */}
                <div className="flex border-t pt-3 mt-3 gap-1 overflow-x-auto">
                  <button 
                    onClick={() => setCommChannel('chat')}
                    className={`px-3 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition ${
                      commChannel === 'chat' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-150'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" /> Live Chat
                  </button>
                  <button 
                    onClick={() => setCommChannel('whatsapp')}
                    className={`px-3 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition ${
                      commChannel === 'whatsapp' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-150'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp API
                  </button>
                  <button 
                    onClick={() => setCommChannel('email')}
                    className={`px-3 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition ${
                      commChannel === 'email' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-150'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </button>
                  <button 
                    onClick={() => setCommChannel('call')}
                    className={`px-3 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition ${
                      commChannel === 'call' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-150'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Log
                  </button>
                </div>
              </div>

              {/* Chat Thread / Integrations main viewport */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[250px]">
                
                {/* 1. Live Chat Interface */}
                {commChannel === 'chat' && (
                  <div className="space-y-3.5">
                    {activeTicket.messages.map((msg, ind) => (
                      <div 
                        key={ind} 
                        className={`flex flex-col max-w-[80%] ${msg.sender === 'support' ? 'ml-auto items-end':'mr-auto items-start'}`}
                      >
                        <div className={`p-3 rounded-2xl text-xs font-sans ${msg.sender === 'support' ? 'bg-teal-600 text-white rounded-tr-none':'bg-white text-gray-700 border rounded-tl-none shadow-xs'}`}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-gray-400 font-mono mt-1">{msg.timestamp} ({msg.sender === 'support' ? 'Agent' : 'Customer'})</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. WhatsApp Integration */}
                {commChannel === 'whatsapp' && (
                  <div className="space-y-4 p-2 font-mono text-[11px] leading-relaxed">
                    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl">
                      <span className="font-bold flex items-center gap-1 uppercase text-[10px] mb-1">
                        <MessageCircle className="w-4 h-4 text-green-700" /> WhatsApp Cloud Business integration active
                      </span>
                      Send automated transactional templates regarding complaint resolution instantly. Custom messages comply directly with WhatsApp SLA policies.
                    </div>

                    <div className="bg-white border p-3 rounded-xl space-y-2">
                      <span className="text-gray-400 text-[10px] uppercase block font-bold">Standard Opt-In Notification:</span>
                      <p className="bg-gray-50 p-2 text-gray-700 rounded border">
                        "Hi {activeTicket.customerName}, regarding your dairy complaint ticket {activeTicket.id} [{activeTicket.complaintType.toUpperCase()}], our FSSAI lab team has initialized resolution. We apologize for the hassle."
                      </p>
                      
                      <button 
                        onClick={handleTriggerWhatsapp}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl transition font-sans cursor-pointer uppercase tracking-wider text-[11px]"
                      >
                        Dispatch WhatsApp Template
                      </button>

                      {whatsappSent && (
                        <p className="text-green-700 text-center font-bold text-[10px] uppercase animate-pulse">
                          ✓ Sent API webhook successfully to {activeTicket.phone}!
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Email Integration */}
                {commChannel === 'email' && (
                  <div className="space-y-4 p-2 font-mono text-[11px] leading-relaxed">
                    <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-3.5 rounded-xl">
                      <span className="font-bold flex items-center gap-1 uppercase text-[10px] mb-1">
                        <Mail className="w-4 h-4 text-indigo-700" /> Corporate Mail Server Integration
                      </span>
                      Sends a formal resolution copy directly. Ideal for refund declarations or late feedback summaries.
                    </div>

                    <div className="bg-white border p-3 rounded-xl space-y-2 font-sans font-medium text-gray-700">
                      <div>
                        <strong>To:</strong> customer_df_comms_{activeTicket.customerId}@dairyfresh.co.in
                      </div>
                      <div className="border-t pt-1.5 mt-1">
                        <strong>Subject:</strong> [DAIRYFRESH SOLUTION TICKET #{activeTicket.id}] Regarding Freshness Resolution
                      </div>
                      <p className="bg-gray-50 p-2 rounded text-[11px] border font-mono">
                        "Dear Customer, we have marked your ticket {activeTicket.id} ({activeTicket.complaintType.toUpperCase()}) for reimbursement analysis. We prioritize cold chain safety standards..."
                      </p>
                      
                      <button 
                        onClick={handleTriggerEmail}
                        className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-1.5 rounded-xl transition cursor-pointer uppercase tracking-wider text-[10px]"
                      >
                        Dispatch Formal Resolution Email
                      </button>

                      {emailSent && (
                        <p className="text-indigo-700 text-center font-bold font-mono text-[10px] uppercase animate-pulse">
                          ✓ Mail parsed & routed successfully through SMTP relay!
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Call Center Integration */}
                {commChannel === 'call' && (
                  <div className="space-y-3 p-2 font-mono text-[11px]">
                    <div className="bg-amber-50 border border-amber-250 text-amber-800 p-3.5 rounded-xl">
                      <span className="font-bold flex items-center gap-1 uppercase text-[10px] mb-1">
                        <Phone className="w-4 h-4 text-amber-700 animate-bounce" /> Call Center Voice Notes Journal
                      </span>
                      Reps append voice notes from live outbound dials to compile comprehensive history.
                    </div>

                    <form onSubmit={handleAddCallNotes} className="flex gap-2">
                      <input 
                        type="text" 
                        value={callNotesText}
                        onChange={e => setCallNotesText(e.target.value)}
                        placeholder="Log calling summary (e.g., dial answer, reschedule)..."
                        className="flex-1 bg-white border rounded-xl p-2 focus:outline-hidden"
                      />
                      <button 
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 rounded-xl cursor-pointer"
                      >
                        Keep Log
                      </button>
                    </form>

                    <div className="space-y-1.5 max-h-24 overflow-y-auto pt-2 border-t font-sans font-semibold text-gray-600">
                      <span className="text-[10px] text-gray-450 block uppercase font-mono">Call Center Transcripts:</span>
                      {callNotesList.map((logStr, lIdx) => (
                        <div key={lIdx} className="bg-gray-100 p-2 rounded-lg text-[10.5px] border-l-4 border-amber-500 leading-normal">
                          {logStr}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Input Area (only useful for Live Chat) */}
              {commChannel === 'chat' ? (
                <form onSubmit={handleSendReply} className="bg-white border-t border-gray-100 p-3.5 flex gap-2 shrink-0">
                  <input 
                    type="text" 
                    placeholder="Type support reply or use templates above..." 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-150 text-xs focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                  <button 
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl transition shrink-0 cursor-pointer"
                  >
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </form>
              ) : (
                <div className="bg-white border-t p-3 text-center text-[11px] text-gray-400 font-medium font-sans shrink-0">
                  Transacting via <strong>{commChannel.toUpperCase()} INTEGRATED SUITE</strong>. Use templates to coordinate.
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-450 text-xs font-sans">
              No complaint tickets matches the selected filter metrics.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
