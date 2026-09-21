import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { AuthModal } from './components/common/AuthModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/products/QuickViewModal';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Product, Order } from './types';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');

  const { products } = useStore();

  const handleSelectProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderCompleted = (order: Order) => {
    setLatestOrder(order);
    setCurrentView('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrderFromAnywhere = (orderNo: string) => {
    setTrackingOrderNumber(orderNo);
    setCurrentView('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top on view switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#242120] font-sans selection:bg-[#7A142A]/15 selection:text-[#7A142A]">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectProduct={handleSelectProduct}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            setCurrentView={setCurrentView}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
            onQuickView={setQuickViewProduct}
          />
        )}

        {currentView === 'catalog' && (
          <CatalogPage
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectProduct={handleSelectProduct}
            onQuickView={setQuickViewProduct}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage
            productId={selectedProductId || (products[0] ? products[0].id : '')}
            onSelectProduct={handleSelectProduct}
            onQuickView={setQuickViewProduct}
            onOpenCart={() => setIsCartOpen(true)}
            onProceedCheckout={() => {
              setCurrentView('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onOrderCompleted={handleOrderCompleted}
            onBackToCart={() => setIsCartOpen(true)}
          />
        )}

        {currentView === 'order-confirmation' && (
          <OrderConfirmationPage
            order={latestOrder}
            onTrackOrder={handleTrackOrderFromAnywhere}
            onContinueShopping={() => {
              setSelectedCategory(null);
              setCurrentView('catalog');
            }}
          />
        )}

        {currentView === 'track-order' && (
          <OrderTrackingPage
            initialOrderNumber={trackingOrderNumber}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'about' && <AboutPage />}

        {currentView === 'contact' && <ContactPage />}

        {currentView === 'account' && (
          <AccountPage
            onSelectProduct={handleSelectProduct}
            onTrackOrder={handleTrackOrderFromAnywhere}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      <Footer
        setCurrentView={setCurrentView}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedCheckout={handleProceedCheckout}
        onSelectProduct={handleSelectProduct}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={(id) => {
          setQuickViewProduct(null);
          handleSelectProduct(id);
        }}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Floating WhatsApp Concierge */}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
