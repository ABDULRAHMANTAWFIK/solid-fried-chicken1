import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Menu as MenuIcon, X, Phone, Flame, UtensilsCrossed } from 'lucide-react';
import { playCrunchSound } from '../utils/audio';

interface NavbarProps {
  onOpenOrder: () => void;
  onNavigateMenu: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrder, onNavigateMenu, cartCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation on mount
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        navRef.current,
        { y: -70, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', delay: 0.2 }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08080a]/95 backdrop-blur-xl border-b border-red-950/40 py-3 shadow-[0_4px_35px_rgba(0,0,0,0.7)]'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 sm:py-5'
      }`}
    >
      {/* Top red accent line (visible when scrolled) */}
      {scrolled && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E60012] to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <a
          href="#hero"
          onClick={playCrunchSound}
          className="flex items-center gap-3 group focus:outline-none shrink-0"
        >
          <div className="relative">
            <img
              src="/solid_mascot.png"
              alt="سوليد"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_0_15px_rgba(230,0,18,0.7)] group-hover:scale-105 group-hover:rotate-[-4deg] transition-all duration-300"
            />
          </div>
          <div className="flex flex-col text-right leading-none">
            <span className="font-headline text-xl sm:text-2xl text-white tracking-wide">
              سوليد <span className="text-[#E60012]">تشيكن</span>
            </span>
            <span className="text-[10px] sm:text-xs font-headline text-zinc-400 mt-1">
              الفراخ المقرمشة على أصولها
            </span>
          </div>
        </a>

        {/* Clean, Focused Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <a
            href="#hero"
            onClick={playCrunchSound}
            className="text-sm font-headline text-zinc-300 hover:text-white transition-colors duration-200 relative group py-1"
          >
            الرئيسية
            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-[#E60012] group-hover:w-full transition-all duration-300 rounded-full" />
          </a>

          {/* Highlighted Full Menu CTA Pill */}
          <button
            onClick={() => {
              playCrunchSound();
              onNavigateMenu();
            }}
            className="relative px-4 py-1.5 rounded-full bg-gradient-to-r from-red-950/80 to-zinc-900 border border-red-600/60 hover:border-red-500 text-yellow-300 hover:text-white transition-all duration-200 font-headline text-sm flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(230,0,18,0.3)] hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-[#E60012] animate-ping" />
            <UtensilsCrossed className="w-3.5 h-3.5 text-yellow-400" />
            <span>المنيو الكامل (٦٠+ صنف)</span>
          </button>

          <a
            href="#story"
            onClick={playCrunchSound}
            className="text-sm font-headline text-zinc-300 hover:text-white transition-colors duration-200 relative group py-1"
          >
            سر القرمشة
            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-[#E60012] group-hover:w-full transition-all duration-300 rounded-full" />
          </a>

          <a
            href="#locations"
            onClick={playCrunchSound}
            className="text-sm font-headline text-zinc-300 hover:text-white transition-colors duration-200 relative group py-1"
          >
            الفرع والتوصيل
            <span className="absolute bottom-0 right-0 w-0 h-[2px] bg-[#E60012] group-hover:w-full transition-all duration-300 rounded-full" />
          </a>
        </nav>

        {/* Action Group: Hotline & Order Now */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Hotline Call */}
          <a
            href="tel:01010926702"
            onClick={playCrunchSound}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-[#E60012]/60 text-zinc-300 hover:text-white transition-all text-xs font-headline"
            title="اتصل بالفرع مباشرة"
          >
            <Phone className="w-3.5 h-3.5 text-[#E60012]" />
            <span dir="ltr">01010926702</span>
          </a>

          {/* Primary Order Button */}
          <button
            onClick={() => {
              playCrunchSound();
              onOpenOrder();
            }}
            className="btn-solid-red px-4 sm:px-5 py-2.5 rounded-xl font-headline text-sm sm:text-base shadow-[0_0_20px_rgba(230,0,18,0.4)] flex items-center gap-2 cursor-pointer border border-red-500/40 hover:scale-102 transition-all"
          >
            <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span>اطلب دلوقتي</span>
            {cartCount > 0 && (
              <span className="mr-1 px-2 py-0.5 rounded-full bg-white text-[#E60012] text-xs font-black">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-800 cursor-pointer"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean & Focused) */}
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-[#08080a]/98 border-t border-zinc-800 backdrop-blur-2xl px-5 py-6 flex flex-col gap-4 shadow-2xl"
          style={{ animation: 'fadeIn 0.2s ease' }}
        >
          {/* Highlighted Full Menu Button */}
          <button
            onClick={() => {
              playCrunchSound();
              setMobileMenuOpen(false);
              onNavigateMenu();
            }}
            className="w-full flex items-center justify-between py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-950 to-zinc-900 border-2 border-red-600 text-yellow-300 font-headline text-base cursor-pointer shadow-lg"
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E60012] animate-ping" />
              <span>تصفح المنيو الكامل (٦٠+ صنف)</span>
            </span>
            <span>←</span>
          </button>

          <nav className="flex flex-col divide-y divide-zinc-900">
            <a
              href="#hero"
              onClick={() => {
                playCrunchSound();
                setMobileMenuOpen(false);
              }}
              className="py-3 px-2 text-base font-headline text-zinc-200 hover:text-[#E60012] transition-colors flex items-center justify-between"
            >
              <span>الرئيسية</span>
              <span className="text-zinc-600">←</span>
            </a>

            <a
              href="#story"
              onClick={() => {
                playCrunchSound();
                setMobileMenuOpen(false);
              }}
              className="py-3 px-2 text-base font-headline text-zinc-200 hover:text-[#E60012] transition-colors flex items-center justify-between"
            >
              <span>سر القرمشة</span>
              <span className="text-zinc-600">←</span>
            </a>

            <a
              href="#locations"
              onClick={() => {
                playCrunchSound();
                setMobileMenuOpen(false);
              }}
              className="py-3 px-2 text-base font-headline text-zinc-200 hover:text-[#E60012] transition-colors flex items-center justify-between"
            >
              <span>الفرع ومناطق التوصيل</span>
              <span className="text-zinc-600">←</span>
            </a>
          </nav>

          <div className="flex flex-col gap-2.5 pt-2 border-t border-zinc-900">
            <a
              href="tel:01010926702"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-headline text-sm"
            >
              <Phone className="w-4 h-4 text-[#E60012]" />
              <span>اتصل بالفرع: <strong dir="ltr">01010926702</strong></span>
            </a>

            <button
              onClick={() => {
                playCrunchSound();
                setMobileMenuOpen(false);
                onOpenOrder();
              }}
              className="w-full py-3.5 rounded-xl bg-[#E60012] hover:bg-red-700 text-white font-headline text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Flame className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span>افتح قائمة الطلب السريع</span>
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </header>
  );
};
