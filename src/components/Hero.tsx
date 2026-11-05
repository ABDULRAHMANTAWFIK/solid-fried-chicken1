import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, ArrowLeft, ShieldCheck, Clock, Award, Phone, Sparkles } from 'lucide-react';
import { playCrunchSound } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenOrder: () => void;
  onNavigateMenu?: () => void;
}

// 8 Distinct Chicken Pieces that physically stack and overflow into a towering mountain
// Using the exact user-uploaded assets:
// 1. /images/chicken_bites_transparent.png (crispy bites / tenders cluster)
// 2. /images/chicken_drumstick_single.png (crispy golden drumstick)
interface ChickenPieceConfig {
  id: number;
  src: string;
  name: string;
  landX: number;
  landY: number;
  landRot: number;
  landScale: number;
  width: string;
  height: string;
  startX: number;
  startY: number;
  startRot: number;
  zIndex: number;
  flipX?: boolean;
}

const CHICKEN_PIECES_DATA: ChickenPieceConfig[] = [
  // ── COLOSSAL CRISPY MOUNTAIN (EXPANDED WIDTH & HEIGHT) ──
  // All 8 pieces sit realistically inside the bucket opening (zIndex 11-18),
  // while the front bucket wall is in front (zIndex: 25) cleanly framing the base.
  // The mountain now towers much higher (reaching Y: -235px) and spans wide across the rim!

  // ── TIER 1: Massive foundation nestled right inside the opening ──
  {
    id: 1,
    src: '/images/chicken_bites_transparent.png',
    name: 'قطع دجاج مقرمشة ضخمة (قاع الفوهة يسار)',
    landX: -65,
    landY: -78,
    landRot: -8,
    landScale: 1.1,
    width: '240px',
    height: '240px',
    startX: -90,
    startY: -500,
    startRot: -25,
    zIndex: 11,
  },
  {
    id: 2,
    src: '/images/chicken_drumstick_single.png',
    name: 'دبوس دجاج ذهبي عريض (قاع الفوهة يمين)',
    landX: 55,
    landY: -82,
    landRot: 18,
    landScale: 0.82,
    width: '260px',
    height: '175px',
    startX: 110,
    startY: -520,
    startRot: 35,
    zIndex: 12,
    flipX: true,
  },
  {
    id: 3,
    src: '/images/chicken_bites_transparent.png',
    name: 'قطع مقرمشة عملاقة منتصف الفوهة',
    landX: -5,
    landY: -90,
    landRot: 2,
    landScale: 1.15,
    width: '250px',
    height: '250px',
    startX: 0,
    startY: -530,
    startRot: 10,
    zIndex: 13,
  },

  // ── TIER 2: High Mid-Tier expanding upwards and outwards ──
  {
    id: 4,
    src: '/images/chicken_bites_transparent.png',
    name: 'كتل مقرمشة عريضة ترتفع بالطبقة الوسطى يساراً',
    landX: -55,
    landY: -135,
    landRot: -6,
    landScale: 1.12,
    width: '250px',
    height: '250px',
    startX: -100,
    startY: -550,
    startRot: -20,
    zIndex: 14,
  },
  {
    id: 5,
    src: '/images/chicken_drumstick_single.png',
    name: 'دبوس ذهبي ضخم يتكئ بالطبقة الوسطى يميناً',
    landX: 45,
    landY: -145,
    landRot: 12,
    landScale: 0.88,
    width: '270px',
    height: '185px',
    startX: 90,
    startY: -560,
    startRot: 25,
    zIndex: 15,
    flipX: true,
  },
  {
    id: 6,
    src: '/images/chicken_bites_transparent.png',
    name: 'قلب الجبل المقرمش بارتفاع شاهق بالمنتصف',
    landX: 0,
    landY: -165,
    landRot: 1,
    landScale: 1.2,
    width: '260px',
    height: '260px',
    startX: -15,
    startY: -570,
    startRot: -12,
    zIndex: 16,
  },

  // ── TIER 3: The towering summit platform and giant golden drumstick ──
  {
    id: 7,
    src: '/images/chicken_bites_transparent.png',
    name: 'كتلة مقرمشة شامخة تسند القمة',
    landX: -22,
    landY: -200,
    landRot: 6,
    landScale: 1.15,
    width: '240px',
    height: '240px',
    startX: -40,
    startY: -590,
    startRot: 15,
    zIndex: 17,
  },
  {
    id: 8,
    src: '/images/chicken_drumstick_single.png',
    name: 'دبوس القمة الذهبي العملاق يعتلي قمة الجبل',
    landX: 12,
    landY: -235,
    landRot: 16,
    landScale: 0.98,
    width: '310px',
    height: '210px',
    startX: 30,
    startY: -630,
    startRot: 30,
    zIndex: 18,
  },
];

