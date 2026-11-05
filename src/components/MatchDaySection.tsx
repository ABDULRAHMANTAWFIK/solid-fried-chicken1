import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, ArrowLeft } from 'lucide-react';
import { playCrunchSound } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface MatchDaySectionProps {
  onOpenOrder: () => void;
}

export const MatchDaySection: React.FC<MatchDaySectionProps> = ({ onOpenOrder }) => {
  const sectionRef  = useRef<HTMLElement>(null);
  const bgImgRef    = useRef<HTMLDivElement>(null);
  const band1Ref    = useRef<HTMLDivElement>(null);
  const band2Ref    = useRef<HTMLDivElement>(null);
  const kickoffRef  = useRef<HTMLDivElement>(null);
  const foodRef     = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // ─── SCENE 04: SOLID MATCH DAY (OPTIMIZED FOR 60-120 FPS) ──────
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

        // BG photo scales in (pure GPU scale & opacity — zero filter repaints)
        tl.fromTo(bgImgRef.current,
          { scale: 1.18, opacity: 0.6 },
          { scale: 1,   opacity: 1, ease: 'power2.out' },
          0
        );

        // Red diagonal bands shoot across from opposite edges
        tl.fromTo(band1Ref.current,
          { x: '-110%', skewX: -8 },
          { x: '110%',  skewX: -8, ease: 'power3.inOut' },
          0.05
        );
        tl.fromTo(band2Ref.current,
          { x: '110%',  skewX: 8  },
          { x: '-110%', skewX: 8,  ease: 'power3.inOut' },
          0.1
        );

        // "KICK OFF" slams in from top
        tl.fromTo(kickoffRef.current,
          { y: -120, opacity: 0, scale: 1.3 },
          { y: 0, opacity: 1, scale: 1, ease: 'power3.out' },
          0.2
        );

        // Food image rises smoothly from bottom (GPU translateY + opacity, zero clip-path lag)
        tl.fromTo(foodRef.current,
          { y: '70%', opacity: 0 },
          { y: '0%',   opacity: 1, ease: 'power2.out' },
          0.42
        );

        // CTA block fades in last
        tl.fromTo(ctaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: 'power2.out' },
          0.65
        );

        // Horizontal text marquee — continuously running
        gsap.to('.matchday-marquee-inner', {
          x: '-50%',
          duration: 18,
          ease: 'none',
          repeat: -1,
        });

      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const MARQUEE_TEXT = Array(6).fill('MATCH DAY • SOLID CHICKEN • كيك أوف • ').join('');

  return (
    <section
      id="match-day"
      ref={sectionRef}
      className="relative min-h-screen bg-[#050507] overflow-hidden flex items-center justify-center"
    >
      {/* ── BACKGROUND FOOTBALL CAMPAIGN PHOTO ── */}
      <div
        ref={bgImgRef}
        className="absolute inset-0 z-0"
        style={{ willChange: 'transform, opacity' }}
      >
        <img
          src="/images/football_match_campaign.jpg"
          alt="Match Day"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Dramatic vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/40 via-transparent to-[#050507]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/60 via-transparent to-[#050507]/60" />
        {/* Red top border accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E60012]" />
      </div>

      {/* ── RED DIAGONAL BANDS (shoot across) ── */}
      <div
        ref={band1Ref}
        className="absolute top-1/3 -left-full z-10 w-full h-12 sm:h-16 bg-[#E60012]/85 pointer-events-none"
        style={{ transform: 'skewX(-8deg)', willChange: 'transform' }}
      />
      <div
        ref={band2Ref}
        className="absolute top-[55%] -right-full z-10 w-full h-8 sm:h-10 bg-[#E60012]/60 pointer-events-none"
        style={{ transform: 'skewX(8deg)', willChange: 'transform' }}
      />

      {/* ── OPENING QUESTION ── */}
      <div className="absolute top-12 sm:top-16 left-0 right-0 text-center z-20 px-4">
        <p className="font-headline text-[#E60012] text-sm sm:text-base tracking-[0.4em] uppercase mb-2">
          — ليلة الماتش —
        </p>
        <h2
          className="font-headline text-white leading-none"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 10rem)' }}
        >
          MATCH DAY?
        </h2>
      </div>

      {/* ── KICK OFF STAMP ── */}
      <div
        ref={kickoffRef}
        className="relative z-30 text-center pointer-events-none"
        style={{ opacity: 0, willChange: 'transform, opacity' }}
      >
        <div
          className="font-headline text-[#E60012] leading-none select-none"
          style={{
            fontSize: 'clamp(5rem, 18vw, 15rem)',
            textShadow: '0 0 80px rgba(230,0,18,0.5)',
            letterSpacing: '-0.02em',
          }}
        >
          KICK<br />
          <span className="text-white" style={{ WebkitTextStroke: '3px #E60012' }}>OFF!</span>
        </div>
      </div>

      {/* ── FOOD PHOTO RISING (GPU Transform) ── */}
      <div
        ref={foodRef}
        className="absolute inset-0 z-40"
        style={{ willChange: 'transform, opacity' }}
      >
        <img
          src="/images/product_family_bucket.jpg"
          alt="وجبة عيلة سوليد"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/60 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E60012]" />
      </div>

      {/* ── HORIZONTAL RUNNING TEXT TICKER ── */}
      <div className="absolute top-0 left-0 right-0 z-50 overflow-hidden bg-[#E60012] py-2">
        <div
          className="matchday-marquee-inner flex whitespace-nowrap font-headline text-white text-xs sm:text-sm tracking-widest"
          style={{ willChange: 'transform' }}
        >
          <span className="mr-8">{MARQUEE_TEXT}</span>
          <span>{MARQUEE_TEXT}</span>
        </div>
      </div>

      {/* ── FINAL CTA BLOCK ── */}
      <div
        ref={ctaRef}
        className="absolute inset-0 z-50 flex flex-col items-center justify-end pb-14 sm:pb-20 text-center px-4"
        style={{ opacity: 0 }}
      >
        <h3
          className="font-headline text-white leading-tight mb-3"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
        >
          MAKE IT A<br />
          <span className="text-[#E60012]">SOLID DAY.</span>
        </h3>
        <p className="text-zinc-300 font-medium mb-8 max-w-sm">
          وجبة عيلة سوليد كاملة + مشروبات — لسهرة الماتش عالفل 🏆
        </p>
        <button
          onClick={() => { playCrunchSound(); onOpenOrder(); }}
          className="group px-10 py-4 rounded-2xl bg-gradient-to-r from-[#E60012] via-[#f50013] to-[#cc0010] text-white font-headline text-xl sm:text-2xl shadow-[0_10px_40px_-5px_rgba(230,0,18,0.8)] hover:shadow-[0_15px_50px_rgba(230,0,18,1)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer border border-red-500/50"
        >
          <Flame className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          <span>اطلب وجبة الماتش دلوقتي</span>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
