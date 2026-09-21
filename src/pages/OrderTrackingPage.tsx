import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, Package, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR, formatDate } from '../utils/formatters';
import { Order } from '../types';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onSelectProduct?: (id: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber = '',
}) => {
  const { orders } = useStore();
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber || 'KK-849201');
  const [activeOrder, setActiveOrder] = useState<Order | null>(
    orders.find((o) => o.orderNumber.toLowerCase() === (initialOrderNumber || 'KK-849201').toLowerCase()) || orders[0] || null
  );
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === orderQuery.trim().toLowerCase() ||
        o.trackingNumber?.toLowerCase() === orderQuery.trim().toLowerCase()
    );

    if (found) {
      setActiveOrder(found);
    } else {
      setSearchError(`No order found matching "${orderQuery}". Please check your order ID from your email or invoice.`);
    }
  };

  const statusSteps = [
    { key: 'Pending', label: 'Order Received', desc: 'Verified & entered loom queue' },
    { key: 'Confirmed', label: 'Artisan Confirmed', desc: 'Inspected by master weaver' },
    { key: 'Processing', label: 'Muslin Packaging', desc: 'Hand-wrapped in cotton preservation cover' },
    { key: 'Shipped', label: 'Dispatched via Courier', desc: 'Blue Dart Express transit' },
    { key: 'Delivered', label: 'Delivered to Doorstep', desc: 'Safe handover with verification' },
  ];

  const getStepIndex = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 2;
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Truck className="w-3.5 h-3.5" /> Blue Dart Insured Tracking
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1B]">
          Track Your Drape Shipment
        </h1>
        <p className="text-xs text-gray-500">
          Enter your KK Collection Order ID or Courier AWB number to check real-time transit milestones.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="Enter Order ID (e.g. KK-849201) or AWB..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#EAE3DA] rounded-2xl text-xs font-semibold text-[#1E1B1B] focus:border-[#7A142A] shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-[#7A142A] hover:bg-[#9B1A36] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md transition-colors"
        >
          Track Drape
        </button>
      </form>

      {searchError && (
        <div className="max-w-xl mx-auto p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center">
          {searchError}
        </div>
      )}

      {/* Active Order Tracking Result */}
      {activeOrder && (
        <div className="bg-white rounded-3xl border border-[#EAE3DA] p-6 sm:p-8 shadow-xs space-y-8">
          {/* Order Snapshot Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#F4EFEA]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-[#1E1B1B]">
                  Order {activeOrder.orderNumber}
                </span>
                <span className="px-2.5 py-0.5 bg-[#FAF8F5] border border-[#C5A059] text-[#7A142A] text-[10px] font-bold rounded-full uppercase">
                  {activeOrder.orderStatus}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Placed on {formatDate(activeOrder.createdAt)} &bull; Courier: {activeOrder.courier || 'Blue Dart Express'}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-gray-400 block uppercase">AWB Waybill</span>
              <span className="font-mono font-bold text-xs text-[#7A142A]">
                {activeOrder.trackingNumber || 'BD-IND-9920148'}
              </span>
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="py-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#540D1E] mb-6">
              Shipment Milestones
            </h4>
            <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-2">
              {statusSteps.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.key} className="flex-1 flex md:flex-col items-start md:items-center gap-3 md:text-center relative">
                    {/* Step Icon */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-[#7A142A] text-white shadow-md'
                          : 'bg-[#F4EFEA] text-gray-400 border border-[#EAE3DA]'
                      } ${isCurrent ? 'ring-4 ring-[#C5A059]/40' : ''}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Details */}
                    <div>
                      <p
                        className={`text-xs font-bold ${
                          isCompleted ? 'text-[#1E1B1B]' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5 max-w-[150px] leading-tight">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address & Package Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE3DA] text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#7A142A] uppercase tracking-wider block mb-1">
                Destination:
              </span>
              <p className="font-bold text-[#1E1B1B]">{activeOrder.shippingAddress.fullName}</p>
              <p className="text-gray-600 leading-relaxed">
                {activeOrder.shippingAddress.addressLine1}, {activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} — {activeOrder.shippingAddress.pincode}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#7A142A] uppercase tracking-wider block mb-1">
                Package Contents:
              </span>
              <div className="space-y-1">
                {activeOrder.items.map((item, i) => (
                  <p key={i} className="text-gray-700 flex justify-between">
                    <span>{item.productName} ({item.selectedMeters ? `${item.selectedMeters}m` : `x${item.quantity}`})</span>
                    <strong className="text-[#1E1B1B]">{formatINR(item.totalPrice)}</strong>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
