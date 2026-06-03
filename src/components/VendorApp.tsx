import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, OrderStatus } from '../types';
import { 
  Bell, Check, X, ShieldCheck, Flame, Milk, Scale, Calendar, Plus, Archive, ChevronRight, 
  AlertTriangle, FileCode, AlertCircle, Sliders, Award, FileText, CheckCircle2, Droplet, 
  Thermometer, Package, Clock, Volume2, VolumeX, Database, Sparkles, PlusCircle, ArrowRight,
  Filter, CheckSquare, RefreshCw
} from 'lucide-react';

interface CustomBatch {
  batchNumber: string;
  productName: string;
  quantity: string;
  productionDate: string;
  expiryDate: string;
  labReportStatus: 'approved' | 'pending';
  // Quality indices
  fssaiNumber?: string;
  organicCertified?: boolean;
  fatPercent?: number;
  snfPercent?: number;
  waterAdulteration?: string;
  phValue?: number;
  antibioticResidue?: string;
}

export const VendorApp: React.FC = () => {
  const { 
    products, 
    orders, 
    updateOrderStatus, 
    updateInventoryStock, 
    addNewProduct, 
    coldUnits, 
    placeOrder,
    addSystemLog,
    addNotification
  } = useApp();

  // Tab controls
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'inventory' | 'batches'>('orders');
  const [activeInventoryType, setActiveInventoryType] = useState<'all' | 'raw' | 'processed' | 'dairy'>('all');

  // Audio system state
  const [isAlertSoundEnabled, setIsAlertSoundEnabled] = useState(true);

  // Rejection overlay state
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState<'out_of_stock' | 'not_serviceable' | 'capacity_full'>('out_of_stock');

  // Adding product states
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState('');
  const [addCategory, setAddCategory] = useState<'Raw Milk' | 'Processed Milk' | 'Dairy Products'>('Processed Milk');
  const [addPrice, setAddPrice] = useState(45);
  const [addUnit, setAddUnit] = useState('500 ml');
  const [addStock, setAddStock] = useState(150);
  const [addFat, setAddFat] = useState(4.2);
  const [addSNF, setAddSNF] = useState(8.8);
  const [addGstRate, setAddGstRate] = useState<5 | 12 | 18>(5);
  const [addOffer, setAddOffer] = useState('No Active Scheme');
  const [addLowStockLimit, setAddLowStockLimit] = useState(20);
  const [selectedPresetImage, setSelectedPresetImage] = useState('milk');

  // Image preset collection
  const presetImages: Record<string, string> = {
    milk: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
    curd: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=600',
    paneer: 'https://images.unsplash.com/photo-1629230104113-17b5e4f207cc?auto=format&fit=crop&q=80&w=600',
    ghee: 'https://images.unsplash.com/photo-1622484211148-71759f633390?auto=format&fit=crop&q=80&w=600',
    cheese: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80&w=600',
    icecream: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=600',
  };

  // Batches local registry
  const [batches, setBatches] = useState<CustomBatch[]>(() => {
    const saved = localStorage.getItem('df_custom_batches');
    if (saved) return JSON.parse(saved);
    
    // Map initial batches from cold storage
    return [
      {
        batchNumber: 'BT-COW-9801',
        productName: 'Raw Buffalo Silo Milk A',
        quantity: '3400 Litres',
        productionDate: '2026-06-01',
        expiryDate: '2026-06-04',
        labReportStatus: 'approved',
        fssaiNumber: '10023409100028',
        organicCertified: true,
        fatPercent: 6.5,
        snfPercent: 9.0,
        phValue: 6.62,
        waterAdulteration: '0.0% pure',
        antibioticResidue: 'Negative (Safe)'
      },
      {
        batchNumber: 'BT-COW-9802',
        productName: 'Gir A2 Desi Cow Tank B',
        quantity: '2500 Litres',
        productionDate: '2026-06-02',
        expiryDate: '2026-06-05',
        labReportStatus: 'pending',
        fssaiNumber: '10023409100028',
        organicCertified: true,
        fatPercent: 4.2,
        snfPercent: 8.7,
        phValue: 6.64,
        waterAdulteration: '0.0% pure',
        antibioticResidue: 'Negative (Safe)'
      },
      {
        batchNumber: 'BT-RAW-7110',
        productName: 'Fresh Toned Raw Cow Milk Silo C',
        quantity: '4000 Litres',
        productionDate: '2026-06-02',
        expiryDate: '2026-06-05',
        labReportStatus: 'pending'
      }
    ];
  });

  // Track batches updates to localStorage
  useEffect(() => {
    localStorage.setItem('df_custom_batches', JSON.stringify(batches));
  }, [batches]);

  // QA Certificate modal state
  const [selectedBatchForQA, setSelectedBatchForQA] = useState<CustomBatch | null>(null);
  const [qaFssai, setQaFssai] = useState('10023409100028');
  const [qaOrganic, setQaOrganic] = useState(true);
  const [qaFat, setQaFat] = useState(4.0);
  const [qaSnf, setQaSnf] = useState(8.5);
  const [qaPh, setQaPh] = useState(6.65);
  const [qaWater, setQaWater] = useState('0.0% Pure Bulk');
  const [qaAntibiotics, setQaAntibiotics] = useState('Negative (Safe)');

  // Print view certificate popup state
  const [activeCertificateView, setActiveCertificateView] = useState<CustomBatch | null>(null);

  // Live order verification checklist toggles per order
  const [expandedVerificationCheckbox, setExpandedVerificationCheckbox] = useState<Record<string, boolean>>({});

  // Trigger alert chime sound
  const playAlertChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, start: number, duration: number, type: OscillatorType = 'sine') => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.00001, start + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };
      
      // Warm alert tone
      const now = audioCtx.currentTime;
      playTone(523.25, now, 0.15, 'sine');       // Link C5
      playTone(659.25, now + 0.12, 0.15, 'sine');  // Link E5
      playTone(783.99, now + 0.24, 0.35, 'triangle'); // Link G5
    } catch (e) {
      console.log('Audio Blocked by system policy. Touch UI interaction required to play audio.', e);
    }
  };

  // Listen to new orders simulation alert
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const processedOrders = orders.filter(o => o.status !== 'pending' && o.status !== 'delivered' && o.status !== 'rejected');

  // Fast incoming simulation order trigger
  const handleSimulateIncomingOrder = () => {
    if (products.length === 0) {
      alert('Add products to your catalog first!');
      return;
    }
    const randProdIndex = Math.floor(Math.random() * products.length);
    const selectedP = products[randProdIndex];
    if (selectedP.stock < 1) {
      updateInventoryStock(selectedP.id, 100); // Top up to keep simulator seamless
    }

    const itemQty = Math.floor(Math.random() * 2) + 1;
    const checkoutItems = [{ product: selectedP, quantity: itemQty }];

    const paymentModes: ('upi' | 'wallet' | 'card' | 'cod')[] = ['upi', 'wallet', 'card', 'cod'];
    const selectedPay = paymentModes[Math.floor(Math.random() * paymentModes.length)];

    const deliveryOpts: ('instant' | 'scheduled')[] = ['instant', 'scheduled'];
    const chosenOpt = deliveryOpts[Math.floor(Math.random() * deliveryOpts.length)];

    // Place the order
    const simulatedResponse = placeOrder(checkoutItems, selectedPay, chosenOpt);
    
    if (simulatedResponse) {
      if (isAlertSoundEnabled) {
        playAlertChime();
      }
    }
  };

  // Rejection confirm
  const handleConfirmRejection = () => {
    if (!rejectingOrderId) return;
    
    let reasonText = 'Product Out of Stock';
    if (selectedRejectReason === 'not_serviceable') reasonText = 'Area Not Serviceable (Logistics Boundary)';
    else if (selectedRejectReason === 'capacity_full') reasonText = 'Farm Distribution Capacity Full';

    updateOrderStatus(rejectingOrderId, 'rejected', undefined, reasonText);
    setRejectingOrderId(null);
  };

  // Process item submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return;

    // Pricing maths
    const gstPercent = addGstRate / 100;
    const baseVal = +(addPrice / (1 + gstPercent)).toFixed(2);
    const taxValue = +(addPrice - baseVal).toFixed(2);

    addNewProduct({
      name: addName,
      category: addCategory, // Dynamic category grouping
      price: addPrice,
      unit: addUnit,
      stock: addStock,
      fatPercentage: addFat,
      snfPercentage: addSNF,
      farmName: 'Krishna Dairy & Stud Farms',
      milkingTime: '04:30 AM',
      processingTime: '06:15 AM',
      dispatchTime: '07:30 AM',
      image: presetImages[selectedPresetImage] || presetImages.milk,
      description: `Premium farm-fresh choice produced under FSSAI certified organic standards. Low-stock limits managed under ${addLowStockLimit} units. Includes scheme: ${addOffer}.`,
      ingredients: `Raw organic sweet pasteurized cows milk extract.`,
      nutrition: {
        calories: '82 kcal',
        protein: '3.4g',
        fat: `${addFat}g`,
        carbs: '4.6g',
        calcium: '125mg'
      },
      shelfLife: addCategory === 'Dairy Products' ? '14 Days' : '48 Hours',
      storageInstructions: 'Chilled constantly below 4°C with insulated packaging.',
      rating: 4.8,
      reviewsCount: 12
    });

    // Reset fields
    setAddName('');
    setAddPrice(45);
    setAddStock(150);
    setAddFat(4.2);
    setAddSNF(8.8);
    setShowAddForm(false);
  };

  // Create batch submit
  const [newBatchName, setNewBatchName] = useState('Cow Pasteur Milk');
  const [newBatchVolume, setNewBatchVolume] = useState('3200 L');
  const [newBatchNumber, setNewBatchNumber] = useState(`BT-CH-${Math.floor(1000 + Math.random() * 9000)}`);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newB: CustomBatch = {
      batchNumber: newBatchNumber,
      productName: newBatchName,
      quantity: newBatchVolume,
      productionDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      labReportStatus: 'pending'
    };
    setBatches([newB, ...batches]);
    
    // Reset batch form states
    setNewBatchNumber(`BT-CH-${Math.floor(1000 + Math.random() * 9000)}`);
    setNewBatchName('Cow Pasteur Milk');
    setNewBatchVolume('3200 L');
  };

  // Fire analytical signing certificate
  const handleSignCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForQA) return;

    setBatches(prev => prev.map(b => {
      if (b.batchNumber === selectedBatchForQA.batchNumber) {
        return {
          ...b,
          labReportStatus: 'approved',
          fssaiNumber: qaFssai,
          organicCertified: qaOrganic,
          fatPercent: qaFat,
          snfPercent: qaSnf,
          phValue: qaPh,
          waterAdulteration: qaWater,
          antibioticResidue: qaAntibiotics
        };
      }
      return b;
    }));

    setSelectedBatchForQA(null);
  };

  // UI calculations for adding product GST preview
  const previewGstPercent = addGstRate / 100;
  const previewBasePrice = +(addPrice / (1 + previewGstPercent)).toFixed(2);
  const previewGstValue = +(addPrice - previewBasePrice).toFixed(2);

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 shadow-xs relative space-y-6" id="vendor-view">
      
      {/* FLOW SEQUENCE INDICES FOR VENDOR AND SERVER SYSTEMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* 2. MERCHANT / SHOP APP BOARD */}
        <div className="bg-amber-950 text-amber-100 rounded-3xl p-4 shadow-sm border border-amber-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                2. MERCHANT / SHOP APP
              </span>
              <span className="text-[10px] text-amber-300 font-bold font-mono">Interactive Flow</span>
            </div>
            <h3 className="text-sm font-display font-extrabold text-white mt-1">Merchant Cycle Panel</h3>
            <p className="text-[11px] text-amber-200/70 mt-0.5">
              Click individual steps below to fast-track vendor lifecycle stages!
            </p>
          </div>

          <div className="grid grid-cols-5 gap-1.5 mt-3">
            {[
              {
                num: "2.1",
                title: "New Order Received",
                sub: pendingOrders.length > 0 ? "🔔 Beeping Alerts" : "Standby Hub",
                active: pendingOrders.length > 0,
                click: () => {
                  handleSimulateIncomingOrder();
                  addSystemLog('Merchant App', 'Step 2.1 Triggered: Generated mock bulk milk incoming order.');
                }
              },
              {
                num: "2.2",
                title: "Check Order Details",
                sub: pendingOrders.length > 0 ? "Checking Quality" : "Ready checks",
                active: pendingOrders.length > 0,
                click: () => {
                  setActiveSubTab('orders');
                  const targetField = document.getElementById('vendor-view');
                  if (targetField) targetField.scrollIntoView({ behavior: 'smooth' });
                }
              },
              {
                num: "2.3",
                title: "Accept / Reject",
                sub: orders.some(o => o.status !== 'pending' && o.status !== 'rejected') ? "Decision Taken" : "Approve Stage",
                active: orders.some(o => o.status !== 'pending' && o.status !== 'rejected'),
                click: () => {
                  const newestPending = orders.find(o => o.status === 'pending');
                  if (newestPending) {
                    updateOrderStatus(newestPending.id, 'accepted');
                    addSystemLog('Merchant App', `Step 2.3 Auto-Acceptance: Safe clearance given to Order ${newestPending.id}`);
                  } else {
                    handleSimulateIncomingOrder();
                    setTimeout(() => {
                      const nextNewest = orders.find(o => o.status === 'pending');
                      if (nextNewest) updateOrderStatus(nextNewest.id, 'accepted');
                    }, 400);
                  }
                }
              },
              {
                num: "2.4",
                title: "Prepare & Pack",
                sub: orders.some(o => ['processing', 'packed'].includes(o.status)) ? "Cold Sealed" : "Pasteurizing",
                active: orders.some(o => ['processing', 'packed', 'ready_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(o.status)),
                click: () => {
                  setActiveSubTab('orders');
                  const liveOrd = orders.find(o => o.status === 'accepted');
                  if (liveOrd) {
                    updateOrderStatus(liveOrd.id, 'processing');
                  } else {
                    const activeP = orders.find(o => o.status === 'processing');
                    if (activeP) {
                      updateOrderStatus(activeP.id, 'packed');
                    } else {
                      // fallback flow
                      const item = orders.find(o => o.status === 'pending');
                      if (item) {
                        updateOrderStatus(item.id, 'accepted');
                        setTimeout(() => updateOrderStatus(item.id, 'processing'), 200);
                      } else {
                        handleSimulateIncomingOrder();
                      }
                    }
                  }
                }
              },
              {
                num: "2.5",
                title: "Order Ready For Pickup",
                sub: orders.some(o => ['ready_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(o.status)) ? "Disp Bay Full" : "Picker Storage",
                active: orders.some(o => ['ready_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(o.status)),
                click: () => {
                  setActiveSubTab('orders');
                  const pckd = orders.find(o => o.status === 'packed' || o.status === 'processing' || o.status === 'accepted');
                  if (pckd) {
                    updateOrderStatus(pckd.id, 'ready_pickup');
                    addSystemLog('Merchant App', `Step 2.5: Order ${pckd.id} is moved to Cold dispatcher loading stands.`);
                  } else {
                    const item = orders.find(o => o.status === 'pending');
                    if (item) {
                      updateOrderStatus(item.id, 'accepted');
                      setTimeout(() => updateOrderStatus(item.id, 'ready_pickup'), 200);
                    }
                  }
                }
              }
            ].map((step, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={step.click}
                className={`p-2 rounded-xl text-left transition duration-200 border cursor-pointer flex flex-col justify-between min-h-[92px] ${
                  step.active 
                    ? 'bg-amber-900/60 border-amber-400 text-amber-200' 
                    : 'bg-black/20 border-amber-950 text-amber-100/40 hover:bg-black/30 hover:text-amber-100'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="font-mono text-[8px] font-bold text-amber-400">
                    {step.num}
                  </span>
                  <span className="text-[8px]">{step.active ? '✓' : '○'}</span>
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[9.5px] leading-tight text-white line-clamp-2 mt-1">
                    {step.title}
                  </h4>
                  <span className="text-[7.5px] text-amber-400/70 block mt-0.5 font-mono">
                    {step.sub}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. SYSTEM / SERVER BOARD */}
        <div className="bg-purple-950 text-purple-100 rounded-3xl p-4 shadow-sm border border-purple-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="bg-purple-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                3. SYSTEM / SERVER
              </span>
              <span className="text-[10px] text-purple-300 font-bold font-mono">Auto Disp Engine</span>
            </div>
            <h3 className="text-sm font-display font-extrabold text-white mt-1">Order Processing Engine</h3>
            <p className="text-[11px] text-purple-200/70 mt-0.5">
              Simulate backend server transaction validations and nearest-courier routing dispatches.
            </p>
          </div>

          <div className="grid grid-cols-5 gap-1.5 mt-3">
            {[
              {
                num: "3.1",
                title: "Order Confirmed",
                sub: orders.length > 0 ? "Fidelity Validated" : "Awaiting DB",
                active: orders.length > 0,
                click: () => {
                  if (orders.length === 0) {
                    handleSimulateIncomingOrder();
                  } else {
                    addSystemLog('Server Engine', 'Re-ran schema compliance & transaction double-entry ledger checks.');
                  }
                }
              },
              {
                num: "3.2",
                title: "Find Nearest Boys",
                sub: orders.length > 0 ? "Proximity Mapped" : "Range Scanning",
                active: orders.length > 0,
                click: () => {
                  addSystemLog('Server Engine', 'Scanning GPS location coordinate matrices of logistics division...');
                  alert('Proximity scanner output: Map path calculation to DLF Phase 3 ready!');
                }
              },
              {
                num: "3.3",
                title: "Check Availability",
                sub: "3 Online Drivers",
                active: true,
                click: () => {
                  addSystemLog('Server Engine', 'Scanned online courier states. Ramesh Kumar is flag "ONLINE".');
                }
              },
              {
                num: "3.4",
                title: "Assign To Boy",
                sub: orders.some(o => !!o.deliveryPartnerId) ? "Assigned dp1/dp2" : "Unallocated",
                active: orders.some(o => !!o.deliveryPartnerId),
                click: () => {
                  const newestUnassigned = orders.find(o => !o.deliveryPartnerId);
                  if (newestUnassigned) {
                    updateOrderStatus(newestUnassigned.id, 'accepted', 'dp1');
                    addSystemLog('Server Dispatch', `Direct Allocation: Courier Ramesh Kumar mapped to order: ${newestUnassigned.id}`);
                  } else {
                    addSystemLog('Server Dispatch', 'No unassigned orders found in buffer queue.');
                  }
                }
              },
              {
                num: "3.5",
                title: "Send Notification",
                sub: "Live API Push",
                active: orders.length > 0,
                click: () => {
                  addNotification('order', 'System Auto-Dispatch Notification', 'Broadcasting live delivery route details directly to customer profile and rider GPS screen feed.');
                  addSystemLog('Notification System', 'Broadcasted multi-channel alerts.');
                }
              }
            ].map((step, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={step.click}
                className={`p-2 rounded-xl text-left transition duration-200 border cursor-pointer flex flex-col justify-between min-h-[92px] ${
                  step.active 
                    ? 'bg-purple-900/60 border-purple-400 text-purple-200' 
                    : 'bg-black/20 border-purple-950 text-purple-100/40 hover:bg-black/30 hover:text-purple-100'
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className="font-mono text-[8px] font-bold text-purple-400">
                    {step.num}
                  </span>
                  <span className="text-[8px]">{step.active ? '✓' : '○'}</span>
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[9.5px] leading-tight text-white line-clamp-2 mt-1">
                    {step.title}
                  </h4>
                  <span className="text-[7.5px] text-purple-400/70 block mt-0.5 font-mono">
                    {step.sub}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
      
      {/* Title Operational Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-slate-200/60 pb-5 mb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
              A Grade Core Hub
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
              <span>Shift: Morning Milking Dispatch</span>
            </div>
          </div>
          <h2 className="font-display font-extrabold text-slate-800 text-xl flex items-center gap-2 leading-none">
            <Milk className="w-6 h-6 text-indigo-600 animate-pulse" /> Krishna Farms Operations Center
          </h2>
          <p className="text-xs text-slate-500 font-sans">
            Oversee instant dispatches, FSSAI high-volume chilling reserves, and batch sanitary verification.
          </p>
        </div>

        {/* Outer Utilities panel */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sound alert switcher */}
          <button 
            onClick={() => {
              setIsAlertSoundEnabled(!isAlertSoundEnabled);
              if (!isAlertSoundEnabled) {
                playAlertChime();
              }
            }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isAlertSoundEnabled 
                ? 'bg-amber-50 border-amber-200 text-amber-700' 
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            {isAlertSoundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                <span>Alert Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Muted</span>
              </>
            )}
          </button>

          {/* Quick simulator placement */}
          <button
            onClick={handleSimulateIncomingOrder}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-1.5 px-3.5 rounded-xl transition flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
            <span>Simulate Customer Order 🔔</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu navigation */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-200/60 p-1 rounded-2xl mb-6">
        <button 
          onClick={() => setActiveSubTab('orders')}
          className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'orders' 
              ? 'bg-white text-indigo-700 shadow-sm' 
              : 'text-slate-600 hover:bg-white/40'
          }`}
        >
          <Bell className="w-4 h-4 shrink-0" />
          <span>Verification & Dispatches ({pendingOrders.length})</span>
          {pendingOrders.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          )}
        </button>
        
        <button 
          onClick={() => setActiveSubTab('inventory')}
          className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'inventory' 
              ? 'bg-white text-indigo-700 shadow-sm' 
              : 'text-slate-600 hover:bg-white/40'
          }`}
        >
          <Package className="w-4 h-4 shrink-0" />
          <span>Inventory Control</span>
        </button>
        
        <button 
          onClick={() => setActiveSubTab('batches')}
          className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === 'batches' 
              ? 'bg-white text-indigo-700 shadow-sm' 
              : 'text-slate-600 hover:bg-white/40'
          }`}
        >
          <Award className="w-4 h-4 shrink-0" />
          <span>FSSAI Batches & QA</span>
        </button>
      </div>

      {/* DYNAMIC TAB 1: PENDING ORDERS, VERIFICATION & DISPATCH FLOWS */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6">
          
          {/* 2.1 Live Ringing Order Notification Banner */}
          {pendingOrders.length > 0 ? (
            <div className="bg-amber-500 border border-amber-600 text-slate-950 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 text-amber-400 p-2.5 rounded-full animate-bounce">
                  <Bell className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                    <span>⚠️ {pendingOrders.length} Pending Order Alert!</span>
                  </h3>
                  <p className="text-[11px] text-slate-900 font-medium leading-tight">
                    New milk purchase requires quality parameter verification. Review stocks, select status, and assign dispatch keys.
                  </p>
                </div>
              </div>
              <span className="bg-slate-900 text-amber-400 font-mono font-bold text-[9px] px-2.5 py-1 rounded-md shrink-0">
                LINE TIMEOUT: NO DELAY PERMITTED
              </span>
            </div>
          ) : (
            <div className="border border-slate-200/80 bg-white p-5 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-indigo-500 mx-auto" />
              <p className="text-xs text-slate-700 font-bold">Dispatch Ledger Fully Cleared</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                No incoming retail dispatches require attention at the moment. Hit <strong className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">Simulate Customer Order 🔔</strong> above to trigger live flows!
              </p>
            </div>
          )}

          {/* Pending Dispatches Area */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-extrabold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-slate-500" />
                <span>Verification Queue ({pendingOrders.length})</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Status: Awaiting Sanitary Greenlight</span>
            </div>

            {pendingOrders.map((ord) => {
              // Perform calculations for Real-time 2.2 Order Verification
              const validationChecks = ord.items.map(item => {
                const liveP = products.find(p => p.id === item.product.id);
                const hasStock = liveP ? liveP.stock >= item.quantity : false;
                const availableCount = liveP ? liveP.stock : 0;
                return {
                  productName: item.product.name,
                  requestedQuantity: item.quantity,
                  availableStock: availableCount,
                  isStockSufficient: hasStock
                };
              });

              const isEntireOrderInStock = validationChecks.every(chk => chk.isStockSufficient);

              return (
                <div 
                  key={ord.id} 
                  className="bg-white border-2 border-indigo-100/70 hover:border-indigo-200 rounded-3xl p-5 space-y-4 shadow-xs relative overflow-hidden transition"
                >
                  {/* Payment Indicator */}
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white font-mono text-[9px] px-3 py-1 rounded-bl-xl font-bold uppercase tracking-wider">
                    {ord.paymentStatus === 'paid' ? `Paid via ${ord.paymentMethod.toUpperCase()}` : `COD REQUEST`}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-extrabold text-[#2a9d8f] text-sm">{ord.id}</span>
                        <span className="text-[9px] font-bold px-1.5 bg-slate-100 rounded uppercase text-slate-500">
                          {ord.deliveryOption === 'instant' ? '⚡ Instant (15 Mins)' : '📅 Scheduled Slot'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-1">{ord.customerName}</div>
                      <div className="text-[10.5px] text-slate-500 font-medium">Destination: {ord.customerAddress}</div>
                    </div>
                    <div className="text-right sm:mt-1 font-mono">
                      <span className="text-xs text-slate-400 block font-normal">Final Total Bill</span>
                      <strong className="text-indigo-700 font-extrabold text-base">₹{ord.total}</strong>
                    </div>
                  </div>

                  {/* Item Breakdowns */}
                  <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 text-xs text-slate-700 divide-y divide-slate-100">
                    {ord.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 first:pt-0 last:pb-0">
                        <span className="font-medium">{i.product.name} <strong className="text-indigo-600">x{i.quantity}</strong></span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 rounded font-mono font-bold">
                          Fat: {i.product.fatPercentage}% | SNF: {i.product.snfPercentage}%
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 2.2 HIGH POLISHED ORDER VERIFICATION DASHBOARD */}
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/60 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-indigo-900 tracking-wider uppercase font-mono flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Pre-Dispatch Sanitation Verification Checklist</span>
                      </span>
                      <span className={`text-[9px] font-bold font-mono py-0.5 px-2 rounded-full ${
                        isEntireOrderInStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isEntireOrderInStock ? '✓ Verification Passed' : '⚠️ Warning Stock Deficit'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10.5px]">
                      {/* Check 1: Product Availability */}
                      <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                        isEntireOrderInStock ? 'bg-white border-indigo-100' : 'bg-red-50/40 border-red-100'
                      }`}>
                        <span className="text-slate-400 text-[9px] block uppercase font-mono font-bold leading-none mb-1">Product Availability</span>
                        {validationChecks.map((v, cIdx) => (
                          <div key={cIdx} className="space-y-0.5 mt-1">
                            <div className="font-semibold text-slate-700 flex justify-between">
                              <span className="truncate max-w-[120px]">{v.productName}:</span>
                              <strong className="font-mono">{v.requestedQuantity} pcs</strong>
                            </div>
                            <div className={`text-[9px] font-mono flex justify-between ${v.isStockSufficient ? 'text-emerald-600' : 'text-red-500 font-bold'}`}>
                              <span>Live Inventory:</span>
                              <span>{v.availableStock} in stock</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Check 2: Quantity Safety Check */}
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 flex flex-col justify-between">
                        <div>
                          <span className="text-slate-400 text-[9px] block uppercase font-mono font-bold leading-none mb-1">Safe Qty Constraints</span>
                          {ord.items.map((it, idx) => {
                            const isQtySafe = it.quantity <= 12; // Standard cap of 12 per customer-day for retail fairness
                            return (
                              <div key={idx} className="flex justify-between items-center mt-1">
                                <span className="font-medium truncate max-w-[130px]">{it.product.name}</span>
                                <span className={`text-[9.5px] font-bold px-1 rounded font-mono ${isQtySafe ? 'text-emerald-700':'text-amber-700'}`}>
                                  {isQtySafe ? '✓ Safe Cap' : '⚠️ Bulk Zone'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <span className="mt-1.5 text-[8.5px] leading-tight text-slate-400 italic block border-t border-slate-50 pt-1 font-sans">
                          Fair-use limits check active
                        </span>
                      </div>

                      {/* Check 3: Delivery Timelines */}
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-100 flex flex-col justify-between">
                        <div>
                          <span className="text-slate-400 text-[9px] block uppercase font-mono font-bold leading-none mb-1">Timeline Feasibility</span>
                          {ord.deliveryOption === 'instant' ? (
                            <div className="space-y-1 mt-1">
                              <span className="text-amber-700 font-extrabold flex items-center gap-0.5 animate-pulse text-[10px]">
                                ⚡ Instant Fleet Target
                              </span>
                              <span className="text-[9px] text-slate-500 leading-none block">
                                Under 15-minute dispatch cutoff window. Clean route available.
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-1 mt-1">
                              <span className="text-indigo-700 font-bold text-[10px] flex items-center gap-0.5">
                                📅 Slot: Morning (06-08 AM)
                              </span>
                              <span className="text-[9px] text-slate-500 leading-none block">
                                Feasible: Assigned to early truck morning slot routing.
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[9px] font-mono border-t border-slate-50 pt-1">
                          <span className="text-slate-400">Hub Serviceable:</span>
                          <span className="text-emerald-700 font-bold">✓ Central Gurgaon</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2.3 Accept or Selectable Rejection Levers */}
                  <div className="flex gap-2 justify-end pt-1">
                    {/* Trigger rejection flow layout */}
                    <button 
                      onClick={() => {
                        setRejectingOrderId(ord.id);
                        setSelectedRejectReason('out_of_stock');
                      }}
                      className="px-3.5 py-2 border-2 border-red-100 text-red-600 text-xs hover:bg-red-50 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Reject Order...
                    </button>

                    <button 
                      onClick={() => {
                        updateOrderStatus(ord.id, 'accepted');
                        if (isAlertSoundEnabled) {
                          playAlertChime();
                        }
                      }}
                      disabled={!isEntireOrderInStock}
                      className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                        isEntireOrderInStock 
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.01]' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-4 h-4" /> Approve & Issue Dispatch
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2.4 MILK PROCESSING / PACKING STEP-BY-STEP PROGRESS PIPELINE */}
          <div className="space-y-4 pt-6 border-t border-slate-200/60">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-extrabold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Interactive Processing & Packaging Chain ({processedOrders.length})</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Advance milk batches through pasteurization, bagging, and picker storage.</p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 font-mono text-[9px] px-2 py-0.5 rounded font-bold">
                Standards: FSSAI sub-4°C chill
              </span>
            </div>

            {processedOrders.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 p-6 text-center rounded-2xl">
                <p className="text-xs text-slate-400 font-medium">No active processing orders currently.</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Approve an order above to begin active pasteurization & cold seal packaging.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {processedOrders.map((ord) => {
                  const currentStatus = ord.status;
                  
                  // Active steps config
                  const steps = [
                    { id: 'accepted', label: 'Accepted', desc: 'Sanitary clear' },
                    { id: 'processing', label: 'Processing', desc: 'Silo Pasteurize at 72°C' },
                    { id: 'packed', label: 'Packed', desc: 'Oxygen cold seal' },
                    { id: 'ready_pickup', label: 'Dispatcher Ready', desc: 'Picker bay' }
                  ];

                  const getStepIndex = (st: string) => {
                    if (st === 'accepted') return 0;
                    if (st === 'processing') return 1;
                    if (st === 'packed') return 2;
                    if (st === 'ready_pickup' || st === 'picked_up' || st === 'out_for_delivery' || st === 'delivered') return 3;
                    return 0;
                  };

                  const activeIdx = getStepIndex(currentStatus);

                  return (
                    <div key={ord.id} className="border border-slate-100 bg-white shadow-xs rounded-2xl p-5 space-y-4 relative">
                      {/* Top banner tag */}
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <div>
                          <strong className="text-xs font-mono text-slate-800">{ord.id} - {ord.customerName}</strong>
                          <span className="text-[9.5px] text-indigo-600 block leading-none font-mono mt-0.5">
                            Target Temp: 3.5°C Chilled
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 font-mono px-2 py-0.5 rounded uppercase">
                          Current: {ord.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Line flowchart process mapper */}
                      <div className="grid grid-cols-4 gap-2 relative py-2">
                        {/* Joining progress line backgrounds */}
                        <div className="absolute top-[21px] left-8 right-8 h-1 bg-slate-100 z-0"></div>
                        <div 
                          className="absolute top-[21px] left-8 h-1 bg-indigo-600 z-0 transition-all duration-300"
                          style={{ width: `${(activeIdx / 3) * 88}%` }}
                        ></div>

                        {steps.map((st, sIdx) => {
                          const isDone = activeIdx >= sIdx;
                          const isCurrent = activeIdx === sIdx;
                          return (
                            <div key={st.id} className="flex flex-col items-center text-center z-10 relative">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition duration-300 ${
                                isCurrent 
                                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 animate-pulse' 
                                  : isDone ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-50 text-slate-400 border border-slate-200'
                              }`}>
                                {isDone && !isCurrent ? '✓' : sIdx + 1}
                              </div>
                              <span className={`text-[10px] font-bold block mt-1.5 ${isCurrent ? 'text-indigo-800':'text-slate-600'}`}>
                                {st.label}
                              </span>
                              <span className="text-[8px] text-slate-400 leading-tight hidden md:block max-w-[90px] mx-auto mt-0.5">
                                {st.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Operations Advance Controls */}
                      <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Sanitation Note:</span>
                          <span className="text-[10px] text-slate-600 font-medium leading-tight block">
                            {currentStatus === 'accepted' && "✓ Initial dispatch approval complete. Move milk from bulk chilling into the Pasteurizer chain stage."}
                            {currentStatus === 'processing' && "✓ Pasteurization holding stage completed. Pack raw pasteurized milk into final consumer bags under sub-zero sterile air."}
                            {currentStatus === 'packed' && "✓ Packets labeled and stored in central insulated chill storage. Make available for pickup verification."}
                            {['ready_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(currentStatus) && "✓ Order successfully dispatched from Krishna Farms. Pending delivery agent routing verification."}
                          </span>
                        </div>

                        {/* Status update levers */}
                        <div className="flex gap-1.5 shrink-0 w-full md:w-auto">
                          <button 
                            onClick={() => updateOrderStatus(ord.id, 'processing')}
                            disabled={currentStatus !== 'accepted'}
                            className={`flex-1 md:flex-initial py-1.5 px-3 text-[10px] font-extrabold rounded-lg transition shrink-0 cursor-pointer uppercase tracking-wider ${
                              currentStatus === 'processing' 
                                ? 'bg-indigo-600 text-white font-black' 
                                : currentStatus === 'accepted'
                                  ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            1. Process
                          </button>
                          
                          <button 
                            onClick={() => updateOrderStatus(ord.id, 'packed')}
                            disabled={currentStatus !== 'processing'}
                            className={`flex-1 md:flex-initial py-1.5 px-3 text-[10px] font-extrabold rounded-lg transition shrink-0 cursor-pointer uppercase tracking-wider ${
                              currentStatus === 'packed' 
                                ? 'bg-indigo-600 text-white font-black' 
                                : currentStatus === 'processing'
                                  ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            2. PacK
                          </button>
                          
                          <button 
                            onClick={() => updateOrderStatus(ord.id, 'ready_pickup')}
                            disabled={currentStatus !== 'packed'}
                            className={`flex-1 md:flex-initial py-1.5 px-3 text-[10px] font-extrabold rounded-lg transition shrink-0 cursor-pointer uppercase tracking-wider ${
                              ['ready_pickup', 'picked_up', 'out_for_delivery', 'delivered'].includes(currentStatus)
                                ? 'bg-emerald-600 text-white font-black' 
                                : currentStatus === 'packed'
                                  ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            3. Dispatch Bay
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DYNAMIC TAB 2: INVENTORY LIST & EXPANDED CREATOR */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-6">
          
          {/* Header area with 2.5 segregated filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100">
            <div>
              <h3 className="font-display font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                Operational Stock Rooms
              </h3>
              <p className="text-[10px] text-slate-400">Manage real-time pouch volumes and bulk unpasteurized reserve lines.</p>
            </div>

            {/* Segregated Filters */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All Products' },
                { id: 'raw', label: '🥛 Raw Bulk Reserves' },
                { id: 'processed', label: '🧴 Processed Milk Pouches' },
                { id: 'dairy', label: 'Butter & Ghee Products' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveInventoryType(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    activeInventoryType === tab.id
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest font-mono">Stock Registry Logs</h4>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600 text-white hover:bg-indigo-700 py-1.5 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Item (2.6)
            </button>
          </div>

          {/* 2.6 PRODUCT MANAGEMENT COMPREHENSIVE ADD PRODUCT FORM */}
          {showAddForm && (
            <form onSubmit={handleCreateProduct} className="bg-white border-2 border-indigo-150 p-6 rounded-3xl space-y-4 shadow-sm animate-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center border-b border-indigo-50 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 px-2 bg-indigo-50 text-indigo-700 text-[10px] font-mono rounded font-extrabold">2.6 Creator Form</span>
                  <h4 className="font-display font-extrabold text-slate-800 text-sm">Add Item to Retail Catalog</h4>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="p-1 cursor-pointer hover:bg-slate-50 text-slate-400 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Column 1 info */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Product Title</label>
                    <input 
                      type="text" 
                      value={addName} 
                      onChange={e => setAddName(e.target.value)} 
                      required 
                      placeholder="e.g. Buffalo Farm Raw milk" 
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Taxonomy Segment</label>
                    <select 
                      value={addCategory} 
                      onChange={e => setAddCategory(e.target.value as any)} 
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Raw Milk">Raw Bulk Reserves (Tank milk)</option>
                      <option value="Processed Milk">Processed Milk Custom Pouches</option>
                      <option value="Dairy Products">Specialty Butter / Ghee / Paneer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Active Scheme Offer</label>
                    <select 
                      value={addOffer} 
                      onChange={e => setAddOffer(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="No Active Scheme">No Promotion Scheme</option>
                      <option value="Buy 1 Get 1 Free">Buy 1 Get 1 Free</option>
                      <option value="Flat 10% Off Morning Deal">Flat 10% Off Morning Deal</option>
                      <option value="Flat 20% Weekend Promo">Flat 20% Weekend Promo</option>
                    </select>
                  </div>
                </div>

                {/* Column 2 Finance maths & inventory */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Shelf MRP (₹)</label>
                      <input 
                        type="number" 
                        value={addPrice} 
                        onChange={e => setAddPrice(+e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Pouch Volume</label>
                      <input 
                        type="text" 
                        value={addUnit} 
                        onChange={e => setAddUnit(e.target.value)} 
                        placeholder="500 ml" 
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">GST Tax Rate</label>
                      <select 
                        value={addGstRate} 
                        onChange={e => setAddGstRate(+e.target.value as any)} 
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-mono"
                      >
                        <option value={5}>5% GST (Fresh)</option>
                        <option value={12}>12% GST (Processed)</option>
                        <option value={18}>18% GST (Condensed)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Pouch Stock Count</label>
                      <input 
                        type="number" 
                        value={addStock} 
                        onChange={e => setAddStock(+e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-mono" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Minimal Alert Threshold</label>
                    <input 
                      type="number" 
                      value={addLowStockLimit} 
                      onChange={e => setAddLowStockLimit(+e.target.value)} 
                      placeholder="Show alert below count" 
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-mono text-red-700 font-bold" 
                    />
                  </div>
                </div>

                {/* Column 3 chemical & image presets picker */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Solid Fat Ratio %</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={addFat} 
                        onChange={e => setAddFat(+e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Solid SNF %</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={addSNF} 
                        onChange={e => setAddSNF(+e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-mono" 
                      />
                    </div>
                  </div>

                  {/* Preset photo selector */}
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold mb-1">Image Preset Mock Choice</label>
                    <div className="grid grid-cols-6 gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                      {Object.keys(presetImages).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedPresetImage(key)}
                          className={`h-9 border text-[9px] capitalize rounded-lg overflow-hidden transition flex items-center justify-center font-bold ${
                            selectedPresetImage === key 
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-300' 
                              : 'border-slate-100 bg-white text-slate-500 hover:scale-[1.02]'
                          }`}
                        >
                          <img src={presetImages[key]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* GST Ledger break preview */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200/80 text-[10px] space-y-0.5">
                    <span className="font-bold text-slate-600 font-mono block">Automated Ledger Preview:</span>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Net Tax-free Base Price:</span>
                      <strong className="text-slate-700 font-mono">₹{previewBasePrice}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">GST Portion ({addGstRate}%):</span>
                      <strong className="text-indigo-600 font-mono">₹{previewGstValue}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-[10.5px]">
                      <span className="text-slate-700">Gross Consumer MRP:</span>
                      <strong className="text-emerald-700 font-mono">₹{addPrice}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-50">
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.005] py-2.5 rounded-xl font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-indigo-100" />
                  <span>Enact & Dispatch Product into Live Ledger</span>
                </button>
              </div>
            </form>
          )}

          {/* 2.5 SEGREGATED INVENTORY GRID CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products
              .filter(p => {
                // Perform categorical alignment
                if (activeInventoryType === 'all') return true;
                if (activeInventoryType === 'raw') return p.category.toLowerCase().includes('raw') || p.category.includes('Gir') || p.name.includes('Silo');
                if (activeInventoryType === 'processed') return p.category.toLowerCase().includes('milk') && !p.category.toLowerCase().includes('raw');
                return !p.category.toLowerCase().includes('milk');
              })
              .map((p) => {
                const isStockBelowThreshold = p.stock < 30; // standard low stock threshold
                
                return (
                  <div key={p.id} className="bg-white border border-slate-200 hover:border-slate-350/70 rounded-2xl p-4 space-y-3.5 shadow-xs relative transition">
                    
                    {/* Catalog badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      <span className="text-[8.5px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase font-mono border">
                        {p.category}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-14 h-14 object-cover rounded-xl border border-slate-100 shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-0.5 overflow-hidden">
                        <strong className="text-xs text-slate-800 font-bold block truncate leading-tight pr-14" title={p.name}>{p.name}</strong>
                        <span className="text-[9px] text-slate-400 font-mono block">SKU Code Ref: {p.id} ({p.unit})</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[9.5px] text-indigo-700 font-bold font-mono">₹{p.price} MRp</span>
                          <span className="text-[8px] bg-indigo-50 text-indigo-650 px-1 py-0.5 rounded font-bold uppercase font-mono">
                            Fat: {p.fatPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Chemical SNF indices & details */}
                    <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 text-[10px] space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Total SNF solids:</span>
                        <strong className="text-slate-700">{p.snfPercentage}%</strong>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Milking Time:</span>
                        <strong className="text-slate-700">{p.milkingTime} Dispatch</strong>
                      </div>
                    </div>

                    {/* 2.5 Quick Stock Change controls */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] uppercase font-mono text-slate-400 block font-bold leading-none">Storage Total</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-mono font-extrabold ${isStockBelowThreshold ? 'text-red-600 animate-pulse':'text-slate-800'}`}>
                            {p.stock} units
                          </span>
                          {isStockBelowThreshold && (
                            <span className="text-[7.5px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded-full uppercase leading-none font-sans">
                              Low stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock Levers */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateInventoryStock(p.id, Math.max(0, p.stock - 10))}
                          className="w-8 h-8 rounded-lg bg-slate-150 hover:bg-slate-200 border border-slate-200 text-xs font-bold font-mono flex items-center justify-center transition cursor-pointer outline-hidden"
                          title="Deduct 10 canisters"
                        >
                          -10
                        </button>
                        
                        <input 
                          type="number"
                          value={p.stock}
                          onChange={(e) => updateInventoryStock(p.id, parseInt(e.target.value) || 0)}
                          className="w-12 h-8 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-xs focus:bg-white"
                          title="Manually key in quantity"
                        />

                        <button
                          onClick={() => updateInventoryStock(p.id, p.stock + 10)}
                          className="w-8 h-8 rounded-lg bg-indigo-55/60 hover:bg-indigo-60 text-indigo-700 border border-indigo-150 text-xs font-bold font-mono flex items-center justify-center transition cursor-pointer outline-hidden"
                          title="Replenish +10 pouches"
                        >
                          +10
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* DYNAMIC TAB 3: CERTIFICATE UPLOAD, BATCH SOWING & SIGNING */}
      {activeSubTab === 'batches' && (
        <div className="space-y-6">
          
          {/* FSSAI Organic compliance intro */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-5 rounded-2xl space-y-2 border border-indigo-75 shadow-xs relative overflow-hidden">
            <div className="absolute right-4 bottom-3 opacity-15 text-6xl">🛡️</div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold uppercase tracking-wider font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400 font-sans" />
              <span>Certified Sanitary Control Center</span>
            </div>
            <h3 className="font-display font-extrabold text-sm text-indigo-100">Quality-Assurance Organic Certificates</h3>
            <p className="text-[11px] text-indigo-200 leading-relaxed font-sans max-w-xl">
              Audit solids non-fat indices (SNF), adulteration checks, and pH charts. Issue verified FSSAI dispatch vouchers which are visual-printable.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form to sow custom production batches (2.7) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-4 shadow-xs self-start">
              <div className="flex items-center gap-1 mb-2 border-b border-slate-50 pb-2">
                <span className="p-1 bg-amber-55/35 text-amber-800 rounded font-mono text-[9px] font-bold">2.7 Silo Sowing</span>
                <h4 className="font-display font-extrabold text-slate-800 text-xs uppercase tracking-wide">
                  Sow Raw Production Batch
                </h4>
              </div>

              <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs text-slate-600">
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">Batch Registry ID</label>
                  <input 
                    type="text" 
                    value={newBatchNumber} 
                    onChange={e => setNewBatchNumber(e.target.value)}
                    required
                    className="w-full bg-slate-55 border text-slate-800 font-mono p-2 rounded-xl text-xs font-bold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">Source Silo Pool / Liquid</label>
                  <select 
                    value={newBatchName} 
                    onChange={e => setNewBatchName(e.target.value)}
                    className="w-full bg-slate-55 border p-2 rounded-xl focus:outline-hidden"
                  >
                    <option value="Raw Buffalo Silo Milk A">Raw Buffalo Silo A (Thick)</option>
                    <option value="Gir A2 Desi Cow Tank B">Gir A2 Desi Cow Tank B (Organic)</option>
                    <option value="Unpasteurized Cream Silo C">Unpasteurized Fresh Cream Pool-C</option>
                    <option value="Fresh Toned Raw Cow Milk Silo C">Regular Toned Cow Milk Silo-C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">Volumetric Capacity (Litres)</label>
                  <input 
                    type="text" 
                    value={newBatchVolume} 
                    onChange={e => setNewBatchVolume(e.target.value)}
                    placeholder="e.g. 5,000 L"
                    required
                    className="w-full bg-slate-55 border p-2 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">Production Date</span>
                    <span className="bg-slate-50 border p-2 rounded-lg font-mono font-bold text-slate-500 block text-center leading-none">
                      {new Date().toISOString().split('T')[0]}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">Advisable Expiry</span>
                    <span className="bg-slate-50 border p-2 rounded-lg font-mono font-bold text-slate-500 block text-center leading-none">
                      {new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-indigo-150" />
                  <span>Register Tank Batch</span>
                </button>
              </form>
            </div>

            {/* List and QA certificates (2.7 + 2.8) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-display font-extrabold text-[#111] text-xs uppercase tracking-widest font-mono">
                Core Silo Batch Registries ({batches.length})
              </h4>
              
              <div className="space-y-3">
                {batches.map((b) => (
                  <div key={b.batchNumber} className="bg-white border hover:border-indigo-100 rounded-2xl p-4 space-y-3 transition group relative">
                    
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-[#2e5bff] text-xs uppercase">
                            {b.batchNumber}
                          </span>
                          <span className="text-[8px] bg-slate-100 text-slate-500 px-1 font-semibold rounded">
                            Pool Tank Vol: {b.quantity}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-800 text-[11.5px] leading-none mt-0.5">{b.productName}</h4>
                      </div>

                      {/* Certificate status tag */}
                      <div>
                        {b.labReportStatus === 'approved' ? (
                          <span className="text-[9.5px] text-emerald-800 font-extrabold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-0.5 font-sans">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> FSSAI Approved
                          </span>
                        ) : (
                          <span className="text-[9.5px] text-amber-800 font-extrabold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded flex items-center gap-0.5 font-sans animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Uncertified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px] font-mono text-slate-550 pt-1">
                      <div>
                        <span className="text-slate-400 text-[8.5px] uppercase block leading-none">Milked Date</span>
                        <strong>{b.productionDate}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[8.5px] uppercase block leading-none">Discard Expiry</span>
                        <strong className="text-red-700">{b.expiryDate}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[8.5px] uppercase block leading-none">Organic Status</span>
                        <strong>{b.organicCertified ? '✓ Organic Cert' : 'Standard Feed'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[8.5px] uppercase block leading-none">Antibiotic residual</span>
                        <strong className={b.antibioticResidue ? 'text-emerald-700' : 'text-slate-400'}>
                          {b.antibioticResidue || 'Unchecked'}
                        </strong>
                      </div>
                    </div>

                    {/* Chemical ratios readout */}
                    {b.labReportStatus === 'approved' && (
                      <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 flex flex-wrap gap-x-4 gap-y-1.5 text-[9.5px] text-slate-500 font-mono">
                        <div>Fat Mass: <strong className="text-slate-700 font-extrabold">{b.fatPercent}%</strong></div>
                        <div>SNF index: <strong className="text-slate-700 font-extrabold">{b.snfPercent}%</strong></div>
                        <div>Pure pH Index: <strong className="text-indigo-700 font-extrabold">{b.phValue} pH</strong></div>
                        <div>Water added Adulteration check: <strong className="text-slate-700 font-extrabold">{b.waterAdulteration}</strong></div>
                      </div>
                    )}

                    {/* Quick cert triggers */}
                    <div className="flex gap-1.5 justify-end pt-1">
                      {b.labReportStatus === 'approved' ? (
                        <button
                          onClick={() => setActiveCertificateView(b)}
                          className="text-[10px] bg-indigo-60 hover:bg-indigo-120 hover:text-indigo-700 font-bold border-2 border-indigo-100 py-1 px-3 rounded-lg cursor-pointer transition flex items-center gap-1 text-indigo-650"
                        >
                          <FileText className="w-3.5 h-3.5" /> View printable certificate
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedBatchForQA(b);
                            // seed defaults matching batch or general cattle indices
                            setQaFat(b.fatPercent || 4.2);
                            setQaSnf(b.snfPercent || 8.8);
                            setQaOrganic(b.organicCertified !== undefined ? b.organicCertified : true);
                          }}
                          className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-1 px-3 rounded-lg cursor-pointer transition flex items-center gap-1 shadow-xs"
                        >
                          <Sliders className="w-3.5 h-3.5 text-indigo-200" />
                          <span>Sanatory Cert Signer</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2.3 REJECTION CAUSE CAPTURE INTERFACE DROPDOWN MODAL */}
      {rejectingOrderId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden border border-slate-250 p-6 space-y-4 shadow-2xl relative text-xs text-slate-600">
            <button 
              onClick={() => setRejectingOrderId(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-1 rounded-full text-slate-500 transition cursor-pointer border-0"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-2 border-b border-slate-100">
              <span className="text-[9px] bg-red-50 text-red-700 font-extrabold px-2 py-0.5 rounded-full font-mono uppercase tracking-widest leading-none">
                Dispatch Constraint Selector
              </span>
              <h3 className="font-display font-extrabold text-slate-800 text-sm mt-1.5">Specify Rejection Cause</h3>
              <p className="text-[10.5px] text-slate-400 mt-0.5">Choose rejection reason in compliance with retail guidelines.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Please choose dispatch error:</label>
              
              <div className="space-y-1.5">
                {[
                  { id: 'out_of_stock', title: '🔴 Product Out of Stock', desc: 'Silos/canisters empty or failed sanitary check' },
                  { id: 'not_serviceable', title: '🗺️ Area Not Serviceable', desc: 'Requested destination falls outer delivery hub coordinates' },
                  { id: 'capacity_full', title: '🚚 Capacity Full', desc: 'All local cold dispatch courier trucks are fully booked' }
                ].map((reason) => (
                  <label 
                    key={reason.id} 
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition cursor-pointer ${
                      selectedRejectReason === reason.id 
                        ? 'border-red-400 bg-red-50 text-slate-700' 
                        : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="rejectionReason"
                      checked={selectedRejectReason === reason.id}
                      onChange={() => setSelectedRejectReason(reason.id as any)}
                      className="mt-0.5 text-red-600 border-slate-200 focus:ring-red-500 w-3.5 h-3.5"
                    />
                    <div>
                      <strong className="block text-[11px] font-bold">{reason.title}</strong>
                      <span className="text-[9.5px] leading-tight text-slate-400 block">{reason.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setRejectingOrderId(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-center"
              >
                Go Back
              </button>
              
              <button
                onClick={handleConfirmRejection}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition cursor-pointer text-center shadow-xs"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2.8 LABORATORY CERTIFICATE SIGNER MODAL */}
      {selectedBatchForQA && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md my-8 overflow-hidden p-6 space-y-4 shadow-2xl relative text-xs text-slate-600">
            <button 
              onClick={() => setSelectedBatchForQA(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-1 rounded-full text-slate-500 transition cursor-pointer border-0"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-2 border-b border-indigo-50">
              <span className="text-[9px] bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-0.5 rounded-full font-mono uppercase tracking-widest leading-none">
                Quality Certificate Signer (2.8)
              </span>
              <h3 className="font-display font-extrabold text-slate-800 text-sm mt-1.5">Sign Certificate for {selectedBatchForQA.batchNumber}</h3>
              <p className="text-[10.5px] text-slate-400 mt-0.5">Authoritatively certify solid SNF ratios, fat masses, and FSSAI clearance seals.</p>
            </div>

            <form onSubmit={handleSignCertificate} className="space-y-4">
              <div>
                <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">FSSAI Licence Reference</label>
                <input 
                  type="text" 
                  value={qaFssai}
                  onChange={e => setQaFssai(e.target.value)}
                  placeholder="e.g. 10023409100028"
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Slider Fat */}
              <div className="space-y-1">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-400 uppercase text-[9px] font-bold">Cattle Fat Mass %</span>
                  <strong className="text-indigo-700">{qaFat.toFixed(1)}% Fat</strong>
                </div>
                <input 
                  type="range" 
                  min="2.5" 
                  max="8.0" 
                  step="0.1"
                  value={qaFat}
                  onChange={e => setQaFat(+e.target.value)}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* Slider SNF */}
              <div className="space-y-1">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-slate-400 uppercase text-[9px] font-bold">Solids Non-Fat (SNF) %</span>
                  <strong className="text-indigo-700">{qaSnf.toFixed(1)}% SNF</strong>
                </div>
                <input 
                  type="range" 
                  min="7.0" 
                  max="12.0" 
                  step="0.1"
                  value={qaSnf}
                  onChange={e => setQaSnf(+e.target.value)}
                  className="w-full accent-indigo-600"
                />
              </div>

              {/* pH meter index */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">pH Acidity Meter</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="6.0"
                    max="7.0"
                    value={qaPh}
                    onChange={e => setQaPh(+e.target.value)}
                    required
                    className="w-full bg-slate-50 border p-2 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">Water adulteration</label>
                  <select 
                    value={qaWater}
                    onChange={e => setQaWater(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded-xl text-xs"
                  >
                    <option value="0.0% Pure Bulk">0.0% Pure Bulk Milk (No water)</option>
                    <option value="0.5% negligible">0.5% Negligible condensation</option>
                    <option value="Water Added Adulterated">⚠️ Water Added Fail Code</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold mb-1">Antibiotic Residue Check</label>
                  <input 
                    type="text" 
                    value={qaAntibiotics}
                    onChange={e => setQaAntibiotics(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded-xl font-mono text-xs"
                  />
                </div>

                <div className="flex items-center gap-1.5 pt-3">
                  <input 
                    type="checkbox" 
                    id="complianceOrganic"
                    checked={qaOrganic}
                    onChange={e => setQaOrganic(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 accent-emerald-500 rounded border-slate-300"
                  />
                  <label htmlFor="complianceOrganic" className="text-[10px] font-bold text-emerald-800 flex items-center gap-0.5 cursor-pointer select-none">
                    🌿 Organic Cert Seal
                  </label>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBatchForQA(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-center"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition cursor-pointer text-center shadow-xs"
                >
                  Seal & Issue Cert ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2.8 STUNNING FSSAI PRINTABLE QA REPORT BOX MODAL */}
      {activeCertificateView && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-slate-50 border-4 border-slate-900 rounded-3xl w-full max-w-md my-8 overflow-hidden shadow-2xl relative font-sans text-xs text-slate-700 p-8 space-y-6">
            
            {/* Government FSSAI look header */}
            <div className="text-center space-y-1.5 border-b-2 border-dashed border-slate-300 pb-5">
              <div className="w-14 h-14 bg-emerald-600 text-white font-extrabold rounded-full mx-auto flex flex-col items-center justify-center leading-none text-[10px] border-2 border-white mb-1.5 shadow-md">
                <ShieldCheck className="w-6 h-6 shrink-0 text-white" />
                <span className="font-sans text-[7.5px] uppercase font-heavy tracking-widest mt-0.5">QA</span>
              </div>
              <h2 className="font-display font-black text-slate-900 text-sm tracking-wide uppercase">
                FSSI Laboratory Verification Certificate
              </h2>
              <span className="text-[10px] text-slate-505 font-mono font-semibold block leading-none">
                Govt. Regulatory Dairy Sanitary Clearance Seal
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-mono font-extrabold px-3 py-1 rounded-sm mt-2.5 inline-block border border-emerald-250">
                LICENSE REFERENCE NO: {activeCertificateView.fssaiNumber}
              </span>
            </div>

            {/* Document stats */}
            <div className="space-y-3 font-mono text-[10.5px]">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-400 uppercase">Registered Batch</span>
                <strong className="text-slate-900 font-bold">{activeCertificateView.batchNumber}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-400 uppercase">Liquid Source Name</span>
                <strong className="text-slate-900 font-bold">{activeCertificateView.productName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-400 uppercase">Volumetric Capacity</span>
                <strong className="text-slate-900 font-bold">{activeCertificateView.quantity}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-400 uppercase">Date Pasteurization</span>
                <strong className="text-slate-800">{activeCertificateView.productionDate}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-400 uppercase">Discard Date Limit</span>
                <strong className="text-red-700">{activeCertificateView.expiryDate}</strong>
              </div>
            </div>

            {/* Quality parameters table */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="text-[9px] text-[#444] uppercase font-mono tracking-wider block font-black border-b border-slate-100 pb-1">
                Chemical Constituents Verification
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
                <div className="bg-slate-50 p-2 rounded-lg border">
                  <span className="text-slate-400 text-[8px] block uppercase leading-none mb-1">Animal Milk Fat Mass</span>
                  <big className="text-slate-800 font-extrabold text-xs">{activeCertificateView.fatPercent}%</big>
                  <span className="text-[8px] text-emerald-600 block mt-0.5">✓ Standard Passed</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border">
                  <span className="text-slate-400 text-[8px] block uppercase leading-none mb-1">Solids Non-Fat (SNF)</span>
                  <big className="text-slate-800 font-extrabold text-xs">{activeCertificateView.snfPercent}%</big>
                  <span className="text-[8px] text-emerald-600 block mt-0.5">✓ Solid Index Clear</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border">
                  <span className="text-slate-400 text-[8px] block uppercase leading-none mb-1">Acidity Level pH</span>
                  <big className="text-slate-800 font-extrabold text-xs">{activeCertificateView.phValue}</big>
                  <span className="text-[8px] text-indigo-650 block mt-0.5">Sweet Raw range (6.6)</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border">
                  <span className="text-slate-400 text-[8px] block uppercase leading-none mb-1">Water Adulteration</span>
                  <big className="text-slate-800 font-extrabold text-[10.5px]">{activeCertificateView.waterAdulteration}</big>
                  <span className="text-[8px] text-emerald-600 block mt-0.5">✓ Zero added dilution</span>
                </div>
              </div>
            </div>

            {/* Organic seal indicator is active */}
            {activeCertificateView.organicCertified && (
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-2.5">
                <span className="text-2xl">🌱</span>
                <div>
                  <strong className="text-[10px] text-emerald-950 font-bold uppercase tracking-wider block">Indian Organic Standard Seal</strong>
                  <span className="text-[9px] leading-tight text-emerald-700 block">Identified as fully raw cow pasture silage feed, pesticide/growth-hormone free.</span>
                </div>
              </div>
            )}

            {/* Signature blocks */}
            <div className="pt-3 border-t-2 border-dashed border-slate-300 flex justify-between items-center text-[9px] font-mono">
              <div className="text-left">
                <span className="text-slate-400">Hub Signed Authority:</span>
                <strong className="block text-slate-900 mt-1 uppercase">Silo Chief Chemist</strong>
                <span className="text-[8px] border border-dashed border-slate-300 p-0.5 rounded px-1.5 bg-white text-slate-500 font-serif italic inline-block mt-0.5">
                  ✓ Krishna-Silo digital key
                </span>
              </div>
              
              <div className="text-right">
                <span className="text-slate-400">Compliance scan:</span>
                <div className="bg-slate-900 p-1 rounded inline-block mt-1">
                  <div className="w-[45px] h-[45px] bg-white p-0.5">
                    {/* Tiny visual representation of QR code */}
                    <div className="grid grid-cols-3 gap-0.5 w-full h-full bg-slate-900">
                      <div className="bg-white"></div>
                      <div></div>
                      <div className="bg-white"></div>
                      <div></div>
                      <div className="bg-white"></div>
                      <div></div>
                      <div className="bg-white"></div>
                      <div></div>
                      <div className="bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Close button printable action */}
            <div>
              <button
                onClick={() => setActiveCertificateView(null)}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white font-extrabold py-2.5 rounded-xl text-center cursor-pointer transition text-xs shadow-md"
              >
                Close Report View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
