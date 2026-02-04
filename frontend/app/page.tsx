"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useInView } from "framer-motion";
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  Smartphone, 
  Wrench, 
  Stethoscope, 
  Utensils,
  Globe,
  Target,
  Navigation,
  ShieldCheck,
  CheckCircle,
  Scale,
  Compass, // Logo Icon
  Menu,    // Mobile Menu Icon
  X        // Close Icon
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

// --- IMPORTS FROM YOUR COMPONENT FOLDER ---
// Ensure these files exist in app/component/ and export default
import SearchPage from "@/component/search";
import ComparePage from "@/component/compare";
import AboutPage from "@/component/about";

// --- Fonts ---
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

// --- Types ---
interface StatProps {
  end: number;
  suffix?: string;
  label: string;
}

export default function MasterPage() {
  // State to manage which "Page" is currently visible
  const [currentView, setCurrentView] = useState("home");

  // Function to render the correct component based on state
  const renderView = () => {
    switch (currentView) {
      case "search": return <SearchPage />;
      case "compare": return <ComparePage />;
      case "about": return <AboutPage />;
      default: return (
        <>
          {/* HOME PAGE CONTENT */}
          <HeroSection onViewChange={setCurrentView} />
          <CategorySection />
          <HowItWorksSection />
          <USPSection />
          <StatsSection />
          <ExamplePreviewSection onViewChange={setCurrentView} />
          <Footer onViewChange={setCurrentView} />
        </>
      );
    }
  };

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-slate-900 ${inter.className} selection:bg-[#FF6B6B] selection:text-white`}>
      
      {/* --- 0. SMART NAVIGATION --- */}
      <Navbar currentView={currentView} onViewChange={setCurrentView} />

      {/* --- MAIN CONTENT AREA --- */}
      <main className="pt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- INNOVATIVE MORPHING NAVBAR (Responsive Fix) ---
function Navbar({ currentView, onViewChange }: { currentView: string, onViewChange: (view: string) => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", id: "home", type: "view" },
    { name: "About", id: "about", type: "view" },
    { name: "Plans & Pricing", id: "search", type: "view" },   
    { name: "Dashboard", href: "/dashboard", type: "link" },
  ];

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center items-start pt-4 px-4 pointer-events-none"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <motion.nav
          layout
          className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isScrolled || currentView !== 'home'
              ? "bg-white/90 backdrop-blur-xl shadow-2xl shadow-[#0D7377]/10 rounded-full py-3 px-3 md:px-5 w-[90%] md:w-auto md:min-w-[800px] border border-white/50 ring-1 ring-[#0D7377]/5"
              : "bg-transparent py-4 px-6 w-full max-w-7xl"
          }`}
        >
          {/* --- 1. LOGO AREA --- */}
          <button onClick={() => onViewChange('home')} className="flex items-center gap-2 group relative z-10 pl-2">
            <div className="relative">
               <div className="absolute inset-0 bg-[#0D7377] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
               <motion.div
                 layout
                 className={`relative flex items-center justify-center bg-gradient-to-br from-[#0D7377] to-[#0A5E61] text-white rounded-xl shadow-lg transition-all ${isScrolled || currentView !== 'home' ? "w-9 h-9" : "w-11 h-11"}`}
               >
                 <Compass className={`transition-transform duration-700 ${isScrolled || currentView !== 'home' ? "w-5 h-5" : "w-6 h-6"} group-hover:rotate-180`} />
               </motion.div>
            </div>
            
            <motion.div layout className="flex flex-col text-left">
              <span className={`font-bold tracking-tight text-[#0D7377] leading-none ${dmSans.className} ${isScrolled || currentView !== 'home' ? "text-lg" : "text-2xl"}`}>
                ComparatorX
              </span>
              {!isScrolled && currentView === 'home' && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-[10px] font-bold text-[#FF6B6B] tracking-widest uppercase"
                >
                  Decision Engine
                </motion.span>
              )}
            </motion.div>
          </button>

          {/* --- 2. DESKTOP LINKS --- */}
          <div className="hidden md:flex items-center bg-slate-100/50 p-1 rounded-full border border-slate-200/50 backdrop-blur-md mx-4">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              if (item.type === 'link') {
                 return (
                    <Link key={item.name} href={item.href!} className="relative px-4 py-2 text-sm font-bold text-slate-500 hover:text-[#0D7377] transition-colors">
                      {item.name}
                    </Link>
                 );
              }
              return (
                <button
                  key={item.name}
                  onClick={() => onViewChange(item.id!)}
                  onMouseEnter={() => setHoveredTab(item.name)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`relative px-4 py-2 text-sm font-bold transition-colors z-10 ${isActive ? "text-[#0D7377]" : "text-slate-500"}`}
                >
                  {isActive && (
                    <motion.div layoutId="active-pill" className="absolute inset-0 bg-white rounded-full shadow-sm border border-slate-100/50 -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                  )}
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* --- 3. CTA & ACTIONS --- */}
          <div className="flex items-center gap-3 md:gap-4 pr-1">
             
             {/* Desktop: Login Link (Hidden on Mobile) */}
             <Link href="/login" className="hidden md:block text-sm font-bold text-slate-600 hover:text-[#0D7377] transition-colors px-2">
               Log in
             </Link>

             {/* Desktop: Get Started Button (Hidden on Mobile) */}
             <Link href="/dashboard" className="hidden md:block">
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className={`relative overflow-hidden bg-[#FF6B6B] text-white font-bold rounded-full shadow-lg shadow-[#FF6B6B]/30 flex items-center gap-2 group ${isScrolled || currentView !== 'home' ? "px-5 py-2 text-sm" : "px-7 py-3 text-base"}`}
               >
                 <span className="relative z-10">Get Started</span>
                 <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
               </motion.button>
             </Link>

             {/* Mobile Hamburger (Visible on Mobile) */}
             <button 
               className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-900"
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
               <motion.div animate={isMobileMenuOpen ? "open" : "closed"} className="flex flex-col gap-1">
                 <motion.span variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 6 } }} className="w-5 h-0.5 bg-current block transition-transform origin-center" />
                 <motion.span variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} className="w-5 h-0.5 bg-current block transition-opacity" />
                 <motion.span variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -6 } }} className="w-5 h-0.5 bg-current block transition-transform origin-center" />
               </motion.div>
             </button>
          </div>
        </motion.nav>
      </motion.header>

      {/* --- MOBILE FULLSCREEN MENU --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ type: "spring", damping: 25, stiffness: 100 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 flex flex-col items-center justify-center text-center"
          >
             <div className="space-y-6 w-full max-w-sm">
               {navItems.map((item, i) => (
                 <motion.div
                   key={item.name}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 + i * 0.1 }}
                 >
                   {item.type === 'link' ? (
                     <Link href={item.href!} className="block text-3xl font-bold text-slate-800 hover:text-[#0D7377] active:scale-95 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                       {item.name}
                     </Link>
                   ) : (
                     <button 
                       className="block w-full text-3xl font-bold text-slate-800 hover:text-[#0D7377] active:scale-95 transition-all"
                       onClick={() => { onViewChange(item.id!); setIsMobileMenuOpen(false); }}
                     >
                       {item.name}
                     </button>
                   )}
                 </motion.div>
               ))}
               
               {/* Mobile Login Link */}
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Link href="/login" className="block text-xl font-bold text-slate-500 hover:text-[#0D7377] active:scale-95 transition-all mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                    Log In
                  </Link>
               </motion.div>

               <motion.hr initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="border-slate-200 my-4" />
               
               {/* MOBILE GET STARTED BUTTON (Added Here) */}
               <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                 <motion.button
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5 }}
                   className="w-full py-4 bg-[#FF6B6B] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#FF6B6B]/20 flex items-center justify-center gap-2"
                 >
                   Get Started <ArrowRight className="w-5 h-5" />
                 </motion.button>
               </Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
