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
  Mic
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

// --- API Data ---
const API_DATA = [
  { "id": "1", "name": "Dr. Matthew Young, DDS", "rating": 4.9, "user_ratings_total": 276, "address": "490 Post Street STE 830, San Francisco", "open_now": true, "category": "doctor", "distance": 0.017, "price": 150, "score": 103.4, "reason": "High rating, very close, currently open, trusted by many patients", "img": "https://images.unsplash.com/photo-1629902308162-432f63e13d27?w=400&q=60" },
  { "id": "2", "name": "Miguel Delgado, M.D.", "rating": 4.9, "user_ratings_total": 134, "address": "450 Sutter Street #2433, San Francisco", "open_now": true, "category": "doctor", "distance": 0.019, "price": 200, "score": 98.4, "reason": "High rating, very close to you, currently open, trusted by many patients", "img": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=60" },
  { "id": "3", "name": "Richard H. Hongo, M.D.", "rating": 5.0, "user_ratings_total": 102, "address": "1100 Van Ness Avenue, San Francisco", "open_now": true, "category": "doctor", "distance": 0.012, "price": 300, "score": 109.5, "reason": "Perfect rating, extremely close, currently open, trusted by many patients", "img": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=60" },
  { "id": "4", "name": "San Francisco Plastic Surgery", "rating": 4.6, "user_ratings_total": 103, "address": "1244 Larkin Street, San Francisco", "open_now": true, "category": "doctor", "distance": 0.015, "price": 500, "score": 100.4, "reason": "High rating, very close to you, currently open, trusted by many patients", "img": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=60" },
  { "id": "5", "name": "Rupsa R. Yee, M.D.", "rating": 4.8, "user_ratings_total": 95, "address": "1100 Van Ness Avenue, San Francisco", "open_now": true, "category": "doctor", "distance": 0.012, "price": 180, "score": 107.3, "reason": "High rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=60" },
  { "id": "6", "name": "Heidi Wittenberg, MD", "rating": 4.5, "user_ratings_total": 8, "address": "45 Castro Street, San Francisco", "open_now": true, "category": "doctor", "distance": 0.017, "price": 220, "score": 88.3, "reason": "High rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=60" },
  { "id": "7", "name": "Gold's Gym SF", "rating": 4.5, "user_ratings_total": 500, "address": "1001 Brannan St, San Francisco", "open_now": true, "category": "gym", "distance": 0.025, "price": 80, "score": 95.0, "reason": "Popular choice, great equipment, currently open", "img": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=60" },
  { "id": "8", "name": "Fitness SF - Castro", "rating": 4.7, "user_ratings_total": 320, "address": "2301 Market St, San Francisco", "open_now": true, "category": "gym", "distance": 0.018, "price": 95, "score": 92.5, "reason": "Highly rated, central location, currently open", "img": "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=60" },
  { "id": "9", "name": "UCSF Otolaryngology", "rating": 2.5, "user_ratings_total": 25, "address": "2380 Sutter St, San Francisco", "open_now": true, "category": "doctor", "distance": 0.023, "price": 120, "score": 65.2, "reason": "Very close to you, currently open", "img": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=60" },
  { "id": "10", "name": "Barry C Baron, MD", "rating": 3.3, "user_ratings_total": 3, "address": "2100 Webster St, San Francisco", "open_now": false, "category": "doctor", "distance": 0.02, "price": 100, "score": 70.3, "reason": "Because it has very close to you", "img": "https://images.unsplash.com/photo-1612531388300-47350766327e?w=400&q=60" }
];

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // --- Speech Recognition State ---
  const [isListening, setIsListening] = useState(false);

  // --- Multi-language Placeholder Logic ---
  const placeholders = [
    "Try 'doctor near me' or 'best gym'...",      // English
    "मेरे पास 'डॉक्टर' या 'बेस्ट जिम' खोजें...",       // Hindi
    "'माझ्या जवळचे डॉक्टर' किंवा 'सर्वोत्तम जिम' शोधा..." // Marathi
  ];
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 1000); 
    return () => clearInterval(interval);
  }, [placeholders.length]);

  // --- Speech Recognition Logic ---
  const startListening = useCallback(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // IMPORTANT: Stop after one sentence
    recognition.interimResults = false; // Only trigger when the user is done speaking
    recognition.lang = 'en-US'; 

    recognition.onstart = () => {
      setIsListening(true);
      console.log("Microphone is open. Speak now.");
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("Microphone closed.");
    };
    
    recognition.onresult = (event: any) => {
      // Get the transcript
      const transcript = event.results[0][0].transcript;
      console.log("Speech detected:", transcript);
      // Update the search query state
      setSearchQuery(transcript);
    };
    
    recognition.onerror = (event: any) => {
      // 'no-speech' happens if you click the button but don't say anything
      // 'aborted' happens if you click the button again to stop it
      if (event.error === 'no-speech') {
        console.warn("No speech was detected. Please try again.");
      } else if (event.error === 'not-allowed') {
        alert("Microphone permission denied. Please allow microphone access in your browser settings.");
      } else if (event.error !== 'aborted') {
        console.error("Speech recognition error:", event.error);
      }
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Speech recognition failed to start:", err);
      setIsListening(false);
    }
  }, []);

  // Filter Drawer States
  const [minRating, setMinRating] = useState(0);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxDistance, setMaxDistance] = useState(0.05);
  const [streetQuery, setStreetQuery] = useState("");

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleCompareDetails = (item: any) => {
    localStorage.setItem("comparison_item", JSON.stringify(item));
    router.push(`/item/${item.id}`);
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const street = streetQuery.toLowerCase().trim();
    
    let baseItems = activeTab === "favorites" 
      ? API_DATA.filter(item => favorites.includes(item.id)) 
      : API_DATA;

    return baseItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(query) || item.address.toLowerCase().includes(query) || (query.includes("doctor") && item.category === "doctor") || (query.includes("gym") && item.category === "gym");
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
          <NavItem icon={<History />} label="History" sidebarOpen={sidebarOpen} />
        </nav>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-24 bg-white border border-slate-200 rounded-full p-1.5 hover:text-[#ff6b6b] shadow-sm">
          {/* FIXED SYNTAX HERE */}
          {sidebarOpen ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
        </button>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4 z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            {/* SEARCH BAR CONTAINER */}
            <div className="flex-1 relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={placeholders[currentPlaceholder]} 
                className="w-full pl-12 pr-14 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0d7377] transition-all font-medium placeholder:transition-opacity placeholder:duration-300" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              {/* MICROPHONE BUTTON */}
              <button 
                onClick={startListening}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${isListening ? 'text-red-500 bg-red-100 scale-110 shadow-md' : 'text-slate-400 hover:text-[#0d7377] hover:bg-slate-100'}`}
                title="Click to Speak"
              >
                {/* Single Mic Icon - Pulses when listening */}
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
                <h2 className={`text-3xl font-bold text-[#0d7377] ${dmSans.className}`}>{activeTab === "dashboard" ? "Find, Compare, Decide" : "Your Favorites"}</h2>
                <p className="text-slate-500 font-medium mt-1">{activeTab === "dashboard" ? "Showing verified data for San Francisco area" : "Your hand-picked collection"}</p>
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
                  <input type="range" min="0.01" max="0.05" step="0.005" className="w-full accent-[#0d7377]" value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))} />
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
          <h3 className="font-bold text-[#2B2D42] text-base leading-tight line-clamp-1">{item.name}</h3>
          <div className="shrink-0 flex flex-col items-end"><div className="bg-[#0d7377]/10 text-[#0d7377] text-[10px] font-black px-2 py-0.5 rounded-lg border border-[#0d7377]/20">{Math.round(item.score)}</div><span className="text-[8px] font-black text-slate-300 mt-0.5">SCORE</span></div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2 text-slate-400"><MapPin size={14} className="mt-0.5 text-[#ff6b6b]" /><p className="text-[11px] font-semibold leading-relaxed line-clamp-1">{item.address}</p></div>
          <div className="flex items-center gap-2 text-[#0d7377] font-black text-[10px] tracking-widest bg-[#0d7377]/5 w-fit px-3 py-1.5 rounded-xl border border-[#0d7377]/10 uppercase"><Navigation size={12} />{item.distance} KM AWAY</div>
        </div>
        <div className="p-3 bg-[#f8fcfc] rounded-2xl mb-4 border border-[#0d7377]/10"><p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">"{item.reason}"</p></div>
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