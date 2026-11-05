import React from 'react';
import { Phone, MapPin, ArrowUp } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './Icons';
import { playCrunchSound } from '../utils/audio';
import { DEVELOPER_CONFIG } from '../config/developer';

interface FooterProps {
  onNavigateMenu?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateMenu }) => {
  const scrollToTop = () => {
    playCrunchSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050507] border-t border-zinc-900 pt-20 pb-12 overflow-hidden text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-zinc-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/solid_mascot.png"
                alt="شعار سوليد فرايد تشيكن"
                className="w-12 h-12 object-contain drop-shadow-[0_0_20px_rgba(230,0,18,0.7)]"
              />
              <div className="text-right">
                <span className="font-headline text-3xl text-white flex items-center gap-1.5 leading-none">
                  سوليد <span className="text-[#E60012]">تشيكن</span>
                </span>
                <span className="text-xs text-[#FF6B00] font-headline mt-1 block">
                  الفراخ المقرمشة على أصولها • SOLID CHICKEN
                </span>
              </div>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-sm font-medium">
              مطعم سوليد فرايد تشيكن - بنقدم أحسن فرايد تشيكن مقلي فريش بخلطة وتتبيلة خاصة. هدفنا دايماً وجبة سخنة ومقرمشة تشرفك وتشبعك.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/solid_fried_chicken/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playCrunchSound}
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#E60012] hover:bg-[#E60012] hover:text-white transition-all flex items-center justify-center text-zinc-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playCrunchSound}
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#E60012] hover:bg-[#E60012] hover:text-white transition-all flex items-center justify-center text-zinc-300"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="tel:01010926702"
                onClick={playCrunchSound}
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#E60012] hover:bg-[#E60012] hover:text-white transition-all flex items-center justify-center text-zinc-300"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-headline text-base text-white mb-4">
              أقسام الموقع
            </h4>
            <ul className="space-y-3 text-sm font-headline">
              <li>
                <a href="#hero" onClick={playCrunchSound} className="hover:text-[#E60012] transition-colors">
                  الرئيسية
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    playCrunchSound();
                    if (onNavigateMenu) {
                      onNavigateMenu();
                    } else {
                      window.location.hash = '#menu';
                    }
                  }}
                  className="hover:text-[#E60012] transition-colors cursor-pointer text-right flex items-center gap-1.5"
                >
                  <span>المنيو الكامل (٦٠+ صنف)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E60012]" />
                </button>
              </li>
              <li>
                <a href="#story" onClick={playCrunchSound} className="hover:text-[#E60012] transition-colors">
                  سر الطعم
                </a>
              </li>
              <li>
                <a href="#mascot" onClick={playCrunchSound} className="hover:text-[#E60012] transition-colors">
                  شعار سوليد
                </a>
              </li>
              <li>
                <a href="#locations" onClick={playCrunchSound} className="hover:text-[#E60012] transition-colors">
                  الفرع والتوصيل
                </a>
              </li>
            </ul>
          </div>

          {/* Hours & Service */}
          <div className="lg:col-span-2">
            <h4 className="font-headline text-base text-white mb-4">
              مواعيد العمل
            </h4>
            <div className="space-y-3 text-xs leading-relaxed font-medium">
              <div>
                <span className="text-white block font-headline text-sm">استقبال الصالة:</span>
                <span>يومياً من ١ ظهراً حتى ٩ مساءً</span>
              </div>
              <div>
                <span className="text-white block font-headline text-sm">التيك أواي والتوصيل:</span>
                <span className="text-[#FF6B00] font-bold">شغالين حتى ٤ فجراً</span>
              </div>
              <div>
                <span className="text-white block font-headline text-sm">أرقام الدليفري:</span>
                <span className="text-[#E60012] font-black" dir="ltr">01010926702</span>
              </div>
            </div>
          </div>

          {/* Branch Flagship Info */}
          <div className="lg:col-span-3">
            <h4 className="font-headline text-base text-white mb-4">
              عنوان الفرع
            </h4>
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
                <span className="text-zinc-300 leading-relaxed font-semibold">
                  شارع البحر (طريق الفنية) - مركز الفشن - محافظة بني سويف
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-800 text-[#FF6B00] font-headline">
                متوفر خدمة توصيل سريعة لجميع المناطق المجاورة 🛵
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-headline">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-zinc-400">
            <span className="text-zinc-300 font-semibold tracking-wide">
              © 2026 Solid Fried Chicken. All rights reserved.
            </span>
            <span className="text-zinc-700 hidden sm:inline">•</span>
            <span className="text-zinc-400">
              جميع الحقوق محفوظة لمطعم سوليد فرايد تشيكن (SOLID) 🇪🇬
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all font-headline cursor-pointer border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#E60012] focus:ring-offset-2 focus:ring-offset-[#050507]"
            aria-label="الرجوع إلى أعلى الصفحة"
          >
            <span>اطلع لأول الصفحة</span>
            <ArrowUp className="w-4 h-4 text-[#E60012]" />
          </button>
        </div>

        {/* Developer Attribution Sub-Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-center text-center text-xs font-mono text-zinc-500">
          <p className="tracking-wide text-zinc-400">
            Designed &amp; Developed by{' '}
            <a
              href={DEVELOPER_CONFIG.url}
              target={DEVELOPER_CONFIG.url !== '#' ? '_blank' : undefined}
              rel={DEVELOPER_CONFIG.url !== '#' ? 'noopener noreferrer' : undefined}
              className="text-zinc-200 hover:text-[#E60012] font-semibold transition-colors duration-200 underline decoration-zinc-700 hover:decoration-[#E60012] underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#E60012] focus:ring-offset-2 focus:ring-offset-[#050507] rounded px-1 py-0.5 inline-block"
              title="Developer Portfolio / Contact"
            >
              [{DEVELOPER_CONFIG.name}]
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
