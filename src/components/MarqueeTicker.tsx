import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────
   MARQUEE TICKER — Bold red strip between sections
   Runs continuously, pauses on hover
   ────────────────────────────────────────────────────────────── */

const ITEMS = [
  '🔥 فراخ فريش كل يوم',
  '★ قرمشة على أصولها',
  '🍗 طلبك ينزل الزيت في ساعته',
  '★ توصيل لحد ٤ الفجر',
  '🔥 خلطة بهارات خاصة',
  '★ زيت نقي خفيف',
  '🍗 سوليد الطعم الأصيل',
  '★ تتبيلة ٤٨ ساعة',
];

export const MarqueeTicker: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      animRef.current = gsap.to(track, {
        xPercent: -50,
        duration: 30,
        ease: 'none',
        repeat: -1,
      });

      const pause = () => animRef.current?.timeScale(0.15);
      const resume = () => animRef.current?.timeScale(1);
      track.parentElement?.addEventListener('mouseenter', pause);
      track.parentElement?.addEventListener('mouseleave', resume);

      return () => {
        track.parentElement?.removeEventListener('mouseenter', pause);
        track.parentElement?.removeEventListener('mouseleave', resume);
      };
    });

    return () => mm.revert();
  }, []);

  const repeated = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden bg-[#E60012] py-4 z-10">
      {/* subtle diagonal stripe texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
          backgroundSize: '8px 8px',
        }}
      />

      <div ref={trackRef} className="flex gap-0 will-change-transform">
        {repeated.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-8 shrink-0"
          >
            <span className="font-headline text-white text-base sm:text-lg whitespace-nowrap tracking-wide">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
