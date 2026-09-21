import React from 'react';
import { Sparkles, ShieldCheck, Compass, Heart, Users, Award } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* 1. Brand Philosophy Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <BrandLogo size="lg" variant="dark" showTagline={true} />
        <div className="w-16 h-0.5 bg-[#C5A059] mx-auto mt-4" />
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1E1B1B] pt-2">
          The Sacred Rhythm of Indian Looms
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed font-serif italic">
          "Every thread drawn across the shuttle carries the memory of an artisan, the devotion of a heritage, and a story waiting to unfold."
        </p>
      </div>

      {/* 2. Brand Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-xl border border-[#EAE3DA] aspect-[4/5] bg-[#F4EFEA]">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
            alt="Artisan weaving Indian handloom saree"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4EFEA] text-[#7A142A] rounded-full text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Rooted in Bhubaneswar &amp; Varanasi</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1B1B]">
            Preserving Centuries of Handloom Mastery
          </h2>

          <p>
            Founded with a singular reverent vision, <strong>KK COLLECTION</strong> bridges the timeless artistry of regional pit looms directly to patrons across India and the globe. In an era where power looms flood the market with synthetic polyester imitations, we stand as an uncompromising sanctuary for authentic mulberry silks, genuine tested zari, and slow handcraft.
          </p>

          <p>
            Our master drapes celebrate Odisha’s sacred <em>Sambalpuri Bandha (Ikat)</em>, where threads are tied and dyed in mathematical poetry before being touched by the loom, alongside Varanasi’s regal <em>Katan &amp; Kadwa Banarasi</em> brocades that once graced ancient imperial courts.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE3DA]">
              <h4 className="font-serif font-bold text-sm text-[#7A142A]">100% Silk Mark</h4>
              <p className="text-xs text-gray-500 mt-1">Govt of India Silk Board certified genuine natural silk.</p>
            </div>
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE3DA]">
              <h4 className="font-serif font-bold text-sm text-[#7A142A]">Fair Artisan Trade</h4>
              <p className="text-xs text-gray-500 mt-1">Direct economic sustenance to 500+ master handloom families.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Pillars */}
      <div className="p-8 sm:p-12 bg-[#420A16] text-[#FAF8F5] rounded-3xl border border-[#C5A059]/40 shadow-xl space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <p className="font-serif italic text-xs text-[#C5A059] uppercase tracking-widest">
            Our Guiding Truths
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            The Three Pillars of KK COLLECTION
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="p-5 bg-[#540D1E] rounded-2xl border border-[#C5A059]/30 space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
            <h4 className="font-serif font-bold text-base text-[#F3DEAB]">Purity Without Compromise</h4>
            <p className="text-gray-300 leading-relaxed text-xs">
              Every warp and weft is tested. We pledge zero synthetic blending in our pure silk and handloom collections.
            </p>
          </div>

          <div className="p-5 bg-[#540D1E] rounded-2xl border border-[#C5A059]/30 space-y-2">
            <Heart className="w-6 h-6 text-[#C5A059]" />
            <h4 className="font-serif font-bold text-base text-[#F3DEAB]">Artisan Dignity</h4>
            <p className="text-gray-300 leading-relaxed text-xs">
              Honoring the weaver’s lineage through transparent remuneration, preserving age-old techniques for future generations.
            </p>
          </div>

          <div className="p-5 bg-[#540D1E] rounded-2xl border border-[#C5A059]/30 space-y-2">
            <Award className="w-6 h-6 text-[#C5A059]" />
            <h4 className="font-serif font-bold text-base text-[#F3DEAB]">Heirloom Longevity</h4>
            <p className="text-gray-300 leading-relaxed text-xs">
              Crafted not for ephemeral seasonal trends, but to be passed lovingly from mother to daughter across decades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
