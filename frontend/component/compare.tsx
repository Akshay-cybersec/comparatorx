"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2, Download, Edit3, CheckCircle, TrendingUp, 
  DollarSign, Star, MapPin, ExternalLink, ChevronDown, 
  ChevronUp, AlertCircle, Trophy, Zap, Info
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

// --- Fonts ---
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

// --- Mock Data ---
const ITEMS = [
  {
    id: "1",
    name: "Samsung Galaxy S24 Ultra",
    image: "https://images.unsplash.com/photo-1610945265078-38584e26903b?auto=format&fit=crop&q=80&w=300",
    price: 129999,
    rating: 4.8,
    reviews: 1250,
    distance: 2.5, // km (mock for local availability)
    available: true,
    specs: {
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB",
      storage: "256GB",
      battery: "5000 mAh",
      camera: "200MP Main"
    },
    history: [135000, 132000, 129999, 129999, 128000],
    source: "Amazon",
    badges: ["Best Camera", "Top Rated"]
  },
  {
    id: "2",
    name: "iPhone 15 Pro Max",
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=300",
    price: 159900,
    rating: 4.9,
    reviews: 3400,
    distance: 5.0,
    available: true,
    specs: {
      processor: "A17 Pro",
      ram: "8GB",
      storage: "256GB",
      battery: "4422 mAh",
      camera: "48MP Main"
    },
    history: [159900, 159900, 159900, 156000, 159900],
    source: "Apple Store",
    badges: ["Best Performance"]
  },
  {
    id: "3",
    name: "Google Pixel 8 Pro",
    image: "https://images.unsplash.com/photo-1696321636254-8c83a5477cb3?auto=format&fit=crop&q=80&w=300",
    price: 106999,
    rating: 4.5,
    reviews: 890,
    distance: 1.2,
    available: true,
    specs: {
      processor: "Tensor G3",
      ram: "12GB",
      storage: "128GB",
      battery: "5050 mAh",
      camera: "50MP Main"
    },
    history: [106999, 99999, 106999, 106999, 102000],
    source: "Flipkart",
    badges: ["Best Value"]
  }
];

// --- Helper: Simple scoring algorithm ---
const calculateScore = (item: any, weights: any) => {
  // Normalize values (0-100 scale approximations)
  const priceScore = Math.max(0, 100 - ((item.price - 50000) / 1500)); // Lower price = better
  const qualityScore = item.rating * 20; // 5 star = 100
  const distScore = Math.max(0, 100 - (item.distance * 10)); // Closer = better

  const total = 
    (priceScore * (weights.price / 100)) + 
    (qualityScore * (weights.quality / 100)) + 
    (distScore * (weights.distance / 100));
    
  return Math.round(total / ((weights.price + weights.quality + weights.distance)/100 || 1));
};

