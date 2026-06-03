import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, OrderItem } from '../types';
import { 
  ShoppingBag, Calendar, Wallet, Search, MapPin, 
  Sparkles, Check, ArrowRight, User, Phone, Play, 
  Star, MessageSquare, Clock, Plus, Minus, RefreshCw, X, ChevronRight, Mic, ShieldAlert, Award,
  Heart, Camera, Tv, Tag
} from 'lucide-react';

export const CustomerApp: React.FC = () => {
  const { 
    products, subscriptions, walletBalance, walletTransactions, 
    orders, addWalletFunds, createSubscription, pauseSubscription, 
    updateSubscriptionQuantity, placeOrder, submitFeedback, addSupportTicket, updateOrderStatus
  } = useApp();

  const [activeTab, setActiveTab ] = useState<'browse' | 'subscriptions' | 'wallet' | 'orders'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceSimulating, setVoiceSimulating] = useState(false);
  const [addressType, setAddressType] = useState<'home' | 'office' | 'other'>('home');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('Apt 402, Oakwood Residency, Gurgaon');
  
  // AI assistant state
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendedIds, setAiRecommendedIds] = useState<string[]>([]);

  // Cart state
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'upi' | 'cod'>('wallet');

  // Subscription builders
  const [subPlan, setSubPlan] = useState<'500ml' | '1L' | '2L'>('1L');
  const [subFreq, setSubFreq] = useState<'daily' | 'alternate' | 'weekly'>('daily');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Vacation pauses
  const [vacStart, setVacStart] = useState('');
  const [vacEnd, setVacEnd] = useState('');
  const [activePauseId, setActivePauseId] = useState<string | null>(null);

  // Temporary quantity tweaks
  const [tempQtyId, setTempQtyId] = useState<string | null>(null);
  const [tempQtyVal, setTempQtyVal] = useState<number>(2);

  // Product detail view modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // New Support Ticket message
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketType, setTicketType] = useState<'late_delivery' | 'product_quality' | 'refund' | 'missing_item'>('late_delivery');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Feedback fields
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  // Extended active state modules for perfect checklist activation
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('df_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [saveForLater, setSaveForLater] = useState<{ product: Product; quantity: number }[]>(() => {
    const saved = localStorage.getItem('df_save_later');
    return saved ? JSON.parse(saved) : [];
  });
  const [barcodeScanning, setBarcodeScanning] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [subDeliverySlot, setSubDeliverySlot] = useState<'morning' | 'evening'>('morning');
  const [customAddressInput, setCustomAddressInput] = useState('');

  // Authentications and profiles (1.1 Checklist)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentCustomerName, setCurrentCustomerName] = useState('Anjali Sharma');
  const [currentCustomerPhone, setCurrentCustomerPhone] = useState('+91 98112 34455');
  const [isSimulatedLoggedIn, setIsSimulatedLoggedIn] = useState(true);
  const [loginMethodUsed, setLoginMethodUsed] = useState<'Google' | 'Facebook' | 'OTP' | 'Email' | 'None'>('Google');
  const [referralInput, setReferralInput] = useState('');
  const [referralBonusClaimed, setReferralBonusClaimed] = useState(false);
  
  // Custom addresses (1.2 Saved Addresses Checklist)
  const [savedAddresses, setSavedAddresses] = useState<string[]>([
    'Apt 402, Oakwood Residency, Sector 56, Gurgaon',
    'WorkTech Hub Tower C, DLF CyberCity, Gurgaon',
    'Plot 14B, Green Meadows Sanctuary, Sohna'
  ]);
  const [addressIndex, setAddressIndex] = useState(0);

  // Delivery Checkout Option (1.8 Checklist)
  const [deliveryTypeOption, setDeliveryTypeOption] = useState<'instant' | 'scheduled' | 'subscription'>('instant');
  const [scheduledSlotChosen, setScheduledSlotChosen] = useState('06:00 AM - 08:00 AM Tomorrow');

  // Interactive Payments Modes state (1.9 Checklist)
  const [activePaymentTab, setActivePaymentTab] = useState<'wallet' | 'upi' | 'card' | 'netbank' | 'qrcode' | 'cod'>('wallet');
  const [virtualCardNumber, setVirtualCardNumber] = useState('4532 9901 2419 8832');
  const [virtualCardName, setVirtualCardName] = useState('Anjali Sharma');
  const [virtualCardExpiry, setVirtualCardExpiry] = useState('12/28');
  const [virtualCardCvv, setVirtualCardCvv] = useState('902');
  const [selectedNetBank, setSelectedNetBank] = useState('HDFC Bank');
  const [qrPulsing, setQrPulsing] = useState(false);
  const [typedUpiId, setTypedUpiId] = useState('anjali@okaxis');

  // Loyalty Program State (1.14 Checklist)
  const [loyaltyPointsBalance, setLoyaltyPointsBalance] = useState<number>(() => {
    const saved = localStorage.getItem('df_loyalty_pts');
    return saved ? parseInt(saved, 10) : 320;
  });
  const [applyLoyaltyPoints, setApplyLoyaltyPoints] = useState(false);
  const [checkoutCouponCode, setCheckoutCouponCode] = useState('');

  // Cashback Reward Scratch Card state (1.15 Checklist)
  const [justPlacedOrder, setJustPlacedOrder] = useState<boolean>(false);
  const [scratchedAmount, setScratchedAmount] = useState<number | null>(null);
  const [isScratchingEffect, setIsScratchingEffect] = useState<boolean>(false);

  // Live order transit step tracking maps (1.10 Checklist)
  const [orderTrackingProg, setOrderTrackingProg] = useState<Record<string, number>>({});
  const [enteredOrderOtp, setEnteredOrderOtp] = useState<Record<string, string>>({});
  const [showConfettiForOrder, setShowConfettiForOrder] = useState<string | null>(null);

  // Sync auxiliary states to localStorage for persistent simulator fidelity
  React.useEffect(() => {
    localStorage.setItem('df_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  React.useEffect(() => {
    localStorage.setItem('df_save_later', JSON.stringify(saveForLater));
  }, [saveForLater]);

  React.useEffect(() => {
    localStorage.setItem('df_loyalty_pts', loyaltyPointsBalance.toString());
  }, [loyaltyPointsBalance]);

  // Categories matching all 19 detailed specifications requested (1.3 Checklist)
  const categories = [
    'All', 'Cow Milk', 'Buffalo Milk', 'A2 Milk', 'Organic Milk', 'Flavored Milk', 
    'Curd', 'Paneer', 'Cheese', 'Butter', 'Ghee', 'Lassi', 'Buttermilk', 
    'Ice Cream', 'Sweets', 'Yogurt', 'Milk Powder', 'Dairy Beverages', 'Organic Products', 'Milk'
  ];

  // Simulated status milestones labels (1.10)
  const getSimulatedStatusLabel = (stepIndex: number): string => {
    const steps = ['Pending', 'Vendor Accepted', 'Packed', 'Pickup Started', 'Delivery Boy Assigned', 'Out for Delivery', 'Delivered'];
    return steps[stepIndex] || 'Delivered';
  };

  // Get progressive tracking milestones (1.10)
  const getOrderStatusProgressIndex = (orderId: string, currentStatus: string): number => {
    if (orderTrackingProg[orderId] !== undefined) {
      return orderTrackingProg[orderId];
    }
    const orderStatuses: string[] = ['pending', 'accepted', 'packed', 'ready_pickup', 'picked_up', 'out_for_delivery', 'delivered'];
    const foundIndex = orderStatuses.indexOf(currentStatus);
    return foundIndex >= 0 ? foundIndex : 6;
  };

  // Step-forward rider simulator route (1.10)
  const advanceOrderProgress = (orderId: string, currentProgress: number) => {
    const nextProg = Math.min(6, currentProgress + 1);
    setOrderTrackingProg(prev => ({ ...prev, [orderId]: nextProg }));
    
    // Auto-sync status to global state core
    const orderStatuses: any[] = ['pending', 'accepted', 'packed', 'ready_pickup', 'picked_up', 'out_for_delivery', 'delivered'];
    const contextStatus = orderStatuses[nextProg];
    updateOrderStatus(orderId, contextStatus, 'dp1');
  };

  // GPS Emulator
  const handleGpsDetect = () => {
    setGpsLoading(true);
    setTimeout(() => {
      setGpsLoading(false);
      setDetectedAddress('Sector 56 Metro Station Hub, Near Rapid Rail, Gurugram');
    }, 1200);
  };

  // Voice Search Simulation
  const triggerVoiceSearch = () => {
    setVoiceSimulating(true);
    const mockPhrases = [
      'Show me premium A2 Vedic Gir Milk with high calcium.',
      'Recommend dietary paneer high in proteins and zero yeast.',
      'Show premium organic set curd for breakfast digest.'
    ];
    const chosen = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
    
    setTimeout(() => {
      setSearchQuery(chosen);
      setVoiceSimulating(false);
    }, 1500);
  };

  // AI Recommender execution
  const executeAiSearch = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse(null);
    setAiRecommendedIds([]);

    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery, catalog: products })
      });
      const data = await res.json();
      setAiResponse(data.nutritionalAdvice || 'No analytical feedback returned.');
      setAiRecommendedIds(data.recommendedProductIds || []);
    } catch {
      setAiResponse('System encountered transient server routing issues. Serving simulated intelligence profile.');
    } finally {
      setAiLoading(false);
    }
  };

  // Barcode scanning simulation
  const triggerBarcodeScanner = () => {
    setBarcodeScanning(true);
    setTimeout(() => {
      const matches = products.filter(p => p.id === 'p3' || p.id === 'p4');
      const randomMatch = matches[Math.floor(Math.random() * matches.length)] || products[0];
      setSelectedProduct(randomMatch);
      setBarcodeScanning(false);
    }, 1800);
  };

  // Toggle wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Move product to Save for Later
  const moveToSaveForLater = (productId: string) => {
    const itemToMove = cart.find(i => i.product.id === productId);
    if (!itemToMove) return;
    
    // Remove from cart
    setCart(prev => prev.filter(i => i.product.id !== productId));
    // Add to save for later
    setSaveForLater(prev => {
      if (prev.some(i => i.product.id === productId)) return prev;
      return [...prev, itemToMove];
    });
  };

  // Move back to cart
  const moveFromSaveToCart = (productId: string) => {
    const itemToMove = saveForLater.find(i => i.product.id === productId);
    if (!itemToMove) return;

    // Remove from save for later
    setSaveForLater(prev => prev.filter(i => i.product.id !== productId));
    // Add back to cart
    setCart(prev => {
      if (prev.some(i => i.product.id === productId)) return prev;
      return [...prev, itemToMove];
    });
  };

  // Add to cart helpers
  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item => item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== id));
      return;
    }
    setCart(prev => prev.map(item => item.product.id === id ? { ...item, quantity: qty } : item));
  };

  // Place order wrapper with loyalty and checkout rules (1.8, 1.9, 1.14 details)
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Total checks accounting for Loyalty points discount
    const currentSubtotal = cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);
    const calculatedDiscount = applyLoyaltyPoints ? Math.min(loyaltyPointsBalance, Math.floor(currentSubtotal * 0.3)) : 0;
    const finalBill = Math.max(0, currentSubtotal - calculatedDiscount);

    if (paymentMethod === 'wallet' && walletBalance < finalBill) {
      alert('Your Smart Milk Wallet has insufficient funds. Please top up above or use another secured gateway.');
      return;
    }

    // Call placeOrder action
    const outcome = placeOrder(
      cart,
      paymentMethod,
      deliveryTypeOption,
      checkoutCouponCode
    );

    if (outcome) {
      setCheckoutCouponCode('');
      // Apply loyalty point changes
      if (applyLoyaltyPoints) {
        setLoyaltyPointsBalance(prev => Math.max(0, prev - calculatedDiscount));
      }
      
      // Earn 5% loyalty stars from checkout
      const earnedStars = Math.max(5, Math.round(finalBill * 0.05));
      setLoyaltyPointsBalance(prev => prev + earnedStars);

      // Trigger Cashback Scratch card availability (1.15)
      setJustPlacedOrder(true);
      setScratchedAmount(null);

      // Clear basket state
      setCart([]);
      setApplyLoyaltyPoints(false);
      setShowCart(false);
      setActiveTab('orders');
    } else {
      alert('Transaction failed. Please replenish your Smart milk wallet or choose another portal.');
    }
  };

  // Submit subscription
  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSubscription(subPlan, subFreq);
    setIsSubscribing(false);
    setActiveTab('subscriptions');
  };

  const submitTicket = () => {
    if (!ticketMsg.trim()) return;
    addSupportTicket(ticketType, ticketMsg);
    setTicketMsg('');
    setTicketSuccess(true);
    setTimeout(() => setTicketSuccess(false), 3000);
  };

  const executeVacationPause = (subId: string) => {
    if (!vacStart || !vacEnd) return;
    pauseSubscription(subId, vacStart, vacEnd);
    setActivePauseId(null);
    setVacStart('');
    setVacEnd('');
  };

  const executeTempQty = (subId: string) => {
    updateSubscriptionQuantity(subId, tempQtyVal);
    setTempQtyId(null);
  };

  // Filtered catalogue
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 10 Customer flow touchpoints matching sequential image specifications
  const customerUserOrders = orders.filter(o => o.customerId === 'cust_user');
  
  const custSteps = [
    {
      num: "1.1",
      title: "Login / Register",
      sub: "Mobile OTP",
      checkCompleted: () => isSimulatedLoggedIn && loginMethodUsed !== 'None',
      action: () => {
        setShowProfileModal(true);
      }
    },
    {
      num: "1.2",
      title: "Browse Products",
      sub: "Search / Category",
      checkCompleted: () => searchQuery.length > 0 || selectedCategory !== 'All',
      action: () => {
        setActiveTab('browse');
        const input = document.querySelector('input[placeholder*="Search fresh"]');
        if (input) (input as HTMLInputElement).focus();
      }
    },
    {
      num: "1.3",
      title: "Add to Cart",
      sub: `${cart.reduce((s, i) => s + i.quantity, 0)} items added`,
      checkCompleted: () => cart.length > 0,
      action: () => {
        setActiveTab('browse');
        if (cart.length === 0 && products.length > 0) {
          addToCart(products[0]);
        }
      }
    },
    {
      num: "1.4",
      title: "Place Order",
      sub: "Basket Checklist",
      checkCompleted: () => cart.length > 0 && showCart,
      action: () => {
        setShowCart(true);
        setActiveTab('browse');
      }
    },
    {
      num: "1.5",
      title: "Choose Address",
      sub: addressType.toUpperCase() + " Mode",
      checkCompleted: () => addressType !== 'home' || customAddressInput !== '' || detectedAddress !== 'Apt 402, Oakwood Residency, Sector 56, Gurgaon',
      action: () => {
        const addrField = document.getElementById('custom-address-field');
        if (addrField) {
          (addrField as HTMLInputElement).focus();
        } else {
          setAddressType('other');
          setTimeout(() => {
            const af = document.getElementById('custom-address-field');
            if (af) (af as HTMLInputElement).focus();
          }, 100);
        }
      }
    },
    {
      num: "1.6",
      title: "Payment Mode",
      sub: activePaymentTab.toUpperCase() + " Gateway",
      checkCompleted: () => activePaymentTab !== 'wallet' || walletTransactions.length > 0,
      action: () => {
        setShowCart(true);
        setActiveTab('browse');
      }
    },
    {
      num: "1.7",
      title: "Order Placed",
      sub: `${customerUserOrders.length} orders totals`,
      checkCompleted: () => customerUserOrders.length > 0,
      action: () => {
        setActiveTab('orders');
      }
    },
    {
      num: "1.8",
      title: "Live Tracking",
      sub: "Transit Driver Map",
      checkCompleted: () => customerUserOrders.some(o => getOrderStatusProgressIndex(o.id, o.status) > 0 && o.status !== 'delivered'),
      action: () => {
        setActiveTab('orders');
        if (customerUserOrders.length === 0 && products.length > 0) {
          const outcome = placeOrder([{ product: products[0], quantity: 1 }], 'wallet', 'instant', '');
          if (outcome) {
            alert(`Created order under Instant mode. Active tracking panel enabled!`);
          }
        }
      }
    },
    {
      num: "1.9",
      title: "Order Delivered",
      sub: "OTP verified lock",
      checkCompleted: () => customerUserOrders.some(o => o.status === 'delivered'),
      action: () => {
        setActiveTab('orders');
        const activeTransit = customerUserOrders.find(o => o.status !== 'delivered' && o.status !== 'rejected');
        if (activeTransit) {
          updateOrderStatus(activeTransit.id, 'out_for_delivery', 'dp1');
          setOrderTrackingProg(prev => ({ ...prev, [activeTransit.id]: 5 }));
          alert(`Simulated order ${activeTransit.id} is now 'Out for Delivery'. Enter the OTP code to complete delivery!`);
        } else if (customerUserOrders.length === 0 && products.length > 0) {
          const outcome = placeOrder([{ product: products[0], quantity: 1 }], 'wallet', 'instant', '');
          if (outcome) {
            const newlyCreated = orders.find(o => o.customerId === 'cust_user');
            if (newlyCreated) {
              updateOrderStatus(newlyCreated.id, 'out_for_delivery', 'dp1');
              setOrderTrackingProg(prev => ({ ...prev, [newlyCreated.id]: 5 }));
            }
            alert(`Drafted a live order and simulated its route to 'Out for Delivery'. Enter OTP lock below!`);
          }
        }
      }
    },
    {
      num: "1.10",
      title: "Rate & Review",
      sub: "Satisfaction stars",
      checkCompleted: () => customerUserOrders.some(o => o.feedbackRating !== undefined && o.feedbackRating > 0),
      action: () => {
        setActiveTab('orders');
        const deliveredOrder = customerUserOrders.find(o => o.status === 'delivered');
        if (deliveredOrder) {
          setFeedbackOrderId(deliveredOrder.id);
          setFeedbackRating(5);
        } else {
          alert('Verify and deliver an order to submit quality star reviews!');
        }
      }
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6" id="customer-view-container">
      
      {/* 1. CUSTOMER APP FEATURE GROUPING NAVIGATION BOARD */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                1. CUSTOMER APP
              </span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
            </div>
            <h2 className="text-md font-display font-bold text-teal-300 mt-1 uppercase tracking-tight">Interactive Feature Grouping Index</h2>
            <p className="text-xs text-gray-400 leading-normal mt-0.5">
              Each module of the dairy retail cycle operates step-by-step. Click below to fast-track or focus each requested checkout stage!
            </p>
          </div>
          <div className="bg-black/40 px-3.5 py-1.5 rounded-2xl border border-gray-800 shrink-0 flex items-center gap-3">
            <div className="text-left font-mono">
              <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-widest">Active Profile</span>
              <span className="text-xs font-bold text-gray-300 font-sans">{currentCustomerName}</span>
            </div>
            <div className="h-6 w-[1px] bg-gray-800"></div>
            <button 
              onClick={() => {
                setCart([]);
                setApplyLoyaltyPoints(false);
                setCheckoutCouponCode('');
                setJustPlacedOrder(false);
                setIsSimulatedLoggedIn(false);
                setLoginMethodUsed('None');
                setActiveTab('browse');
                alert('Pristine client simulation rebooted successfully!');
              }}
              className="bg-white/5 hover:bg-white/10 transition text-[9px] font-mono font-bold text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-xl cursor-pointer"
            >
              Reset Flow
            </button>
          </div>
        </div>

        {/* 10 Step Interactive Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {custSteps.map((step, idx) => {
            const isCompleted = step.checkCompleted();
            return (
              <button
                key={idx}
                onClick={step.action}
                className={`p-2.5 rounded-xl text-left transition duration-200 relative overflow-hidden flex flex-col justify-between group min-h-[92px] border cursor-pointer ${
                  isCompleted 
                    ? 'bg-emerald-950/40 border-emerald-500/85 text-emerald-200' 
                    : 'bg-black/20 border-gray-800 text-gray-400 hover:bg-black/30 hover:text-white hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start w-full gap-1">
                  <span className="font-mono text-[9px] font-bold text-teal-400 group-hover:text-teal-300 transition">
                    {step.num}
                  </span>
                  <span className={`text-[10px] ${isCompleted ? 'text-emerald-400' : 'text-gray-600'}`}>
                    {isCompleted ? '✓' : '○'}
                  </span>
                </div>
                <div>
                  <h4 className="font-sans font-bold text-[10.5px] leading-tight text-white line-clamp-2 mt-1">
                    {step.title}
                  </h4>
                  <span className="text-[8.5px] text-gray-500 block font-mono mt-0.5 group-hover:text-teal-400 transition shrink-0">
                    {step.sub}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="customer-view">
      {/* Mobile-Viewport Frame Side Panel (Left 7 Columns) */}
      <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[720px]">
        
        {/* Device/App Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white p-5 pr-6 relative">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></span>
              <h2 className="font-display font-semibold tracking-tight text-white text-xl">DairyFresh Retail</h2>
            </div>
            <div className="flex items-center gap-2.5">
              {/* Profile/Auth Selector Portal Button */}
              <button 
                onClick={() => setShowProfileModal(true)}
                className="bg-white/10 hover:bg-white/20 transition px-2.5 py-1.5 rounded-full flex items-center gap-1 text-[11px] font-sans font-bold cursor-pointer"
                title="Google, Facebook & Phone logins"
                id="profile-hud-trigger"
              >
                <User className="w-3.5 h-3.5 text-cyan-200" />
                <span className="max-w-[80px] truncate">{currentCustomerName}</span>
              </button>

              {/* Wallet Pill */}
              <div 
                onClick={() => setActiveTab('wallet')}
                className="bg-white/15 hover:bg-white/25 transition cursor-pointer text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-mono"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>₹{walletBalance.toFixed(0)}</span>
              </div>
              {/* Cart Pill */}
              <button 
                onClick={() => setShowCart(true)}
                className="bg-white text-teal-700 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 transition"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-teal-600" />
                <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
              </button>
            </div>
          </div>

          {/* Location Bar with Multiple Saved Addresses and GPS (1.2) */}
          <div className="bg-black/15 p-3 rounded-xl text-xs mt-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-cyan-100 border-b border-white/15 pb-1.5">
              <span>📍 SAVED SHIFT ADDRESS & GPS DETECTOR</span>
              <button 
                onClick={handleGpsDetect} 
                className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 rounded flex items-center gap-0.5 text-white transition font-mono border border-cyan-400"
                disabled={gpsLoading}
              >
                <RefreshCw className={`w-2.5 h-2.5 ${gpsLoading ? 'animate-spin':''}`} />
                {gpsLoading ? 'GPS Ping...':'Detect GPS'}
              </button>
            </div>

            {gpsLoading && (
              <div className="animate-pulse text-[10px] text-cyan-200 bg-black/10 p-1.5 rounded font-mono">
                🛰️ SAT-TEC PINGING: Sector 56 Metro coordinate locking system initialized...
              </div>
            )}

            <div className="grid grid-cols-3 gap-1 pt-1">
              {['Home', 'Office', 'Other'].map((typeStr, idx) => (
                <button
                  key={typeStr}
                  onClick={() => {
                    setAddressType(typeStr.toLowerCase() as any);
                    setAddressIndex(idx);
                    if (idx < savedAddresses.length) {
                      setDetectedAddress(savedAddresses[idx]);
                    }
                  }}
                  className={`py-1 text-center font-semibold rounded shrink-0 transition text-[10px] ${
                    addressType === typeStr.toLowerCase() 
                      ? 'bg-white text-teal-800 shadow-xs' 
                      : 'bg-black/10 hover:bg-black/15 text-white/80'
                  }`}
                >
                  {typeStr === 'Home' ? '🏠 Home' : typeStr === 'Office' ? '🏢 Office' : '📍 Other'}
                </button>
              ))}
            </div>

            <div className="pt-1 flex flex-col gap-1.5">
              <div className="text-[11px] text-white/90 bg-black/15 p-2 rounded-lg leading-relaxed flex items-start gap-1 justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-200 block">Deliver Location Details:</span>
                  <p className="font-semibold">{addressType === 'other' ? (customAddressInput || 'Type address details below...') : detectedAddress}</p>
                </div>
              </div>

              {addressType === 'other' && (
                <div className="space-y-1">
                  <input 
                    type="text" 
                    value={customAddressInput}
                    onChange={(e) => {
                      setCustomAddressInput(e.target.value);
                      // Sync to saved address list under other
                      setSavedAddresses(prev => {
                        const copy = [...prev];
                        copy[2] = e.target.value;
                        return copy;
                      });
                    }}
                    placeholder="Enter custom landmark, house number, or city..." 
                    className="w-full bg-white/15 text-white placeholder-white/50 border border-white/20 rounded-md py-1.5 px-2 text-xs focus:outline-hidden focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 font-sans"
                    id="custom-address-field"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Tab Bar Wrapper */}
        <div className="flex border-b border-gray-100 text-sm font-medium">
          <button 
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-3 text-center border-b-2 transition ${activeTab === 'browse' ? 'border-teal-600 text-teal-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Browse Fresh
          </button>
          <button 
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 py-3 text-center border-b-2 transition relative ${activeTab === 'subscriptions' ? 'border-teal-600 text-teal-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Milk Subscriptions
            {subscriptions.length > 0 && (
              <span className="absolute top-2 right-4 w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-3 text-center border-b-2 transition ${activeTab === 'wallet' ? 'border-teal-600 text-teal-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Milk Wallet
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center border-b-2 transition ${activeTab === 'orders' ? 'border-teal-600 text-teal-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            My Orders
          </button>
        </div>

        {/* Dynamic Display */}
        <div className="flex-1 p-5 overflow-y-auto max-h-[580px]">
          
          {/* TAB 1: BROWSE INVENTORY */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              {/* Search Bars */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search fresh raw milk, curd, heavy ghee..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-20 py-2.5 rounded-xl border border-gray-100 shadow-xs focus:ring-1 focus:ring-teal-500 text-sm focus:outline-hidden"
                  />
                  <div className="absolute right-2 top-2 flex items-center gap-0.5">
                    <button 
                      onClick={triggerBarcodeScanner}
                      className={`p-1.5 rounded-lg transition ${barcodeScanning ? 'bg-indigo-100 text-indigo-600 animate-pulse':'text-gray-400 hover:bg-gray-50'}`}
                      title="Barcode Search Simulator"
                      id="barcode-search-btn"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={triggerVoiceSearch}
                      className={`p-1.5 rounded-lg transition ${voiceSimulating ? 'bg-red-100 text-red-600 animate-pulse':'text-gray-400 hover:bg-gray-50'}`}
                      title="Simulate Voice Search"
                      id="voice-search-btn"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Laser Barcode Alignment Guide */}
                {barcodeScanning && (
                  <div className="border border-dashed border-indigo-200 bg-indigo-50/20 rounded-2xl p-4 text-center animate-pulse flex flex-col items-center justify-center gap-2">
                    <div className="relative w-48 h-8 rounded border border-indigo-200 overflow-hidden bg-slate-900 shadow-inner">
                      {/* Flashing Laser Beam line */}
                      <div className="absolute inset-x-0 w-full h-[2px] bg-red-500 top-1/2 -translate-y-1/2 shadow-md animate-pulse"></div>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-indigo-800">Scanning carton barcode... Matching inventory codes</span>
                  </div>
                )}

                {/* AI Search Assistant Drawer */}
                <div className="bg-gradient-to-br from-indigo-50/70 to-teal-50/70 border border-indigo-100/50 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-display font-medium text-xs mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                    <span>AI Dairy Diet Planner & Catalog Search</span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. 'high protein calcium diet' or 'recipe for thick curd'"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && executeAiSearch()}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200/60 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-400 bg-white"
                    />
                    <button 
                      onClick={executeAiSearch}
                      disabled={aiLoading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition shrink-0 flex items-center gap-1 disabled:opacity-50"
                    >
                      {aiLoading ? <RefreshCw className="w-3 h-3 animate-spin"/> : 'Ask AI'}
                    </button>
                  </div>

                  {aiResponse && (
                    <div className="mt-3 bg-white border border-indigo-100 rounded-xl p-3 text-xs space-y-2">
                      <p className="text-gray-700 leading-relaxed font-sans">{aiResponse}</p>
                      
                      {aiRecommendedIds.length > 0 && (
                        <div>
                          <div className="text-[10px] text-indigo-500 font-semibold mb-1 uppercase tracking-wider">AI Suggestions from Stock:</div>
                          <div className="flex flex-wrap gap-1">
                            {products.filter(p => aiRecommendedIds.includes(p.id)).map(p => (
                              <button 
                                key={p.id}
                                onClick={() => { setSelectedProduct(p); }}
                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded text-[11px] flex items-center gap-1"
                              >
                                {p.name}
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Categorization chips */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition shrink-0 ${selectedCategory === cat ? 'bg-teal-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid dynamic products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((p) => (
                  <div 
                    key={p.id} 
                    className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col group relative"
                  >
                    {p.isPopular && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white font-display font-medium text-[10px] uppercase px-2 py-0.5 rounded-full z-10 shadow-sm flex items-center gap-0.5">
                        <Award className="w-2.5 h-2.5" /> Popular
                      </span>
                    )}

                    <div className="h-44 bg-gray-50 relative overflow-hidden">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                        referrerPolicy="no-referrer"
                      />
                      {/* Heart Button for Wishlist */}
                      <button 
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-xs transition z-10 hover:scale-110"
                        title={wishlist.includes(p.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        id={`wishlist-heart-${p.id}`}
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors duration-200 ${wishlist.includes(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                      </button>

                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-3">
                        <div>
                          <div className="text-[10px] text-teal-300 font-bold uppercase tracking-widest">{p.category}</div>
                          <h3 className="font-display font-bold text-white text-sm line-clamp-1">{p.name}</h3>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
                      
                      {/* Dairy Specific Specs */}
                      <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-lg text-[10px] text-gray-500 font-mono">
                        <div>Fat %: <span className="font-bold text-teal-700">{p.fatPercentage}%</span></div>
                        <div>SNF %: <span className="font-bold text-teal-700">{p.snfPercentage}%</span></div>
                        <div className="col-span-2 truncate">Source: <span className="text-gray-700">{p.farmName}</span></div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <span className="text-teal-700 font-bold text-md font-mono">₹{p.price}</span>
                          <span className="text-gray-400 text-[10px] font-mono"> / {p.unit}</span>
                        </div>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => setSelectedProduct(p)}
                            className="px-2.5 py-1.5 border border-teal-200 text-teal-700 rounded-lg hover:bg-teal-50 text-[11px] font-medium transition"
                          >
                            Specs
                          </button>
                          <button 
                            onClick={() => addToCart(p)}
                            className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MILK SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <h3 className="font-display font-semibold text-teal-900 text-sm">Monthly Milk Plans</h3>
                  <p className="text-xs text-gray-600">Secure fresh milking daily morning home deliveries</p>
                </div>
                <button 
                  onClick={() => setIsSubscribing(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Subscribe
                </button>
              </div>

              {/* Add New Subscription Form Modal Overlay if active */}
              {isSubscribing && (
                <form onSubmit={handleSubscribeSubmit} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h4 className="font-display font-bold text-gray-800 text-xs">Setup New Milk Plan</h4>
                    <button type="button" onClick={() => setIsSubscribing(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Select Daily Plan Volume</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['500ml', '1L', '2L'] as const).map((plan) => (
                        <button
                          key={plan}
                          type="button"
                          onClick={() => setSubPlan(plan)}
                          className={`py-2 px-1 text-center font-mono rounded-lg border text-xs leading-tight transition ${subPlan === plan ? 'border-teal-500 bg-teal-50 text-teal-800 font-semibold':'border-gray-200 bg-white text-gray-600'}`}
                        >
                          {plan} <span className="block text-[10px] text-gray-400 font-normal">Daily</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Frequency Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['daily', 'alternate', 'weekly'] as const).map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setSubFreq(freq)}
                          className={`py-1.5 rounded-lg border text-xs capitalize transition ${subFreq === freq ? 'border-teal-500 bg-teal-50 text-teal-800 font-semibold':'border-gray-200 bg-white text-gray-600'}`}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Preferred Delivery Slot</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['morning', 'evening'] as const).map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSubDeliverySlot(slot)}
                          className={`py-1.5 rounded-lg border text-xs capitalize transition ${subDeliverySlot === slot ? 'border-teal-500 bg-teal-50 text-teal-800 font-semibold':'border-gray-200 bg-white text-gray-600'}`}
                        >
                          {slot === 'morning' ? '⛅ Morning (6 AM - 8 AM)' : '🌙 Evening (6 PM - 8 PM)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-teal-50/50 p-2.5 rounded-xl text-[11px] text-teal-800 font-mono">
                    Plan rate: <span className="font-bold">₹{subPlan === '500ml' ? '35' : subPlan === '1L' ? '70' : '135'}/Day</span> automatically debited from Milk Wallet.
                  </div>

                  <div className="flex gap-2">
                    <button type="button" onClick={() => setIsSubscribing(false)} className="flex-1 bg-white border border-gray-200 py-1.5 rounded-lg text-xs font-semibold text-gray-600">Cancel</button>
                    <button type="submit" className="flex-1 bg-teal-600 text-white font-semibold py-1.5 rounded-lg text-xs hover:bg-teal-700 transition">Activate Plan</button>
                  </div>
                </form>
              )}

              {/* Active Plan List */}
              <div className="space-y-4">
                <h4 className="font-display font-semibold text-gray-800 text-xs">Your Subscriptions</h4>
                {subscriptions.length === 0 ? (
                  <p className="text-gray-400 text-xs text-center py-4">No active milk subscription plans found.</p>
                ) : (
                  subscriptions.map((sub) => (
                    <div key={sub.id} className="border border-gray-100 rounded-2xl p-4 bg-white shadow-xs relative overflow-hidden">
                      {sub.status === 'paused' && (
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-3 py-0.5 rounded-bl">VACATION PAUSED</div>
                      )}

                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] text-teal-600 font-bold uppercase tracking-widest font-mono">
                            Frequency: {sub.frequency} | Slot: {subDeliverySlot === 'morning' ? '⛅ Morning (6 AM - 8 AM)' : '🌙 Evening (6 PM - 8 PM)'}
                          </div>
                          <h4 className="font-display font-bold text-gray-800 text-sm">Fresh Organic Cow Milk ({sub.planType})</h4>
                          <p className="text-[10px] text-gray-400 font-mono">Started on {sub.startDate}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-gray-700 font-bold text-sm">₹{sub.pricePerDay}</span>
                          <span className="text-gray-400 text-[10px]">/day</span>
                        </div>
                      </div>

                      {/* Vacation schedule summaries */}
                      {sub.status === 'paused' && sub.vacationStart && (
                        <p className="bg-amber-50 p-2 rounded-lg text-[10px] text-amber-800 font-mono mt-3">
                          Suspended dates: <span className="font-bold">{sub.vacationStart}</span> to <span className="font-bold">{sub.vacationEnd}</span>.
                        </p>
                      )}

                      {sub.tempQuantityChange && (
                        <p className="bg-cyan-50 p-2 rounded-lg text-[10px] text-cyan-800 font-mono mt-3">
                          Temp Adjust: <span className="font-bold">{sub.tempQuantityChange} units</span> active till tomorrow morning!
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => { setActivePauseId(activePauseId === sub.id ? null : sub.id); setTempQtyId(null); }}
                          className="flex-1 py-1 px-1.5 text-center text-[10px] font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
                        >
                          Vacation Pause
                        </button>
                        <button 
                          onClick={() => { setTempQtyId(tempQtyId === sub.id ? null : sub.id); setActivePauseId(null); }}
                          className="flex-1 py-1 px-1.5 text-center text-[10px] font-semibold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition"
                        >
                          Change Quantity
                        </button>
                      </div>

                      {/* Toggle vacation popup pane */}
                      {activePauseId === sub.id && (
                        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl mt-3 space-y-2">
                          <h5 className="font-display font-bold text-amber-900 text-[10px]">Pause dates (No milking debit):</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[9px] text-amber-700">Start Date</span>
                              <input 
                                type="date" 
                                value={vacStart}
                                onChange={(e) => setVacStart(e.target.value)}
                                className="w-full bg-white border border-amber-200 text-xs p-1 rounded font-mono"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] text-amber-700">End Date</span>
                              <input 
                                type="date" 
                                value={vacEnd}
                                onChange={(e) => setVacEnd(e.target.value)}
                                className="w-full bg-white border border-amber-200 text-xs p-1 rounded font-mono"
                              />
                            </div>
                          </div>
                          <button 
                            onClick={() => executeVacationPause(sub.id)}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] py-1 px-2.5 rounded transition"
                          >
                            Save Vacation dates
                          </button>
                        </div>
                      )}

                      {/* Toggle Temporary quantity adjustment */}
                      {tempQtyId === sub.id && (
                        <div className="bg-cyan-50 border border-cyan-100 p-3 rounded-xl mt-3 space-y-2">
                          <h5 className="font-display font-bold text-cyan-900 text-[10px]">Alter Volume Temporarily (For guests/cooking):</h5>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-cyan-700">Set tomorrow's packets:</span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setTempQtyVal(Math.max(1, tempQtyVal - 1))}
                                className="w-6 h-6 bg-white border border-cyan-200 flex items-center justify-center text-xs text-cyan-700 rounded-full"
                              >
                                -
                              </button>
                              <span className="font-mono text-sm text-cyan-900 font-bold">{tempQtyVal}</span>
                              <button 
                                onClick={() => setTempQtyVal(tempQtyVal + 1)}
                                className="w-6 h-6 bg-white border border-cyan-200 flex items-center justify-center text-xs text-cyan-700 rounded-full"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button 
                            onClick={() => executeTempQty(sub.id)}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[10px] py-1 px-2.5 rounded transition"
                          >
                            Apply Temp Qty
                          </button>
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MILK WALLET ENGINE */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              {/* Wallet Hero */}
              <div className="bg-gradient-to-br from-slate-800 to-teal-900 text-white p-5 rounded-2xl shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                  <Wallet className="w-40 h-40" />
                </div>
                
                <div>
                  <span className="text-[10px] text-teal-300 font-medium tracking-wider uppercase">Smart Milk balance</span>
                  <div className="font-mono font-extrabold text-3xl text-white">₹{walletBalance.toFixed(2)}</div>
                </div>

                <p className="text-[11px] text-teal-100">Maintain balance. Milk deductions process automatically daily at 06:00 AM.</p>

                <div className="pt-2">
                  <span className="block text-[10px] text-teal-300 font-bold mb-1 uppercase tracking-wider">Quick top up</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2000].map(amt => (
                      <button 
                        key={amt}
                        onClick={() => addWalletFunds(amt)}
                        className="bg-white/10 hover:bg-white/25 text-white py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-0.5"
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Transactions logs */}
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-gray-800 text-xs">Wallet Ledgers</h4>
                <div className="space-y-2">
                  {walletTransactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                      <div>
                        <p className="text-xs font-bold text-gray-800">{tx.description}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{tx.timestamp}</p>
                      </div>
                      <span className={`font-mono text-sm font-bold ${tx.type === 'deposit' ? 'text-green-600': 'text-red-500'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RETRIEVAL ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.filter(o => o.customerId === 'cust_user').length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-8">You haven't placed any retail orders yet.</p>
              ) : (
                orders.filter(o => o.customerId === 'cust_user').map((ord) => {
                  const currentProgIndex = getOrderStatusProgressIndex(ord.id, ord.status);
                  const isDelivered = ord.status === 'delivered';
                  
                  return (
                    <div key={ord.id} className="border border-indigo-100 rounded-2xl p-4 bg-white space-y-4 shadow-xs relative overflow-hidden text-xs">
                      
                      {/* Celebration Overlay for OTP match (1.11 Details) */}
                      {showConfettiForOrder === ord.id && (
                        <div className="absolute inset-0 bg-teal-600/95 backdrop-blur-xs text-white z-20 flex flex-col items-center justify-center text-center p-4 animate-in fade-in duration-300">
                          <span className="text-3xl">🎉✨🥛</span>
                          <h4 className="font-display font-extrabold text-white text-sm mb-1">Delivered & Verified securely!</h4>
                          <p className="text-[10px] text-teal-100">Your fresh raw dairy bottle arrived safe in sub-zero cold bags. Loyalty Stars point balance updated!</p>
                          <button
                            onClick={() => setShowConfettiForOrder(null)}
                            className="mt-3 bg-white text-teal-700 font-bold px-3 py-1 rounded text-[10px] cursor-pointer"
                          >
                            Nice!
                          </button>
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex justify-between items-start border-b border-gray-50 pb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-gray-700">{ord.id}</span>
                            <span className="text-[9px] bg-slate-100 px-1.5 rounded uppercase font-bold text-gray-500">{ord.deliveryOption} Mode</span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">Checked out: {ord.date}</div>
                        </div>
                        
                        {/* Status Label (1.10 Tracker Steps) */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          isDelivered ? 'bg-green-100 text-green-700' :
                          ord.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700 animate-pulse'
                        }`}>
                          {getSimulatedStatusLabel(currentProgIndex)}
                        </span>
                      </div>

                      {/* Six Transit Progress steps list (1.10 Tracking Checklist) */}
                      {!isDelivered && ord.status !== 'rejected' && (
                        <div className="bg-slate-50 border border-slate-100/60 p-2.5 rounded-xl space-y-2">
                          <div className="flex justify-between items-center text-[10px] text-indigo-950 font-bold border-b border-gray-100 pb-1">
                            <span>🚀 LIVE TRUCK PROGRESS:</span>
                            <span className="text-[9.5px] font-mono text-indigo-600">Step {currentProgIndex}/6</span>
                          </div>
                          <div className="flex items-center justify-between w-full relative pt-2 pb-1 text-[8px] text-gray-400 font-mono">
                            {/* Horizontal Line background */}
                            <div className="absolute top-4 left-4 right-4 h-[2px] bg-gray-200 -z-1"></div>
                            <div className="absolute top-4 left-4 h-[2px] bg-teal-500 -z-1 transition-all duration-300" style={{ width: `${(currentProgIndex / 6) * 90}%` }}></div>

                            {['Accepted', 'Packed', 'Pickup', 'Rider', 'Out', 'Arrived'].map((term, i) => {
                              const isActive = currentProgIndex >= i + 1;
                              return (
                                <div key={term} className="flex flex-col items-center gap-1 bg-transparent">
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                    currentProgIndex === i + 1 ? 'bg-cyan-500 text-white animate-bounce' :
                                    isActive ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
                                  }`}>
                                    {isActive ? '✓' : i + 1}
                                  </div>
                                  <span className={isActive ? 'text-teal-700 font-bold':'text-gray-400'}>{term}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Trigger simulated Route advancements */}
                          <div className="pt-1.5 flex gap-1.5">
                            <button
                              onClick={() => {
                                advanceOrderProgress(ord.id, currentProgIndex);
                              }}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[10px] py-1 rounded transition text-center flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>📈 Advance Rider Transit</span>
                              <ChevronRight className="w-3 h-3 animate-ping" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* OTP Locks Screen Verification (1.11 Verification checklists) */}
                      {ord.status === 'out_for_delivery' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
                          <span className="text-[10px] text-amber-800 font-mono font-bold block uppercase tracking-widest">⚠️ DELIVERY OTP MANDATORY LOCK</span>
                          <p className="text-[11px] text-gray-600 leading-tight">Driver is waiting at door. Enter OTP Code: <strong className="font-mono text-amber-800 bg-white px-1.5 rounded">{ord.deliveryOtp}</strong> to verify fresh sub-zero sealing bags.</p>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={enteredOrderOtp[ord.id] || ''}
                              onChange={(e) => setEnteredOrderOtp(prev => ({ ...prev, [ord.id]: e.target.value }))}
                              placeholder="Enter 4-Digit OTP"
                              className="bg-white border text-center border-amber-300 rounded font-mono text-xs w-28 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                            />
                            <button
                              onClick={() => {
                                const inputVal = enteredOrderOtp[ord.id] || '';
                                if (inputVal === ord.deliveryOtp) {
                                  // Verified! Set status delivered
                                  updateOrderStatus(ord.id, 'delivered', 'dp1');
                                  setShowConfettiForOrder(ord.id);
                                } else {
                                  alert('Incorrect OTP provided. Verify locking code and retry.');
                                }
                              }}
                              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-1 rounded transition text-center cursor-pointer"
                            >
                              Confirm OTP & Receive
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Farm to Home static details card */}
                      <div className="bg-gray-50/70 p-3 rounded-2xl space-y-3">
                        <div className="text-[11px] font-display font-medium text-teal-800 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-teal-600" />
                          <span>Quality Certificate (Processed Under 4°C)</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-[9px] text-center font-mono">
                          <div className="bg-white p-1 rounded border border-gray-100">
                            <span className="block text-gray-400">Milking</span>
                            <span className="font-bold text-teal-700">{ord.milkingDetails.milkingTime}</span>
                          </div>
                          <div className="bg-white p-1 rounded border border-gray-100">
                            <span className="block text-gray-400">Packing</span>
                            <span className="font-bold text-teal-700">{ord.milkingDetails.processingTime}</span>
                          </div>
                          <div className="bg-white p-1 rounded border border-gray-100">
                            <span className="block text-gray-400">Dispatched</span>
                            <span className="font-bold text-teal-700">{ord.milkingDetails.dispatchTime}</span>
                          </div>
                          <div className="bg-white p-1 rounded border border-amber-300">
                            <span className="block text-gray-400">Arrived</span>
                            <span className="font-bold text-amber-700">{ord.milkingDetails.deliveryTime || 'In-transit'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Products list summary */}
                      <div className="space-y-1.5 text-xs text-gray-600">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.product.name} <strong className="text-gray-400 font-normal">x{item.quantity}</strong></span>
                            <span className="font-mono">₹{item.product.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 pt-1.5 text-sm">
                          <span>Total Paid</span>
                          <span className="font-mono text-teal-700">₹{ord.total}</span>
                        </div>
                      </div>

                      {/* delivered reorder, rating or OTP instructions */}
                      {ord.status === 'delivered' && (
                        <div className="pt-2 border-t border-gray-50 flex items-center gap-2 justify-between">
                          <span className="text-[10px] text-green-600 font-bold font-mono">✓ Triple Sealed & Delivered</span>
                          {/* 1.13 REORDER BUTTON */}
                          <button
                            onClick={() => {
                              // Auto-repopulate checkout basin with original order items (1.13)
                              setCart(ord.items.map(i => ({ product: i.product, quantity: i.quantity })));
                              setShowCart(true);
                              alert(`Order ${ord.id} items moved instantly to checkout. Basket details updated!`);
                            }}
                            className="bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 font-bold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 transition shrink-0 cursor-pointer"
                          >
                            🔁 Buy Again / Reorder
                          </button>
                        </div>
                      )}

                      {/* Rating & reviews implementation */}
                      {ord.status === 'delivered' && !ord.feedbackRating && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 space-y-2">
                          <p className="text-xs font-bold text-indigo-900">How was your fresh milk quality today?</p>
                          <div className="flex gap-2 items-center">
                            {[1, 2, 3, 4, 5].map((starVal) => (
                              <button 
                                key={starVal} 
                                onClick={() => { setFeedbackOrderId(ord.id); setFeedbackRating(starVal); }}
                                className="p-1"
                              >
                                <Star className={`w-5 h-5 ${feedbackOrderId === ord.id && feedbackRating >= starVal ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                              </button>
                            ))}
                          </div>
                          {feedbackOrderId === ord.id && (
                            <div className="space-y-2">
                              <textarea 
                                placeholder="FSSAI standard packaging feedback..."
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                className="w-full bg-white border border-indigo-200 text-xs p-2 rounded-lg"
                              />
                              <button 
                                onClick={() => {
                                  submitFeedback(ord.id, feedbackRating, feedbackComment);
                                  setFeedbackOrderId(null);
                                  setFeedbackComment('');
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1 px-3 rounded-lg transition"
                              >
                                Post Quality Review
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {ord.feedbackRating && (
                        <div className="bg-gray-50 p-2.5 rounded-xl text-xs space-y-1">
                          <div className="flex items-center gap-1 font-semibold text-gray-700">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>Rated ({ord.feedbackRating}/5)</span>
                          </div>
                          <p className="text-gray-500 italic">"{ord.feedbackReview}"</p>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>
      </div>

      {/* Cart Drawer Panel & Support Box (Right 4 Columns) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Dynamic Cart Summary Block */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
            <h3 className="font-display font-semibold text-gray-800 text-sm flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-teal-600" /> Checkout Basket
            </h3>
            <span className="bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-md text-[10px] font-mono">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-gray-400 text-xs">Your basket feels incredibly light.</p>
              <button 
                onClick={() => { setActiveTab('browse'); }}
                className="text-teal-600 font-semibold text-xs hover:underline flex items-center gap-0.5 mx-auto"
              >
                Browse Dairy items <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="border-b border-gray-50/50 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex justify-between text-xs text-gray-500 items-center">
                      <span className="font-medium text-gray-800 truncate pr-2 flex-1">{item.product.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button onClick={() => updateCartQty(item.product.id, item.quantity - 1)} className="px-1.5 py-0.5 text-gray-500">-</button>
                          <span className="px-1.5 font-bold font-mono text-gray-800">{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.product.id, item.quantity + 1)} className="px-1.5 py-0.5 text-gray-500">+</button>
                        </div>
                        <span className="font-mono text-gray-700 font-bold w-12 text-right">₹{item.product.price * item.quantity}</span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-1">
                      <button 
                        onClick={() => moveToSaveForLater(item.product.id)}
                        className="text-[9px] text-teal-600 hover:underline font-bold font-mono"
                      >
                        Save for Later
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 1.8 Delivery & Checkout Options */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <span className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider">Choose Delivery Mode</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'instant', label: '⚡ Instant', desc: 'Under 15 mins' },
                    { id: 'scheduled', label: '📅 Slot Shift', desc: 'Choose timing' },
                    { id: 'subscription', label: '🥛 Sub Daily', desc: 'Morning/Night' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setDeliveryTypeOption(opt.id as any)}
                      className={`py-1.5 px-1 border rounded-lg text-center transition flex flex-col justify-center items-center cursor-pointer ${
                        deliveryTypeOption === opt.id 
                          ? 'bg-teal-50 border-teal-500 text-teal-700 font-bold' 
                          : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="text-[10px]">{opt.label}</span>
                      <span className="text-[8px] text-gray-400 font-normal">{opt.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Scheduled Slot picker details */}
                {deliveryTypeOption === 'scheduled' && (
                  <div className="bg-cyan-50/50 p-2 border border-cyan-100 rounded-lg space-y-1.5 animate-in slide-in-from-top-1 duration-150">
                    <span className="text-[9px] text-cyan-800 font-bold font-mono">Select Delivery Shift:</span>
                    <select
                      value={scheduledSlotChosen}
                      onChange={(e) => setScheduledSlotChosen(e.target.value)}
                      className="w-full bg-white border border-cyan-200 text-[10px] rounded p-1"
                    >
                      <option value="Morning (06:00 AM - 08:00 AM)">Morning Delivery (06:00 AM - 08:00 AM)</option>
                      <option value="Noon (11:30 AM - 01:30 PM)">Noon Shift (11:30 AM - 01:30 PM)</option>
                      <option value="Evening (06:00 PM - 08:59 PM)">Evening Delivery (06:00 PM - 08:59 PM)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 1.14 Loyalty stars program dashboard rules */}
              <div className="bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100/50 space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-indigo-950 font-bold flex items-center gap-1 font-sans">
                    ✨ Loyalty Point Balance:
                  </span>
                  <span className="bg-indigo-600 text-white font-bold font-mono px-1.5 rounded-sm">
                    {loyaltyPointsBalance} Stars
                  </span>
                </div>
                {loyaltyPointsBalance > 0 && (
                  <label className="flex items-center gap-1.5 text-[10px] text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyLoyaltyPoints}
                      onChange={(e) => setApplyLoyaltyPoints(e.target.checked)}
                      className="rounded text-teal-600 border-indigo-300 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Apply Loyalty Stars (Save up to 30% off bill!)</span>
                  </label>
                )}
                {applyLoyaltyPoints && (
                  <span className="text-[9px] text-indigo-700 block italic leading-none font-mono">
                    ✓ Applied {Math.min(loyaltyPointsBalance, Math.floor(cart.reduce((s, i) => s + (i.product.price * i.quantity), 0) * 0.3))} Stars discount.
                  </span>
                )}
              </div>

              {/* Interactive Coupon Code Selector */}
              <div className="space-y-1.5 border-t border-gray-100 pt-3">
                <span className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3 text-teal-600" /> Apply Corporate Coupons
                </span>
                
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={checkoutCouponCode}
                    onChange={(e) => setCheckoutCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter DAIRY20 or FRESHMILK"
                    className="flex-1 bg-gray-50 border border-gray-200 text-xs rounded-lg p-1.5 focus:outline-hidden font-mono uppercase font-bold"
                  />
                  {checkoutCouponCode && (
                    <button
                      type="button"
                      onClick={() => setCheckoutCouponCode('')}
                      className="px-2 text-xs bg-gray-100 border rounded-lg hover:text-red-500 font-bold transition cursor-pointer"
                    >
                      ✖
                    </button>
                  )}
                </div>

                <div className="flex gap-1.5 flex-wrap pt-0.5">
                  <button
                    type="button"
                    onClick={() => setCheckoutCouponCode('DAIRY20')}
                    className={`text-[9px] px-2 py-0.5 border rounded-full font-mono transition cursor-pointer ${
                      checkoutCouponCode === 'DAIRY20' ? 'bg-teal-600 text-white border-teal-600 font-bold' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    DAIRY20 (₹20 Off)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutCouponCode('FRESHMILK')}
                    className={`text-[9px] px-2 py-0.5 border rounded-full font-mono transition cursor-pointer ${
                      checkoutCouponCode === 'FRESHMILK' ? 'bg-teal-600 text-white border-teal-600 font-bold' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    FRESHMILK (10% Off)
                  </button>
                </div>
              </div>

              {/* Subtotal and Realtime Total recalculations */}
              {(() => {
                const subTotalSum = cart.reduce((s, i) => s + (i.product.price * i.quantity), 0);
                
                // Calculate Coupon reductions
                let couponReduction = 0;
                if (checkoutCouponCode === 'DAIRY20' && subTotalSum >= 200) {
                  couponReduction = 20;
                } else if (checkoutCouponCode === 'FRESHMILK' && subTotalSum >= 500) {
                  couponReduction = Math.round(subTotalSum * 0.1);
                }

                const afterCouponVal = Math.max(0, subTotalSum - couponReduction);
                const appliedDiscountVal = applyLoyaltyPoints ? Math.min(loyaltyPointsBalance, Math.floor(afterCouponVal * 0.3)) : 0;
                const grandTotalWithDiscount = Math.max(0, afterCouponVal - appliedDiscountVal);

                return (
                  <div className="border-t border-gray-100 pt-3 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-mono">₹{subTotalSum}</span>
                    </div>
                    {couponReduction > 0 && (
                      <div className="flex justify-between text-xs text-teal-600 font-bold">
                        <span>Coupon Discount ({checkoutCouponCode})</span>
                        <span className="font-mono">-₹{couponReduction}</span>
                      </div>
                    )}
                    {appliedDiscountVal > 0 && (
                      <div className="flex justify-between text-xs text-indigo-600 font-bold">
                        <span>Loyalty Discount</span>
                        <span className="font-mono">-₹{appliedDiscountVal}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Delivery Charge</span>
                      <span className="font-mono text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-800 border-t border-gray-50 pt-1.5">
                      <span>Grand Total</span>
                      <span className="font-mono text-teal-700">₹{grandTotalWithDiscount}</span>
                    </div>
                  </div>
                );
              })()}

              {/* 1.9 Multi-option Payment Gateway Portal tabs */}
              <div className="space-y-2 pt-2 border-t border-gray-50">
                <span className="block text-[10px] text-gray-400 uppercase font-mono tracking-wider">Unified Payment Gateway</span>
                
                <div className="grid grid-cols-5 gap-0.5 bg-gray-100 p-0.5 rounded-lg text-[9px] font-sans font-bold text-gray-500">
                  {['wallet', 'upi', 'qr', 'card', 'cod'].map(tabId => (
                    <button
                      key={tabId}
                      onClick={() => {
                        setActivePaymentTab(tabId as any);
                        // Sync with main setPaymentMethod
                        setPaymentMethod(tabId as any);
                      }}
                      className={`py-1 text-center rounded uppercase shrink-0 transition ${
                        activePaymentTab === tabId ? 'bg-white text-teal-700' : 'hover:bg-white/50 text-gray-400'
                      }`}
                    >
                      {tabId}
                    </button>
                  ))}
                </div>

                {/* Tab Contents */}
                {activePaymentTab === 'wallet' && (
                  <div className="bg-gray-50/50 p-2 rounded-lg border border-gray-100 space-y-1.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Smart Milk balance:</span>
                      <strong className="font-mono text-teal-700">₹{walletBalance.toFixed(2)}</strong>
                    </div>
                    <span className="text-[9px] text-gray-400 block leading-tight">Deducted automatically. Refills of ₹500, ₹1000 earn supplemental bonus logs.</span>
                  </div>
                )}

                {activePaymentTab === 'upi' && (
                  <div className="bg-gray-50/50 p-2 rounded-lg border border-gray-100 space-y-1.5">
                    <span className="text-[9.5px] text-gray-500 font-bold block">Enter Virtual UPI Handle:</span>
                    <input
                      type="text"
                      placeholder="e.g. customer@okhdfcbank"
                      value={typedUpiId}
                      onChange={(e) => setTypedUpiId(e.target.value)}
                      className="w-full bg-white border border-gray-200 p-1 rounded font-mono text-[10px] focus:outline-hidden"
                    />
                    <p className="text-[8.5px] text-gray-400 italic font-mono leading-none">Sends instant approval notification request to standard smartphone app.</p>
                  </div>
                )}

                {activePaymentTab === 'qr' && (
                  <div className="bg-gray-50/60 p-2 rounded-lg border border-gray-100 flex flex-col items-center justify-center space-y-1.5">
                    <span className="text-[9px] text-gray-500 font-bold text-center block">UPI QR CODE GATEWAY:</span>
                    <div className="bg-white p-2.5 rounded-lg border border-cyan-150 shadow-xs relative">
                      {/* Pulse Overlay Vector simulating QR */}
                      <div className={`w-14 h-14 bg-slate-900 rounded flex flex-col items-center justify-center p-1 text-white select-none ${qrPulsing ? 'animate-pulse scale-102 border-2 border-teal-500':''}`}>
                        <div className="grid grid-cols-2 gap-1 w-full h-full opacity-60">
                          <div className="border border-white"></div>
                          <div className="bg-white"></div>
                          <div className="bg-white"></div>
                          <div className="border border-white"></div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setQrPulsing(true);
                        setTimeout(() => {
                          setQrPulsing(false);
                          alert('Secure QR Code read succeeded! Redirecting authorization...');
                        }, 1200);
                      }}
                      className="text-[9px] bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-0.5 px-2.5 rounded font-sans transition animate-bounce cursor-pointer"
                    >
                      💸 Simulate Scan QR Code
                    </button>
                  </div>
                )}

                {activePaymentTab === 'card' && (
                  <div className="bg-slate-900 text-white p-2.5 rounded-xl space-y-2 relative font-mono text-[9px] overflow-hidden">
                    <div className="absolute right-1 bottom-1 opacity-20 text-3xl">💳</div>
                    <div>
                      <span className="text-[8px] text-gray-400 uppercase font-mono block">Secured Debit Card Simulator</span>
                      <input
                        type="text"
                        value={virtualCardNumber}
                        onChange={(e) => setVirtualCardNumber(e.target.value)}
                        placeholder="4820 XXXX XXXX 1950"
                        className="w-full bg-slate-800 text-white placeholder-white/30 border-0 rounded p-1 text-[10px] focus:ring-1 focus:ring-teal-400 mt-0.5"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="col-span-2">
                        <span className="text-[7.5px] text-gray-400 font-mono block">Holder:</span>
                        <input
                          type="text"
                          value={virtualCardName}
                          onChange={(e) => setVirtualCardName(e.target.value)}
                          placeholder={currentCustomerName}
                          className="w-full bg-slate-800 text-white border-0 rounded p-1 text-[9px]"
                        />
                      </div>
                      <div>
                        <span className="text-[7.5px] text-gray-400 font-mono block">CVV (3-digit):</span>
                        <input
                          type="password"
                          maxLength={3}
                          value={virtualCardCvv}
                          onChange={(e) => setVirtualCardCvv(e.target.value)}
                          placeholder="***"
                          className="w-full bg-slate-800 text-teal-400 border-0 rounded p-1 text-center font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activePaymentTab === 'cod' && (
                  <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg text-[9px] text-yellow-800 leading-tight">
                    <strong>🏡 Cash / Pay on delivery:</strong>
                    <p className="mt-0.5">Please hand over cash or scan delivery partner's physical QR upon fresh bottle verification at doorstep.</p>
                  </div>
                )}
              </div>

              {/* Place Order Trigger */}
              <button 
                onClick={handleCheckout}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                Place Order <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Dynamic Save for Later bookmarks container */}
          {saveForLater.length > 0 && (
            <div className="border-t border-gray-100 pt-4 mt-2 space-y-2.5">
              <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block tracking-wider">Save for Later ({saveForLater.length})</span>
              <div className="space-y-2 max-h-[140px] overflow-y-auto">
                {saveForLater.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-[11px] bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                    <div className="truncate flex-1 pr-2">
                      <span className="font-semibold text-gray-700 block truncate">{item.product.name}</span>
                      <span className="text-[9.5px] text-gray-400 font-mono">Qty: {item.quantity} • ₹{item.product.price}</span>
                    </div>
                    <button 
                      onClick={() => moveFromSaveToCart(item.product.id)}
                      className="bg-white border text-teal-700 hover:bg-teal-50 px-2 py-1 rounded text-[10px] font-bold font-mono transition shrink-0 cursor-pointer"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 24/7 Fast Support Request Box */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="font-display font-semibold text-gray-800 text-sm flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-cyan-600" /> Customer Support Center
          </h3>
          <p className="text-xs text-gray-500">Need immediate assistance for late deliveries, milk quality, or payments?</p>
          <div className="space-y-2.5">
            <div>
              <span className="block text-[9px] text-gray-400 uppercase font-mono mb-1">Issue type</span>
              <select 
                value={ticketType}
                onChange={(e: any) => setTicketType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg p-1.5 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-hidden"
              >
                <option value="late_delivery">Late Delivery Verification</option>
                <option value="product_quality">Milk Sour / Product Quality</option>
                <option value="refund">Refund / Billing issue</option>
                <option value="missing_item">Missing Milk Packet</option>
              </select>
            </div>
            <div>
              <span className="block text-[9px] text-gray-400 uppercase font-mono mb-1">Detailed Message</span>
              <textarea 
                placeholder="Submit ticket. Support resolves typically within minutes on WhatsApp."
                value={ticketMsg}
                onChange={(e) => setTicketMsg(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-hidden h-20 resize-none font-sans"
              />
            </div>
            <button 
              onClick={submitTicket}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Submit Ticket
            </button>
            {ticketSuccess && (
              <p className="text-[11px] text-green-600 text-center font-semibold bg-green-50 p-1.5 rounded-lg">Ticket submitted successfully. Agent responding in Live Chat.</p>
            )}
          </div>
        </div>

      </div>

      {/* MODAL: Complete Product Specs Panel */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-250 shadow-2xl">
            <button 
              onClick={() => { setSelectedProduct(null); setIsPlayingVideo(false); }}
              className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 p-1.5 rounded-full text-white z-10 transition"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="h-56 relative bg-slate-950 overflow-hidden">
              {isPlayingVideo ? (
                <div className="w-full h-full relative flex flex-col justify-between p-4 bg-gradient-to-br from-teal-900 to-slate-950 text-white animate-in fade-in duration-300">
                  <div className="flex justify-between items-start text-[10px] font-mono">
                    <span className="bg-red-500 font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1 animate-pulse uppercase">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE PROCESS FEED
                    </span>
                    <span className="text-teal-400">Stream ID: {selectedProduct.id}_WVF_9092</span>
                  </div>

                  {/* Simulated video playback animations/charts */}
                  <div className="flex-1 flex flex-col items-center justify-center space-y-2">
                    <div className="flex gap-1 items-end h-16 w-32 justify-center">
                      <div className="w-1.5 bg-teal-400 rounded-xs animate-bounce h-12" style={{ animationDelay: '100ms' }}></div>
                      <div className="w-1.5 bg-teal-500 rounded-xs animate-bounce h-16" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-1.5 bg-cyan-400 rounded-xs animate-bounce h-10" style={{ animationDelay: '300ms' }}></div>
                      <div className="w-1.5 bg-emerald-400 rounded-xs animate-bounce h-14" style={{ animationDelay: '400ms' }}></div>
                    </div>
                    <span className="text-[10px] text-teal-200/80 font-mono tracking-widest uppercase">milking silo telemetry: 2.8°C stable</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white/60 font-mono">GPS: {selectedProduct.farmName}</span>
                    <button 
                      onClick={() => setIsPlayingVideo(false)}
                      className="bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded border border-white/20 font-bold"
                    >
                      Return to Product Image
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  {/* Play button overlay */}
                  <button 
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute top-4 left-4 bg-teal-600/90 hover:bg-teal-600 p-2 rounded-full text-white shadow-md flex items-center justify-center duration-200 hover:scale-105 cursor-pointer"
                    title="Play Quality / drone video tour"
                  >
                    <Tv className="w-3.5 h-3.5 mr-1 shrink-0" />
                    <span className="text-[9px] font-bold pr-1">Video Tour</span>
                  </button>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                    <div>
                      <span className="text-teal-300 font-bold font-mono uppercase text-xs tracking-widest">{selectedProduct.category}</span>
                      <h3 className="text-white text-xl font-display font-semibold leading-tight">{selectedProduct.name}</h3>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-5 space-y-4 overflow-y-auto max-h-[350px]">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-teal-50/50 p-2.5 rounded-xl text-center">
                  <span className="block text-[9px] text-gray-400 font-mono">FAT PERCENTAGE</span>
                  <span className="text-teal-700 font-extrabold text-base font-mono">{selectedProduct.fatPercentage}%</span>
                </div>
                <div className="bg-teal-50/50 p-2.5 rounded-xl text-center">
                  <span className="block text-[9px] text-gray-400 font-mono">SNF DENSITY</span>
                  <span className="text-teal-700 font-extrabold text-base font-mono">{selectedProduct.snfPercentage}%</span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1 font-mono">Ingredients</span>
                <p className="text-xs text-gray-600">{selectedProduct.ingredients}</p>
              </div>

              <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1 font-mono font-sans">Storage Instructions</span>
                <p className="text-xs text-gray-600">{selectedProduct.storageInstructions}</p>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <span className="block text-[10px] text-gray-400 font-bold uppercase mb-2 font-mono">Nutrition Facts ({selectedProduct.unit})</span>
                <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                  <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                    <span className="block text-[8px] text-gray-400">Cal</span>
                    <span className="text-xs font-extrabold text-gray-700 shrink-0 leading-tight block truncate">{selectedProduct.nutrition.calories}</span>
                  </div>
                  <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                    <span className="block text-[8px] text-gray-400">Prot</span>
                    <span className="text-xs font-extrabold text-gray-700 shrink-0 leading-tight block truncate">{selectedProduct.nutrition.protein}</span>
                  </div>
                  <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                    <span className="block text-[8px] text-gray-400">Fat</span>
                    <span className="text-xs font-extrabold text-gray-700 shrink-0 leading-tight block truncate">{selectedProduct.nutrition.fat}</span>
                  </div>
                  <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                    <span className="block text-[8px] text-gray-400">carb</span>
                    <span className="text-xs font-extrabold text-gray-700 shrink-0 leading-tight block truncate">{selectedProduct.nutrition.carbs}</span>
                  </div>
                  <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                    <span className="block text-[8px] text-gray-400">calc</span>
                    <span className="text-xs font-extrabold text-teal-700 shrink-0 leading-tight block truncate">{selectedProduct.nutrition.calcium}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 border-t border-gray-100 pt-3 text-[11px] text-gray-500 font-mono">
                <div>Shelf Life: <strong className="text-gray-700">{selectedProduct.shelfLife}</strong></div>
                <div>Farm: <strong className="text-gray-700">{selectedProduct.farmName}</strong></div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 1.1 PROFILE SINGLE-SIGN-ON & REFERRAL MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200 text-xs text-gray-600">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-1 rounded-full text-gray-500 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pb-2 border-b border-gray-100">
              <span className="text-[9px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-full font-mono uppercase font-semibold">DF Multi-Auth SSO</span>
              <h3 className="font-display font-extrabold text-gray-900 text-sm mt-1">Unified Customer Login Switcher</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Simulate and test customer demographics, credentials & referral rewards.</p>
            </div>

            {/* Profile Inputs */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5">Customer Name</label>
                  <input 
                    type="text" 
                    value={currentCustomerName} 
                    onChange={(e) => setCurrentCustomerName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5">Mobile Number</label>
                  <input 
                    type="text" 
                    value={currentCustomerPhone} 
                    onChange={(e) => setCurrentCustomerPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Login Methods Grid (1.1 Flow Charts) */}
              <div className="space-y-1.5">
                <span className="block text-[9px] font-bold text-gray-400 uppercase">Provider Login Simulations</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setIsSimulatedLoggedIn(true);
                      setLoginMethodUsed('Google Account SSO');
                      alert(`Successfully Authenticated via Google Account OAuth!`);
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-700 p-2 rounded-xl text-center font-bold flex items-center justify-center gap-1.5 transition text-[10px] cursor-pointer"
                  >
                    <span>🌐 Google SSO</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsSimulatedLoggedIn(true);
                      setLoginMethodUsed('Facebook Social Sync');
                      alert(`Successfully sync'd Facebook Social profile securely.`);
                    }}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-xl text-center font-bold flex items-center justify-center gap-1.5 transition text-[10px] cursor-pointer"
                  >
                    <span>👥 Facebook</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsSimulatedLoggedIn(true);
                      setLoginMethodUsed('Email OTP Lock');
                      alert(`Verification link sent to raw email! Simulated authenticated.`);
                    }}
                    className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 p-2 rounded-xl text-center font-bold flex items-center justify-center gap-1.5 transition text-[10px] cursor-pointer"
                  >
                    <span>✉️ Email OTP Inbox</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsSimulatedLoggedIn(true);
                      setLoginMethodUsed('SMS Mobile OTP');
                      alert(`Mobile verification code '9082' sent. Simulated OTP Verified!`);
                    }}
                    className="bg-amber-50 hover:bg-amber-100 text-amber-700 p-2 rounded-xl text-center font-bold flex items-center justify-center gap-1.5 transition text-[10px] cursor-pointer"
                  >
                    <span>📱 Mobile OTP SMS</span>
                  </button>
                </div>
              </div>

              {/* 1.1 Referral system claims */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-200/60 mt-2 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-700 flex items-center gap-1">🎟️ Referral Reward Program:</span>
                <p className="text-[10px] text-gray-400">Claim coupon <strong className="text-teal-600 bg-white border px-1 rounded">DF50</strong> to receive instant ₹50 Smart Wallet balance credit!</p>
                
                <div className="flex gap-1.5 font-sans">
                  <input
                    type="text"
                    value={referralInput}
                    onChange={(e) => setReferralInput(e.target.value)}
                    placeholder="Enter DF50 referral"
                    className="bg-white border border-gray-200 rounded p-1 text-xs uppercase w-32 focus:outline-hidden font-mono"
                  />
                  <button
                    onClick={() => {
                      if (referralBonusClaimed) {
                        alert('Referral bonus has already been claimed on this profile.');
                        return;
                      }
                      if (referralInput.trim().toUpperCase() === 'DF50') {
                        setReferralBonusClaimed(true);
                        addWalletFunds(50);
                        alert('Referral DF50 validation succeeded! ₹50 credited instantly to your Smart Milk Wallet!');
                      } else {
                        alert(`Unknown coupon code. Please enter 'DF50'.`);
                      }
                    }}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold p-1 rounded transition text-center cursor-pointer font-sans"
                  >
                    Claim Credit
                  </button>
                </div>
              </div>

              {/* Connected details */}
              <div className="text-[10px] text-center text-gray-400 pt-2 font-mono leading-relaxed border-t border-gray-50">
                {isSimulatedLoggedIn ? (
                  <span className="text-teal-600 font-bold">✓ Secure session active: {loginMethodUsed}</span>
                ) : (
                  <span>Guest profile viewer active. Trigger credentials above to log in.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1.15 CASHBACK REWARD SCRATCH CARD MODAL */}
      {justPlacedOrder && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl relative text-center text-white border border-indigo-500/25">
            <button 
              onClick={() => setJustPlacedOrder(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-1 rounded-full text-white/80 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-2xl">🎁✨⭐</span>
              <h3 className="font-display font-extrabold text-sm text-yellow-300 tracking-wider font-sans uppercase mt-1">DairyFresh Scratch Card!</h3>
              <p className="text-[10px] text-indigo-200 mt-0.5">Order placed under sub-zero FSSAI hygiene standards. You scored a reward voucher!</p>
            </div>

            {/* Interactive scratching frame */}
            <div className="bg-indigo-950 p-4 rounded-2xl border border-indigo-800 flex justify-center items-center">
              {scratchedAmount === null ? (
                <div 
                  onClick={() => {
                    setIsScratchingEffect(true);
                    setTimeout(() => {
                      const prizeVal = Math.floor(Math.random() * 41) + 10; // Random quantity ₹10 - ₹50
                      setScratchedAmount(prizeVal);
                      setIsScratchingEffect(false);
                      addWalletFunds(prizeVal);
                    }, 1400);
                  }}
                  className={`w-40 h-40 bg-zinc-400 border-2 rounded-xl text-indigo-950 flex flex-col items-center justify-center font-bold select-none cursor-pointer relative shadow-inner overflow-hidden transition-all duration-300 ${isScratchingEffect ? 'opacity-80 scale-95 border-amber-400 bg-amber-100':'hover:scale-103'}`}
                >
                  {isScratchingEffect ? (
                    <div className="text-center space-y-1">
                      <span className="block text-2xl animate-spin">⚡</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider animate-pulse font-bold">Scratching...</span>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <span className="text-3xl">🥛</span>
                      <strong className="block text-[11px] uppercase font-mono tracking-widest text-[#2f3e46]">Scratch Here</strong>
                      <span className="block text-[8px] text-slate-600 font-normal font-sans">Click to rub off foil</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-40 h-40 bg-linear-to-b from-yellow-100 to-amber-200 border-2 border-yellow-400 rounded-xl flex flex-col items-center justify-center text-teal-900 p-2 animate-in zoom-in-95 duration-300 shadow-md">
                  <span className="text-3xl animate-bounce">🪙✨❤️</span>
                  <span className="text-[10px] font-mono uppercase text-teal-800 font-bold block">Cashback Won!</span>
                  <big className="font-mono font-extrabold text-2xl text-teal-900 shrink-0">₹{scratchedAmount}</big>
                  <p className="text-[8.5px] text-teal-700/80 leading-none mt-1">Instantly transferred into Smart Milk Wallet!</p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setJustPlacedOrder(false)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold text-xs py-2 rounded-xl transition shadow-md cursor-pointer font-sans"
              >
                {scratchedAmount === null ? 'Close & Save Voucher' : 'Awesome, claim reward!'}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