// --- UPDATED HERO SECTION TO USE NAVIGATION STATE ---
function HeroSection({ onViewChange }: { onViewChange: (view: string) => void }) {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-b from-[#0D7377]/10 to-[#F8F9FA]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Content */}
        <div className="lg:w-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={`${dmSans.className} text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-[#0D7377]`}>
              Find, Compare, Decide <br />
              <span className="text-[#FF6B6B]">All in One Place.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
              From smartphones to dentists, compare anything in seconds with verified data and unbiased insights.
            </p>

            {/* Search Bar Component */}
            <div className="bg-white p-2 rounded-2xl shadow-xl shadow-[#0D7377]/10 border border-slate-200 max-w-xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search for products, services..." 
                    className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400"
                  />
                </div>
                <div className="h-px sm:h-auto sm:w-px bg-slate-200 mx-2" />
                <div className="sm:w-1/3 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Mumbai" 
                    className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-slate-900 font-medium"
                  />
                </div>
              </div>
              <div className="mt-2">
                {/* UPDATED CTA BUTTON TO SWITCH VIEW */}
                <button 
                  onClick={() => onViewChange('search')}
                  className="w-full py-4 bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#FF6B6B]/30 flex items-center justify-center gap-2"
                >
                  Start Comparing <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4 text-sm text-slate-500 font-medium">
              <span>Try:</span>
              <span onClick={() => onViewChange('compare')} className="text-[#0D7377] underline cursor-pointer hover:text-[#FF6B6B]">iPhone 15 vs S24</span>
              <span onClick={() => onViewChange('search')} className="text-[#0D7377] underline cursor-pointer hover:text-[#FF6B6B]">Dentists in Bandra</span>
            </div>
          </motion.div>
        </div>

        {/* Right Visual (Floating Cards) */}
        <div className="lg:w-1/2 relative h-[500px] w-full flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#0D7377]/5 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-80 h-96">
             <FloatingCard index={0} color="bg-white" rotate={-6} title="iPhone 15" price="₹79,900" score="9.2" img="📱" />
             <FloatingCard index={1} color="bg-white" rotate={6} title="Galaxy S24" price="₹79,999" score="9.0" img="📲" />
             <FloatingCard index={2} color="bg-white" rotate={0} title="Pixel 8" price="₹75,999" score="8.8" img="📷" isMain />
          </div>
        </div>
      </div>
    </section>
  );
}

