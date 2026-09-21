import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Category,
  CartItem,
  WishlistItem,
  Order,
  OrderStatus,
  Coupon,
  Review,
  Address,
  ReturnRequest,
  AuditLog,
  StoreSettings,
  User,
  UserRole,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
} from '../data/seedData';
import { generateOrderNumber } from '../utils/formatters';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  appliedCoupon: Coupon | null;
  currentUser: User | null;
  userAddresses: Address[];
  returnRequests: ReturnRequest[];
  auditLogs: AuditLog[];
  settings: StoreSettings;
  
  // Cart calculations
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  cartCount: number;

  // Actions
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedMeters?: number) => { success: boolean; message: string };
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    paymentMethod: Order['paymentMethod'];
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  
  // Addresses
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  
  // Auth
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Admin Catalog
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustInventory: (productId: string, newStock: number, reason: string) => void;
  
  // Returns & Reviews
  requestReturn: (orderId: string, productId: string, reason: string, description: string) => boolean;
  updateReturnStatus: (returnId: string, status: ReturnRequest['status']) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'isApproved'>) => void;
  approveReview: (reviewId: string, isApproved: boolean) => void;
  
  // Settings & Coupons
  updateSettings: (settings: Partial<StoreSettings>) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
  trackOrderSearch: (orderNumber: string, contact: string) => Order | undefined;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'kk_collection_products_v1',
  CATEGORIES: 'kk_collection_categories_v1',
  CART: 'kk_collection_cart_v1',
  WISHLIST: 'kk_collection_wishlist_v1',
  ORDERS: 'kk_collection_orders_v1',
  COUPONS: 'kk_collection_coupons_v1',
  REVIEWS: 'kk_collection_reviews_v1',
  SETTINGS: 'kk_collection_settings_v1',
  USER: 'kk_collection_user_v1',
  ADDRESSES: 'kk_collection_addresses_v1',
  RETURNS: 'kk_collection_returns_v1',
  AUDIT: 'kk_collection_audit_v1',
};

