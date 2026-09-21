import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  Phone,
  ChevronDown,
  Sparkles,
  LogOut,
  Sliders,
  PackageCheck,
  Tag,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useStore } from '../../context/StoreContext';
import { formatINR } from '../../utils/formatters';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onOpenCart,
  onOpenAuth,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
}) => {
  const { cartCount, wishlist, currentUser, logout, switchRole, products } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Home', view: 'home', categorySlug: null },
    { label: 'Sarees', view: 'catalog', categorySlug: 'sarees' },
    { label: 'Pata Sarees', view: 'catalog', categorySlug: 'pata-sarees' },
    { label: 'Dress Materials', view: 'catalog', categorySlug: 'dress-materials' },
    { label: 'Fabrics / Kapda', view: 'catalog', categorySlug: 'fabrics' },
    { label: 'New Arrivals', view: 'catalog', categorySlug: 'new-arrivals' },
    { label: 'Offers', view: 'catalog', categorySlug: 'offers' },
    { label: 'Track Order', view: 'track-order', categorySlug: null },
    { label: 'About Us', view: 'about', categorySlug: null },
  ];

  const handleNavClick = (view: string, categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search filtered suggestions
  const searchSuggestions = searchQuery.trim().length > 1
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE3DA] transition-shadow duration-200">
      {/* 1. Top Privilege Announcement Bar */}
      <div className="bg-[#420A16] text-[#F3DEAB] px-4 py-1.5 text-xs tracking-wider border-b border-[#C5A059]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
            <span className="hidden sm:inline">Festive Privilege: Complimentary Handloom Box &amp; Free Shipping on orders above ₹1,999</span>
            <span className="sm:hidden">Free Handloom Box &amp; Shipping ₹1,999+</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#FAF8F5]/80">
            <span className="hidden md:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" /> 100% Certified Silk Mark
            </span>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#F3DEAB]" onClick={() => handleNavClick('track-order', null)}>
              <PackageCheck className="w-3.5 h-3.5" /> Track Order
            </div>
            {/* Quick Demo Switcher */}
            <div className="border-l border-[#C5A059]/40 pl-3 hidden lg:flex items-center gap-1.5">
              <span className="text-[10px] text-[#C5A059]">Role:</span>
              <button
                onClick={() => switchRole(currentUser?.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                className="bg-[#7A142A] hover:bg-[#9B1A36] text-[#FAF8F5] px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold border border-[#C5A059]/40"
              >
                {currentUser?.role === 'ADMIN' ? 'Admin View (Active)' : 'Customer View'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#540D1E] hover:text-[#7A142A] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <BrandLogo
            size="md"
            variant="dark"
            onClick={() => handleNavClick('home', null)}
          />

          {/* Desktop Search Bar */}
          <div className="hidden lg:block relative flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                id="desktop-search-input"
                placeholder="Search pure silk sarees, Pata, fabrics, or SKU..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'catalog') setCurrentView('catalog');
                }}
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#F4EFEA] border border-[#EAE3DA] rounded-full focus:outline-none focus:border-[#7A142A] focus:ring-1 focus:ring-[#7A142A] text-[#1E1B1B] placeholder-[#8A8482] transition-all"
              />
              <Search className="w-4 h-4 text-[#8A8482] absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8482] hover:text-[#1E1B1B]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-[#EAE3DA] overflow-hidden z-50">
                <div className="p-2 bg-[#F4EFEA] text-[11px] font-semibold text-[#7A142A] uppercase tracking-wider flex items-center justify-between">
                  <span>Suggested Drapes ({searchSuggestions.length})</span>
                  <span className="text-[10px] text-gray-500">Press enter to view all</span>
                </div>
                <div className="divide-y divide-[#EAE3DA]">
                  {searchSuggestions.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        onSelectProduct(prod.id);
                        setSearchQuery('');
                      }}
                      className="p-2.5 flex items-center gap-3 hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                    >
                      <img src={prod.primaryImage} alt={prod.name} className="w-10 h-12 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#1E1B1B] truncate">{prod.name}</p>
                        <p className="text-[11px] text-[#7A142A] font-semibold">{formatINR(prod.salePrice)}</p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#FAF8F5] border border-[#EAE3DA] rounded text-gray-600">
                        {prod.categoryName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Toggle */}
            <button
              id="mobile-search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-[#540D1E] hover:text-[#7A142A]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Dashboard shortcut if admin */}
            {currentUser?.role === 'ADMIN' && (
              <button
                id="admin-dashboard-header-btn"
                onClick={() => setCurrentView('admin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#540D1E] hover:bg-[#7A142A] text-[#F3DEAB] text-xs font-semibold rounded-full border border-[#C5A059]/40 shadow-sm transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            )}

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              onClick={() => handleNavClick('wishlist', null)}
              className="relative p-2 text-[#540D1E] hover:text-[#7A142A] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#7A142A] text-[#7A142A]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-[#7A142A] rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 text-[#540D1E] hover:text-[#7A142A] transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-[#420A16] bg-[#C5A059] rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / User Menu */}
            <div className="relative" ref={accountMenuRef}>
              <button
                id="header-account-btn"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-1 p-2 text-[#540D1E] hover:text-[#7A142A] transition-colors focus:outline-none"
                aria-label="Account"
              >
                <div className="w-7 h-7 rounded-full bg-[#EAE3DA] flex items-center justify-center text-[#540D1E] text-xs font-bold border border-[#C5A059]/40">
                  {currentUser ? currentUser.name.charAt(0) : <UserIcon className="w-4 h-4" />}
                </div>
                <ChevronDown className="w-3.5 h-3.5 hidden sm:inline" />
              </button>

              {/* Account Dropdown */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#EAE3DA] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-[#EAE3DA]">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-[#1E1B1B] truncate">{currentUser.name}</p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-semibold bg-[#FAF8F5] border border-[#C5A059]/40 text-[#7A142A] rounded">
                          {currentUser.role}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          handleNavClick('account', null);
                          setAccountMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-[#FAF8F5] hover:text-[#7A142A] flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5" /> My Account &amp; Orders
                      </button>
                      <button
                        onClick={() => {
                          handleNavClick('track-order', null);
                          setAccountMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-[#FAF8F5] hover:text-[#7A142A] flex items-center gap-2"
                      >
                        <PackageCheck className="w-3.5 h-3.5" /> Track Live Shipment
                      </button>
                      {currentUser.role === 'ADMIN' && (
                        <button
                          onClick={() => {
                            setCurrentView('admin');
                            setAccountMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-[#7A142A] hover:bg-[#F4EFEA] flex items-center gap-2 border-t border-[#EAE3DA]"
                        >
                          <Sliders className="w-3.5 h-3.5 text-[#C5A059]" /> Admin Dashboard
                        </button>
                      )}
                      <div className="border-t border-[#EAE3DA] my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="p-3">
                      <p className="text-xs text-gray-600 mb-2">Welcome to KK COLLECTION</p>
                      <button
                        onClick={() => {
                          onOpenAuth();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full py-2 bg-[#7A142A] hover:bg-[#9B1A36] text-white text-xs font-semibold rounded-lg text-center shadow"
                      >
                        Sign In / Register
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {searchOpen && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search pure silk sarees, Pata, fabrics..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'catalog') setCurrentView('catalog');
                }}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F4EFEA] border border-[#EAE3DA] rounded-full focus:outline-none focus:border-[#7A142A]"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* Desktop Category Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center gap-8 py-2.5 border-t border-[#EAE3DA]/80 text-xs tracking-wider uppercase font-medium">
          {navItems.map((item) => {
            const isActive =
              currentView === item.view &&
              (item.categorySlug === null ? selectedCategory === null : selectedCategory === item.categorySlug);

            return (
              <button
                key={item.label}
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNavClick(item.view, item.categorySlug)}
                className={`relative py-1 transition-colors hover:text-[#7A142A] ${
                  isActive ? 'text-[#7A142A] font-bold' : 'text-[#4A4543]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7A142A] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-4/5 max-w-sm h-full bg-[#FAF8F5] p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3DA]">
                <BrandLogo size="sm" onClick={() => handleNavClick('home', null)} />
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.view, item.categorySlug)}
                    className="text-left py-2 px-3 rounded-lg text-sm font-medium text-[#1E1B1B] hover:bg-[#F4EFEA] hover:text-[#7A142A] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-[#EAE3DA] space-y-3">
                {currentUser?.role === 'ADMIN' && (
                  <button
                    onClick={() => {
                      setCurrentView('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#540D1E] text-[#F3DEAB] text-xs font-semibold rounded-lg"
                  >
                    <Sliders className="w-4 h-4" /> Admin Console
                  </button>
                )}
                <button
                  onClick={() => switchRole(currentUser?.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN')}
                  className="w-full py-2 bg-[#F4EFEA] border border-[#EAE3DA] text-xs text-[#7A142A] font-medium rounded-lg"
                >
                  Switch to {currentUser?.role === 'ADMIN' ? 'Customer View' : 'Admin View'}
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAE3DA] text-center text-xs text-gray-500">
              <p className="font-serif italic text-sm text-[#7A142A] mb-1">KK COLLECTION</p>
              <p>Every Drape, A Story.</p>
              <p className="mt-2 text-[10px]">Direct Weaver Handloom Privileges</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
