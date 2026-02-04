"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Smartphone, Stethoscope, Utensils, Search, 
  ChevronLeft, ChevronRight, SlidersHorizontal, MapPin, Star, 
  X, Heart, Loader2, Navigation, ArrowRight, Home, RotateCcw
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

const SEARCH_FILTERS = [
  { id: "all", label: "All", icon: null },
  { id: "doctor", label: "Doctors", icon: <Stethoscope className="w-4 h-4" /> },
  { id: "gadget", label: "Electronics", icon: <Smartphone className="w-4 h-4" /> },
  { id: "food", label: "Food", icon: <Utensils className="w-4 h-4" /> },
];

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function DashboardPage() {
  const router = useRouter();
  
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  
  // Data State
  const [items, setItems] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<any[]>([]);
  const [coords, setCoords] = useState({ lat: 19.0760, lng: 72.8777 });

  // Client-Side Filters (Local filtering only)
  const [minRating, setMinRating] = useState(0);

  // Fetch Location on Mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      );
    }
  }, []);

  // --- API ROUTING LOGIC ---
  const performServerSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let url: URL;
      const queryLower = searchQuery.toLowerCase();
      
      // Keywords that trigger the product API
      const productKeywords = ['iphone', 'samsung', 'oneplus', 'pixel', 'laptop', 'macbook', 'sony', 'buds', 'phone', 'camera', 'gadget', '13', '14', '15', '16', '17'];
      
      const isProductIntent = selectedType === "gadget" || 
        (selectedType === "all" && productKeywords.some(key => queryLower.includes(key)));

      if (isProductIntent) {
        // --- CALL PRODUCT API ---
        url = new URL(`${BASE_URL}/api/products`);
        url.searchParams.append("q", searchQuery || "iPhone 16"); 
      } else {
        // --- CALL DOCTOR API ---
        const isAI = searchQuery.trim().split(/\s+/).length >= 3;
        const endpoint = isAI ? "/api/doctors/ai" : "/api/doctors";
        url = new URL(`${BASE_URL}${endpoint}`);
        url.searchParams.append("lat", coords.lat.toString());
        url.searchParams.append("lng", coords.lng.toString());
        
        if (isAI) url.searchParams.append("q", searchQuery);
        else url.searchParams.append("speciality", searchQuery || "physician");
      }

      const response = await fetch(url.toString());
      
      if (response.status === 422) {
        throw new Error("FastAPI Error 422: Parameter Mismatch.");
      }
      if (!response.ok) throw new Error("Search failed.");
      
      const data = await response.json();

      // MAPPING API RESPONSE TO UI
      const mapped = (data.results || []).map((res: any, i: number) => ({
        id: res.id || `item-${i}-${Date.now()}`,
        type: isProductIntent ? "gadget" : "doctor",
        title: res.name,
        // Price formatting for products, default for doctors
        price: res.price ? (typeof res.price === 'number' ? `₹${res.price.toLocaleString()}` : res.price) : "Consultation Varies",
        rating: res.rating || 0,
        // Seller for products, Address for doctors
        loc: res.seller || res.address || "Mumbai",
        // LLM Summary for products, Reason for doctors
        reason: isProductIntent ? (data.review_summary || "Top reviewed product") : res.reason,
        img: isProductIntent 
          ? "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" 
          : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
        distance: res.distance || 0
      }));

      setItems(mapped);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedType, coords]);

  // --- CLIENT SIDE FILTERING ---
  const filteredDisplayItems = useMemo(() => {
    let result = items;
    if (activeNav === 'saved') result = result.filter(i => savedIds.includes(i.id));
    if (minRating > 0) result = result.filter(i => i.rating >= minRating);
    return result;
  }, [items, activeNav, savedIds, minRating]);

  // Initial Load
  useEffect(() => { performServerSearch(); }, [coords]);

  return (
    <div className={`h-screen w-full bg-[#F8FAFC] text-[#1E293B] ${inter.className} flex overflow-hidden`}>
      
      {/* SIDEBAR */}
      <motion.aside animate={{ width: sidebarOpen ? 260 : 80 }} className="h-full bg-white border-r flex flex-col relative z-20 shadow-sm">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-10 bg-white border rounded-full p-1 shadow-sm hover:text-[#0D7377]">
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className={`h-20 flex items-center ${sidebarOpen ? "px-6" : "justify-center"} border-b`}>
          <div className="w-8 h-8 bg-[#0D7377] rounded-lg shrink-0" />
          {sidebarOpen && <span className={`ml-3 text-lg font-bold text-[#0D7377] ${dmSans.className}`}>ComparatorX</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => router.push("/")} className="w-full flex items-center p-3 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
            <Home className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3 font-medium text-sm">Back to Home</span>}
          </button>
          <button onClick={() => setActiveNav("overview")} className={`w-full flex items-center p-3 rounded-xl ${activeNav === "overview" ? "bg-[#0D7377]/10 text-[#0D7377]" : "text-slate-400"}`}>
            <LayoutDashboard className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3 font-medium text-sm">Dashboard</span>}
          </button>
          <button onClick={() => setActiveNav("saved")} className={`w-full flex items-center p-3 rounded-xl ${activeNav === "saved" ? "bg-[#0D7377]/10 text-[#0D7377]" : "text-slate-400"}`}>
            <Heart className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3 font-medium text-sm">Saved Items</span>}
          </button>
        </nav>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-8 py-4">
          <div className="max-w-4xl flex flex-col gap-4">
            
            <form onSubmit={(e) => { e.preventDefault(); performServerSearch(); }} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-[#0D7377]" />
              <input 
                type="text" 
                placeholder="Try 'iPhone 17' or 'Dentist in Bandra'..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-16 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#0D7377] rounded-2xl outline-none text-sm transition-all"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0D7377] text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-[#0D7377]/20">
                {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Search"}
              </button>
            </form>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {SEARCH_FILTERS.map(f => (
                  <button 
                    key={f.id} 
                    onClick={() => { setSelectedType(f.id); }} 
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedType === f.id ? "bg-[#0D7377] text-white" : "bg-white text-slate-500 hover:border-slate-300"}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setFilterDrawerOpen(true)} className="flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:border-[#0D7377]">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <div className="mb-8 flex justify-between items-end">
             <div>
               <h1 className={`${dmSans.className} text-3xl font-bold text-slate-800`}>
                 {activeNav === 'saved' ? 'My Collections' : 'Discovery Dashboard'}
               </h1>
               <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                  <Navigation className="w-3 h-3 text-[#0D7377]" />
                  GPS: {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}
               </div>
             </div>
             {error && <div className="text-red-500 text-xs bg-red-50 px-4 py-2 rounded-lg border border-red-100 animate-pulse">{error}</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDisplayItems.map((item) => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  isSaved={savedIds.includes(item.id)} 
                  onToggleSave={() => setSavedIds(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])} 
                />
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* FILTER DRAWER (Client-Side) */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFilterDrawerOpen(false)} className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 w-80 h-full bg-white z-50 p-8 shadow-2xl flex flex-col">
               <div className="flex justify-between items-center mb-10">
                 <h2 className="font-bold text-xl">Local Filters</h2>
                 <X className="cursor-pointer" onClick={() => setFilterDrawerOpen(false)} />
               </div>
               <div className="flex-1 space-y-8">
                 <div className="bg-slate-50 p-4 rounded-xl text-[10px] text-slate-500 leading-relaxed border border-dashed border-slate-200">
                    Client-side filters hide items in your current view. Hit "Search" again to refresh from server.
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-400 block mb-4 uppercase">Min Rating</label>
                   <div className="grid grid-cols-4 gap-2">
                     {[0, 3, 4, 4.5].map(r => (
                       <button key={r} onClick={() => setMinRating(r)} className={`py-2 rounded-lg border text-[10px] font-bold transition-all ${minRating === r ? "bg-[#0D7377] text-white" : "bg-white text-slate-500"}`}>
                         {r === 0 ? "All" : r + "+"}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
               <button onClick={() => setFilterDrawerOpen(false)} className="w-full py-4 bg-[#0D7377] text-white rounded-2xl font-bold shadow-lg shadow-[#0D7377]/20">
                 Apply View
               </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ItemCard({ item, isSaved, onToggleSave }: any) {
  const router = useRouter();

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full group">
      <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-slate-50">
        <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm">
           <Star className="w-3 h-3 text-orange-400 fill-orange-400" /> {item.rating}
        </div>
        <div className="absolute bottom-3 left-3 bg-white/95 px-2 py-0.5 rounded text-[8px] font-black text-[#0D7377] uppercase tracking-tighter shadow-sm">
          {item.type}
        </div>
      </div>
      
      <div className="space-y-3 flex-grow">
         <h3 className="font-bold text-slate-800 line-clamp-1 text-sm">{item.title}</h3>
         <div className="flex justify-between items-center text-[10px]">
            <span className="text-[#0D7377] font-extrabold">{item.price}</span>
            <span className="text-slate-400 flex items-center gap-1 font-medium"><MapPin className="w-3 h-3" /> {item.loc.split(',')[0]}</span>
         </div>
         <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 mt-2">
            <p className="text-[10px] text-slate-500 italic leading-relaxed line-clamp-2">
              {item.reason ? `"${item.reason.substring(0, 100)}..."` : "Analyzing data..."}
            </p>
         </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button 
          onClick={() => router.push(`/item/${item.id}`)}
          className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-[#0D7377] transition-all"
        >
          View Details <ArrowRight className="w-3 h-3" />
        </button>
        <button onClick={onToggleSave} className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all ${isSaved ? "text-red-500 bg-red-50 border-red-100" : "text-slate-300 border-slate-100 hover:text-red-400"}`}>
          <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>
    </motion.div>
  );
}