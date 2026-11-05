import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Flame, CheckCircle2, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const BrandStory: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // Image reveal & subtle scale on scroll
        gsap.fromTo(
          imageContainerRef.current,
          { scale: 0.92, opacity: 0.7, y: 30 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            },
          }
        );

        // Headline lines reveal
        gsap.fromTo(
          '.story-anim-line',
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.9,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: '.story-headline-block',
              start: 'top 80%',
            },
          }
        );

        // Stat cards stagger
        gsap.fromTo(
          '.story-stat-box',
          { opacity: 0, y: 25, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.7,
            ease: 'back.out(1.6)',
            scrollTrigger: {
              trigger: '.story-stats-grid',
              start: 'top 85%',
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
      id="story"
      ref={sectionRef}
      className="relative py-28 sm:py-36 bg-[#08080a] overflow-hidden"
    >
      {/* Background Volumetric Ambience (Hardware-accelerated shader) */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(230,0,18,0.14)_0%,transparent_70%)] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(255,107,0,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Mascot Watermark Background */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-[400px] opacity-[0.03] pointer-events-none select-none">
        <img src="/solid_mascot.png" alt="" className="w-full h-auto filter invert" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-1 bg-[#E60012] inline-block" />
          <span className="font-headline text-[#E60012] text-sm tracking-wide">
            إيه السر وراء طعم سوليد؟
          </span>
        </div>

        {/* Section Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Right Column (in RTL): Story Content */}
          <div className="lg:col-span-6 flex flex-col text-right">
            
            <div className="story-headline-block mb-6">
              <h2
                className="font-headline leading-tight text-white"
                style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.8rem)' }}
              >
                <span className="block line-reveal-wrapper">
                  <span className="story-anim-line inline-block">القرمشة الصح</span>
                </span>
                <span className="block line-reveal-wrapper text-[#E60012]">
                  <span className="story-anim-line inline-block">مبتحصلش بالصدفة!</span>
                </span>
              </h2>
            </div>

            <div className="space-y-4 text-zinc-300 text-base sm:text-lg leading-relaxed font-medium mb-8">
              <p>
                الفكرة عندنا بسيطة ومفيهاش لف ولا دوران: مفيش حاجة اسمها فراخ بايتة ولا فراخ متفرزة ومقلية من بدري ومركونة في السخان تطرى. الفراخ بتجيلنا من المزارع طازة كل يوم، بتتنضف وتتنقع في تتبيلتنا الخاصة عشان تشرب النكهة لحد العظم.
              </p>
              
              <div className="p-4 rounded-2xl bg-zinc-900/90 border-r-4 border-[#E60012] border-y border-l border-zinc-800">
                <p className="text-white text-lg sm:text-xl font-headline leading-snug">
                  "أول ما تطلب، فراخك بتنزل الزيت في ساعتها عشان تاكلها بتدخن ومقرمشة!"
                </p>
              </div>

              <p>
                بنقلي في زيت نقي بدرجة حرارة مظبوطة ومحسوبة، فالنتيجة بتطلع قشرة دهبية كرسبي وخفيفة على المعدة، ومن جوة اللحم أبيض وطري ومستوي على أكمل وجه.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                <CheckCircle2 className="w-5 h-5 text-[#E60012] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-headline text-white text-sm">فراخ مزارع طازة</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">استلام يومي من مزارع معتمدة ونضيفة.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                <Flame className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-headline text-white text-sm">قلي فريش لكل أوردر</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">طلبك بينزل الزيت فوراً بعد ما تطلبه.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-headline text-white text-sm">خلطة بهارات خاصة</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">نكهة متبلة ومحبوشة لآخر قطمة.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                <ShieldCheck className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-headline text-white text-sm">زيت نقي خفيف</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">تغيير دوري ومستمر، خفيف على المعدة.</p>
                </div>
              </div>
            </div>

            {/* Quick Proof Numbers */}
            <div className="story-stats-grid grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
              <div className="story-stat-box text-center p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
                <div className="font-headline text-3xl sm:text-4xl text-[#E60012]">٤٨ ساعة</div>
                <div className="text-xs font-headline text-zinc-400 mt-1">نقع وتتبيل الفراخ</div>
              </div>
              <div className="story-stat-box text-center p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
                <div className="font-headline text-3xl sm:text-4xl text-white">١٠٠٪ فريش</div>
                <div className="text-xs font-headline text-zinc-400 mt-1">قلي فوري مع الأوردر</div>
              </div>
              <div className="story-stat-box text-center p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
                <div className="font-headline text-3xl sm:text-4xl text-[#FF6B00]">زيت نقي</div>
                <div className="text-xs font-headline text-zinc-400 mt-1">خفيف ومقرمش</div>
              </div>
            </div>
          </div>

          {/* Left Column (in RTL): Macro Crunch Image */}
          <div ref={imageContainerRef} className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-red-950/80 shadow-[0_25px_80px_rgba(230,0,18,0.35)] group">
              <img
                src="/images/brand_crunch_macro.jpg"
                alt="تندر فراخ مقرمشة سخنة من سوليد"
                className="w-full h-[450px] sm:h-[540px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

              {/* Bottom Quote Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/85 backdrop-blur-md border border-zinc-800">
                <div className="flex items-center gap-2 text-[#E60012] font-headline text-xs mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E60012] animate-ping" />
                  <span>تعهد سوليد بالجودة</span>
                </div>
                <p className="text-white font-headline text-lg sm:text-xl leading-snug">
                  "الأوردر لازم يوصلك سخن ومقرمش زي ما اتعودت، ده وعد مننا لكل عميل."
                </p>
              </div>

              <div className="absolute top-5 right-5 px-3.5 py-1.5 rounded-xl bg-[#E60012] text-white font-headline text-xs shadow-lg">
                فراخ مقلية بتتبيلة خاصة 🔥
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