export default function ComparisonPage() {
  const [weights, setWeights] = useState({ price: 50, quality: 80, distance: 30 });
  const [scores, setScores] = useState<Record<string, number>>({});
  const [winnerId, setWinnerId] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState({ specs: true, history: false, reviews: false });

  // Recalculate scores when weights change
  useEffect(() => {
    const newScores: Record<string, number> = {};
    let maxScore = -1;
    let winId = "";

    ITEMS.forEach(item => {
      const s = calculateScore(item, weights);
      newScores[item.id] = s;
      if (s > maxScore) {
        maxScore = s;
        winId = item.id;
      }
    });
    setScores(newScores);
    setWinnerId(winId);
  }, [weights]);

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-slate-900 pb-20 ${inter.className}`}>
      
      {/* --- 1. HEADER BAR --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
             <h1 className={`text-xl md:text-2xl font-bold text-[#0D7377] ${dmSans.className}`}>
               Comparing 3 Smartphones
             </h1>
             <p className="text-xs text-slate-500 hidden md:block">Last updated: Just now</p>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg flex gap-2 items-center text-sm font-medium">
               <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Edit</span>
            </button>
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg flex gap-2 items-center text-sm font-medium">
               <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
            </button>
            <button className="px-4 py-2 bg-[#0D7377] text-white rounded-lg text-sm font-bold flex gap-2 items-center shadow-lg hover:bg-[#0a5e61] transition-colors">
               <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- 2. SMART RECOMMENDATION PANEL (Left Sidebar) --- */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
             <div className="flex items-center gap-2 mb-4">
               <Zap className="w-5 h-5 text-[#FF6B6B]" />
               <h2 className={`font-bold text-lg ${dmSans.className}`}>Smart Adjust</h2>
             </div>
             
             <p className="text-xs text-slate-500 mb-6">
               Adjust sliders to personalize the "Winner" based on your needs.
             </p>

             {/* Sliders */}
             <div className="space-y-6">
               <SliderControl 
                 label="Price Sensitivity" 
                 icon={<DollarSign className="w-4 h-4" />}
                 value={weights.price} 
                 onChange={(v: number) => setWeights({...weights, price: v})} 
               />
               <SliderControl 
                 label="Build Quality / Specs" 
                 icon={<Star className="w-4 h-4" />}
                 value={weights.quality} 
                 onChange={(v: number) => setWeights({...weights, quality: v})} 
               />
               <SliderControl 
                 label="Location / Availability" 
                 icon={<MapPin className="w-4 h-4" />}
                 value={weights.distance} 
                 onChange={(v: number) => setWeights({...weights, distance: v})} 
               />
             </div>

             <div className="mt-8 pt-6 border-t border-slate-100">
               <h3 className="font-bold text-sm text-slate-700 mb-3">Our Recommendation</h3>
               <div className="bg-[#0D7377]/5 border border-[#0D7377]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-[#0D7377]" />
                    <span className="font-bold text-[#0D7377] text-sm">Best Overall</span>
                  </div>
                  <p className="font-bold text-lg leading-tight">
                    {ITEMS.find(i => i.id === winnerId)?.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Based on your preference for 
                    {weights.quality > weights.price ? " Quality" : " Price"}.
                  </p>
               </div>
             </div>
          </div>
        </aside>

        {/* --- 3. COMPARISON MATRIX (Right Main) --- */}
        <main className="lg:col-span-3 overflow-hidden">
          
          {/* Mobile horizontal scroll wrapper */}
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="min-w-[800px] grid grid-cols-3 gap-4">
              
              {ITEMS.map((item) => {
                const isWinner = item.id === winnerId;
                const score = scores[item.id] || 0;

                return (
                  <div key={item.id} className={`flex flex-col relative transition-all duration-500 ${isWinner ? 'scale-[1.02]' : 'opacity-90'}`}>
                    
                    {/* --- CARD HEADER --- */}
                    <div className={`bg-white rounded-t-2xl p-4 border-x border-t relative overflow-hidden ${isWinner ? 'border-[#0D7377] shadow-xl z-10' : 'border-slate-200'}`}>
                       {isWinner && (
                         <div className="absolute top-0 left-0 w-full bg-[#0D7377] text-white text-[10px] font-bold text-center py-1">
                           Ranger's Choice 🏆
                         </div>
                       )}
                       
                       <div className="mt-4 aspect-[4/3] bg-slate-100 rounded-xl mb-4 overflow-hidden relative group">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {item.badges.map(b => (
                              <span key={b} className="bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded shadow-sm text-slate-700">
                                {b}
                              </span>
                            ))}
                          </div>
                       </div>

                       <h3 className={`font-bold text-lg mb-1 leading-tight h-14 ${isWinner ? 'text-[#0D7377]' : 'text-slate-900'}`}>{item.name}</h3>
                       
                       {/* Score Bar */}
                       <div className="mb-3">
                         <div className="flex justify-between text-xs font-bold mb-1">
                           <span>Ranger Score</span>
                           <span className={score > 80 ? "text-green-600" : "text-yellow-600"}>{score}/100</span>
                         </div>
                         <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${score}%` }}
                             className={`h-full rounded-full ${score > 80 ? 'bg-gradient-to-r from-emerald-500 to-[#0D7377]' : 'bg-yellow-400'}`}
                           />
                         </div>
                       </div>

                       <div className="text-2xl font-bold text-slate-900 mb-4">₹{item.price.toLocaleString()}</div>
                       
                       <button className={`w-full py-3 rounded-xl font-bold text-sm mb-2 flex items-center justify-center gap-2 transition-all ${isWinner ? 'bg-[#FF6B6B] text-white shadow-lg shadow-[#FF6B6B]/20 hover:bg-[#ff5252]' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                         Buy Now <ExternalLink className="w-3 h-3" />
                       </button>
                       <p className="text-[10px] text-center text-slate-400">via {item.source}</p>
                    </div>

                    {/* --- SPECS TABLE --- */}
                    <div className={`bg-white border-x border-b p-4 space-y-4 ${isWinner ? 'border-[#0D7377] bg-teal-50/10' : 'border-slate-200'}`}>
                       
                       {/* Key Specs */}
                       <div className="space-y-3 text-sm">
                          <SpecRow label="Processor" value={item.specs.processor} highlight={item.specs.processor === "Snapdragon 8 Gen 3" || item.specs.processor === "A17 Pro"} />
                          <SpecRow label="RAM" value={item.specs.ram} highlight={item.specs.ram === "12GB"} />
                          <SpecRow label="Storage" value={item.specs.storage} />
                          <SpecRow label="Battery" value={item.specs.battery} highlight={item.specs.battery === "5050 mAh"} />
                       </div>

                       {/* Location & Availability */}
                       <div className="pt-4 border-t border-slate-100 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                             <MapPin className="w-4 h-4 text-slate-400" /> 
                             <span className={item.distance < 2 ? "text-emerald-600 font-bold" : ""}>{item.distance} km away</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                             <CheckCircle className="w-4 h-4 text-emerald-500" />
                             <span>{item.available ? "In Stock" : "Out of Stock"}</span>
                          </div>
                       </div>

                       {/* Price History Mini Chart */}
                       <div className="pt-4 border-t border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Price Trend</p>
                          <SimpleSparkline data={item.history} color={item.history[4] < item.history[0] ? "#10B981" : "#EF4444"} />
                       </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- EXPANDABLE SECTIONS --- */}
          <div className="mt-8 space-y-4">
             <ExpandableSection title="Full Specifications" isOpen={expandedSections.specs} toggle={() => setExpandedSections({...expandedSections, specs: !expandedSections.specs})}>
                <div className="p-4 bg-slate-50 text-slate-500 text-sm text-center">
                   Full technical specifications table would render here...
                </div>
             </ExpandableSection>
             
             <ExpandableSection title="User Reviews" isOpen={expandedSections.reviews} toggle={() => setExpandedSections({...expandedSections, reviews: !expandedSections.reviews})}>
                <div className="p-4 bg-slate-50 text-slate-500 text-sm text-center">
                   Verified reviews from Amazon, Flipkart, and Google...
                </div>
             </ExpandableSection>
          </div>

        </main>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function SliderControl({ label, icon, value, onChange }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          {icon} {label}
        </div>
        <span className="text-xs font-bold text-[#0D7377]">{value}%</span>
      </div>
      <input 
        type="range" 
        min="0" max="100" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0D7377]"
      />
    </div>
  );
}

function SpecRow({ label, value, highlight }: any) {
  return (
    <div className={`flex justify-between items-center p-2 rounded-lg ${highlight ? 'bg-green-50' : ''}`}>
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium ${highlight ? 'text-green-700 font-bold' : 'text-slate-900'}`}>{value}</span>
    </div>
  );
}

function ExpandableSection({ title, isOpen, toggle, children }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button onClick={toggle} className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
        <span className="font-bold text-slate-900">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple SVG Line Chart (No Libraries Needed)
function SimpleSparkline({ data, color }: any) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((val: number, i: number) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="h-10 w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
         <polyline 
           points={points} 
           fill="none" 
           stroke={color} 
           strokeWidth="3" 
           vectorEffect="non-scaling-stroke"
           strokeLinecap="round"
           strokeLinejoin="round"
         />
      </svg>
    </div>
  );
}