export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  fatPercentage: number;
  snfPercentage: number;
  farmName: string;
  milkingTime: string;
  processingTime: string;
  dispatchTime: string;
  image: string;
  description: string;
  ingredients: string;
  nutrition: {
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
    calcium: string;
  };
  shelfLife: string;
  storageInstructions: string;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
}

export type SubscriptionPlanType = '500ml' | '1L' | '2L';
export type SubscriptionFrequency = 'daily' | 'alternate' | 'weekly';

export interface MilkSubscription {
  id: string;
  planType: SubscriptionPlanType;
  quantity: number; // in Litres or packages
  frequency: SubscriptionFrequency;
  status: 'active' | 'paused' | 'vacation';
  vacationStart?: string; // date string YYYY-MM-DD
  vacationEnd?: string; // date string YYYY-MM-DD
  tempQuantityChange?: number; // e.g. temporary adjust to 2 or 0.5
  tempQuantityStart?: string;
  tempQuantityEnd?: string;
  startDate: string;
  pricePerDay: number;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: 'deposit' | 'deduction';
  description: string;
  timestamp: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'processing'
  | 'packed'
  | 'ready_pickup'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'rejected';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: 'upi' | 'wallet' | 'cod' | 'card';
  paymentStatus: 'paid' | 'pending';
  deliveryOption: 'instant' | 'scheduled' | 'subscription';
  scheduledTime?: string;
  date: string;
  deliveryPartnerId?: string;
  pickupOtp: string;
  deliveryOtp: string;
  feedbackRating?: number;
  feedbackReview?: string;
  rejectionReason?: string;
  milkingDetails: {
    farmName: string;
    milkingTime: string;
    processingTime: string;
    dispatchTime: string;
    deliveryTime?: string;
    fatPercent: number;
    snfPercent: number;
  };
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  status: 'online' | 'offline';
  vehicleType: string;
  plateNumber: string;
  isKycVerified: boolean;
  totalTrips: number;
  earnings: number;
  penalties: number;
  aadhaarNumber: string;
  licenseNumber: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  complaintType: 'late_delivery' | 'product_quality' | 'refund' | 'missing_item' | 'other';
  message: string;
  status: 'open' | 'resolved';
  date: string;
  chatId: string;
  messages: {
    sender: 'customer' | 'support';
    text: string;
    timestamp: string;
  }[];
}

export interface ColdStorageUnit {
  id: string;
  name: string; // e.g. Milk Chilling Zone A, Cheese Cellar
  requiresTemp: string; // temperature range e.g. "2°C to 4°C"
  currentTemp: number;
  alertStatus: 'normal' | 'warning' | 'alert';
  capacity: number;
  activeBatches: {
    batchNumber: string;
    productName: string;
    quantity: string;
    productionDate: string;
    expiryDate: string;
    labReportStatus: 'approved' | 'pending';
  }[];
}

export interface FinancialRecord {
  id: string;
  type: 'sale' | 'subscription_credit' | 'payout_vendor' | 'delivery_expense' | 'other_expense';
  category: 'revenue' | 'expense';
  description: string;
  amount: number;
  gstAmount: number;
  timestamp: string;
}
