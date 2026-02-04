"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  MapPin, 
  Star, 
  X,
  Heart,
  History,
  Navigation,
  ArrowLeft,
  Mic,
  GitCompare // Added for the compare icon
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

// --- FULL HARDCODED API DATA ---
const API_DATA = [
  { "id": "ChIJqRhcpY6AhYARiRbQlfohXjk", "name": "Dr. Matthew Young, DDS", "rating": 4.9, "user_ratings_total": 276, "address": "490 Post Street STE 830, San Francisco", "open_now": true, "category": "doctor", "distance": 0.017, "price": 150, "score": 103.47, "reason": "High rating, very close to you, currently open, trusted by many patients", "img": "https://images.unsplash.com/photo-1629902308162-432f63e13d27?w=400&q=60" },
  { "id": "ChIJ-0phpY6AhYARE_FYalDygAI", "name": "Miguel Delgado, M.D.", "rating": 4.9, "user_ratings_total": 134, "address": "450 Sutter Street #2433, San Francisco", "open_now": true, "category": "doctor", "distance": 0.019, "price": 200, "score": 98.47, "reason": "High rating, very close to you, currently open, trusted by many patients", "img": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=60" },
  { "id": "ChIJ-fdK9caAhYARVO9yrtogX0w", "name": "Richard H. Hongo, M.D. FACC", "rating": 5.0, "user_ratings_total": 102, "address": "1100 Van Ness Avenue, San Francisco", "open_now": true, "category": "doctor", "distance": 0.012, "price": 300, "score": 109.59, "reason": "High rating, very close to you, currently open, trusted by many patients", "img": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=60" },
  { "id": "ChIJyyyMio6AhYARVhFzc-xQrAI", "name": "SF Plastic Surgery: Dr. Usha Rajagopal", "rating": 4.6, "user_ratings_total": 103, "address": "1244 Larkin Street Suite 200, San Francisco", "open_now": true, "category": "doctor", "distance": 0.015, "price": 500, "score": 100.46, "reason": "High rating, very close to you, currently open, trusted by many patients", "img": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=60" },
  { "id": "ChIJwZEqFuqAhYARni9P_qStdco", "name": "Rupsa R. Yee, M.D.", "rating": 4.8, "user_ratings_total": 95, "address": "1100 Van Ness Avenue, San Francisco", "open_now": true, "category": "doctor", "distance": 0.012, "price": 180, "score": 107.38, "reason": "High rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=60" },
  { "id": "ChIJ-fdK9caAhYARrik8Z_HHn2s", "name": "Heidi Wittenberg, MD", "rating": 4.5, "user_ratings_total": 8, "address": "45 Castro Street #324, San Francisco", "open_now": true, "category": "doctor", "distance": 0.017, "price": 220, "score": 88.39, "reason": "High rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=60" },
  { "id": "ChIJYxVpxFmHhYAROSTRVNEmlZY", "name": "UCSF Otolaryngology Clinic", "rating": 2.5, "user_ratings_total": 25, "address": "2380 Sutter Street, San Francisco", "open_now": true, "category": "doctor", "distance": 0.023, "price": 120, "score": 65.27, "reason": "Because it has very close to you, currently open", "img": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=60" },
  { "id": "ChIJLSWrfVeHhYARNZ7sd0Sj_xs", "name": "Diana Camarillo, MD", "rating": 3.8, "user_ratings_total": 6, "address": "2211 Post Street Ste 404, San Francisco", "open_now": true, "category": "doctor", "distance": 0.021, "price": 140, "score": 75.93, "reason": "Because it has very close to you, currently open", "img": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&q=60" },
  { "id": "ChIJqRhcpY6AhYARXTsxlZV_BnU", "name": "David Ehsan MD, DDS", "rating": 4.7, "user_ratings_total": 13, "address": "450 Sutter Street #2230, San Francisco", "open_now": true, "category": "doctor", "distance": 0.019, "price": 190, "score": 89.89, "reason": "Because it has high rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=60" },
  { "id": "ChIJ-fdK9caAhYARpkbyzKa8R0M", "name": "Barry C Baron, MD", "rating": 3.3, "user_ratings_total": 3, "address": "2100 Webster Street #329, San Francisco", "open_now": false, "category": "doctor", "distance": 0.02, "price": 100, "score": 70.32, "reason": "Because it has very close to you", "img": "https://images.unsplash.com/photo-1612531388300-47350766327e?w=400&q=60" },
  { "id": "ChIJ-fdK9caAhYAROo5Xzv_8y68", "name": "Dr. Nancy L. Carteron, MD", "rating": 5.0, "user_ratings_total": 1, "address": "2100 Webster Street, San Francisco", "open_now": false, "category": "doctor", "distance": 0.02, "price": 250, "score": 85.24, "reason": "Because it has high rating, very close to you", "img": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=60" },
  { "id": "ChIJLSWrfVeHhYARcz6ZyTF7ZVU", "name": "Dr. Lynda A. Frassetto, MD", "rating": 5.0, "user_ratings_total": 1, "address": "1675 Scott Street, San Francisco", "open_now": false, "category": "doctor", "distance": 0.022, "price": 240, "score": 83.59, "reason": "Because it has high rating, very close to you", "img": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=60" },
  { "id": "ChIJsTwLd5OAhYARa1cxe_h8zSc", "name": "James B Stark Corporation", "rating": 3.0, "user_ratings_total": 2, "address": "909 Hyde Street #432, San Francisco", "open_now": false, "category": "doctor", "distance": 0.015, "price": 110, "score": 73.94, "reason": "Because it has very close to you", "img": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=60" },
  { "id": "ChIJ-fdK9caAhYARk_iASswx0DI", "name": "Rona Z. Silkiss MD FACS", "rating": 0, "user_ratings_total": 0, "address": "711 Van Ness Avenue #340, San Francisco", "open_now": true, "category": "doctor", "distance": 0.007, "price": 160, "score": 57.36, "reason": "Because it has very close to you, currently open", "img": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=60" },
  { "id": "ChIJRVbVCqiAhYAROYrvqdyWVwo", "name": "Kind Gabriel M, MD", "rating": 4.5, "user_ratings_total": 29, "address": "45 Castro Street #410, San Francisco", "open_now": true, "category": "doctor", "distance": 0.016, "price": 210, "score": 93.09, "reason": "Because it has high rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=60" },
  { "id": "ChIJ-fdK9caAhYARdFlme99yHr4", "name": "Pacific Eye Associates", "rating": 3.3, "user_ratings_total": 139, "address": "2100 Webster Street # 214, San Francisco", "open_now": true, "category": "doctor", "distance": 0.02, "price": 130, "score": 81.12, "reason": "Because it has very close to you, currently open, trusted by many patients", "img": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=60" },
  { "id": "ChIJb0629MaAhYARuN3VyqlC3eg", "name": "Catherine Madison, MD", "rating": 5.0, "user_ratings_total": 1, "address": "45 Castro Street #220, San Francisco", "open_now": false, "category": "doctor", "distance": 0.017, "price": 280, "score": 88.73, "reason": "Because it has high rating, very close to you", "img": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=60" },
  { "id": "ChIJ-fdK9caAhYARzHw7XFcfoOk", "name": "Dr. Eliza H. Mccaw, MD", "rating": 4.5, "user_ratings_total": 2, "address": "2100 Webster Street UNIT 423, San Francisco", "open_now": false, "category": "doctor", "distance": 0.02, "price": 195, "score": 81.46, "reason": "Because it has high rating, very close to you", "img": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=60" },
  { "id": "ChIJLSWrfVeHhYARdU5fvaBlyow", "name": "Hani Sbitany, M.D.", "rating": 5.0, "user_ratings_total": 2, "address": "1600 Divisadero Street, San Francisco", "open_now": false, "category": "doctor", "distance": 0.022, "price": 310, "score": 84.40, "reason": "Because it has high rating, very close to you", "img": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=60" },
  { "id": "ChIJ-fdK9caAhYARpRyp0pj5drs", "name": "Audrey Koh, MD", "rating": 3.4, "user_ratings_total": 20, "address": "2100 Webster Street UNIT 518, San Francisco", "open_now": true, "category": "doctor", "distance": 0.02, "price": 155, "score": 76.18, "reason": "Because it has very close to you, currently open", "img": "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&q=60" }
];

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const [isListening, setIsListening] = useState(false);

  const placeholders = [
    "Try 'doctor near me' or 'best gym'...",
    "मेरे पास 'डॉक्टर' या 'बेस्ट जिम' खोजें...",
    "'माझ्या जवळचे डॉक्टर' किंवा 'सर्वोत्तम जिम' शोधा..."
  ];
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 2000); 
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; 
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      setSearchQuery(event.results[0][0].transcript);
    };
    recognition.onerror = () => setIsListening(false);
    try { recognition.start(); } catch (err) { setIsListening(false); }
  }, []);

  const [minRating, setMinRating] = useState(0);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxDistance, setMaxDistance] = useState(0.05);
  const [streetQuery, setStreetQuery] = useState("");

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]);
  };

  const handleCompareDetails = (item: any) => {
    localStorage.setItem("comparison_item", JSON.stringify(item));
    router.push(`/item/${item.id}`);
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const street = streetQuery.toLowerCase().trim();
    let baseItems = activeTab === "favorites" ? API_DATA.filter(item => favorites.includes(item.id)) : API_DATA;
    return baseItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(query) || item.address.toLowerCase().includes(query);
      const matchesType = selectedType === "all" || item.category === selectedType;
      const matchesRating = item.rating >= minRating;
      const matchesOpen = onlyOpen ? item.open_now : true;
      const matchesPrice = item.price <= maxPrice;
      const matchesDistance = item.distance <= maxDistance;
      const matchesStreet = street === "" || item.address.toLowerCase().includes(street);
      return matchesSearch && matchesType && matchesRating && matchesOpen && matchesPrice && matchesDistance && matchesStreet;
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
          
          {/* NEW ITEM ADDED HERE */}
          <NavItem 
  icon={<GitCompare />} 
  label="Compare Multiple" 
  active={activeTab === "compare"} 
  sidebarOpen={sidebarOpen} 
  onClick={() => {
    setActiveTab("compare"); // Updates the active UI state
    router.push('/compare'); // Links to app/compare/page.tsx
  }} 
/>
          <NavItem icon={<History />} label="History" active={activeTab === "history"} sidebarOpen={sidebarOpen} onClick={() => setActiveTab("history")} />
        </nav>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-24 bg-white border border-slate-200 rounded-full p-1.5 hover:text-[#ff6b6b] shadow-sm">
          {sidebarOpen ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
        </button>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4 z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={placeholders[currentPlaceholder]} 
                className="w-full pl-12 pr-14 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0d7377] transition-all font-medium" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <button 
                onClick={startListening}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${isListening ? 'text-red-500 bg-red-100 scale-110 shadow-md' : 'text-slate-400 hover:text-[#0d7377] hover:bg-slate-100'}`}
              >
                <Mic size={20} className={isListening ? "animate-pulse" : ""} />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => setFilterDrawerOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl font-semibold text-slate-600 hover:border-[#ff6b6b] hover:text-[#ff6b6b] transition-all">
                <SlidersHorizontal size={18} /> Filters
              </button>
              <button onClick={() => router.push('/')} className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-[#ff6b6b] hover:text-white transition-all shadow-sm group">
                <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">Back</span>
              </button>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto flex gap-2 mt-4 overflow-x-auto no-scrollbar">
            {['all', 'doctor', 'gym'].map(type => (
              <button key={type} onClick={() => setSelectedType(type)} className={`px-6 py-2 rounded-full text-xs font-black tracking-widest border transition-all whitespace-nowrap ${selectedType === type ? "bg-[#0d7377] text-white border-[#0d7377]" : "bg-white text-slate-500 border-slate-200 hover:border-[#0d7377]"}`}>
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fcfc]">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className={`text-3xl font-bold text-[#0d7377] ${dmSans.className}`}>
                  {activeTab === "dashboard" ? "Find, Compare, Decide" : 
                   activeTab === "favorites" ? "Your Favorites" : 
                   activeTab === "compare" ? "Multi-Comparison" : "Activity History"}
                </h2>
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
                    onFavoriteToggle={() => toggleFavorite(item.id)} 
                    onDetailsClick={() => handleCompareDetails(item)} 
                  />
                ))}
              </AnimatePresence>
            </div>
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Street / Area</label>
                  <input type="text" placeholder="e.g. Sutter Street" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-1 focus:ring-[#0d7377] outline-none" value={streetQuery} onChange={(e) => setStreetQuery(e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Min Rating</label>
                  <div className="flex gap-2">
                    {[0, 3, 4, 4.5].map(r => (
                      <button key={r} onClick={() => setMinRating(r)} className={`flex-1 py-3 rounded-xl border font-bold text-xs transition-all ${minRating === r ? "bg-[#0d7377] border-[#0d7377] text-white" : "bg-white border-slate-200"}`}>{r === 0 ? "Any" : `${r}+`} <Star size={10} className="inline ml-1 mb-1" /></button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Max Price (${maxPrice})</label>
                  <input type="range" min="50" max="1000" step="10" className="w-full accent-[#0d7377]" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Max Distance ({maxDistance} KM)</label>
                  <input type="range" min="0.005" max="0.05" step="0.005" className="w-full accent-[#0d7377]" value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))} />
                </div>
                <div>
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
    </div>
  );
}

function ItemCard({ item, isFavorite, onFavoriteToggle, onDetailsClick }: { item: any, isFavorite: boolean, onFavoriteToggle: () => void, onDetailsClick: () => void }) {
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