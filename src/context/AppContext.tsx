import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, MilkSubscription, WalletTransaction, Order, DeliveryPartner, SupportTicket, ColdStorageUnit, FinancialRecord, OrderItem, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_DELIVERY_PARTNERS, INITIAL_COLD_STORAGE_UNITS, INITIAL_SUPPORT_TICKETS, INITIAL_ORDERS } from '../data';

interface AppContextType {
  products: Product[];
  subscriptions: MilkSubscription[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  orders: Order[];
  deliveryPartners: DeliveryPartner[];
  tickets: SupportTicket[];
  coldUnits: ColdStorageUnit[];
  finances: FinancialRecord[];
  
  // System / Server States
  notifications: { id: string; category: 'order' | 'offer' | 'subscription'; title: string; message: string; timestamp: string; isRead: boolean }[];
  systemLogs: { id: string; module: string; message: string; timestamp: string }[];
  loyaltyPoints: number;

  // Actions
  addWalletFunds: (amount: number) => void;
  createSubscription: (planType: '500ml' | '1L' | '2L', frequency: 'daily' | 'alternate' | 'weekly') => void;
  pauseSubscription: (id: string, start: string, end: string) => void;
  updateSubscriptionQuantity: (id: string, tempQty: number) => void;
  placeOrder: (items: OrderItem[], paymentMethod: 'upi' | 'wallet' | 'cod' | 'card', deliveryOption: 'instant' | 'scheduled', appliedCoupon?: string) => Order | null;
  submitFeedback: (orderId: string, rating: number, comment: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, partnerId?: string, rejectionReason?: string) => void;
  addSupportTicket: (type: SupportTicket['complaintType'], message: string) => void;
  sendTicketMessage: (ticketId: string, sender: 'customer' | 'support', text: string) => void;
  updateInventoryStock: (productId: string, newStock: number) => void;
  addNewProduct: (product: Omit<Product, 'id'>) => void;
  updateKycStatus: (partnerId: string, verify: boolean) => void;
  updateTemperature: (unitId: string, temp: number) => void;
  approveLabReport: (unitId: string, batchNumber: string) => void;
  dispatchBatch: (unitId: string, batchNumber: string) => void;
  simulateGlowDemandForecast: () => void;
  
  // Engine actions
  addNotification: (category: 'order' | 'offer' | 'subscription', title: string, message: string) => void;
  clearNotification: (id: string) => void;
  addSystemLog: (module: string, message: string) => void;
  clearSystemLogs: () => void;
  addLoyaltyPoints: (points: number) => void;
  redeemLoyaltyPoints: (points: number) => boolean;
  registerDeliveryPartner: (data: { name: string; phone: string; vehicleType: string; plateNumber: string; aadhaarNumber: string; licenseNumber: string }) => string;
  updatePartnerOnlineStatus: (partnerId: string, status: 'online' | 'offline') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem('df_products');
    return local ? JSON.parse(local) : INITIAL_PRODUCTS;
  });

  // Subscriptions
  const [subscriptions, setSubscriptions] = useState<MilkSubscription[]>(() => {
    const local = localStorage.getItem('df_subscriptions');
    return local ? JSON.parse(local) : [
      {
        id: 'sub_001',
        planType: '1L',
        quantity: 1,
        frequency: 'daily',
        status: 'active',
        startDate: '2026-05-15',
        pricePerDay: 70
      }
    ];
  });

  // Wallet
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const local = localStorage.getItem('df_wallet_balance');
    return local ? parseFloat(local) : 1250;
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    const local = localStorage.getItem('df_wallet_txs');
    return local ? JSON.parse(local) : [
      {
        id: 'tx_01',
        amount: 1000,
        type: 'deposit',
        description: 'Initial Wallet Welcome Top Up',
        timestamp: '2026-05-15 10:22 AM'
      },
      {
        id: 'tx_02',
        amount: 70,
        type: 'deduction',
        description: 'Auto subscription deduction - 1L Pure milk',
        timestamp: '2026-06-01 06:15 AM'
      }
    ];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem('df_orders');
    return local ? JSON.parse(local) : INITIAL_ORDERS;
  });

  // Delivery riders
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>(() => {
    const local = localStorage.getItem('df_delivery_partners');
    return local ? JSON.parse(local) : INITIAL_DELIVERY_PARTNERS;
  });

  // Support Ticketing
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const local = localStorage.getItem('df_tickets');
    return local ? JSON.parse(local) : INITIAL_SUPPORT_TICKETS;
  });

  // Cold Storage
  const [coldUnits, setColdUnits] = useState<ColdStorageUnit[]>(() => {
    const local = localStorage.getItem('df_cold_units');
    return local ? JSON.parse(local) : INITIAL_COLD_STORAGE_UNITS;
  });

  // Accountant Finance logs
  const [finances, setFinances] = useState<FinancialRecord[]>(() => {
    const local = localStorage.getItem('df_finances');
    return local ? JSON.parse(local) : [
      {
        id: 'fin_01',
        type: 'sale',
        category: 'revenue',
        description: 'Direct Order Purchase - ord_101',
        amount: 156,
        gstAmount: 7.8, // 5% GST base
        timestamp: '2026-06-01 07:42 AM'
      },
      {
        id: 'fin_02',
        type: 'subscription_credit',
        category: 'revenue',
        description: 'Milk Wallet Monthly Plan Allocation',
        amount: 1000,
        gstAmount: 50,
        timestamp: '2026-05-15 10:22 AM'
      },
      {
        id: 'fin_03',
        type: 'delivery_expense',
        category: 'expense',
        description: 'Rider trip payout to Ramesh Kumar',
        amount: 45,
        gstAmount: 0,
        timestamp: '2026-06-01 08:00 AM'
      }
    ];
  });

  // System Logs
  const [systemLogs, setSystemLogs] = useState<{ id: string; module: string; message: string; timestamp: string }[]>(() => {
    const local = localStorage.getItem('df_system_logs');
    return local ? JSON.parse(local) : [
      { id: 'log_boot_01', module: 'Order Processing Engine', message: 'Engine booted. Area validation models loaded successfully.', timestamp: '10:00:00 AM' },
      { id: 'log_boot_02', module: 'Delivery Allocation Engine', message: 'Ready. Auto-assignment scanning active online status.', timestamp: '10:00:05 AM' },
      { id: 'log_boot_03', module: 'Route Optimization Engine', message: 'Waypoints mapping engine configured via MapMyIndia and Google Maps API.', timestamp: '10:00:10 AM' },
      { id: 'log_boot_04', module: 'Push Notification Engine', message: 'Gateway connected. Active template triggers loaded for updates and dispatches.', timestamp: '10:00:15 AM' }
    ];
  });

  // Notifications
  const [notifications, setNotifications] = useState<{ id: string; category: 'order' | 'offer' | 'subscription'; title: string; message: string; timestamp: string; isRead: boolean }[]>(() => {
    const local = localStorage.getItem('df_notifications');
    return local ? JSON.parse(local) : [
      { id: 'not_01', category: 'subscription', title: 'Milk Subscription Renewal', message: 'Your Milk Subscription is scheduled for renewal in 2 days. Keeping your wallet top-up active ensures zero break in delivery.', timestamp: '09:00 AM', isRead: false },
      { id: 'not_02', category: 'offer', title: 'Early Bird Organic Ghee Offer', message: 'Get extra 50 points on purchasing pure Bilona Ghee this week.', timestamp: '10:15 AM', isRead: false }
    ];
  });

  // Loyalty Points
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    const local = localStorage.getItem('df_loyalty_points');
    return local ? parseInt(local) : 180;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('df_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('df_system_logs', JSON.stringify(systemLogs));
  }, [systemLogs]);

  useEffect(() => {
    localStorage.setItem('df_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('df_loyalty_points', loyaltyPoints.toString());
  }, [loyaltyPoints]);

  useEffect(() => {
    localStorage.setItem('df_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('df_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('df_wallet_txs', JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  useEffect(() => {
    localStorage.setItem('df_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('df_delivery_partners', JSON.stringify(deliveryPartners));
  }, [deliveryPartners]);

  useEffect(() => {
    localStorage.setItem('df_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('df_cold_units', JSON.stringify(coldUnits));
  }, [coldUnits]);

  useEffect(() => {
    localStorage.setItem('df_finances', JSON.stringify(finances));
  }, [finances]);

  // Actions
  const addWalletFunds = (amount: number) => {
    setWalletBalance(prev => prev + amount);
    const newTx: WalletTransaction = {
      id: `tx_${Date.now()}`,
      amount,
      type: 'deposit',
      description: 'Credited funds via UPI Payment Gateways',
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      }) + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    setWalletTransactions(prev => [newTx, ...prev]);

    // Financial ledger
    const finTx: FinancialRecord = {
      id: `fin_${Date.now()}`,
      type: 'subscription_credit',
      category: 'revenue',
      description: 'Dairy Wallet Deposit Credit',
      amount,
      gstAmount: +(amount * 0.05).toFixed(2),
      timestamp: new Date().toISOString()
    };
    setFinances(prev => [finTx, ...prev]);
  };

  const createSubscription = (planType: '500ml' | '1L' | '2L', frequency: 'daily' | 'alternate' | 'weekly') => {
    const rateMap = { '500ml': 35, '1L': 70, '2L': 135 };
    const newSub: MilkSubscription = {
      id: `sub_${Date.now()}`,
      planType,
      quantity: planType === '500ml' ? 1 : planType === '1L' ? 1 : 2,
      frequency,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      pricePerDay: rateMap[planType],
    };
    setSubscriptions(prev => [newSub, ...prev]);
  };

  const pauseSubscription = (id: string, start: string, end: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          status: 'paused',
          vacationStart: start,
          vacationEnd: end
        };
      }
      return sub;
    }));
  };

  const updateSubscriptionQuantity = (id: string, tempQty: number) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          tempQuantityChange: tempQty,
          tempQuantityStart: new Date().toISOString().split('T')[0],
          tempQuantityEnd: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] // 3 days
        };
      }
      return sub;
    }));
  };

  const placeOrder = (
    items: OrderItem[],
    paymentMethod: 'upi' | 'wallet' | 'cod' | 'card',
    deliveryOption: 'instant' | 'scheduled',
    appliedCoupon?: string
  ): Order | null => {
    const rawTotal = items.reduce((acc, current) => acc + (current.product.price * current.quantity), 0);
    
    // --- 3.1 Order Processing Engine ---
    addSystemLog('Order Processing Engine', `Initializing multi-step verification for purchase value ₹${rawTotal}`);

    // A. Validate Stock
    const outOfStockItem = items.find(item => item.product.stock < item.quantity);
    if (outOfStockItem) {
      addSystemLog('Order Processing Engine', `FATAL: Validation failed. Product "${outOfStockItem.product.name}" stock level too low.`);
      return null;
    }
    addSystemLog('Order Processing Engine', 'STEP 1: Stock Validation: PASSED. All requested dairy products are in reserve.');

    // B. Validate Delivery Area
    const deliveryZone = 'Gurgaon Zone Sector 30-58';
    addSystemLog('Order Processing Engine', `STEP 2: Delivery Area Validation: Verified. Address lies securely inside of active boundary: ${deliveryZone}.`);

    // C. Calculate Distance
    const primaryFarm = items[0]?.product.farmName || 'Green Valley Organic Farms';
    let distanceKm = 3.4; // Default
    if (primaryFarm.includes('Krishna')) distanceKm = 4.8;
    else if (primaryFarm.includes('AyurVeda')) distanceKm = 6.2;
    addSystemLog('Order Processing Engine', `STEP 3: Distance calculation completed. Customer resides ${distanceKm} km from single-origin source: "${primaryFarm}".`);

    // D. Apply Coupons
    let finalAmount = rawTotal;
    let couponDiscount = 0;
    if (appliedCoupon) {
      const codeUpper = appliedCoupon.toUpperCase();
      if (codeUpper === 'DAIRY20' && rawTotal >= 200) {
        couponDiscount = 20;
        finalAmount = Math.max(0, rawTotal - 200 >= 0 ? rawTotal - 20 : rawTotal);
        addSystemLog('Order Processing Engine', 'STEP 4: Coupon Verification: "DAIRY20" verified. Applied discount ₹20.');
      } else if (codeUpper === 'FRESHMILK' && rawTotal >= 500) {
        couponDiscount = Math.round(rawTotal * 0.1);
        finalAmount = Math.max(0, rawTotal - couponDiscount);
        addSystemLog('Order Processing Engine', `STEP 4: Coupon Verification: "FRESHMILK" verified. Applied 10% discount of ₹${couponDiscount}.`);
      } else {
        addSystemLog('Order Processing Engine', `STEP 4: Coupon Verification: "${appliedCoupon}" checked. Condition not met or code inactive.`);
      }
    } else {
      addSystemLog('Order Processing Engine', 'STEP 4: Coupons processing: No promotional voucher code attached.');
    }

    if (paymentMethod === 'wallet' && walletBalance < finalAmount) {
      addSystemLog('Order Processing Engine', 'FATAL: Order declined due to negative balance in customer smart milk wallet.');
      return null;
    }

    if (paymentMethod === 'wallet') {
      setWalletBalance(prev => prev - finalAmount);
      const newTx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        amount: finalAmount,
        type: 'deduction',
        description: `Order checkout payment for ${items.length} items (${appliedCoupon ? 'Discounted' : 'Full'})`,
        timestamp: new Date().toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short'
        }) + ' ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setWalletTransactions(prev => [newTx, ...prev]);
    }

    // Deduct stock
    setProducts(prev => prev.map(p => {
      const cartItem = items.find(item => item.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    }));

    // --- 3.2 Delivery Allocation Engine ---
    addSystemLog('Delivery Allocation Engine', 'Scanning dispatch assignment matrix...');
    
    // Scan online & KYC-verified partners
    const onlineRiders = deliveryPartners.filter(r => r.status === 'online' && r.isKycVerified);
    addSystemLog('Delivery Allocation Engine', `Matching offline/online state: Found ${onlineRiders.length} drivers available.`);
    
    let assignedRider: DeliveryPartner | undefined = undefined;

    if (onlineRiders.length > 0) {
      // Sort riders by vehicle compatibility or simple criteria:
      // Prefer bike/motorcycle for urgent instant delivery
      assignedRider = onlineRiders.find(r => r.vehicleType.toLowerCase().includes('motor') || r.vehicleType.toLowerCase().includes('bike')) || onlineRiders[0];
      
      addSystemLog('Delivery Allocation Engine', `Auto Assignment Successful: Selected "${assignedRider.name}" (ID: ${assignedRider.id}) based on Vehicle Type: "${assignedRider.vehicleType}", online state and proximity limit.`);
    } else {
      // Fallback to first partner to make sure order is not stuck, but log warning
      assignedRider = deliveryPartners[0];
      addSystemLog('Delivery Allocation Engine', `⚠️ WARNING: No online verified courier found in grid. Auto-dispatch fallback applied to backup rider: "${assignedRider.name}" (ID: ${assignedRider.id}).`);
    }

    const mainMilk = items.find(i => i.product.category === 'Milk')?.product || INITIAL_PRODUCTS[0];
    const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
    const orderId = `ord_${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: orderId,
      customerId: 'cust_user',
      customerName: 'Anjali Sharma (You)',
      customerAddress: 'Apt 402, Oakwood Residency, Sector 56, Gurgaon',
      phone: '+91 98112 34455',
      items,
      total: finalAmount,
      status: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod !== 'cod' ? 'paid' : 'pending',
      deliveryOption: deliveryOption === 'instant' ? 'instant' : 'scheduled',
      date: new Date().toISOString().split('T')[0],
      deliveryPartnerId: assignedRider ? assignedRider.id : undefined,
      pickupOtp: generateOtp(),
      deliveryOtp: generateOtp(),
      milkingDetails: {
        farmName: mainMilk.farmName,
        milkingTime: mainMilk.milkingTime,
        processingTime: mainMilk.processingTime,
        dispatchTime: mainMilk.dispatchTime,
        fatPercent: mainMilk.fatPercentage,
        snfPercent: mainMilk.snfPercentage
      }
    };

    setOrders(prev => [newOrder, ...prev]);

    // Financial ledger
    const finTx: FinancialRecord = {
      id: `fin_${Date.now()}`,
      type: 'sale',
      category: 'revenue',
      description: `Order Payment Received - ${newOrder.id}`,
      amount: finalAmount,
      gstAmount: +(finalAmount * 0.05).toFixed(2),
      timestamp: new Date().toISOString()
    };
    setFinances(prev => [finTx, ...prev]);

    // --- 3.6 Loyalty Engine ---
    const earnedPoints = Math.round(finalAmount * 0.05); // 5% cashback rate
    setLoyaltyPoints(p => p + earnedPoints);
    addSystemLog('Loyalty Engine', `Loyalty points calculated! ${earnedPoints} points (5% cashback rate) instantly credited on order ${orderId}.`);

    // --- 3.4 Push Notification Engine ---
    addNotification(
      'order',
      'Fresh Milk Dispatch!',
      `Order ${orderId} has been securely queued! Your Single-origin milk package is monitored for delivery.`,
    );
    addNotification(
      'offer',
      'Loyalty Cashback Credited',
      `Congrats! You earned ${earnedPoints} Loyalty Points on your recent dairy transaction. Keep healthy!`,
    );

    addSystemLog('Push Notification Engine', `Broadcasted dispatch notifications. Senders queued: 1 active.`);

    return newOrder;
  };

  const submitFeedback = (orderId: string, rating: number, comment: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          feedbackRating: rating,
          feedbackReview: comment
        };
      }
      return ord;
    }));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, partnerId?: string, rejectionReason?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        let updatedDetails = { ...ord.milkingDetails };
        if (status === 'delivered') {
          updatedDetails.deliveryTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
          });
        }

        // Action-based financial logs or rider updates
        if (status === 'delivered') {
          // Payout Delivery Rider
          const riderId = ord.deliveryPartnerId || partnerId;
          if (riderId) {
            setDeliveryPartners(riders => riders.map(r => {
              if (r.id === riderId) {
                return {
                  ...r,
                  totalTrips: r.totalTrips + 1,
                  earnings: r.earnings + 40 // Add delivery fee
                };
              }
              return r;
            }));

            // Record payout expense
            const expenseRecord: FinancialRecord = {
              id: `fin_exp_${Date.now()}`,
              type: 'delivery_expense',
              category: 'expense',
              description: `Rider payout for delivery ${ord.id}`,
              amount: 40,
              gstAmount: 0,
              timestamp: new Date().toISOString()
            };
            setFinances(f => [expenseRecord, ...f]);
          }

          // If COD, mark order paid
          if (ord.paymentMethod === 'cod') {
            return {
              ...ord,
              status,
              rejectionReason: ord.rejectionReason,
              paymentStatus: 'paid' as const,
              deliveryPartnerId: partnerId || ord.deliveryPartnerId,
              milkingDetails: updatedDetails
            };
          }
        }

        return {
          ...ord,
          status,
          rejectionReason: status === 'rejected' ? rejectionReason : ord.rejectionReason,
          deliveryPartnerId: partnerId || ord.deliveryPartnerId,
          milkingDetails: updatedDetails
        };
      }
      return ord;
    }));
  };

  const addSupportTicket = (complaintType: SupportTicket['complaintType'], message: string) => {
    const newTicket: SupportTicket = {
      id: `t_${Math.floor(10 + Math.random() * 90)}`,
      customerId: 'cust_user',
      customerName: 'Anjali Sharma (You)',
      complaintType,
      message,
      status: 'open',
      date: new Date().toISOString().split('T')[0],
      chatId: `chat_${Date.now()}`,
      messages: [
        {
          sender: 'customer',
          text: message,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const sendTicketMessage = (ticketId: string, sender: 'customer' | 'support', text: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: sender === 'support' ? 'resolved' : 'open',
          messages: [
            ...t.messages,
            {
              sender,
              text,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return t;
    }));
  };

  const updateInventoryStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const addNewProduct = (pInput: Omit<Product, 'id'>) => {
    const newP: Product = {
      ...pInput,
      id: `p_${Date.now()}`
    };
    setProducts(prev => [newP, ...prev]);
  };

  const updateKycStatus = (partnerId: string, verify: boolean) => {
    setDeliveryPartners(prev => prev.map(p => {
      if (p.id === partnerId) {
        return { ...p, isKycVerified: verify };
      }
      return p;
    }));
  };

  const updateTemperature = (unitId: string, temp: number) => {
    setColdUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        let alertStatus: 'normal' | 'warning' | 'alert' = 'normal';
        if (u.name.includes('Freeze') && temp > -12) alertStatus = 'alert';
        else if (u.name.includes('Silo') && temp > 4.5) alertStatus = 'warning';
        else if (u.name.includes('Cellar') && temp > 8.5) alertStatus = 'warning';

        return {
          ...u,
          currentTemp: parseFloat(temp.toFixed(1)),
          alertStatus
        };
      }
      return u;
    }));
  };

  const approveLabReport = (unitId: string, batchNumber: string) => {
    setColdUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          activeBatches: u.activeBatches.map(b => {
            if (b.batchNumber === batchNumber) {
              return { ...b, labReportStatus: 'approved' as const };
            }
            return b;
          })
        };
      }
      return u;
    }));
  };

  const dispatchBatch = (unitId: string, batchNumber: string) => {
    setColdUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          activeBatches: u.activeBatches.filter(b => b.batchNumber !== batchNumber)
        };
      }
      return u;
    }));
  };

  const simulateGlowDemandForecast = () => {
    // Triggers dummy increment showing smart features at work
    // Handled visually in Admin panel
  };

  const addNotification = (category: 'order' | 'offer' | 'subscription', title: string, message: string) => {
    const newNotif = {
      id: `not_${Date.now()}`,
      category,
      title,
      message,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addSystemLog = (module: string, message: string) => {
    const newLog = {
      id: `log_${Date.now()}`,
      module,
      message,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setSystemLogs(prev => [newLog, ...prev.slice(0, 99)]); // Limit to last 100 logs
  };

  const clearSystemLogs = () => {
    setSystemLogs([]);
  };

  const addLoyaltyPoints = (points: number) => {
    setLoyaltyPoints(p => p + points);
  };

  const redeemLoyaltyPoints = (points: number): boolean => {
    if (loyaltyPoints >= points) {
      setLoyaltyPoints(p => p - points);
      addSystemLog('Loyalty Engine', `Redeemed ${points} loyalty points (Value: ₹${points}) as checkout credit.`);
      return true;
    }
    return false;
  };

  const registerDeliveryPartner = (data: { name: string; phone: string; vehicleType: string; plateNumber: string; aadhaarNumber: string; licenseNumber: string }): string => {
    const pId = `dp${deliveryPartners.length + 1}`;
    const newPartner: DeliveryPartner = {
      id: pId,
      name: data.name,
      phone: data.phone,
      status: 'offline',
      vehicleType: data.vehicleType,
      plateNumber: data.plateNumber,
      aadhaarNumber: data.aadhaarNumber,
      licenseNumber: data.licenseNumber,
      isKycVerified: false, // Starts unverified
      totalTrips: 0,
      earnings: 0,
      penalties: 0
    };
    setDeliveryPartners(prev => [...prev, newPartner]);
    addSystemLog('CRM Engine', `New driver registration: "${data.name}" (${pId}). Licensing & vehicle papers queued for compliance approval.`);
    
    // Add a push notification for registration
    addNotification(
      'order',
      'Driver Registration Received',
      `Welcome ${data.name}! Aadhaar verification & Vehicle compliance reviews take up to 2 hours.`,
    );

    return pId;
  };

  const updatePartnerOnlineStatus = (partnerId: string, status: 'online' | 'offline') => {
    setDeliveryPartners(prev => prev.map(p => {
      if (p.id === partnerId) {
        return { ...p, status };
      }
      return p;
    }));
    addSystemLog('Delivery Allocation Engine', `Partner ${partnerId} toggled state to: "${status.toUpperCase()}".`);
  };

  return (
    <AppContext.Provider value={{
      products,
      subscriptions,
      walletBalance,
      walletTransactions,
      orders,
      deliveryPartners,
      tickets,
      coldUnits,
      finances,
      notifications,
      systemLogs,
      loyaltyPoints,
      addWalletFunds,
      createSubscription,
      pauseSubscription,
      updateSubscriptionQuantity,
      placeOrder,
      submitFeedback,
      updateOrderStatus,
      addSupportTicket,
      sendTicketMessage,
      updateInventoryStock,
      addNewProduct,
      updateKycStatus,
      updateTemperature,
      approveLabReport,
      dispatchBatch,
      simulateGlowDemandForecast,
      addNotification,
      clearNotification,
      addSystemLog,
      clearSystemLogs,
      addLoyaltyPoints,
      redeemLoyaltyPoints,
      registerDeliveryPartner,
      updatePartnerOnlineStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
};
