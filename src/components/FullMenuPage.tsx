import React, { useState, useMemo, useEffect } from 'react';
import {
  ALL_MENU_ITEMS,
  MENU_CATEGORIES,
} from '../data/menu';
import type { MenuItem, MenuCategory } from '../data/menu';
import {
  Search,
  Flame,
  Plus,
  Check,
  ArrowRight,
  Phone,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  X,
  MapPin,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCrunchSound } from '../utils/audio';

interface FullMenuPageProps {
  onBackToHome: () => void;
  onOpenOrder: () => void;
  onAddToCart: (item: MenuItem) => void;
  cartCount: number;
}

const CATEGORY_ICONS: Record<MenuCategory, string> = {
  'وجبات الدجاج الفردية': '🍗',
  'وجبات العيلة والمجموعات': '👨‍👩‍👧',
  'وجبات الاستربس': '✨',
  'وجبات سوليد الخاصة': '🔥',
  'سندوتشات الدجاج': '🍔',
  'سندوتشات البرجر': '🥩',
  'سندوتشات سوليد': '🥖',
  'تورتيلا رول': '🌯',
  'المكرونة والباستا': '🍝',
  'الأرز والفتة': '🍚',
  'الفرايز والمقبلات': '🍟',
  'المشروبات والعصائر': '🥤',
};