export const Hero: React.FC<HeroProps> = ({ onOpenOrder, onNavigateMenu }) => {
  const [animationSettled, setAnimationSettled] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);
  const bucketParallaxRef = useRef<HTMLDivElement>(null);
  const bucketRigRef = useRef<HTMLDivElement>(null);
  const chickenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const crumbBurstRef = useRef<HTMLDivElement>(null);
  const headlineBlockRef = useRef<HTMLDivElement>(null);
  const ctaBlockRef = useRef<HTMLDivElement>(null);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Preload hero images
  useEffect(() => {
    const assetsToPreload = [
      '/images/solid_bucket_back.png',
      '/images/solid_bucket_front.png',
      '/images/chicken_drumstick_single.png',
      '/images/chicken_bites_transparent.png',
      '/solid_mascot.png',
    ];
    assetsToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ── REDUCED MOTION: Instant full final state ──
    mm.add('(prefers-reduced-motion: reduce)', () => {
      if (bucketRigRef.current) gsap.set(bucketRigRef.current, { x: 0, opacity: 1, scale: 1 });
      if (headlineBlockRef.current) gsap.set(headlineBlockRef.current, { opacity: 1, x: 0 });
      if (ctaBlockRef.current) gsap.set(ctaBlockRef.current, { opacity: 1, y: 0 });
      chickenRefs.current.forEach((el, idx) => {
        if (!el) return;
        const piece = CHICKEN_PIECES_DATA[idx];
        gsap.set(el, {
          x: piece.landX,
          y: piece.landY,
          rotation: piece.landRot,
          scale: piece.landScale,
          opacity: 1,
        });
      });
      setAnimationSettled(true);
    });

    // ── FULL MOTION CINEMATIC ANIMATION (FAST & FLUID ~3.0s) ──
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const isMobile = window.innerWidth < 1024;

        // Calculate offset to place bucket dead center of viewport on start
        let centerShiftX = 0;
        if (bucketRigRef.current && !isMobile) {
          const rect = bucketRigRef.current.getBoundingClientRect();
          const currentCenterX = rect.left + rect.width / 2;
          const viewportCenterX = window.innerWidth / 2;
          centerShiftX = viewportCenterX - currentCenterX;
        }

        // 1. Initial State: Bucket is in the exact center of screen
        gsap.set(bucketRigRef.current, {
          x: centerShiftX,
          opacity: 1,
          scale: isMobile ? 1 : 1.08,
        });

        // 2. Set all 8 pieces off-screen above
        CHICKEN_PIECES_DATA.forEach((piece, idx) => {
          const el = chickenRefs.current[idx];
          if (!el) return;
          gsap.set(el, {
            x: piece.startX,
            y: piece.startY,
            rotation: piece.startRot,
            scale: piece.landScale * 0.8,
            opacity: 0,
          });
        });

        // Headline & CTAs are hidden initially
        gsap.set(headlineBlockRef.current, { opacity: 0, x: isMobile ? 0 : 60 });
        gsap.set(ctaBlockRef.current, { opacity: 0, y: 25 });

        // Master Timeline
        const tl = gsap.timeline({
          onComplete: () => {
            setAnimationSettled(true);

            // Subtle continuous floating loop on the full bucket
            gsap.to(bucketRigRef.current, {
              y: -8,
              rotation: 0.6,
              duration: 3.2,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
          },
        });
        masterTimelineRef.current = tl;

        // ── PHASE 1: 8 Pieces Rain Down Fast and Fluidly into Center (~0.1s to 1.35s) ──
        CHICKEN_PIECES_DATA.forEach((piece, idx) => {
          const el = chickenRefs.current[idx];
          if (!el) return;

          // Rapid, fluid, overlapping cascade
          const dropStartTime = 0.1 + idx * 0.11;

          // Fast gravity acceleration into the bucket
          tl.to(
            el,
            {
              opacity: 1,
              x: piece.landX,
              y: piece.landY,
              rotation: piece.landRot,
              scale: piece.landScale,
              duration: 0.32,
              ease: 'power3.in',
            },
            dropStartTime
          )
          // Tight, physical landing bounce
          .to(
            el,
            {
              y: piece.landY + 5,
              duration: 0.05,
              ease: 'power1.in',
            },
            dropStartTime + 0.32
          )
          .to(
            el,
            {
              y: piece.landY,
              duration: 0.16,
              ease: 'elastic.out(1.15, 0.5)',
            },
            dropStartTime + 0.37
          );

          // Kinetic impact shake on bucket
          tl.to(
            bucketRigRef.current,
            {
              keyframes: [
                { y: 2.5, scale: isMobile ? 1.012 : 1.092, duration: 0.03 },
                { y: -1.5, scale: isMobile ? 0.996 : 1.076, duration: 0.03 },
                { y: 0, scale: isMobile ? 1 : 1.08, duration: 0.05 },
              ],
            },
            dropStartTime + 0.32
          );

          // Crumb burst
          tl.add(() => {
            triggerCrumbBurst(piece.landX, piece.landY);
          }, dropStartTime + 0.32);
        });

        // Last piece finishes settling around t = 1.35s
        // ── PHASE 2: Bucket is overflowing! Smooth glide to side (~t = 1.55s to 2.5s) ──
        tl.to(
          bucketRigRef.current,
          {
            x: 0,
            scale: 1,
            duration: 0.95,
            ease: 'power3.inOut',
          },
          1.55
        );

        // ── PHASE 3: Headline and CTAs enter smoothly as bucket slides (~t = 1.9s to 2.7s) ──
        tl.to(
          headlineBlockRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          1.9
        )
        .to(
          ctaBlockRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
          },
          2.15
        );

        // Scroll Parallax on outer container (no conflict with inner floating loop)
        gsap.to(bucketParallaxRef.current, {
          y: 55,
          scale: 0.97,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        });

      }, heroSectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  // Burst of golden crumbs on chicken landing
  const triggerCrumbBurst = (targetX: number, targetY: number) => {
    if (!crumbBurstRef.current) return;
    const container = crumbBurstRef.current;
    const count = 5;

    for (let i = 0; i < count; i++) {
      const crumb = document.createElement('div');
      const size = Math.random() * 6 + 4;
      crumb.style.position = 'absolute';
      crumb.style.width = `${size}px`;
      crumb.style.height = `${size}px`;
      crumb.style.left = `calc(50% + ${targetX + (Math.random() * 40 - 20)}px)`;
      crumb.style.top = `calc(38% + ${targetY + (Math.random() * 20 - 10)}px)`;
      crumb.style.borderRadius = `${Math.random() * 50}%`;
      crumb.style.backgroundImage = 'radial-gradient(circle, #FFE29A 15%, #E07A10 85%)';
      crumb.style.boxShadow = '0 2px 5px rgba(0,0,0,0.5)';
      crumb.style.pointerEvents = 'none';
      crumb.style.zIndex = '35';
      container.appendChild(crumb);

      const angle = (Math.random() * 140 + 200) * (Math.PI / 180);
      const distance = Math.random() * 60 + 30;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance;

      gsap.to(crumb, {
        x: destX,
        y: destY,
        rotation: Math.random() * 360,
        opacity: 0,
        scale: 0.3,
        duration: Math.random() * 0.3 + 0.25,
        ease: 'power3.out',
        onComplete: () => {
          crumb.remove();
        },
      });
    }
  };

  const handleSkipAnimation = () => {
    if (masterTimelineRef.current) {
      masterTimelineRef.current.progress(1);
    }
  };

  return (
    <section
      id="hero"
      ref={heroSectionRef}
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#070709] select-none"
    >
      {/* ── AMBIENT BACKGROUND GLOW (GPU Shader Gradient) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(230,0,18,0.2)_0%,rgba(255,107,0,0.08)_40%,transparent_70%)] rounded-full" />
        <div className="absolute -bottom-24 left-10 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(230,0,18,0.14)_0%,transparent_70%)] rounded-full" />
        <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
      </div>

      {/* Subtle Geometric Background Grid */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(to_right,#e60012_1px,transparent_1px),linear-gradient(to_bottom,#e60012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] z-0" />

      {/* Mascot Watermark Silhouette */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-[450px] lg:w-[600px] opacity-[0.03] pointer-events-none select-none z-0">
        <img src="/solid_mascot.png" alt="" className="w-full h-auto filter invert" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[75vh]">

          {/* ── RIGHT COLUMN (in RTL): SOLID BRAND TYPOGRAPHY & CTAs ── */}
          <div
            ref={headlineBlockRef}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-right"
          >
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/70 border border-[#E60012]/60 text-white text-xs sm:text-sm font-headline mb-6 shadow-xl backdrop-blur-md">
              <Flame className="w-4 h-4 text-[#E60012] fill-[#E60012] animate-pulse" />
              <span>أقرمش وألذ فرايد تشيكن فريش في مصر كلها 🔥</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            </div>

            {/* Main Headline */}
            <h1
              className="font-headline leading-[1.08] text-white mb-6"
              style={{ fontSize: 'clamp(2.8rem, 6.2vw, 6.2rem)' }}
            >
              <span className="block text-white">
                عاشق القرمشة؟
              </span>
              <span className="block text-[#E60012] mt-1">
                مكانك هنا في سوليد!
              </span>
              <span className="block text-zinc-300 text-2xl sm:text-3xl md:text-4xl mt-3 font-headline font-bold">
                طعم فريش ملوش منافس
              </span>
            </h1>

            {/* Sub-text */}
            <p className="max-w-xl text-base sm:text-lg text-zinc-300 font-medium leading-relaxed mb-8">
              فراخ مزارع طازة يوم بيومه بتتنقع ٤٨ ساعة في تتبيلتنا الخاصة، وبتنزل الزيت سخنة أول ما تطلب.. باكت سوليد مليان قرمشة وسعادة تكفي اللمة وسهرات الصحاب.
            </p>

            {/* Action Buttons */}
            <div
              ref={ctaBlockRef}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8"
            >
              <button
                onClick={() => {
                  playCrunchSound();
                  onOpenOrder();
                }}
                className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-[#E60012] via-[#f50013] to-[#cc0010] text-white font-headline text-xl sm:text-2xl shadow-[0_10px_35px_-5px_rgba(230,0,18,0.7)] hover:shadow-[0_15px_45px_rgba(230,0,18,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer border border-red-500/50"
              >
                <span>اطلب دليفري دلوقتي</span>
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  playCrunchSound();
                  if (onNavigateMenu) {
                    onNavigateMenu();
                  } else {
                    const el = document.getElementById('menu');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-headline text-lg border border-zinc-700 hover:border-[#E60012] transition-all duration-300 flex items-center justify-center gap-2 group backdrop-blur-md cursor-pointer"
              >
                <span>تصفح المنيو الكامل والأسعار</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E60012] group-hover:scale-150 transition-transform" />
              </button>

              <a
                href="tel:01010926702"
                onClick={playCrunchSound}
                dir="ltr"
                className="hidden xl:flex items-center gap-2 px-5 py-4 rounded-2xl bg-black/60 border border-zinc-800 hover:border-red-600/60 text-zinc-300 hover:text-white transition-all text-sm font-headline"
              >
                <Phone className="w-4 h-4 text-[#E60012]" />
                <span>01010926702</span>
              </a>
            </div>

            {/* Proof Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-4 border-t border-zinc-800/80 text-zinc-300 text-xs sm:text-sm font-headline">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E60012]" />
                <span>فراخ فريش ١٠٠٪</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF6B00]" />
                <span>توصيل شغال لحد ٤ الفجر</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>قرمشة وسخونة مضمونة</span>
              </div>
            </div>
          </div>

          {/* ── LEFT COLUMN (in RTL): OFFICIAL SOLID BUCKET & 8 INDIVIDUAL STACKING CHICKEN PIECES ── */}
          <div className="lg:col-span-5 relative flex items-center justify-center">

            {/* Parallax Outer Container (Decoupled from inner floating loop for silky-smooth scroll) */}
            <div ref={bucketParallaxRef} className="relative flex items-center justify-center w-full">
              {/* The Animated Bucket Assembly */}
              <div
                ref={bucketRigRef}
                className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] md:w-[480px] md:h-[480px] flex items-center justify-center"
                style={{ willChange: 'transform, opacity' }}
              >
                {/* Floor ambient glow & shadow */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[300px] sm:w-[380px] h-[40px] bg-black/80 blur-xl rounded-[100%] pointer-events-none" />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[340px] sm:w-[420px] h-[60px] bg-[#E60012]/20 blur-2xl rounded-[100%] pointer-events-none" />

                {/* ── LAYER A: SOLID BUCKET BACK INTERIOR WALL (zIndex: 10) ── */}
                <img
                  src="/images/solid_bucket_back.png"
                  alt="Solid Bucket Interior"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  style={{ zIndex: 10 }}
                />

                {/* ── LAYER B: 8 INDIVIDUAL CHICKEN PIECES THAT FALL, STACK, AND OVERFLOW ── */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {CHICKEN_PIECES_DATA.map((piece, idx) => (
                    <div
                      key={piece.id}
                      ref={(el) => {
                        chickenRefs.current[idx] = el;
                      }}
                      className="absolute"
                      style={{
                        width: piece.width,
                        height: piece.height,
                        zIndex: piece.zIndex,
                        transform: piece.flipX ? 'scaleX(-1)' : 'none',
                        willChange: 'transform, opacity',
                      }}
                    >
                      <img
                        src={piece.src}
                        alt={piece.name}
                        className="w-full h-full object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.85)]"
                      />
                    </div>
                  ))}
                </div>

                {/* ── LAYER C: SOLID BUCKET FRONT WALL WITH OFFICIAL SOLID LOGO & ROOSTER (zIndex: 25) ── */}
                {/* All 8 pieces sit behind this front wall (zIndex 11-18), so they realistically sit INSIDE the bucket! */}
                <img
                  src="/images/solid_bucket_front.png"
                  alt="Solid Fried Chicken Official Bucket"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]"
                  style={{ zIndex: 25 }}
                />

                {/* Crumb Burst Particles Container */}
                <div ref={crumbBurstRef} className="absolute inset-0 pointer-events-none z-35" />

                {/* Floating Badges (Visible when settled) */}
                {animationSettled && (
                  <>
                    <div className="hero-floating-pill absolute -bottom-4 -right-2 sm:-right-4 bg-zinc-900/95 border-2 border-[#E60012] p-3.5 sm:p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl flex items-center gap-3 z-30 animate-fadeIn">
                      <div className="w-11 h-11 rounded-xl bg-[#E60012] flex items-center justify-center font-headline text-xl text-white shadow-md shrink-0">
                        ٤٨<span className="text-[10px]">س</span>
                      </div>
                      <div>
                        <div className="font-headline text-xs sm:text-sm text-white">
                          تتبيلة منقوعة ٤٨ ساعة
                        </div>
                        <div className="text-zinc-400 text-[10px] sm:text-xs mt-0.5">
                          طعم واصل لحد العظم
                        </div>
                      </div>
                    </div>

                    <div className="hero-floating-pill absolute -top-4 -left-2 sm:-left-4 bg-black/90 border border-yellow-500/50 px-3.5 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 z-30 animate-fadeIn">
                      <span className="text-lg">🍗</span>
                      <div>
                        <span className="font-headline text-yellow-400 text-sm sm:text-base">١٠٠٪</span>
                        <span className="text-[10px] sm:text-xs font-headline text-zinc-200 mr-1">
                          فراخ مزارع فريش
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Skip animation button during the intro */}
            {!animationSettled && (
              <button
                onClick={handleSkipAnimation}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-zinc-500 hover:text-white text-xs font-headline transition-colors cursor-pointer px-3.5 py-1.5 rounded-full bg-black/60 border border-zinc-800"
              >
                تخطي الأنميشن ←
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
