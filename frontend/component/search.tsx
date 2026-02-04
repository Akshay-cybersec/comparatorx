"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Filter, Grid, List, Star, Heart, 
  ArrowUpDown, ChevronDown, Check, X, ArrowRight,
  ShieldCheck, Zap, SlidersHorizontal, Map as MapIcon
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

// --- Fonts ---
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

// --- Mock Data ---
const MOCK_RESULTS = Array.from({ length: 8 }).map((_, i) => ({
  id: `item-${i}`,
  title: i % 2 === 0 ? "Dr. Ayesha Dental Clinic" : "Samsung Galaxy S24 Ultra",
  category: i % 2 === 0 ? "Service" : "Product",
  rating: 4.8,
  reviews: 124 + i * 10,
  price: 500 + i * 50,
  originalPrice: i % 3 === 0 ? 800 + i * 50 : null,
  distance: 0.8 + i * 0.5,
  available: i % 4 !== 0,
  image: i % 2 === 0 ? "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=200" : "https://images.unsplash.com/photo-1610945265078-38584e26903b?auto=format&fit=crop&q=80&w=200",
  badges: i === 0 ? ["Best Value", "Verified"] : i === 1 ? ["Trending"] : ["Verified"],
  source: i % 2 === 0 ? "Practo" : "Amazon",
  features: ["Instant Booking", "Video Consult"]
}));

