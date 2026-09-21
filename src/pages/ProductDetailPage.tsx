import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Star,
  Check,
  Truck,
  RotateCcw,
  Sparkles,
  Share2,
  ChevronRight,
  MessageCircle,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { Product, Review } from '../types';
import { useStore } from '../context/StoreContext';
import { formatINR, formatDate, isValidIndianPincode } from '../utils/formatters';
import { ProductCard } from '../components/products/ProductCard';

interface ProductDetailPageProps {
  productId: string;
  onSelectProduct: (id: string) => void;
  onQuickView: (prod: Product) => void;
  onOpenCart: () => void;
  onProceedCheckout: () => void;
  setCurrentView: (view: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onSelectProduct,
  onQuickView,
  onOpenCart,
  onProceedCheckout,
  setCurrentView,
}) => {
  const { products, addToCart, isInWishlist, toggleWishlist, reviews, addReview, settings } = useStore();

  const product = products.find((p) => p.id === productId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedMeters, setSelectedMeters] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'care' | 'shipping' | 'reviews'>('description');
  const [pincodeInput, setPincodeInput] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const isMeter = product.sellingUnit === 'meter';
  const discountPercent = Math.round(((product.price - product.salePrice) / product.price) * 100);

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id && r.isApproved);

  // Recommended items
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.fabric === product.fabric))
    .slice(0, 4);

  const handleAddToCart = (directCheckout = false) => {
    const res = addToCart(
      product,
      isMeter ? 1 : quantity,
      selectedColor,
      isMeter ? selectedMeters : undefined
    );
    if (res.success) {
      setAddedAnimation(true);
      setTimeout(() => {
        setAddedAnimation(false);
        if (directCheckout) {
          onProceedCheckout();
        } else {
          onOpenCart();
        }
      }, 400);
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeInput || !isValidIndianPincode(pincodeInput)) {
      setDeliveryResult('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    setDeliveryResult(`Serviceable by Blue Dart Express! Estimated delivery in 3–4 business days with complimentary handloom insurance.`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle || !reviewComment || !reviewName) return;

    addReview({
      productId: product.id,
      userId: 'usr-guest',
      userName: reviewName,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verifiedPurchase: true,
    });

    setReviewSuccess(true);
    setReviewTitle('');
    setReviewComment('');
    setReviewName('');
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello KK Collection, I am interested in ${product.name}, SKU ${product.sku}. Is it available?`
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <button onClick={() => setCurrentView('home')} className="hover:text-[#7A142A]">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => setCurrentView('catalog')} className="hover:text-[#7A142A]">
          {product.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1E1B1B] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. Main Product Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[#F4EFEA] border border-[#EAE3DA] shadow-sm">
            <img
              src={product.images[activeImageIndex] || product.primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#7A142A] text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow">
                {discountPercent}% OFF
              </span>
            )}
            {product.fabric.toLowerCase().includes('silk') && (
              <span className="absolute bottom-4 left-4 px-3 py-1 bg-[#420A16]/90 backdrop-blur-xs text-[#F3DEAB] text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-[#C5A059]/40 shadow">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" /> 100% Certified Silk Mark
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#7A142A] scale-105 shadow-md'
                      : 'border-[#EAE3DA] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span className="uppercase tracking-widest font-bold text-[#7A142A]">
                {product.categoryName} &bull; {product.brand}
              </span>
              <span className="font-mono text-gray-400">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1B1B] leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-[#F4EFEA] rounded-2xl border border-[#EAE3DA] space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#7A142A]">
                {formatINR(product.salePrice)}
              </span>
              {product.price > product.salePrice && (
                <span className="text-base text-gray-400 line-through">
                  {formatINR(product.price)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">
              {isMeter ? 'Sold by meter • Select length below' : 'Inclusive of all GST (5%) • Eligible for Free Express Delivery'}
            </p>
          </div>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Meter selector for Fabrics or Quantity selector for Sarees */}
          {isMeter ? (
            <div className="p-4 bg-white rounded-2xl border border-[#EAE3DA] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E1B1B]">Select Custom Fabric Cut:</span>
                <span className="text-xs text-gray-500">{product.stockQuantity}m remaining in loom</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 1.5, 2, 2.5, 3, 4, 5, 6].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMeters(m)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedMeters === m
                        ? 'bg-[#7A142A] text-white border-[#7A142A] shadow-xs'
                        : 'bg-[#FAF8F5] text-gray-700 border-[#EAE3DA] hover:bg-[#F4EFEA]'
                    }`}
                  >
                    {m} Meters
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#7A142A] font-semibold pt-1">
                Calculated Fabric Total: {formatINR((product.meterPrice || product.salePrice) * selectedMeters)}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-[#1E1B1B]">Quantity:</span>
              <div className="flex items-center border border-[#EAE3DA] rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-sm hover:bg-[#F4EFEA]"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="px-4 py-2 text-sm hover:bg-[#F4EFEA]"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500">
                ({product.stockQuantity} drapes remaining)
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                id="pdp-add-to-cart-btn"
                onClick={() => handleAddToCart(false)}
                disabled={product.stockQuantity <= 0}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#7A142A] hover:bg-[#9B1A36] text-[#FAF8F5]'
                }`}
              >
                {addedAnimation ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>Add to Drape Bag</span>
              </button>

              <button
                id="pdp-buy-now-btn"
                onClick={() => handleAddToCart(true)}
                disabled={product.stockQuantity <= 0}
                className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest bg-[#C5A059] hover:bg-[#D8B26E] text-[#24050D] shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Buy Now</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-2xl border border-[#EAE3DA] transition-colors ${
                  inWishlist
                    ? 'bg-[#7A142A] text-white border-[#7A142A]'
                    : 'bg-white text-gray-700 hover:text-[#7A142A]'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Direct WhatsApp Concierge Inquiry */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire &amp; Video Call on WhatsApp (SKU: {product.sku})</span>
            </a>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="w-full text-center text-xs text-gray-500 hover:text-[#1E1B1B] flex items-center justify-center gap-1.5 pt-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link copied to clipboard!' : 'Share drape with family & friends'}</span>
            </button>
          </div>

          {/* Delivery PIN Code Checker */}
          <div className="p-4 bg-white rounded-2xl border border-[#EAE3DA] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1E1B1B]">
              <Truck className="w-4 h-4 text-[#7A142A]" />
              <span>Check Delivery Estimate &amp; COD Availability</span>
            </div>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit PIN code (e.g. 751024)"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl focus:outline-none focus:border-[#7A142A]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#540D1E] hover:bg-[#7A142A] text-white text-xs font-semibold rounded-xl"
              >
                Check
              </button>
            </form>
            {deliveryResult && (
              <p className="text-xs text-emerald-700 font-medium">{deliveryResult}</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Detailed Tabs Section */}
      <div className="bg-white rounded-3xl border border-[#EAE3DA] overflow-hidden shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-[#EAE3DA] overflow-x-auto bg-[#FAF8F5]">
          {[
            { id: 'description', label: 'Weave Story & Drape' },
            { id: 'specifications', label: 'Technical Specifications' },
            { id: 'care', label: 'Fabric Care & Preservation' },
            { id: 'shipping', label: 'Shipping & 7-Day Returns' },
            { id: 'reviews', label: `Client Reviews (${productReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#7A142A] text-[#7A142A] bg-white'
                  : 'border-transparent text-gray-500 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="font-serif text-lg font-bold text-[#1E1B1B]">
                Heritage &amp; Craftsmanship of {product.name}
              </h3>
              <p>{product.description}</p>
              <div className="p-4 bg-[#FAF8F5] border border-[#EAE3DA] rounded-2xl flex items-center gap-4 mt-4">
                <ShieldCheck className="w-8 h-8 text-[#C5A059] shrink-0" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1E1B1B]">Authentic Handloom Certification</h4>
                  <p className="text-xs text-gray-600">
                    Sourced directly from registered weavers’ clusters. Each saree comes with an individual Silk Mark tag and authenticity seal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DA]">
                <span className="text-gray-400 block text-[10px] uppercase">Fabric Composition</span>
                <span className="font-semibold text-[#1E1B1B]">{product.fabric}</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DA]">
                <span className="text-gray-400 block text-[10px] uppercase">Color &amp; Zari Shade</span>
                <span className="font-semibold text-[#1E1B1B]">{product.color}</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DA]">
                <span className="text-gray-400 block text-[10px] uppercase">Pattern / Motifs</span>
                <span className="font-semibold text-[#1E1B1B]">{product.pattern}</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DA]">
                <span className="text-gray-400 block text-[10px] uppercase">Dimensions</span>
                <span className="font-semibold text-[#1E1B1B]">{product.length} &bull; Width: {product.width}</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DA]">
                <span className="text-gray-400 block text-[10px] uppercase">Blouse Piece</span>
                <span className="font-semibold text-[#1E1B1B]">{product.blouseIncluded ? 'Yes, Included (Running Unstitched)' : 'Sold Separately'}</span>
              </div>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DA]">
                <span className="text-gray-400 block text-[10px] uppercase">Approximate Net Weight</span>
                <span className="font-semibold text-[#1E1B1B]">{product.weight}</span>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-serif text-lg font-bold text-[#1E1B1B]">Preserving Your Heirloom Drape</h3>
              <p>{product.careInstructions}</p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600">
                <li>Never machine wash or tumble dry fine handwoven zari silks.</li>
                <li>Wrap the saree in breathable pure cotton or muslin fabric. Avoid plastic covers that trap moisture.</li>
                <li>Air your pure silks in shade once every six months to maintain yarn elasticity.</li>
                <li>Iron with low heat on the reverse side or place a damp cotton cloth between the iron and the fabric.</li>
              </ul>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="font-serif text-lg font-bold text-[#1E1B1B]">Delivery &amp; Exchange Privileges</h3>
              <p>
                All orders are dispatched in bespoke luxury protective boxes lined with unbleached muslin cloth to protect pure zari threads in transit.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
                <li>Complimentary insured shipping on all orders above ₹1,999.</li>
                <li>Fast Pan-India delivery via Blue Dart Express in 3–5 business days.</li>
                <li>Doorstep pickup for hassle-free 7-day exchanges and return requests.</li>
                <li>Cash on Delivery available on orders up to ₹25,000.</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#EAE3DA]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1E1B1B]">Client Feedback &amp; Drapes</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-sm text-gray-900">{product.rating} out of 5</span>
                    <span className="text-gray-400">({product.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <p className="text-gray-500 italic">No reviews yet for this drape. Be the first to review!</p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE3DA] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#1E1B1B]">{rev.userName}</span>
                        <span className="text-[11px] text-gray-400">{formatDate(rev.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <h4 className="font-bold text-xs text-[#1E1B1B]">{rev.title}</h4>
                      <p className="text-xs text-gray-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Review Form */}
              <div className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#EAE3DA] max-w-xl">
                <h4 className="font-serif font-bold text-base text-[#1E1B1B] mb-3">
                  Share Your Drape Experience
                </h4>
                {reviewSuccess ? (
                  <p className="text-xs text-emerald-700 font-semibold">
                    Thank you! Your verified review has been published.
                  </p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g. Shalini Roy"
                        className="w-full px-3 py-2 bg-white border border-[#EAE3DA] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Rating</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="px-3 py-1.5 bg-white border border-[#EAE3DA] rounded-lg"
                      >
                        <option value={5}>5 Stars - Exceptional Heritage Handloom</option>
                        <option value={4}>4 Stars - Very Pleased</option>
                        <option value={3}>3 Stars - Average Quality</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Review Headline</label>
                      <input
                        type="text"
                        required
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="e.g. Pure silk luster and royal drape!"
                        className="w-full px-3 py-2 bg-white border border-[#EAE3DA] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Your Detailed Comments</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Describe the fabric texture, zari luster, weight, and fit..."
                        className="w-full px-3 py-2 bg-white border border-[#EAE3DA] rounded-lg"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#7A142A] text-white font-bold rounded-lg uppercase tracking-wider text-[11px]"
                    >
                      Publish Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Product Recommendations */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="space-y-1">
            <p className="font-serif italic text-xs text-[#7A142A] uppercase tracking-widest">
              Complementary Weaves
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1B1B]">
              You May Also Admire
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