const DEFAULT_USER: User = {
  id: 'usr-customer-1',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com',
  phone: '+91 98765 43210',
  role: 'CUSTOMER',
  isVerified: true,
  isActive: true,
  createdAt: '2026-07-15T00:00:00Z',
};

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Ananya Sharma',
    phone: '+91 98765 43210',
    addressLine1: 'Flat 402, Neeladri Heritage, Plot 88',
    addressLine2: 'Near Sai Mandir, Patia',
    landmark: 'Opposite Infocity Gate',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pincode: '751024',
    country: 'India',
    addressType: 'Home',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Ananya Sharma',
    phone: '+91 98765 43210',
    addressLine1: 'DLF Cybercity, Tower C, 6th Floor',
    addressLine2: 'IDCO Info Valley',
    landmark: 'Chandaka Industrial Area',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pincode: '751024',
    country: 'India',
    addressType: 'Office',
    isDefault: false,
  },
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initial State Load with LocalStorage fallbacks
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [userAddresses, setUserAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
    return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
  });

  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RETURNS);
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'log-1',
            userId: 'usr-admin-1',
            userName: 'KK Admin',
            action: 'INITIALIZE_CATALOG',
            entity: 'CATALOG',
            entityId: 'SYSTEM',
            timestamp: new Date().toISOString(),
            details: 'Master Indian handloom & silk catalog loaded with seed data',
          },
        ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(userAddresses));
  }, [userAddresses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(returnRequests));
  }, [returnRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Helper to append audit log
  const logAudit = (action: string, entity: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest User',
      action,
      entity,
      entityId,
      timestamp: new Date().toISOString(),
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // Cart Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscountAmount);
      }
    } else if (appliedCoupon.discountType === 'FIXED') {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxableAmount * settings.taxRatePercent) / 100);

  let shippingAmount = 0;
  if (subtotal > 0) {
    if (appliedCoupon?.discountType === 'FREE_SHIPPING' || subtotal >= settings.freeShippingThreshold) {
      shippingAmount = 0;
    } else {
      shippingAmount = settings.standardShippingFee;
    }
  }

  const totalAmount = Math.max(0, taxableAmount + taxAmount + shippingAmount);
  const cartCount = cart.reduce((sum, item) => sum + (item.product.sellingUnit === 'meter' ? 1 : item.quantity), 0);

  // Cart Actions
  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedColor?: string,
    selectedMeters?: number
  ): { success: boolean; message: string } => {
    // Inventory check
    if (product.stockQuantity <= 0) {
      return { success: false, message: 'This artisanal piece is currently out of stock.' };
    }

    if (product.sellingUnit === 'meter') {
      const meters = selectedMeters || 1;
      if (meters > product.stockQuantity) {
        return { success: false, message: `Only ${product.stockQuantity} meters remaining in loom stock.` };
      }

      const existingIndex = cart.findIndex((item) => item.productId === product.id && item.selectedColor === selectedColor);
      const unitPrice = product.meterPrice || product.salePrice;
      const totalPrice = unitPrice * meters;

      if (existingIndex > -1) {
        const updated = [...cart];
        updated[existingIndex].selectedMeters = meters;
        updated[existingIndex].totalPrice = totalPrice;
        setCart(updated);
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${product.id}`,
          productId: product.id,
          product,
          quantity: 1,
          selectedColor,
          selectedMeters: meters,
          unitPrice,
          totalPrice,
        };
        setCart((prev) => [...prev, newItem]);
      }
      return { success: true, message: `Added ${meters} meters of ${product.name} to cart.` };
    }

    // Piece-based product
    const existing = cart.find((item) => item.productId === product.id && item.selectedColor === selectedColor);
    const currentQty = existing ? existing.quantity : 0;
    if (currentQty + quantity > product.stockQuantity) {
      return {
        success: false,
        message: `Cannot add more. We only have ${product.stockQuantity} pieces in stock.`,
      };
    }

    if (existing) {
      setCart((prev) =>
        prev.map((item) => {
          if (item.id === existing.id) {
            const newQty = item.quantity + quantity;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
      );
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${product.id}`,
        productId: product.id,
        product,
        quantity,
        selectedColor,
        unitPrice: product.salePrice,
        totalPrice: product.salePrice * quantity,
      };
      setCart((prev) => [...prev, newItem]);
    }

    return { success: true, message: `Added "${product.name}" to your drape bag.` };
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            if (item.product.sellingUnit === 'meter') {
              const currentMeters = item.selectedMeters || 1;
              const newMeters = Math.max(1, Math.min(item.product.stockQuantity, currentMeters + delta));
              return {
                ...item,
                selectedMeters: newMeters,
                totalPrice: item.unitPrice * newMeters,
              };
            }
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stockQuantity) return item;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon Logic
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon privilege code.' };
    }

    if (subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `This coupon requires a minimum cart subtotal of ₹${found.minOrderAmount.toLocaleString('en-IN')}.`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Privilege coupon "${found.code}" successfully applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist Logic
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.productId === product.id);
      if (exists) {
        return prev.filter((item) => item.productId !== product.id);
      } else {
        return [
          {
            id: `wish-${Date.now()}-${product.id}`,
            productId: product.id,
            product,
            addedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  // Order Creation (Authoritative & Decreases Stock)
  const createOrder = (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    paymentMethod: Order['paymentMethod'];
  }): Order => {
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const snapshots = cart.map((item) => ({
      productId: item.productId,
      sku: item.product.sku,
      productName: item.product.name,
      productImage: item.product.primaryImage,
      quantity: item.selectedMeters || item.quantity,
      selectedColor: item.selectedColor,
      selectedMeters: item.selectedMeters,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      tax: Math.round((item.totalPrice * settings.taxRatePercent) / 100),
    }));

    const isCod = orderData.paymentMethod === 'COD';

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser?.id,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      items: snapshots,
      subtotal,
      discountAmount,
      couponCode: appliedCoupon?.code,
      taxAmount,
      shippingAmount,
      totalAmount: isCod && settings.codFee ? totalAmount + settings.codFee : totalAmount,
      currency: 'INR',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: isCod ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed',
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      courier: 'Blue Dart Handloom Express',
      trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}-IN`,
      statusHistory: [
        {
          status: 'Confirmed',
          timestamp: now,
          note: isCod
            ? 'Order confirmed with Cash on Delivery option.'
            : 'Payment verified via Razorpay Secured Gateway.',
        },
      ],
      createdAt: now,
    };

    // Deduct stock safely
    setProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cart.find((c) => c.productId === prod.id);
        if (cartItem) {
          const qtyToDeduct = cartItem.selectedMeters || cartItem.quantity;
          return {
            ...prod,
            stockQuantity: Math.max(0, prod.stockQuantity - qtyToDeduct),
          };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Record audit
    logAudit('ORDER_PLACED', 'ORDER', newOrder.orderNumber, `Placed by ${newOrder.customerName} - Total ₹${newOrder.totalAmount}`);

    // Increment coupon used count if applicable
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === appliedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c))
      );
    }

    // Clear cart
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedHistory = [
            ...ord.statusHistory,
            {
              status,
              timestamp: new Date().toISOString(),
              note: note || `Status updated to ${status} by admin concierge.`,
            },
          ];
          return {
            ...ord,
            orderStatus: status,
            paymentStatus: status === 'Delivered' && ord.paymentMethod === 'COD' ? 'Paid' : ord.paymentStatus,
            statusHistory: updatedHistory,
          };
        }
        return ord;
      })
    );
    logAudit('ORDER_STATUS_UPDATE', 'ORDER', orderId, `Changed to ${status}`);
  };

  // Addresses
  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    if (newAddr.isDefault) {
      setUserAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setUserAddresses((prev) => [...prev, newAddr]);
    }
  };

  const updateAddress = (id: string, partial: Partial<Address>) => {
    setUserAddresses((prev) =>
      prev.map((addr) => {
        if (addr.id === id) {
          return { ...addr, ...partial };
        }
        if (partial.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      })
    );
  };

  const deleteAddress = (id: string) => {
    setUserAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setUserAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  // Auth & Roles
  const login = (email: string, role: UserRole = 'CUSTOMER') => {
    const user: User = {
      id: role === 'ADMIN' ? 'usr-admin-1' : `usr-${Date.now()}`,
      name: role === 'ADMIN' ? 'KK Collection Concierge Admin' : email.split('@')[0],
      email,
      phone: '+91 98765 43210',
      role,
      isVerified: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    setCurrentUser(user);
    logAudit('USER_LOGIN', 'USER', user.id, `Logged in as ${role}`);
  };

  const logout = () => {
    if (currentUser) {
      logAudit('USER_LOGOUT', 'USER', currentUser.id, 'Logged out');
    }
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, role });
    } else {
      login('admin@kkcollection.in', role);
    }
  };

  // Catalog Management
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => {
    const now = new Date().toISOString();
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [newProd, ...prev]);
    logAudit('CREATE_PRODUCT', 'PRODUCT', newProd.sku, `Created product ${newProd.name}`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, ...updates, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
    logAudit('UPDATE_PRODUCT', 'PRODUCT', id, `Updated attributes`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    logAudit('DELETE_PRODUCT', 'PRODUCT', id, `Deleted product`);
  };

  const adjustInventory = (productId: string, newStock: number, reason: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockQuantity: newStock, updatedAt: new Date().toISOString() } : p))
    );
    logAudit('INVENTORY_ADJUST', 'PRODUCT', productId, `New stock: ${newStock}. Reason: ${reason}`);
  };

  // Returns
  const requestReturn = (orderId: string, productId: string, reason: string, description: string): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;
    const item = order.items.find((i) => i.productId === productId);
    if (!item) return false;

    const newReturn: ReturnRequest = {
      id: `ret-${Date.now()}`,
      orderId,
      orderNumber: order.orderNumber,
      productId,
      productName: item.productName,
      reason,
      description,
      status: 'Requested',
      createdAt: new Date().toISOString(),
    };

    setReturnRequests((prev) => [newReturn, ...prev]);
    updateOrderStatus(orderId, 'Return Requested', `Return requested by customer: ${reason}`);
    logAudit('RETURN_REQUESTED', 'ORDER', order.orderNumber, `Product: ${item.productName}`);
    return true;
  };

  const updateReturnStatus = (returnId: string, status: ReturnRequest['status']) => {
    setReturnRequests((prev) =>
      prev.map((r) => (r.id === returnId ? { ...r, status } : r))
    );
    logAudit('RETURN_STATUS_UPDATE', 'RETURN', returnId, `Status: ${status}`);
  };

  // Reviews
  const addReview = (revData: Omit<Review, 'id' | 'createdAt' | 'isApproved'>) => {
    const newRev: Review = {
      ...revData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isApproved: true, // auto-approve for demonstration, admin can unapprove
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    const prodReviews = reviews.filter((r) => r.productId === revData.productId && r.isApproved).concat(newRev);
    const avg = prodReviews.reduce((s, r) => s + r.rating, 0) / prodReviews.length;
    setProducts((prev) =>
      prev.map((p) => (p.id === revData.productId ? { ...p, rating: Math.round(avg * 10) / 10, reviewCount: prodReviews.length } : p))
    );
    logAudit('REVIEW_SUBMITTED', 'PRODUCT', revData.productId, `Rating: ${revData.rating}/5`);
  };

  const approveReview = (reviewId: string, isApproved: boolean) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isApproved } : r))
    );
    logAudit('REVIEW_MODERATION', 'REVIEW', reviewId, `Approved: ${isApproved}`);
  };

  // Settings & Coupons
  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    logAudit('SETTINGS_UPDATE', 'SETTINGS', 'GLOBAL', 'Updated store configuration');
  };

  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `c-${Date.now()}`,
      usedCount: 0,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    logAudit('COUPON_CREATED', 'COUPON', newCoupon.code, `Discount: ${newCoupon.discountValue}`);
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const trackOrderSearch = (orderNumber: string, contact: string): Order | undefined => {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase();

    return orders.find((o) => {
      const matchNum = o.orderNumber.toUpperCase() === cleanNum;
      const matchContact =
        o.customerEmail.toLowerCase() === cleanContact ||
        o.customerPhone.replace(/\D/g, '').includes(cleanContact.replace(/\D/g, ''));
      return matchNum || matchContact;
    });
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        orders,
        coupons,
        reviews,
        appliedCoupon,
        currentUser,
        userAddresses,
        returnRequests,
        auditLogs,
        settings,
        subtotal,
        discountAmount,
        taxAmount,
        shippingAmount,
        totalAmount,
        cartCount,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        createOrder,
        updateOrderStatus,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        login,
        logout,
        switchRole,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustInventory,
        requestReturn,
        updateReturnStatus,
        addReview,
        approveReview,
        updateSettings,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        trackOrderSearch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
