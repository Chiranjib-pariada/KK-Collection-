import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface WhatsAppButtonProps {
  productName?: string;
  sku?: string;
  customMessage?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  productName,
  sku,
  customMessage,
  className = '',
}) => {
  const { settings } = useStore();

  if (!settings.featureFlags.enableWhatsAppChat) return null;

  const defaultMsg = productName
    ? `Hello KK Collection, I am interested in "${productName}", SKU: ${sku || 'N/A'}. Is it available?`
    : `Hello KK Collection, I would like to inquire about your Indian handloom sarees and drape collections.`;

  const message = customMessage || defaultMsg;
  const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      id="whatsapp-chat-button"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium text-xs rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-white/40 ${className}`}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-white text-transparent" />
      <span className="hidden sm:inline font-semibold tracking-wide">Concierge on WhatsApp</span>
    </a>
  );
};
