import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Star, Check, ArrowRight, Share2 } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (productId: string) => void;
  onOpenCart: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewFullDetails,
  onOpenCart,
}) => {
  const { addToCart, isInWishlist, toggleWishlist } = useStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedMeters, setSelectedMeters] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const isMeter = product.sellingUnit === 'meter';
  const discountPercent = Math.round(((product.price - product.salePrice) / product.price) * 100);

  const handleAddToCart = () => {
    const res = addToCart(
      product,
      isMeter ? 1 : quantity,
      selectedColor,
      isMeter ? selectedMeters : undefined
    );
    if (res.success) {
      setAddedSuccess(true);
      setTimeout(() => {
        setAddedSuccess(false);
        onClose();
        onOpenCart();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#EAE3DA] overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black flex items-center justify-center shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Left Image Gallery */}
        <div className="md:w-1/2 bg-[#F4EFEA] p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EAE3DA]">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-white shadow-inner">
            <img
              src={product.images[activeImageIndex] || product.primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#7A142A] text-white text-[10px] font-bold rounded uppercase">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-[#7A142A] scale-105 shadow-sm' : 'border-[#EAE3DA] opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Right Product Info */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span className="uppercase tracking-wider font-semibold text-[#7A142A]">
                  {product.categoryName}
                </span>
                <span>&bull;</span>
                <span className="text-gray-400">SKU: {product.sku}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1B1B] leading-snug">
                {product.name}
              </h2>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount} reviews)</span>
              {product.fabric.toLowerCase().includes('silk') && (
                <span className="ml-2 px-2 py-0.5 bg-[#420A16] text-[#F3DEAB] text-[10px] font-semibold rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#C5A059]" /> Silk Mark
                </span>
              )}
            </div>

            {/* Price block */}
            <div className="p-3 bg-[#F4EFEA] rounded-xl border border-[#EAE3DA] flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#7A142A]">
                    {formatINR(product.salePrice)}
                  </span>
                  {product.price > product.salePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatINR(product.price)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {isMeter ? 'Sold by meter • Taxes calculated at checkout' : 'Inclusive of all standard GST • Free shipping eligible'}
                </p>
              </div>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs py-1">
              <div className="p-2 bg-white rounded-lg border border-[#EAE3DA]">
                <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Fabric</span>
                <span className="font-semibold text-[#1E1B1B]">{product.fabric}</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-[#EAE3DA]">
                <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Length</span>
                <span className="font-semibold text-[#1E1B1B]">{product.length}</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-[#EAE3DA]">
                <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Color / Weave</span>
                <span className="font-semibold text-[#1E1B1B]">{product.color}</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-[#EAE3DA]">
                <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Blouse Piece</span>
                <span className="font-semibold text-[#1E1B1B]">{product.blouseIncluded ? 'Included (0.8m)' : 'Unstitched Top'}</span>
              </div>
            </div>

            {/* Fabric meters / Quantity Selector */}
            {isMeter ? (
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-[#1E1B1B]">
                  Select Cut Length (Meters):
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 2.5, 3, 4, 5].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMeters(m)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        selectedMeters === m
                          ? 'bg-[#7A142A] text-white border-[#7A142A]'
                          : 'bg-white text-gray-700 border-[#EAE3DA] hover:bg-[#F4EFEA]'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Total Fabric Cost: <strong>{formatINR((product.meterPrice || product.salePrice) * selectedMeters)}</strong>
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-semibold text-[#1E1B1B]">Quantity:</span>
                <div className="flex items-center border border-[#EAE3DA] rounded-lg bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-xs hover:bg-[#F4EFEA]"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-3 py-1 text-xs hover:bg-[#F4EFEA]"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-gray-500">
                  ({product.stockQuantity} in loom inventory)
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-5 mt-4 border-t border-[#EAE3DA] space-y-2.5">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#7A142A] hover:bg-[#9B1A36] text-[#FAF8F5]'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Drape Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Drape Bag
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border border-[#EAE3DA] transition-colors ${
                  inWishlist
                    ? 'bg-[#7A142A] text-white border-[#7A142A]'
                    : 'bg-white text-gray-700 hover:text-[#7A142A] hover:bg-[#F4EFEA]'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                onViewFullDetails(product.id);
                onClose();
              }}
              className="w-full py-2 text-xs font-semibold text-[#7A142A] hover:text-[#9B1A36] hover:underline flex items-center justify-center gap-1"
            >
              <span>View Full Specifications, Weave Story &amp; Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
