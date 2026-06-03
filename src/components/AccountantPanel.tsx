import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  IndianRupee, TrendingUp, TrendingDown, Percent, Calendar, FileSpreadsheet, 
  Check, RefreshCw, Layers, Plus, CreditCard, Tag, Landmark, User, Download
} from 'lucide-react';

export const AccountantPanel: React.FC = () => {
  const { finances, addSystemLog } = useApp();
  
  // Tab control matching specs
  const [activeTab, setActiveTab] = useState<'revenue' | 'expenses' | 'gst' | 'settlement'>('revenue');
  const [gstExported, setGstExported] = useState(false);

  // --- 1. Expense Tracking Input State ---
  const [expenseClass, setExpenseClass] = useState<'delivery' | 'vendor' | 'marketing'>('vendor');
  const [expenseDesc, setExpenseDesc] = useState('Payment for B-MILK-902 Organic Gir Cow Milk Yield');
  const [expenseAmt, setExpenseAmt] = useState(1250);
  const [expenseSuccess, setExpenseSuccess] = useState(false);

  // Live Accountant calculations based on finances log!
  const incomeRecords = finances.filter(f => f.category === 'revenue');
  const expenseRecords = finances.filter(f => f.category === 'expense');

  // Calculate distinct revenue streams
  const productSalesIncome = incomeRecords
    .filter(r => r.type === 'sale')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const subscriptionIncome = incomeRecords
    .filter(r => r.type === 'subscription_credit')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Delivery Charges Collected (simulated from active deliveries / convenience fees)
  const deliveryChargesIncome = incomeRecords.length * 40; // Flat 40 per order transaction simulated

  const totalIncome = productSalesIncome + subscriptionIncome + deliveryChargesIncome;
  
  // Custom expandable expense list
  const [customExpenses, setCustomExpenses] = useState([
    { id: 'exp_01', type: 'delivery', desc: 'Rider trip distance payout - Ramesh Kumar', amount: 180, date: '2026-06-02 08:30 AM' },
    { id: 'exp_02', type: 'vendor', desc: 'Krishna Cow Organic Supply Batch B40', amount: 4500, date: '2026-06-01 11:22 AM' },
    { id: 'exp_03', type: 'marketing', desc: 'Cashback referral credit - User DF50', amount: 350, date: '2026-06-01 02:40 PM' },
    { id: 'exp_04', type: 'marketing', desc: 'Acquisition discount campaign coupon: DAIRY20', amount: 240, date: '2026-06-02 10:15 AM' }
  ]);

  const totalExpenses = customExpenses.reduce((acc, curr) => acc + curr.amount, 0) + expenseRecords.reduce((acc, curr) => acc + curr.amount, 0);
  const operatingProfit = totalIncome - totalExpenses;

  // --- 2. Vendor Settlement state ---
  const [paymentCycle, setPaymentCycle] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [settledVendors, setSettledVendors] = useState([
    { name: 'Krishna Cow Organic', type: 'Direct Farm', outstanding: 4500, cycle: 'weekly', lastSettled: '2026-05-26', isPaid: false },
    { name: 'Green Valley Farms', type: 'Direct Farm', outstanding: 3200, cycle: 'weekly', lastSettled: '2026-05-26', isPaid: false },
    { name: 'Ramesh Kumar (Rider 1)', type: 'Rider Courier', outstanding: 420, cycle: 'daily', lastSettled: '2026-06-01', isPaid: false },
    { name: 'Amit Kumar (Rider 2)', type: 'Rider Courier', outstanding: 180, cycle: 'daily', lastSettled: '2026-06-01', isPaid: false }
  ]);
  const [settlementSuccess, setSettlementSuccess] = useState(false);

  // --- GST aggregation metrics (standard 5% GST base on dairy purchases, raw cow milk is 0% but Curd/Butter Ghee is 5%)
  const rawGstSalesVal = finances.reduce((acc, curr) => acc + curr.gstAmount, 0);
  
  // Custom Action: Submit dynamic expense log
  const handleAddCustomExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc.trim() || expenseAmt <= 0) return;
    
    const newExp = {
      id: `exp_${Math.floor(100 + Math.random() * 900)}`,
      type: expenseClass,
      desc: expenseDesc.trim(),
      amount: expenseAmt,
      date: new Date().toISOString().slice(0, 10) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCustomExpenses(prev => [newExp, ...prev]);
    addSystemLog('Accountant Audit', `Recorded custom operational expense: [${expenseClass.toUpperCase()}] "${expenseDesc.trim()}" for ₹${expenseAmt}`);
    setExpenseSuccess(true);
    setTimeout(() => {
      setExpenseSuccess(false);
      setExpenseDesc('');
    }, 2800);
  };

  // Custom Action: settle payouts individual selection
  const handleSingleSettle = (vendorName: string) => {
    setSettledVendors(prev => prev.map(v => {
      if (v.name === vendorName) {
        addSystemLog('Accountant Settlement', `Cleared outstanding payout settlement for vendor "${v.name}" amounting to ₹${v.outstanding}. Bank dispatch initialized.`);
        return { ...v, outstanding: 0, isPaid: true, lastSettled: '2026-06-02' };
      }
      return v;
    }));
  };

  // Settle all in cycle
  const handlePayoutSettleAll = () => {
    setSettlementSuccess(true);
    setSettledVendors(prev => prev.map(v => {
      if (v.cycle === paymentCycle && v.outstanding > 0) {
        addSystemLog('Accountant Settlement', `Cleared bulk cycle [${paymentCycle.toUpperCase()}] payouts for "${v.name}" amounting to ₹${v.outstanding}`);
        return { ...v, outstanding: 0, isPaid: true, lastSettled: '2026-06-02' };
      }
      return v;
    }));
    setTimeout(() => setSettlementSuccess(false), 3000);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[580px]" id="accountant-view">
      
      {/* Title */}
      <div className="border-b border-gray-100 pb-4 mb-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <span className="text-teal-600 font-bold text-xs uppercase tracking-widest font-mono">Financial Audits Unit</span>
          <h2 className="font-display font-semibold text-gray-800 text-lg flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-teal-600 animate-pulse" /> Accountant Ledger & settlements Center
          </h2>
        </div>
        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 py-1 px-3 rounded-full font-bold uppercase">
          Audit Compliant (FSSAI/GST IN)
        </span>
      </div>

      {/* Grid Summaries (Income, Expenses, Net Profit) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs font-mono">
        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute right-2 bottom-1 text-emerald-100 font-extrabold text-5xl font-mono select-none pointer-events-none opacity-40">IN</div>
          <span className="text-gray-400 block uppercase mb-1 font-sans text-[10px] font-bold">Aggregate Dairy Revenues</span>
          <strong className="text-emerald-700 text-lg font-black flex items-center">₹{totalIncome.toFixed(2)}</strong>
          <span className="text-gray-400 text-[10px] block mt-1 font-sans">Including subscription payments</span>
        </div>
        <div className="bg-red-50/30 border border-red-150/40 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute right-2 bottom-1 text-red-100 font-bold text-5xl font-mono select-none pointer-events-none opacity-30">EG</div>
          <span className="text-gray-400 block uppercase mb-1 font-sans text-[10px] font-bold">Operating Expenditures</span>
          <strong className="text-red-600 text-lg font-black flex items-center">₹{totalExpenses.toFixed(2)}</strong>
          <span className="text-gray-400 text-[10px] block mt-1 font-sans">Farms, marketing & trip payouts</span>
        </div>
        <div className="bg-indigo-50/50 border border-indigo-150 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute right-2 bottom-1 text-indigo-100 font-bold text-5xl font-mono select-none pointer-events-none opacity-40">NT</div>
          <span className="text-gray-400 block uppercase mb-1 font-sans text-[10px] font-bold">Net Audited Margins</span>
          <strong className="text-indigo-800 text-lg font-black flex items-center">₹{operatingProfit.toFixed(2)}</strong>
          <span className="text-gray-400 text-[10px] block mt-1 font-sans">Retained earnings available</span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex bg-gray-50 border p-1 rounded-2xl text-center text-xs font-semibold mb-6 overflow-x-auto self-start">
        <button 
          onClick={() => setActiveTab('revenue')}
          className={`flex-1 min-w-[130px] py-1.5 rounded-xl transition cursor-pointer ${activeTab === 'revenue' ? 'bg-white text-teal-700 shadow-sm font-bold':'text-gray-500 hover:text-gray-700'}`}
        >
          💰 Revenue Management
        </button>
        <button 
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 min-w-[130px] py-1.5 rounded-xl transition cursor-pointer ${activeTab === 'expenses' ? 'bg-white text-teal-700 shadow-sm font-bold':'text-gray-500 hover:text-gray-700'}`}
        >
          📂 Expense Ledgers
        </button>
        <button 
          onClick={() => setActiveTab('gst')}
          className={`flex-1 min-w-[130px] py-1.5 rounded-xl transition cursor-pointer ${activeTab === 'gst' ? 'bg-white text-teal-700 shadow-sm font-bold':'text-gray-500 hover:text-gray-700'}`}
        >
          🏛️ GST Compliance (GSTR)
        </button>
        <button 
          onClick={() => setActiveTab('settlement')}
          className={`flex-1 min-w-[130px] py-1.5 rounded-xl transition cursor-pointer ${activeTab === 'settlement' ? 'bg-white text-teal-700 shadow-sm font-bold':'text-gray-500 hover:text-gray-700'}`}
        >
          🤝 Vendor Settlements
        </button>
      </div>

      {/* Primary Tab displays */}
      <div className="bg-gray-50/40 border border-gray-100 rounded-3xl p-5 md:p-6 min-h-[300px]">
        
        {/* TAB 1: REVENUE MANAGEMENT */}
        {activeTab === 'revenue' && (
          <div className="space-y-5 text-xs font-mono">
            <div>
              <h3 className="font-display font-bold font-sans text-gray-800 text-sm">Revenue Management Hub</h3>
              <p className="text-gray-450 font-sans text-xs mt-0.5">Categorized breakdown of audited digital cash intakes in current cycle:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-xl p-4 space-y-2">
                <span className="bg-emerald-50 text-emerald-800 text-[9px] px-2 py-0.5 rounded uppercase font-bold">Source 1</span>
                <h4 className="font-sans font-semibold text-gray-400 text-xs uppercase text-[9px] block">Product Sales Intake</h4>
                <p className="text-gray-800 font-extrabold text-sm">₹{productSalesIncome.toFixed(2)}</p>
                <div className="text-[10px] text-gray-400 font-sans font-medium">Direct cart purchases & COD collections</div>
              </div>

              <div className="bg-white border rounded-xl p-4 space-y-2">
                <span className="bg-indigo-50 text-indigo-800 text-[9px] px-2 py-0.5 rounded uppercase font-bold">Source 2</span>
                <h4 className="font-sans font-semibold text-gray-400 text-xs uppercase text-[9px] block">Subscription prepays</h4>
                <p className="text-gray-800 font-extrabold text-sm">₹{subscriptionIncome.toFixed(2)}</p>
                <div className="text-[10px] text-gray-400 font-sans font-medium">Active smart milk wallet top-up prepays</div>
              </div>

              <div className="bg-white border rounded-xl p-4 space-y-2">
                <span className="bg-cyan-50 text-cyan-800 text-[9px] px-2 py-0.5 rounded uppercase font-bold">Source 3</span>
                <h4 className="font-sans font-semibold text-gray-400 text-xs uppercase text-[9px] block">Delivery Charges Collected</h4>
                <p className="text-gray-800 font-extrabold text-sm">₹{deliveryChargesIncome.toFixed(2)}</p>
                <div className="text-[10px] text-gray-400 font-sans font-medium">Convenience & delivery charges collected</div>
              </div>
            </div>

            {/* Audit log trail table */}
            <div className="bg-white border rounded-2xl p-4 space-y-3 font-sans">
              <span className="text-[10px] font-mono tracking-wider text-teal-700 uppercase font-black block">Recent Incoming Invoices:</span>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="text-[10px] text-gray-450 bg-gray-55/40 uppercase">
                    <tr>
                      <th className="p-2">Intake Ref</th>
                      <th className="p-2">Description</th>
                      <th className="p-2 text-right">Yield amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                    {finances.filter(f => f.category === 'revenue').map((rIdx) => (
                      <tr key={rIdx.id} className="hover:bg-gray-50/50">
                        <td className="p-2 font-bold text-gray-700">{rIdx.id}</td>
                        <td className="p-2 text-gray-500 font-sans font-medium">{rIdx.description}</td>
                        <td className="p-2 text-right text-green-600 font-bold">+₹{rIdx.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPENSE TRACKING */}
        {activeTab === 'expenses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            
            {/* Left: Adding Expense Ledger */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-display font-semibold text-gray-750 text-xs uppercase tracking-wider font-mono">Log Operational Expense</h3>
              
              <form onSubmit={handleAddCustomExpense} className="bg-white border rounded-2xl p-4 space-y-3.5">
                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-mono font-bold mb-1">Expense category</label>
                  <select 
                    value={expenseClass} 
                    onChange={e => {
                      const val = e.target.value as any;
                      setExpenseClass(val);
                      if (val === 'delivery') setExpenseDesc('Rider trip payouts & fuel allowance');
                      else if (val === 'vendor') setExpenseDesc('Wholesale payment for pasteurized bilona ghee bulk');
                      else setExpenseDesc('Customer referral referral cash back promotional code DF50');
                    }}
                    className="w-full bg-gray-50 border rounded-lg p-2 font-medium"
                  >
                    <option value="delivery">Delivery Cost & Trip Allowances</option>
                    <option value="vendor">Vendor/Farmer Yield Payments</option>
                    <option value="marketing">Customer Acquisition & Offline Referral Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-mono font-bold mb-1">Expense description</label>
                  <input 
                    type="text" 
                    value={expenseDesc}
                    onChange={e => setExpenseDesc(e.target.value)}
                    className="w-full bg-gray-50 border rounded-lg p-2 font-semibold"
                    placeholder="e.g. Packaging cartons & paper bags buying"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-gray-400 uppercase font-mono font-bold mb-1">Amount disbursed (INR)</label>
                  <input 
                    type="number" 
                    value={expenseAmt}
                    onChange={e => setExpenseAmt(parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-50 border rounded-lg p-2 font-mono font-bold text-red-600"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl transition cursor-pointer"
                >
                  Disburse Expense Outflow
                </button>

                {expenseSuccess && (
                  <p className="bg-red-50 text-red-800 text-[10px] text-center p-2 rounded-lg font-mono animate-pulse font-semibold">
                     Ledger Entry verified! Retained reserves adjusted.
                  </p>
                )}
              </form>
            </div>

            {/* Right: Custom Expense Ledger streams */}
            <div className="lg:col-span-8 space-y-3 font-mono">
              <h3 className="font-display font-semibold text-gray-700 text-xs uppercase tracking-wider font-sans">Operational Expense Journal</h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {customExpenses.map((exp) => (
                  <div key={exp.id} className="bg-white border rounded-xl p-3 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-extrabold uppercase py-0.5 px-2 rounded-sm ${
                          exp.type === 'delivery' ? 'bg-amber-100 text-amber-800' :
                          exp.type === 'vendor' ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {exp.type}
                        </span>
                        <strong className="text-gray-800">{exp.id}</strong>
                      </div>
                      <p className="text-[10.5px] text-gray-500 font-sans font-semibold mt-1">{exp.desc}</p>
                      <span className="text-[9.5px] text-gray-400 font-sans block mt-0.5">{exp.date}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <strong className="text-red-500 font-extrabold text-xs">-₹{exp.amount}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: GST MANAGEMENT */}
        {activeTab === 'gst' && (
          <div className="space-y-4 text-xs font-mono">
            <div>
              <h3 className="font-display font-sans font-bold text-gray-800 text-sm">GST Compliance Ledger Center</h3>
              <p className="text-gray-450 font-sans text-xs mt-0.5">Consolidated statutory GST reports for tax GSTR-1 & GSTR-3B filings:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Box 1: Liability filings */}
              <div className="bg-white border rounded-2xl p-5 space-y-3">
                <span className="bg-indigo-50 text-indigo-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase leading-none font-sans">
                  GSTR-1 (Outward Liabilities)
                </span>
                
                <div className="space-y-1.5 pt-2 border-b pb-3 leading-normal font-sans font-semibold">
                  <p className="text-gray-600 block text-[11px]">Total taxable sales of Ghee/Butter items (standard 5% taxation apply):</p>
                  <p className="text-gray-800 font-black text-sm font-mono">₹{rawGstSalesVal.toFixed(2)}</p>
                </div>

                <div className="space-y-1 bg-gray-50/50 p-2.5 rounded-xl border">
                  <span className="text-[9.5px] text-gray-450 uppercase block font-black">Outward GSTR-1 declared fields:</span>
                  <div className="flex justify-between">
                    <span>IGST (Inter-state):</span> <span>₹{(rawGstSalesVal * 0.4).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-1">
                    <span>CGST + SGST (Intra-state):</span> <span>₹{(rawGstSalesVal * 0.6).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Input credit filings */}
              <div className="bg-white border rounded-2xl p-5 space-y-3">
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase leading-none font-sans">
                  GSTR-3B (Filings & ITC Balance)
                </span>

                <div className="space-y-1.5 pt-2 border-b pb-3 leading-normal font-sans font-semibold">
                  <p className="text-gray-600 block text-[11px]">Availed Input Tax Credit (Chilled transport, diesel excise, dairy packing):</p>
                  <p className="text-emerald-700 font-black text-sm font-mono">₹{(rawGstSalesVal * 0.35).toFixed(2)}</p>
                </div>

                <div className="space-y-2 font-sans">
                  <div className="flex justify-between font-mono font-bold text-teal-800">
                    <span>Net GST Payable (R1 - R3B):</span>
                    <span>₹{(rawGstSalesVal * 0.65).toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      addSystemLog('Taxation Unit', 'Exported certified digital GSTR GSTR-1 & GSTR-3B spreadsheets directly.');
                      setGstExported(true);
                      setTimeout(() => setGstExported(false), 4000);
                    }}
                    className="w-full bg-indigo-950 text-white font-bold py-2 rounded-xl hover:bg-indigo-900 transition flex items-center justify-center gap-1 font-mono uppercase tracking-wider cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-white" /> Download GSTR Excel Report
                  </button>
                  {gstExported && (
                    <div className="bg-indigo-50 border border-indigo-100 text-indigo-805 p-2 rounded-xl text-center text-[11px] animate-pulse">
                      ✓ GST GSTR-1 & GSTR-3B spreadsheets generated & exported successfully!
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: VENDOR SETTLEMENTS */}
        {activeTab === 'settlement' && (
          <div className="space-y-5 text-xs font-mono">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h3 className="font-display font-sans font-bold text-gray-800 text-sm">Vendor Settlement Matrix</h3>
                <p className="text-gray-450 font-sans text-xs mt-0.5">Manage automated payout schedules & banking API releases for direct dairy farms and riders:</p>
              </div>

              <div className="flex bg-white border p-1 rounded-xl font-sans font-semibold">
                {(['daily', 'weekly', 'monthly'] as const).map(cycle => (
                  <button
                    key={cycle}
                    onClick={() => setPaymentCycle(cycle)}
                    className={`py-1 px-3 rounded-lg text-[10px] uppercase transition cursor-pointer ${paymentCycle === cycle ? 'bg-teal-600 text-white font-bold':'text-gray-500 hover:text-gray-700'}`}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>

            {/* Vendor List for selected cycle */}
            <div className="bg-white border rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-[10px] tracking-wider text-teal-700 uppercase font-black block">Active Outstandings ({paymentCycle.toUpperCase()} cycle):</span>
                <button 
                  onClick={handlePayoutSettleAll}
                  className="bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-sans font-semibold py-1 px-2 rounded-md transition cursor-pointer"
                >
                  Settle All {paymentCycle.toUpperCase()} Balances
                </button>
              </div>

              <div className="space-y-2">
                {settledVendors.filter(v => v.cycle === paymentCycle).map((vendor, vIdx) => (
                  <div key={vIdx} className="flex justify-between items-center text-xs p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-gray-850 font-sans">{vendor.name}</strong>
                        <span className="text-[9.5px] uppercase bg-gray-150 text-gray-600 py-0.2 px-1.5 rounded-sm shrink-0">{vendor.type}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-sans font-medium mt-0.5">Last transaction cleared: {vendor.lastSettled}</p>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2.5">
                      <div className="font-mono">
                        <span className="block text-[8px] text-gray-450 font-sans uppercase">Outstanding</span>
                        <strong className={`block text-xs font-black ${vendor.outstanding > 0 ? 'text-red-500':'text-teal-700'}`}>
                          ₹{vendor.outstanding}
                        </strong>
                      </div>
                      {vendor.outstanding > 0 ? (
                        <button 
                          onClick={() => handleSingleSettle(vendor.name)}
                          className="bg-white border hover:bg-teal-50 text-teal-700 font-bold text-[10px] p-1.5 rounded-lg transition font-sans cursor-pointer"
                        >
                          Disburse Balance
                        </button>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-1 rounded font-bold font-sans uppercase">
                          Disbursed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {settlementSuccess && (
              <p className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-center p-3 rounded-2xl font-sans font-semibold animate-bounce mt-3">
                 SUCCESS. Digital payouts cleared matching direct banking protocols. Systems updated!
              </p>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
