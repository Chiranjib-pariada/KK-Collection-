import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  MapPin,
  Tag,
  ChevronLeft,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Address, Order } from '../types';
import { formatINR, isValidIndianPincode } from '../utils/formatters';

interface CheckoutPageProps {
  onOrderCompleted: (order: Order) => void;
  onBackToCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderCompleted,
  onBackToCart,
}) => {
  const {
    cart,
    subtotal,
    discountAmount,
    taxAmount,
    shippingAmount,
    totalAmount,
    appliedCoupon,
    currentUser,
    userAddresses,
    addAddress,
    createOrder,
    settings,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Address, 2: Payment, 3: Review & Place

  // Contact State
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    userAddresses.find((a) => a.isDefault)?.id || userAddresses[0]?.id || 'new'
  );
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
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
    isDefault: true,
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('RAZORPAY_UPI');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1E1B1B]">Your Drape Bag is Empty</h2>
        <p className="text-xs text-gray-500">Add products to your cart before proceeding to checkout.</p>
        <button
          onClick={onBackToCart}
          className="px-6 py-2.5 bg-[#7A142A] text-white text-xs font-bold uppercase rounded-xl"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const activeShippingAddress: Address =
    selectedAddressId === 'new'
      ? { ...newAddress, id: `addr-temp-${Date.now()}` }
      : userAddresses.find((a) => a.id === selectedAddressId) || {
          ...newAddress,
          id: `addr-temp-${Date.now()}`,
        };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!customerName || !customerEmail || !customerPhone) {
      setValidationError('Please complete your customer contact details.');
      return;
    }

    if (selectedAddressId === 'new') {
      if (!newAddress.addressLine1 || !newAddress.city || !newAddress.pincode) {
        setValidationError('Please fill in complete street address, city, and PIN code.');
        return;
      }
      if (!isValidIndianPincode(newAddress.pincode)) {
        setValidationError('Please enter a valid 6-digit Indian PIN code.');
        return;
      }
      addAddress(newAddress);
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalOrderSubmit = () => {
    setIsPlacingOrder(true);

    setTimeout(() => {
      const created = createOrder({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: activeShippingAddress,
        paymentMethod,
      });

      setIsPlacingOrder(false);
      onOrderCompleted(created);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Steps Progress */}
      <div className="flex items-center justify-between max-w-xl mx-auto py-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-[#7A142A] text-white' : 'bg-[#EAE3DA] text-gray-500'
            }`}
          >
            1
          </span>
          <span className="text-xs font-bold text-[#1E1B1B]">Delivery Address</span>
        </div>
        <div className="w-12 h-0.5 bg-[#EAE3DA]" />
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-[#7A142A] text-white' : 'bg-[#EAE3DA] text-gray-500'
            }`}
          >
            2
          </span>
          <span className="text-xs font-bold text-[#1E1B1B]">Payment Option</span>
        </div>
        <div className="w-12 h-0.5 bg-[#EAE3DA]" />
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 3 ? 'bg-[#7A142A] text-white' : 'bg-[#EAE3DA] text-gray-500'
            }`}
          >
            3
          </span>
          <span className="text-xs font-bold text-[#1E1B1B]">Confirmation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Steps (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {validationError}
            </div>
          )}

          {/* STEP 1: Address & Customer Details */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {/* Contact details */}
              <div className="p-6 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-[#540D1E] flex items-center gap-2">
                  <span>1. Contact &amp; Client Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl focus:border-[#7A142A]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="ananya@example.com"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl focus:border-[#7A142A]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-gray-700">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl focus:border-[#7A142A]"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address Selector */}
              <div className="p-6 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-[#540D1E] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>2. Shipping Address in India</span>
                </h3>

                {userAddresses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {userAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-[#7A142A] bg-[#FAF8F5] shadow-sm'
                            : 'border-[#EAE3DA] bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-xs text-[#1E1B1B]">{addr.fullName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                            {addr.addressType}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                          {addr.addressLine1}, {addr.city} — {addr.pincode}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">Phone: {addr.phone}</p>
                      </div>
                    ))}

                    <div
                      onClick={() => setSelectedAddressId('new')}
                      className={`p-4 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                        selectedAddressId === 'new'
                          ? 'border-[#7A142A] bg-[#FAF8F5]'
                          : 'border-[#EAE3DA] hover:border-gray-400'
                      }`}
                    >
                      <span className="text-xs font-bold text-[#7A142A]">+ Add New Shipping Address</span>
                    </div>
                  </div>
                )}

                {/* Form for new address */}
                {selectedAddressId === 'new' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-[#F4EFEA]">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1 text-gray-700">Flat / House / Suite</label>
                      <input
                        type="text"
                        required
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                        placeholder="e.g. Flat 402, Neeladri Heritage"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-gray-700">Street / Area</label>
                      <input
                        type="text"
                        value={newAddress.addressLine2 || ''}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                        placeholder="e.g. Patia Quarter"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-gray-700">Landmark</label>
                      <input
                        type="text"
                        value={newAddress.landmark || ''}
                        onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                        placeholder="e.g. Near Infocity Gate"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-gray-700">City</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-gray-700">State</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-gray-700">Indian PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="751024"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-gray-700">Address Label</label>
                      <select
                        value={newAddress.addressType}
                        onChange={(e) => setNewAddress({ ...newAddress, addressType: e.target.value as any })}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl"
                      >
                        <option value="Home">Home (7 AM - 9 PM)</option>
                        <option value="Office">Office (10 AM - 6 PM)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={onBackToCart}
                  className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Return to Drape Bag
                </button>
                <button
                  type="submit"
                  id="checkout-proceed-payment-btn"
                  className="px-8 py-3.5 bg-[#7A142A] hover:bg-[#9B1A36] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Gateway Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#F4EFEA]">
                  <h3 className="font-serif font-bold text-base text-[#540D1E] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#C5A059]" />
                    <span>Select Payment Option</span>
                  </h3>
                  <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Razorpay 256-Bit Encrypted
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Razorpay UPI */}
                  <label
                    onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                    className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'RAZORPAY_UPI'
                        ? 'border-[#7A142A] bg-[#FAF8F5]'
                        : 'border-[#EAE3DA] bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'RAZORPAY_UPI'}
                      onChange={() => setPaymentMethod('RAZORPAY_UPI')}
                      className="mt-1 text-[#7A142A] focus:ring-[#7A142A]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1E1B1B]">
                          UPI (Google Pay / PhonePe / Paytm / BHIM)
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          Instant Approval
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Pay safely using any Indian UPI app or VPA ID directly through Razorpay.
                      </p>
                    </div>
                  </label>

                  {/* Razorpay Card */}
                  <label
                    onClick={() => setPaymentMethod('RAZORPAY_CARD')}
                    className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'RAZORPAY_CARD'
                        ? 'border-[#7A142A] bg-[#FAF8F5]'
                        : 'border-[#EAE3DA] bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'RAZORPAY_CARD'}
                      onChange={() => setPaymentMethod('RAZORPAY_CARD')}
                      className="mt-1 text-[#7A142A] focus:ring-[#7A142A]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1E1B1B]">
                          Credit &amp; Debit Cards (RuPay / Visa / Mastercard)
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">EMI Available</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Secure card tokenization via Razorpay PCI-DSS Level 1 compliant gateway.
                      </p>
                    </div>
                  </label>

                  {/* Razorpay NetBanking */}
                  <label
                    onClick={() => setPaymentMethod('RAZORPAY_NETBANKING')}
                    className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'RAZORPAY_NETBANKING'
                        ? 'border-[#7A142A] bg-[#FAF8F5]'
                        : 'border-[#EAE3DA] bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'RAZORPAY_NETBANKING'}
                      onChange={() => setPaymentMethod('RAZORPAY_NETBANKING')}
                      className="mt-1 text-[#7A142A] focus:ring-[#7A142A]"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-xs text-[#1E1B1B]">
                        Net Banking (SBI / HDFC / ICICI / Axis / 50+ Banks)
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Direct bank authentication for high-value silk purchases.
                      </p>
                    </div>
                  </label>

                  {/* Cash on Delivery (COD) */}
                  {settings.codEnabled && (
                    <label
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-[#7A142A] bg-[#FAF8F5]'
                          : 'border-[#EAE3DA] bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="mt-1 text-[#7A142A] focus:ring-[#7A142A]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#1E1B1B]">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-[10px] text-gray-500 font-semibold">
                            {settings.codFee > 0 ? `+${formatINR(settings.codFee)} handling` : 'Available'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Pay cash to the courier agent upon doorstep delivery of your handloom box. Max ₹25,000.
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Delivery Details Summary Card */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#EAE3DA] flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-500">Delivering to:</span>
                  <p className="font-bold text-[#1E1B1B]">{activeShippingAddress.fullName}, {activeShippingAddress.city} ({activeShippingAddress.pincode})</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#7A142A] hover:underline font-semibold"
                >
                  Change
                </button>
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Address
                </button>
                <button
                  type="button"
                  id="checkout-place-order-final-btn"
                  onClick={handleFinalOrderSubmit}
                  disabled={isPlacingOrder}
                  className="px-8 py-3.5 bg-[#7A142A] hover:bg-[#9B1A36] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isPlacingOrder ? (
                    <span>Verifying with Razorpay...</span>
                  ) : (
                    <>
                      <span>Place Order &bull; {formatINR(paymentMethod === 'COD' ? totalAmount + settings.codFee : totalAmount)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#EAE3DA] shadow-xs space-y-5 sticky top-36">
          <h3 className="font-serif font-bold text-base text-[#540D1E] pb-2 border-b border-[#F4EFEA]">
            Drape Bag Summary ({cart.length})
          </h3>

          {/* Items summary */}
          <div className="divide-y divide-[#F4EFEA] max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center gap-3">
                <img
                  src={item.product.primaryImage}
                  alt=""
                  className="w-12 h-14 object-cover rounded-lg border border-[#EAE3DA]"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-semibold text-[#1E1B1B] truncate">{item.product.name}</h5>
                  <p className="text-[10px] text-gray-500">
                    {item.selectedMeters ? `${item.selectedMeters}m Cut` : `Qty: ${item.quantity}`} &bull; {item.product.fabric}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#7A142A]">
                  {formatINR(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="pt-2 border-t border-[#EAE3DA] space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Cart Subtotal</span>
              <span className="font-semibold text-[#1E1B1B]">{formatINR(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Privilege Discount ({appliedCoupon?.code})</span>
                <span className="font-semibold">-{formatINR(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST / Handloom Tax (5%)</span>
              <span>{formatINR(taxAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Insured Shipping</span>
              <span>{shippingAmount === 0 ? <strong className="text-emerald-700">FREE</strong> : formatINR(shippingAmount)}</span>
            </div>
            {paymentMethod === 'COD' && settings.codFee > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Cash on Delivery Handling</span>
                <span>{formatINR(settings.codFee)}</span>
              </div>
            )}
            <div className="border-t-2 border-[#7A142A] pt-2 flex justify-between text-sm font-bold text-[#1E1B1B]">
              <span>Final Order Total</span>
              <span className="text-base text-[#7A142A]">
                {formatINR(paymentMethod === 'COD' ? totalAmount + settings.codFee : totalAmount)}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DA] text-[11px] text-gray-600 space-y-1">
            <p className="flex items-center gap-1.5 font-semibold text-[#1E1B1B]">
              <Truck className="w-3.5 h-3.5 text-[#7A142A]" /> Blue Dart Express Insured Delivery
            </p>
            <p>Estimated doorstep delivery in 3 to 4 business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
