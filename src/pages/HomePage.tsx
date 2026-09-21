import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Award, Heart, Star, Compass, Clock, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/products/ProductCard';
import { Product } from '../types';
import { BrandLogo } from '../components/common/BrandLogo';

interface HomePageProps {
  setCurrentView: (view: string) => void;
  setSelectedCategory: (cat: string | null) => void;
  onSelectProduct: (productId: string) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentView,
  setSelectedCategory,
  onSelectProduct,
  onQuickView,
}) => {
  const { products, categories, reviews } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  const styleSegments = [
    { title: 'Wedding & Bridal', desc: 'Heavy Korvai Kanchipuram & Kadwa Banarasi', icon: '👑', tag: 'Wedding' },
    { title: 'Festive Privileges', desc: 'Sambalpuri Bandha Pata & Chanderi Tissue', icon: '🪔', tag: 'Festive' },
    { title: 'Young & Contemporary', desc: 'Organza, Gota Patti suits & modern silhouettes', icon: '✨', tag: 'Young & Trendy' },
    { title: 'Office & Daily Elegance', desc: 'Organic Khadi Cotton & breathable handlooms', icon: '🌿', tag: 'Office Wear' },
  ];

  const handleCategoryNav = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative min-h-[560px] sm:min-h-[640px] bg-[#2E050F] text-[#FAF8F5] overflow-hidden flex items-center">
        {/* Background Atmosphere */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85"
            alt="Handwoven Indian Saree Drape"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#24050D] via-[#360611]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24050D] via-transparent to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#540D1E]/90 border border-[#C5A059]/40 rounded-full text-xs text-[#F3DEAB] tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Timeless Handloom Masterpieces</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF8F5] leading-[1.08]">
                KK COLLECTION
              </h1>
              <p className="font-serif italic text-2xl sm:text-3xl text-[#C5A059] font-medium tracking-wide">
                Every Drape, A Story.
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#FAF8F5]/80 leading-relaxed font-normal max-w-xl">
              Discover timeless Indian textiles crafted for every occasion. From sacred Sambalpuri Pata silks to Varanasi Katan and pure artisanal fabrics sold by the meter.
            </p>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                id="hero-shop-sarees-btn"
                onClick={() => handleCategoryNav('sarees')}
                className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#D8B26E] text-[#24050D] text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
              >
                <span>Shop Sarees</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-explore-arrivals-btn"
                onClick={() => handleCategoryNav('new-arrivals')}
                className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-[#FAF8F5] text-xs font-bold uppercase tracking-widest rounded-xl border border-[#FAF8F5]/40 hover:border-white transition-all flex items-center gap-2"
              >
                <span>Explore New Arrivals</span>
              </button>
            </div>

            {/* Silk Mark & Handloom Assurance */}
            <div className="pt-6 border-t border-[#C5A059]/20 flex items-center gap-6 text-xs text-[#FAF8F5]/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>100% Certified Silk Mark</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C5A059]" />
                <span>Direct Artisan Cooperative</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <p className="font-serif italic text-sm text-[#7A142A] uppercase tracking-widest">
            Curated Weaves
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1B]">
            Shop by Category
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryNav(cat.slug)}
              className="group relative bg-white rounded-2xl border border-[#EAE3DA] overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col text-center"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#F4EFEA]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                <h3 className="font-serif font-bold text-sm text-[#1E1B1B] group-hover:text-[#7A142A] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-[#7A142A] font-semibold mt-1 inline-flex items-center justify-center gap-1">
                  Explore <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Shop by Style / Segment */}
      <section className="bg-[#F4EFEA] py-14 border-y border-[#EAE3DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <p className="font-serif italic text-sm text-[#7A142A] uppercase tracking-widest">
              Merchandised For You
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1B]">
              Shop by Segment &amp; Occasion
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {styleSegments.map((segment) => (
              <div
                key={segment.title}
                onClick={() => {
                  setSelectedCategory('sarees');
                  setCurrentView('catalog');
                }}
                className="p-6 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3">{segment.icon}</div>
                  <h3 className="font-serif font-bold text-lg text-[#1E1B1B] group-hover:text-[#7A142A] transition-colors">
                    {segment.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {segment.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4EFEA] flex items-center justify-between text-xs font-semibold text-[#7A142A]">
                  <span>Discover Segment</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Royal Silks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="font-serif italic text-sm text-[#7A142A] uppercase tracking-widest">
              Handpicked Heirlooms
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1B]">
              Featured Masterpieces
            </h2>
          </div>
          <button
            onClick={() => handleCategoryNav('sarees')}
            className="text-xs font-bold uppercase tracking-widest text-[#7A142A] hover:text-[#9B1A36] flex items-center gap-1.5"
          >
            <span>View All Handloom Silks</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* 5. Craftsmanship & Heritage Loom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#420A16] text-[#FAF8F5] overflow-hidden border border-[#C5A059]/40 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-12 lg:p-16 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F3DEAB] uppercase tracking-widest">
                <Compass className="w-4 h-4 text-[#C5A059]" />
                <span>The Story of the Shuttle</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-[#FAF8F5]">
                Why KK COLLECTION Drapes Are Irreplaceable
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF8F5]/80 leading-relaxed">
                In an era of mass industrial print, we preserve the meditative rhythm of authentic Indian pit looms. A Sambalpuri Bandha saree takes up to 45 days of painstaking warp-and-weft tie-dye calibration. Every thread carries the weaver’s lineage.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-[#540D1E] rounded-xl border border-[#C5A059]/30">
                  <p className="font-serif text-2xl font-bold text-[#F3DEAB]">100%</p>
                  <p className="text-[11px] text-[#FAF8F5]/70">Pure Handloom Mulberry Silk</p>
                </div>
                <div className="p-3 bg-[#540D1E] rounded-xl border border-[#C5A059]/30">
                  <p className="font-serif text-2xl font-bold text-[#F3DEAB]">500+</p>
                  <p className="text-[11px] text-[#FAF8F5]/70">Artisan Weaver Families Supported</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('about')}
                className="px-6 py-3 bg-[#C5A059] hover:bg-[#D8B26E] text-[#24050D] text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow"
              >
                Read Our Weaver Heritage Story
              </button>
            </div>

            <div className="h-full min-h-[300px] lg:min-h-[460px] relative">
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85"
                alt="Indian handloom pit loom artisan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#420A16] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="font-serif italic text-sm text-[#7A142A] uppercase tracking-widest">
              Most Adored Weaves
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1B]">
              Customer Bestsellers
            </h2>
          </div>
          <button
            onClick={() => handleCategoryNav('sarees')}
            className="text-xs font-bold uppercase tracking-widest text-[#7A142A] hover:text-[#9B1A36] flex items-center gap-1.5"
          >
            <span>Explore Entire Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </section>

      {/* 7. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <p className="font-serif italic text-sm text-[#7A142A] uppercase tracking-widest">
            Client Voices
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1B]">
            Stories in Every Drape
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <h4 className="font-serif font-bold text-base text-[#1E1B1B]">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1E1B1B]">{rev.userName}</span>
                  <p className="text-[10px] text-gray-400">Verified Handloom Connoisseur</p>
                </div>
                {rev.verifiedPurchase && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3" /> Verified Drape
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
