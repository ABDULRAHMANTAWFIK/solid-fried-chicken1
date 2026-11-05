import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRANCH_LOCATIONS } from '../data/menu';
import { MapPin, Phone, Clock, Navigation, CheckCircle2 } from 'lucide-react';
import { playCrunchSound } from '../utils/audio';

gsap.registerPlugin(ScrollTrigger);

export const LocationsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // Headline
        gsap.fromTo('.locations-line',
          { yPercent: 110 },
          {
            yPercent: 0,
            stagger: 0.12,
            duration: 0.9,
            ease: 'power4.out',
            scrollTrigger: { trigger: '.locations-headline', start: 'top 82%' },
          }
        );

        // Branch cards
        gsap.fromTo('.location-card',
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1, y: 0, scale: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.locations-grid', start: 'top 82%' },
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="locations"
      ref={sectionRef}
      className="relative py-28 sm:py-36 bg-[#08080a] overflow-hidden border-t border-zinc-900"
    >
      {/* Ambient (Hardware-accelerated shader) */}
      <div className="absolute top-1/2 left-0 w-[50vw] h-[60vh] bg-[radial-gradient(circle,rgba(230,0,18,0.12)_0%,transparent_70%)] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <div className="locations-headline flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[3px] bg-[#E60012]" />
              <span className="font-headline text-[#E60012] text-sm tracking-widest uppercase">الفرع والمقر الرسمي</span>
            </div>
            <h2 className="font-headline text-white leading-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}>
              <span className="block line-reveal-wrapper"><span className="locations-line inline-block">فرعنا الوحيد</span></span>
              <span className="block line-reveal-wrapper text-[#E60012]"><span className="locations-line inline-block">في الفشن - بني سويف</span></span>
            </h2>
          </div>
          <p className="max-w-md text-zinc-400 font-medium leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1rem)' }}>
            بنستناك تشرفنا في صالتنا المكيفة، أو تطلب تيك أواي ودليفري طيارة يوصلك مقلي فريش وسخن لحد باب بيتك لحد الفجر.
          </p>
        </div>

        {/* Flagship Branch Card */}
        {BRANCH_LOCATIONS.map((branch) => (
          <div
            key={branch.id}
            className="location-card rounded-3xl bg-zinc-900/90 border-2 border-red-600/50 p-6 sm:p-10 lg:p-12 backdrop-blur-xl shadow-[0_20px_60px_rgba(230,0,18,0.15)] relative overflow-hidden"
          >
            {/* Ambient Red Glow in Card (Hardware-accelerated) */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(230,0,18,0.14)_0%,transparent_70%)] pointer-events-none rounded-full" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-700/60 text-xs font-headline text-yellow-300 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <span>{branch.status}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Info Column */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-sm font-headline text-[#E60012] mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>{branch.city}</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-headline text-white mb-2">{branch.name}</h3>
                  <p className="text-zinc-300 font-headline text-base sm:text-lg leading-relaxed">{branch.address}</p>
                </div>

                {/* Working Hours */}
                <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                    <strong className="text-white block font-headline mb-0.5">مواعيد العمل:</strong>
                    <span>{branch.hours}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {branch.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800/80 border border-zinc-700 text-xs font-headline text-zinc-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#E60012]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Column */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-black/60 border border-zinc-800/80">
                <div className="text-center sm:text-right">
                  <span className="text-xs font-headline text-zinc-400 block mb-1">خطوط الطلب المباشر والتوصيل السريع</span>
                  <span className="text-white font-headline text-lg">جاهزين نلبي طلبك فوراً 🔥</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {branch.hotlines.map((num) => (
                    <a
                      key={num}
                      href={`tel:${num}`}
                      onClick={playCrunchSound}
                      dir="ltr"
                      className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-[#E60012] hover:bg-[#E60012]/10 transition-all text-base font-headline text-white group shadow-md"
                    >
                      <span className="text-xs text-zinc-400 group-hover:text-white">اتصل الآن</span>
                      <div className="flex items-center gap-2">
                        <span className="tracking-wider">{num}</span>
                        <Phone className="w-4 h-4 text-[#E60012] group-hover:scale-110 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>

                <a
                  href={branch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={playCrunchSound}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-headline text-sm transition-all shadow-md"
                >
                  <Navigation className="w-4 h-4 text-[#E60012]" />
                  <span>افتح العنوان على خرائط جوجل</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
