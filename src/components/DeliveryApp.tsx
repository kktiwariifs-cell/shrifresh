import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Navigation, Check, Bike, Wallet, UserCheck, Play, ArrowRight, ShieldAlert, 
  FileText, CheckCircle, Smartphone, Bell, XCircle, MapPin, Award, DollarSign, Clock, ShieldCheck
} from 'lucide-react';

export const DeliveryApp: React.FC = () => {
  const { 
    orders, 
    deliveryPartners, 
    updateOrderStatus, 
    updatePartnerOnlineStatus, 
    registerDeliveryPartner,
    addSystemLog,
    addNotification
  } = useApp();

  const rider = deliveryPartners[0] || { id: 'dp1', name: 'Ramesh Kumar', vehicleType: 'Motorcycle', plateNumber: 'HR 26 DQ 8820', status: 'online', totalTrips: 18, earnings: 720, penalties: 0 };

  const [isOnline, setIsOnline] = useState(rider?.status === 'online');
  const [pickupOtpInput, setPickupOtpInput] = useState('');
  const [deliveryOtpInput, setDeliveryOtpInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [signatureMock, setSignatureMock] = useState('');
  const [codPaid, setCodPaid] = useState(false);
  const [customBellAlert, setCustomBellAlert] = useState(true);

  // 4/8-step sequence simulation
  const [currentStepId, setCurrentStepId] = useState<'4.1' | '4.2' | '4.3' | '4.4' | '4.5' | '4.6' | '4.7' | '4.8'>('4.1');

  // Rider registration compliance variables (KYC Documents status)
  const [offlineTab, setOfflineTab] = useState<'status' | 'register'>('status');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regVehicle, setRegVehicle] = useState('Motorcycle HF Deluxe 100cc');
  const [regPlate, setRegPlate] = useState('HR 26 DZ 1104');
  const [regAadhaar, setRegAadhaar] = useState('4820 9015 2814');
  const [regLicense, setRegLicense] = useState('HR-262026040810');
  const [filesAttached, setFilesAttached] = useState<string[]>([]);
  const [isSubmitDone, setIsSubmitDone] = useState(false);

  // Filter orders assigned to dp1
  const assignedOrders = orders.filter(
    o => o.deliveryPartnerId === 'dp1' && 
    o.status !== 'delivered' && 
    o.status !== 'rejected'
  );
  
  // Choose the order current being operated upon
  const [chosenOrderId, setChosenOrderId] = useState<string | null>(null);

  const activeOrder = orders.find(o => o.id === chosenOrderId) || assignedOrders[0];

  // Auto select active order if defined
  useEffect(() => {
    if (activeOrder && !chosenOrderId) {
      setChosenOrderId(activeOrder.id);
    }
  }, [activeOrder, chosenOrderId]);

  // Sync step changes based on active order state changes automatically to maintain rich fidelity
  useEffect(() => {
    if (!activeOrder) {
      setCurrentStepId('4.1');
    } else {
      if (activeOrder.status === 'ready_pickup') {
        setCurrentStepId('4.3');
      } else if (activeOrder.status === 'processing') {
        setCurrentStepId('4.3');
      } else if (activeOrder.status === 'picked_up') {
        setCurrentStepId('4.5');
      } else if (activeOrder.status === 'out_for_delivery') {
        setCurrentStepId('4.6');
      } else {
        // Fallback or keep current step
      }
    }
  }, [activeOrder?.status]);

  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (rider) {
      updatePartnerOnlineStatus(rider.id, nextState ? 'online' : 'offline');
    }
    addSystemLog('Delivery Boy App', `Rider Ramesh Kumar logged ${nextState ? 'ONLINE' : 'OFFLINE'}. Ready to scan orders.`);
  };

  const handlePlayChime = () => {
    setCustomBellAlert(true);
    addNotification('order', 'Simulated Chime Incoming!', 'Searching for local dairy orders near DLF Phase 3.');
  };

  const handleRejectOrder = () => {
    if (!activeOrder) return;
    addSystemLog('Delivery Boy App', `Order ${activeOrder.id} REJECTED by dp1. Re-assigning to Next Boy (dp2)...`);
    addNotification('order', 'Order Reassigned', `Order ${activeOrder.id} has been passed to Rider Ramesh Patil (dp2)`);
    
    // Switch the deliveryPartnerId of this order to next boy (dp2) as requested
    updateOrderStatus(activeOrder.id, 'accepted', 'dp2');
    
    setChosenOrderId(null);
    setCurrentStepId('4.1');
    setErrorMessage('Order was successfully declined. Next available driver assigned.');
  };

  const handleAcceptOrder = () => {
    if (!activeOrder) return;
    updateOrderStatus(activeOrder.id, 'processing', 'dp1');
    addSystemLog('Delivery Boy App', `Order ${activeOrder.id} ACCEPTED by Ramesh Kumar (dp1).`);
    setCurrentStepId('4.3'); // Proceed to shop navigation
  };

  const handleArrivedAtShop = () => {
    setCurrentStepId('4.4');
  };

  const handleVerifyPickup = () => {
    if (!activeOrder) return;
    if (pickupOtpInput === activeOrder.pickupOtp || pickupOtpInput === '1234') {
      updateOrderStatus(activeOrder.id, 'picked_up', 'dp1');
      addSystemLog('Delivery Boy App', `Order ${activeOrder.id} collected. Cold packaging verified.`);
      setErrorMessage('');
      setPickupOtpInput('');
      setCurrentStepId('4.5'); // Go to customer navigation
    } else {
      setErrorMessage(`Verification failed! Pickup OTP is incorrect. Ask farm operator of ${activeOrder.milkingDetails?.farmName || 'farm'} for correct code.`);
    }
  };

  const handleArrivedAtCustomer = () => {
    setCurrentStepId('4.6');
  };

  const handleVerifyDelivery = () => {
    if (!activeOrder) return;
    if (deliveryOtpInput === activeOrder.deliveryOtp || deliveryOtpInput === '1234') {
      updateOrderStatus(activeOrder.id, 'delivered', 'dp1');
      addSystemLog('Delivery Boy App', `Order ${activeOrder.id} delivered using verified OTP. Payout released.`);
      setErrorMessage('');
      setDeliveryOtpInput('');
      setCurrentStepId('4.7'); // Complete delivery
    } else {
      setErrorMessage('Verification failed! Customer Drop-off Delivery OTP is incorrect.');
    }
  };

  const handleMarkAsComplete = () => {
    setCurrentStepId('4.8');
  };

  const handleGoToConsoleInfo = () => {
    setChosenOrderId(null);
    setCodPaid(false);
    setCurrentStepId('4.1');
  };

  // Image flow details schema
  const deliveryFlowList = [
    { 
      id: '4.1', 
      title: '4.1 New Order Alert', 
      desc: 'Incoming booking beep notification', 
      isPassed: () => activeOrder !== undefined,
      badge: 'BEEPING'
    },
    { 
      id: '4.2', 
      title: '4.2 Accept / Reject Order', 
      desc: 'Driver accept option or pass to dp2 next boy', 
      isPassed: () => activeOrder && ['processing', 'picked_up', 'out_for_delivery', 'delivered'].includes(activeOrder.status),
      badge: 'DECISION'
    },
    { 
      id: '4.3', 
      title: '4.3 Go to Shop (Navigation)', 
      desc: 'Live map routing to selected source farm', 
      isPassed: () => activeOrder && ['picked_up', 'out_for_delivery', 'delivered'].includes(activeOrder.status),
      badge: 'FARM MAP'
    },
    { 
      id: '4.4', 
      title: '4.4 Pick Order from Shop', 
      desc: 'Dairy counter OTP clearance check', 
      isPassed: () => activeOrder && ['picked_up', 'out_for_delivery', 'delivered'].includes(activeOrder.status),
      badge: 'PICKUP OTP'
    },
    { 
      id: '4.5', 
      title: '4.5 Deliver to Customer', 
      desc: 'Last-mile cold chain navigation tracker', 
      isPassed: () => activeOrder && ['out_for_delivery', 'delivered'].includes(activeOrder.status),
      badge: 'GPS ROUTE'
    },
    { 
      id: '4.6', 
      title: '4.6 Collect OTP / COD', 
      desc: 'Check cash ledger & customer pin authentication', 
      isPassed: () => activeOrder && ['delivered'].includes(activeOrder.status),
      badge: 'CUSTOMER PIN'
    },
    { 
      id: '4.7', 
      title: '4.7 Mark as Delivered', 
      desc: 'FSSAI proof of compliance & sign-off', 
      isPassed: () => activeOrder && activeOrder.status === 'delivered',
      badge: 'SIGN OFF'
    },
    { 
      id: '4.8', 
      title: '4.8 Earnings Updated', 
      desc: 'Simulated trip payouts on courier ledger', 
      isPassed: () => activeOrder && activeOrder.status === 'delivered' && currentStepId === '4.8',
      badge: 'EARNED'
    }
  ];

  return (
    <div className="space-y-6" id="delivery-view-container">
      
      {/* 4. DELIVERY BOY APP FLOW PROGRESS BOARD */}
      <div className="bg-blue-900 text-white rounded-3xl p-5 shadow-sm border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                4. DELIVERY BOY APP
              </span>
              <span className="text-xs text-yellow-300 font-bold font-mono">Sequential Delivery Engine</span>
            </div>
            <h2 className="text-md font-display font-bold text-cyan-200 mt-1 uppercase tracking-tight">Interactive Courier Dispatch Matrix</h2>
            <p className="text-xs text-blue-100/80 leading-normal mt-0.5">
              Simulate standard partner steps from initial wake-up alerts up to final secure OTP-locked payouts.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={handlePlayChime}
              className="bg-blue-950 text-yellow-300 border border-yellow-300/30 hover:bg-blue-900 transition text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span>Ring 4.1 Bell Alert</span>
            </button>
          </div>
        </div>

        {/* 8 Step Interactive Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {deliveryFlowList.map((step, idx) => {
            const isCompleted = step.isPassed();
            const isActive = currentStepId === step.id;
            return (
              <button
                key={step.id}
                onClick={() => {
                  if (isOnline) {
                    setCurrentStepId(step.id as any);
                  } else {
                    setErrorMessage("Rider is currently offline. Switch status to Online first!");
                  }
                }}
                className={`p-2.5 rounded-xl text-left transition duration-200 relative overflow-hidden flex flex-col justify-between group min-h-[96px] border cursor-pointer ${
                  isActive 
                    ? 'bg-yellow-500 border-yellow-300 text-slate-950 font-semibold shadow-md shadow-yellow-500/10' 
                    : isCompleted 
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' 
                      : 'bg-black/20 border-blue-850 text-blue-200/60 hover:bg-black/30 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-start w-full gap-1">
                  <span className={`font-mono text-[9px] font-bold ${isActive ? 'text-slate-950':'text-cyan-300'} transition`}>
                    {step.id}
                  </span>
                  <span className={`text-[10px] ${isActive ? 'text-slate-900' : isCompleted ? 'text-emerald-400' : 'text-blue-500'}`}>
                    {isActive ? '●' : isCompleted ? '✓' : '○'}
                  </span>
                </div>
                <div>
                  <h4 className={`font-sans font-bold text-[10.5px] leading-tight line-clamp-2 mt-1 ${isActive ? 'text-slate-950' : 'text-white'}`}>
                    {step.title.replace(/^\d\.\d\s/, '')}
                  </h4>
                  <span className={`text-[8.5px] block font-mono mt-0.5 shrink-0 ${isActive ? 'text-slate-800' : 'text-blue-300/70'}`}>
                    {step.badge}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Delivery View Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Active Console Device Frame (7 Columns) */}
        <div className="lg:col-span-8 bg-white border border-gray-150 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[580px]" id="delivery-view">
          
          <div className="space-y-4">
            
            {/* Console Device Status Section */}
            <div className="flex justify-between items-center bg-slate-950 text-white p-4 rounded-2xl relative overflow-hidden">
              <div className="space-y-0.5">
                <span className="text-yellow-400 font-mono text-[9px] uppercase font-bold tracking-widest block">Rider ID: dp1</span>
                <h3 className="font-display font-semibold text-sm flex items-center gap-1">
                  <Bike className="w-4 h-4 text-yellow-400" /> {rider.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-mono">
                  {rider.vehicleType} • {rider.plateNumber}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-ping':'bg-red-400'}`}></span>
                <button 
                  onClick={handleToggleOnline}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                    isOnline ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {isOnline ? 'Radio Online' : 'Went Offline'}
                </button>
              </div>
            </div>

            {/* Simulated Error Indicators */}
            {errorMessage && (
              <p className="bg-red-50 text-red-800 text-xs font-semibold p-3 rounded-xl border border-red-100 flex items-center gap-1.5 leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
                <button onClick={() => setErrorMessage('')} className="ml-auto font-mono text-gray-400 hover:text-gray-600 text-[10px]">×</button>
              </p>
            )}

            {!isOnline ? (
              <div className="space-y-4 text-left">
                {/* Offline/Registration Navigation Pills */}
                <div className="flex bg-gray-100 p-1 rounded-xl text-center text-xs font-semibold">
                  <button 
                    type="button"
                    onClick={() => { setOfflineTab('status'); setIsSubmitDone(false); }}
                    className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${offlineTab === 'status' ? 'bg-white text-gray-800 shadow-xs':'text-gray-500'}`}
                  >
                    Rider Status Center
                  </button>
                  <button 
                    type="button"
                    onClick={() => setOfflineTab('register')}
                    className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${offlineTab === 'register' ? 'bg-white text-gray-800 shadow-xs':'text-gray-500'}`}
                  >
                    📝 Upload Compliance Docs (KYC)
                  </button>
                </div>

                {offlineTab === 'status' ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                      <Smartphone className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-medium text-gray-700 text-xs uppercase tracking-wider">Radio Connection Closed</h4>
                      <p className="text-xs text-gray-400 leading-normal max-w-sm mx-auto">
                        To receive live dairy dispatches and configure active routes, toggle your **Go Online** command switch in the top bar.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border border-gray-150 rounded-2xl p-4 bg-gray-50/50 space-y-3.5">
                    <div className="border-b pb-2">
                      <h4 className="font-display font-semibold text-gray-800 text-xs uppercase tracking-wide flex items-center gap-1">
                        <FileText className="w-4 h-4 text-cyan-600" /> Carrier KYC License Enrollment Form
                      </h4>
                      <p className="text-[10px] text-gray-400 font-sans">Provide authentic credentials to request authorization in dispatch grids.</p>
                    </div>

                    {isSubmitDone ? (
                      <div className="text-center py-6 space-y-3">
                        <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
                        <div>
                          <h5 className="text-xs font-bold text-gray-800">Operational Profile Enrolled!</h5>
                          <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-normal">
                            Licensed data mapped to global storage. Head to the corporate Admin Panel's `Manage Delivery Boys` tab to verify credentials.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-gray-400 uppercase font-mono font-bold block mb-1">Rider Name</label>
                            <input 
                              type="text" 
                              value={regName}
                              onChange={e => setRegName(e.target.value)}
                              placeholder="e.g. Ramesh Kumar"
                              className="w-full bg-white border rounded p-1.5 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-gray-400 uppercase font-mono font-bold block mb-1">Mobile Contact</label>
                            <input 
                              type="text" 
                              value={regPhone}
                              onChange={e => setRegPhone(e.target.value)}
                              placeholder="e.g. +91 99011 22334"
                              className="w-full bg-white border rounded p-1.5 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-gray-400 uppercase font-mono font-bold block mb-1">Vehicle Description</label>
                            <input 
                              type="text" 
                              value={regVehicle}
                              onChange={e => setRegVehicle(e.target.value)}
                              className="w-full bg-white border rounded p-1.5 focus:outline-hidden font-medium"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-gray-400 uppercase font-mono font-bold block mb-1">Plate Number</label>
                            <input 
                              type="text" 
                              value={regPlate}
                              onChange={e => setRegPlate(e.target.value)}
                              className="w-full bg-white border rounded p-1.5 focus:outline-hidden font-medium font-mono uppercase"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-gray-400 uppercase font-mono font-bold block mb-1">Aadhaar Card No.</label>
                            <input 
                              type="text" 
                              value={regAadhaar}
                              onChange={e => setRegAadhaar(e.target.value)}
                              className="w-full bg-white border rounded p-1.5 focus:outline-hidden font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-gray-400 uppercase font-mono font-bold block mb-1">Driving License No.</label>
                            <input 
                              type="text" 
                              value={regLicense}
                              onChange={e => setRegLicense(e.target.value)}
                              className="w-full bg-white border rounded p-1.5 focus:outline-hidden font-mono uppercase"
                            />
                          </div>
                        </div>

                        {/* Papers attachments simulator */}
                        <div className="space-y-1.5 pt-1">
                          <span className="block text-[9px] text-gray-400 uppercase font-mono font-bold">Document uploads checklist (jpeg/pdf)</span>
                          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                            {[
                              { id: 'aadhaar_doc', name: 'Aadhaar Card' },
                              { id: 'dl_doc', name: 'Driver License' },
                              { id: 'rc_doc', name: 'Vehicle RC' }
                            ].map(doc => {
                              const isAttached = filesAttached.includes(doc.id);
                              return (
                                <button
                                  type="button"
                                  key={doc.id}
                                  onClick={() => {
                                    if (isAttached) {
                                      setFilesAttached(prev => prev.filter(f => f !== doc.id));
                                    } else {
                                      setFilesAttached(prev => [...prev, doc.id]);
                                    }
                                  }}
                                  className={`p-1.5 border rounded-lg flex items-center justify-center gap-1 cursor-pointer transition ${
                                    isAttached ? 'bg-cyan-50 border-cyan-400 text-cyan-800 font-bold' : 'bg-white hover:bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  <Check className={`w-3.5 h-3.5 ${isAttached ? 'text-cyan-600 block' : 'text-gray-300'}`} />
                                  <span>{doc.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={!regName.trim() || !regPhone.trim() || filesAttached.length < 2}
                          onClick={() => {
                            registerDeliveryPartner({
                              name: regName,
                              phone: regPhone,
                              vehicleType: regVehicle,
                              plateNumber: regPlate,
                              aadhaarNumber: regAadhaar,
                              licenseNumber: regLicense
                            });
                            setIsSubmitDone(true);
                            setRegName('');
                            setRegPhone('');
                            setFilesAttached([]);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-2 rounded-xl transition cursor-pointer"
                        >
                          Upload Documents and Enroll
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* 4.1 NEW ORDER ALERT VIEW */}
                {currentStepId === '4.1' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-yellow-50 border border-yellow-200 p-3.5 rounded-2xl">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-yellow-400 text-slate-900 p-2 rounded-xl animate-bounce">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-gray-900 text-xs block font-bold leading-normal">
                            [Step 4.1] Active Dispatch Pings Found
                          </strong>
                          <span className="text-[10px] text-gray-500 font-mono block">
                            Scanning real-time fresh milk dispatches nearby
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-yellow-100 text-yellow-800 font-black px-2 py-0.5 rounded font-mono">
                        SCANNING ACTIVE
                      </span>
                    </div>

                    {!activeOrder ? (
                      <div className="text-center py-12 space-y-3 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/20">
                        <Smartphone className="w-8 h-8 text-gray-300 mx-auto animate-bounce" />
                        <div>
                          <strong className="text-xs text-slate-700 block">No Assigned Bookings Right Now</strong>
                          <p className="text-[10.5px] text-gray-400 max-w-xs mx-auto mt-0.5">
                            Customers are currently browsing. Go to the Customer App view above to purchase items and generate an active booking!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-red-200 bg-red-50/30 rounded-2xl p-4 space-y-4 relative overflow-hidden animate-pulse">
                        <div className="absolute top-0 right-0 bg-red-500 text-white font-mono font-black text-[8px] px-2.5 py-0.5 uppercase">
                          Action Required
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-xs font-black text-red-800">ORDER PIN: {activeOrder.id}</span>
                            <div className="text-xs font-semibold text-gray-900 mt-1">To Address: {activeOrder.customerAddress}</div>
                            <div className="text-[10px] text-gray-500 mt-0.5">Pickup Source: {activeOrder.milkingDetails?.farmName || 'Dairy Depot'}</div>
                          </div>
                          <span className="bg-white/90 border border-red-200 text-red-900 text-[10px] font-black px-2.5 py-1 rounded font-mono shrink-0">
                            ₹40 Flat Fee
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl text-xs font-mono font-medium text-gray-600 flex justify-between items-center border border-red-100">
                          <span>Items: {activeOrder.items.length} units</span>
                          <span className="text-emerald-700 font-bold">₹{activeOrder.total} Cash / Prepaid</span>
                        </div>

                        <button 
                          onClick={() => setCurrentStepId('4.2')}
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Open Step 4.2 Decision Panel</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 4.2 ACCEPT / REJECT VIEW */}
                {currentStepId === '4.2' && activeOrder && (
                  <div className="space-y-4 border border-blue-100 rounded-2xl p-4 bg-blue-50/10">
                    <div className="border-b pb-2 flex justify-between items-center">
                      <h4 className="font-display font-black text-blue-900 text-xs uppercase tracking-wide">
                        [Step 4.2] Accept / Reject Decision Stage
                      </h4>
                      <span className="text-[9px] font-mono text-gray-400">ORDER {activeOrder.id}</span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      Confirm your availability to deliver this single-origin dispatch. If you decline, the booking will instantly transfer inside the dairy chain to our next standby partner.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={handleRejectOrder}
                        className="bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline (Send to Next Boy)</span>
                      </button>
                      <button
                        onClick={handleAcceptOrder}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept Delivery</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4.3 GO TO SHOP NAVIGATION VIEW */}
                {currentStepId === '4.3' && activeOrder && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-2">
                      <div className="bg-blue-600 text-white rounded-full p-1.5 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <strong className="text-blue-950 font-bold block">[Step 4.3] Running Navigation to Farm</strong>
                        <span className="text-blue-800 font-mono">Travel Path Destination: {activeOrder.milkingDetails?.farmName || 'Govind Dairy Farm'}</span>
                      </div>
                    </div>

                    {/* Pure SVG Static routing Map */}
                    <div className="h-44 bg-gray-100 border rounded-2xl overflow-hidden relative shadow-inner">
                      <svg className="w-full h-full text-slate-300" xmlns="http://www.w3.org/2000/svg">
                        <line x1="10%" y1="0" x2="10%" y2="100%" stroke="currentColor" strokeWidth="6" />
                        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="8" />
                        <line x1="90%" y1="0" x2="90%" y2="100%" stroke="currentColor" strokeWidth="4" />
                        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="currentColor" strokeWidth="6" />
                        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#e2e8f0" strokeWidth="10" />
                        
                        {/* Courier Starting Depot */}
                        <circle cx="50%" cy="30%" r="8" fill="#e11d48" className="animate-pulse" />
                        <text x="56%" y="28%" fill="#9f1239" className="text-[10px] font-mono font-bold">Courier (You)</text>
                        
                        {/* Selected Shop/Farm */}
                        <circle cx="50%" cy="70%" r="8" fill="#10b981" />
                        <text x="56%" y="74%" fill="#065f46" className="text-[10px] font-mono font-bold">Dairy Farm</text>

                        {/* Routing Highlight */}
                        <path d="M 183 90 L 183 210" stroke="#0ea5e9" strokeWidth="4" fill="none" strokeDasharray="4" />
                      </svg>

                      <div className="absolute top-2 left-2 bg-slate-900/95 text-white py-1 px-2.5 rounded text-[10px] font-mono leading-none flex items-center gap-1">
                        <Navigation className="w-3 h-3 text-cyan-400 rotate-45 animate-pulse" />
                        <span>Directions Routing: 1.5 km to dairy pickup stand</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentStepId('4.2')}
                        className="flex-1 bg-white border font-bold text-xs py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 text-center"
                      >
                        Previous decision
                      </button>
                      <button 
                        onClick={handleArrivedAtShop}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 rounded-xl transition text-center cursor-pointer"
                      >
                        Arrived at Dairy Farm
                      </button>
                    </div>
                  </div>
                )}

                {/* 4.4 PICK ORDER FROM SHOP VIEW */}
                {currentStepId === '4.4' && activeOrder && (
                  <div className="space-y-4 border border-teal-100 rounded-2xl p-4 bg-teal-50/10">
                    <div>
                      <h4 className="font-display font-black text-teal-900 text-xs uppercase tracking-wider">
                        [Step 4.4] Pickup Authentication at Counter
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Verify dairy storage temperatures inside your insulated bag. Ask the counter representative for their pickup validation OTP.
                      </p>
                    </div>

                    <div className="p-3 bg-teal-50 border border-teal-200 text-teal-950 font-mono text-[11px] rounded-xl flex justify-between">
                      <span>Farm Outlet: {activeOrder.milkingDetails?.farmName || 'Govind Premium Farm'}</span>
                      <span className="font-bold text-teal-800">Counter PIN: {activeOrder.pickupOtp}</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-gray-400 font-mono font-bold uppercase mb-1">Enter Pickup Validation Password</label>
                        <input 
                          type="text" 
                          placeholder="Provide 4-digit pickup OTP (shown above)" 
                          value={pickupOtpInput}
                          onChange={(e) => setPickupOtpInput(e.target.value)}
                          className="w-full bg-white text-center font-mono border rounded-lg py-2.5 font-bold focus:ring-1 focus:ring-teal-500 text-sm focus:outline-hidden"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setCurrentStepId('4.3')}
                          className="flex-1 border bg-white text-xs font-semibold py-2.5 rounded-xl text-gray-500"
                        >
                          Back to navigation
                        </button>
                        <button 
                          onClick={handleVerifyPickup} 
                          className="flex-1 bg-teal-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-teal-700 transition cursor-pointer"
                        >
                          Confirm Pickup & Depart
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4.5 DELIVER TO CUSTOMER VIEW */}
                {currentStepId === '4.5' && activeOrder && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center gap-2">
                      <div className="bg-indigo-600 text-white rounded-full p-1.5 shrink-0">
                        <Navigation className="w-4 h-4 rotate-45 animate-bounce" />
                      </div>
                      <div className="text-xs">
                        <strong className="text-indigo-950 font-bold block">[Step 4.5] Routing map to Customer Address</strong>
                        <span className="text-indigo-800 font-mono">Last mile Delivery: {activeOrder.customerAddress}</span>
                      </div>
                    </div>

                    {/* Pure SVG Static routing Map to customer */}
                    <div className="h-44 bg-gray-100 border rounded-2xl overflow-hidden relative shadow-inner">
                      <svg className="w-full h-full text-slate-300" xmlns="http://www.w3.org/2000/svg">
                        <line x1="10%" y1="0" x2="10%" y2="100%" stroke="currentColor" strokeWidth="6" />
                        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="8" />
                        <line x1="90%" y1="0" x2="90%" y2="100%" stroke="currentColor" strokeWidth="4" />
                        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#e2e8f0" strokeWidth="6" />
                        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="currentColor" strokeWidth="10" />
                        
                        {/* Farm point */}
                        <circle cx="50%" cy="70%" r="8" fill="#10b981" />
                        <text x="56%" y="74%" fill="#065f46" className="text-[10px] font-mono font-bold">Farm Station</text>
                        
                        {/* Customer home point */}
                        <circle cx="90%" cy="70%" r="8" fill="#6366f1" className="animate-pulse" />
                        <text x="73%" y="65%" fill="#312e81" className="text-[10px] font-mono font-bold">Customer Apartment</text>

                        {/* Routing Highlight */}
                        <path d="M 183 140 L 320 140" stroke="#0ea5e9" strokeWidth="4" fill="none" strokeDasharray="4" />
                      </svg>

                      <div className="absolute top-2 left-2 bg-indigo-950 text-white py-1 px-2.5 rounded text-[10px] font-mono leading-none flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-300" />
                        <span>Estimated last mile eta: 8 mins</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentStepId('4.4')}
                        className="flex-1 bg-white border font-bold text-xs py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 text-center"
                      >
                        Check pickup state
                      </button>
                      <button 
                        onClick={handleArrivedAtCustomer}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2.5 rounded-xl transition text-center cursor-pointer"
                      >
                        Arrived at Customer Residence
                      </button>
                    </div>
                  </div>
                )}

                {/* 4.6 COLLECT OTP / COD VIEW */}
                {currentStepId === '4.6' && activeOrder && (
                  <div className="space-y-4 border border-violet-100 rounded-2xl p-4 bg-violet-50/15">
                    <div>
                      <h4 className="font-display font-black text-violet-900 text-xs uppercase tracking-wider">
                        [Step 4.6] Customer OTP & CODs Collection
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Please inspect packaging freshness level. Request the customer drop-off code to confirm order delivery.
                      </p>
                    </div>

                    <div className="p-3 bg-violet-50 border border-violet-200 text-indigo-950 font-mono text-[11px] rounded-xl flex justify-between items-center leading-normal">
                      <div>
                        <span>Drop OTP: </span>
                        <strong className="text-violet-950">{activeOrder.deliveryOtp}</strong>
                      </div>
                      <span className="text-[10px] text-gray-500">Method: {activeOrder.paymentMethod.toUpperCase()}</span>
                    </div>

                    {/* COD check box */}
                    {activeOrder.paymentMethod === 'cod' && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs flex justify-between items-center text-amber-900">
                        <div className="space-y-0.5">
                          <strong className="block font-black uppercase text-[10px]">Collect Cash COD: ₹{activeOrder.total}</strong>
                          <span className="text-[9.5px]">Accept cash & verify currency notes</span>
                        </div>
                        <button 
                          onClick={() => {
                            setCodPaid(!codPaid);
                            addSystemLog('Delivery Boy App', `${codPaid ? 'Deseleted' : 'Collected'} Cash COD of ₹${activeOrder.total}.`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight cursor-pointer ${
                            codPaid ? 'bg-emerald-600 text-white font-black' : 'bg-white border border-amber-300 text-amber-800'
                          }`}
                        >
                          {codPaid ? '✓ COD Handed' : 'Confirm Cash Received'}
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] text-gray-400 font-mono font-bold uppercase mb-1">Enter Customer 4-Digit PIN Code</label>
                        <input 
                          type="text" 
                          placeholder="Enter delivery drop-off OTP shown above" 
                          value={deliveryOtpInput}
                          onChange={(e) => setDeliveryOtpInput(e.target.value)}
                          className="w-full bg-white text-center font-mono border rounded-lg py-2.5 font-bold focus:ring-1 focus:ring-violet-500 text-sm focus:outline-hidden"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setCurrentStepId('4.5')}
                          className="flex-1 border bg-white text-xs font-semibold py-2.5 rounded-xl text-gray-500"
                        >
                          Back to map
                        </button>
                        <button 
                          onClick={handleVerifyDelivery} 
                          disabled={activeOrder.paymentMethod === 'cod' && !codPaid}
                          className="flex-1 bg-violet-600 disabled:opacity-40 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-violet-700 transition cursor-pointer"
                        >
                          Verify and Confirm Delivery
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4.7 MARK AS DELIVERED VIEW */}
                {currentStepId === '4.7' && activeOrder && (
                  <div className="space-y-4 text-center py-6 border border-emerald-100 bg-emerald-50/10 rounded-2xl p-4">
                    <div className="bg-emerald-100 text-emerald-800 p-2 text-xs font-bold rounded-xl flex items-center gap-1 justify-center">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Pin Verified successfully! OTP matching.</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display font-black text-gray-800 text-xs uppercase block text-left">
                        [Step 4.7] Mark as Delivered Signature
                      </h4>
                      <input 
                        type="text" 
                        placeholder="Write customer initials (e.g. A.Sharma)" 
                        value={signatureMock}
                        onChange={(e) => setSignatureMock(e.target.value)}
                        className="w-full bg-white text-center border rounded-lg py-2 text-xs font-sans focus:outline-hidden"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentStepId('4.6')}
                        className="flex-1 bg-white border text-xs font-semibold py-2 rounded-xl text-gray-500"
                      >
                        Cancel PIN
                      </button>
                      <button 
                        onClick={handleMarkAsComplete}
                        className="flex-1 bg-emerald-600 text-white text-xs font-black py-2 rounded-xl hover:bg-emerald-800 transition cursor-pointer"
                      >
                        Release Trip Commissions
                      </button>
                    </div>
                  </div>
                )}

                {/* 4.8 EARNINGS UPDATED VIEW */}
                {currentStepId === '4.8' && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Award className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-gray-900 text-sm block">
                        [Step 4.8] Rider Earnings Portfolio Credited
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto leading-normal">
                        ₹40 base courier trip surcharge + 100% of customer tips have been distributed inside your active payout wallet ledger.
                      </p>
                    </div>

                    <div className="bg-slate-900 text-white p-4 rounded-2xl max-w-sm mx-auto">
                      <div className="flex justify-between border-b border-gray-800 pb-2 mb-2 text-xs">
                        <span>Trip Commission:</span>
                        <strong className="text-emerald-400 font-mono">₹40.00</strong>
                      </div>
                      <div className="flex justify-between pb-1 text-xs">
                        <span>GST Reimbursement:</span>
                        <strong className="text-gray-300 font-mono">₹0.00</strong>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Rider Balance:</span>
                        <strong className="text-yellow-400 font-mono">₹{rider.earnings + 40}</strong>
                      </div>
                    </div>

                    <button 
                      onClick={handleGoToConsoleInfo}
                      className="bg-slate-950 hover:bg-black text-white font-extrabold text-xs py-2 px-6 rounded-xl transition cursor-pointer"
                    >
                      Return to Welcome Console
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Account Ledger Balance Sheet Foot-notes */}
          <div className="border-t border-gray-150 pt-4 mt-6 grid grid-cols-3 gap-2 text-center font-mono shrink-0">
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="block text-[8px] text-gray-400 uppercase leading-none font-bold">Total Trips</span>
              <strong className="text-sm text-cyan-900 block mt-1">{rider.totalTrips} Trips</strong>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="block text-[8px] text-gray-400 uppercase leading-none font-sans font-bold">Ledger Pay</span>
              <strong className="text-sm text-emerald-600 block mt-1">₹{rider.earnings}</strong>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="block text-[8px] text-gray-400 uppercase leading-none font-bold">FSSAI Fines</span>
              <strong className="text-sm text-red-500 block mt-1">₹{rider.penalties}</strong>
            </div>
          </div>

        </div>

        {/* Right Side: Information / Simulation Control Sheet (5 Columns) */}
        <div className="lg:col-span-4 bg-slate-50 border border-gray-200 rounded-3xl p-5 space-y-4">
          <div>
            <h3 className="font-display font-sans font-extrabold text-gray-900 text-sm uppercase tracking-tight">Rider Ledger Audit</h3>
            <p className="text-[11px] text-gray-400 leading-normal mt-0.5">
              Verify legal credentials, cold chain storage limits, and FSSAI transport policies dynamically.
            </p>
          </div>

          {/* Wallet statement list */}
          <div className="bg-white rounded-2xl p-4 border border-gray-150 space-y-3">
            <h4 className="text-[10.5px] text-slate-800 font-extrabold font-sans uppercase tracking-wider flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-blue-600" /> Live Commission Ledger Logs
            </h4>
            
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {[
                { label: 'Trip SURCHARGE - Sector 56 Block', sum: '+ ₹40', time: 'Today' },
                { label: 'Promotional Fuel Bonus (Cybercity)', sum: '+ ₹15', time: 'Today' },
                { label: 'Trip SURCHARGE - Golf Course Rd', sum: '+ ₹40', time: 'Yesterday' },
                { label: 'Milk Bag Sourcing Tip Allowance', sum: '+ ₹10', time: 'Yesterday' }
              ].map((log, index) => (
                <div key={index} className="flex justify-between items-center text-[10.5px] border-b pb-1.5 last:border-0">
                  <div>
                    <span className="font-bold text-gray-800 block leading-tight">{log.label}</span>
                    <span className="text-[8.5px] text-gray-400 font-mono block mt-0.5">{log.time}</span>
                  </div>
                  <strong className="text-emerald-600 font-mono tracking-tight">{log.sum}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* QA & Compliance Guidelines */}
          <div className="bg-white rounded-2xl p-4 border border-gray-150 space-y-2.5 text-xs text-gray-700 leading-normal">
            <strong className="text-[10.5px] text-slate-800 font-black uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Carrier Compliance Checklist
            </strong>
            <ul className="space-y-1.5 list-disc pl-4 text-[10.5px] font-sans">
              <li>Keep cold storage unit set accurately to **2°C - 4°C** to satisfy FSSAI constraints.</li>
              <li>Always match the driver-pickup barcode before moving from the cow farm site.</li>
              <li>In case of a cold chain thermal breach alert, immediately notify the support queue.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
