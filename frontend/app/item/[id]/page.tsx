"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, MapPin, Share2, Heart, Bell, ExternalLink, 
  Check, X, ChevronDown, ChevronUp, Clock, ShieldCheck, 
  TrendingDown, ArrowLeft, Plus
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

// --- Fonts ---
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

// --- Mock Data: Single Item Detail ---
const ITEM = {
  id: "1",
  title: "Apple iPhone 15 Pro (128 GB) - Natural Titanium",
  category: "Electronics > Smartphones",
  rating: 4.8,
  reviewCount: 2450,
  currentPrice: 129900,
  originalPrice: 134900,
  lowestPrice: 125000,
  description: "iPhone 15 Pro. Forged in titanium. Featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
  location: "Bandra West, Mumbai",
  distance: 2.4,
  availability: "In Stock",
  lastUpdated: "2 hours ago",
  sources: [
    { name: "Amazon", price: 129900, logo: "A" },
    { name: "Flipkart", price: 131000, logo: "F" },
    { name: "Croma", price: 134900, logo: "C" }
  ],
  images: [
    "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600", 
    "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=600"
  ],
  specs: {
    "Display": "6.1-inch Super Retina XDR",
    "Processor": "A17 Pro chip",
    "Camera": "48MP Main | Ultra Wide | Telephoto",
    "Battery": "Up to 23 hours video playback",
    "OS": "iOS 17"
  },
  pros: ["Titanium Design is light", "A17 Pro is a beast", "USB-C finally"],
  cons: ["Charging speed still 20W", "Expensive"],
  priceHistory: [134900, 134900, 132000, 129900, 129900, 131000, 129900]
};

