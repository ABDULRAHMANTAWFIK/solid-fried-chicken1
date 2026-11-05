import { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarqueeTicker } from './components/MarqueeTicker';
import { BrandStory } from './components/BrandStory';
import { BestSellers } from './components/BestSellers';
import { MascotSection } from './components/MascotSection';
import { MatchDaySection } from './components/MatchDaySection';
import { LocationsSection } from './components/LocationsSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { FullMenuPage } from './components/FullMenuPage';
import { OrderDrawer } from './components/OrderDrawer';
import type { CartItem } from './components/OrderDrawer';
import type { MenuItem } from './data/menu';
import { Phone, Flame, ArrowRight } from 'lucide-react';
import { playCrunchSound } from './utils/audio';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'menu'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#menu-full') {
      return 'menu';
    }
    return 'home';
  });
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([
    {
      item: {
        id: 'solid-box-combo',
        name: 'سوليد بوكس ميكس (دجاج + استربس)',
        englishSub: 'Solid Box (Mix Chicken & Strips)',
        category: 'وجبات الدجاج الفردية',
        price: '225 جنيه',
        badge: 'الأكتر مبيعاً 🔥',
        description: '٢ قطعة دجاج كرسبي + ٢ قطعة استربس مقرمش + بطاطس كرينكل + أرز بسمتي + تومية + كلوسلو + ٢ خبز.',
        spiceLevel: 3,
        image: '/images/product_box_meal.jpg',
        calories: 'ميكس متكامل ومشبع',
        pieces: '٢ دجاج + ٢ استربس + أرز + بطاطس',
      },
      quantity: 1,
    },
  ]);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#menu-full') {
        setCurrentView('menu');
      } else if (window.location.hash === '#home' || !window.location.hash) {
        setCurrentView('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Smoothly recalculate ScrollTriggers when switching back to home view
  useEffect(() => {
    if (currentView === 'home') {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  const navigateToMenu = () => {
    window.location.hash = '#menu-full';
    setCurrentView('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.location.hash = '#home';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === itemId) {
            const newQ = c.quantity + delta;
            return newQ > 0 ? { ...c, quantity: newQ } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const handleClearCart = () => setCart([]);

  const totalCartCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-[#E60012] selection:text-white flex flex-col relative font-arabic">

      {currentView === 'menu' ? (
        <FullMenuPage
          onBackToHome={navigateToHome}
          onOpenOrder={() => setIsOrderOpen(true)}
          onAddToCart={handleAddToCart}
          cartCount={totalCartCount}
        />
      ) : (
        <>
          <Navbar
            onOpenOrder={() => setIsOrderOpen(true)}
            onNavigateMenu={navigateToMenu}
            cartCount={totalCartCount}
          />

          <main className="flex-grow">
            {/* SCENE 01 — THE SOLID PLATE */}
            <Hero
              onOpenOrder={() => setIsOrderOpen(true)}
              onNavigateMenu={navigateToMenu}
            />

            <MarqueeTicker />

            <BrandStory />

            {/* SCENE 02 — CRISPY DROP */}
            <BestSellers
              onAddToCart={handleAddToCart}
              onOpenOrder={() => setIsOrderOpen(true)}
              onNavigateMenu={navigateToMenu}
            />

            {/* SCENE 03 — ROOSTER TAKEOVER */}
            <MascotSection />

            {/* SCENE 04 — SOLID MATCH DAY */}
            <MatchDaySection onOpenOrder={() => setIsOrderOpen(true)} />

            <LocationsSection />

            <FinalCTA onOpenOrder={() => setIsOrderOpen(true)} />
          </main>

          <Footer onNavigateMenu={navigateToMenu} />
        </>
      )}

      <OrderDrawer
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Mobile FAB */}
      <div className="fixed bottom-6 left-4 sm:hidden z-40 flex flex-col gap-2.5">
        {currentView === 'home' && (
          <button
            onClick={() => { playCrunchSound(); navigateToMenu(); }}
            title="المنيو الكامل"
            className="w-12 h-12 rounded-full bg-red-950 border-2 border-[#E60012] flex items-center justify-center text-white shadow-xl cursor-pointer"
          >
            <ArrowRight className="w-5 h-5 text-yellow-300" />
          </button>
        )}
        <a
          href="tel:01010926702"
          onClick={playCrunchSound}
          className="w-12 h-12 rounded-full bg-zinc-900 border border-red-600 flex items-center justify-center text-white shadow-xl"
        >
          <Phone className="w-5 h-5 text-[#E60012]" />
        </a>
        <button
          onClick={() => { playCrunchSound(); setIsOrderOpen(true); }}
          className="w-14 h-14 rounded-full bg-[#E60012] flex items-center justify-center text-white shadow-[0_0_25px_rgba(230,0,18,0.7)] relative cursor-pointer"
        >
          <Flame className="w-6 h-6 fill-white" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-yellow-400 text-black text-xs font-black flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default App;
