"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // Added for routing
import { 
  LayoutDashboard, 
  Smartphone, 
  Stethoscope, 
  Utensils, 
  Search, 
  Bell, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  MapPin, 
  Star, 
  X,
  Plus,
  Heart,
  History,
  ArrowLeft 
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

// --- Fonts ---
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

// --- Mock Data ---
const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "saved", label: "Saved Items", icon: <Heart className="w-5 h-5" /> },
  { id: "history", label: "History", icon: <History className="w-5 h-5" /> },
];

const SEARCH_FILTERS = [
  { id: "all", label: "All", icon: null },
  { id: "gadget", label: "Gadgets", icon: <Smartphone className="w-4 h-4" /> },
  { id: "doctor", label: "Doctors", icon: <Stethoscope className="w-4 h-4" /> },
  { id: "food", label: "Food", icon: <Utensils className="w-4 h-4" /> },
];

const MOCK_ITEMS = [
  { id: 1, type: "gadget", title: "iPhone 15 Pro", price: "₹1,34,900", rating: 4.8, loc: "Amazon", img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&auto=format&fit=crop&q=60" },
  { id: 2, type: "gadget", title: "Samsung S24 Ultra", price: "₹1,29,999", rating: 4.7, loc: "Flipkart", img: "https://images.unsplash.com/photo-1610945265078-38584e26903b?w=400&auto=format&fit=crop&q=60" },
  { id: 3, type: "doctor", title: "Dr. Anjali Mehta", price: "₹1,500/visit", rating: 4.9, loc: "Bandra West", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60" },
  { id: 4, type: "food", title: "Pizza By The Bay", price: "₹800 for two", rating: 4.5, loc: "Marine Drive", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=60" },
  { id: 5, type: "gadget", title: "MacBook Air M2", price: "₹99,900", rating: 4.9, loc: "Croma", img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&auto=format&fit=crop&q=60" },
  { id: 6, type: "doctor", title: "Smile Care Dental", price: "₹500/consult", rating: 4.6, loc: "Andheri East", img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&auto=format&fit=crop&q=60" },
  { id: 7, type: "food", title: "Blue Tokai Coffee", price: "₹600 for two", rating: 4.8, loc: "Fort", img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&auto=format&fit=crop&q=60" },
  { id: 8, type: "gadget", title: "Sony WH-1000XM5", price: "₹26,990", rating: 4.8, loc: "Amazon", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&auto=format&fit=crop&q=60" },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  
  // Saved Items State
  const [savedIds, setSavedIds] = useState<number[]>([]);

  // Function to toggle saved state
  const toggleSave = (id: number) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter Logic (Search + Category)
  const filteredItems = useMemo(() => {
    return MOCK_ITEMS.filter((item) => {
      const matchesType = selectedType === "all" || item.type === selectedType;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(query) || 
        item.loc.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query);

      return matchesType && matchesSearch;
    });
  }, [selectedType, searchQuery]);

  // View Logic (Overview vs Saved Items)
  const displayedItems = useMemo(() => {
    if (activeNav === 'saved') {
      return filteredItems.filter(item => savedIds.includes(item.id));
    }
    return filteredItems;
  }, [activeNav, filteredItems, savedIds]);

  return (
    <div className={`h-screen w-full bg-[#F3F4F6] text-[#2B2D42] ${inter.className} flex overflow-hidden`}>
      
      {/* --- 1. SIDEBAR --- */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="h-full bg-white border-r border-slate-200 z-20 flex flex-col relative shadow-xl shadow-slate-200/50"
      >
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:text-[#0D7377] transition-colors z-30"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <div className={`h-20 flex items-center ${sidebarOpen ? "px-6" : "justify-center"} border-b border-slate-100`}>
          <div className="w-8 h-8 bg-[#0D7377] rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
            C
          </div>
          {sidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className={`ml-3 text-xl font-bold tracking-tight text-[#0D7377] ${dmSans.className}`}
            >
              ComparatorX
            </motion.span>
          )}
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all relative group ${
                activeNav === item.id 
                  ? "bg-[#0D7377]/10 text-[#0D7377]" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              } ${!sidebarOpen && "justify-center"}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="ml-3 font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              {activeNav === item.id && (
                <motion.div layoutId="activeNav" className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#0D7377]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
           <button className={`w-full flex items-center p-3 rounded-xl text-slate-500 hover:bg-slate-50 ${!sidebarOpen && "justify-center"}`}>
             <Settings className="w-5 h-5" />
             {sidebarOpen && <span className="ml-3 font-medium">Settings</span>}
           </button>
           <div className={`flex items-center gap-3 mt-4 ${!sidebarOpen && "justify-center"}`}>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B6B] to-[#FF8E8E] flex items-center justify-center text-white text-xs font-bold shrink-0">
               JD
             </div>
             {sidebarOpen && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-bold truncate">John Doe</p>
                 <p className="text-xs text-slate-400 truncate">Pro Member</p>
               </div>
             )}
           </div>
        </div>
      </motion.aside>

      {/* --- 2. MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        
        {/* Header & Search */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 sticky top-0">
           <div className="px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full max-w-3xl flex flex-col gap-3">
                 <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Search for iPhone, Dentists, Pizza..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-[#0D7377] border-2 rounded-2xl outline-none transition-all placeholder:text-slate-400 font-medium shadow-sm"
                    />
                 </div>

                 <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {SEARCH_FILTERS.map(filter => (
                       <button
                         key={filter.id}
                         onClick={() => {
                           setSelectedType(filter.id);
                           setSearchQuery(""); 
                         }}
                         className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                            selectedType === filter.id 
                            ? "bg-[#0D7377] text-white border-[#0D7377] shadow-md shadow-[#0D7377]/20" 
                            : "bg-white text-slate-600 border-slate-200 hover:border-[#0D7377]/50"
                         }`}
                       >
                          {filter.icon}
                          {filter.label}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <button className="relative p-2 text-slate-400 hover:text-[#0D7377] transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B6B] rounded-full border border-white" />
                </button>
                <button 
                  onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium transition-colors ${
                    filterDrawerOpen ? "bg-[#0D7377] text-white border-[#0D7377]" : "bg-white border-slate-200 text-slate-600 hover:border-[#0D7377]"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Advanced
                </button>
                
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                </button>
              </div>
           </div>
        </header>

        {/* Content Grid */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
           <div className="flex justify-between items-end mb-6">
              <div>
                <h1 className={`${dmSans.className} text-3xl font-bold text-[#2B2D42]`}>
                  {activeNav === 'saved' ? 'My Saved Items' : (
                    selectedType === 'all' 
                      ? (searchQuery ? `Results for "${searchQuery}"` : 'Discover Everything') 
                      : `${SEARCH_FILTERS.find(f => f.id === selectedType)?.label}`
                  )}
                </h1>
                <p className="text-slate-500 mt-1">Showing {displayedItems.length} results.</p>
              </div>
           </div>

           <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
           >
             <AnimatePresence mode="popLayout">
               {displayedItems.length > 0 ? (
                 displayedItems.map((item) => (
                   <ItemCard 
                     key={item.id} 
                     item={item} 
                     isSaved={savedIds.includes(item.id)}
                     onToggleSave={() => toggleSave(item.id)}
                   />
                 ))
               ) : (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }}
                   className="col-span-full py-20 text-center text-slate-400"
                 >
                   {activeNav === 'saved' ? (
                     <>
                        <Heart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="text-lg font-medium">No saved items yet.</p>
                        <p className="text-sm">Browse items and click the heart icon to save them.</p>
                     </>
                   ) : (
                     <>
                        <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="text-lg font-medium">No items found matching your search.</p>
                        <button onClick={() => {setSearchQuery(""); setSelectedType("all")}} className="mt-2 text-[#0D7377] underline">Clear Filters</button>
                     </>
                   )}
                 </motion.div>
               )}
             </AnimatePresence>
           </motion.div>
        </main>
      </div>

      {/* --- 3. ADVANCED FILTER DRAWER --- */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-80 h-full bg-white border-l border-slate-200 shadow-2xl absolute right-0 top-0 z-30 flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className={`${dmSans.className} text-xl font-bold`}>Advanced Filters</h3>
              <button onClick={() => setFilterDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-8 overflow-y-auto flex-1">
               <div>
                  <label className="text-sm font-bold text-slate-700 mb-3 block">Price Range</label>
                  <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0D7377]" />
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Low</span>
                    <span>High</span>
                  </div>
               </div>
               <div>
                  <label className="text-sm font-bold text-slate-700 mb-3 block">Availability</label>
                  <div className="space-y-2">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0D7377] focus:ring-[#0D7377]" defaultChecked />
                        <span className="text-sm text-slate-600">In Stock / Available Now</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0D7377] focus:ring-[#0D7377]" />
                        <span className="text-sm text-slate-600">Pre-order / Booking</span>
                     </label>
                  </div>
               </div>
               <div>
                  <label className="text-sm font-bold text-slate-700 mb-3 block">Distance Radius</label>
                  <div className="flex gap-2 flex-wrap">
                     {['5km', '10km', '25km', '50km+'].map(dist => (
                       <button key={dist} className="px-3 py-1 text-xs font-medium border border-slate-200 rounded-full hover:bg-[#0D7377] hover:text-white transition-colors">
                         {dist}
                       </button>
                     ))}
                  </div>
               </div>
            </div>
            <div className="p-6 border-t border-slate-100">
               <button className="w-full py-3 bg-[#0D7377] text-white rounded-xl font-bold hover:bg-[#095558] transition-colors">
                 Apply Filters
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- Sub-Component: Item Card ---
interface ItemCardProps {
  item: any;
  isSaved: boolean;
  onToggleSave: () => void;
}

function ItemCard({ item, isSaved, onToggleSave }: ItemCardProps) {
  const router = useRouter(); // Initialize router

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#0D7377]/10 transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
           <Star className="w-3 h-3 text-orange-400 fill-orange-400" /> {item.rating}
        </div>
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium text-white capitalize">
           {item.type}
        </div>
      </div>

      <div className="space-y-2 flex-grow">
         <h3 className={`${dmSans.className} font-bold text-lg text-[#2B2D42] truncate`}>{item.title}</h3>
         
         <div className="flex justify-between items-center">
            <span className="text-[#FF6B6B] font-bold">{item.price}</span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
               <MapPin className="w-3 h-3" /> {item.loc}
            </div>
         </div>
      </div>

      <div className="mt-4 flex gap-2">
        {/* Updated button to link to item/[id]/page.tsx */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering card hover/click if applicable
            router.push(`/item/${item.id}`);
          }}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 group-hover:bg-[#0D7377] group-hover:text-white group-hover:border-[#0D7377] transition-all flex items-center justify-center gap-2"
        >
           Add to Compare <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className={`w-12 h-10.5 flex items-center justify-center rounded-xl border transition-colors ${
            isSaved 
            ? "bg-red-50 border-red-200 text-[#FF6B6B]" 
            : "border-slate-200 text-slate-400 hover:text-[#FF6B6B] hover:border-[#FF6B6B]"
          }`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? "fill-[#FF6B6B]" : ""}`} />
          //heartpage
        </button>
      </div>
    </motion.div>
  );
}