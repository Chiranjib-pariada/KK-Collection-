import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, ShieldCheck, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
}) => {
  const { addToCart, isInWishlist, toggleWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const discountPercent = Math.round(((product.price - product.salePrice) / product.price) * 100);
  const isMeter = product.sellingUnit === 'meter';
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const res = addToCart(product, 1, undefined, isMeter ? 1 : undefined);
    if (res.success) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1200);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl border border-[#EAE3DA] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(product.id)}
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4EFEA]">
        {/* Main Image & Hover Secondary Image */}
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-[#7A142A] text-[#FAF8F5] text-[10px] font-bold tracking-wider rounded-md uppercase shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.fabric.toLowerCase().includes('silk') && (
            <span className="px-1.5 py-0.5 bg-[#420A16]/90 backdrop-blur-xs text-[#F3DEAB] text-[9px] font-semibold tracking-wider rounded flex items-center gap-1 border border-[#C5A059]/40">
              <ShieldCheck className="w-2.5 h-2.5 text-[#C5A059]" /> Silk Mark
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 bg-[#C5A059] text-[#24050D] text-[9px] font-bold tracking-wider rounded uppercase">
              New Loom
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            inWishlist
              ? 'bg-[#7A142A] text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-gray-700 hover:text-[#7A142A] shadow-xs'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button (Desktop Hover) */}
        <div className="absolute inset-x-2 bottom-2 z-10 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 bg-white/95 hover:bg-white text-[#1E1B1B] hover:text-[#7A142A] text-[11px] font-semibold tracking-wider uppercase rounded-lg shadow-md flex items-center justify-center gap-1.5 border border-[#EAE3DA]"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="px-3 py-1 bg-white text-red-800 text-xs font-bold rounded uppercase tracking-wider shadow">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Meta Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Fabric tag */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span className="uppercase tracking-wider font-medium text-[#7A142A]">
              {product.categoryName}
            </span>
            <span className="truncate max-w-[110px] text-[10px] text-gray-400">
              {product.fabric}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-sm sm:text-base font-bold text-[#1E1B1B] group-hover:text-[#7A142A] line-clamp-2 transition-colors">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex text-amber-500">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3 pt-3 border-t border-[#F4EFEA] flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-bold text-[#7A142A]">
                {formatINR(product.salePrice)}
              </span>
              {product.price > product.salePrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatINR(product.price)}
                </span>
              )}
            </div>
            {isMeter ? (
              <p className="text-[10px] text-gray-500 font-medium">Per Meter</p>
            ) : isLowStock ? (
              <p className="text-[10px] text-amber-700 font-medium">Only {product.stockQuantity} left</p>
            ) : (
              <p className="text-[10px] text-emerald-700 font-medium">In Stock</p>
            )}
          </div>

          {/* Direct Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2 rounded-xl transition-all ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#540D1E] hover:bg-[#7A142A] text-[#FAF8F5] shadow-xs active:scale-95'
            }`}
            title={isMeter ? 'Add 1 meter to bag' : 'Add to bag'}
            aria-label="Add to bag"
          >
            {addedAnimation ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
