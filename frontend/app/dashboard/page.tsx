"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Scale, Bell, Settings, Clock, 
  Trash2, Share2, Edit2, ArrowRight, TrendingDown, 
  MapPin, LogOut, Search, CheckCircle, AlertTriangle
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

// --- Fonts ---
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

// --- Mock Data ---
const SAVED_COMPARISONS = [
  {
    id: 1,
    title: "Flagship Phones 2024",
    items: ["iPhone 15 Pro", "S24 Ultra", "Pixel 8 Pro"],
    date: "2 days ago",
    images: ["https://images.unsplash.com/photo-1696446701796-da61225697cc?w=100", "https://images.unsplash.com/photo-1610945265078-38584e26903b?w=100"]
  },
  {
    id: 2,
    title: "Dentists in Bandra",
    items: ["SmileCare", "City Dental", "Dr. Ayesha"],
    date: "1 week ago",
    images: [] // Empty state test
  }
];

const PRICE_ALERTS = [
  {
    id: 1,
    item: "Sony WH-1000XM5",
    target: 24000,
    current: 26990,
    status: "active", // active, triggered, paused
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=100"
  },
  {
    id: 2,
    item: "MacBook Air M2",
    target: 95000,
    current: 92000,
    status: "triggered",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100"
  }
];

const RECENT_SEARCHES = ["Best Gaming Laptop under 80k", "Plumbers near me", "Nike Jordan High"];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("comparisons");

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-[#2B2D42] ${inter.className}`}>
      
      {/* --- Header --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0D7377] text-white flex items-center justify-center font-bold text-lg">
                JD
              </div>
              <div>
                 <h1 className={`text-lg font-bold leading-none ${dmSans.className}`}>Welcome back, John!</h1>
                 <p className="text-xs text-slate-500">Member since Jan 2026</p>
              </div>
           </div>
           <button className="text-sm font-medium text-slate-500 hover:text-[#FF6B6B] flex items-center gap-2 transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* --- Sidebar Navigation --- */}
        <aside className="md:col-span-1">
           <nav className="space-y-1 sticky top-28">
              <NavButton active={activeTab === "comparisons"} onClick={() => setActiveTab("comparisons")} icon={<Scale className="w-4 h-4" />} label="Saved Comparisons" />
              <NavButton active={activeTab === "alerts"} onClick={() => setActiveTab("alerts")} icon={<Bell className="w-4 h-4" />} label="Price Alerts" />
              <NavButton active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} icon={<Settings className="w-4 h-4" />} label="Preferences" />
              
              <div className="pt-6 mt-6 border-t border-slate-200">
                 <p className="px-4 text-xs font-bold text-slate-400 uppercase mb-2">Recent Searches</p>
                 <div className="space-y-1">
                    {RECENT_SEARCHES.map((s, i) => (
                       <button key={i} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-2 truncate">
                          <Clock className="w-3 h-3 text-slate-400" /> {s}
                       </button>
                    ))}
                 </div>
              </div>
           </nav>
        </aside>

        {/* --- Main Content Area --- */}
        <main className="md:col-span-3">
           <AnimatePresence mode="wait">
              
              {/* 1. SAVED COMPARISONS */}
              {activeTab === "comparisons" && (
                <motion.div 
                  key="comparisons"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                   <div className="flex justify-between items-end">
                      <h2 className={`text-2xl font-bold ${dmSans.className}`}>Saved Comparisons</h2>
                      <span className="text-sm text-slate-500">{SAVED_COMPARISONS.length} Collections</span>
                   </div>

                   {SAVED_COMPARISONS.length > 0 ? (
                     <div className="grid sm:grid-cols-2 gap-4">
                        {SAVED_COMPARISONS.map(comp => (
                           <div key={comp.id} className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#0D7377]/50 hover:shadow-lg transition-all group cursor-pointer">
                              <div className="flex items-center justify-between mb-3">
                                 <h3 className="font-bold text-lg group-hover:text-[#0D7377] transition-colors">{comp.title}</h3>
                                 <div className="flex gap-1">
                                    <button className="p-1.5 text-slate-400 hover:text-[#0D7377] hover:bg-[#0D7377]/10 rounded"><Edit2 className="w-4 h-4" /></button>
                                    <button className="p-1.5 text-slate-400 hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded"><Trash2 className="w-4 h-4" /></button>
                                 </div>
                              </div>
                              
                              {/* Thumbnail Grid */}
                              <div className="flex gap-2 mb-4 h-16">
                                 {comp.images.length > 0 ? comp.images.slice(0, 3).map((img, i) => (
                                    <img key={i} src={img} alt="item" className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                                 )) : (
                                    <div className="w-full h-16 bg-slate-50 rounded-lg flex items-center justify-center text-xs text-slate-400">No images</div>
                                 )}
                                 <div className="flex-1 bg-slate-50 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">
                                    +{comp.items.length} Items
                                 </div>
                              </div>
                              
                              <div className="flex justify-between items-center text-xs text-slate-400">
                                 <span>Saved {comp.date}</span>
                                 <button className="text-[#0D7377] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    View <ArrowRight className="w-3 h-3" />
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                   ) : (
                     <EmptyState 
                       icon={<Scale className="w-12 h-12 text-slate-300" />} 
                       title="No saved comparisons" 
                       desc="Start searching to compare products side-by-side."
                     />
                   )}
                </motion.div>
              )}

              {/* 2. PRICE ALERTS */}
              {activeTab === "alerts" && (
                <motion.div 
                  key="alerts"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                   <h2 className={`text-2xl font-bold ${dmSans.className}`}>Price Alerts</h2>
                   
                   <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                      {PRICE_ALERTS.map((alert, i) => (
                         <div key={alert.id} className={`p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors ${i !== 0 ? 'border-t border-slate-100' : ''}`}>
                            <img src={alert.image} alt="product" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                            
                            <div className="flex-1 min-w-0">
                               <h4 className="font-bold text-[#2B2D42] truncate">{alert.item}</h4>
                               <div className="flex items-center gap-3 text-sm">
                                  <span className="text-slate-500">Target: ₹{alert.target.toLocaleString()}</span>
                                  {alert.current <= alert.target ? (
                                     <span className="text-[#10B981] font-bold flex items-center gap-1">
                                        <TrendingDown className="w-3 h-3" /> Now ₹{alert.current.toLocaleString()}
                                     </span>
                                  ) : (
                                     <span className="text-slate-400">Current: ₹{alert.current.toLocaleString()}</span>
                                  )}
                               </div>
                            </div>

                            <div className="flex items-center gap-4">
                               {alert.status === 'triggered' && (
                                  <span className="px-3 py-1 bg-[#14FFEC]/20 text-[#0D7377] text-xs font-bold rounded-full border border-[#14FFEC]/50 animate-pulse">
                                     Price Drop!
                                  </span>
                               )}
                               <button className="text-slate-400 hover:text-[#FF6B6B] transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                         </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {/* 3. PREFERENCES */}
              {activeTab === "preferences" && (
                <motion.div 
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                   <h2 className={`text-2xl font-bold ${dmSans.className}`}>Preferences</h2>
                   
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-8">
                      {/* Location */}
                      <div>
                         <label className="block text-sm font-bold text-[#2B2D42] mb-2">Default Location</label>
                         <div className="flex gap-2">
                            <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                               <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                               <input type="text" defaultValue="Mumbai, Maharashtra" className="bg-transparent w-full outline-none text-slate-700" />
                            </div>
                            <button className="px-6 py-3 bg-[#0D7377] text-white font-bold rounded-xl hover:bg-[#0a5e61]">Save</button>
                         </div>
                      </div>

                      {/* Default Priority Weights */}
                      <div>
                         <label className="block text-sm font-bold text-[#2B2D42] mb-4">Default Comparison Priorities</label>
                         <div className="space-y-6 p-4 bg-slate-50 rounded-xl">
                            <RangeSlider label="Price Importance" defaultValue={80} />
                            <RangeSlider label="Quality / Specs" defaultValue={50} />
                            <RangeSlider label="Distance / Convenience" defaultValue={30} />
                         </div>
                      </div>

                      {/* Notifications */}
                      <div>
                         <label className="block text-sm font-bold text-[#2B2D42] mb-4">Notifications</label>
                         <div className="space-y-3">
                            <ToggleRow label="Email me on price drops" />
                            <ToggleRow label="Weekly comparison digest" />
                            <ToggleRow label="New features & updates" />
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// --- Components ---

function NavButton({ active, onClick, icon, label }: any) {
   return (
      <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
           active 
           ? "bg-white text-[#0D7377] shadow-sm border border-slate-100" 
           : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
        }`}
      >
         <div className={`${active ? "text-[#14FFEC] drop-shadow-sm" : "text-slate-400"}`}>{icon}</div>
         {label}
         {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#14FFEC] shadow-[0_0_8px_#14FFEC]" />}
      </button>
   );
}

function EmptyState({ icon, title, desc }: any) {
   return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
         <div className="mb-4">{icon}</div>
         <h3 className="text-lg font-bold text-[#2B2D42]">{title}</h3>
         <p className="text-slate-500 text-sm max-w-xs mt-1">{desc}</p>
      </div>
   );
}

function RangeSlider({ label, defaultValue }: any) {
   return (
      <div>
         <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
            <span>{label}</span>
            <span>{defaultValue}%</span>
         </div>
         <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0D7377]" defaultValue={defaultValue} />
      </div>
   );
}

function ToggleRow({ label }: any) {
   const [isOn, setIsOn] = useState(true);
   return (
      <div className="flex items-center justify-between">
         <span className="text-sm text-slate-600">{label}</span>
         <button 
           onClick={() => setIsOn(!isOn)}
           className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${isOn ? 'bg-[#0D7377]' : 'bg-slate-300'}`}
         >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
         </button>
      </div>
   );
}