import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Flame } from 'lucide-react';
import { playCrunchSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ALL_MENU_ITEMS } from '../data/menu';
import type { MenuItem } from '../data/menu';
import { Plus, Check } from 'lucide-react';
import { useState, useCallback } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface BestSellersProps {
  onAddToCart: (item: MenuItem) => void;
  onOpenOrder: () => void;
  onNavigateMenu?: () => void;
}

const SPOTLIGHT_ITEMS = [
  'solid-box-combo',
  'chicken-solid-monster',
  'beef-bacon-burger',
  'super-family-mix-12',
  'crispy-fattah-bowl',
].map(id => ALL_MENU_ITEMS.find(i => i.id === id) || ALL_MENU_ITEMS[0]);

export const BestSellers: React.FC<BestSellersProps> = ({ onAddToCart, onNavigateMenu }) => {
  const sectionRef     = useRef<HTMLElement>(null);
  const bigFoodRef     = useRef<HTMLDivElement>(null);
  const overlayTextRef = useRef<HTMLDivElement>(null);
  const cardsRef       = useRef<HTMLDivElement>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // ─── SCENE 02: CRISPY DROP — BIG FOOD SCROLL-DRIVEN REVEAL ───

        // Pin the section for a scroll-scrubbed sequence (optimized for 60-120fps)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=100%',
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
          },
        });

        // Big food image zooms forward (pure GPU transform & opacity — no costly filter repaints)
        tl.fromTo(bigFoodRef.current,
          { scale: 1.18, y: 40, opacity: 0.65 },
          { scale: 1, y: 0, opacity: 1, ease: 'power2.out' },
          0
        );

        // Overlay copy moves up and out
        tl.fromTo(overlayTextRef.current,
          { y: 0, opacity: 1 },
          { y: -90, opacity: 0, ease: 'power2.in' },
          0
        );

        // Cards rise in cleanly as food settles
        tl.fromTo(cardsRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out' },
          0.38
        );

      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const handleAdd = useCallback((item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    playCrunchSound();
    onAddToCart(item);
    setAddedId(item.id);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    confetti({
      particleCount: 30, spread: 60,
      origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
      colors: ['#E60012', '#FF6B00', '#FFD700', '#ffffff'],
      disableForReducedMotion: true,
    });
    setTimeout(() => setAddedId(null), 1500);
  }, [onAddToCart]);

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="relative min-h-screen bg-[#070709] overflow-hidden flex flex-col"
    >
      {/* ── GIANT HERO FOOD IMAGE (oversized, scroll-driven) ── */}
      <div
        ref={bigFoodRef}
        className="absolute inset-0 z-0"
        style={{ willChange: 'transform, opacity' }}
      >
        <img
          src="/images/product_box_meal.jpg"
          alt="وجبة سوليد"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/20 via-[#070709]/50 to-[#070709]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/60 via-transparent to-[#070709]/60" />
      </div>

      {/* ── SCENE 02 OVERLAY COPY (slides up as you scroll) ── */}
      <div
        ref={overlayTextRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      >
        <p className="font-headline text-[#E60012] text-sm sm:text-base tracking-[0.3em] uppercase mb-4">
          — اختار وجبتك —
        </p>
        <h2
          className="font-headline text-white leading-tight px-4"
          style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
        >
          CRISPY.<br />
          <span className="text-[#E60012]">ALWAYS.</span>
        </h2>
        <p className="mt-6 text-zinc-300 font-headline text-lg sm:text-xl max-w-sm px-6">
          اسكرول لتشوف الأصناف 👇
        </p>
      </div>

      {/* ── PRODUCT CARDS (revealed at scroll end) ── */}
      <div
        ref={cardsRef}
        className="relative z-20 mt-auto w-full"
        style={{ opacity: 0 }}
      >
        {/* Section header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-1 bg-[#E60012] inline-block" />
                <span className="font-headline text-[#E60012] text-sm tracking-wide">أشهى ما عندنا</span>
              </div>
              <h3 className="font-headline text-white leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
                اختيارات <span className="text-[#E60012]">الأكيلة المميزة</span>
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { playCrunchSound(); if (onNavigateMenu) onNavigateMenu(); }}
                className="px-6 py-3 rounded-xl bg-[#E60012] text-white font-headline text-base flex items-center gap-2 shadow-[0_0_20px_rgba(230,0,18,0.5)] hover:scale-105 transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>المنيو الكامل (٦٠+ صنف)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal scroll strip of product cards */}
        <div className="pb-12 overflow-x-auto no-scrollbar">
          <div className="flex gap-5 px-4 sm:px-8 lg:px-16 min-w-max">
            {SPOTLIGHT_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group relative w-[260px] sm:w-[300px] shrink-0 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-[#E60012]/60 transition-all duration-300 shadow-xl hover:shadow-[0_15px_40px_rgba(230,0,18,0.25)] hover:-translate-y-2"
              >
                {/* Image */}
                <div className="h-[200px] sm:h-[220px] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                {/* Badge */}
                {item.badge && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#E60012] text-white text-[10px] font-headline">
                    {item.badge}
                  </div>
                )}
                {/* Info */}
                <div className="p-4">
                  <h4 className="font-headline text-white text-base mb-1 leading-tight line-clamp-2">{item.name}</h4>
                  <p className="text-zinc-400 text-xs font-medium leading-relaxed line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#E60012] font-headline text-lg">{item.price}</span>
                    <button
                      onClick={(e) => handleAdd(item, e)}
                      className="w-9 h-9 rounded-xl bg-[#E60012] flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all cursor-pointer shadow-lg"
                    >
                      {addedId === item.id
                        ? <Check className="w-4 h-4" />
                        : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* "See All" Card */}
            <div
              onClick={() => { playCrunchSound(); if (onNavigateMenu) onNavigateMenu(); }}
              className="w-[200px] shrink-0 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-[#E60012] flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-full bg-red-950/60 border border-[#E60012]/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowLeft className="w-6 h-6 text-[#E60012]" />
              </div>
              <span className="font-headline text-zinc-400 group-hover:text-white text-sm text-center px-4 transition-colors">
                شوف المنيو الكامل (٦٠+ صنف)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
