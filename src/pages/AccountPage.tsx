import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  Printer,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Address, Order, Product } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { InvoiceModal } from '../components/orders/InvoiceModal';

interface AccountPageProps {
  onSelectProduct: (productId: string) => void;
  onTrackOrder: (orderNumber: string) => void;
  onOpenCart: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onSelectProduct,
  onTrackOrder,
  onOpenCart,
}) => {
  const {
    currentUser,
    orders,
    wishlist,
    userAddresses,
    addAddress,
    deleteAddress,
    requestReturn,
    toggleWishlist,
    addToCart,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'profile'>('orders');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Return Request Modal State
  const [returnOrder, setReturnOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Fabric / Weave Color Variation');
  const [returnSuccessMessage, setReturnSuccessMessage] = useState('');

  // Add Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    fullName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pincode: '751024',
    country: 'India',
    addressType: 'Home',
    isDefault: false,
  });

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnOrder) return;
    requestReturn(returnOrder.id, returnOrder.items[0]?.productId || '', returnReason, 'Customer return request from account portal');
    setReturnSuccessMessage(`Return request registered for ${returnOrder.orderNumber}! Our concierge will arrange doorstep inspection.`);
    setTimeout(() => {
      setReturnOrder(null);
      setReturnSuccessMessage('');
    }, 3000);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.addressLine1 || !newAddr.pincode) return;
    addAddress(newAddr);
    setShowAddAddress(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Account Banner */}
      <div className="bg-[#420A16] text-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/40 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#540D1E] border border-[#C5A059] flex items-center justify-center text-xl font-bold font-serif text-[#F3DEAB]">
            {currentUser?.name.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold">{currentUser?.name || 'Valued Patron'}</h1>
            <p className="text-xs text-[#FAF8F5]/80">
              {currentUser?.email} &bull; Handloom Connoisseur Since 2024
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-center">
          <div className="px-4 py-2 bg-[#540D1E] rounded-xl border border-[#C5A059]/30">
            <span className="text-xl font-bold font-serif text-[#F3DEAB]">{orders.length}</span>
            <p className="text-[10px] text-gray-300 uppercase">Total Orders</p>
          </div>
          <div className="px-4 py-2 bg-[#540D1E] rounded-xl border border-[#C5A059]/30">
            <span className="text-xl font-bold font-serif text-[#F3DEAB]">{wishlist.length}</span>
            <p className="text-[10px] text-gray-300 uppercase">Saved Drapes</p>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-[#EAE3DA] overflow-x-auto gap-4 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#7A142A] text-[#7A142A]'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <Package className="w-4 h-4" /> My Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'border-[#7A142A] text-[#7A142A]'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <MapPin className="w-4 h-4" /> Saved Addresses ({userAddresses.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'border-[#7A142A] text-[#7A142A]'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <Heart className="w-4 h-4" /> Wishlist Vault ({wishlist.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-[#7A142A] text-[#7A142A]'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          <Settings className="w-4 h-4" /> Profile &amp; Preferences
        </button>
      </div>

      {/* 3. Tab Contents */}
      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-[#EAE3DA] text-center space-y-2">
              <Package className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#1E1B1B]">No Orders Yet</h3>
              <p className="text-xs text-gray-500">You haven't ordered any handloom weaves yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-6 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#F4EFEA]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-[#1E1B1B]">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-gray-400 text-[11px] mt-0.5">
                      Ordered on {formatDate(order.createdAt)} &bull; Total: <strong>{formatINR(order.totalAmount)}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTrackOrder(order.orderNumber)}
                      className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F4EFEA] text-[#540D1E] text-xs font-semibold rounded-lg border border-[#EAE3DA] flex items-center gap-1"
                    >
                      Track Shipment
                    </button>
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F4EFEA] text-[#540D1E] text-xs font-semibold rounded-lg border border-[#EAE3DA] flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#7A142A]" /> Tax Invoice
                    </button>
                    {order.orderStatus === 'Delivered' && (
                      <button
                        onClick={() => setReturnOrder(order)}
                        className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F4EFEA] text-amber-800 text-xs font-semibold rounded-lg border border-[#EAE3DA] flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Return / Exchange
                      </button>
                    )}
                  </div>
                </div>

                {/* Items in order */}
                <div className="divide-y divide-[#F4EFEA]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt=""
                          className="w-12 h-14 object-cover rounded-lg border border-[#EAE3DA]"
                        />
                        <div>
                          <h4 className="font-bold text-[#1E1B1B]">{item.productName}</h4>
                          <p className="text-[11px] text-gray-500">
                            {item.selectedMeters ? `${item.selectedMeters} Meters` : `Quantity: ${item.quantity}`} &bull; SKU: {item.sku}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#7A142A]">{formatINR(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ADDRESSES TAB */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-lg text-[#1E1B1B]">Delivery Addresses</h3>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="px-4 py-2 bg-[#7A142A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add New Address
            </button>
          </div>

          {/* Add Address Form */}
          {showAddAddress && (
            <form onSubmit={handleAddAddressSubmit} className="p-6 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs space-y-4 max-w-xl text-xs">
              <h4 className="font-serif font-bold text-sm text-[#540D1E]">New Shipping Address</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Address Type</label>
                  <select
                    value={newAddr.addressType}
                    onChange={(e) => setNewAddr({ ...newAddr, addressType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddr.addressLine1}
                    onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7A142A] text-white font-bold rounded-lg"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* Addresses list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userAddresses.map((addr) => (
              <div
                key={addr.id}
                className="p-5 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[#1E1B1B] text-sm">{addr.fullName}</span>
                    <span className="px-2 py-0.5 bg-[#FAF8F5] text-[#7A142A] font-semibold rounded text-[10px]">
                      {addr.addressType}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {addr.addressLine1}
                    {addr.addressLine2 && `, ${addr.addressLine2}`}
                    <br />
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p className="text-gray-500 mt-1">Phone: {addr.phone}</p>
                </div>

                <div className="pt-4 border-t border-[#F4EFEA] flex justify-end">
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-red-700 hover:text-red-900 flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlist.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-[#EAE3DA] text-center space-y-2">
              <Heart className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#1E1B1B]">Your Vault is Empty</h3>
              <p className="text-xs text-gray-500">Click the heart icon on any drape to curate your personal collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs flex gap-3 text-xs"
                >
                  <img
                    src={item.product.primaryImage}
                    alt=""
                    className="w-20 h-24 object-cover rounded-xl border border-[#EAE3DA] cursor-pointer"
                    onClick={() => onSelectProduct(item.product.id)}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        onClick={() => onSelectProduct(item.product.id)}
                        className="font-bold text-[#1E1B1B] hover:text-[#7A142A] cursor-pointer line-clamp-2"
                      >
                        {item.product.name}
                      </h4>
                      <p className="font-bold text-[#7A142A] mt-1">{formatINR(item.product.salePrice)}</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          addToCart(item.product, 1);
                          onOpenCart();
                        }}
                        className="flex-1 py-1.5 bg-[#7A142A] text-white font-bold rounded-lg text-[10px] uppercase"
                      >
                        Move to Bag
                      </button>
                      <button
                        onClick={() => toggleWishlist(item.product)}
                        className="p-1.5 text-gray-400 hover:text-red-700"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="p-6 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs max-w-xl space-y-4 text-xs">
          <h3 className="font-serif font-bold text-base text-[#540D1E]">Member Profile Details</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={currentUser?.name}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser?.email}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Registered Phone</label>
              <input
                type="text"
                disabled
                value={currentUser?.phone}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg text-gray-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Membership Tier</label>
              <span className="inline-block px-3 py-1 bg-[#FAF8F5] border border-[#C5A059] text-[#7A142A] rounded-lg font-bold">
                Royal Silk Club &bull; Lifetime Handloom Privilege
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {returnOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-[#EAE3DA] shadow-2xl space-y-4 text-xs">
            <h3 className="font-serif font-bold text-base text-[#540D1E]">
              7-Day Handloom Return Request: {returnOrder.orderNumber}
            </h3>
            {returnSuccessMessage ? (
              <p className="text-emerald-700 font-semibold">{returnSuccessMessage}</p>
            ) : (
              <form onSubmit={handleReturnSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Reason for Return</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg"
                  >
                    <option value="Fabric / Weave Color Variation">Fabric / Weave Color Variation</option>
                    <option value="Defect in Zari or Pallu">Defect in Zari or Pallu Threading</option>
                    <option value="Length or Blouse Piece Mismatch">Length or Blouse Piece Mismatch</option>
                    <option value="Ordered By Mistake">Ordered By Mistake</option>
                  </select>
                </div>
                <p className="text-gray-500 text-[11px]">
                  Our return courier will arrive with a fresh sealed pouch for secure reverse transit to the Patia Handloom quarter.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReturnOrder(null)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#7A142A] text-white font-bold rounded-lg"
                  >
                    Confirm Request
                  </button>
                </div>
              </form>
            )}
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
