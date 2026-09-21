import React from 'react';
import { X, Printer, Download, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';
import { formatINR, formatDate, formatDateTime } from '../../utils/formatters';
import { BrandLogo } from '../common/BrandLogo';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#EAE3DA] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Action Header */}
        <div className="p-4 bg-[#420A16] text-[#FAF8F5] flex items-center justify-between border-b border-[#C5A059]/40 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F3DEAB]">
              Tax Invoice &bull; {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#D8B26E] text-[#360611] text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#F3DEAB] hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Area */}
        <div id="printable-invoice" className="p-8 overflow-y-auto space-y-6 text-xs text-[#1E1B1B]">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-[#7A142A]">
            <div>
              <BrandLogo size="md" variant="dark" showTagline={true} />
              <p className="text-[11px] text-gray-500 mt-2">
                KK Collection Handloom Private Limited<br />
                Patia Heritage Loom Quarter, Bhubaneswar, Odisha 751024<br />
                GSTIN: 21AAACK1234F1Z8 &bull; Handloom Silk Mark Reg: SM-OD-8849
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block px-2.5 py-0.5 bg-[#F4EFEA] text-[#7A142A] font-bold text-xs rounded border border-[#EAE3DA] mb-1">
                ORIGINAL TAX INVOICE
              </span>
              <p className="font-bold text-sm text-[#1E1B1B]">Invoice: INV-{order.orderNumber.replace('KK-', '')}</p>
              <p className="text-gray-500 text-[11px]">Order No: {order.orderNumber}</p>
              <p className="text-gray-500 text-[11px]">Date: {formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Billed To & Shipping Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE3DA]">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7A142A] mb-1">
                Billed &amp; Delivered To:
              </h4>
              <p className="font-bold text-sm text-[#1E1B1B]">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600 mt-0.5 leading-relaxed">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                {order.shippingAddress.landmark && <><br />Landmark: {order.shippingAddress.landmark}</>}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                <br />
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7A142A] mb-1">
                Order &amp; Payment Details:
              </h4>
              <p className="text-gray-600">
                Payment Method: <strong className="text-[#1E1B1B]">{order.paymentMethod.replace('_', ' ')}</strong>
              </p>
              <p className="text-gray-600">
                Payment Status: <strong className={order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}>{order.paymentStatus}</strong>
              </p>
              <p className="text-gray-600">
                Courier: <strong className="text-[#1E1B1B]">{order.courier || 'Blue Dart Express'}</strong>
              </p>
              {order.trackingNumber && (
                <p className="text-gray-600">
                  AWB Tracking: <strong className="text-[#7A142A]">{order.trackingNumber}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F4EFEA] border-y border-[#EAE3DA] text-[10px] uppercase font-bold text-[#540D1E] tracking-wider">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3 text-center">Qty / Cut</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">GST (5%)</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3DA]">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF8F5]">
                    <td className="py-3 px-3">
                      <p className="font-semibold text-[#1E1B1B]">{item.productName}</p>
                      {item.selectedColor && (
                        <p className="text-[10px] text-gray-500">Color: {item.selectedColor}</p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">{item.sku}</td>
                    <td className="py-3 px-3 text-center font-medium">
                      {item.selectedMeters ? `${item.selectedMeters} Meters` : item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-700">{formatINR(item.unitPrice)}</td>
                    <td className="py-3 px-3 text-right text-gray-500">{formatINR(item.tax)}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#1E1B1B]">{formatINR(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1E1B1B]">{formatINR(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Privilege Coupon ({order.couponCode || 'APPLIED'})</span>
                  <span className="font-semibold">-{formatINR(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Integrated GST (5%)</span>
                <span>{formatINR(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Handloom Shipping</span>
                <span>{order.shippingAmount === 0 ? 'FREE' : formatINR(order.shippingAmount)}</span>
              </div>
              <div className="border-t-2 border-[#7A142A] pt-2 flex justify-between text-sm font-bold text-[#1E1B1B]">
                <span>Total Payable</span>
                <span className="text-[#7A142A]">{formatINR(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="pt-6 border-t border-[#EAE3DA] flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 gap-2">
            <p>
              This is an authentic computer-generated invoice from KK COLLECTION. Every drape is handwoven with pride.
            </p>
            <div className="flex items-center gap-1 text-[#7A142A] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Certified Authentic Weave
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
