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

// --- 1. FULL LIST DATA (Mapped from your JSON) ---
const LIST_DATA = [
  { "place_id": "ChIJ-0phpY6AhYARE_FYalDygAI", "name": "Miguel Delgado, M.D.", "rating": 4.9, "user_ratings_total": 134, "address": "450 Sutter Street #2433, San Francisco", "distance": 0.019, "score": 98.48, "img": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400" },
  { "place_id": "ChIJYxVpxFmHhYAROSTRVNEmlZY", "name": "UCSF Otolaryngology", "rating": 2.5, "user_ratings_total": 25, "address": "2380 Sutter Street, San Francisco", "distance": 0.023, "score": 65.28, "img": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400" },
  { "place_id": "ChIJ-fdK9caAhYARrik8Z_HHn2s", "name": "Heidi Wittenberg, MD", "rating": 4.5, "user_ratings_total": 8, "address": "45 Castro Street #324, San Francisco", "distance": 0.017, "score": 88.40, "img": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400" },
  { "place_id": "ChIJqRhcpY6AhYARiRbQlfohXjk", "name": "Dr. Matthew Young, DDS", "rating": 4.9, "user_ratings_total": 276, "address": "490 Post Street STE 830, San Francisco", "distance": 0.017, "score": 103.47, "img": "https://images.unsplash.com/photo-1629902308162-432f63e13d27?w=400" },
  { "place_id": "ChIJyyyMio6AhYARVhFzc-xQrAI", "name": "SF Plastic Surgery: Dr. Usha", "rating": 4.6, "user_ratings_total": 103, "address": "1244 Larkin Street Suite 200, San Francisco", "distance": 0.015, "score": 100.47, "img": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400" },
  { "place_id": "ChIJLSWrfVeHhYARNZ7sd0Sj_xs", "name": "Diana Camarillo, MD", "rating": 3.8, "user_ratings_total": 6, "address": "2211 Post Street Ste 404, San Francisco", "distance": 0.021, "score": 75.94, "img": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400" },
  { "place_id": "ChIJqRhcpY6AhYARXTsxlZV_BnU", "name": "David Ehsan MD, DDS", "rating": 4.7, "user_ratings_total": 13, "address": "450 Sutter Street #2230, San Francisco", "distance": 0.019, "score": 89.89, "img": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400" },
  { "place_id": "ChIJ-fdK9caAhYARpkbyzKa8R0M", "name": "Barry C Baron, MD", "rating": 3.3, "user_ratings_total": 3, "address": "2100 Webster Street #329, San Francisco", "distance": 0.02, "score": 70.32, "img": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400" },
  { "place_id": "ChIJ-fdK9caAhYAROo5Xzv_8y68", "name": "Dr. Nancy L. Carteron, MD", "rating": 5.0, "user_ratings_total": 1, "address": "2100 Webster Street, San Francisco", "distance": 0.02, "score": 85.24, "img": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400" },
  { "place_id": "ChIJwZEqFuqAhYARni9P_qStdco", "name": "Rupsa R. Yee, M.D.", "rating": 4.8, "user_ratings_total": 95, "address": "1100 Van Ness Avenue, San Francisco", "distance": 0.012, "score": 107.39, "img": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400" },
  { "place_id": "ChIJLSWrfVeHhYARcz6ZyTF7ZVU", "name": "Dr. Lynda A. Frassetto, MD", "rating": 5.0, "user_ratings_total": 1, "address": "1675 Scott Street, San Francisco", "distance": 0.022, "score": 83.59, "img": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400" },
  { "place_id": "ChIJsTwLd5OAhYARa1cxe_h8zSc", "name": "James B Stark Corporation", "rating": 3.0, "user_ratings_total": 2, "address": "909 Hyde Street #432, San Francisco", "distance": 0.015, "score": 73.95, "img": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400" },
  { "place_id": "ChIJ-fdK9caAhYARVO9yrtogX0w", "name": "Richard H. Hongo, M.D. FACC", "rating": 5.0, "user_ratings_total": 102, "address": "1100 Van Ness Avenue, San Francisco", "distance": 0.012, "score": 109.60, "img": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400" },
  { "place_id": "ChIJ-fdK9caAhYARk_iASswx0DI", "name": "Rona Z. Silkiss MD FACS", "rating": 0.0, "user_ratings_total": 0, "address": "711 Van Ness Avenue #340, San Francisco", "distance": 0.007, "score": 57.36, "img": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400" },
  { "place_id": "ChIJRVbVCqiAhYAROYrvqdyWVwo", "name": "Kind Gabriel M, MD", "rating": 4.5, "user_ratings_total": 29, "address": "45 Castro Street #410, San Francisco", "distance": 0.016, "score": 93.09, "img": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400" },
  { "place_id": "ChIJ-fdK9caAhYARdFlme99yHr4", "name": "Pacific Eye Associates", "rating": 3.3, "user_ratings_total": 139, "address": "2100 Webster Street # 214, San Francisco", "distance": 0.02, "score": 81.12, "img": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400" },
  { "place_id": "ChIJb0629MaAhYARuN3VyqlC3eg", "name": "Catherine Madison, MD", "rating": 5.0, "user_ratings_total": 1, "address": "45 Castro Street #220, San Francisco", "distance": 0.017, "score": 88.73, "img": "https://images.unsplash.com/photo-1629902308162-432f63e13d27?w=400" },
  { "place_id": "ChIJ-fdK9caAhYARzHw7XFcfoOk", "name": "Dr. Eliza H. Mccaw, MD", "rating": 4.5, "user_ratings_total": 2, "address": "2100 Webster Street UNIT 423, San Francisco", "distance": 0.02, "score": 81.46, "img": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400" },
  { "place_id": "ChIJLSWrfVeHhYARdU5fvaBlyow", "name": "Hani Sbitany, M.D.", "rating": 5.0, "user_ratings_total": 2, "address": "1600 Divisadero Street, San Francisco", "distance": 0.022, "score": 84.41, "img": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400" },
  { "place_id": "ChIJ-fdK9caAhYARpRyp0pj5drs", "name": "Audrey Koh, MD", "rating": 3.4, "user_ratings_total": 20, "address": "2100 Webster Street UNIT 518, San Francisco", "distance": 0.02, "score": 76.19, "img": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400" }
];

// --- 2. DETAILED DATA MAPPING ---
// Using your specific Miguel Delgado data + generic fallbacks
const DETAILED_MAPPING: Record<string, any> = {
  // Miguel Delgado, M.D.
  "ChIJ-0phpY6AhYARE_FYalDygAI": {
    "youtube_summary": "Expert in facelifts, mommy makeovers, and gynecomastia for 30+ years. Known for artistic approach and integrity.",
    "top_review": "Top quality care and results. 'If you're happy, I'm happy' philosophy.",
    "website": "http://dr-delgado.com"
  },
  // Default fallback for others (Simulating API response)
  "default": {
    "youtube_summary": "General medical practice with verified credentials. High satisfaction in recent patient transcripts.",
    "top_review": "Professional staff, clean facility, and efficient check-in process noted by recent visitors.",
    "website": "https://health-services.sf"
  }
};

export default function MultiComparePage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"selection" | "comparison">("selection");

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
      const basic = LIST_DATA.find(r => r.place_id === id);
      const detailed = DETAILED_MAPPING[id] || DETAILED_MAPPING["default"];
      return { ...basic, ...detailed };
    });
  }, [selectedIds]);

  // Find the winner based on score
  const bestProduct = useMemo(() => {
    if (comparisonData.length === 0) return null;
    return comparisonData.reduce((prev, curr) => ((prev.score || 0) > (curr.score || 0) ? prev : curr));
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
              {LIST_DATA.map((item) => (
                <motion.div 
                  key={item.place_id}
                  variants={itemVariants}
                  onClick={() => toggleSelection(item.place_id)}
                  whileHover={{ y: -5 }}
                  className={`relative cursor-pointer rounded-[24px] p-3 border-2 transition-all duration-300 bg-white shadow-sm hover:shadow-xl ${
                    selectedIds.includes(item.place_id) 
                    ? "border-[#0d7377] ring-4 ring-[#0d7377]/10" 
                    : "border-transparent hover:border-slate-200"
                  }`}
                >
                  {/* Card Image Area */}
                  <div className="relative h-40 rounded-[20px] bg-slate-100 mb-3 overflow-hidden group">
                    <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <Star size={10} className="fill-[#0d7377] text-[#0d7377]" /> {item.rating}
                    </div>

                    {/* Selected Overlay */}
                    <AnimatePresence>
                      {selectedIds.includes(item.place_id) && (
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
                    <h3 className="font-bold text-sm text-[#2B2D42] line-clamp-1 mb-1">{item.name}</h3>
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
              ))}
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
                {comparisonData.map((item, idx) => (
                  <div key={idx} className="p-6 md:p-8 border-l border-slate-100 text-center relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#0d7377] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img src={item.img} className="w-12 h-12 rounded-full object-cover mx-auto mb-3 border-2 border-white shadow-md" alt={item.name} />
                    <h4 className="font-bold text-[#2B2D42] text-sm md:text-base leading-tight">{item.name}</h4>
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