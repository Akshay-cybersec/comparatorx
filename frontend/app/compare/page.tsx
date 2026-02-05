"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Star, MapPin, Navigation, 
  Youtube, MessageSquare, CheckCircle2, 
  TrendingUp, Globe, Info, Activity,
  ChevronDown, ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DM_Sans, Inter } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

export default function MultiComparePage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"selection" | "comparison">("selection");
  const [listData, setListData] = useState<any[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dashboard_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.results && Array.isArray(parsed.results)) {
          setListData(parsed.results);
        }
      }
      if (!saved) {
        const fallback = localStorage.getItem("compare_items");
        if (fallback) {
          const parsedFallback = JSON.parse(fallback);
          if (Array.isArray(parsedFallback)) {
            setListData(parsedFallback);
          }
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Toggle selection with max 3 limit
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length < 3) return [...prev, id];
      return prev;
    });
  };

  // Prepare comparison data only for selected items
  const comparisonData = useMemo(() => {
    return selectedIds.map(id => {
      return listData.find((r: any) => (r.place_id || r.id || r.link || r.name) === id);
    });
  }, [selectedIds, listData]);

  // Find the winner based on score
  const bestProduct = useMemo(() => {
    const cleaned = comparisonData.filter(Boolean) as any[];
    if (cleaned.length === 0) return null;
    return cleaned.reduce((prev, curr) => ((prev.score || 0) > (curr.score || 0) ? prev : curr));
  }, [comparisonData]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen bg-[#f8fcfc] text-[#2B2D42] ${inter.className} p-6 md:p-10 relative overflow-hidden`}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0d7377]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <button 
              onClick={() => viewMode === "comparison" ? setViewMode("selection") : router.back()} 
              className="group flex items-center gap-2 text-slate-400 hover:text-[#0d7377] transition-colors mb-2 font-semibold"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
              {viewMode === "comparison" ? "Back to Selection" : "Back to Dashboard"}
            </button>
            <h1 className={`text-3xl md:text-4xl font-bold text-[#0d7377] ${dmSans.className}`}>
              {viewMode === "selection" ? "Select Professionals" : "Deep Comparison Analysis"}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {viewMode === "selection" 
                ? "Choose up to 3 experts to analyze side-by-side" 
                : "AI-driven breakdown of your selected choices"}
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100">
            <span className={`text-xs font-black tracking-widest ${viewMode === "selection" ? "text-[#0d7377]" : "text-slate-300"}`}>1. SELECT</span>
            <div className="w-8 h-[2px] bg-slate-100"></div>
            <span className={`text-xs font-black tracking-widest ${viewMode === "comparison" ? "text-[#0d7377]" : "text-slate-300"}`}>2. COMPARE</span>
          </div>
        </div>

        {/* --- VIEW 1: SELECTION GRID --- */}
        <AnimatePresence mode="wait">
          {viewMode === "selection" && (
            <motion.div 
              key="selection-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-32"
            >
              {!hydrated && (
                <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400">
                  Loading results...
                </div>
              )}
              {hydrated && listData.length === 0 && (
                <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400">
                  No dashboard results found. Search on the dashboard first, then come back to compare.
                </div>
              )}
              {hydrated && listData.map((item: any, idx: number) => {
                const itemId = item.place_id || item.id || item.link || item.name || idx;
                return (
                <motion.div 
                  key={itemId}
                  variants={itemVariants}
                  onClick={() => toggleSelection(itemId)}
                  whileHover={{ y: -5 }}
                  className={`relative cursor-pointer rounded-[24px] p-3 border-2 transition-all duration-300 bg-white shadow-sm hover:shadow-xl ${
                    selectedIds.includes(itemId) 
                    ? "border-[#0d7377] ring-4 ring-[#0d7377]/10" 
                    : "border-transparent hover:border-slate-200"
                  }`}
                >
                  {/* Card Image Area */}
                  <div className="relative h-40 rounded-[20px] bg-slate-100 mb-3 overflow-hidden group">
                    <img src={item.img || item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name || item.title} />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <Star size={10} className="fill-[#0d7377] text-[#0d7377]" /> {item.rating}
                    </div>

                    {/* Selected Overlay */}
                    <AnimatePresence>
                      {selectedIds.includes(itemId) && (
                        <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-[#0d7377]/80 flex items-center justify-center backdrop-blur-[2px]"
                        >
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1, rotate: 0 }} 
                            className="bg-white text-[#0d7377] rounded-full p-2"
                          >
                            <CheckCircle2 size={24} />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Card Content */}
                  <div className="px-1">
                    <h3 className="font-bold text-sm text-[#2B2D42] line-clamp-1 mb-1">{item.name || item.title}</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <MapPin size={10} /> {item.distance} KM
                      </div>
                      <div className="bg-[#f0f9fa] text-[#0d7377] px-2 py-0.5 rounded-md text-[10px] font-black border border-[#0d7377]/20">
                        {item.score.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* --- VIEW 2: COMPARISON GRID --- */}
          {viewMode === "comparison" && (
            <motion.div 
              key="comparison-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[40px] shadow-2xl shadow-[#0d7377]/10 border border-slate-100 overflow-hidden"
            >
              {/* Table Header */}
              <div className="grid grid-cols-4 bg-slate-50/50 border-b border-slate-100">
                <div className="p-6 md:p-8 flex items-center justify-center md:justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                    <Activity className="text-[#0d7377]" />
                  </div>
                </div>
                {comparisonData.filter(Boolean).map((item: any, idx) => (
                  <div key={idx} className="p-6 md:p-8 border-l border-slate-100 text-center relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#0d7377] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img src={item.img || item.image} className="w-12 h-12 rounded-full object-cover mx-auto mb-3 border-2 border-white shadow-md" alt={item.name || item.title} />
                    <h4 className="font-bold text-[#2B2D42] text-sm md:text-base leading-tight">{item.name || item.title}</h4>
                    {item === bestProduct && (
                      <span className="absolute top-4 right-4 bg-[#ff6b6b] text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wide animate-pulse">
                        Best Choice
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Comparison Rows */}
              <div className="divide-y divide-slate-50">
                <CompareRow label="System Score" icon={<TrendingUp size={16}/>} data={comparisonData.map(d => d.score ? `${d.score.toFixed(1)} / 110` : "N/A")} highlight={true} />
                <CompareRow label="Patient Trust" icon={<Star size={16}/>} data={comparisonData.map(d => `${d.user_ratings_total} verified reviews`)} />
                <CompareRow label="Proximity" icon={<Navigation size={16}/>} data={comparisonData.map(d => `${d.distance} KM away`)} />
                <CompareRow label="Video Insights" icon={<Youtube size={16}/>} data={comparisonData.map(d => d.youtube_summary)} />
                <CompareRow label="Recent Feedback" icon={<MessageSquare size={16}/>} data={comparisonData.map(d => d.top_review)} />
                <CompareRow label="Website" icon={<Globe size={16}/>} data={comparisonData.map(d => d.website)} />
              </div>

              {/* AI Recommendation Footer */}
              <div className="p-8 md:p-10 bg-gradient-to-br from-[#0d7377] to-[#0a5c5f] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
                    <TrendingUp size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2">
                      ComparatorX Recommendation
                      <span className="bg-white/20 text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-wider">AI Generated</span>
                    </h3>
                    {bestProduct && (
                      <p className="text-white/90 leading-relaxed font-medium text-sm md:text-base max-w-3xl">
                        After analyzing transcripts, sentiment, and hard metrics, <span className="text-white font-bold underline decoration-2 decoration-[#ff6b6b] underline-offset-4">{bestProduct.name}</span> emerges as the superior choice. 
                        With a proprietary score of <span className="font-bold">{bestProduct.score?.toFixed(1)}</span>, they offer the optimal balance of 
                        proximity ({bestProduct.distance} KM) and verified patient volume ({bestProduct.user_ratings_total} reviews). 
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- FLOATING ACTION BAR --- */}
        <AnimatePresence>
          {selectedIds.length > 0 && viewMode === "selection" && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-8 left-0 right-0 px-6 flex justify-center z-50 pointer-events-none"
            >
              <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-2xl p-2 pl-6 flex items-center gap-6 pointer-events-auto max-w-lg w-full ring-1 ring-black/5">
                <div className="flex flex-col">
                  <span className="text-[#0d7377] font-black text-xs uppercase tracking-widest">Selection Active</span>
                  <span className="font-bold text-slate-700 text-sm">{selectedIds.length} / 3 Professionals</span>
                </div>
                <button 
                  onClick={() => selectedIds.length > 1 ? setViewMode("comparison") : alert("Please select at least 2 items to compare.")}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${
                    selectedIds.length > 1 
                    ? "bg-[#0d7377] text-white hover:bg-[#0b5f62] hover:scale-[1.02]" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {selectedIds.length > 1 ? "COMPARE NOW" : "Select More"}
                  {selectedIds.length > 1 && <ArrowRight size={16} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// Optimized Comparison Row Component
function CompareRow({ label, icon, data, highlight = false }: { label: string, icon: React.ReactNode, data: string[], highlight?: boolean }) {
  return (
    <div className={`grid grid-cols-4 hover:bg-slate-50/50 transition-colors group ${highlight ? "bg-[#f8fcfc]" : ""}`}>
      <div className="p-6 flex items-center gap-3 text-slate-500 font-bold text-xs md:text-sm uppercase tracking-wider">
        <span className={`${highlight ? "text-[#0d7377]" : "text-[#ff6b6b]"}`}>{icon}</span> 
        {label}
      </div>
      {data.map((text, i) => (
        <div key={i} className="p-6 border-l border-slate-50 text-xs md:text-sm font-semibold text-[#2B2D42] flex items-center justify-center text-center leading-relaxed relative">
          {highlight && (
            <div className="absolute inset-x-2 inset-y-4 bg-[#0d7377]/5 rounded-lg -z-10" />
          )}
          {text}
        </div>
      ))}
      {/* Empty slot padding */}
      {Array.from({ length: 3 - data.length }).map((_, i) => (
        <div key={i} className="p-6 border-l border-slate-50 bg-slate-50/20" />
      ))}
    </div>
  );
}