export default function SearchResultsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const toggleSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(prev => prev.filter(item => item !== id));
    } else {
      if (selectedItems.length < 4) setSelectedItems(prev => [...prev, id]);
    }
  };

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-slate-900 ${inter.className}`}>
      
      {/* --- 1. STICKY SEARCH HEADER --- */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Logo & Inputs */}
            <div className="flex flex-1 w-full gap-4 items-center">
              <div className={`text-2xl font-bold text-[#0D7377] hidden md:block ${dmSans.className}`}>Ranger.</div>
              
              {/* Search Box */}
              <div className="flex flex-1 items-center bg-slate-100 rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#0D7377] focus-within:bg-white transition-all">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  defaultValue="Dentist"
                  className="bg-transparent border-none outline-none w-full ml-3 text-slate-900 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Location Box */}
              <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-4 py-2.5 w-64 border border-transparent focus-within:border-[#0D7377] focus-within:bg-white transition-all">
                <MapPin className="w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  defaultValue="Mumbai, India"
                  className="bg-transparent border-none outline-none w-full ml-3 text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Toggles & Mobile Menu */}
            <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
               {["Products", "Services", "Professionals"].map((cat, i) => (
                 <button 
                   key={cat}
                   className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${i === 1 ? 'bg-[#0D7377] text-white shadow-lg shadow-[#0D7377]/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                 >
                   {cat}
                 </button>
               ))}
               <button 
                 onClick={() => setIsMobileFilterOpen(true)}
                 className="lg:hidden ml-auto p-2 bg-slate-100 rounded-lg text-slate-600"
               >
                 <SlidersHorizontal className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6 flex gap-8">
        
        {/* --- 2. FILTER SIDEBAR (Desktop) --- */}
        <aside className="hidden lg:block w-72 flex-shrink-0 space-y-8 h-[calc(100vh-100px)] overflow-y-auto sticky top-24 pb-20 custom-scrollbar">
           <FilterSection />
        </aside>

        {/* --- Mobile Drawer for Filters --- */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsMobileFilterOpen(false)}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              />
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                className="fixed inset-y-0 right-0 w-80 bg-white z-50 shadow-2xl p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-6 h-6" /></button>
                </div>
                <FilterSection />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- 3. MAIN RESULTS AREA --- */}
        <main className="flex-1 min-w-0">
           
           {/* Results Header */}
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className={`text-2xl font-bold text-slate-900 ${dmSans.className}`}>
                  Found 47 results for "Dentist"
                </h1>
                <p className="text-slate-500 text-sm mt-1">Showing 1-12 of 47</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <div className="relative group flex-1 sm:flex-none">
                    <button className="flex items-center justify-between w-full sm:w-48 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:border-[#0D7377] transition-colors">
                       <span>Sort: Best Match</span>
                       <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                    {/* Dropdown would go here */}
                 </div>
                 
                 <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                    <button 
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#0D7377]/10 text-[#0D7377]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#0D7377]/10 text-[#0D7377]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           </div>

           {/* Results Grid */}
           {isLoading ? (
             <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
               {[1,2,3,4,5,6].map(n => <SkeletonCard key={n} viewMode={viewMode} />)}
             </div>
           ) : (
             <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
               {MOCK_RESULTS.map((item) => (
                 <ResultCard 
                   key={item.id} 
                   data={item} 
                   viewMode={viewMode}
                   isSelected={selectedItems.includes(item.id)}
                   onSelect={() => toggleSelection(item.id)}
                 />
               ))}
             </div>
           )}

           {/* Pagination */}
           <div className="mt-12 flex justify-center">
              <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                Load More Results
              </button>
           </div>

        </main>
      </div>

      {/* --- 4. FLOATING COMPARE BAR --- */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 px-4 py-4 md:py-6"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
               <div className="flex items-center gap-4 md:gap-8 overflow-x-auto">
                 <div className="hidden md:block">
                   <p className="font-bold text-slate-900">Compare</p>
                   <p className="text-xs text-slate-500">{selectedItems.length} selected</p>
                 </div>
                 
                 {/* Thumbnails */}
                 <div className="flex gap-3">
                   {selectedItems.map((id, idx) => (
                     <div key={id} className="relative w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-lg border border-slate-200 flex-shrink-0">
                        {/* Simulate image */}
                        <div className="absolute -top-2 -right-2 bg-white rounded-full cursor-pointer hover:bg-red-50" onClick={() => toggleSelection(id)}>
                          <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
                        </div>
                     </div>
                   ))}
                   {selectedItems.length < 4 && (
                     <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                       Add
                     </div>
                   )}
                 </div>
               </div>

               <div className="flex gap-4">
                 <button 
                   onClick={() => setSelectedItems([])}
                   className="hidden md:block px-6 py-3 text-slate-500 font-bold hover:text-slate-800"
                 >
                   Clear All
                 </button>
                 <button className="px-6 md:px-8 py-3 bg-[#FF6B6B] hover:bg-[#ff5252] text-white rounded-xl font-bold shadow-lg shadow-[#FF6B6B]/20 transition-all flex items-center gap-2">
                   Compare Now <ArrowRight className="w-5 h-5" />
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- SUB COMPONENTS ---

function FilterSection() {
  return (
    <div className="space-y-8">
       {/* Category */}
       <div>
         <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            Category <ChevronDown className="w-4 h-4 text-slate-400" />
         </h3>
         <div className="space-y-2">
           {["General Dentist", "Orthodontist", "Cosmetic Dentistry", "Pediatric"].map(c => (
             <label key={c} className="flex items-center gap-3 cursor-pointer group">
               <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center group-hover:border-[#0D7377] transition-colors bg-white">
                 {/* Checkbox state logic would be here */}
               </div>
               <span className="text-slate-600 text-sm group-hover:text-[#0D7377]">{c}</span>
             </label>
           ))}
         </div>
       </div>

       {/* Price Slider */}
       <div>
         <h3 className="font-bold text-slate-900 mb-3">Price Range</h3>
         <div className="h-2 bg-slate-200 rounded-full mb-4 relative">
            <div className="absolute left-[20%] right-[40%] top-0 bottom-0 bg-[#0D7377] rounded-full" />
            <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#0D7377] rounded-full shadow cursor-pointer" />
            <div className="absolute right-[40%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#0D7377] rounded-full shadow cursor-pointer" />
         </div>
         <div className="flex items-center gap-3">
           <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1">
              <span className="text-xs text-slate-400">Min</span>
              <div className="font-bold text-sm">₹500</div>
           </div>
           <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1">
              <span className="text-xs text-slate-400">Max</span>
              <div className="font-bold text-sm">₹5000</div>
           </div>
         </div>
       </div>

       {/* Rating */}
       <div>
         <h3 className="font-bold text-slate-900 mb-3">Rating</h3>
         {[4,3,2].map(r => (
            <label key={r} className="flex items-center gap-3 mb-2 cursor-pointer">
               <div className="w-5 h-5 rounded border border-slate-300 bg-white" />
               <div className="flex items-center gap-1 text-slate-600 text-sm">
                 <div className="flex text-yellow-400">
                   {Array.from({length:5}).map((_,i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r ? 'fill-current' : 'text-slate-200'}`} />)}
                 </div>
                 <span>& Up</span>
               </div>
            </label>
         ))}
       </div>
       
       {/* Actions */}
       <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
         <button className="w-full py-3 bg-[#0D7377] text-white font-bold rounded-xl hover:bg-[#0a5e61] transition-colors">Apply Filters</button>
         <button className="w-full py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors">Clear All</button>
       </div>
    </div>
  );
}

function ResultCard({ data, viewMode, isSelected, onSelect }: any) {
  return (
    <div className={`
       bg-white border border-slate-200 rounded-2xl p-4 transition-all hover:border-[#0D7377]/50 hover:shadow-lg
       ${viewMode === 'list' ? 'flex gap-6' : 'flex flex-col'}
       ${isSelected ? 'ring-2 ring-[#0D7377] ring-offset-2' : ''}
    `}>
      {/* Thumbnail */}
      <div className={`
        relative bg-slate-100 rounded-xl overflow-hidden flex-shrink-0
        ${viewMode === 'list' ? 'w-48 h-full' : 'w-full aspect-[4/3] mb-4'}
      `}>
         {/* Badges */}
         <div className="absolute top-3 left-3 flex flex-col gap-2 items-start z-10">
           {data.badges.map((b: string) => (
             <span key={b} className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm ${
               b === 'Verified' ? 'bg-blue-500 text-white' : 
               b === 'Trending' ? 'bg-[#FF6B6B] text-white' : 
               'bg-emerald-500 text-white'
             }`}>
               {b.toUpperCase()}
             </span>
           ))}
         </div>
         {/* Like Button */}
         <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white text-slate-400 hover:text-red-500 transition-colors shadow-sm">
           <Heart className="w-4 h-4" />
         </button>
         
         <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
         {/* Source Tag */}
         <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Source: {data.source}</span>
            {viewMode === 'grid' && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                 <input type="checkbox" checked={isSelected} onChange={onSelect} className="accent-[#0D7377] w-4 h-4" />
                 <span className="text-xs font-bold text-slate-600">Compare</span>
              </label>
            )}
         </div>

         <h3 className={`font-bold text-slate-900 leading-tight mb-2 ${viewMode === 'list' ? 'text-xl' : 'text-lg'}`}>
           {data.title}
         </h3>

         {/* Rating Row */}
         <div className="flex items-center gap-2 mb-3">
           <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">
             {data.rating} <Star className="w-3 h-3 fill-amber-500" />
           </div>
           <span className="text-xs text-slate-400">({data.reviews} reviews)</span>
         </div>

         {/* Location & Status */}
         <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
               <MapPin className="w-4 h-4" /> {data.distance} km away • Bandra West
            </div>
            <div className="flex items-center gap-2 text-sm">
               <Zap className="w-4 h-4 text-emerald-500" /> 
               <span className={data.available ? "text-emerald-600 font-medium" : "text-red-500"}>
                 {data.available ? "Available Now" : "Closed"}
               </span>
            </div>
         </div>

         <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
               {data.originalPrice && <span className="text-xs text-slate-400 line-through block">₹{data.originalPrice}</span>}
               <div className="text-xl font-bold text-[#0D7377]">₹{data.price}</div>
            </div>
            
            <div className="flex gap-2">
               {viewMode === 'list' && (
                 <button 
                   onClick={onSelect}
                   className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all ${isSelected ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-600'}`}
                 >
                   {isSelected ? "Added" : "+ Compare"}
                 </button>
               )}
               <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                 View Details
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function SkeletonCard({ viewMode }: any) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-4 ${viewMode === 'list' ? 'flex gap-6' : ''}`}>
       <div className={`bg-slate-100 rounded-xl animate-pulse ${viewMode === 'list' ? 'w-48 h-full' : 'w-full h-48 mb-4'}`} />
       <div className="flex-1 space-y-3">
          <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse" />
          <div className="h-6 bg-slate-100 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse" />
          <div className="mt-6 h-10 bg-slate-100 rounded w-full animate-pulse" />
       </div>
    </div>
  );
}