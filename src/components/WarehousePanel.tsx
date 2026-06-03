import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Snowflake, Thermometer, AlertOctagon, Check, Clock, ShieldCheck, ChevronRight, 
  RefreshCw, LogOut, Disc, Calendar, Layers, Truck, Map, ShieldAlert, Plus, Shield
} from 'lucide-react';

export const WarehousePanel: React.FC = () => {
  const { coldUnits, updateTemperature, dispatchBatch, addSystemLog, products } = useApp();
  
  // Tab-based navigation
  const [activeTab, setActiveTab] = useState<'inventory' | 'temperature' | 'dispatch'>('inventory');

  // Thermostat state
  const [adjustingUnitId, setAdjustingUnitId] = useState<string | null>(null);
  const [sliderVal, setSliderVal] = useState(3.4);

  // --- 1. Expiry & Batch Tracking state ---
  const [warehouseBatches, setWarehouseBatches] = useState([
    { batchNumber: 'B-MILK-902', name: 'Raw Milk (Gir Cow Silo A)', category: 'Milk', quantity: '1200 Litres', productionDate: '2026-06-01', expiryDate: '2026-06-04', labReportStatus: 'approved', alertType: 'normal' },
    { batchNumber: 'B-BTR-409', name: 'Fresh Salted Whipped Butter', category: 'Butter', quantity: '140 kg', productionDate: '2026-05-28', expiryDate: '2026-06-28', labReportStatus: 'approved', alertType: 'normal' },
    { batchNumber: 'B-CHS-110', name: 'Artisanal Aged Guda Cheese', category: 'Cheese', quantity: '80 kg', productionDate: '2026-04-10', expiryDate: '2026-06-10', labReportStatus: 'approved', alertType: 'warning' }, // Expiring soon
    { batchNumber: 'B-ICM-201', name: 'Belgian Choco Cream Tub', category: 'Ice Cream', quantity: '310 Tubs', productionDate: '2026-05-25', expiryDate: '2026-06-03', labReportStatus: 'approved', alertType: 'alert' } // Expiring tomorrow
  ]);

  // Simulated addition of active batch
  const [newBatchName, setNewBatchName] = useState('Gir Cow Milk A2');
  const [newBatchCategory, setNewBatchCategory] = useState<'Milk' | 'Butter' | 'Cheese' | 'Ice Cream'>('Milk');
  const [newBatchVol, setNewBatchVol] = useState('500 Litres');
  const [newBatchSuccess, setNewBatchSuccess] = useState(false);

  // --- 2. Dispatch Management State ---
  const [dispatchBatchNum, setDispatchBatchNum] = useState('B-MILK-902');
  const [assignedVehicle, setAssignedVehicle] = useState('Insulated Chilled Mini Truck HR-26B');
  const [plannedRoute, setPlannedRoute] = useState('Route Alpha: Direct Express Highway Cybercity');
  const [dispatchSucceeded, setDispatchSucceeded] = useState(false);

  // Thermostat Calibration
  const handleTempSliderChange = (unitId: string, val: number) => {
    updateTemperature(unitId, val);
  };

  const handleOpenSlider = (unitId: string, current: number) => {
    setAdjustingUnitId(unitId);
    setSliderVal(current);
  };

  // Add Production Batch
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const bId = `B-${newBatchCategory.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newB = {
      batchNumber: bId,
      name: newBatchName,
      category: newBatchCategory,
      quantity: newBatchVol,
      productionDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 Days default
      labReportStatus: 'approved' as const,
      alertType: 'normal'
    };
    setWarehouseBatches(prev => [newB, ...prev]);
    addSystemLog('Warehouse Inventory', `Registered Production Batch ${bId} / Category: "${newBatchCategory}" into digital cold chain tracking.`);
    setNewBatchSuccess(true);
    setTimeout(() => setNewBatchSuccess(false), 3000);
  };

  const handleFormDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setDispatchSucceeded(true);
    addSystemLog('Dispatch Operations', `Authorized batch dispatch for "${dispatchBatchNum}". Vehicle allocated: "${assignedVehicle}" mapping Route: "${plannedRoute}". Outbound dispatch complete.`);
    setTimeout(() => {
      setDispatchSucceeded(false);
      setWarehouseBatches(prev => prev.filter(b => b.batchNumber !== dispatchBatchNum));
    }, 2800);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[580px]" id="warehouse-view">
      
      {/* Title */}
      <div className="border-b border-gray-100 pb-4 mb-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div>
          <span className="text-teal-600 font-bold text-xs uppercase tracking-widest font-mono">Cold Chain Monitors</span>
          <h2 className="font-display font-semibold text-gray-800 text-lg flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-teal-600 animate-spin-slow animate-pulse" /> Warehouse & Cold Storage Command Panel
          </h2>
        </div>
        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 py-1 px-3 rounded-full font-bold uppercase">
          CS-1 Chiller Hub Online Status
        </span>
      </div>

      {/* Tabs Menu */}
      <div className="flex bg-gray-50 border p-1 rounded-2xl text-center text-xs font-semibold mb-6 overflow-x-auto self-start">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 min-w-[150px] py-2 rounded-xl transition cursor-pointer ${activeTab === 'inventory' ? 'bg-white text-teal-700 shadow-sm font-bold':'text-gray-500 hover:text-gray-700'}`}
        >
          🥛 Inventory & Expiry Tracking
        </button>
        <button 
          onClick={() => setActiveTab('temperature')}
          className={`flex-1 min-w-[150px] py-2 rounded-xl transition cursor-pointer ${activeTab === 'temperature' ? 'bg-white text-teal-700 shadow-sm font-bold':'text-gray-500 hover:text-gray-700'}`}
        >
          🌡️ Live Thermostat Units
        </button>
        <button 
          onClick={() => setActiveTab('dispatch')}
          className={`flex-1 min-w-[150px] py-2 rounded-xl transition cursor-pointer ${activeTab === 'dispatch' ? 'bg-white text-teal-700 shadow-sm font-bold':'text-gray-500 hover:text-gray-700'}`}
        >
          🚛 Fleet Dispatch Center
        </button>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TAB 1: INVENTORY & EXPIRY & BATCH TRACKING */}
        {activeTab === 'inventory' && (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Batches streams and Expiry Warnings */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center pb-1">
                <h3 className="font-display font-semibold text-gray-700 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Layers className="w-4 h-4 text-teal-600" /> Active Storage Batches
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">Sorted by category</span>
              </div>

              {/* Active Batches lists with Expiry Badges */}
              <div className="space-y-3">
                {warehouseBatches.map((batch, keyIdx) => {
                  // Calculate raw warning class
                  const isExpiringTomato = batch.alertType === 'alert';
                  const isExpiringWeek = batch.alertType === 'warning';
                  
                  return (
                    <div 
                      key={keyIdx} 
                      className={`border p-4 rounded-2xl flex flex-col md:flex-row md:justify-between md:items-center gap-3 transition hover:shadow-xs bg-white ${
                        isExpiringTomato ? 'border-red-400 bg-red-50/10' :
                        isExpiringWeek ? 'border-amber-400 bg-amber-50/10' : 'border-gray-100'
                      }`}
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-teal-50 border border-teal-100 text-teal-900 font-bold px-2 py-0.5 rounded text-[10px]">
                            {batch.batchNumber}
                          </span>
                          <span className="bg-gray-100 text-gray-700 font-mono text-[9px] px-1.5 py-0.5 rounded-sm">
                            {batch.category}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-gray-800 text-xs">{batch.name}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-gray-400 font-mono font-sans font-medium">
                          <span>Volume: <strong className="text-gray-700 font-mono">{batch.quantity}</strong></span>
                          <span>Packed: {batch.productionDate}</span>
                        </div>
                      </div>

                      {/* Expiry alerts indicators */}
                      <div className="flex flex-row md:flex-col items-start md:items-end justify-between font-sans text-right gap-1 pt-2 md:pt-0 border-t md:border-0 border-gray-100">
                        <span className="text-[10px] text-gray-450 font-sans block">Expiry: <strong className="font-bold text-gray-700">{batch.expiryDate}</strong></span>
                        {isExpiringTomato ? (
                          <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-sm font-semibold flex items-center gap-1 leading-none uppercase">
                            <AlertOctagon className="w-3.5 h-3.5" /> High Expiry Alert (Tomorrow)
                          </span>
                        ) : isExpiringWeek ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-sm font-semibold flex items-center gap-1 leading-none uppercase">
                            <Clock className="w-3.5 h-3.5" /> Expiring in 3 Days
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-sm font-semibold flex items-center gap-1 leading-none uppercase">
                            <ShieldCheck className="w-3.5 h-3.5" /> Safe Stock Level
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Add Stock Batch simulator */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-teal-950 text-white rounded-3xl p-5 border border-teal-900 shadow-md space-y-4">
                <div>
                  <span className="bg-teal-800 text-teal-200 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded font-mono">
                    DAIRY LAB INTAKE
                  </span>
                  <h4 className="font-display font-bold text-sm text-white mt-1.5">Intake Production Batch</h4>
                  <p className="text-[11px] text-teal-300 font-sans mt-0.5">Register new farm shipment into chilling vaults after quality lab passes.</p>
                </div>

                <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs text-sans">
                  <div>
                    <label className="block text-[9px] text-teal-400 font-mono mb-1 uppercase font-bold tracking-wide">Product Category</label>
                    <select 
                      value={newBatchCategory} 
                      onChange={e => {
                        const val = e.target.value as any;
                        setNewBatchCategory(val);
                        if (val === 'Milk') { setNewBatchName('A2 Sahiwal Cow Milk'); setNewBatchVol('350 Litres'); }
                        else if (val === 'Butter') { setNewBatchName('Bilona Cultured Butter'); setNewBatchVol('80 kg'); }
                        else if (val === 'Cheese') { setNewBatchName('Cream Cottage Paneer'); setNewBatchVol('110 kg'); }
                        else { setNewBatchName('Kesar Pista Chilled Cream'); setNewBatchVol('150 tubs'); }
                      }}
                      className="w-full bg-teal-900 border border-teal-850 rounded-xl p-2 text-white font-semibold focus:outline-hidden"
                    >
                      <option value="Milk">Fresh Milk (Silo Store)</option>
                      <option value="Butter">Fresh Butter</option>
                      <option value="Cheese">Gouda/Paneer Cheese</option>
                      <option value="Ice Cream">Refrigerated Ice Cream</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-teal-400 font-mono mb-1 uppercase font-bold tracking-wide">Silo Storage Label name</label>
                    <input 
                      type="text" 
                      value={newBatchName}
                      onChange={e => setNewBatchName(e.target.value)}
                      className="w-full bg-teal-900 border border-teal-850 rounded-xl p-2 text-white font-semibold focus:outline-hidden"
                      placeholder="e.g. Sahiwal Chilled Milk Vault"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-teal-400 font-mono mb-1 uppercase font-bold tracking-wide">Intake Batch Weight / Vol</label>
                    <input 
                      type="text" 
                      value={newBatchVol}
                      onChange={e => setNewBatchVol(e.target.value)}
                      className="w-full bg-teal-900 border border-teal-850 rounded-xl p-2 text-teal-100 font-semibold focus:outline-hidden font-mono"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-white text-teal-950 font-bold py-2.5 rounded-xl text-center hover:bg-teal-50 transition uppercase font-mono tracking-wider cursor-pointer"
                  >
                    Authorize Quality Intake
                  </button>

                  {newBatchSuccess && (
                    <p className="bg-teal-900/60 text-teal-200 text-[10px] p-2 rounded-lg font-mono text-center animate-bounce mt-2">
                       Verification PASSED. Batch stored & monitored under FSSAI code!
                    </p>
                  )}
                </form>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LIVE THERMOSTAT UNITS */}
        {activeTab === 'temperature' && (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Sensor dashboard */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-display font-semibold text-gray-700 text-xs uppercase tracking-wider">Live Vault Sensor Panels</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coldUnits.map((u) => (
                  <div 
                    key={u.id} 
                    className={`border p-4 rounded-2xl relative overflow-hidden transition flex flex-col justify-between min-h-[170px] bg-white ${
                      u.alertStatus === 'alert' ? 'border-red-400 bg-red-50/15' :
                      u.alertStatus === 'warning' ? 'border-amber-400 bg-amber-50/15' :
                      'border-teal-100 bg-teal-50/5'
                    }`}
                  >
                    {/* Visual Status Indicator */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display font-bold text-gray-800 text-sm flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${u.alertStatus === 'alert' ? 'bg-red-500 animate-ping':'bg-teal-500'}`} />
                          {u.name}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono">Bound Limit: {u.requiresTemp}</span>
                      </div>
                      
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase leading-none ${
                        u.alertStatus === 'alert' ? 'bg-red-100 text-red-700' :
                        u.alertStatus === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.alertStatus}
                      </span>
                    </div>

                    {/* Big Temperature Gauge */}
                    <div className="my-3 flex items-baseline gap-1.5 justify-center">
                      <Thermometer className={`w-5 h-5 ${u.alertStatus === 'alert' ? 'text-red-500':'text-teal-600'}`} />
                      <span className="font-mono text-3xl font-extrabold text-gray-800">{u.currentTemp}°C</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-100">
                      <span className="text-gray-400 font-mono uppercase text-[9px]">Silo Cap: {u.capacity} kg</span>
                      <button 
                        onClick={() => handleOpenSlider(u.id, u.currentTemp)}
                        className="text-teal-700 hover:underline font-bold text-[10px] tracking-wider uppercase font-mono cursor-pointer"
                      >
                        Adjust Thermostat
                      </button>
                    </div>

                    {/* Simulated alert hazard label details */}
                    {u.alertStatus !== 'normal' && (
                      <div className="flex gap-1 items-center text-[9.5px] mt-2 bg-amber-100 text-amber-800 p-1.5 rounded-lg border border-amber-200">
                        <AlertOctagon className="w-3.5 h-3.5 shrink-0 animate-pulse text-red-500" />
                        <span>Compressor adjusted automatically by AI core. Stabilizing drift...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Manual adjustment sliders */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-display font-semibold text-gray-700 text-xs uppercase tracking-wider">Calibration Operations</h3>

              {adjustingUnitId ? (
                <div className="bg-gray-50 border p-4 rounded-2xl space-y-3.5 text-xs bg-white shadow-sm border-teal-200">
                  <h4 className="font-display font-bold text-gray-800 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-teal-600" /> Thermostat Calibration
                  </h4>
                  <p className="text-gray-500 text-[11px]">Stabilizing cooling loops of zone <strong>{coldUnits.find(u => u.id === adjustingUnitId)?.name}</strong></p>
                  
                  <div className="py-2">
                    <input 
                      type="range" 
                      min={adjustingUnitId === 'cs2' ? -25 : -2}
                      max={adjustingUnitId === 'cs2' ? -10 : 12}
                      step="0.1"
                      value={sliderVal} 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setSliderVal(val);
                        handleTempSliderChange(adjustingUnitId, val);
                      }}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-2">
                      <span>Threshold Min</span>
                      <span className="text-teal-700 font-black font-mono text-xs">{sliderVal}°C</span>
                      <span>Max Standard</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setAdjustingUnitId(null)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    Confirm Thermostat Safety
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 text-xs space-y-2.5 bg-white">
                  <h4 className="font-display font-bold text-gray-800 mb-1 flex items-center gap-1">
                    <Shield className="w-4 h-4 text-indigo-600" /> Cold Storage SOP Checklist
                  </h4>
                  <p className="text-gray-500 font-sans leading-relaxed text-[11px] border-b pb-1">
                    1. Milk silos must maintain <strong>1.5°C to 4.0°C</strong> to buffer biological enzymes.
                  </p>
                  <p className="text-gray-500 font-sans leading-relaxed text-[11px] border-b pb-1">
                    2. Butter caches must be frozen under <strong>-18.0°C</strong> to prevent structural lipids melting.
                  </p>
                  <p className="text-gray-500 font-sans leading-relaxed text-[11px]">
                    3. Cheeses must cure inside <strong>6.5°C</strong> to encourage secondary probiotic cultures.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: DISPATCH MANAGEMENT & FLEET LOGISTICS */}
        {activeTab === 'dispatch' && (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Dispatch authorization form */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-display font-semibold text-gray-700 text-xs uppercase tracking-wider flex items-center gap-1 font-mono">
                <Truck className="w-4 h-4 text-teal-600" /> Authorized Dispatch & Route Planner
              </h3>

              <form onSubmit={handleFormDispatch} className="bg-white border rounded-2xl p-5 space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] text-gray-400 font-mono mb-1 uppercase font-bold tracking-wider">Select Outbound Batch SKU</label>
                  <select 
                    value={dispatchBatchNum}
                    onChange={e => setDispatchBatchNum(e.target.value)}
                    className="w-full bg-gray-50 border p-2.5 rounded-xl font-bold font-mono"
                  >
                    {warehouseBatches.map((b, keyIdx) => (
                      <option key={keyIdx} value={b.batchNumber}>{b.batchNumber} - {b.name} ({b.quantity})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono mb-1 uppercase font-bold tracking-wider">Allocated Vehicle Class</label>
                    <select 
                      value={assignedVehicle}
                      onChange={e => setAssignedVehicle(e.target.value)}
                      className="w-full bg-gray-50 border p-2 rounded-xl font-medium"
                    >
                      <option value="Insulated Chilled Mini Truck HR-26B">Insulated 3-Wheeler Mini Truck</option>
                      <option value="Refrigerated Van Container DL-3C">Refrigerated Heavy Container Van</option>
                      <option value="Dry-Ice Cargo Bike HR-55F">Dry-Ice Carrier Cargo Motorcycle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono mb-1 uppercase font-bold tracking-wider">Dynamic Routing Tier</label>
                    <select 
                      value={plannedRoute}
                      onChange={e => setPlannedRoute(e.target.value)}
                      className="w-full bg-gray-50 border p-2 rounded-xl font-medium"
                    >
                      <option value="Route Alpha: Direct Express Highway Cybercity">Route Alpha (Direct Highway)</option>
                      <option value="Route Beta: Multi-Stop Chilled Sector Grid">Route Beta (Eco Multi-Stop Sector Grid)</option>
                      <option value="Route Gamma: Green-Channel Airport Corridor">Route Gamma (Priority Corridor)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-xl transition uppercase font-mono tracking-widest cursor-pointer"
                >
                  Verify Compliance & Dispatch Truck
                </button>

                {dispatchSucceeded && (
                  <p className="bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-xl p-3 font-semibold font-mono animate-pulse">
                     AUTHORIZATION SUCCESS. Vehicle assigned & digital locks configured. Outbound dispatch live!
                  </p>
                )}
              </form>
            </div>

            {/* Right: Route planning visualization details */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-display font-semibold text-gray-700 text-xs uppercase tracking-wider flex items-center gap-1 font-mono">
                <Map className="w-3.5 h-3.5 text-teal-600" /> Active Route Planner Matrix
              </h3>

              <div className="bg-white border rounded-2xl p-4 space-y-3.5 text-xs text-sans">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-dashed text-[11px] leading-relaxed">
                  <span className="font-bold text-gray-700 block mb-0.5">Route Optimization:</span>
                  System automatically schedules routes incorporating live Delhi NCR traffic layers and outdoor temperature indexes to minimize cold leakage risk.
                </div>

                <div className="space-y-2 border-t pt-2 text-[11px] font-mono">
                  <div className="flex justify-between text-gray-550 border-b pb-1 border-gray-50">
                    <span>Route Code</span> <span>Transit Limit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">ALPHA (CYBERCITY)</span> <span>22 mins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">BETA (SECTOR GRIDS)</span> <span>45 mins</span>
                  </div>
                  <div className="flex justify-between text-indigo-700 font-bold">
                    <span>GAMMA (PRIORITY AP)</span> <span>18 mins (EXP)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
