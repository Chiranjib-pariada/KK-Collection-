import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Bridal & Wedding Appointment');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello KK Collection Concierge, I would like to schedule a private drape consultation or have a product inquiry.'
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">
          Personal Drape Concierge
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1B1B]">
          Connect with KK COLLECTION
        </h1>
        <p className="text-xs text-gray-600">
          Whether you seek a bespoke wedding saree consultation, custom fabric cut for bridal lehengas, or order assistance, our specialists are at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info & Showroom Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-[#EAE3DA] shadow-xs space-y-5 text-xs">
            <h3 className="font-serif font-bold text-base text-[#540D1E]">
              Flagship Studio &amp; Loom Quarter
            </h3>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#7A142A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1E1B1B] block">Studio Address:</strong>
                  <p className="leading-relaxed mt-0.5">
                    KK Collection Handloom Studios<br />
                    Plot 104, Patia Heritage Loom Quarter<br />
                    Bhubaneswar, Odisha 751024, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#7A142A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1E1B1B] block">Direct Telephone:</strong>
                  <p className="mt-0.5">{settings.supportPhone} (Toll-Free Pan-India)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#7A142A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1E1B1B] block">Patron Services:</strong>
                  <p className="mt-0.5">{settings.supportEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#7A142A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1E1B1B] block">Showroom &amp; Video Consult Hours:</strong>
                  <p className="mt-0.5">Monday – Saturday: 10:00 AM – 8:30 PM IST</p>
                  <p>Sunday: 11:00 AM – 7:00 PM IST</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F4EFEA]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Concierge Chat</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Message / Consultation Request Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#EAE3DA] shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#540D1E]">
              Send Us a Message or Request a Video Call
            </h3>
            <p className="text-gray-500 mt-1">
              We respond to all inquiries within 2 business hours.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-serif font-bold text-base text-emerald-900">
                Message Successfully Received!
              </h4>
              <p className="text-emerald-700 max-w-sm mx-auto">
                Thank you for contacting KK COLLECTION. Our senior handloom drape specialist will connect with you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priyadarshini Mohanty"
                    className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl focus:border-[#7A142A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl focus:border-[#7A142A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl focus:border-[#7A142A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700">Inquiry Nature</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl focus:border-[#7A142A]"
                  >
                    <option value="Bridal & Wedding Appointment">Bridal &amp; Wedding Trousseau Consultation</option>
                    <option value="Custom Fabric Cut / Bulk Yards">Custom Fabric Cut (Per Meter Bulk)</option>
                    <option value="Order & Tracking Query">Order &amp; Delivery Tracking</option>
                    <option value="Handloom Authenticity / Silk Mark">Handloom Authenticity &amp; Silk Mark Query</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700">Your Message or Drape Requirements</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the occasion, preferred colors, fabric preferences, or dates for video consultation..."
                  className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#EAE3DA] rounded-xl focus:border-[#7A142A]"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 bg-[#7A142A] hover:bg-[#9B1A36] text-[#FAF8F5] font-bold uppercase tracking-widest text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Inquiry to Concierge</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
