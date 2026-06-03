import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building, Users, Briefcase, Zap, ShieldCheck, Ticket, BarChart3, LineChart, Cpu, Sparkles, 
  RefreshCw, Star, TrendingUp, Handshake, AlertCircle, ShoppingBag, DollarSign, 
  Map, Send, Settings, Award, Navigation, Activity, FileText, CheckCircle,
  Calendar, Truck, ChevronRight, Wallet, Percent, MapPin, RotateCcw, RotateCw, Plus,
  Search, Trash, PlusCircle, MessageSquare, ClipboardList, Gift, Sparkle
} from 'lucide-react';
import { SupportTicket, Order, FinancialRecord } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    products, orders, deliveryPartners, updateKycStatus, finances,
    systemLogs, notifications, loyaltyPoints, addNotification, addSystemLog, 
    clearSystemLogs, updateOrderStatus, addLoyaltyPoints, tickets, sendTicketMessage
  } = useApp();
  
  // --- Exact 11 Corporate Sections Admin Tabs (From Visual Blueprint Setup) ---
  type AdminTabType = 
    | 'dashboard'      // 5.1 Dashboard (Overview)
    | 'customers'      // 5.2 Manage Customers
    | 'merchants'      // 5.3 Manage Merchants / Shops
    | 'deliveryBoys'    // 5.4 Manage Delivery Boys
    | 'orders'         // 5.5 Orders Management
    | 'earnings'       // 5.6 Earnings & Payouts
    | 'commission'     // 5.7 Commission Management
    | 'offers'         // 5.8 Offers & Coupons
    | 'reports'        // 5.9 Reports & Analytics
    | 'support'        // 5.10 Support & Notification
    | 'settings';      // 5.11 Settings & System

  const [adminTab, setAdminTab] = useState<AdminTabType>('dashboard');

  // --- Search & Filters ---
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'accepted' | 'processing' | 'out_for_delivery' | 'delivered' | 'rejected'>('all');
  const [financeCategoryFilter, setFinanceCategoryFilter] = useState<'all' | 'revenue' | 'expense'>('all');

  // --- Reports & Analytics Tab Option ---
  const [activeReportType, setActiveReportType] = useState<'sales' | 'products' | 'customers' | 'vendors' | 'delivery'>('sales');

  // --- Local Database Extensions for Rich Simulation ---
  // Mock customer base representing registered accounts
  const [customers, setCustomers] = useState([
    { id: 'cust_user', name: 'Anjali Sharma', email: 'anjali.sharma@gmail.com', phone: '+91 98765 43210', address: 'Apt 402, Oakwood, Sector 56 Gurgaon', registeredDate: '2026-02-15', walletBalance: 1250, loyaltyPoints: 480, membershipTier: 'Gold' },
    { id: 'cust_02', name: 'Rahul Verma', email: 'rahul.verma@yahoo.com', phone: '+91 99887 76655', address: 'House 142, Block C, DLF Phase 1, Gurgaon', registeredDate: '2026-03-10', walletBalance: 350, loyaltyPoints: 120, membershipTier: 'Silver' },
    { id: 'cust_03', name: 'Priya Singh', email: 'priya.singh@outlook.com', phone: '+91 97766 55443', address: 'Flat A-9, Heritage Heights, Sector 57, Gurgaon', registeredDate: '2026-04-01', walletBalance: 4200, loyaltyPoints: 850, membershipTier: 'Platinum' }
  ]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust_user');
  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  // Active customer recommendations state
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);

  // Support Ticketing - Selected Ticket for Active Live Reply Chat
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [adminReplyText, setAdminReplyText] = useState('');
  const activeTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  // Vendor registrations
  const [vendors, setVendors] = useState([
    { id: 'vend_01', name: 'Krishna Cow Organic Farms', lead: 'Harendra Choudhary', phone: '+1 98123 45678', location: 'Sohna Dairy Valley', fssai: '10023409100028', globalCommission: 10, status: 'approved', kycDocs: { aadhaar: '3210 5492 8123', license: 'DL-2026-X98', bankVerified: true } },
    { id: 'vend_02', name: 'Green Valley Premium Organic', lead: 'Vipin Sangwan', phone: '+91 90112 23344', location: 'Manesar Meadows Cluster', fssai: '10022405600019', globalCommission: 8, status: 'approved', kycDocs: { aadhaar: '9283 1032 5541', license: 'HR-2025-A11', bankVerified: true } },
    { id: 'vend_03', name: 'AyurVeda A2 Farm', lead: 'Acharya Balkishan', phone: '+91 95555 44433', location: 'Arvali Foot Hills', fssai: '10024009100221', globalCommission: 12, status: 'pending', kycDocs: { aadhaar: '8877 3322 1100', license: 'UA-2026-O77', bankVerified: false } }
  ]);

  // Product Approval Queue (for new vendor items)
  const [approvalQueue, setApprovalQueue] = useState([
    { id: 'app_01', vendorId: 'vend_02', vendorName: 'Green Valley Premium Organic', name: 'Fresh Buffalo Paneer (Vacuum Packed)', category: 'Dairy Products', price: 180, unit: '200g', fat: 6.2, snf: 9.2, image: 'https://images.unsplash.com/photo-1629230104113-17b5e4f207cc?auto=format&fit=crop&q=80&w=600' },
    { id: 'app_02', vendorId: 'vend_01', vendorName: 'Krishna Cow Organic Farms', name: 'A2 Gir Cow Desi Makhan (Unsalted)', category: 'Dairy Products', price: 320, unit: '250g', fat: 8.5, snf: 10.1, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=600' }
  ]);

  // Payout configuration tracker state
  const [payoutLogs, setPayoutLogs] = useState<{ id: string; target: string; type: string; amount: number; status: string; date: string }[]>([
    { id: 'pay_101', target: 'Krishna Cow Organic Farms', type: 'Merchant Payout', amount: 8450, status: 'released', date: '2026-06-01' },
    { id: 'pay_102', target: 'Ramesh Kumar', type: 'Delivery Boy Commission', amount: 840, status: 'released', date: '2026-06-01' }
  ]);
  const [selectedPayoutMerchant, setSelectedPayoutMerchant] = useState<string>('vend_01');
  const [customPayoutAmount, setCustomPayoutAmount] = useState<number>(1500);

  // Subscription Plans Administration (System tab helper)
  const [plans, setPlans] = useState([
    { id: 'daily_milk', name: 'Daily Milk Plan', pricePerDay500ml: 35, pricePerDay1L: 70, pricePerDay2L: 135, activeUsers: 480, pauseOption: true, dateWisePause: true },
    { id: 'monthly_milk', name: 'Monthly Savings Plan (30 Days)', pricePerDay500ml: 32, pricePerDay1L: 65, pricePerDay2L: 125, activeUsers: 215, pauseOption: true, dateWisePause: true },
    { id: 'family_milk', name: 'Family Bulk Plan', pricePerDay500ml: 30, pricePerDay1L: 60, pricePerDay2L: 115, activeUsers: 85, pauseOption: true, dateWisePause: false }
  ]);

  // Delivery Tracking variables
  const [selectedRiderId, setSelectedRiderId] = useState<string>('dp_01');
  const [selectedMapProvider, setSelectedMapProvider] = useState<'google' | 'mapmyindia'>('google');
  const [radiusBoundary, setRadiusBoundary] = useState(15);
  const [assignSuccessMsg, setAssignSuccessMsg] = useState<string | null>(null);

  // Dynamic system sliders
  const [globalCommissionRate, setGlobalCommissionRate] = useState(10);
  const [globalReferralBonus, setGlobalReferralBonus] = useState(50);
  const [globalCashbackRate, setGlobalCashbackRate] = useState(5); // 5% auto loyalty pts

  // Promo Coupon states
  const [coupons, setCoupons] = useState([
    { code: 'DAIRY20', discount: '₹20 Off', minOrder: '₹200', active: true, usageCount: 45 },
    { code: 'FRESHMILK', discount: '10% Cashback', minOrder: '₹500', active: true, usageCount: 18 },
    { code: 'GHEEVEDIC', discount: '₹50 Off Desi Ghee', minOrder: '₹499', active: false, usageCount: 0 }
  ]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('₹50 Off');
  
  // Daily automated billing cycle simulation state
  const [billingCycleRunning, setBillingCycleRunning] = useState(false);
  const [billingSummary, setBillingSummary] = useState<{ totalDeducted: number; subscriptionsBilled: number } | null>(null);

  // AI Forecasting and Route Optimization states
  const [forecastTemp, setForecastTemp] = useState(38);
  const [forecastSeason, setForecastSeason] = useState('Summer');
  const [forecastData, setForecastData] = useState<any>(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  // AI Route Optimization Simulation
  const [optimizingRoutes, setOptimizingRoutes] = useState(false);
  const [optimizedRouteLog, setOptimizedRouteLog] = useState<string[]>([]);

  // push notifications broadcast values
  const [notifTargetGroup, setNotifTargetGroup] = useState('all');
  const [notifTitle, setNotifTitle] = useState('🎉 Fresh A2 Cow Ghee Restocked!');
  const [notifMessage, setNotifMessage] = useState('Our single-origin, FSSAI certified organic Gir cow Bilona ghee batch is now back on stock ready for express delivery.');

  // --- Action Handlers ---
  const handleAddNewCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setCoupons(prev => [...prev, { code: newCode.toUpperCase(), discount: newDiscount, minOrder: '₹150', active: true, usageCount: 0 }]);
    addSystemLog('Promotion Engine', `Created new campaign promo coupon: "${newCode.toUpperCase()}" with value "${newDiscount}"`);
    setNewCode('');
  };

  const handleToggleCoupon = (code: string) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  const handleKycAction = (id: string, verify: boolean) => {
    updateKycStatus(id, verify);
    addSystemLog('KYC Compliance', `Approved official government credentials & license verify for rider ID: ${id}`);
  };

  const handleApproveProductProposal = (appId: string) => {
    const item = approvalQueue.find(q => q.id === appId);
    if (!item) return;

    // Simulate addition to product line
    products.push({
      id: `p_new_${Math.floor(100 + Math.random() * 900)}`,
      name: item.name,
      category: item.category,
      price: item.price,
      unit: item.unit,
      stock: 120, // default pre-allocated
      fatPercentage: item.fat,
      snfPercentage: item.snf,
      farmName: item.vendorName,
      milkingTime: '05:00 AM',
      processingTime: '06:30 AM',
      dispatchTime: '07:45 AM',
      image: item.image,
      description: `FSSAI Certified organic luxury product brought to you directly by ${item.vendorName}`,
      ingredients: 'Organic unadulterated trace ingredients.',
      nutrition: { calories: '124 kcal', protein: '4.2g', fat: `${item.fat}g`, carbs: '3.1g', calcium: '95mg' },
      shelfLife: '10 Days',
      storageInstructions: 'Keep chilled below 4°C continuously',
      rating: 5.0,
      reviewsCount: 1
    });

    setApprovalQueue(prev => prev.filter(q => q.id !== appId));
    addSystemLog('Product Catalog', `Authorized vendor product "${item.name}" from ${item.vendorName}. Cleared for home retail.`);
  };

  const handleRejectProductProposal = (appId: string) => {
    const item = approvalQueue.find(q => q.id === appId);
    setApprovalQueue(prev => prev.filter(q => q.id !== appId));
    if (item) {
      addSystemLog('Product Catalog', `Rejected catalog expansion request "${item.name}" due to FSSAI profile mismatches.`);
    }
  };

  const handleReleasePayout = (e: React.FormEvent) => {
    e.preventDefault();
    const vendorObj = vendors.find(v => v.id === selectedPayoutMerchant);
    if (!vendorObj) return;

    const payoutId = `pay_${Math.floor(200 + Math.random() * 800)}`;
    setPayoutLogs(prev => [
      {
        id: payoutId,
        target: vendorObj.name,
        type: 'Merchant Payout',
        amount: customPayoutAmount,
        status: 'released',
        date: new Date().toISOString().slice(0, 10)
      },
      ...prev
    ]);

    finances.push({
      id: `fin_pay_${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'payout_vendor',
      category: 'expense',
      description: `Corporate Command payout released to ${vendorObj.name}`,
      amount: customPayoutAmount,
      gstAmount: 0,
      timestamp: new Date().toISOString().slice(0, 10) + ' 05:00 PM'
    });

    addSystemLog('Financial Accounting', `Released on-demand settlement payout of ₹${customPayoutAmount} to cooperative account: ${vendorObj.name}`);
    alert(`Successfully released settlement payout of ₹${customPayoutAmount} to cooperative account: ${vendorObj.name}`);
  };

  // Run AI Forecasting via central mock API logic
  const runAiForecast = async () => {
    setForecastLoading(true);
    try {
      const res = await fetch('/api/gemini/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTemp: forecastTemp,
          activeSeason: forecastSeason,
          currentOrdersCount: orders.length
        })
      });
      const data = await res.json();
      setForecastData(data);
    } catch (e) {
      // Fallback structured parameters if API is not initialized
      setTimeout(() => {
        setForecastData({
          predictedMilkRequired: forecastSeason === 'Summer' ? '12,500 L (+25%)' : '9,800 L (Normal)',
          confidenceInterval: '94.2%',
          recommendations: 'Enable early chilling. Summer demand surge expected for high fatigue items.',
          riskIndicators: 'High risk of temperature breach; recommend prompt dispatch route optimizations for AM cold dispatches.'
        });
      }, 500);
    } finally {
      setForecastLoading(false);
    }
  };

  useEffect(() => {
    runAiForecast();
  }, [forecastTemp, forecastSeason]);

  // AI Route Optimization Simulation
  const triggerAiRouteOptimization = () => {
    setOptimizingRoutes(true);
    setOptimizedRouteLog(['Analyzing active rider positions...', 'Evaluating traffic constraints with satellite view...']);
    
    setTimeout(() => {
      setOptimizedRouteLog(prev => [
        ...prev,
        'Found 2 overlapping multi-stop delivery sequences.',
        'Merged Route Sector 56 Central to Ramesh Kumar (Rider 1) - Saved 3.4km.',
        'SLA rating optimized to 99.1% with real-time route integration.'
      ]);
      setOptimizingRoutes(false);
      addSystemLog('AI Route Engine', 'Executed live routing sweep. Optimized 2 multi-point sector deliveries.');
    }, 1200);
  };

  // AI Recommendations logic
  const triggerAiRecommendations = () => {
    const tags = ['Ghee 500ml', 'Cheddar Cheese', 'Probiotic Curd', 'Organic Cow Butter'];
    const shuffled = [...tags].sort(() => 0.5 - Math.random());
    setSelectedRecommendations(shuffled.slice(0, 2));
    addSystemLog('AI CRM Engine', `Analyzed nutritional history and matched items to customer "${activeCustomer.name}"`);
  };

  // Wallet Management Actions for Selected Customer
  const handleWalletOverride = (customerId: string, amount: number, mode: 'deposit' | 'deduction') => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newBal = mode === 'deposit' ? c.walletBalance + amount : Math.max(0, c.walletBalance - amount);
        addSystemLog('Smart Milk Wallet Override', `Admin adjusted wallet for ${c.name}: ${mode.toUpperCase()} ₹${amount}. New balance: ₹${newBal}`);
        return {
          ...c,
          walletBalance: newBal
        };
      }
      return c;
    }));
  };

  // Loyalty Point Manual override
  const handleLoyaltyPointsOverride = (customerId: string, points: number) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newPoints = c.loyaltyPoints + points;
        let tier = 'Silver';
        if (newPoints > 500) tier = 'Gold';
        if (newPoints > 800) tier = 'Platinum';
        addSystemLog('Loyalty Engine Override', `Adjusted ${c.name} loyalty rating points by ${points}. New total: ${newPoints} pts (${tier} Tier)`);
        return {
          ...c,
          loyaltyPoints: newPoints,
          membershipTier: tier
        };
      }
      return c;
    }));
  };

  // Trigger manual rider allocation override
  const handleManualAssignOrder = (orderId: string, riderId: string) => {
    updateOrderStatus(orderId, 'accepted', riderId);
    const rName = deliveryPartners.find(dp => dp.id === riderId)?.name || 'a selected driver';
    setAssignSuccessMsg(`Successfully assigned order allocation: ${orderId} assigned to ${rName}`);
    addSystemLog('Dispatch Command', `Manual order dispatch override. Shifted keys of order ${orderId} to Rider ${rName}`);
    setTimeout(() => setAssignSuccessMsg(null), 3000);
  };

  // Automated Daily billing settlement run
  const runDailyMilkDeductionCycle = () => {
    setBillingCycleRunning(true);
    setBillingSummary(null);

    setTimeout(() => {
      let totalCostCharged = 0;
      let activeCountCharged = 0;

      setCustomers(prev => prev.map(cust => {
        const billingCap = 70;
        if (cust.walletBalance >= billingCap) {
          activeCountCharged += 1;
          totalCostCharged += billingCap;
          addSystemLog('Automated Billing', `Processed 1L daily supply deduction of ₹${billingCap} against wallet of customer ${cust.name}.`);
          return {
            ...cust,
            walletBalance: cust.walletBalance - billingCap,
            loyaltyPoints: cust.loyaltyPoints + Math.floor(billingCap * (globalCashbackRate / 100))
          };
        }
        return cust;
      }));

      // Credit finances centrally as sub revenue
      finances.push({
        id: `fin_auto_${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'subscription_credit',
        category: 'revenue',
        description: 'Automated 24h subscription smart wallet deduction cycles',
        amount: totalCostCharged,
        gstAmount: +(totalCostCharged * 0.05).toFixed(1),
        timestamp: new Date().toISOString().slice(0, 10) + ' 06:00 AM'
      });

      setBillingSummary({
        totalDeducted: totalCostCharged,
        subscriptionsBilled: activeCountCharged || 1
      });
      setBillingCycleRunning(false);
      addSystemLog('Automated Billing', `Consolidated daily automatic billing ledger sweep: ₹${totalCostCharged} recovered across active subscriptions.`);
    }, 1500);
  };

  // Financial and platform commission summaries
  const totalRev = finances.filter(f => f.category === 'revenue').reduce((s, i) => s + i.amount, 0);
  const totalExp = finances.filter(f => f.category === 'expense').reduce((s, i) => s + i.amount, 0);
  const totalCommissionEarned = (totalRev * (globalCommissionRate / 100));

  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;
    
    sendTicketMessage(activeTicket.id, 'support', adminReplyText);
    addSystemLog('Customer Relations', `Sent official corporate support reply to ticket ID: ${activeTicket.id}`);
    setAdminReplyText('');
  };

  // Dynamic reports export
  const exportReportData = (reportType: string, format: 'csv' | 'json') => {
    const reportStructure = {
      sales: finances.filter(f => f.category === 'revenue'),
      products: products.map(p => ({ id: p.id, name: p.name, category: p.category, stock: p.stock, rating: p.rating })),
      customers: customers.map(c => ({ id: c.id, name: c.name, email: c.email, wallet: c.walletBalance, tier: c.membershipTier })),
      vendors: vendors.map(v => ({ name: v.name, location: v.location, status: v.status, commission: v.globalCommission })),
      delivery: deliveryPartners.map(d => ({ name: d.name, vehicle: d.vehicleType, trips: d.totalTrips, earnings: d.earnings }))
    };

    const targetData = reportStructure[reportType as keyof typeof reportStructure] || reportStructure.sales;
    let dataStr = "";
    if (format === 'json') {
      dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(targetData, null, 2));
    } else {
      const headers = Object.keys(targetData[0] || {}).join(",");
      const rows = targetData.map(item => Object.values(item).map(val => typeof val === 'object' ? JSON.stringify(val).replace(/,/g, ';') : val).join(","));
      dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent([headers, ...rows].join("\n"));
    }

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dairyfresh_${reportType}_report.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addSystemLog('Reports & Audits', `Generated download export package of ${reportType.toUpperCase()} module in ${format.toUpperCase()} format.`);
  };

  // Pre-seed first ticket ID to allow instant operations
  useEffect(() => {
    if (tickets && tickets.length > 0 && !selectedTicketId) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  return (
    <div className="bg-slate-50 border border-gray-200 rounded-3xl p-6 shadow-xs max-w-7xl mx-auto min-h-[600px] text-gray-800" id="corporate-admin-panel">
      
      {/* Visual Blueprint Title Header */}
      <div className="border-b border-gray-200 pb-5 mb-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <span className="text-teal-600 font-extrabold text-xs uppercase tracking-widest font-mono">Central Command Portal</span>
          <h2 className="font-display font-black text-gray-900 text-2xl flex items-center gap-2">
            <Building className="w-6 h-6 text-teal-600" /> DairyFresh Executive Control Panel
          </h2>
          <p className="text-sm text-gray-500">Corporate suite supervising distribution networks, merchant FSSAI status, courier route dispatches, commissions, and customer wallets.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={runDailyMilkDeductionCycle}
            disabled={billingCycleRunning}
            className={`py-2 px-4 rounded-xl text-xs font-bold font-mono tracking-wide uppercase transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              billingCycleRunning 
                ? 'bg-amber-100 border-amber-300 text-amber-800 animate-pulse'
                : 'bg-emerald-600 border-emerald-700 text-white hover:bg-emerald-700'
            }`}
          >
            <RotateCw className={`w-4 h-4 text-white ${billingCycleRunning ? 'animate-spin': ''}`} />
            Settles 24h Milk Run
          </button>
        </div>
      </div>

      {/* Corporate 11 Divisions Nav Bar */}
      <div className="flex bg-white border border-gray-200 p-1 rounded-2xl text-center text-xs font-semibold mb-6 overflow-x-auto gap-0.5 whitespace-nowrap scrollbar-none shadow-xs">
        {[
          { id: 'dashboard', icon: <TrendingUp className="w-3.5 h-3.5" />, label: '5.1 Dashboard (Overview)' },
          { id: 'customers', icon: <Users className="w-3.5 h-3.5" />, label: '5.2 Manage Customers' },
          { id: 'merchants', icon: <Building className="w-3.5 h-3.5" />, label: '5.3 Manage Merchants' },
          { id: 'deliveryBoys', icon: <Truck className="w-3.5 h-3.5" />, label: '5.4 Manage Delivery Boys' },
          { id: 'orders', icon: <ClipboardList className="w-3.5 h-3.5" />, label: '5.5 Orders' },
          { id: 'earnings', icon: <DollarSign className="w-3.5 h-3.5" />, label: '5.6 Earnings & Payouts' },
          { id: 'commission', icon: <Percent className="w-3.5 h-3.5" />, label: '5.7 Commissions' },
          { id: 'offers', icon: <Gift className="w-3.5 h-3.5" />, label: '5.8 Offers & Coupons' },
          { id: 'reports', icon: <BarChart3 className="w-3.5 h-3.5" />, label: '5.9 Reports' },
          { id: 'support', icon: <MessageSquare className="w-3.5 h-3.5" />, label: '5.10 Support' },
          { id: 'settings', icon: <Settings className="w-3.5 h-3.5" />, label: '5.11 Settings' }
        ].map(navTab => (
          <button 
            key={navTab.id}
            onClick={() => setAdminTab(navTab.id as any)}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
              adminTab === navTab.id 
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
            }`}
          >
            {navTab.icon}
            <span>{navTab.label}</span>
          </button>
        ))}
      </div>

      {/* Success settlement message banner */}
      {billingSummary && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl mb-5 flex justify-between items-center text-xs shadow-xs transition duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <strong>✓ Automated 24-Hour Settlement Run Complete!</strong>
              <div className="text-emerald-700 text-[11.5px] mt-0.5">Charged ₹{billingSummary.totalDeducted} across {billingSummary.subscriptionsBilled} subscriber wallets with cashback points credited.</div>
            </div>
          </div>
          <button onClick={() => setBillingSummary(null)} className="text-emerald-500 hover:text-emerald-700 font-bold px-1.5 text-sm cursor-pointer">×</button>
        </div>
      )}

      {/* 5.1 Dashboard (Overview) */}
      {adminTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
              <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Gross Transaction Volume</span>
              <strong className="text-teal-700 text-2xl font-black block mt-1">₹{(totalRev || 28400).toLocaleString('en-IN')}</strong>
              <span className="text-[10px] text-emerald-600 mt-1 font-bold block">↑ 14.5% compared to yesterday</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
              <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Pending Orders</span>
              <strong className="text-amber-700 text-2xl font-black block mt-1">
                {orders.filter(o => o.status === 'pending' || o.status === 'accepted' || o.status === 'processing').length} Active
              </strong>
              <span className="text-[10px] text-gray-500 mt-1 block">Awaiting physical morning dispatch</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
              <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Registered Customers</span>
              <strong className="text-blue-700 text-2xl font-black block mt-1">{customers.length} Accounts</strong>
              <span className="text-[10px] text-teal-600 mt-1 font-bold block">100% KYD identity secured</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
              <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Partner Milk Cooperatives</span>
              <strong className="text-gray-800 text-2xl font-black block mt-1">{vendors.length} Cooperatives</strong>
              <span className="text-[10px] text-gray-500 mt-1 block">Sohna, Manesar clusters</span>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
              <span className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">Riders On-Duty</span>
              <strong className="text-violet-700 text-2xl font-black block mt-1">{deliveryPartners.filter(d => d.status === 'online').length} active</strong>
              <span className="text-[10px] text-violet-600 mt-1 font-bold block">Electric cold carts fleet</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Demand Forecasting Parameters */}
            <div className="border border-indigo-100 rounded-3xl p-5 bg-indigo-50/10 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-indigo-100 pb-3">
                <span className="text-xs font-bold text-indigo-950 uppercase flex items-center gap-1.5 font-mono">
                  <Cpu className="w-4 h-4 text-indigo-600 animate-pulse" /> AI Demand Forecasting Engine
                </span>
                <div className="flex gap-2">
                  <select value={forecastTemp} onChange={e => setForecastTemp(parseInt(e.target.value))} className="bg-white border text-xs rounded p-1 font-semibold focus:outline-hidden">
                    <option value="20">Cool (20°C)</option>
                    <option value="30">Warm (30°C)</option>
                    <option value="38">Summer Heat (38°C)</option>
                    <option value="42">Heatwave Peak (42°C)</option>
                  </select>
                  <select value={forecastSeason} onChange={e => setForecastSeason(e.target.value)} className="bg-white border text-xs rounded p-1 font-semibold focus:outline-hidden">
                    <option value="Summer">Summer Season</option>
                    <option value="Winter">Winter Season</option>
                    <option value="Monsoon">Monsoon Season</option>
                  </select>
                </div>
              </div>

              {forecastLoading ? (
                <div className="text-center py-6">
                  <p className="text-xs text-indigo-500 animate-pulse font-mono">Calculating multi-variable forecasting arrays...</p>
                </div>
              ) : forecastData ? (
                <div className="space-y-3 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border">
                      <span className="text-gray-400 font-sans text-[10px] uppercase block">Predicted Daily Intake</span>
                      <strong className="text-indigo-700 text-lg mt-1 block">{forecastData.predictedMilkRequired || '12,500 L (+25%)'}</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border">
                      <span className="text-gray-400 font-sans text-[10px] uppercase block">System Confidence</span>
                      <strong className="text-emerald-700 text-lg mt-1 block">94.2% accuracy</strong>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border font-sans text-gray-700">
                    <span className="text-gray-400 font-mono text-[10px] uppercase block">AI Strategic Dispatch Recommendation:</span>
                    <p className="font-semibold text-xs text-slate-800 leading-relaxed mt-1">{forecastData.recommendations}</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 font-sans text-amber-900 text-[11px] leading-relaxed flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Smart Warning:</strong> {forecastData.riskIndicators}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Quick Analytics Visualizer */}
            <div className="bg-white border rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-display font-semibold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-1">
                  <BarChart3 className="w-4 h-4 text-teal-600" /> Morning Supply Target Fulfillment
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">SLA achievement status across city sub-regions.</p>
              </div>

              <div className="space-y-3.5 my-4 text-xs font-medium">
                <div>
                  <div className="flex justify-between mb-1 font-mono text-[10px] text-gray-500">
                    <span>DLF Phase 1, Gurgaon</span>
                    <strong>96% Fulfilled (AM Sweep)</strong>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono text-[10px] text-gray-500">
                    <span>Sector 56 Cluster</span>
                    <strong>92% Fulfilled (Amrit Vihar)</strong>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono text-[10px] text-gray-500">
                    <span>Sohna Corridor Bounds</span>
                    <strong>85% Fulfilled (Pending dispatch 2)</strong>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between items-center text-[11px] text-gray-400 font-mono">
                <span>Next settlement block: 06:00 AM</span>
                <span className="text-teal-600 font-bold">Standard Operations Green</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5.2 Manage Customers */}
      {adminTab === 'customers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs text-gray-700">
          {/* Left: Customer List selector */}
          <div className="lg:col-span-4 bg-white border rounded-3xl p-4 shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-gray-800 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-600" /> Active Customers Directory
            </h3>
            
            <div className="flex items-center gap-1.5 bg-slate-50 border p-2 rounded-xl">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search profile by name..." 
                value={customerSearch}
                onChange={e => setCustomerSearch(e.target.value)}
                className="bg-transparent border-0 ring-0 focus:ring-0 w-full focus:outline-hidden"
              />
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).map((cust) => (
                <div 
                  key={cust.id} 
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedCustomerId === cust.id 
                      ? 'border-teal-600 bg-teal-50/20 shadow-xs'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-gray-900 block font-bold text-xs">{cust.name}</strong>
                    <span className="text-[9.5px] font-mono bg-slate-900 text-white px-2 py-0.5 rounded uppercase font-black">{cust.membershipTier} Tier</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-mono">{cust.phone}</div>
                  <div className="flex justify-between text-[11px] font-mono pt-2 border-t mt-2 text-teal-800">
                    <span>Balance:</span>
                    <strong>₹{cust.walletBalance}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Detailed customer command sheets */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
              <strong className="font-display text-gray-900 text-sm block">Household Profile & Verification Data</strong>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-[11px]">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[9px] text-gray-400 block font-sans uppercase">Home Address</span>
                  <span className="text-gray-805 font-bold block truncate mt-0.5">{activeCustomer.address}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[9px] text-gray-400 block font-sans uppercase">Communication Email</span>
                  <span className="text-gray-805 font-bold block mt-0.5">{activeCustomer.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[9px] text-gray-400 block font-sans uppercase">Registration Date</span>
                  <span className="text-teal-700 font-bold block mt-0.5">✓ {activeCustomer.registeredDate}</span>
                </div>
              </div>
            </div>

            {/* Smart Wallet recalibration */}
            <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
              <div>
                <span className="text-[9.5px] bg-teal-50 text-teal-800 font-mono font-bold px-2 py-0.5 rounded-full uppercase">Smart Wallet Balance Manager</span>
                <h4 className="text-gray-900 text-sm font-semibold mt-1">Direct Balance Recalibration OVERRIDES</h4>
                <p className="text-xs text-gray-400">Force adjust customer wallet. Deducts or deposits immediately inside global simulation state.</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center bg-teal-50/10 border border-teal-100 p-4 rounded-2xl gap-3">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-mono tracking-wider block">Wallet Balance</span>
                  <strong className="text-teal-800 font-mono text-2xl font-black block">₹{activeCustomer.walletBalance}</strong>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  <button onClick={() => handleWalletOverride(activeCustomer.id, 500, 'deposit')} className="bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold text-[10.5px] px-3 py-1.5 rounded-lg cursor-pointer transition">+ ₹500</button>
                  <button onClick={() => handleWalletOverride(activeCustomer.id, 1000, 'deposit')} className="bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold text-[10.5px] px-3 py-1.5 rounded-lg cursor-pointer transition">+ ₹1000</button>
                  <button onClick={() => handleWalletOverride(activeCustomer.id, 500, 'deduction')} className="bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-[10.5px] px-3 py-1.5 rounded-lg cursor-pointer transition">- ₹500</button>
                </div>
              </div>
            </div>

            {/* Loyalty and CRM program adjustments */}
            <div className="bg-white border rounded-3xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <strong className="font-display text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1 font-bold">
                  <Award className="w-4 h-4 text-amber-500" /> CRM Loyalty Points Overrides
                </strong>
                <p className="text-xs text-gray-400">Manually issue or burn loyalty feedback points. Alters eligibility tier automatically.</p>
                <div className="flex justify-between items-center p-3 bg-slate-50 border rounded-xl font-mono">
                  <div>
                    <span className="text-[9px] text-gray-400 block font-sans uppercase">Averaged Rating</span>
                    <strong className="text-sm font-black block mt-0.5">{activeCustomer.loyaltyPoints} Points</strong>
                  </div>
                  <span className="text-[10px] bg-amber-550/10 text-amber-900 border border-amber-200 py-0.5 px-2 rounded-full uppercase font-bold">
                    {activeCustomer.membershipTier} Profile
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2">
                <button onClick={() => handleLoyaltyPointsOverride(activeCustomer.id, 100)} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl transition cursor-pointer">+ 100 loyalty points</button>
                <button onClick={() => handleLoyaltyPointsOverride(activeCustomer.id, -100)} className="bg-slate-100 hover:bg-slate-200 text-gray-700 border font-bold py-2.5 rounded-xl transition cursor-pointer">- 100 loyalty points</button>
              </div>
            </div>

            {/* AI Attachments Targeting recommendations */}
            <div className="bg-indigo-50/10 border border-indigo-150/60 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <strong className="text-indigo-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Cpu className="w-4 h-4 text-indigo-600 animate-pulse" /> AI Customer Recommendations Engine
                </strong>
                <button onClick={triggerAiRecommendations} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1 rounded-lg text-[10.5px] cursor-pointer transition">Generate Recommendations</button>
              </div>
              <p className="text-xs text-gray-500 font-sans leading-normal">Fitted target attachment suggestions mapped targeting historical dairy fat velocity preferences:</p>
              
              <div className="flex flex-wrap gap-1.5">
                {selectedRecommendations.map((rec, kIdx) => (
                  <span key={kIdx} className="bg-indigo-50 border border-indigo-200 text-indigo-805 py-1 px-3 rounded-full font-bold text-[10.5px] flex items-center gap-1 animate-pulse">
                    ✨ Target offer: {rec}
                  </span>
                ))}
                {selectedRecommendations.length === 0 && (
                  <span className="text-[11px] text-slate-400 italic">No recommendations calculated yet. Trigger solver.</span>
                )}
              </div>
            </div>

            {/* Customer Order History Timeline */}
            <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-3">
              <strong className="font-display text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1 font-bold">
                <FileText className="w-4 h-4 text-teal-600" /> Customer Simulation Order History
              </strong>
              <div className="space-y-2 max-h-[180px] overflow-y-auto">
                {orders.filter(o => o.customerId === activeCustomer.id || o.customerId === 'cust_user').map((ord) => (
                  <div key={ord.id} className="p-3 bg-slate-50 rounded-2xl border flex justify-between items-center font-mono">
                    <div className="space-y-0.5">
                      <div className="font-bold text-gray-800 text-[11px] flex items-center gap-1.5">
                        <span>{ord.id}</span>
                        <span className="bg-slate-200 text-slate-700 text-[9px] py-0.5 px-1.5 rounded font-sans uppercase font-bold">{ord.deliveryOption}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block">{ord.date} • {ord.paymentMethod.toUpperCase()}</span>
                    </div>

                    <div className="text-right">
                      <strong className="text-teal-800 text-xs font-black block">₹{ord.total}</strong>
                      <span className={`text-[9px] font-sans font-bold uppercase ${
                        ord.status === 'delivered' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>{ord.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5.3 Manage Merchants / Shops */}
      {adminTab === 'merchants' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Cooperatives list */}
            <div className="lg:col-span-7 bg-white border rounded-3xl p-5 shadow-xs space-y-4">
              <h4 className="font-display font-medium text-gray-900 text-xs uppercase tracking-widest font-mono">Registered Merchant Cooperatives</h4>
              <p className="text-xs text-gray-400 leading-normal">FSSAI licensed partners direct feeding processing chambers.</p>
              
              <div className="space-y-3">
                {vendors.map((v) => (
                  <div key={v.id} className="border rounded-2xl p-4 bg-slate-50/50 space-y-3 text-xs text-gray-650 shadow-xs">
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <strong className="text-gray-900 text-xs font-black block">{v.name}</strong>
                        <span className="text-[10px] text-gray-400 mt-0.5 font-mono">Base location: {v.location}</span>
                      </div>
                      <span className={`text-[9.5px] font-mono py-0.5 px-2.5 rounded uppercase font-black ${
                        v.status === 'approved' ? 'bg-emerald-100 text-emerald-850 border border-emerald-200' : 'bg-amber-100 text-amber-800 border'
                      }`}>
                        {v.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
                      <div>Representative Lead: <strong className="text-gray-800">{v.lead}</strong></div>
                      <div>FSSAI Registration: <strong className="text-gray-800">{v.fssai}</strong></div>
                      <div>Aadhaar KYC Doc: <strong className="text-emerald-700 font-bold">✓ {v.kycDocs.aadhaar}</strong></div>
                      <div>Corporate License: <strong className="text-emerald-700 font-bold">✓ {v.kycDocs.license}</strong></div>
                    </div>

                    {v.status === 'pending' && (
                      <div className="flex gap-1.5 pt-2 justify-end">
                        <button 
                          onClick={() => {
                            setVendors(prev => prev.map(item => item.id === v.id ? { ...item, status: 'approved' } : item));
                            addSystemLog('Compliance Manager', `Officially approved government registration parameters for: ${v.name}`);
                          }}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10.5px] py-1.5 px-3 rounded-lg cursor-pointer transition shadow-xs"
                        >
                          Approve Cooperative License
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: SKU approvals */}
            <div className="lg:col-span-5 bg-white border rounded-3xl p-5 shadow-xs space-y-4">
              <h4 className="font-display font-medium text-gray-900 text-xs uppercase tracking-widest font-mono">Pending SKU Catalog Approvals</h4>
              
              {approvalQueue.length === 0 ? (
                <div className="border border-dashed p-8 rounded-2xl text-center bg-gray-50 text-xs text-gray-400 font-medium">
                  All cooperative SKU variations fully vetted and approved.
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {approvalQueue.map((sku) => (
                    <div key={sku.id} className="border bg-slate-50/50 rounded-2xl p-4 space-y-3 shadow-xs">
                      <div className="flex gap-2.5 items-center">
                        <img referrerPolicy="no-referrer" src={sku.image} className="w-11 h-11 object-cover rounded-md shrink-0 border" alt="" />
                        <div className="space-y-0.5">
                          <strong className="text-gray-900 text-xs font-black block">{sku.name}</strong>
                          <span className="text-[9.5px] text-gray-400 block font-mono">Source: {sku.vendorName}</span>
                        </div>
                      </div>

                      <div className="flex justify-between font-mono text-[10.5px] border-y py-2">
                        <span>Price: <strong className="text-teal-800">₹{sku.price}</strong></span>
                        <span>SKU Class: <strong className="text-slate-800">{sku.unit}</strong></span>
                        <span>Fat / SNF: <strong className="text-indigo-805">{sku.fat}% / {sku.snf}%</strong></span>
                      </div>

                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => handleRejectProductProposal(sku.id)} className="border border-rose-200 text-rose-600 hover:bg-rose-50 py-1.5 px-3 rounded-lg font-bold text-[10px] cursor-pointer transition">Reject SKU</button>
                        <button onClick={() => handleApproveProductProposal(sku.id)} className="bg-teal-600 hover:bg-teal-700 text-white py-1.5 px-4 rounded-lg font-bold text-[10px] cursor-pointer transition shadow-xs">Approve & Publish Catalog</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5.4 Manage Delivery Boys */}
      {adminTab === 'deliveryBoys' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b pb-3">
            <div>
              <h3 className="font-display font-semibold text-gray-950 text-sm uppercase tracking-wider">Transit Fleet Dispatch Operations</h3>
              <p className="text-xs text-gray-400">Logistics telemetry, radius borders and automatic route optimizes.</p>
            </div>

            <div className="flex gap-2 text-xs">
              <div>
                <span className="text-[9.5px] text-gray-400 font-mono uppercase block mb-0.5">Navigation GPS API:</span>
                <select 
                  value={selectedMapProvider} 
                  onChange={e => {
                    setSelectedMapProvider(e.target.value as any);
                    addSystemLog('Dispatch Logs', `Assigned routing computational layout solver to: ${e.target.value.toUpperCase()}`);
                  }} 
                  className="bg-white border rounded p-1 font-semibold focus:outline-hidden"
                >
                  <option value="google">Google Maps platform</option>
                  <option value="mapmyindia">MapMyIndia Navigation Suite</option>
                </select>
              </div>

              <div>
                <span className="text-[9.5px] text-gray-400 font-mono uppercase block mb-0.5">City boundary (Radius km):</span>
                <input 
                  type="number" 
                  value={radiusBoundary}
                  onChange={e => setRadiusBoundary(parseInt(e.target.value))}
                  className="w-12 bg-white border p-1 rounded text-right font-mono focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* GPS Visual map */}
            <div className="lg:col-span-8 bg-white border p-5 rounded-3xl relative min-h-[300px] flex flex-col justify-between overflow-hidden shadow-xs">
              <span className="absolute top-4 left-4 bg-slate-900 text-teal-400 border border-teal-500/30 px-2.5 py-1 rounded-md text-[9.5px] font-mono uppercase font-black tracking-widest animate-pulse z-10 select-none">
                {selectedMapProvider.toUpperCase()} GRID TRANSIT COVERAGE
              </span>

              <div className="h-56 w-full border border-dashed rounded-2xl relative bg-indigo-50/10 mt-10 overflow-hidden select-none">
                {/* Sector tags over map */}
                <div className="absolute top-4 left-4 border p-2 bg-emerald-500/10 text-emerald-800 font-mono text-[8.5px] rounded font-bold uppercase">Sector 55 Hub bounds</div>
                <div className="absolute bottom-4 left-6 border p-2 bg-indigo-500/10 text-indigo-800 font-mono text-[8.5px] rounded font-bold uppercase">Sector 56 Residencies</div>
                <div className="absolute top-6 right-8 border p-2 bg-amber-500/10 text-amber-800 font-mono text-[8.5px] rounded font-bold uppercase">Sector 57 Ridge boundary</div>

                {/* Simulated Road network */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2" />
                <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-gray-200" />
                <div className="absolute right-1/4 top-0 bottom-0 w-1 bg-gray-200" />

                {/* Animated rider blips */}
                <span className="absolute top-1/3 left-1/2 w-4 h-4 rounded-full bg-teal-600 border border-white animate-bounce shadow-md flex items-center justify-center font-mono text-[8.5px] text-white font-extrabold z-10 cursor-pointer" title="Rider: Ramesh Kumar (Bike 1)">1</span>
                <span className="absolute bottom-1/4 right-1/3 w-4 h-4 rounded-full bg-teal-600 border border-white animate-bounce shadow-md flex items-center justify-center font-mono text-[8.5px] text-white font-extrabold z-10 cursor-pointer" title="Rider: Vivek Sharma (Bike 2)">2</span>
              </div>

              {/* AI route optimize results log */}
              <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4 text-xs space-y-2 mt-4">
                <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                  <span>Logistics Route Computational Log</span>
                  <button onClick={triggerAiRouteOptimization} className="text-teal-700 hover:underline flex items-center gap-0.5 font-bold cursor-pointer">
                    {optimizingRoutes ? 'Optimizing paths...' : 'Run Path optimization Sweep'}
                  </button>
                </div>
                
                <div className="space-y-1 font-mono text-[11px] text-gray-700">
                  {optimizedRouteLog.map((logLine, lIdx) => (
                    <div key={lIdx} className="text-teal-905 flex items-center gap-1">
                      <span className="text-teal-500">»</span> {logLine}
                    </div>
                  ))}
                  {optimizedRouteLog.length === 0 && (
                    <span className="text-gray-400 block p-1 italic">Click "Run Path optimization Sweep" to compute optimized route configurations for on-duty riders.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Rider telemetries and Online setups */}
            <div className="lg:col-span-4 bg-white border rounded-3xl p-5 shadow-xs space-y-4">
              <h4 className="font-display font-semibold text-gray-900 text-xs uppercase tracking-widest font-mono">Active Transit Rider Fleet</h4>
              
              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {deliveryPartners.map(p => (
                  <div key={p.id} className="p-3 bg-slate-50/50 border rounded-2xl space-y-2 text-[11px]">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-gray-900 font-extrabold block">{p.name}</strong>
                        <span className="text-[9.5px] text-gray-400 font-mono block">Plate Code: {p.plateNumber} ({p.vehicleType})</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9.5px] font-black uppercase font-mono block ${p.status === 'online' ? 'text-emerald-600':'text-gray-400'}`}>
                          {p.status.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-[10px] block font-mono">{p.totalTrips} Trips done</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200/50 flex justify-between items-center text-[10px]">
                      <span className="text-gray-400 font-mono font-bold">Government KYC: Approved</span>
                      <button 
                        onClick={() => {
                          const targStatus = p.status === 'online' ? 'offline' : 'online';
                          p.status = targStatus;
                          addSystemLog('Freight Command', `Command override changed status of rider ${p.name} to: ${targStatus.toUpperCase()}`);
                        }}
                        className={`font-bold px-2 py-1 rounded text-[9.5px] cursor-pointer transition ${
                          p.status === 'online' 
                            ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        Set {p.status === 'online' ? 'Offline' : 'Online'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5.5 Orders Management */}
      {adminTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b-2 pb-2">
            <div>
              <h3 className="font-display font-semibold text-gray-900 text-sm uppercase tracking-wider">Global Orders ledger System</h3>
              <p className="text-xs text-gray-450 font-medium">Review pending checks, dispatch orders, and assign riders immediately.</p>
            </div>

            <div className="flex gap-1 bg-white border p-1 rounded-xl text-xs font-bold font-mono">
              {[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'accepted', label: 'Accepted/Processing' },
                { id: 'out_for_delivery', label: 'In Transit' },
                { id: 'delivered', label: 'Delivered' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setOrderFilter(opt.id as any)}
                  className={`px-3 py-1.5 rounded-lg border-0 transition-all cursor-pointer ${
                    orderFilter === opt.id 
                      ? 'bg-slate-900 text-white font-extrabold shadow-sm'
                      : 'text-gray-500 hover:text-gray-950 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            {orders
              .filter(o => {
                if (orderFilter === 'all') return true;
                if (orderFilter === 'pending') return o.status === 'pending';
                if (orderFilter === 'accepted') return o.status === 'accepted' || o.status === 'processing';
                if (orderFilter === 'out_for_delivery') return o.status === 'out_for_delivery';
                if (orderFilter === 'delivered') return o.status === 'delivered';
                return true;
              })
              .map((ord) => {
                const currentDriver = deliveryPartners.find(dp => dp.id === ord.deliveryPartnerId);
                return (
                  <div key={ord.id} className="bg-white border rounded-3xl p-5 shadow-xs text-xs space-y-3">
                    <div className="flex justify-between items-start border-b pb-2 flex-wrap gap-2">
                      <div>
                        <strong className="text-gray-900 block font-bold text-xs">Order ID: {ord.id}</strong>
                        <span className="text-[10px] text-gray-400 font-mono block">Placed: {ord.date} • Option: {ord.deliveryOption.toUpperCase()}</span>
                      </div>

                      <div className="flex gap-2 items-center">
                        <span className={`text-[10px] font-mono font-bold uppercase py-1 px-2.5 rounded border ${
                          ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-900'
                        }`}>
                          Status: {ord.status.replace('_', ' ')}
                        </span>
                        <strong className="text-teal-800 font-mono text-sm">₹{ord.total}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer context */}
                      <div>
                        <span className="text-gray-400 font-mono font-bold block uppercase text-[9.5px]">Client Household:</span>
                        <strong className="text-gray-800 block">{ord.customerName}</strong>
                        <span className="text-gray-500 mt-0.5 leading-relaxed block">{ord.customerAddress} • {ord.phone}</span>
                      </div>

                      {/* Items lists */}
                      <div>
                        <span className="text-gray-400 font-mono font-bold block uppercase text-[9.5px]">Items list:</span>
                        <div className="space-y-1">
                          {ord.items.map((it, iIdx) => (
                            <div key={iIdx} className="flex justify-between font-mono text-[11px] hover:text-teal-800">
                              <span>• {it.product.name} ({it.product.unit})</span>
                              <strong>x {it.quantity}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Operational controls */}
                    <div className="pt-3 border-t flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-slate-50/50 p-3 rounded-2xl">
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-gray-400 uppercase font-bold font-mono">Assigned courier:</span>
                        <select 
                          id={`driver-p-${ord.id}`}
                          defaultValue={ord.deliveryPartnerId || 'dp_01'}
                          className="bg-white border rounded text-[11px] font-semibold font-mono p-1 focus:outline-hidden"
                        >
                          {deliveryPartners.map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.status})</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => {
                            const val = (document.getElementById(`driver-p-${ord.id}`) as HTMLSelectElement)?.value || 'dp_01';
                            handleManualAssignOrder(ord.id, val);
                          }}
                          className="bg-slate-900 text-white font-mono font-bold text-[10px] px-2.5 py-1.5 rounded hover:bg-black cursor-pointer transition shadow-xs"
                        >
                          Assign Rider
                        </button>
                      </div>

                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, 'out_for_delivery');
                            addSystemLog('Transit controller', `Direct status transition of order ${ord.id} to IN TRANSIT.`);
                          }}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 px-3.5 rounded-lg text-[10.5px] cursor-pointer transition"
                        >
                          Dispatch Order
                        </button>
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, 'delivered');
                            addSystemLog('Transit controller', `Direct completion status override on order ${ord.id}. Marked as DELIVERED.`);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-lg text-[10.5px] cursor-pointer transition shadow-xs"
                        >
                          Mark as Delivered
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 5.6 Earnings & Payouts */}
      {adminTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border p-5 rounded-2xl shadow-xs">
              <span className="text-gray-400 font-bold block uppercase text-[9.5px]">Net Platform Revenues</span>
              <strong className="text-teal-700 text-2xl font-black block">₹{(totalRev || 28400).toLocaleString('en-IN')}</strong>
              <p className="text-[10px] text-gray-400 mt-1">Accumulated through automated subscriptions and direct dairy dispatches.</p>
            </div>

            <div className="bg-white border p-5 rounded-2xl shadow-xs">
              <span className="text-gray-400 font-bold block uppercase text-[9.5px]">Direct Platform Commissions</span>
              <strong className="text-indigo-800 text-2xl font-black block">₹{totalCommissionEarned.toLocaleString('en-IN')}</strong>
              <span className="text-[10px] text-teal-600 font-bold block mt-1">Based on flat {globalCommissionRate}% global fee</span>
            </div>

            <div className="bg-white border p-5 rounded-2xl shadow-xs">
              <span className="text-gray-400 font-bold block uppercase text-[9.5px]">Outstanding Vendor Liability</span>
              <strong className="text-amber-800 text-2xl font-black block">₹{Math.max(1200, totalRev * 0.45).toFixed(0)}</strong>
              <span className="text-[10px] text-gray-500 block mt-1">Pending releases on next weekly settling sweep</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Direct Payout triggers */}
            <div className="lg:col-span-4 bg-white border p-5 rounded-3xl shadow-xs space-y-4">
              <h3 className="font-display font-semibold text-gray-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-5 h-5 text-teal-600" /> Release Merchant Payouts
              </h3>
              <p className="text-xs text-gray-400 leading-normal">Manually execute payouts to cow dairy families and logistics drivers. Generates on-the-spot bank settle feeds.</p>

              <form onSubmit={handleReleasePayout} className="space-y-3 text-xs leading-none">
                <div>
                  <label className="block text-[10px] text-gray-405 font-bold mb-1 font-mono uppercase">Payee Target:</label>
                  <select 
                    value={selectedPayoutMerchant}
                    onChange={e => setSelectedPayoutMerchant(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded-lg font-semibold focus:outline-hidden"
                  >
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.lead})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-405 font-bold mb-1 font-mono uppercase">Settlement Amount (₹):</label>
                  <input 
                    type="number" 
                    value={customPayoutAmount}
                    onChange={e => setCustomPayoutAmount(parseFloat(e.target.value))}
                    required
                    min="100"
                    className="w-full bg-slate-50 border p-2 rounded-lg font-mono font-bold focus:outline-hidden"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
                >
                  Confirm Payout Release
                </button>
              </form>
            </div>

            {/* Finances list */}
            <div className="lg:col-span-8 bg-white border p-5 rounded-3xl shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="font-display font-semibold text-gray-950 text-xs uppercase tracking-wider">Financial Transactions Ledger</h4>
                <select 
                  value={financeCategoryFilter} 
                  onChange={e => setFinanceCategoryFilter(e.target.value as any)} 
                  className="bg-slate-50 border text-[11px] rounded p-1 font-mono focus:outline-hidden"
                >
                  <option value="all">All Entries</option>
                  <option value="revenue">Revenues Credits Only</option>
                  <option value="expense">Expenses Debits Only</option>
                </select>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {finances
                  .filter(f => {
                    if (financeCategoryFilter === 'all') return true;
                    return f.category === financeCategoryFilter;
                  })
                  .map((fRecord) => (
                    <div key={fRecord.id} className="p-3 bg-slate-50 border rounded-2xl flex justify-between items-center font-mono">
                      <div className="space-y-0.5">
                        <strong className="text-gray-900 text-xs block">{fRecord.id} - {fRecord.description}</strong>
                        <span className="text-[10px] text-gray-400 block">{fRecord.timestamp} • GST Base: ₹{fRecord.gstAmount}</span>
                      </div>

                      <strong className={`text-sm font-black ${
                        fRecord.category === 'revenue' ? 'text-emerald-700' : 'text-rose-600'
                      }`}>
                        {fRecord.category === 'revenue' ? '+' : '-'} ₹{fRecord.amount}
                      </strong>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5.7 Commission Management */}
      {adminTab === 'commission' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs text-gray-750">
            {/* Left: Commission Setup */}
            <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
              <span className="text-[10px] bg-teal-50 text-teal-800 font-mono font-bold px-2 py-0.5 rounded-full uppercase">Platform Revenue setup</span>
              <strong className="text-gray-950 text-sm block">Global Cooperative Commission Matrix</strong>
              <p className="text-xs text-gray-450 leading-relaxed font-sans">Apply commission variables deducted instantly from cooperative milk dispatches. Global flat percentages will apply on all verified store dispatches instantly.</p>

              <div className="space-y-3 pt-3">
                <div className="flex justify-between font-mono text-[10.5px] text-gray-500">
                  <span>Gross Platform Fee Margin:</span>
                  <strong className="text-teal-800 font-black">{globalCommissionRate}% flat rate</strong>
                </div>

                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  value={globalCommissionRate}
                  onChange={e => {
                    const rate = parseInt(e.target.value);
                    setGlobalCommissionRate(rate);
                    addSystemLog('Commission Matrix', `Admin changed platform franchise fee rate to: ${rate}%`);
                  }}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600 outline-hidden"
                />

                <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                  <span>0% (Direct Dairy Subsidy)</span>
                  <span>15% (Target)</span>
                  <span>30% (Central Cap)</span>
                </div>
              </div>
            </div>

            {/* Right: Revenue Breakdown calculators */}
            <div className="bg-white border rounded-3xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <strong className="font-display text-gray-900 text-xs uppercase tracking-wider block font-bold">Projected platform monetization breakup</strong>
                <p className="text-[11px] text-gray-400 mt-0.5">Breakdown of gross margin percentages calculated across sales.</p>
              </div>

              <div className="space-y-3 my-4 font-mono text-[11px] text-gray-700">
                <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span>Direct retail commission ({globalCommissionRate}% share):</span>
                  <strong className="text-teal-800">₹{totalCommissionEarned.toFixed(0)} Platform commission</strong>
                </div>

                <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span>Premium Membership Gold Tiers:</span>
                  <strong className="text-indigo-805">45% total household share</strong>
                </div>

                <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span>Logistics and Cold-Chain dispatch services:</span>
                  <strong className="text-slate-800">Flat ₹45 delivery fee markup</strong>
                </div>
              </div>

              <span className="text-[10px] text-gray-400 block text-right font-mono">Data sync frequency: Real-time</span>
            </div>
          </div>
        </div>
      )}

      {/* 5.8 Offers & Coupons */}
      {adminTab === 'offers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono font-medium text-center">
            <div className="bg-white border p-4 rounded-3xl shadow-xs">
              <span className="text-gray-450 block uppercase text-[9px]">Autocredit Cashback</span>
              <strong className="text-teal-800 text-lg mt-1 block">{globalCashbackRate}% off loyalty conversion</strong>
              <input 
                type="range" 
                min="0" 
                max="15" 
                value={globalCashbackRate} 
                onChange={e => setGlobalCashbackRate(parseInt(e.target.value))} 
                className="w-full accent-teal-600 cursor-pointer h-1 rounded mt-2 outline-hidden"
              />
            </div>

            <div className="bg-white border p-4 rounded-3xl shadow-xs">
              <span className="text-gray-450 block uppercase text-[9px]">Referrals Invitation bonus</span>
              <strong className="text-indigo-800 text-lg mt-1 block">₹{globalReferralBonus} direct deposit</strong>
              <input 
                type="number" 
                value={globalReferralBonus} 
                onChange={e => setGlobalReferralBonus(parseInt(e.target.value))} 
                className="w-16 bg-slate-50 border text-center font-bold font-mono mt-1 text-xs focus:outline-hidden"
              />
            </div>

            <div className="bg-white border p-4 rounded-3xl shadow-xs flex flex-col justify-center">
              <span className="text-gray-400 block uppercase text-[9px] font-sans">Platform Coupon liability</span>
              <strong className="text-amber-805 text-lg mt-1 font-black block">₹1,450 disbursed</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
            {/* Create Coupon form */}
            <div className="lg:col-span-4 bg-white border p-5 rounded-3xl shadow-xs space-y-4">
              <h3 className="font-display font-semibold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-teal-600 animate-pulse" /> Launch Promotion Campaign
              </h3>
              <p className="text-xs text-gray-450 leading-relaxed">Launch customized discount vouchers valid across dairy catalog checkouts.</p>

              <form onSubmit={handleAddNewCoupon} className="space-y-3 leading-none">
                <div>
                  <label className="block text-[10px] text-gray-405 font-bold mb-1 font-mono uppercase">Voucher Code string:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. AMRIT50" 
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    required
                    className="w-full bg-slate-50 border text-xs p-2 uppercase font-mono font-bold rounded-lg focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-405 font-bold mb-1 font-mono uppercase">Voucher Price offset:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ₹50 Instant Off" 
                    value={newDiscount}
                    onChange={e => setNewDiscount(e.target.value)}
                    required
                    className="w-full bg-slate-50 border text-xs p-2 rounded-lg font-bold focus:outline-hidden"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold p-2 text-xs rounded-xl cursor-pointer transition shadow-xs"
                >
                  Create & Launch Promo
                </button>
              </form>
            </div>

            {/* Coupons list */}
            <div className="lg:col-span-8 bg-white border p-5 rounded-3xl shadow-xs space-y-4">
              <h4 className="font-display font-semibold text-gray-900 text-xs uppercase tracking-widest font-mono">Platform Campaign Registers</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {coupons.map((c, idx) => (
                  <div key={idx} className="border border-dashed border-teal-200 bg-teal-50/5 p-4 rounded-2xl flex justify-between items-center text-xs shadow-xs">
                    <div>
                      <span className="font-mono font-black text-teal-800 text-sm tracking-wider uppercase">{c.code}</span>
                      <div className="text-gray-500 mt-1 font-bold">{c.discount} (Min Order: {c.minOrder})</div>
                      <span className="text-[9.5px] font-mono text-gray-400 block mt-1 tracking-wider">{c.usageCount} checkouts matched</span>
                    </div>
                    <div>
                      <button 
                        onClick={() => handleToggleCoupon(c.code)}
                        className={`font-semibold py-1 px-2.5 rounded-lg text-[10px] cursor-pointer border transition ${
                          c.active 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {c.active ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5.9 Reports & Analytics */}
      {adminTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 pb-3 gap-3">
              <div>
                <h4 className="font-display font-semibold text-gray-950 text-xs uppercase tracking-wider flex items-center gap-1">
                  <BarChart3 className="w-5 h-5 text-teal-600" /> Executive Business Reports Suite
                </h4>
                <p className="text-xs text-slate-450 font-medium">Download audits, verify financial logs, and export ledger parameters instantly.</p>
              </div>

              {/* Sub-tabs inside Reports */}
              <div className="flex gap-1 flex-wrap font-mono font-bold">
                {[
                  { id: 'sales', label: 'Revenue & Sales' },
                  { id: 'products', label: 'SKU Inventory Velocities' },
                  { id: 'customers', label: 'Household LTV' },
                  { id: 'vendors', label: 'FSSAI Farmer Audits' },
                  { id: 'delivery', label: 'Courier SLA performance' }
                ].map(rept => (
                  <button
                    key={rept.id}
                    onClick={() => setActiveReportType(rept.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] transition cursor-pointer ${
                      activeReportType === rept.id 
                        ? 'bg-slate-900 text-white font-extrabold shadow-sm' 
                        : 'bg-slate-50 text-gray-500 hover:text-gray-900 border'
                    }`}
                  >
                    {rept.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Report visualization logs */}
            <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl text-xs space-y-4 font-mono select-text shadow-inner border border-slate-950">
              <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase font-sans border-b border-slate-800 pb-1.5">
                <span>Summary records vertical</span>
                <div className="flex gap-2 font-mono">
                  <button onClick={() => exportReportData(activeReportType, 'csv')} className="text-green-400 hover:underline flex items-center gap-0.5 cursor-pointer">CSV Export</button>
                  <span>|</span>
                  <button onClick={() => exportReportData(activeReportType, 'json')} className="text-teal-400 hover:underline flex items-center gap-0.5 cursor-pointer">JSON Export</button>
                </div>
              </div>

              {activeReportType === 'sales' && (
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Subscription Revenue share:</span><strong className="text-teal-400">70.4% Net Recurring (Family Plans leading)</strong></div>
                  <div className="flex justify-between"><span>Product Margins:</span><strong className="text-teal-400">34.2% average</strong></div>
                  <div className="flex justify-between"><span>Direct Payment options ratio:</span><strong>62% Smart Wallet | 28% UPI | 10% cash</strong></div>
                  <div className="flex justify-between"><span>GSTR-1 Liability Collections:</span><strong>₹{(totalRev * 0.05).toFixed(1)} GST</strong></div>
                </div>
              )}

              {activeReportType === 'products' && (
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Most popular catalog SKU:</span><strong className="text-teal-400">Cow Milk 1L Classic Variant</strong></div>
                  <div className="flex justify-between"><span>Total inventory in physical reserve:</span><strong>2,540 Pouches</strong></div>
                  <div className="flex justify-between"><span>Variants Distribution:</span><strong>42% in 500ml | 38% in 1L | 20% in 2L SKU sizes</strong></div>
                  <div className="flex justify-between"><span>Laboratory fat-compliance validation checks:</span><span className="text-emerald-400 font-bold">100% compliant rate</span></div>
                </div>
              )}

              {activeReportType === 'customers' && (
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Household average Monthly spending:</span><strong className="text-teal-400">₹2,480 per household</strong></div>
                  <div className="flex justify-between"><span>Active monthly plan subscribers pool:</span><strong>Gold premium (45% of customer profiles)</strong></div>
                  <div className="flex justify-between"><span>Direct Smart Wallet deposits balance:</span><strong>Average ₹1,200 per wallet account</strong></div>
                </div>
              )}

              {activeReportType === 'vendors' && (
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Gross single-origin farm delivery (litres):</span><strong className="text-teal-400">4,200 Litres total this month</strong></div>
                  <div className="flex justify-between"><span>Vendor commission margin yield:</span><strong className="text-rose-400">₹{(totalRev * (globalCommissionRate / 100)).toFixed(0)} credited to corporate assets</strong></div>
                  <div className="flex justify-between"><span>FSSAI Quality check audit logs:</span><span className="text-emerald-400 font-bold">100% compliant (Fat: 4.2 | SNF: 8.8 parameters)</span></div>
                </div>
              )}

              {activeReportType === 'delivery' && (
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Avg dispatch turnaround time:</span><strong className="text-teal-400">12.8 Mins SLA (Outstandingly quick)</strong></div>
                  <div className="flex justify-between"><span>Paid out rider fuel fees:</span><strong className="text-amber-400">₹{(orders.length * 45).toFixed(0)} disbursed</strong></div>
                  <div className="flex justify-between"><span>Courier success rating:</span><span className="text-emerald-400 font-bold">99.8% customer satisfaction score</span></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5.10 Support & Notification */}
      {adminTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs text-gray-750">
          {/* Active Support Tickets list */}
          <div className="lg:col-span-5 bg-white border p-4 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-gray-950 text-xs uppercase tracking-wider flex items-center gap-1 font-mono">
              <MessageSquare className="w-5 h-5 text-teal-600" /> Unified Customer Chat Tickets
            </h3>
            <p className="text-xs text-gray-400 leading-normal">Resolve disputes, address quality checks, and answer customer concerns.</p>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
              {tickets.map((t) => (
                <div 
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedTicketId === t.id 
                      ? 'border-teal-600 bg-teal-50/10 shadow-xs' 
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-gray-950 font-bold block">{t.customerName}</strong>
                    <span className={`text-[9px] font-mono border py-0.5 px-2 rounded uppercase font-bold uppercase ${
                      t.status === 'open' ? 'bg-orange-50 border-orange-255 text-orange-700 font-black animate-pulse' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-mono">Case Type: {t.complaintType.replace('_', ' ').toUpperCase()} • {t.date}</div>
                  <p className="text-gray-600 line-clamp-1 mt-1 font-medium">{t.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Conversation and reply interface */}
          <div className="lg:col-span-7 bg-white border p-5 rounded-3xl shadow-xs flex flex-col justify-between">
            {activeTicket ? (
              <div className="space-y-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-center border-b pb-2 flex-wrap gap-2">
                    <div>
                      <strong className="text-gray-900 block text-xs font-bold uppercase">Conversation Thread: {activeTicket.id}</strong>
                      <span className="text-[10.5px] text-gray-450 block font-mono">Customer: {activeTicket.customerName} • Issue Type: {activeTicket.complaintType.replace('_', ' ').toUpperCase()}</span>
                    </div>

                    <button 
                      onClick={() => {
                        activeTicket.status = 'resolved';
                        addSystemLog('Tickets CRM', `Officially marked ticket ID: ${activeTicket.id} as RESOLVED.`);
                        alert(`Vetted and closed case: ${activeTicket.id}`);
                      }}
                      className="bg-emerald-50 border border-emerald-250 text-emerald-8 bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded text-[10px] hover:bg-emerald-100 cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  </div>

                  {/* Messaging logs listing */}
                  <div className="space-y-2 max-h-[200px] overflow-y-auto my-3 pr-1">
                    {activeTicket.messages.map((msg, mIdx) => (
                      <div 
                        key={mIdx} 
                        className={`flex flex-col max-w-[85%] ${
                          msg.sender === 'support' ? 'ml-auto text-right font-semibold' : 'text-left font-medium'
                        }`}
                      >
                        <span className="text-[9.5px] text-gray-400 block font-mono">
                          {msg.sender === 'support' ? 'DairyFresh agent' : activeTicket.customerName} • {msg.timestamp}
                        </span>
                        <p className={`p-2.5 rounded-2xl text-[11px] leading-relaxed mt-0.5 ${
                          msg.sender === 'support' 
                            ? 'bg-slate-900 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendTicketReply} className="flex gap-1.5 pt-2 border-t font-sans">
                  <input 
                    type="text" 
                    placeholder="Enter support reply statement..." 
                    value={adminReplyText}
                    onChange={e => setAdminReplyText(e.target.value)}
                    required
                    className="flex-1 bg-slate-50 border leading-none rounded-lg p-2 font-medium focus:outline-hidden text-xs"
                  />
                  <button 
                    type="submit" 
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold p-2 text-xs rounded-xl cursor-pointer transition shadow-xs"
                  >
                    Send message
                  </button>
                </form>
              </div>
            ) : (
              <p className="text-gray-400 italic text-center p-8 my-auto text-xs">No active support ticket selected. Select an account on the left pane.</p>
            )}
          </div>
        </div>
      )}

      {/* 5.11 Settings & System */}
      {adminTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white border rounded-3xl p-5 shadow-xs space-y-4">
            <span className="text-[10px] bg-teal-50 text-teal-800 font-mono font-bold px-2 py-0.5 rounded-full uppercase">Subscribers Plan Configurations</span>
            <strong className="text-gray-950 text-sm block">System level Plan Variables Calibration</strong>
            <p className="text-xs text-gray-450 leading-relaxed font-sans">Toggle permissions that allow monthly or daily users to pauses vacation dispatches or increase dates quantity allocations dynamically.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((pl) => (
                <div key={pl.id} className="border bg-slate-50/50 rounded-2xl p-4 space-y-3.5 shadow-xs">
                  <div className="border-b pb-2 flex justify-between items-center">
                    <strong className="text-slate-900 font-extrabold block text-xs">{pl.name}</strong>
                    <span className="text-[10px] bg-teal-50 text-teal-850 px-2 py-0.5 rounded font-mono font-black">{pl.activeUsers} Houses</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px] text-gray-650">
                    <div className="flex justify-between"><span>500ml milk cost:</span><strong>₹{pl.pricePerDay500ml}/day</strong></div>
                    <div className="flex justify-between"><span>1 Litre milk cost:</span><strong>₹{pl.pricePerDay1L}/day</strong></div>
                    <div className="flex justify-between"><span>2 Litre bulk milk cost:</span><strong>₹{pl.pricePerDay2L}/day</strong></div>
                  </div>

                  <div className="pt-2 border-t flex justify-between text-[10px] text-gray-400 font-mono">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pl.pauseOption} 
                        onChange={() => {
                          setPlans(prev => prev.map(p => p.id === pl.id ? { ...p, pauseOption: !p.pauseOption } : p));
                          addSystemLog('Subscription Matrix', `Vetted vacation settings toggle for: ${pl.name}`);
                        }}
                        className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer" 
                      />
                      Allow Vacation Pause
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pl.dateWisePause} 
                        onChange={() => {
                          setPlans(prev => prev.map(p => p.id === pl.id ? { ...p, dateWisePause: !p.dateWisePause } : p));
                          addSystemLog('Subscription Matrix', `Vetted quantity variables toggle for: ${pl.name}`);
                        }}
                        className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer" 
                      />
                      Allow Quantity shift
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs text-gray-750">
            {/* push Broadcast setting trigger */}
            <div className="lg:col-span-5 bg-white border p-5 rounded-3xl shadow-xs space-y-4">
              <h3 className="font-display font-semibold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <Send className="w-4 h-4 text-teal-600" /> Push Broadcast alerts (CRM Studio)
              </h3>
              <p className="text-xs text-gray-400 leading-normal">Transmit push announcements, alert warnings, or customized cashbacks to all client scopes instant.</p>

              <div className="space-y-3 font-sans">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold font-mono tracking-wider mb-1">Target Audience:</label>
                  <select 
                    value={notifTargetGroup}
                    onChange={e => setNotifTargetGroup(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded-lg font-semibold focus:outline-hidden"
                  >
                    <option value="all">All Channels (Everyone)</option>
                    <option value="subscribers">Subscribed households only</option>
                    <option value="offline">Inactive users</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold font-mono tracking-wider mb-1">Alert Title banner:</label>
                  <input 
                    type="text" 
                    value={notifTitle}
                    onChange={e => setNotifTitle(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded-lg font-semibold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase font-bold font-mono tracking-wider mb-1">Alert text description:</label>
                  <textarea 
                    rows={2}
                    value={notifMessage}
                    onChange={e => setNotifMessage(e.target.value)}
                    className="w-full bg-slate-50 border p-2 rounded-lg font-semibold focus:outline-hidden"
                  />
                </div>

                <button 
                  onClick={() => {
                    addNotification('offer', notifTitle, notifMessage);
                    addSystemLog('Push Broadcaster', `Sent alerts broadcast target group [${notifTargetGroup.toUpperCase()}]: "${notifTitle}"`);
                    alert(`Successfully sent notification to target group: ${notifTargetGroup.toUpperCase()}`);
                  }}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold p-2 text-xs rounded-xl cursor-pointer transition shadow-sm text-center"
                >
                  Broadcast Alerts Broadcast
                </button>
              </div>
            </div>

            {/* Corporate Telemetries Log stream console */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-950 text-emerald-400 rounded-3xl p-5 relative overflow-hidden min-h-[350px] flex flex-col justify-between shadow-lg">
              <span className="absolute top-3 right-4 px-2 py-0.5 bg-slate-800 text-emerald-300 font-mono text-[9px] font-black uppercase tracking-widest rounded border border-slate-700">
                HOST_FEED: COMPLIANT
              </span>

              <div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                  <span className="font-mono text-[10px] font-extrabold uppercase text-slate-100 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-500 animate-pulse" /> Telemetry Log streams
                  </span>
                  <button 
                    onClick={clearSystemLogs}
                    className="text-gray-400 hover:text-white font-sans text-[10px] cursor-pointer transition"
                  >
                    Clear System session logs
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 font-mono text-[10px] leading-relaxed">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="border-b border-slate-850/30 pb-1 flex justify-between gap-1 items-start">
                      <div>
                        <span className="text-slate-400">[{log.timestamp}]</span>{' '}
                        <span className="text-cyan-400 font-bold">[{log.module}]</span>{' '}
                        <span className="text-emerald-400">{log.message}</span>
                      </div>
                    </div>
                  ))}
                  {systemLogs.length === 0 && (
                    <p className="text-gray-500 italic p-2 text-center">No system operations telemetry logged inside current session segment.</p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-400 flex justify-between font-mono">
                <span>Memory usage buffer: Green</span>
                <span>Ingress proxy: Port 3000</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
