import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { playCrunchSound } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

export const MascotSection: React.FC = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const mascotRef    = useRef<HTMLImageElement>(null);
  const bgTextRef    = useRef<HTMLDivElement>(null);
  const foodImgRef   = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // ─── SCENE 03: ROOSTER TAKEOVER (OPTIMIZED FOR 60-120 FPS) ───

        // Pinned scroll sequence with clean pinning boundaries
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

        // Phase 1 (0→0.4): Typography slides out to opposite directions
        tl.fromTo('.mascot-who-text',
          { x: 0, opacity: 1 },
          { x: -140, opacity: 0, ease: 'power2.in' },
          0
        );
        tl.fromTo('.mascot-solid-text',
          { x: 0, opacity: 1 },
          { x: 140, opacity: 0, ease: 'power2.in' },
          0
        );

        // Big BG watermark text moves left
        tl.fromTo(bgTextRef.current,
          { x: 0, opacity: 0.05 },
          { x: '-25%', opacity: 0.015, ease: 'none' },
          0
        );

        // Phase 2 (0.15→0.75): Rooster SCALES UP dramatically (pure GPU transform, zero filter overhead)
        tl.fromTo(mascotRef.current,
          { scale: 0.65, y: 30, opacity: 0.85 },
          { scale: 1.45, y: -45, opacity: 1, ease: 'power2.out' },
          0.12
        );

        // Phase 3 (0.45→0.85): Food photo rises from bottom (GPU translateY + opacity, zero clip-path lag)
        tl.fromTo(foodImgRef.current,
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, ease: 'power2.out' },
          0.45
        );

        // Phase 4 (0.65→1): Content block fades in over food
        tl.fromTo(contentRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: 'power2.out' },
          0.65
        );
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const handleCrow = (e: React.MouseEvent) => {
    playCrunchSound();
    gsap.timeline()
      .to(mascotRef.current, { scale: 1.3, rotation: -8, duration: 0.1, ease: 'power2.out' })
      .to(mascotRef.current, { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    confetti({
      particleCount: 50, spread: 80,
      origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
      colors: ['#E60012', '#FF4D00', '#FFD700', '#ffffff'],
      disableForReducedMotion: true,
    });
  };

  return (
    <section
      id="mascot"
      ref={sectionRef}
      className="relative min-h-screen bg-[#050507] overflow-hidden flex items-center justify-center"
    >
      {/* Ambient red glow center (Hardware-accelerated radial shader) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(230,0,18,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* ── BIG WATERMARK TEXT (moves opposite to mascot) ── */}
      <div
        ref={bgTextRef}
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 overflow-hidden pointer-events-none select-none whitespace-nowrap"
        style={{ opacity: 0.05 }}
      >
        <span className="font-headline text-[20vw] text-white tracking-[0.15em]">
          SOLID CHICKEN
        </span>
      </div>

      {/* ── TYPOGRAPHY (slides away on scroll) ── */}
      <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-16 pointer-events-none z-10">
        <div className="mascot-who-text">
          <p className="font-headline text-zinc-500 text-sm tracking-[0.4em] uppercase mb-2">مين هو</p>
          <h2
            className="font-headline text-white leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', writingMode: 'horizontal-tb' }}
          >
            WHO'S<br />
            <span className="text-[#E60012]">SOLID?</span>
          </h2>
        </div>
        <div className="mascot-solid-text text-right">
          <p className="font-headline text-zinc-500 text-sm tracking-[0.4em] uppercase mb-2">البراند الأقوى</p>
          <h2
            className="font-headline text-white leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            CRISPY<br />
            <span className="text-[#E60012]">KING.</span>
          </h2>
        </div>
      </div>

      {/* ── ROOSTER (grows dramatically on scroll) ── */}
      <div className="relative z-20 flex flex-col items-center">
        <img
          ref={mascotRef}
          src="/solid_mascot.png"
          alt="شعار سوليد فرايد تشيكن"
          className="w-56 sm:w-72 h-auto object-contain drop-shadow-[0_0_60px_rgba(230,0,18,0.9)] cursor-pointer select-none"
          onClick={handleCrow}
          style={{ willChange: 'transform' }}
          title="اضغط!"
        />
        <img
          src="/solid_text.png"
          alt="Solid"
          className="w-40 sm:w-56 h-auto object-contain mt-3 drop-shadow-[0_0_20px_rgba(230,0,18,0.6)] opacity-80"
        />
      </div>

      {/* ── FOOD PHOTO (rises smoothly from bottom via GPU transform) ── */}
      <div
        ref={foodImgRef}
        className="absolute inset-0 z-30"
        style={{ willChange: 'transform, opacity' }}
      >
        <img
          src="/images/brand_crunch_macro.jpg"
          alt="قرمشة سوليد"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/95 via-[#050507]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/40 via-transparent to-transparent" />
      </div>

      {/* ── CONTENT BLOCK (appears over food photo) ── */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-40 flex flex-col items-center justify-end pb-16 sm:pb-20 text-center px-4"
        style={{ opacity: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-[#E60012]/60 text-[#ff6b6b] text-xs font-headline mb-5">
          <span className="w-2 h-2 rounded-full bg-[#E60012] animate-ping" />
          <span>شعار سوليد الأصلي 🐔</span>
        </div>

        <h3
          className="font-headline text-white leading-tight mb-4 max-w-3xl"
          style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
        >
          شعار سوليد..{' '}
          <span className="text-[#E60012]">علامة الجودة اللي تثق فيها</span>
        </h3>

        <p className="text-zinc-300 text-base sm:text-lg font-medium leading-relaxed max-w-xl mb-8">
          لوجو الديك مش مجرد رسمة على العلبة — ده التزام حقيقي بنضافة الأكل وجودة الطعم في كل وجبة.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { t: 'تتبيلة ٤٨ ساعة', s: 'طعم واصل لحد العظم' },
            { t: 'فراخ فريش يومياً', s: 'من المزارع مباشرةً' },
            { t: 'نضافة مضمونة', s: 'معايير جودة صارمة' },
          ].map((p) => (
            <div key={p.t} className="px-5 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-700 backdrop-blur-md">
              <div className="font-headline text-white text-sm">{p.t}</div>
              <div className="text-zinc-400 text-xs mt-0.5">{p.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
