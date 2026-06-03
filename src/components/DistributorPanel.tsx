import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Network, Users, Map, Shuffle, Check, Flag, Compass, ChevronRight, BarChart3, 
  TrendingUp, MapPin, Truck, AlertCircle, ShoppingBag, Plus, Sparkles, Tag, Layers
} from 'lucide-react';

export const DistributorPanel: React.FC = () => {
  const { deliveryPartners, orders, addSystemLog, products } = useApp();
  
  // UI Tabs corresponding to requested specs
  const [activeTab, setActiveTab] = useState<'management' | 'stock' | 'sales' | 'delivery'>('management');

  // --- 1. State for Distributor & Zone & Vendor Management ---
  const [distributors, setDistributors] = useState([
    { id: 'dist_01', name: 'Gurgaon Sector 56 Hub', code: 'GGN-SEC56', lead: 'Rajesh Yadav', phone: '+91 98110 54321', coverage: ['Sector 55', 'Sector 56', 'Sector 57', 'Golf Course Road'], vendors: ['Green Valley Organic Farms', 'Krishna Cow Organic'] },
    { id: 'dist_02', name: 'South Delhi Central Hub', code: 'DEL-SEXT', lead: 'Amit Sharma', phone: '+91 99532 98765', coverage: ['South Ext', 'Hauz Khas', 'Green Park', 'Greater Kailash'], vendors: ['AyurVeda A2 Farm'] },
    { id: 'dist_03', name: 'Noida Central Hub', code: 'ND-SEC62', lead: 'Suresh Nagar', phone: '+91 97188 55432', coverage: ['Sector 15', 'Sector 18', 'Sector 62', 'Indirapuram'], vendors: ['Vedic Bio Farms'] }
  ]);

  const [selectedDistributorId, setSelectedDistributorId] = useState<string>('dist_01');
  const currentDist = distributors.find(d => d.id === selectedDistributorId) || distributors[0];

  // Areas Management input
  const [newAreaInput, setNewAreaInput] = useState('');
  
  // Vendor Allocation select
  const [availVendors] = useState([
    'Krishna Cow Organic',
    'Green Valley Organic Farms',
    'AyurVeda A2 Farm',
    'Vedic Bio Farms',
    'Choudhary Organic Dairy',
    'Nandini Premium Cow Farm'
  ]);
  const [selectedVendorToAllocate, setSelectedVendorToAllocate] = useState('Choudhary Organic Dairy');

  // --- 2. State for Stock Distribution ---
  const [stockProduct, setStockProduct] = useState('Milk 1L');
  const [stockQty, setStockQty] = useState(250);
  const [stockSuccess, setStockSuccess] = useState(false);

  // --- Distributor Management Actions ---
  const handleAddArea = () => {
    if (!newAreaInput.trim()) return;
    setDistributors(prev => prev.map(d => {
      if (d.id === selectedDistributorId) {
        return {
          ...d,
          coverage: [...d.coverage, newAreaInput.trim()]
        };
      }
      return d;
    }));
    addSystemLog('Franchise Engine', `Area allocation expanded. Added "${newAreaInput.trim()}" coverage to distributor ${currentDist.name}`);
    setNewAreaInput('');
  };

  const handleRemoveArea = (areaName: string) => {
    setDistributors(prev => prev.map(d => {
      if (d.id === selectedDistributorId) {
        return {
          ...d,
          coverage: d.coverage.filter(a => a !== areaName)
        };
      }
      return d;
    }));
    addSystemLog('Franchise Engine', `Removed geographical boundary "${areaName}" from hub ${currentDist.name}`);
  };

  const handleAllocateVendor = () => {
    if (currentDist.vendors.includes(selectedVendorToAllocate)) {
      addSystemLog('Franchise Engine', `Vendor "${selectedVendorToAllocate}" is already assigned to ${currentDist.name}`);
      return;
    }
    setDistributors(prev => prev.map(d => {
      if (d.id === selectedDistributorId) {
        return {
          ...d,
          vendors: [...d.vendors, selectedVendorToAllocate]
        };
      }
      return d;
    }));
    addSystemLog('Franchise Engine', `Re-allocated single-origin vendor "${selectedVendorToAllocate}" to ${currentDist.name}`);
  };

  const handleDeallocateVendor = (vendorName: string) => {
    setDistributors(prev => prev.map(d => {
      if (d.id === selectedDistributorId) {
        return {
          ...d,
          vendors: d.vendors.filter(v => v !== vendorName)
        };
      }
      return d;
    }));
    addSystemLog('Franchise Engine', `De-allocated vendor relationship of "${vendorName}" from hub ${currentDist.name}`);
  };

  // --- Stock Distribution Function ---
  const handleStockDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setStockSuccess(true);
    addSystemLog('Franchise Logistics Engine', `Stock replenishment completed. Dispatched ${stockQty} units of ${stockProduct} directly from Cold Vault inside of ${currentDist.name}`);
    setTimeout(() => setStockSuccess(false), 3000);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[580px]" id="distributor-view">
      
      {/* Header and Title */}
      <div className="border-b border-gray-100 pb-4 mb-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <span className="text-teal-600 font-bold text-xs uppercase tracking-widest font-mono">Operations Portal</span>
          <h2 className="font-display font-semibold text-gray-800 text-lg flex items-center gap-2">
            <Network className="w-5 h-5 text-teal-600 animate-pulse" /> Franchise & Distributor Command Console
          </h2>
        </div>
        <span className="text-[10px] font-mono bg-teal-50 text-teal-800 border border-teal-100 py-1 px-2.5 rounded-full font-bold">
          {distributors.length} Gird Hubs Online
        </span>
      </div>

      {/* Main Pillars Navigation bar */}
      <div className="flex bg-gray-50 border p-1 rounded-2xl text-center text-xs font-semibold mb-6 overflow-x-auto self-start">
        <button 
          onClick={() => setActiveTab('management')}
          className={`flex-1 min-w-[130px] py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'management' ? 'bg-white text-teal-700 shadow-sm font-bold':'text-gray-500 hover:text-gray-700'}`}
        >
          🗺️ Distributor Management
        </button>
        <button 
          onClick={() => setActiveTab('stock')}
          className={`flex-1 min-w-[130px] py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'stock' ? 'bg-white text-teal-700 shadow-sm font-bold':'text-gray-500 hover:text-gray-700'}`}
        >
          📦 Stock Distribution
        </button>
        <button 
          onClick={() => setActiveTab('sales')}
          className={`flex-1 min-w-[130px] py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'sales' ? 'bg-white text-teal-700 shadow-sm font-bold':'text-gray-500 hover:text-gray-700'}`}
        >
          📈 Sales Monitoring
        </button>
        <button 
          onClick={() => setActiveTab('delivery')}
          className={`flex-1 min-w-[130px] py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'delivery' ? 'bg-white text-teal-700 shadow-sm font-bold':'text-gray-500 hover:text-gray-700'}`}
        >
          🚴 Delivery Tracking
        </button>
      </div>

      {/* Grid Layout containing selector and content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Distributor Selector Grid */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-display font-semibold text-gray-700 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-teal-600" /> Regional Franchise Hubs
          </h3>
          <div className="space-y-3">
            {distributors.map((dist) => (
              <div 
                key={dist.id} 
                onClick={() => setSelectedDistributorId(dist.id)}
                className={`border p-4 rounded-2xl cursor-pointer transition flex flex-col justify-between ${selectedDistributorId === dist.id ? 'border-teal-500 bg-teal-50/15 shadow-xs':'border-gray-150 hover:bg-gray-50/50'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-display font-bold text-gray-800 text-xs">{dist.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-mono">Code: {dist.code}</p>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-gray-100 text-gray-700 py-0.5 px-2 rounded-md">
                    {dist.coverage.length} Areas
                  </span>
                </div>
                
                <div className="pt-3 border-t border-gray-100/50 mt-3 flex justify-between text-[11px] font-sans text-gray-500">
                  <span>Lead: <strong className="text-gray-700">{dist.lead}</strong></span>
                  <span className="text-teal-700 font-semibold font-mono">{dist.vendors.length} Farm Vendors</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border p-4 rounded-2xl font-mono text-xs text-gray-500 leading-normal">
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide block mb-1">Grid Area Control Unit</span>
            Use the right tabs to configure logistics, manage supply ratios, track sales, and audit active couriers.
          </div>
        </div>

        {/* Right Side: Tab Specific Functionalities */}
        <div className="lg:col-span-8 bg-gray-50/40 border border-gray-100 rounded-3xl p-5 md:p-6 space-y-5">
          
          {/* TAB 1: DISTRIBUTOR & ZONE & VENDOR ALLOCATION */}
          {activeTab === 'management' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="font-display font-bold text-gray-800 text-sm">Zone Allocation & Areas</h3>
                <p className="text-gray-400 text-xs font-sans mt-0.5">Manage geographical dispatches and regional sectors assigned to <strong>{currentDist.name}</strong></p>
              </div>

              {/* Areas & Zone segment */}
              <div className="bg-white border rounded-2xl p-4 space-y-4">
                <span className="text-[10px] font-mono tracking-wider text-teal-700 uppercase font-black block">Active Areas coverage:</span>
                
                <div className="flex flex-wrap gap-1.5">
                  {currentDist.coverage.map((area, valIdx) => (
                    <span key={valIdx} className="bg-gray-150 text-gray-700 pl-2.5 pr-1.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 hover:bg-red-50 hover:text-red-700 transition group">
                      {area}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveArea(area)}
                        className="text-gray-400 group-hover:text-red-500 hover:bg-gray-200/55 rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {currentDist.coverage.length === 0 && (
                    <p className="text-gray-400 italic font-sans py-1">No sectors assigned for distribution.</p>
                  )}
                </div>

                {/* Add Area */}
                <div className="flex gap-2 border-t pt-3.5">
                  <input 
                    type="text" 
                    value={newAreaInput}
                    onChange={(e) => setNewAreaInput(e.target.value)}
                    placeholder="Add Sector (e.g. DLF Phase 1, Cyber City)"
                    className="flex-1 bg-gray-50 border p-2 rounded-xl text-xs font-sans focus:outline-hidden"
                  />
                  <button 
                    type="button"
                    onClick={handleAddArea}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Allocate
                  </button>
                </div>
              </div>

              {/* Vendor Allocation Segment */}
              <div className="bg-white border rounded-2xl p-4 space-y-4">
                <div>
                  <h4 className="font-display font-semibold text-gray-800 text-xs">Farm Vendor Allocation Matrix</h4>
                  <p className="text-gray-400 text-[11px] font-sans">Map single-origin dairy farms to route pasteurized yields into this Chilling Hub.</p>
                </div>

                <div className="space-y-2 border-b pb-3 text-xs">
                  <div className="flex items-center justify-between text-gray-400 pb-1.5 border-b border-gray-50">
                    <span>Vendor Source Name</span>
                    <span>Status</span>
                  </div>
                  {currentDist.vendors.map((vendor, vIdx) => (
                    <div key={vIdx} className="flex justify-between items-center py-1">
                      <span className="font-medium text-gray-700 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-teal-600" /> {vendor}
                      </span>
                      <button 
                        type="button"
                        onClick={() => handleDeallocateVendor(vendor)}
                        className="text-red-500 hover:underline text-[10px] font-bold font-mono uppercase"
                      >
                        De-allocate
                      </button>
                    </div>
                  ))}
                </div>

                {/* New vendor allocation selector */}
                <div className="flex gap-2 items-center text-xs">
                  <div className="flex-1">
                    <span className="block text-[9px] text-gray-400 font-mono mb-1">Available Dairy Vendors:</span>
                    <select 
                      value={selectedVendorToAllocate} 
                      onChange={e => setSelectedVendorToAllocate(e.target.value)}
                      className="w-full bg-gray-50 border rounded-lg p-2 font-medium"
                    >
                      {availVendors.map((av, avIdx) => (
                        <option key={avIdx} value={av}>{av}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="button"
                    onClick={handleAllocateVendor}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold p-2.5 rounded-lg text-xs self-end cursor-pointer"
                  >
                    Map Vendor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STOCK DISTRIBUTION */}
          {activeTab === 'stock' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="font-display font-bold text-gray-800 text-sm">Stock Distribution Engine</h3>
                <p className="text-gray-400 text-xs font-sans mt-0.5">replenish cold stocks inside <strong>{currentDist.name}</strong></p>
              </div>

              <form onSubmit={handleStockDispatch} className="bg-white border rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono mb-1 uppercase font-bold tracking-wider">Product Inventory Storage:</label>
                    <select 
                      value={stockProduct}
                      onChange={e => setStockProduct(e.target.value)}
                      className="w-full bg-gray-50 border rounded-xl p-2.5 font-bold text-gray-800"
                    >
                      <option value="Raw Milk (Pasteurized Silos)">Cow Milk 1L (Pasteurized)</option>
                      <option value="Premium Organic Bilona Ghee">Organic Bilona Ghee 500ml</option>
                      <option value="Premium Cheddar Cheese Block">Cheddar Cheese 200g</option>
                      <option value="Fresh Curd / Yogurt Sieve">Cream Probiotic Curd 400g</option>
                      <option value="Belgian Choco Ice Cream">Ice Cream Belgian Chocolate 1L</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono mb-1 uppercase font-bold tracking-wider">Distribution Hub Target:</label>
                    <input 
                      type="text" 
                      value={currentDist.name} 
                      disabled 
                      className="w-full bg-gray-100 border rounded-xl p-2.5 text-gray-600 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 font-mono mb-1 uppercase font-bold tracking-wider"> replenishing count (L / kg / units):</label>
                  <input 
                    type="range" 
                    min="50" 
                    max="1000" 
                    step="25"
                    value={stockQty} 
                    onChange={e => setStockQty(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-gray-400 mt-1">
                    <span>50 qty</span>
                    <span className="text-teal-700 font-bold">{stockQty} Qty Dispatched</span>
                    <span>1,000 qty</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold p-3 rounded-xl transition flex items-center justify-center gap-1.5 uppercase font-mono tracking-widest cursor-pointer"
                >
                  <Truck className="w-4 h-4" /> Trigger Logistics Replenishment
                </button>

                {stockSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl font-semibold flex items-center gap-2 animate-pulse">
                    <Check className="w-4 h-4 text-green-700" />
                    <span>Distribution Order verified! Fleet assigned for direct single-origin dispatch.</span>
                  </div>
                )}
              </form>

              {/* Status block */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border rounded-xl p-3 text-center">
                  <span className="text-gray-400 block text-[9px] uppercase font-mono">MILK SUMP</span>
                  <span className="text-gray-800 font-bold font-mono">2,200 L</span>
                </div>
                <div className="bg-white border rounded-xl p-3 text-center">
                  <span className="text-gray-400 block text-[9px] uppercase font-mono">BUTTER VAULT</span>
                  <span className="text-gray-800 font-bold font-mono">350 kg</span>
                </div>
                <div className="bg-white border rounded-xl p-3 text-center">
                  <span className="text-gray-400 block text-[9px] uppercase font-mono">CHEESE CELLAR</span>
                  <span className="text-gray-800 font-bold font-mono">410 kg</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SALES MONITORING */}
          {activeTab === 'sales' && (
            <div className="space-y-4 text-xs font-mono">
              <div>
                <h3 className="font-display font-sans font-bold text-gray-800 text-sm">Zone Sales Monitoring</h3>
                <p className="text-gray-400 font-sans text-xs mt-0.5">Real-time revenue performance metric dashboard for <strong>{currentDist.name}</strong></p>
              </div>

              {/* Revenue widgets */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border p-3.5 rounded-xl">
                  <span className="text-gray-400 block uppercase text-[9px] font-sans">Product Sales</span>
                  <strong className="text-gray-800 text-sm">₹1,84,200</strong>
                  <span className="text-emerald-600 block text-[9px] font-sans font-bold mt-0.5">▲ 12.4% MoM</span>
                </div>
                <div className="bg-white border p-3.5 rounded-xl">
                  <span className="text-gray-400 block uppercase text-[9px] font-sans">Subscription Cash</span>
                  <strong className="text-gray-800 text-sm">₹95,500</strong>
                  <span className="text-emerald-600 block text-[9px] font-sans font-bold mt-0.5">▲ 8.1% MoM</span>
                </div>
                <div className="bg-white border p-3.5 rounded-xl">
                  <span className="text-gray-400 block uppercase text-[9px] font-sans">Profit margins</span>
                  <strong className="text-teal-700 text-sm">34.2% Net</strong>
                  <span className="text-gray-400 block text-[9px] font-sans mt-0.5">Certified FSSAI</span>
                </div>
              </div>

              {/* Pure Visual SVG Area Chart inside the console */}
              <div className="bg-white border rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-xs font-bold font-sans">MoM Yield & Revenue Trend (₹ '000)</span>
                  <span className="text-[10px] text-gray-400">Current Qtr - FY 2026</span>
                </div>
                
                {/* SVG Visual Bar/Line rendering representing real layout visually */}
                <div className="h-28 w-full border-b border-l flex items-end justify-between px-2 pt-4 relative">
                  
                  {/* Grid lines */}
                  <div className="absolute left-0 right-0 top-[25%] border-t border-gray-100 border-dashed w-full" />
                  <div className="absolute left-0 right-0 top-[50%] border-t border-gray-100 border-dashed w-full" />
                  <div className="absolute left-0 right-0 top-[75%] border-t border-gray-100 border-dashed w-full" />

                  {/* High Value indicator */}
                  <div className="absolute left-1 top-1 bg-gray-50 text-gray-500 font-mono text-[8px] border rounded px-1 scale-90">MAX ₹1.2L</div>

                  {/* Columns */}
                  <div className="flex flex-col items-center w-full group relative z-10">
                    <span className="bg-teal-500/10 text-teal-800 text-[8px] font-bold py-0.5 px-1 rounded line-clamp-1 opacity-0 group-hover:opacity-100 scale-90 mb-1 transition-all">-</span>
                    <div className="w-8 bg-teal-600 rounded-t-sm transition-all group-hover:bg-teal-500" style={{ height: '35px' }} />
                    <span className="text-[9px] text-gray-450 mt-1">Jan</span>
                  </div>

                  <div className="flex flex-col items-center w-full group relative z-10">
                    <span className="bg-teal-500/10 text-teal-800 text-[8px] font-bold py-0.5 px-1 rounded line-clamp-1 opacity-0 group-hover:opacity-100 scale-90 mb-1 transition-all">-</span>
                    <div className="w-8 bg-teal-600 rounded-t-sm transition-all group-hover:bg-teal-500" style={{ height: '48px' }} />
                    <span className="text-[9px] text-gray-455 mt-1">Feb</span>
                  </div>

                  <div className="flex flex-col items-center w-full group relative z-10">
                    <span className="bg-teal-500/10 text-teal-800 text-[8px] font-bold py-0.5 px-1 rounded line-clamp-1 opacity-0 group-hover:opacity-100 scale-90 mb-1 transition-all">-</span>
                    <div className="w-8 bg-teal-600 rounded-t-sm transition-all group-hover:bg-teal-500" style={{ height: '70px' }} />
                    <span className="text-[9px] text-gray-450 mt-1">Mar</span>
                  </div>

                  <div className="flex flex-col items-center w-full group relative z-10">
                    <span className="bg-teal-500/10 text-teal-800 text-[8px] font-bold py-0.5 px-1 rounded line-clamp-1 opacity-0 group-hover:opacity-100 scale-90 mb-1 transition-all">-</span>
                    <div className="w-8 bg-teal-600 rounded-t-sm transition-all group-hover:bg-teal-500" style={{ height: '62px' }} />
                    <span className="text-[9px] text-gray-450 mt-1">Apr</span>
                  </div>

                  <div className="flex flex-col items-center w-full group relative z-10">
                    <span className="bg-teal-500/10 text-teal-850 text-[8px] font-bold py-0.5 px-1 rounded line-clamp-1 opacity-0 group-hover:opacity-100 scale-90 mb-1 transition-all">₹1.15L</span>
                    <div className="w-8 bg-teal-600 rounded-t-sm transition-all group-hover:bg-teal-500" style={{ height: '90px' }} />
                    <span className="text-[9px] text-gray-450 mt-1">May</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DELIVERY COMMAND MONITOR */}
          {activeTab === 'delivery' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display font-sans font-bold text-gray-800 text-sm">Zone Delivery Monitoring</h3>
                  <p className="text-gray-400 font-sans text-xs mt-0.5">Live shipment tracking and courier transit telemetry</p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 text-[9px] py-1 px-2 rounded border border-emerald-100 uppercase animate-pulse">ACTIVE GPS MATRIX</span>
              </div>

              {/* Rider quick status matrix */}
              <div className="bg-white border rounded-2xl p-4 space-y-3 font-sans">
                <span className="text-[10px] font-mono tracking-wider text-teal-700 uppercase font-black block">Zone Grid Couriers:</span>
                
                <div className="space-y-2">
                  {deliveryPartners.length === 0 ? (
                    <p className="text-gray-400 italic text-center py-4">No active couriers available in this zone grid.</p>
                  ) : (
                    deliveryPartners.map((rider, keyIdx) => (
                      <div key={keyIdx} className="flex justify-between items-center text-xs p-3 bg-gray-50 rounded-xl border border-gray-150">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <strong className="text-gray-800">{rider.name}</strong>
                            <span className={`text-[8px] font-semibold py-0.5 px-1.5 rounded uppercase font-mono ${
                              rider.status === 'online' ? 'bg-emerald-100 text-emerald-800':'bg-gray-150 text-gray-500'
                            }`}>
                              {rider.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-450 block font-mono">Vehicle ID: {rider.plateNumber} ({rider.vehicleType})</span>
                        </div>

                        <div className="text-right">
                          <span className="text-teal-700 font-mono font-bold block">★ {rider.totalTrips} Trips</span>
                          <span className="text-[10px] text-gray-400 block font-mono">Payout: ₹{rider.earnings}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Visual Active shipments summary */}
              <div className="bg-white border rounded-2xl p-4 space-y-3 font-sans">
                <span className="text-[10px] font-mono tracking-wider text-teal-700 uppercase font-black block">Direct-to-Home Orders In Transit:</span>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {orders.filter(o => o.status !== 'delivered' && o.status !== 'rejected').map((o) => (
                    <div key={o.id} className="border-b border-gray-100 pb-2.5 last:border-0 last:pb-0 font-mono text-[11px] flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1">
                          <strong className="text-gray-800 font-black">{o.id}</strong>
                          <span className="text-gray-450">• {o.customerName}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 pr-2 block truncate font-sans">{o.customerAddress}</p>
                        <span className="text-[9.5px] bg-teal-50 text-teal-800 px-1.5 rounded font-bold uppercase mt-1 leading-none inline-block font-mono">
                          {o.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right font-sans shrink-0 font-semibold text-gray-700">
                        <span>₹{o.total}</span>
                        <span className="block text-[8px] text-gray-400 font-mono">OTP Code: {o.deliveryOtp}</span>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.status !== 'delivered' && o.status !== 'rejected').length === 0 && (
                    <p className="text-gray-400 italic text-center py-4 font-sans text-xs">No active in-transit shipments in this cycle.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
