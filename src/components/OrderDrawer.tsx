import React, { useState } from 'react';
import type { MenuItem } from '../data/menu';
import { X, Trash2, Plus, Minus, Phone, MessageCircle, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCrunchSound } from '../utils/audio';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate subtotal
  const subtotal = cart.reduce((sum, cartItem) => {
    const priceNum = parseInt(cartItem.item.price.replace(/[^\d]/g, ''), 10) || 0;
    return sum + priceNum * cartItem.quantity;
  }, 0);

  const deliveryFee = orderType === 'delivery' ? 25 : 0;
  const total = subtotal + deliveryFee;

  const buildWhatsAppMessage = () => {
    let msg = `السلام عليكم، عايز أطلب أوردر من مطعم سوليد فرايد تشيكن:\n\n`;
    msg += `*الاسم:* ${customerName || 'عميل'}\n`;
    msg += `*التليفون:* ${customerPhone || 'لم يحدد'}\n`;
    msg += `*طريقة الاستلام:* ${orderType === 'delivery' ? 'توصيل دليفري للبيت' : 'استلام تيك أواي من المحل'}\n`;
    if (orderType === 'delivery' && customerAddress) {
      msg += `*العنوان:* ${customerAddress}\n`;
    }
    msg += `\n*تفاصيل الطلب:*\n`;

    cart.forEach((c, idx) => {
      msg += `${idx + 1}. ${c.item.name} (${c.quantity} قطع) - ${c.item.price}\n`;
    });

    msg += `\n*الإجمالي:* ${total} جنيه\n`;
    msg += `\nممكن تأكيد استلام الطلب وتعرفوني هيوصل في حدود كام دقيقة؟ شكراً.`;
    return encodeURIComponent(msg);
  };

  const handleWhatsAppOrder = () => {
    playCrunchSound();
    confetti({
      particleCount: 50,
      spread: 80,
      colors: ['#E60012', '#25D366', '#ffffff'],
    });
    setOrderSuccess(true);
    const url = `https://wa.me/201010926702?text=${buildWhatsAppMessage()}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-start">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-[#0a0a0c] border-r border-zinc-800 text-white shadow-2xl flex flex-col justify-between h-full z-10 animate-slideRight">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#E60012]" />
            <h3 className="font-headline text-2xl text-white">
              قائمة طلباتك
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Order Mode Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-900 rounded-2xl border border-zinc-800">
            <button
              onClick={() => {
                playCrunchSound();
                setOrderType('delivery');
              }}
              className={`py-3 rounded-xl font-headline text-xs transition-all cursor-pointer ${
                orderType === 'delivery'
                  ? 'bg-[#E60012] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🛵 توصيل دليفري (+٢٥ ج)
            </button>
            <button
              onClick={() => {
                playCrunchSound();
                setOrderType('takeaway');
              }}
              className={`py-3 rounded-xl font-headline text-xs transition-all cursor-pointer ${
                orderType === 'takeaway'
                  ? 'bg-[#E60012] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🏪 استلام من المحل
            </button>
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-zinc-900 flex items-center justify-center text-3xl">
                🍗
              </div>
              <h4 className="font-headline text-xl text-zinc-300">سلة الطلبات فاضية</h4>
              <p className="text-zinc-500 text-xs max-w-xs mx-auto font-medium">
                تقدر تختار من وجبات الفراخ، البرجر، أو التندرز لإضافتها للطلب!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-headline text-zinc-400">
                <span>الوجبات المضافة ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                <button
                  onClick={onClearCart}
                  className="text-red-400 hover:text-red-300 cursor-pointer"
                >
                  مسح السلة
                </button>
              </div>

              {cart.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3"
                >
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    className="w-15 h-15 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="font-headline text-white text-sm truncate">
                      {cartItem.item.name}
                    </h5>
                    <div className="text-xs text-[#FF6B00] font-headline">
                      {cartItem.item.price}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-headline text-sm text-white w-4 text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(cartItem.item.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 mr-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Customer Info for Delivery */}
          {cart.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <span className="text-xs font-headline text-zinc-300 block">
                بيانات الاستلام والتوصيل:
              </span>
              <input
                type="text"
                placeholder="الاسم"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#E60012] font-medium"
              />
              <input
                type="tel"
                placeholder="رقم التليفون"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#E60012] font-medium"
              />
              {orderType === 'delivery' && (
                <textarea
                  rows={2}
                  placeholder="عنوان التوصيل بالتفصيل (المنطقة، الشارع، رقم العمارة، علامة مميزة)"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-[#E60012] font-medium"
                />
              )}
            </div>
          )}
        </div>

        {/* Footer Checkout Actions */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-zinc-950 space-y-4">
            <div className="space-y-2 text-xs font-headline">
              <div className="flex justify-between text-zinc-400">
                <span>إجمالي الأصناف:</span>
                <span className="text-white text-sm">{subtotal} جنيه</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-zinc-400">
                  <span>خدمة التوصيل:</span>
                  <span className="text-white text-sm">٢٥ جنيه</span>
                </div>
              )}
              <div className="flex justify-between text-base font-headline text-white pt-2 border-t border-zinc-800">
                <span>المبلغ المطلوب:</span>
                <span className="text-2xl text-[#E60012] font-black">{total} جنيه</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-headline text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-black" />
                <span>إرسال عبر واتساب</span>
              </button>

              <a
                href="tel:01010926702"
                onClick={playCrunchSound}
                className="w-full py-4 rounded-2xl bg-[#E60012] hover:bg-[#ff1a2a] text-white font-headline text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>اتصال هاتفي مباشر</span>
              </a>
            </div>

            {orderSuccess && (
              <div className="p-3 rounded-xl bg-green-950/80 border border-green-500 text-center text-xs text-green-300 font-headline">
                تم تجهيز الرسالة! جاري تحويلك لواتساب لتأكيد الطلب...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
