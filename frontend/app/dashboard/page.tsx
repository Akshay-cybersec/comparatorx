"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Search, ChevronLeft, ChevronRight, SlidersHorizontal, 
  MapPin, Star, X, Heart, History, Navigation, ArrowLeft, Mic, 
  GitCompare, Youtube, MessageSquare, CheckCircle2, TrendingUp, Globe, Activity, ArrowRight,
  MessageCircle, User, Clock, Sparkles, Trophy, Quote
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';
import toast from 'react-hot-toast';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

// --- 1. FULL API DATA ---
const API_DATA = [
  { "id": "ChIJ-0phpY6AhYARE_FYalDygAI", "name": "Miguel Delgado, M.D.", "rating": 4.9, "user_ratings_total": 134, "address": "450 Sutter Street #2433, San Francisco", "distance": 0.019, "score": 98.48, "open_now": true, "category": "doctor", "price": 200, "reason": "High rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400" },
  { "id": "ChIJYxVpxFmHhYAROSTRVNEmlZY", "name": "UCSF Otolaryngology", "rating": 2.5, "user_ratings_total": 25, "address": "2380 Sutter Street, San Francisco", "distance": 0.023, "score": 65.28, "open_now": true, "category": "doctor", "price": 120, "reason": "Very close to you, currently open", "img": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400" },
  { "id": "ChIJ-fdK9caAhYARrik8Z_HHn2s", "name": "Heidi Wittenberg, MD", "rating": 4.5, "user_ratings_total": 8, "address": "45 Castro Street #324, San Francisco", "distance": 0.017, "score": 88.40, "open_now": true, "category": "doctor", "price": 220, "reason": "High rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400" },
  { "id": "ChIJqRhcpY6AhYARiRbQlfohXjk", "name": "Dr. Matthew Young, DDS", "rating": 4.9, "user_ratings_total": 276, "address": "490 Post Street STE 830, San Francisco", "distance": 0.017, "score": 103.47, "open_now": true, "category": "doctor", "price": 150, "reason": "High rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1629902308162-432f63e13d27?w=400" },
  { "id": "ChIJyyyMio6AhYARVhFzc-xQrAI", "name": "SF Plastic Surgery: Dr. Usha", "rating": 4.6, "user_ratings_total": 103, "address": "1244 Larkin Street Suite 200, San Francisco", "distance": 0.015, "score": 100.47, "open_now": true, "category": "doctor", "price": 500, "reason": "High rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400" },
  { "id": "ChIJLSWrfVeHhYARNZ7sd0Sj_xs", "name": "Diana Camarillo, MD", "rating": 3.8, "user_ratings_total": 6, "address": "2211 Post Street Ste 404, San Francisco", "distance": 0.021, "score": 75.94, "open_now": true, "category": "doctor", "price": 140, "reason": "Very close to you, currently open", "img": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400" },
  { "id": "ChIJqRhcpY6AhYARXTsxlZV_BnU", "name": "David Ehsan MD, DDS", "rating": 4.7, "user_ratings_total": 13, "address": "450 Sutter Street #2230, San Francisco", "distance": 0.019, "score": 89.89, "open_now": true, "category": "doctor", "price": 190, "reason": "High rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400" },
  { "id": "ChIJ-fdK9caAhYARpkbyzKa8R0M", "name": "Barry C Baron, MD", "rating": 3.3, "user_ratings_total": 3, "address": "2100 Webster Street #329, San Francisco", "distance": 0.02, "score": 70.32, "open_now": false, "category": "doctor", "price": 100, "reason": "Very close to you", "img": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400" },
  { "id": "ChIJ-fdK9caAhYAROo5Xzv_8y68", "name": "Dr. Nancy L. Carteron, MD", "rating": 5.0, "user_ratings_total": 1, "address": "2100 Webster Street, San Francisco", "distance": 0.02, "score": 85.24, "open_now": false, "category": "doctor", "price": 250, "reason": "High rating, very close to you", "img": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400" },
  { "id": "ChIJwZEqFuqAhYARni9P_qStdco", "name": "Rupsa R. Yee, M.D.", "rating": 4.8, "user_ratings_total": 95, "address": "1100 Van Ness Avenue, San Francisco", "distance": 0.012, "score": 107.39, "open_now": true, "category": "doctor", "price": 180, "reason": "High rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400" },
  { "id": "ChIJLSWrfVeHhYARcz6ZyTF7ZVU", "name": "Dr. Lynda A. Frassetto, MD", "rating": 5.0, "user_ratings_total": 1, "address": "1675 Scott Street, San Francisco", "distance": 0.022, "score": 83.59, "open_now": false, "category": "doctor", "price": 240, "reason": "High rating, very close to you", "img": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400" },
  { "id": "ChIJsTwLd5OAhYARa1cxe_h8zSc", "name": "James B Stark Corporation", "rating": 3.0, "user_ratings_total": 2, "address": "909 Hyde Street #432, San Francisco", "distance": 0.015, "score": 73.95, "open_now": false, "category": "doctor", "price": 110, "reason": "Very close to you", "img": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400" },
  { "id": "ChIJ-fdK9caAhYARVO9yrtogX0w", "name": "Richard H. Hongo, M.D. FACC", "rating": 5.0, "user_ratings_total": 102, "address": "1100 Van Ness Avenue, San Francisco", "distance": 0.012, "score": 109.60, "open_now": true, "category": "doctor", "price": 300, "reason": "High rating, very close to you", "img": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400" },
  { "id": "ChIJ-fdK9caAhYARk_iASswx0DI", "name": "Rona Z. Silkiss MD FACS", "rating": 0.0, "user_ratings_total": 0, "address": "711 Van Ness Avenue #340, San Francisco", "distance": 0.007, "score": 57.36, "open_now": true, "category": "doctor", "price": 160, "reason": "Very close to you", "img": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400" },
  { "id": "ChIJRVbVCqiAhYAROYrvqdyWVwo", "name": "Kind Gabriel M, MD", "rating": 4.5, "user_ratings_total": 29, "address": "45 Castro Street #410, San Francisco", "distance": 0.016, "score": 93.09, "open_now": true, "category": "doctor", "price": 210, "reason": "High rating, very close to you", "img": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400" },
  { "id": "ChIJ-fdK9caAhYARdFlme99yHr4", "name": "Pacific Eye Associates", "rating": 3.3, "user_ratings_total": 139, "address": "2100 Webster Street # 214, San Francisco", "distance": 0.02, "score": 81.12, "open_now": true, "category": "doctor", "price": 130, "reason": "Trusted by many patients", "img": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400" },
  { "id": "ChIJb0629MaAhYARuN3VyqlC3eg", "name": "Catherine Madison, MD", "rating": 5.0, "user_ratings_total": 1, "address": "45 Castro Street #220, San Francisco", "distance": 0.017, "score": 88.73, "open_now": false, "category": "doctor", "price": 280, "reason": "High rating, very close to you", "img": "https://images.unsplash.com/photo-1629902308162-432f63e13d27?w=400" },
  { "id": "ChIJ-fdK9caAhYARzHw7XFcfoOk", "name": "Dr. Eliza H. Mccaw, MD", "rating": 4.5, "user_ratings_total": 2, "address": "2100 Webster Street UNIT 423, San Francisco", "distance": 0.02, "score": 81.46, "open_now": false, "category": "doctor", "price": 195, "reason": "High rating, very close to you", "img": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400" },
  { "id": "ChIJLSWrfVeHhYARdU5fvaBlyow", "name": "Hani Sbitany, M.D.", "rating": 5.0, "user_ratings_total": 2, "address": "1600 Divisadero Street, San Francisco", "distance": 0.022, "score": 84.41, "open_now": false, "category": "doctor", "price": 310, "reason": "High rating, very close to you", "img": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400" },
  { "id": "ChIJ-fdK9caAhYARpRyp0pj5drs", "name": "Audrey Koh, MD", "rating": 3.4, "user_ratings_total": 20, "address": "2100 Webster Street UNIT 518, San Francisco", "distance": 0.02, "score": 76.19, "open_now": true, "category": "doctor", "price": 155, "reason": "Very close to you, currently open", "img": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400" }
];

// --- 2. DETAILED DATA MAPPING ---
const DETAILED_MAPPING: Record<string, any> = {
  "ChIJ-0phpY6AhYARE_FYalDygAI": {
    "youtube_summary": "Expert in facelifts, mommy makeovers, and gynecomastia for 30+ years. Known for artistic approach and integrity.",
    "top_review": "Top quality care and results. 'If you're happy, I'm happy' philosophy.",
    "website": "http://dr-delgado.com"
  },
  "ChIJ-fdK9caAhYARVO9yrtogX0w": {
    "youtube_summary": "Specialized cardiovascular expert focused on patient comfort and technology.",
    "top_review": "Excellent location and staff was awesome. Fast check-in.",
    "website": "https://richardhongomd.com"
  },
  "default": {
    "youtube_summary": "General medical practice with verified credentials. High satisfaction in recent patient transcripts.",
    "top_review": "Professional staff, clean facility, and efficient check-in process noted by recent visitors.",
    "website": "https://health-services.sf"
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // --- Comment System State ---
  const [userReviews, setUserReviews] = useState<Record<string, Array<{ text: string, rating: number, date: string }>>>({});
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [activeCommentItem, setActiveCommentItem] = useState<any>(null);

  // --- Speech Recognition ---
  const [isListening, setIsListening] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const placeholders = ["Try 'doctor near me'...", "मेरे पास 'डॉक्टर' खोजें...", "'माझ्या जवळचे डॉक्टर' शोधा..."];

  useEffect(() => {
    const interval = setInterval(() => setCurrentPlaceholder(prev => (prev + 1) % placeholders.length), 2000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error("Browser not supported"); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; 
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => setSearchQuery(e.results[0][0].transcript);
    recognition.start();
  }, []);

  // Filter States
  const [minRating, setMinRating] = useState(0);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxDistance, setMaxDistance] = useState(0.05);
  const [streetQuery, setStreetQuery] = useState("");

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleCompareDetails = (item: any) => {
    localStorage.setItem("comparison_item", JSON.stringify(item));
    setActiveTab("compare");
  };

  // --- Updated: Async Comment Handler with API Call ---
  const openCommentModal = (item: any) => {
    setActiveCommentItem(item);
    setCommentModalOpen(true);
  };

  const saveComment = async (text: string, rating: number) => {
    if (!activeCommentItem) return;

    const payload = {
      entity_id: activeCommentItem.id,
      entity_type: activeCommentItem.category || "service",
      name: activeCommentItem.name,
      rating: rating,
      review: text,
      user_name: "Anonymous User",
      metadata: { additionalProp1: {} }
    };

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newReview = { text, rating, date: new Date().toLocaleDateString() };
        setUserReviews(prev => ({
          ...prev,
          [activeCommentItem.id]: [...(prev[activeCommentItem.id] || []), newReview]
        }));
        toast.success("Review submitted successfully!");
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting your review.");
    }
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const street = streetQuery.toLowerCase().trim();
    let baseItems = activeTab === "favorites" ? API_DATA.filter(item => favorites.includes(item.id)) : API_DATA;
    return baseItems.filter(item => {
      return (item.name.toLowerCase().includes(query) || item.address.toLowerCase().includes(query)) &&
             (selectedType === "all" || item.category === selectedType) &&
             item.rating >= minRating &&
             (!onlyOpen || item.open_now) &&
             item.price <= maxPrice &&
             item.distance <= maxDistance &&
             (street === "" || item.address.toLowerCase().includes(street));
    }).sort((a, b) => b.score - a.score);
  }, [searchQuery, selectedType, minRating, onlyOpen, maxPrice, maxDistance, streetQuery, activeTab, favorites]);

  return (
    <div className={`h-screen w-full bg-[#f8fcfc] text-[#2B2D42] ${inter.className} flex overflow-hidden`}>
      
      {/* SIDEBAR */}
      <motion.aside animate={{ width: sidebarOpen ? 280 : 80 }} className="h-full bg-white border-r border-slate-200 flex flex-col relative z-30">
        <div className={`h-20 flex items-center ${sidebarOpen ? "px-8" : "justify-center"} border-b border-slate-50`}>
          <div className="w-10 h-10 bg-[#0d7377] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#0d7377]/20 shrink-0">C</div>
          {sidebarOpen && <span className={`ml-3 text-xl font-bold tracking-tight text-[#0d7377] ${dmSans.className}`}>ComparatorX</span>}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === "dashboard"} sidebarOpen={sidebarOpen} onClick={() => setActiveTab("dashboard")} />
          <NavItem icon={<Heart />} label="Favorites" active={activeTab === "favorites"} sidebarOpen={sidebarOpen} onClick={() => setActiveTab("favorites")} />
          <NavItem icon={<GitCompare />} label="Compare Multiple" active={activeTab === "compare"} sidebarOpen={sidebarOpen} onClick={() => setActiveTab("compare")} />
          <NavItem icon={<History />} label="History" active={activeTab === "history"} sidebarOpen={sidebarOpen} onClick={() => setActiveTab("history")} />
        </nav>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-24 bg-white border border-slate-200 rounded-full p-1.5 hover:text-[#ff6b6b] shadow-sm">
          {sidebarOpen ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
        </button>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white border-b border-slate-200 px-8 py-4 z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder={placeholders[currentPlaceholder]} className="w-full pl-12 pr-14 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0d7377] transition-all font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button onClick={startListening} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${isListening ? 'text-red-500 bg-red-100 scale-110 shadow-md' : 'text-slate-400 hover:text-[#0d7377] hover:bg-slate-100'}`}><Mic size={20} className={isListening ? "animate-pulse" : ""} /></button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setFilterDrawerOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-semibold text-slate-600 hover:border-[#ff6b6b] hover:text-[#ff6b6b] transition-all"><SlidersHorizontal size={18} /> Filters</button>
              <button onClick={() => router.push('/')} className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-[#ff6b6b] hover:text-white transition-all shadow-sm group"><ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" /><span className="text-xs font-black uppercase tracking-widest">Back</span></button>
            </div>
          </div>
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto flex gap-2 mt-4 overflow-x-auto no-scrollbar">
              {['all', 'doctor', 'gym'].map(type => (
                <button key={type} onClick={() => setSelectedType(type)} className={`px-6 py-2 rounded-full text-xs font-black tracking-widest border transition-all whitespace-nowrap ${selectedType === type ? "bg-[#0d7377] text-white border-[#0d7377]" : "bg-white text-slate-500 border-slate-200 hover:border-[#0d7377]"}`}>{type.toUpperCase()}</button>
              ))}
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fcfc]">
          <div className="max-w-7xl mx-auto">
            {(activeTab === 'dashboard' || activeTab === 'favorites') && (
              <>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className={`text-3xl font-bold text-[#0d7377] ${dmSans.className}`}>{activeTab === "favorites" ? "Your Favorites" : "Find, Compare, Decide"}</h2>
                    <p className="text-slate-500 font-medium mt-1">Showing verified data for San Francisco area</p>
                  </div>
                  <div className="bg-[#ff6b6b]/10 text-[#ff6b6b] px-4 py-2 rounded-xl text-sm font-black tracking-wide">{filteredItems.length} RESULTS</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => (
                      <ItemCard 
                        key={item.id} 
                        item={item} 
                        isFavorite={favorites.includes(item.id)} 
                        hasComments={!!userReviews[item.id]?.length}
                        onFavoriteToggle={() => toggleFavorite(item.id)} 
                        onDetailsClick={() => handleCompareDetails(item)} 
                        onCommentClick={() => openCommentModal(item)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
            {activeTab === 'compare' && <CompareSection data={API_DATA} />}
          </div>
        </main>
      </div>

      {/* FILTER DRAWER */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setFilterDrawerOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" />
            <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} className="fixed right-0 top-0 h-full w-80 bg-white z-50 shadow-2xl p-8 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-center mb-10 shrink-0">
                <h3 className="text-xl font-bold text-[#0d7377]">Refine Results</h3>
                <button onClick={()=>setFilterDrawerOpen(false)} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:text-[#ff6b6b] transition-colors"><X size={20}/></button>
              </div>
              <div className="space-y-8 flex-1">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Location</label>
                  <input type="text" placeholder="e.g. Sutter Street" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-1 focus:ring-[#0d7377] outline-none" value={streetQuery} onChange={(e) => setStreetQuery(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Rating</label>
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map(r => (
                      <button key={r} onClick={() => setMinRating(r)} className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${minRating === r ? "bg-[#0d7377] border-[#0d7377] text-white" : "bg-white border-slate-200"}`}>{r === 0 ? "Any" : `${r}+`} <Star size={10} className="inline ml-1 mb-1" /></button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Price (${maxPrice})</label>
                  <input type="range" min="50" max="1000" step="10" className="w-full accent-[#0d7377]" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Distance ({maxDistance} KM)</label>
                  <input type="range" min="0.005" max="0.05" step="0.005" className="w-full accent-[#0d7377]" value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Availability</label>
                  <button onClick={() => setOnlyOpen(!onlyOpen)} className={`w-full p-4 rounded-2xl border-2 flex justify-between items-center transition-all ${onlyOpen ? "border-[#0d7377] bg-[#0d7377]/5" : "border-slate-100"}`}>
                    <span className="font-bold text-slate-700">Open Now</span>
                    <div className={`w-10 h-5 rounded-full relative ${onlyOpen ? "bg-[#0d7377]" : "bg-slate-200"}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${onlyOpen ? "right-1" : "left-1"}`} /></div>
                  </button>
                </div>
              </div>
              <button onClick={()=>setFilterDrawerOpen(false)} className="w-full py-4 bg-[#ff6b6b] text-white rounded-2xl font-black tracking-widest shadow-xl shadow-[#ff6b6b]/20 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 mt-6">APPLY FILTERS</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* REVIEW / COMMENT MODAL */}
      <CommentModal 
        isOpen={commentModalOpen} 
        onClose={() => setCommentModalOpen(false)} 
        item={activeCommentItem}
        comments={activeCommentItem ? (userReviews[activeCommentItem.id] || []) : []}
        onSave={saveComment}
      />
    </div>
  );
}

// --- SUB-COMPONENT: COMPARE SECTION ---
function CompareSection({ data }: { data: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"selection" | "comparison">("selection");

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length < 3) return [...prev, id];
      return prev;
    });
  };

  const comparisonData = useMemo(() => {
    return selectedIds.map(id => {
      const basic = data.find(r => r.id === id);
      const detailed = DETAILED_MAPPING[id] || DETAILED_MAPPING["default"];
      return { ...basic, ...detailed };
    });
  }, [selectedIds, data]);

  const bestProduct = useMemo(() => {
    if (comparisonData.length === 0) return null;
    return comparisonData.reduce((prev, curr) => ((prev.score || 0) > (curr.score || 0) ? prev : curr));
  }, [comparisonData]);

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <button onClick={() => viewMode === "comparison" && setViewMode("selection")} className={`group flex items-center gap-2 text-slate-400 hover:text-[#0d7377] transition-colors mb-2 font-semibold ${viewMode === 'selection' ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}`}>
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Selection
          </button>
          <h1 className={`text-3xl font-bold text-[#0d7377] ${dmSans.className}`}>{viewMode === "selection" ? "Select Professionals" : "Comparison Analysis"}</h1>
          <p className="text-slate-500 font-medium mt-1">{viewMode === "selection" ? "Choose up to 3 experts to analyze side-by-side" : "AI-driven breakdown of your selected choices"}</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100">
          <span className={`text-xs font-black tracking-widest ${viewMode === "selection" ? "text-[#0d7377]" : "text-slate-300"}`}>1. SELECT</span>
          <div className="w-8 h-[2px] bg-slate-100"></div>
          <span className={`text-xs font-black tracking-widest ${viewMode === "comparison" ? "text-[#0d7377]" : "text-slate-300"}`}>2. COMPARE</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "selection" && (
          <motion.div key="selection-grid" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-32">
            {data.map((item) => (
              <motion.div key={item.id} variants={itemVariants} onClick={() => toggleSelection(item.id)} whileHover={{ y: -5 }} className={`relative cursor-pointer rounded-[24px] p-3 border-2 transition-all duration-300 bg-white shadow-sm hover:shadow-xl ${selectedIds.includes(item.id) ? "border-[#0d7377] ring-4 ring-[#0d7377]/10" : "border-transparent hover:border-slate-200"}`}>
                <div className="relative h-40 rounded-[20px] bg-slate-100 mb-3 overflow-hidden group">
                  <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <Star size={10} className="fill-[#0d7377] text-[#0d7377]" /> {item.rating}
                  </div>
                  <AnimatePresence>
                    {selectedIds.includes(item.id) && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0d7377]/80 flex items-center justify-center backdrop-blur-[2px]">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white text-[#0d7377] rounded-full p-2"><CheckCircle2 size={24} /></motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="px-1">
                  <h3 className="font-bold text-sm text-[#2B2D42] line-clamp-1 mb-1">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider"><MapPin size={10} /> {item.distance} KM</div>
                    <div className="bg-[#f0f9fa] text-[#0d7377] px-2 py-0.5 rounded-md text-[10px] font-black border border-[#0d7377]/20">{Math.round(item.score)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {viewMode === "comparison" && (
          // --- UPDATED COMPARISON LAYOUT: SPLIT VIEW ---
          <motion.div 
            key="comparison-view" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            className="flex flex-col xl:flex-row gap-6 items-start"
          >
            {/* LEFT SIDE: COMPARISON TABLE (Takes majority space) */}
            <div className="flex-1 w-full bg-white rounded-[40px] shadow-2xl shadow-[#0d7377]/5 border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-4 bg-slate-50/50 border-b border-slate-100">
                    <div className="p-6 md:p-8 flex items-center justify-center md:justify-start">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                            <Activity className="text-[#0d7377]" />
                        </div>
                    </div>
                    {comparisonData.map((item, idx) => (
                        <div key={idx} className="p-6 md:p-8 border-l border-slate-100 text-center relative group">
                            <img src={item.img} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow-md transition-transform group-hover:scale-110" alt={item.name} />
                            <h4 className="font-bold text-[#2B2D42] text-sm md:text-base leading-tight mb-2">{item.name}</h4>
                            {item === bestProduct && (
                                <span className="inline-block bg-[#ff6b6b] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-lg shadow-[#ff6b6b]/30 animate-pulse">
                                    Best Choice
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                <div className="divide-y divide-slate-50">
                    <CompareRow label="System Score" icon={<TrendingUp size={16}/>} data={comparisonData.map(d => d.score ? `${d.score.toFixed(1)} / 110` : "N/A")} highlight={true} />
                    <CompareRow label="Patient Trust" icon={<Star size={16}/>} data={comparisonData.map(d => `${d.user_ratings_total} verified reviews`)} />
                    <CompareRow label="Proximity" icon={<Navigation size={16}/>} data={comparisonData.map(d => `${d.distance} KM away`)} />
                    <CompareRow label="Video Insights" icon={<Youtube size={16}/>} data={comparisonData.map(d => d.youtube_summary)} />
                    <CompareRow label="Recent Feedback" icon={<MessageSquare size={16}/>} data={comparisonData.map(d => d.top_review)} />
                    <CompareRow label="Website" icon={<Globe size={16}/>} data={comparisonData.map(d => d.website)} />
                </div>
            </div>

            {/* RIGHT SIDE: RECOMMENDATION PANEL (Sticky sidebar) */}
            {bestProduct && (
                <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full xl:w-80 shrink-0 sticky top-8"
                >
                    <div className="bg-gradient-to-br from-[#0d7377] to-[#094c4f] rounded-[32px] p-8 text-white shadow-2xl shadow-[#0d7377]/20 relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#ff6b6b]/20 rounded-full blur-2xl -ml-10 -mb-10" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                                <Trophy size={24} className="text-white" />
                            </div>

                            <h3 className="text-xl font-bold mb-1">ComparatorX Insight</h3>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">AI Generated Analysis</span>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/5">
                                <div className="flex items-center gap-3 mb-3">
                                    <img src={bestProduct.img} className="w-10 h-10 rounded-full object-cover border-2 border-white/50" alt={bestProduct.name} />
                                    <div>
                                        <p className="text-xs font-bold opacity-80">Winner</p>
                                        <p className="text-sm font-bold leading-tight">{bestProduct.name}</p>
                                    </div>
                                </div>
                                <div className="h-px w-full bg-white/10 mb-3" />
                                <div className="flex justify-between items-center text-xs font-medium">
                                    <span>Match Score</span>
                                    <span className="bg-white text-[#0d7377] px-2 py-0.5 rounded text-[10px] font-black">{bestProduct.score.toFixed(1)}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <Quote size={16} className="text-[#ff6b6b] shrink-0 mt-1" />
                                    <p className="text-sm leading-relaxed text-white/90 font-medium">
                                        Selected for highest proximity score and verified patient trust. This professional consistently outperforms in localized sentiment analysis.
                                    </p>
                                </div>
                            </div>

                            
                        </div>
                    </div>
                </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedIds.length > 0 && viewMode === "selection" && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-8 left-0 right-0 px-6 flex justify-center z-50 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-2xl p-2 pl-6 flex items-center gap-6 pointer-events-auto max-w-lg w-full ring-1 ring-black/5">
              <div className="flex flex-col"><span className="text-[#0d7377] font-black text-xs uppercase tracking-widest">Selection Active</span><span className="font-bold text-slate-700 text-sm">{selectedIds.length} / 3 Professionals</span></div>
              <button onClick={() => selectedIds.length > 1 ? setViewMode("comparison") : toast.error("Please select at least 2 items to compare.")} className={`flex-1 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${selectedIds.length > 1 ? "bg-[#0d7377] text-white hover:bg-[#0b5f62] hover:scale-[1.02]" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>{selectedIds.length > 1 ? "COMPARE NOW" : "Select More"} {selectedIds.length > 1 && <ArrowRight size={16} />}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- HELPER COMPONENTS ---

function CommentModal({ isOpen, onClose, item, comments, onSave }: any) {
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-lg text-[#0d7377]">User Reviews</h3>
            <p className="text-xs text-slate-500 font-medium">for {item?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-[#ff6b6b] border border-slate-200"><X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm italic">No reviews yet. Be the first!</div>
          ) : (
            comments.map((c: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0d7377]/10 flex items-center justify-center text-[#0d7377] shrink-0 mt-1"><User size={14} /></div>
                <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={10} className={`${idx < c.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={8} /> {c.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="mb-3 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star} 
                onClick={() => setRating(star)} 
                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <Star 
                  size={24} 
                  className={`${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} 
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0d7377]"
              placeholder="Add your review..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && newComment.trim() && rating > 0) {
                  onSave(newComment, rating);
                  setNewComment("");
                  setRating(0);
                  onClose(); 
                }
              }}
            />
            <button 
              onClick={() => {
                if(newComment.trim() && rating > 0) {
                  onSave(newComment, rating);
                  setNewComment("");
                  setRating(0);
                  onClose(); 
                }
              }} 
              disabled={!newComment.trim() || rating === 0}
              className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${
                newComment.trim() && rating > 0 
                ? "bg-[#0d7377] text-white hover:bg-[#0b5f62] hover:scale-[1.02]" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ItemCard({ item, isFavorite, onFavoriteToggle, onDetailsClick, onCommentClick, hasComments }: any) {
  return (
    <motion.div layout initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="bg-white rounded-[32px] border border-slate-100 p-4 shadow-sm hover:shadow-xl hover:shadow-[#0d7377]/10 transition-all flex flex-col group relative">
      <div className="relative h-44 rounded-[24px] overflow-hidden mb-4">
        <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-100">
          <Star size={12} className="text-[#0d7377] fill-[#0d7377]" />
          <span className="text-xs font-black text-[#0d7377]">{item.rating}</span>
          <span className="text-[10px] text-slate-400 font-bold">({item.user_ratings_total})</span>
        </div>
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${item.open_now ? "bg-[#0d7377] text-white" : "bg-white/90 text-slate-400 border border-slate-200"}`}>{item.open_now ? "Open Now" : "Closed"}</div>
      </div>
      <div className="flex-1 px-1">
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="font-bold text-[#2B2D42] text-sm leading-tight line-clamp-2 h-10">{item.name}</h3>
          <div className="shrink-0 flex flex-col items-end"><div className="bg-[#0d7377]/10 text-[#0d7377] text-[10px] font-black px-2 py-0.5 rounded-lg border border-[#0d7377]/20">{Math.round(item.score)}</div><span className="text-[8px] font-black text-slate-300 mt-0.5">SCORE</span></div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2 text-slate-400"><MapPin size={14} className="mt-0.5 text-[#ff6b6b]" /><p className="text-[11px] font-semibold leading-relaxed line-clamp-1">{item.address}</p></div>
          <div className="flex items-center gap-2 text-[#0d7377] font-black text-[10px] tracking-widest bg-[#0d7377]/5 w-fit px-3 py-1.5 rounded-xl border border-[#0d7377]/10 uppercase"><Navigation size={12} />{item.distance} KM AWAY</div>
        </div>
        <div className="p-3 bg-[#f8fcfc] rounded-2xl mb-4 border border-[#0d7377]/10 h-16 overflow-hidden"><p className="text-[10px] text-slate-500 font-bold leading-relaxed italic line-clamp-2">"{item.reason}"</p></div>
      </div>
      <div className="flex gap-2">
        <button onClick={onDetailsClick} className="flex-1 py-3 bg-[#0d7377] text-white rounded-2xl text-[10px] font-black tracking-widest hover:bg-[#0b5c5f] transition-all hover:shadow-lg shadow-[#0d7377]/20 uppercase">Compare Details</button>
        
        {/* Comment Button */}
        <button onClick={onCommentClick} className="relative p-3 border border-slate-100 rounded-2xl text-slate-400 hover:text-[#0d7377] hover:bg-[#0d7377]/5 transition-all">
          <MessageCircle size={18} />
          {hasComments && <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff6b6b] rounded-full border border-white"></span>}
        </button>

        <button onClick={onFavoriteToggle} className={`p-3 border rounded-2xl transition-all ${isFavorite ? "bg-[#ff6b6b] border-[#ff6b6b] text-white" : "border-slate-100 text-slate-300 hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/5"}`}><Heart size={18} className={isFavorite ? "fill-white" : ""} /></button>
      </div>
    </motion.div>
  );
}

function NavItem({ icon, label, active = false, sidebarOpen, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center p-3 rounded-2xl cursor-pointer transition-all ${active ? "bg-[#ff6b6b]/10 text-[#ff6b6b]" : "text-slate-400 hover:bg-slate-50 hover:text-[#0d7377]"} ${!sidebarOpen && "justify-center"}`}>
      {React.cloneElement(icon, { size: 20 })}
      {sidebarOpen && <span className="ml-4 font-black text-[11px] uppercase tracking-widest">{label}</span>}
    </div>
  );
}

function CompareRow({ label, icon, data, highlight = false }: { label: string, icon: React.ReactNode, data: string[], highlight?: boolean }) {
  return (
    <div className={`grid grid-cols-4 hover:bg-slate-50/50 transition-colors group ${highlight ? "bg-[#f8fcfc]" : ""}`}>
      <div className="p-6 flex items-center gap-3 text-slate-500 font-bold text-xs md:text-sm uppercase tracking-wider">
        <span className={`${highlight ? "text-[#0d7377]" : "text-[#ff6b6b]"}`}>{icon}</span> {label}
      </div>
      {data.map((text, i) => (
        <div key={i} className="p-6 border-l border-slate-50 text-xs md:text-sm font-semibold text-[#2B2D42] flex items-center justify-center text-center leading-relaxed relative">
          {highlight && <div className="absolute inset-x-2 inset-y-4 bg-[#0d7377]/5 rounded-lg -z-10" />}
          {text}
        </div>
      ))}
      {Array.from({ length: 3 - data.length }).map((_, i) => <div key={i} className="p-6 border-l border-slate-50 bg-slate-50/20" />)}
    </div>
  );
}