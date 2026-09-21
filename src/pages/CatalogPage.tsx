import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFilters, FilterState } from '../components/products/ProductFilters';
import { Product } from '../types';

interface CatalogPageProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectProduct: (productId: string) => void;
  onQuickView: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  onQuickView,
}) => {
  const { products, categories } = useStore();

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    categorySlug: selectedCategory,
    priceRange: null,
    fabrics: [],
    occasions: [],
    inStockOnly: false,
    blouseOnly: false,
  });

  const [sortOption, setSortOption] = useState<string>('recommended');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const itemsPerPage = 8;

  // Synchronize category change from header
  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, categorySlug: selectedCategory }));
    setCurrentPage(1);
  }, [selectedCategory]);

  // Extract unique fabrics and occasions from database
  const availableFabrics = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.fabric));
    return Array.from(set);
  }, [products]);

  const availableOccasions = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.occasion));
    return Array.from(set);
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.fabric.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.categoryName.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q) ||
          product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // 2. Category
      if (filters.categorySlug) {
        if (filters.categorySlug === 'new-arrivals' && !product.isNew) return false;
        if (filters.categorySlug === 'offers' && product.price <= product.salePrice) return false;
        if (
          filters.categorySlug !== 'new-arrivals' &&
          filters.categorySlug !== 'offers' &&
          product.categoryId !== `cat-${filters.categorySlug}` &&
          !product.slug.includes(filters.categorySlug)
        ) {
          // match by category slug or id
          const currentCat = categories.find((c) => c.slug === filters.categorySlug);
          if (currentCat && product.categoryId !== currentCat.id) return false;
        }
      }

      // 3. Price Range
      if (filters.priceRange) {
        const p = product.salePrice;
        if (filters.priceRange === 'under-2k' && p >= 2000) return false;
        if (filters.priceRange === '2k-5k' && (p < 2000 || p > 5000)) return false;
        if (filters.priceRange === '5k-15k' && (p < 5000 || p > 15000)) return false;
        if (filters.priceRange === 'above-15k' && p <= 15000) return false;
      }

      // 4. Fabrics
      if (filters.fabrics.length > 0 && !filters.fabrics.includes(product.fabric)) {
        return false;
      }

      // 5. Occasions
      if (filters.occasions.length > 0 && !filters.occasions.includes(product.occasion)) {
        return false;
      }

      // 6. In Stock
      if (filters.inStockOnly && product.stockQuantity <= 0) {
        return false;
      }

      // 7. Blouse Included
      if (filters.blouseOnly && !product.blouseIncluded) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, filters, categories]);

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'price-asc':
        return list.sort((a, b) => a.salePrice - b.salePrice);
      case 'price-desc':
        return list.sort((a, b) => b.salePrice - a.salePrice);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'bestseller':
        return list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      default: // recommended
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredProducts, sortOption]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeCategoryObject = categories.find((c) => c.slug === filters.categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-[#420A16] text-[#FAF8F5] p-6 sm:p-10 rounded-3xl border border-[#C5A059]/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Handloom Archive
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
            {activeCategoryObject ? activeCategoryObject.name : 'Master Handloom Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-[#FAF8F5]/80">
            {activeCategoryObject
              ? activeCategoryObject.description
              : 'Browse certified Banarasi Katan silks, Sambalpuri Pata drapes, and luxury fabrics sold by the meter.'}
          </p>
        </div>
      </div>

      {/* 2. Controls Bar (Active Filters, Sort, Mobile Filter Button) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#EAE3DA] shadow-xs">
        {/* Results count & Mobile toggle */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <button
            id="mobile-filter-drawer-btn"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2 bg-[#F4EFEA] hover:bg-[#EAE3DA] text-[#7A142A] text-xs font-bold rounded-xl border border-[#EAE3DA] flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Drapes</span>
          </button>
          <span className="text-xs text-gray-500">
            Showing <strong className="text-[#1E1B1B]">{sortedProducts.length}</strong> authenticated drapes
          </span>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 font-medium hidden sm:inline">Sort by:</span>
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl text-xs font-semibold text-[#1E1B1B] focus:outline-none focus:border-[#7A142A] cursor-pointer"
            >
              <option value="recommended">Recommended &bull; Featured Weaves</option>
              <option value="newest">Newest Looms</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="bestseller">Client Bestsellers</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Main Catalog Grid with Sidebar */}
      <div className="flex gap-8 items-start">
        <ProductFilters
          filters={filters}
          setFilters={setFilters}
          isMobileDrawerOpen={isMobileFilterOpen}
          setIsMobileDrawerOpen={setIsMobileFilterOpen}
          availableFabrics={availableFabrics}
          availableOccasions={availableOccasions}
          totalResults={sortedProducts.length}
        />

        {/* Product Grid Area */}
        <div className="flex-1 space-y-8">
          {paginatedProducts.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-[#EAE3DA] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F4EFEA] border border-[#EAE3DA] flex items-center justify-center text-[#7A142A] mx-auto">
                <RotateCcw className="w-7 h-7 stroke-1" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1E1B1B]">No Matching Drapes Found</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Try loosening your filter parameters, searching by fabric, or clearing your current search keywords.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    categorySlug: null,
                    priceRange: null,
                    fabrics: [],
                    occasions: [],
                    inStockOnly: false,
                    blouseOnly: false,
                  });
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-[#7A142A] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          )}

          {/* 4. Server-Style Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-[#EAE3DA]">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-[#EAE3DA] bg-white text-gray-700 hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-[#7A142A] text-white shadow-md'
                        : 'bg-white text-gray-700 border border-[#EAE3DA] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-[#EAE3DA] bg-white text-gray-700 hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
