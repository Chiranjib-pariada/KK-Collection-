import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ShieldCheck, ArrowRight, ShoppingBag, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedCheckout: () => void;
  onSelectProduct: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedCheckout,
  onSelectProduct,
}) => {
  const {
    cart,
    subtotal,
    discountAmount,
    taxAmount,
    shippingAmount,
    totalAmount,
    updateCartQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    toggleWishlist,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleQuickCouponClick = (code: string) => {
    const res = applyCoupon(code);
    setCouponFeedback(res);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#EAE3DA]">
          {/* Header */}
          <div className="p-5 bg-[#420A16] text-[#FAF8F5] border-b border-[#C5A059]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#F3DEAB]" />
              <div>
                <h2 className="font-serif text-lg font-bold tracking-wide">Your Drape Bag</h2>
                <p className="text-[11px] text-[#F3DEAB]/80">
                  {cart.length} {cart.length === 1 ? 'Handloom Item' : 'Handloom Items'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#F3DEAB] hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F4EFEA] border border-[#EAE3DA] flex items-center justify-center text-[#7A142A]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1E1B1B]">Your Drape Bag is Empty</h3>
                  <p className="text-xs text-gray-500 max-w-xs mt-1">
                    Discover our handwoven Banarasi, Sambalpuri Pata, and pure silk fabrics crafted by master artisans.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#7A142A] hover:bg-[#9B1A36] text-white text-xs font-semibold rounded-lg tracking-wider uppercase transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => {
                  const isMeter = item.product.sellingUnit === 'meter';
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded-xl border border-[#EAE3DA] shadow-xs flex gap-3 relative group"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.primaryImage}
                        alt={item.product.name}
                        onClick={() => {
                          onSelectProduct(item.productId);
                          onClose();
                        }}
                        className="w-20 h-24 object-cover rounded-lg cursor-pointer shrink-0 border border-[#EAE3DA]"
                      />

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4
                              onClick={() => {
                                onSelectProduct(item.productId);
                                onClose();
                              }}
                              className="text-xs font-semibold text-[#1E1B1B] hover:text-[#7A142A] cursor-pointer line-clamp-2"
                            >
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            SKU: {item.product.sku} &bull; {item.product.fabric}
                          </p>
                          {item.selectedColor && (
                            <span className="inline-block mt-1 text-[10px] bg-[#FAF8F5] border border-[#EAE3DA] px-1.5 py-0.5 rounded text-gray-600">
                              Color: {item.selectedColor}
                            </span>
                          )}
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F4EFEA]">
                          {isMeter ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-gray-600">Cut:</span>
                              <div className="flex items-center border border-[#EAE3DA] rounded bg-[#F4EFEA]">
                                <button
                                  onClick={() => updateCartQuantity(item.id, -1)}
                                  className="px-2 py-0.5 text-xs text-gray-600 hover:text-black"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-semibold text-[#1E1B1B]">
                                  {item.selectedMeters} m
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(item.id, 1)}
                                  className="px-2 py-0.5 text-xs text-gray-600 hover:text-black"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-[10px] text-gray-500">(@ {formatINR(item.unitPrice)}/m)</span>
                            </div>
                          ) : (
                            <div className="flex items-center border border-[#EAE3DA] rounded bg-[#F4EFEA]">
                              <button
                                onClick={() => updateCartQuantity(item.id, -1)}
                                className="px-2 py-0.5 text-xs text-gray-600 hover:text-black"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-semibold text-[#1E1B1B]">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, 1)}
                                className="px-2 py-0.5 text-xs text-gray-600 hover:text-black"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          <div className="text-right">
                            <span className="text-xs font-bold text-[#7A142A]">
                              {formatINR(item.totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Free Shipping Progress Indicator */}
                <div className="p-3 bg-[#F4EFEA] border border-[#EAE3DA] rounded-xl">
                  {subtotal >= settings.freeShippingThreshold ? (
                    <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Complimentary Handloom Shipping Unlocked!</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-700">
                        Add <span className="font-bold text-[#7A142A]">{formatINR(settings.freeShippingThreshold - subtotal)}</span> more for Free Insured Delivery!
                      </p>
                      <div className="w-full bg-[#EAE3DA] h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-[#7A142A] h-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (subtotal / settings.freeShippingThreshold) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Coupon Code Section */}
                <div className="p-3.5 bg-white border border-[#EAE3DA] rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1E1B1B] flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#C5A059]" /> Privilege Coupons
                    </span>
                    {appliedCoupon && (
                      <button
                        onClick={removeCoupon}
                        className="text-[10px] text-red-600 hover:underline font-medium"
                      >
                        Remove ({appliedCoupon.code})
                      </button>
                    )}
                  </div>

                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. WELCOME10, FESTIVE500"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#EAE3DA] rounded-lg focus:outline-none focus:border-[#7A142A] uppercase"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#540D1E] hover:bg-[#7A142A] text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  ) : (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center justify-between">
                      <span>Applied: <strong>{appliedCoupon.code}</strong></span>
                      <span className="font-bold">-{formatINR(discountAmount)}</span>
                    </div>
                  )}

                  {couponFeedback && (
                    <p className={`text-[11px] ${couponFeedback.success ? 'text-emerald-700' : 'text-red-600'}`}>
                      {couponFeedback.message}
                    </p>
                  )}

                  {/* Available coupon chips */}
                  {!appliedCoupon && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleQuickCouponClick('WELCOME10')}
                        className="text-[10px] px-2 py-0.5 bg-[#FAF8F5] border border-[#C5A059]/60 text-[#7A142A] rounded-full hover:bg-[#F4EFEA]"
                      >
                        WELCOME10 (10% Off)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickCouponClick('FESTIVE500')}
                        className="text-[10px] px-2 py-0.5 bg-[#FAF8F5] border border-[#C5A059]/60 text-[#7A142A] rounded-full hover:bg-[#F4EFEA]"
                      >
                        FESTIVE500 (₹500 Off)
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#EAE3DA] shadow-lg space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1E1B1B]">{formatINR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Privilege Discount</span>
                    <span className="font-semibold">-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span>{formatINR(taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping &amp; Insurance</span>
                  <span>{shippingAmount === 0 ? <strong className="text-emerald-700">FREE</strong> : formatINR(shippingAmount)}</span>
                </div>
                <div className="border-t border-[#EAE3DA] pt-2 flex justify-between text-sm font-bold text-[#1E1B1B]">
                  <span>Total Amount</span>
                  <span className="text-base text-[#7A142A]">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <button
                id="cart-drawer-checkout-btn"
                onClick={() => {
                  onProceedCheckout();
                  onClose();
                }}
                className="w-full py-3 bg-[#7A142A] hover:bg-[#9B1A36] text-[#FAF8F5] font-bold text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-gray-500 text-center">
                Guaranteed safe checkout &bull; Verified Razorpay 256-bit SSL &bull; Cash on Delivery Available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
