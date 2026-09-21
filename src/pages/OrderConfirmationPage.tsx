import React, { useState } from 'react';
import { CheckCircle2, Printer, Compass, ArrowRight, ShieldCheck, Truck, Package } from 'lucide-react';
import { Order } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { InvoiceModal } from '../components/orders/InvoiceModal';

interface OrderConfirmationPageProps {
  order: Order | null;
  onTrackOrder: (orderNumber: string) => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onTrackOrder,
  onContinueShopping,
}) => {
  const [showInvoice, setShowInvoice] = useState(false);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-xs text-gray-500">No active order to display.</p>
        <button
          onClick={onContinueShopping}
          className="px-6 py-2.5 bg-[#7A142A] text-white text-xs font-bold uppercase rounded-xl"
        >
          Explore Drapes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* 1. Header Card */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EAE3DA] shadow-lg text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">
            Order Successfully Placed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1B]">
            Thank You for Shopping with KK COLLECTION
          </h1>
          <p className="font-serif italic text-sm text-[#7A142A]">
            "Every Drape, A Story."
          </p>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
          Your order <strong>{order.orderNumber}</strong> has been logged into our artisan loom queue. We will carefully pack your handloom piece in a scented muslin preservation box and dispatch via Blue Dart Express.
        </p>

        {/* Quick Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowInvoice(true)}
            className="px-5 py-2.5 bg-[#F4EFEA] hover:bg-[#EAE3DA] text-[#540D1E] text-xs font-bold rounded-xl border border-[#EAE3DA] flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#7A142A]" />
            <span>Print Tax Invoice</span>
          </button>

          <button
            onClick={() => onTrackOrder(order.orderNumber)}
            className="px-5 py-2.5 bg-[#7A142A] hover:bg-[#9B1A36] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Drape Shipment</span>
          </button>
        </div>
      </div>

      {/* 2. Order Metadata & Items */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3DA] shadow-xs space-y-6 text-xs text-[#1E1B1B]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-[#F4EFEA]">
          <div>
            <span className="text-gray-400 block uppercase text-[10px]">Order Number</span>
            <span className="font-bold font-mono text-[#7A142A] text-sm">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-gray-400 block uppercase text-[10px]">Order Date</span>
            <span className="font-semibold">{formatDate(order.createdAt)}</span>
          </div>
          <div>
            <span className="text-gray-400 block uppercase text-[10px]">Total Amount</span>
            <span className="font-bold text-[#1E1B1B] text-sm">{formatINR(order.totalAmount)}</span>
          </div>
          <div>
            <span className="text-gray-400 block uppercase text-[10px]">Payment Method</span>
            <span className="font-semibold">{order.paymentMethod.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Shipping Address snapshot */}
        <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE3DA] space-y-1">
          <span className="text-[10px] font-bold text-[#7A142A] uppercase tracking-wider">
            Delivering To:
          </span>
          <p className="font-bold">{order.shippingAddress.fullName}</p>
          <p className="text-gray-600">
            {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
          </p>
          <p className="text-gray-500">Contact: {order.shippingAddress.phone}</p>
        </div>

        {/* Items List */}
        <div>
          <h4 className="font-serif font-bold text-base text-[#540D1E] mb-3">
            Handcrafted Drapes in This Order:
          </h4>
          <div className="divide-y divide-[#F4EFEA]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt=""
                    className="w-12 h-14 object-cover rounded-xl border border-[#EAE3DA]"
                  />
                  <div>
                    <h5 className="font-bold text-[#1E1B1B]">{item.productName}</h5>
                    <p className="text-[11px] text-gray-500">
                      SKU: {item.sku} &bull; {item.selectedMeters ? `${item.selectedMeters} Meters` : `Qty: ${item.quantity}`}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#7A142A]">{formatINR(item.totalPrice)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Shopping CTA */}
        <div className="pt-4 border-t border-[#EAE3DA] flex justify-center">
          <button
            onClick={onContinueShopping}
            className="text-xs font-bold text-[#7A142A] hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            <span>Continue Exploring Heirloom Silks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {showInvoice && (
        <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};