// --- KEEPING EXISTING SUB-COMPONENTS ---
// These remain unchanged visually, just helper functions

function FloatingCard({ index, rotate, title, price, score, img, isMain }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{ delay: index * 0.2, duration: 0.8, type: "spring" }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      className={`absolute inset-0 rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col justify-between ${isMain ? 'z-10 bg-white' : 'z-0 bg-slate-50'}`}
      style={{ transformOrigin: "bottom center" }}
    >
      <div className="w-full h-32 bg-slate-100 rounded-xl flex items-center justify-center text-6xl">{img}</div>
      <div>
        <div className="flex justify-between items-start mb-2">
           <h3 className={`${dmSans.className} text-xl font-bold text-slate-900`}>{title}</h3>
           <span className="bg-[#0D7377] text-white text-xs font-bold px-2 py-1 rounded-md">{score}</span>
        </div>
        <p className="text-[#FF6B6B] font-bold text-lg">{price}</p>
        <div className="mt-4 flex gap-2">
          <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
             <div className="h-full bg-[#0D7377]" style={{ width: `${Number(score)*10}%` }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CategorySection() {
  const categories = [
    { icon: <Smartphone className="w-8 h-8" />, title: "Products", desc: "Electronics, Appliances, Fashion", color: "bg-blue-50 text-blue-600" },
    { icon: <Wrench className="w-8 h-8" />, title: "Services", desc: "Home Repair, Beauty, Wellness", color: "bg-orange-50 text-orange-600" },
    { icon: <Stethoscope className="w-8 h-8" />, title: "Professionals", desc: "Doctors, Lawyers, Consultants", color: "bg-teal-50 text-teal-600" },
    { icon: <Utensils className="w-8 h-8" />, title: "Experiences", desc: "Restaurants, Hotels, Events", color: "bg-rose-50 text-rose-600" },
  ];
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16"><h2 className={`${dmSans.className} text-3xl md:text-4xl font-bold text-[#0D7377]`}>What are you looking for?</h2></div>
      <div className="grid md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div key={idx} whileHover={{ y: -10 }} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${cat.color} group-hover:scale-110 transition-transform`}>{cat.icon}</div>
            <h3 className={`${dmSans.className} text-xl font-bold text-slate-900 mb-2`}>{cat.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{cat.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-20 bg-[#0D7377] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20"><h2 className={`${dmSans.className} text-3xl md:text-4xl font-bold`}>How ComparatorX Works</h2></div>
        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-white/20 border-t border-dashed border-white/40" />
          {[ 
            { icon: <Search className="w-8 h-8" />, title: "Search", desc: "Enter what you need (Dentist, Phone, etc.)" },
            { icon: <Scale className="w-8 h-8" />, title: "Compare", desc: "We aggregate data from 500+ sources." },
            { icon: <CheckCircle className="w-8 h-8" />, title: "Decide", desc: "Get one clear, best-value recommendation." }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10">
               <div className="w-24 h-24 bg-[#0B6366] rounded-full border-4 border-[#FF6B6B] flex items-center justify-center mb-6 shadow-lg shadow-[#000000]/20">{step.icon}</div>
               <h3 className={`${dmSans.className} text-2xl font-bold mb-3`}>{step.title}</h3>
               <p className="text-white/80 max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"><div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-[100px]" /></div>
    </section>
  );
}

function USPSection() {
  const usps = [
    { icon: <Globe />, title: "Multi-Source Aggregation", desc: "We pull data from Amazon, Google, Justdial & more." },
    { icon: <Target />, title: "Smart Recommendations", desc: "Our AI tells you 'Why' a product is the winner." },
    { icon: <Navigation />, title: "Location-Aware", desc: "Find services strictly within your radius." },
    { icon: <ShieldCheck />, title: "Verified Sources", desc: "We filter out fake reviews and sponsored bias." }
  ];
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16"><h2 className={`${dmSans.className} text-3xl md:text-4xl font-bold text-[#0D7377]`}>Why ComparatorX?</h2></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {usps.map((item, idx) => (
          <div key={idx} className="text-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-[#0D7377]/30 transition-colors">
            <div className="w-12 h-12 mx-auto bg-teal-50 text-[#0D7377] rounded-xl flex items-center justify-center mb-4">{item.icon}</div>
            <h3 className={`${dmSans.className} font-bold text-lg mb-2`}>{item.title}</h3>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 bg-[#F0FDFD] border-y border-[#0D7377]/10">
       <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <AnimatedStat end={1234} suffix="+" label="Comparisons Made" />
          <AnimatedStat end={500} suffix="+" label="Data Sources" />
          <AnimatedStat end={50} suffix="+" label="Categories" />
       </div>
    </section>
  );
}

function AnimatedStat({ end, suffix, label }: StatProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useScroll().scrollY; // Simplification for demo
  const [displayValue, setDisplayValue] = useState(end); // Static for robustness if framer fails
  return (
    <div ref={ref}>
      <div className={`text-4xl md:text-5xl font-bold text-[#0D7377] ${dmSans.className} mb-2`}>{end}{suffix}</div>
      <div className="text-slate-500 font-medium uppercase tracking-wide text-sm">{label}</div>
    </div>
  );
}

function ExamplePreviewSection({ onViewChange }: any) {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF6B6B]/5 rounded-full blur-3xl -z-0" />
        <div className="flex-1 relative z-10">
          <span className="text-[#FF6B6B] font-bold tracking-widest text-sm uppercase mb-2 block">Live Preview</span>
          <h2 className={`${dmSans.className} text-3xl font-bold text-[#0D7377] mb-6`}>See how it works. <br/><span className="text-slate-400">Example: Best Phone under 30k</span></h2>
          <p className="text-slate-500 mb-8 leading-relaxed">ComparatorX puts the top contenders side-by-side, highlighting the winner based on your specific needs.</p>
          <button onClick={() => onViewChange('search')} className="text-[#0D7377] font-bold flex items-center gap-2 hover:gap-4 transition-all">Try a live search <ArrowRight className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 w-full relative z-10">
           <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                 <span className="font-bold text-slate-700">Comparison Result</span>
                 <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">ComparatorX Choice</span>
              </div>
              <div className="flex gap-2">
                 <div className="flex-1 p-3 bg-white rounded-xl border border-slate-200 opacity-60"><div className="w-full h-20 bg-slate-100 rounded-lg mb-2" /><div className="h-3 w-3/4 bg-slate-200 rounded mb-1" /></div>
                 <div className="flex-1 p-3 bg-white rounded-xl border-2 border-[#0D7377] relative shadow-lg transform -translate-y-4">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0D7377] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">WINNER</div>
                    <div className="w-full h-20 bg-teal-50 rounded-lg mb-2 flex items-center justify-center text-2xl">🏆</div>
                    <div className="font-bold text-sm text-[#0D7377] mb-1">Samsung M34</div>
                 </div>
                 <div className="flex-1 p-3 bg-white rounded-xl border border-slate-200 opacity-60"><div className="w-full h-20 bg-slate-100 rounded-lg mb-2" /><div className="h-3 w-3/4 bg-slate-200 rounded mb-1" /></div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onViewChange }: any) {
  return (
    <footer className="bg-[#0D7377] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div><h2 className={`${dmSans.className} text-2xl font-bold mb-2`}>ComparatorX.</h2><p className="text-white/60 text-sm">© 2026 ComparatorX Inc. TSEC Hackathon Project.</p></div>
        <div className="flex gap-8 text-sm font-medium text-white/80">
          <button onClick={() => onViewChange('about')} className="hover:text-white transition-colors">About</button>
          <Link href="#" className="hover:text-white transition-colors">API</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact</Link>
        </div>
        <div className="flex items-center gap-4">
           <input type="email" placeholder="Get updates..." className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:bg-white/20"/>
           <button className="bg-[#FF6B6B] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#ff5252] transition-colors">Join</button>
        </div>
      </div>
    </footer>
  );
}