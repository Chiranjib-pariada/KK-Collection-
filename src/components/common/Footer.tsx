import React from 'react';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, Truck, RefreshCw, Award, Mail, Phone, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
  setSelectedCategory: (cat: string | null) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView, setSelectedCategory }) => {
  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#24050D] text-[#FAF8F5] pt-16 pb-8 border-t-2 border-[#C5A059]/40 relative overflow-hidden">
      {/* Subtle Indian motif background overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* 1. Value Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#540D1E]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#540D1E] border border-[#C5A059]/50 flex items-center justify-center text-[#F3DEAB] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3DEAB]">100% Certified Silk Mark</h4>
              <p className="text-[11px] text-[#FAF8F5]/70 mt-0.5">Directly sourced from certified master handloom weavers</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#540D1E] border border-[#C5A059]/50 flex items-center justify-center text-[#F3DEAB] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3DEAB]">Free Shipping Pan-India</h4>
              <p className="text-[11px] text-[#FAF8F5]/70 mt-0.5">Complimentary insured delivery on orders above ₹1,999</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#540D1E] border border-[#C5A059]/50 flex items-center justify-center text-[#F3DEAB] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3DEAB]">7-Day Hassle-Free Returns</h4>
              <p className="text-[11px] text-[#FAF8F5]/70 mt-0.5">Easy returns and doorstep pickup for unworn drapes</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#540D1E] border border-[#C5A059]/50 flex items-center justify-center text-[#F3DEAB] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F3DEAB]">Authentic Heritage Zari</h4>
              <p className="text-[11px] text-[#FAF8F5]/70 mt-0.5">Pure tested metallic zari with guaranteed longevity</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Intro */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" variant="light" onClick={() => handleLinkClick('home')} />
            <p className="text-xs text-[#FAF8F5]/80 leading-relaxed max-w-sm">
              KK COLLECTION celebrates the undying poetry of Indian textiles. From sacred Sambalpuri Bandha ikat to Varanasi Katan and Kanchipuram temple weaves, every drape tells a story of heritage, rhythm, and devotion.
            </p>
            <div className="pt-2 flex flex-col space-y-2 text-xs text-[#FAF8F5]/75">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Patia Heritage Loom Quarter, Bhubaneswar, Odisha — 751024</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>concierge@kkcollection.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>+91 800-KK-DRAPE (553-7273)</span>
              </div>
            </div>
          </div>

          {/* Heritage Weaves */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-[#F3DEAB] mb-4 pb-1 border-b border-[#540D1E]">
              Heritage Weaves
            </h3>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/80">
              <li>
                <button onClick={() => handleCategoryClick('sarees')} className="hover:text-[#F3DEAB] transition-colors">
                  Banarasi Katan Silks
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('pata-sarees')} className="hover:text-[#F3DEAB] transition-colors">
                  Sambalpuri Pata Sarees
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('sarees')} className="hover:text-[#F3DEAB] transition-colors">
                  Kanchipuram Bridal Weaves
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('pata-sarees')} className="hover:text-[#F3DEAB] transition-colors">
                  Bomkai &amp; Khandua Pata
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('dress-materials')} className="hover:text-[#F3DEAB] transition-colors">
                  Chanderi Luxury Suits
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('fabrics')} className="hover:text-[#F3DEAB] transition-colors">
                  Pure Raw Silk Fabrics (Per Meter)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Concierge */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-[#F3DEAB] mb-4 pb-1 border-b border-[#540D1E]">
              Client Concierge
            </h3>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/80">
              <li>
                <button onClick={() => handleLinkClick('track-order')} className="hover:text-[#F3DEAB] transition-colors">
                  Track Live Shipment
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('account')} className="hover:text-[#F3DEAB] transition-colors">
                  My Orders &amp; Invoices
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('wishlist')} className="hover:text-[#F3DEAB] transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-[#F3DEAB] transition-colors">
                  Our Weaver Artisans
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-[#F3DEAB] transition-colors">
                  Silk Mark Certification
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('about')} className="hover:text-[#F3DEAB] transition-colors">
                  Shipping &amp; Return Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Privilege Club */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-[#F3DEAB] mb-4 pb-1 border-b border-[#540D1E]">
              Privilege Guild
            </h3>
            <p className="text-xs text-[#FAF8F5]/80 mb-3">
              Receive private notifications for limited handloom drops and festive heirloom collections.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to KK COLLECTION Privilege Guild.'); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full px-3 py-2 text-xs bg-[#360611] border border-[#540D1E] rounded-md text-[#FAF8F5] placeholder-[#FAF8F5]/40 focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#C5A059] hover:bg-[#D8B26E] text-[#360611] text-xs font-bold uppercase tracking-wider rounded-md transition-colors"
              >
                Join Privilege Club
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Payment Logos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#540D1E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/60">
        <div className="flex items-center gap-1">
          <span>&copy; {new Date().getFullYear()} KK COLLECTION. All rights reserved. Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
          <span>for Indian Handlooms.</span>
        </div>

        {/* Payment badges */}
        <div className="flex items-center gap-3 text-[11px] text-[#FAF8F5]/80">
          <span className="px-2 py-0.5 bg-[#360611] border border-[#540D1E] rounded">Razorpay Secure</span>
          <span className="px-2 py-0.5 bg-[#360611] border border-[#540D1E] rounded">UPI &amp; Cards</span>
          <span className="px-2 py-0.5 bg-[#360611] border border-[#540D1E] rounded">Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
};
