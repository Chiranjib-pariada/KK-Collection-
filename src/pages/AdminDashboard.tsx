import React, { useState } from 'react';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Search,
  Filter,
  CheckCircle,
  Tag,
  Settings as SettingsIcon,
  ShieldCheck,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Coupon, StoreSettings } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { InvoiceModal } from '../components/orders/InvoiceModal';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    coupons,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    addCoupon,
    updateSettings,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'inventory' | 'coupons' | 'settings'>('analytics');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Search & Filter state
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // New/Edit Product Form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // New Coupon Form state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponType, setNewCouponType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(2000);

  // Product Form Initial State
  const initialProductForm: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'> = {
    name: '',
    slug: '',
    sku: `KK-${Math.floor(1000 + Math.random() * 9000)}`,
    categoryId: 'cat-sarees',
    categoryName: 'Sarees',
    brand: 'KK Collection',
    price: 9999,
    salePrice: 7999,
    costPrice: 4500,
    taxRate: 5,
    sellingUnit: 'piece',
    stockQuantity: 10,
    weight: '700 grams',
    primaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85'],
    fabric: 'Pure Katan Silk',
    color: 'Crimson Maroon & Gold',
    length: '5.5 meters',
    width: '44 inches',
    blouseIncluded: true,
    pattern: 'Traditional Zari',
    occasion: 'Wedding',
    ageSegment: 'Wedding',
    shortDescription: 'Exquisite handwoven creation with authentic Silk Mark certification.',
    description: 'Masterfully handloomed by regional artisans preserving century-old warp techniques.',
    careInstructions: 'Dry clean only. Store wrapped in pure unbleached muslin cloth.',
    tags: ['silk', 'handloom', 'wedding'],
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    isActive: true,
  };

  const [productFormData, setProductFormData] = useState(initialProductForm);

  // Calculate Metrics
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const lowStockItems = products.filter((p) => p.stockQuantity <= 5);

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProductFormData(initialProductForm);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductFormData({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productFormData);
    } else {
      addProduct({
        ...productFormData,
        slug: productFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
    }
    setIsProductModalOpen(false);
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    addCoupon({
      code: newCouponCode.toUpperCase().trim(),
      discountType: newCouponType,
      discountValue: newCouponDiscount,
      minOrderAmount: newCouponMinOrder,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-12-31',
      usageLimit: 100,
      isActive: true,
      description: `Privilege offer: ${newCouponDiscount}${newCouponType === 'PERCENTAGE' ? '%' : ' INR'} off`,
    });
    setNewCouponCode('');
    setIsCouponModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Admin Header */}
      <div className="bg-[#420A16] text-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/40 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#C5A059] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Administration Terminal</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
            KK COLLECTION Operations
          </h1>
          <p className="text-xs text-[#FAF8F5]/80">
            Authoritative inventory control, order fulfillment, and loom ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNewProduct}
            className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#D8B26E] text-[#24050D] text-xs font-bold uppercase tracking-wider rounded-xl shadow flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Drape to Loom
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-semibold">
              Gross Handloom Revenue
            </span>
            <span className="text-xl font-bold text-[#1E1B1B] font-serif">{formatINR(totalRevenue)}</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] text-[#7A142A] flex items-center justify-center shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-semibold">
              Orders Processed
            </span>
            <span className="text-xl font-bold text-[#1E1B1B] font-serif">{totalOrdersCount}</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-semibold">
              Low Stock Drapes
            </span>
            <span className="text-xl font-bold text-amber-800 font-serif">{lowStockItems.length}</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-500 uppercase tracking-wider block font-semibold">
              Catalog Master SKU Count
            </span>
            <span className="text-xl font-bold text-[#1E1B1B] font-serif">{products.length}</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-[#EAE3DA] overflow-x-auto gap-4 text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'analytics', label: 'Analytics & Ledger', icon: BarChart3 },
          { id: 'products', label: `Catalog Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Order Dispatch (${orders.length})`, icon: ShoppingCart },
          { id: 'inventory', label: `Loom Inventory (${lowStockItems.length} Low)`, icon: AlertTriangle },
          { id: 'coupons', label: `Coupons & Offers (${coupons.length})`, icon: Tag },
          { id: 'settings', label: 'Store Operations Settings', icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#7A142A] text-[#7A142A]'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Views */}
      {/* 4A. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders Overview */}
            <div className="p-6 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-[#540D1E]">
                Latest High-Value Drape Orders
              </h3>
              <div className="divide-y divide-[#F4EFEA] text-xs">
                {orders.slice(0, 5).map((ord) => (
                  <div key={ord.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#1E1B1B]">{ord.orderNumber}</span>
                      <p className="text-gray-400 text-[10px]">{ord.customerName} &bull; {ord.paymentMethod.replace('_', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#7A142A]">{formatINR(ord.totalAmount)}</span>
                      <p className="text-[10px] text-emerald-700 font-semibold">{ord.orderStatus}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Revenue Distribution */}
            <div className="p-6 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-[#540D1E]">
                Loom Production By Category
              </h3>
              <div className="space-y-3 text-xs">
                {categories.map((cat) => {
                  const count = products.filter((p) => p.categoryId === cat.id).length;
                  const percent = Math.round((count / (products.length || 1)) * 100);
                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">{cat.name}</span>
                        <span>{count} styles ({percent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-[#F4EFEA] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#7A142A] rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4B. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search by title, SKU, fabric..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#EAE3DA] rounded-xl focus:border-[#7A142A]"
              />
            </div>
            <button
              onClick={handleOpenNewProduct}
              className="px-4 py-2 bg-[#7A142A] hover:bg-[#9B1A36] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add New Drape
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE3DA] shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EAE3DA] font-bold text-[10px] text-[#540D1E] uppercase tracking-wider">
                  <th className="py-3 px-4">Drape</th>
                  <th className="py-3 px-4">Category / Fabric</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-center">Unit</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Flags</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFEA]">
                {products
                  .filter((p) =>
                    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.fabric.toLowerCase().includes(productSearch.toLowerCase())
                  )
                  .map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={prod.primaryImage}
                          alt=""
                          className="w-10 h-12 object-cover rounded-lg border border-[#EAE3DA]"
                        />
                        <div>
                          <p className="font-bold text-[#1E1B1B] max-w-xs truncate">{prod.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">SKU: {prod.sku}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#7A142A] block">{prod.categoryName}</span>
                        <span className="text-[10px] text-gray-500">{prod.fabric}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-[#1E1B1B] block">{formatINR(prod.salePrice)}</span>
                        {prod.price > prod.salePrice && (
                          <span className="text-[10px] text-gray-400 line-through">
                            {formatINR(prod.price)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center uppercase text-[10px] font-semibold text-gray-600">
                        {prod.sellingUnit}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            prod.stockQuantity <= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {prod.stockQuantity} {prod.sellingUnit === 'meter' ? 'm' : 'pcs'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-1">
                          {prod.isFeatured && (
                            <span className="px-1.5 py-0.5 bg-[#540D1E] text-[#F3DEAB] text-[9px] rounded font-semibold">
                              Featured
                            </span>
                          )}
                          {prod.isBestSeller && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] rounded font-semibold">
                              Top
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 text-gray-600 hover:text-[#7A142A] rounded-lg hover:bg-white"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1.5 text-gray-400 hover:text-red-700 rounded-lg hover:bg-white"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4C. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="Search by Order ID, Client, AWB..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#EAE3DA] rounded-xl"
            />
          </div>

          <div className="bg-white rounded-2xl border border-[#EAE3DA] shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EAE3DA] font-bold text-[10px] text-[#540D1E] uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID &amp; Date</th>
                  <th className="py-3 px-4">Client &amp; Destination</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Payment</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFEA]">
                {orders
                  .filter((o) =>
                    o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                    o.trackingNumber?.toLowerCase().includes(orderSearch.toLowerCase())
                  )
                  .map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#1E1B1B] block">{order.orderNumber}</span>
                        <span className="text-[10px] text-gray-400">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#1E1B1B]">{order.customerName}</p>
                        <p className="text-[10px] text-gray-500">
                          {order.shippingAddress.city}, {order.shippingAddress.pincode}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#7A142A]">
                        {formatINR(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {order.paymentMethod.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="px-2.5 py-1 text-xs font-semibold bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-2.5 py-1 bg-white hover:bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg font-semibold text-[11px] text-[#540D1E] flex items-center gap-1 ml-auto"
                        >
                          <Printer className="w-3 h-3 text-[#7A142A]" /> Tax Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4D. INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <strong>{lowStockItems.length} Handloom Drapes</strong> require immediate artisan loom replenishment.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((prod) => (
              <div
                key={prod.id}
                className="p-4 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs flex gap-3 text-xs"
              >
                <img
                  src={prod.primaryImage}
                  alt=""
                  className="w-14 h-16 object-cover rounded-xl border border-[#EAE3DA]"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-[#1E1B1B] truncate">{prod.name}</h5>
                    <p className="text-[10px] text-gray-500">{prod.fabric} &bull; SKU: {prod.sku}</p>
                    <p className="text-amber-800 font-bold mt-1">
                      Remaining: {prod.stockQuantity} {prod.sellingUnit === 'meter' ? 'Meters' : 'Pieces'}
                    </p>
                  </div>
                  <button
                    onClick={() => updateProduct(prod.id, { stockQuantity: prod.stockQuantity + 10 })}
                    className="mt-2 py-1 px-2.5 bg-[#FAF8F5] hover:bg-[#F4EFEA] text-[#7A142A] border border-[#EAE3DA] rounded-lg font-bold text-[10px] uppercase flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Restock +10
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4E. COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-base text-[#540D1E]">Privilege Discount Vouchers</h3>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-[#7A142A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Create Voucher
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {coupons.map((coup) => (
              <div
                key={coup.id}
                className="p-5 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#7A142A] bg-[#FAF8F5] px-2.5 py-1 rounded border border-[#EAE3DA]">
                    {coup.code}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="font-semibold text-[#1E1B1B]">{coup.description}</p>
                <p className="text-[11px] text-gray-500">
                  Min Cart: {formatINR(coup.minOrderAmount)} &bull; Valid till: {formatDate(coup.endDate)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4F. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="p-6 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs max-w-xl space-y-4 text-xs">
          <h3 className="font-serif font-bold text-base text-[#540D1E]">Handloom Store Configuration</h3>
          <div className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => updateSettings({ storeName: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => updateSettings({ tagline: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Concierge WhatsApp Phone Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Complimentary Shipping Minimum (INR)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => updateSettings({ freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
              />
            </div>
            <div className="pt-2 border-t border-[#F4EFEA] flex items-center justify-between">
              <span className="font-semibold">Enable Cash on Delivery (COD)</span>
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => updateSettings({ codEnabled: e.target.checked })}
                className="rounded text-[#7A142A]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 border border-[#EAE3DA] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <h3 className="font-serif font-bold text-lg text-[#540D1E]">
              {editingProduct ? 'Update Drape Specifications' : 'Add New Handloom Drape'}
            </h3>

            <form onSubmit={handleProductFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Drape Title</label>
                  <input
                    type="text"
                    required
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={productFormData.categoryId}
                    onChange={(e) => {
                      const selCat = categories.find((c) => c.id === e.target.value);
                      setProductFormData({
                        ...productFormData,
                        categoryId: e.target.value,
                        categoryName: selCat?.name || 'Sarees',
                      });
                    }}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Selling Unit</label>
                  <select
                    value={productFormData.sellingUnit}
                    onChange={(e) => setProductFormData({ ...productFormData, sellingUnit: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  >
                    <option value="piece">Per Piece (Saree / Dress Material)</option>
                    <option value="meter">Per Meter (Raw Fabric / Kapda)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Fabric &amp; Weave</label>
                  <input
                    type="text"
                    required
                    value={productFormData.fabric}
                    onChange={(e) => setProductFormData({ ...productFormData, fabric: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Color / Zari</label>
                  <input
                    type="text"
                    required
                    value={productFormData.color}
                    onChange={(e) => setProductFormData({ ...productFormData, color: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Sale / Drape Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productFormData.salePrice}
                    onChange={(e) => setProductFormData({ ...productFormData, salePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Stock Quantity ({productFormData.sellingUnit === 'meter' ? 'Meters' : 'Pieces'})</label>
                  <input
                    type="number"
                    required
                    value={productFormData.stockQuantity}
                    onChange={(e) => setProductFormData({ ...productFormData, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    required
                    value={productFormData.primaryImage}
                    onChange={(e) => setProductFormData({ ...productFormData, primaryImage: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={productFormData.shortDescription}
                    onChange={(e) => setProductFormData({ ...productFormData, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F4EFEA]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#7A142A] text-white font-bold rounded-lg uppercase"
                >
                  Save Drape
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-[#EAE3DA] shadow-2xl space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-[#540D1E]">Create Discount Voucher</h3>
            <form onSubmit={handleAddCouponSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SILK20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7A142A] text-white font-bold rounded-lg"
                >
                  Create Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