export default function ItemDetailPage() {
  const [activeImage, setActiveImage] = useState(ITEM.images[0]);
  const [isSaved, setIsSaved] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("Technical Details");

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-slate-900 pb-20 ${inter.className}`}>
      
      {/* --- Breadcrumb & Back --- */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-slate-500">
         <button className="hover:text-[#0D7377] flex items-center gap-1">
           <ArrowLeft className="w-4 h-4" /> Back
         </button>
         <span>/</span>
         <span>{ITEM.category}</span>
         <span>/</span>
         <span className="text-slate-900 font-medium truncate">{ITEM.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (Images & Main Info) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. HERO SECTION */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
             <div className="grid md:grid-cols-2 gap-8">
                
                {/* Image Gallery */}
                <div className="space-y-4">
                   <motion.div 
                     layoutId="main-image"
                     className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative group"
                   >
                      <img src={activeImage} alt="Product" className="w-full h-full object-cover" />
                      {/* Zoom hint */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors cursor-zoom-in" />
                   </motion.div>
                   <div className="flex gap-2 overflow-x-auto pb-2">
                      {ITEM.images.map((img, i) => (
                        <button 
                          key={i} 
                          onClick={() => setActiveImage(img)}
                          className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${activeImage === img ? 'border-[#0D7377]' : 'border-transparent'}`}
                        >
                           <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                   </div>
                </div>

                {/* Title & Price */}
                <div className="flex flex-col">
                   <div className="flex items-start justify-between">
                      <h1 className={`text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-2 ${dmSans.className}`}>
                        {ITEM.title}
                      </h1>
                      <button 
                        onClick={() => setIsSaved(!isSaved)}
                        className={`p-2 rounded-full border ${isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500'}`}
                      >
                         <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                   </div>

                   <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-sm font-bold">
                        {ITEM.rating} <Star className="w-3.5 h-3.5 fill-amber-500" />
                      </div>
                      <span className="text-sm text-slate-500 underline decoration-slate-300 decoration-dotted">
                        {ITEM.reviewCount} Reviews
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-sm text-emerald-600 font-medium">94% Recommend</span>
                   </div>

                   <div className="mt-auto">
                      <div className="flex items-baseline gap-3">
                         <span className="text-4xl font-bold text-[#0D7377]">₹{ITEM.currentPrice.toLocaleString()}</span>
                         <span className="text-lg text-slate-400 line-through">₹{ITEM.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full text-sm font-bold">
                         <TrendingDown className="w-4 h-4" /> Price dropped by ₹{(ITEM.originalPrice - ITEM.currentPrice).toLocaleString()}
                      </div>
                   </div>

                   <div className="mt-6 flex flex-col gap-3">
                      <button className="w-full py-3.5 bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#FF6B6B]/20 flex items-center justify-center gap-2 transition-all">
                         View on {ITEM.sources[0].name} <ExternalLink className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                         <button className="py-3 border border-slate-200 hover:border-[#0D7377] text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                            <Plus className="w-5 h-5" /> Add to Compare
                         </button>
                         <button className="py-3 border border-slate-200 hover:border-slate-400 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                            <Share2 className="w-5 h-5" /> Share
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* 2. PRICE TREND CHART */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold text-slate-900 ${dmSans.className}`}>Price History</h3>
                <button className="flex items-center gap-2 text-sm font-bold text-[#0D7377] bg-[#0D7377]/10 px-3 py-1.5 rounded-lg hover:bg-[#0D7377]/20 transition-colors">
                   <Bell className="w-4 h-4" /> Set Price Alert
                </button>
             </div>
             
             {/* Chart Area */}
             <div className="h-48 w-full bg-slate-50 rounded-xl border border-slate-100 relative flex items-end px-4 pb-4">
                <PriceChart data={ITEM.priceHistory} />
             </div>
             <p className="text-xs text-slate-400 mt-3 text-center">Price trend over the last 30 days across all tracked sources.</p>
          </div>

          {/* 3. FULL SPECS & REVIEWS */}
          <div className="space-y-4">
             <AccordionItem title="Key Specifications" isOpen={openAccordion === "Key Specifications"} onClick={() => setOpenAccordion("Key Specifications")}>
                <div className="grid grid-cols-2 gap-4">
                   {Object.entries(ITEM.specs).map(([key, value]) => (
                      <div key={key} className="flex flex-col p-3 bg-slate-50 rounded-lg">
                         <span className="text-xs text-slate-500 uppercase font-bold">{key}</span>
                         <span className="font-medium text-slate-900">{value}</span>
                      </div>
                   ))}
                </div>
             </AccordionItem>

             <AccordionItem title="Reviews & Analysis" isOpen={openAccordion === "Reviews"} onClick={() => setOpenAccordion("Reviews")}>
                <div className="space-y-4">
                   <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                         <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2"><Check className="w-4 h-4" /> Pros</h4>
                         <ul className="space-y-1">
                            {ITEM.pros.map(p => <li key={p} className="text-sm text-green-700">• {p}</li>)}
                         </ul>
                      </div>
                      <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                         <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2"><X className="w-4 h-4" /> Cons</h4>
                         <ul className="space-y-1">
                            {ITEM.cons.map(c => <li key={c} className="text-sm text-red-700">• {c}</li>)}
                         </ul>
                      </div>
                   </div>
                </div>
             </AccordionItem>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Sidebar) --- */}
        <aside className="space-y-6">
           
           {/* Quick Facts Card */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
              <h3 className={`text-lg font-bold mb-4 ${dmSans.className}`}>Quick Facts</h3>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                       <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-xs text-slate-500 font-bold uppercase">Location</p>
                       <p className="text-sm font-bold text-slate-900">{ITEM.location}</p>
                       <p className="text-xs text-slate-400">{ITEM.distance} km away</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                       <Clock className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-xs text-slate-500 font-bold uppercase">Availability</p>
                       <p className="text-sm font-bold text-emerald-600">{ITEM.availability}</p>
                       <p className="text-xs text-slate-400">Updated {ITEM.lastUpdated}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                       <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-xs text-slate-500 font-bold uppercase">Verified Sources</p>
                       <div className="flex -space-x-2 mt-1">
                          {ITEM.sources.map((s) => (
                             <div key={s.name} className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px] font-bold text-slate-600" title={s.name}>
                                {s.logo}
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="h-px bg-slate-100 my-6" />

              <div className="space-y-2">
                 <p className="text-xs font-bold text-slate-500 uppercase mb-2">Compare Prices</p>
                 {ITEM.sources.map((source) => (
                    <div key={source.name} className="flex justify-between items-center text-sm">
                       <span className="text-slate-600">{source.name}</span>
                       <div className="flex items-center gap-2">
                          <span className="font-bold">₹{source.price.toLocaleString()}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Similar Items */}
           <div>
              <h3 className="font-bold text-slate-900 mb-4">You might also like</h3>
              <div className="space-y-3">
                 {[1,2,3].map(i => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 flex gap-3 hover:border-[#0D7377]/50 transition-colors cursor-pointer">
                       <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0" />
                       <div>
                          <p className="font-bold text-sm text-slate-900 line-clamp-1">Samsung Galaxy S24</p>
                          <p className="text-xs text-slate-500">₹79,999</p>
                          <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-600">
                             <Star className="w-3 h-3 fill-amber-500" /> 4.6
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </aside>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function AccordionItem({ title, isOpen, onClick, children }: any) {
   return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <button 
           onClick={onClick}
           className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
         >
            <span className={`font-bold text-lg ${dmSans.className}`}>{title}</span>
            {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
         </button>
         <AnimatePresence>
            {isOpen && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }} 
                 animate={{ height: "auto", opacity: 1 }} 
                 exit={{ height: 0, opacity: 0 }}
               >
                  <div className="p-5 pt-0 border-t border-slate-100">
                     {children}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}

// Interactive SVG Chart
function PriceChart({ data }: { data: number[] }) {
   const max = Math.max(...data);
   const min = Math.min(...data) * 0.95;
   const range = max - min;
   
   return (
      <div className="w-full h-full flex items-end gap-2">
         {data.map((price, i) => {
            const height = ((price - min) / range) * 100;
            return (
               <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-8 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                     ₹{price.toLocaleString()}
                  </div>
                  {/* Bar */}
                  <div 
                    className="w-full bg-[#0D7377]/20 rounded-t-sm group-hover:bg-[#0D7377] transition-colors relative"
                    style={{ height: `${height}%` }}
                  >
                     {/* Line Dot */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#0D7377] rounded-full opacity-0 group-hover:opacity-100" />
                  </div>
                  {/* Label */}
                  <span className="text-[10px] text-slate-400">{i + 1} Feb</span>
               </div>
            );
         })}
      </div>
   );
}