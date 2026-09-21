export type UserRole = 'CUSTOMER' | 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: 'Home' | 'Office' | 'Other';
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentCategoryId?: string;
  productCount: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  colorName: string;
  colorHex: string;
  stock: number;
  priceDelta?: number;
  image?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  brand: string;
  fabric: string;
  color: string;
  pattern: string;
  occasion: string;
  ageSegment: 'Young & Trendy' | 'Elegant & Classic' | 'Traditional' | 'Festive' | 'Wedding' | 'Daily Wear' | 'Office Wear';
  price: number;
  salePrice: number;
  costPrice: number;
  taxRate: number;
  stockQuantity: number;
  weight: string;
  length: string;
  width: string;
  blouseIncluded: boolean;
  careInstructions: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  images: string[];
  primaryImage: string;
  videoUrl?: string;
  rating: number;
  reviewCount: number;
  sellingUnit?: 'piece' | 'meter';
  meterPrice?: number;
  tags: string[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedMeters?: number;
  unitPrice: number;
  totalPrice: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Payment Processing'
  | 'Paid'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested'
  | 'Returned'
  | 'Refund Processing'
  | 'Refunded';

export interface OrderItemSnapshot {
  productId: string;
  sku: string;
  productName: string;
  productImage: string;
  quantity: number;
  selectedColor?: string;
  selectedMeters?: number;
  unitPrice: number;
  totalPrice: number;
  tax: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItemSnapshot[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: 'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'RAZORPAY_NETBANKING' | 'COD';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: OrderStatus;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  images?: string[];
  isApproved: boolean;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  reason: string;
  description: string;
  status:
    | 'Requested'
    | 'Under Review'
    | 'Approved'
    | 'Rejected'
    | 'Pickup Scheduled'
    | 'Received'
    | 'Refund Initiated'
    | 'Completed';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  currency: string;
  taxRatePercent: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  codEnabled: boolean;
  maxCodAmount: number;
  codFee: number;
  featureFlags: {
    enableCod: boolean;
    enableReviews: boolean;
    enableWishlist: boolean;
    enableCoupons: boolean;
    enableWhatsAppChat: boolean;
    enableOnlinePayments: boolean;
    enableReturns: boolean;
  };
}
