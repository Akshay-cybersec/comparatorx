"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
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
  Scale
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

// --- Fonts ---
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

// --- Types ---
interface StatProps {
  end: number;
  suffix?: string;
  label: string;
}

export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-slate-900 ${inter.className} selection:bg-[#FF6B6B] selection:text-white`}>
      
      {/* --- 1. HERO SECTION --- */}
      <HeroSection />

      {/* --- 2. CATEGORY CARDS --- */}
      <CategorySection />

      {/* --- 3. HOW IT WORKS --- */}
      <HowItWorksSection />

      {/* --- 4. USP HIGHLIGHTS --- */}
      <USPSection />

      {/* --- 5. LIVE STATS --- */}
      <StatsSection />

      {/* --- 6. EXAMPLE PREVIEW --- */}
      <ExamplePreviewSection />

      {/* --- 7. FOOTER --- */}
      <Footer />
    </div>
  );
}

// --- SECTIONS ---

function HeroSection() {
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
                <button className="w-full py-4 bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#FF6B6B]/30 flex items-center justify-center gap-2">
                  Start Comparing <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4 text-sm text-slate-500 font-medium">
              <span>Try:</span>
              <span className="text-[#0D7377] underline cursor-pointer hover:text-[#FF6B6B]">iPhone 15 vs S24</span>
              <span className="text-[#0D7377] underline cursor-pointer hover:text-[#FF6B6B]">Dentists in Bandra</span>
            </div>
          </motion.div>
        </div>

        {/* Right Visual (Floating Cards) */}
        <div className="lg:w-1/2 relative h-[500px] w-full flex items-center justify-center">
          {/* Abstract blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#0D7377]/5 rounded-full blur-3xl animate-pulse" />
          
          {/* Animated Stack */}
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
      <div className="w-full h-32 bg-slate-100 rounded-xl flex items-center justify-center text-6xl">
        {img}
      </div>
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
      <div className="text-center mb-16">
        <h2 className={`${dmSans.className} text-3xl md:text-4xl font-bold text-[#0D7377]`}>What are you looking for?</h2>
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -10 }}
            className="p-8 rounded-3xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${cat.color} group-hover:scale-110 transition-transform`}>
              {cat.icon}
            </div>
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
        <div className="text-center mb-20">
          <h2 className={`${dmSans.className} text-3xl md:text-4xl font-bold`}>How Ranger Works</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-white/20 border-t border-dashed border-white/40" />
          
          {[ 
            { icon: <Search className="w-8 h-8" />, title: "Search", desc: "Enter what you need (Dentist, Phone, etc.)" },
            { icon: <Scale className="w-8 h-8" />, title: "Compare", desc: "We aggregate data from 500+ sources." },
            { icon: <CheckCircle className="w-8 h-8" />, title: "Decide", desc: "Get one clear, best-value recommendation." }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10">
               <div className="w-24 h-24 bg-[#0B6366] rounded-full border-4 border-[#FF6B6B] flex items-center justify-center mb-6 shadow-lg shadow-[#000000]/20">
                 {step.icon}
               </div>
               <h3 className={`${dmSans.className} text-2xl font-bold mb-3`}>{step.title}</h3>
               <p className="text-white/80 max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full blur-[100px]" />
      </div>
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
      <div className="text-center mb-16">
        <h2 className={`${dmSans.className} text-3xl md:text-4xl font-bold text-[#0D7377]`}>Why Ranger?</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {usps.map((item, idx) => (
          <div key={idx} className="text-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-[#0D7377]/30 transition-colors">
            <div className="w-12 h-12 mx-auto bg-teal-50 text-[#0D7377] rounded-xl flex items-center justify-center mb-4">
              {item.icon}
            </div>
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
  const count = useSpring(0, { duration: 2000 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) count.set(end);
  }, [isInView, end, count]);

  useEffect(() => {
    return count.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [count]);

  return (
    <div ref={ref}>
      <div className={`text-4xl md:text-5xl font-bold text-[#0D7377] ${dmSans.className} mb-2`}>
        {displayValue}{suffix}
      </div>
      <div className="text-slate-500 font-medium uppercase tracking-wide text-sm">{label}</div>
    </div>
  );
}

function ExamplePreviewSection() {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF6B6B]/5 rounded-full blur-3xl -z-0" />

        <div className="flex-1 relative z-10">
          <span className="text-[#FF6B6B] font-bold tracking-widest text-sm uppercase mb-2 block">Live Preview</span>
          <h2 className={`${dmSans.className} text-3xl font-bold text-[#0D7377] mb-6`}>
            See how it works. <br/>
            <span className="text-slate-400">Example: Best Phone under 30k</span>
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Ranger puts the top contenders side-by-side, highlighting the winner based on your specific needs (Camera, Battery, or Performance).
          </p>
          <button className="text-[#0D7377] font-bold flex items-center gap-2 hover:gap-4 transition-all">
            Try a live search <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Comparison Card UI */}
        <div className="flex-1 w-full relative z-10">
           <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                 <span className="font-bold text-slate-700">Comparison Result</span>
                 <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Ranger Choice</span>
              </div>
              
              <div className="flex gap-2">
                 {/* Loser Card */}
                 <div className="flex-1 p-3 bg-white rounded-xl border border-slate-200 opacity-60">
                    <div className="w-full h-20 bg-slate-100 rounded-lg mb-2" />
                    <div className="h-3 w-3/4 bg-slate-200 rounded mb-1" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded" />
                 </div>
                 
                 {/* Winner Card */}
                 <div className="flex-1 p-3 bg-white rounded-xl border-2 border-[#0D7377] relative shadow-lg transform -translate-y-4">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0D7377] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      WINNER
                    </div>
                    <div className="w-full h-20 bg-teal-50 rounded-lg mb-2 flex items-center justify-center text-2xl">🏆</div>
                    <div className="font-bold text-sm text-[#0D7377] mb-1">Samsung M34</div>
                    <div className="text-xs font-bold text-slate-900">₹16,999</div>
                    <div className="mt-2 text-[10px] text-slate-500">Best Battery Life</div>
                 </div>

                 {/* Loser Card */}
                 <div className="flex-1 p-3 bg-white rounded-xl border border-slate-200 opacity-60">
                    <div className="w-full h-20 bg-slate-100 rounded-lg mb-2" />
                    <div className="h-3 w-3/4 bg-slate-200 rounded mb-1" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0D7377] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className={`${dmSans.className} text-2xl font-bold mb-2`}>Ranger.</h2>
          <p className="text-white/60 text-sm">© 2026 Ranger Inc. TSEC Hackathon Project.</p>
        </div>
        
        <div className="flex gap-8 text-sm font-medium text-white/80">
          <Link href="#" className="hover:text-white transition-colors">About</Link>
          <Link href="#" className="hover:text-white transition-colors">API</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
           <input 
             type="email" 
             placeholder="Get updates..." 
             className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:bg-white/20"
           />
           <button className="bg-[#FF6B6B] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#ff5252] transition-colors">
             Join
           </button>
        </div>
      </div>
    </footer>
  );
}