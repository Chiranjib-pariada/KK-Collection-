import React from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export interface FilterState {
  categorySlug: string | null;
  priceRange: string | null; // 'under-2k' | '2k-5k' | '5k-15k' | 'above-15k'
  fabrics: string[];
  occasions: string[];
  inStockOnly: boolean;
  blouseOnly: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  availableFabrics: string[];
  availableOccasions: string[];
  totalResults: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
  isMobileDrawerOpen,
  setIsMobileDrawerOpen,
  availableFabrics,
  availableOccasions,
  totalResults,
}) => {
  const handlePriceSelect = (range: string | null) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange === range ? null : range,
    }));
  };

  const handleFabricToggle = (fabric: string) => {
    setFilters((prev) => ({
      ...prev,
      fabrics: prev.fabrics.includes(fabric)
        ? prev.fabrics.filter((f) => f !== fabric)
        : [...prev.fabrics, fabric],
    }));
  };

  const handleOccasionToggle = (occ: string) => {
    setFilters((prev) => ({
      ...prev,
      occasions: prev.occasions.includes(occ)
        ? prev.occasions.filter((o) => o !== occ)
        : [...prev.occasions, occ],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categorySlug: null,
      priceRange: null,
      fabrics: [],
      occasions: [],
      inStockOnly: false,
      blouseOnly: false,
    });
  };

  const hasActiveFilters =
    filters.categorySlug !== null ||
    filters.priceRange !== null ||
    filters.fabrics.length > 0 ||
    filters.occasions.length > 0 ||
    filters.inStockOnly ||
    filters.blouseOnly;

  const filterContent = (
    <div className="space-y-6 text-xs text-[#1E1B1B]">
      {/* 1. Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DA]">
        <span className="font-serif font-bold text-sm text-[#540D1E] flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#C5A059]" /> Filter Drapes
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[11px] text-[#7A142A] hover:underline font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* 2. Price Range */}
      <div>
        <h4 className="font-semibold text-xs text-[#540D1E] uppercase tracking-wider mb-2.5">
          Price Range
        </h4>
        <div className="space-y-1.5">
          {[
            { id: 'under-2k', label: 'Under ₹2,000' },
            { id: '2k-5k', label: '₹2,000 — ₹5,000' },
            { id: '5k-15k', label: '₹5,000 — ₹15,000' },
            { id: 'above-15k', label: 'Above ₹15,000 (Royal Silks)' },
          ].map((item) => (
            <label
              key={item.id}
              onClick={() => handlePriceSelect(item.id)}
              className="flex items-center gap-2 cursor-pointer hover:text-[#7A142A] select-none py-0.5"
            >
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === item.id}
                onChange={() => {}}
                className="text-[#7A142A] focus:ring-[#7A142A]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Fabrics & Weaves */}
      <div>
        <h4 className="font-semibold text-xs text-[#540D1E] uppercase tracking-wider mb-2.5">
          Pure Fabrics &amp; Weaves
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {availableFabrics.map((fabric) => (
            <label
              key={fabric}
              onClick={() => handleFabricToggle(fabric)}
              className="flex items-center gap-2 cursor-pointer hover:text-[#7A142A] select-none py-0.5"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  filters.fabrics.includes(fabric)
                    ? 'bg-[#7A142A] border-[#7A142A] text-white'
                    : 'border-[#EAE3DA] bg-white'
                }`}
              >
                {filters.fabrics.includes(fabric) && <Check className="w-3 h-3" />}
              </div>
              <span className="truncate">{fabric}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Occasion */}
      <div>
        <h4 className="font-semibold text-xs text-[#540D1E] uppercase tracking-wider mb-2.5">
          Occasion
        </h4>
        <div className="space-y-1.5">
          {availableOccasions.map((occ) => (
            <label
              key={occ}
              onClick={() => handleOccasionToggle(occ)}
              className="flex items-center gap-2 cursor-pointer hover:text-[#7A142A] select-none py-0.5"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  filters.occasions.includes(occ)
                    ? 'bg-[#7A142A] border-[#7A142A] text-white'
                    : 'border-[#EAE3DA] bg-white'
                }`}
              >
                {filters.occasions.includes(occ) && <Check className="w-3 h-3" />}
              </div>
              <span>{occ}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 5. Toggles */}
      <div className="pt-2 border-t border-[#EAE3DA] space-y-2">
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="font-medium">In Stock Drapes Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
            className="rounded text-[#7A142A] focus:ring-[#7A142A]"
          />
        </label>
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="font-medium">Includes Blouse Piece</span>
          <input
            type="checkbox"
            checked={filters.blouseOnly}
            onChange={(e) => setFilters((prev) => ({ ...prev, blouseOnly: e.target.checked }))}
            className="rounded text-[#7A142A] focus:ring-[#7A142A]"
          />
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-[#EAE3DA] shadow-xs sticky top-36">
        {filterContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs bg-[#FAF8F5] p-5 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DA]">
                <h3 className="font-serif font-bold text-base text-[#540D1E]">Filters</h3>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 text-gray-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {filterContent}
              </div>

              <div className="pt-3 border-t border-[#EAE3DA]">
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full py-2.5 bg-[#7A142A] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow"
                >
                  Show {totalResults} Drapes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
