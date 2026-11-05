import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, ArrowLeft, Phone, ShieldCheck, Clock, Award } from 'lucide-react';
import { playCrunchSound } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

interface FinalCTAProps {
  onOpenOrder: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenOrder }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // Parallax background image
        gsap.to('.final-bg-photo', {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        // Headline entrance
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );

        // Buttons pop in
        gsap.fromTo(
          '.final-cta-btn',
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'back.out(1.6)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 sm:py-44 bg-[#050507] overflow-hidden flex items-center justify-center text-center"
    >
      {/* Background Campaign Photography with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/images/football_match_campaign.jpg"
          alt="سوليد فرايد تشيكن"
          className="final-bg-photo w-full h-[120%] -top-[10%] object-cover object-center filter brightness-[0.25] contrast-125"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/60 to-[#050507]" />
      </div>

      {/* Volumetric Red Core Ambient Glow (Hardware-accelerated) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(230,0,18,0.25)_0%,rgba(255,77,0,0.12)_40%,transparent_70%)] rounded-full pointer-events-none" />

      {/* Rooster Watermark Silhouette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] opacity-[0.05] pointer-events-none select-none">
        <img src="/solid_mascot.png" alt="" className="w-full h-auto filter invert" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Pulsing Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-950/70 border border-[#E60012]/50 text-white text-xs sm:text-sm font-headline mb-8 shadow-xl backdrop-blur-md">
          <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
          <span>جعان دلوقتي؟ اطلب اللي يسد معاك 🔥</span>
        </div>

        {/* Main Climax Headline */}
        <h2
          ref={headlineRef}
          className="font-headline leading-tight text-white mb-6 drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)]"
          style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
        >
          نفسك راحت للفرايد تشيكن؟ <br />
          <span className="text-[#E60012]">
            طلبك جاهز يوصلك
          </span>{' '}
          لحد باب البيت!
        </h2>

        {/* Sub-copy */}
        <p className="max-w-xl mx-auto text-base sm:text-xl text-zinc-300 font-medium mb-12 leading-relaxed">
          مطبخنا شغال والطيار مستني.. اطلب دلوقتي الوجبة اللي تعجبك وهتوصلك سخنة ومقرمشة في أسرع وقت.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 max-w-md mx-auto mb-12">
          <button
            onClick={() => {
              playCrunchSound();
              onOpenOrder();
            }}
            className="final-cta-btn w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-[#E60012] via-[#f50013] to-[#cc0010] text-white font-headline text-2xl sm:text-3xl shadow-[0_15px_50px_rgba(230,0,18,0.85)] hover:shadow-[0_20px_70px_rgba(230,0,18,1)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group border-2 border-red-500/40"
          >
            <span>اطلب دليفري دلوقتي</span>
            <ArrowLeft className="w-7 h-7 group-hover:-translate-x-2 transition-transform" />
          </button>

          <a
            href="tel:01010926702"
            onClick={playCrunchSound}
            className="final-cta-btn w-full sm:w-auto px-8 py-5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-white font-headline text-xl border border-zinc-700 hover:border-[#E60012] transition-all duration-300 flex items-center justify-center gap-2 group backdrop-blur-md"
            dir="ltr"
          >
            <Phone className="w-5 h-5 text-[#E60012] group-hover:animate-bounce" />
            <span>01010926702</span>
          </a>
        </div>

        {/* Trust Markers */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-400 text-xs sm:text-sm font-headline pt-8 border-t border-zinc-800/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E60012]" />
            <span>فراخ فريش يومياً</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF6B00]" />
            <span>توصيل شغال لحد ٤ الفجر</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>قرمشة واصلة سخنة لحد بيتك</span>
          </div>
        </div>
      </div>
    </section>
  );
};