export const FullMenuPage: React.FC<FullMenuPageProps> = ({
  onBackToHome,
  onOpenOrder,
  onAddToCart,
  cartCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedSpice, setSelectedSpice] = useState<number | 'all'>('all');
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [activeItemModal, setActiveItemModal] = useState<MenuItem | null>(null);
  const [burgerSizes, setBurgerSizes] = useState<Record<string, 'single' | 'double'>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const setSize = (itemId: string, size: 'single' | 'double') => {
    playCrunchSound();
    setBurgerSizes((prev) => ({ ...prev, [itemId]: size }));
  };

  const handleAddWithFeedback = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    playCrunchSound();

    const currentSize = burgerSizes[item.id] || 'single';
    const isDouble = currentSize === 'double' && item.doublePrice;

    const itemToAdd: MenuItem = isDouble
      ? {
          ...item,
          id: `${item.id}-double`,
          name: `${item.name} (دبل)`,
          price: item.doublePrice!,
        }
      : item;

    onAddToCart(itemToAdd);

    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#E60012', '#FF6B00', '#FFD700', '#ffffff'],
      disableForReducedMotion: true,
    });

    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return ALL_MENU_ITEMS.filter((item) => {
      const matchesCat =
        selectedCategory === 'الكل' || item.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.englishSub.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.price.includes(q);

      const matchesSpice =
        selectedSpice === 'all' || item.spiceLevel === selectedSpice;

      const matchesPopular = !onlyPopular || item.isPopular;

      return matchesCat && matchesQuery && matchesSpice && matchesPopular;
    });
  }, [searchQuery, selectedCategory, selectedSpice, onlyPopular]);

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    const groups: Partial<Record<MenuCategory, MenuItem[]>> = {};

    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category]!.push(item);
    });

    return groups;
  }, [filteredItems]);

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-[#E60012] selection:text-white font-arabic pb-28">
      
      {/* ── TOP NAV HEADER ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#08080a]/95 backdrop-blur-xl border-b border-red-950/60 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Back Button */}
          <button
            onClick={() => {
              playCrunchSound();
              onBackToHome();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#E60012] text-zinc-300 hover:text-white transition-all cursor-pointer group text-sm font-headline"
          >
            <ArrowRight className="w-4 h-4 text-[#E60012] group-hover:translate-x-1 transition-transform" />
            <span>الرجوع للرئيسية</span>
          </button>

          {/* Logo Center */}
          <div className="flex items-center gap-2.5">
            <img
              src="/solid_mascot.png"
              alt="سوليد"
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-[0_0_12px_rgba(230,0,18,0.7)]"
            />
            <div className="flex flex-col text-right leading-none">
              <span className="font-headline text-lg sm:text-xl text-white">
                سوليد <span className="text-[#E60012]">تشيكن</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-headline">المنيو الكامل الرسمي</span>
            </div>
          </div>

          {/* Hotline & Cart Drawer Action */}
          <div className="flex items-center gap-2.5">
            <a
              href="tel:01010926702"
              onClick={playCrunchSound}
              dir="ltr"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-headline"
            >
              <Phone className="w-3.5 h-3.5 text-[#E60012]" />
              <span>01010926702</span>
            </a>

            <button
              onClick={() => {
                playCrunchSound();
                onOpenOrder();
              }}
              className="btn-solid-red px-4 sm:px-5 py-2 rounded-xl font-headline text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(230,0,18,0.5)] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-yellow-300" />
              <span>سلة الطلب</span>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white text-[#E60012] text-xs font-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ──────────────────────────────────────────────── */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-b from-red-950/40 via-[#070709] to-[#070709] border-b border-zinc-900 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-[#E60012]/15 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[300px] bg-[#FF6B00]/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-[#E60012]/60 text-white text-xs font-headline mb-4 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>قائمة الأسعار والأصناف المعتمدة لعام ٢٠٢٦ 📜</span>
          </div>

          <h1
            className="font-headline text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
          >
            المنيو الكامل لمطعم{' '}
            <span className="text-[#E60012]">
              سوليد فرايد تشيكن
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-zinc-300 text-sm sm:text-base font-medium leading-relaxed mb-6">
            أكتر من ٦٠ صنف من بوكسات البروستد الفريش، وجبات العيلة، سندوتشات الدجاج واللحم، الباستا، الرول، الفتة، والمقبلات بالأسعار الرسمية من فرع الفشن وبني سويف.
          </p>

          {/* Quick Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-headline text-zinc-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <MapPin className="w-3.5 h-3.5 text-[#E60012]" />
              <span>شارع البحر (طريق مدرسة الفنية) - الفشن</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>توصيل دليفري شغال حتى ٤:٠٠ فجراً</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <Phone className="w-3.5 h-3.5 text-yellow-400" />
              <span>01108902664 / 01010926702</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLBAR: SEARCH & CATEGORY FILTERS ────────────────────────── */}
      <div className="sticky top-[61px] z-30 bg-[#070709]/95 backdrop-blur-xl border-b border-zinc-800/80 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
          
          {/* Search bar & quick filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-grow w-full">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الوجبة، المكونات، السعر (مثال: برجر، استربس، فاميلي، مكرونة...)"
                className="w-full pr-12 pl-10 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 focus:border-[#E60012] focus:outline-none text-white text-sm font-headline transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-center">
              <button
                onClick={() => setOnlyPopular(!onlyPopular)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-headline cursor-pointer transition-all border flex items-center gap-1.5 ${
                  onlyPopular
                    ? 'bg-[#E60012] text-white border-red-500 shadow-[0_0_15px_rgba(230,0,18,0.5)]'
                    : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                الأكتر طلباً فقط
              </button>

              {/* Spice Filter */}
              <div className="flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-2xl">
                <span className="text-xs font-headline text-zinc-400 px-2 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#E60012]" />
                  الشطة:
                </span>
                <button
                  onClick={() => setSelectedSpice('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-headline cursor-pointer transition-all ${
                    selectedSpice === 'all'
                      ? 'bg-[#E60012] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedSpice(1)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-headline cursor-pointer transition-all ${
                    selectedSpice === 1
                      ? 'bg-[#E60012] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  بارد
                </button>
                <button
                  onClick={() => setSelectedSpice(3)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-headline cursor-pointer transition-all flex items-center gap-1 ${
                    selectedSpice === 3
                      ? 'bg-[#E60012] text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                  سبايسي
                </button>
              </div>
            </div>
          </div>

          {/* Categories Horizontal Scroll with Icons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => {
                playCrunchSound();
                setSelectedCategory('الكل');
              }}
              className={`px-4 py-2.5 rounded-xl font-headline whitespace-nowrap cursor-pointer transition-all border flex items-center gap-1.5 ${
                selectedCategory === 'الكل'
                  ? 'bg-[#E60012] text-white border-red-500 shadow-[0_0_15px_rgba(230,0,18,0.6)]'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span>🔥</span>
              <span>كل الأصناف ({ALL_MENU_ITEMS.length})</span>
            </button>

            {MENU_CATEGORIES.map((cat) => {
              const count = ALL_MENU_ITEMS.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playCrunchSound();
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-headline whitespace-nowrap cursor-pointer transition-all border flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-[#E60012] text-white border-red-500 shadow-[0_0_15px_rgba(230,0,18,0.6)]'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span>{cat} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT: CATEGORY SECTIONS ──────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Results Counter */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-800 text-sm font-headline text-zinc-400">
          <span>
            يتم عرض <strong className="text-white font-bold">{filteredItems.length}</strong> صنف
            {selectedCategory !== 'الكل' && ` في قسم "${selectedCategory}"`}
            {searchQuery && ` عن "${searchQuery}"`}
          </span>

          {(selectedCategory !== 'الكل' || searchQuery || selectedSpice !== 'all' || onlyPopular) && (
            <button
              onClick={() => {
                setSelectedCategory('الكل');
                setSearchQuery('');
                setSelectedSpice('all');
                setOnlyPopular(false);
              }}
              className="text-[#E60012] hover:underline text-xs flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              مسح الفلاتر
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-20 text-center rounded-3xl bg-zinc-900/50 border border-zinc-800">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="font-headline text-2xl text-white mb-2">مفيش أصناف بتطابق بحثك</h3>
            <p className="text-zinc-400 text-sm mb-6">جرب تبحث بكلمة تانية أو امسح الفلاتر عشان تشوف المنيو كله.</p>
            <button
              onClick={() => {
                setSelectedCategory('الكل');
                setSearchQuery('');
                setSelectedSpice('all');
                setOnlyPopular(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#E60012] text-white font-headline text-sm"
            >
              عرض كل الأصناف
            </button>
          </div>
        )}

        {/* Grouped Items Render */}
        <div className="space-y-16">
          {Object.entries(groupedItems).map(([catName, items]) => {
            if (!items || items.length === 0) return null;
            const categoryIcon = CATEGORY_ICONS[catName as MenuCategory] || '🍗';

            return (
              <section key={catName} className="space-y-6">
                
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3.5 border-b-2 border-red-950/70">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryIcon}</span>
                    <h2 className="font-headline text-2xl sm:text-3xl text-white">
                      {catName}
                    </h2>
                    <span className="text-xs font-headline px-3 py-1 rounded-full bg-zinc-800 text-zinc-300">
                      {items.length} أصناف
                    </span>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => {
                    const currentSize = burgerSizes[item.id] || 'single';
                    const activePrice =
                      item.doublePrice && currentSize === 'double'
                        ? item.doublePrice
                        : item.price;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveItemModal(item)}
                        className="group relative rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-[#E60012] transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-[0_15px_40px_rgba(230,0,18,0.25)] cursor-pointer hover:-translate-y-1.5"
                      >
                        {/* Image Container */}
                        <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-black/50">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-85" />

                          {/* Badge */}
                          {item.badge && (
                            <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-[#E60012] text-white font-headline text-xs shadow-md">
                              {item.badge}
                            </div>
                          )}

                          {/* Portion / Pieces */}
                          {item.pieces && (
                            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[11px] font-headline text-zinc-300 border border-zinc-700">
                              {item.pieces}
                            </div>
                          )}

                          {/* Spice Level */}
                          <div className="absolute top-3 left-3 flex items-center gap-0.5 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-zinc-800">
                            {[...Array(3)].map((_, i) => (
                              <Flame
                                key={i}
                                className={`w-3 h-3 ${
                                  i < item.spiceLevel
                                    ? 'text-[#E60012] fill-[#E60012]'
                                    : 'text-zinc-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-5 flex flex-col flex-grow justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-xl font-headline text-white group-hover:text-[#E60012] transition-colors">
                                {item.name}
                              </h3>
                            </div>

                            <div className="text-xs font-condensed text-[#FF6B00] mb-2.5" dir="ltr">
                              {item.englishSub}
                            </div>

                            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                              {item.description}
                            </p>
                          </div>

                          {/* Size Selector for items with double price (Burgers) */}
                          {item.doublePrice && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="mb-4 p-1 rounded-xl bg-black/60 border border-zinc-800 grid grid-cols-2 gap-1 text-xs font-headline"
                            >
                              <button
                                onClick={() => setSize(item.id, 'single')}
                                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                                  currentSize === 'single'
                                    ? 'bg-[#E60012] text-white font-bold'
                                    : 'text-zinc-400 hover:text-white'
                                }`}
                              >
                                سنجل ({item.price})
                              </button>
                              <button
                                onClick={() => setSize(item.id, 'double')}
                                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                                  currentSize === 'double'
                                    ? 'bg-[#E60012] text-white font-bold'
                                    : 'text-zinc-400 hover:text-white'
                                }`}
                              >
                                دبل ({item.doublePrice})
                              </button>
                            </div>
                          )}

                          {/* Footer: Price & Add Button */}
                          <div className="flex items-center justify-between pt-3.5 border-t border-zinc-800/80">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-headline text-zinc-400">
                                {item.doublePrice && currentSize === 'double' ? 'سعر الدبل' : 'السعر'}
                              </span>
                              <span className="font-headline text-2xl text-[#ff3344]">
                                {activePrice}
                              </span>
                            </div>

                            <button
                              onClick={(e) => handleAddWithFeedback(item, e)}
                              className={`px-4 py-2.5 rounded-xl font-headline text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                                addedItemIds[item.id]
                                  ? 'bg-green-600 text-white scale-105'
                                  : 'bg-[#E60012] hover:bg-[#ff1a2a] text-white shadow-md hover:shadow-[0_0_15px_rgba(230,0,18,0.7)] group-hover:scale-105 active:scale-95'
                              }`}
                            >
                              {addedItemIds[item.id] ? (
                                <>
                                  <Check className="w-4 h-4 stroke-[3]" />
                                  <span>تمت الإضافة!</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 stroke-[3]" />
                                  <span>أضف للطلب</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* ── BOTTOM STICKY CALL TO ACTION BAR ────────────────────────── */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-l from-red-950/80 via-zinc-900 to-zinc-950 border border-red-900/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div>
            <span className="text-[#E60012] font-headline text-xs block mb-1">
              جاهز لتجربة القرمشة الحقيقية؟ 🔥
            </span>
            <h3 className="font-headline text-2xl sm:text-3xl text-white mb-1">
              اخترت وجباتك؟ اطلبها دلوقتي دليفري
            </h3>
            <p className="text-zinc-400 text-sm">
              التوصيل شغال لكل مناطق الفشن وبني سويف حتى ٤:٠٠ فجراً سخن ومقرمش.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                playCrunchSound();
                onOpenOrder();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#E60012] hover:bg-[#ff1a2a] text-white font-headline text-lg shadow-[0_10px_30px_rgba(230,0,18,0.7)] cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>إتمام الطلب عبر واتساب ({cartCount})</span>
            </button>

            <a
              href="tel:01010926702"
              onClick={playCrunchSound}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-headline text-base flex items-center justify-center gap-2"
              dir="ltr"
            >
              <Phone className="w-4 h-4 text-[#E60012]" />
              <span>01010926702</span>
            </a>
          </div>
        </div>
      </main>

      {/* ── MODAL QUICK PREVIEW ──────────────────────────────────────── */}
      {activeItemModal && (
        <div
          onClick={() => setActiveItemModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-red-900/60 overflow-hidden shadow-2xl"
          >
            <div className="relative h-64 w-full">
              <img
                src={activeItemModal.image}
                alt={activeItemModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              <button
                onClick={() => setActiveItemModal(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/70 text-white hover:bg-[#E60012] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              {activeItemModal.badge && (
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[#E60012] text-white font-headline text-xs">
                  {activeItemModal.badge}
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-headline text-3xl text-white">
                    {activeItemModal.name}
                  </h3>
                  <div className="text-xs font-condensed font-bold text-[#FF6B00]" dir="ltr">
                    {activeItemModal.englishSub}
                  </div>
                </div>
                <span className="font-headline text-3xl text-[#E60012]">
                  {activeItemModal.price}
                </span>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-medium">
                {activeItemModal.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-black/50 border border-zinc-800 text-xs font-headline">
                <div>
                  <span className="text-zinc-500 block mb-0.5">ملاحظات الوجبة</span>
                  <span className="text-white font-bold">{activeItemModal.calories || 'فريش يومياً'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-0.5">محتويات الوجبة</span>
                  <span className="text-white font-bold">{activeItemModal.pieces || 'حجم قياسي'}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  handleAddWithFeedback(activeItemModal, e);
                  setActiveItemModal(null);
                }}
                className="w-full py-4 rounded-2xl bg-[#E60012] hover:bg-[#ff1a2a] text-white font-headline text-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>أضف للطلب الآن • {activeItemModal.price}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
