'use client';

import React, { useState } from 'react';

// --- Types ---

type RetailerOffer = {
  id: string;
  siteName: string;
  brandColor: string; // Used for progress bars/accents
  siteLogoColor: string; 
  price: number;
  originalPrice: number;
  currency: string;
  deliveryDays: number;
  shippingCost: string;
  rating: number;
  totalReviews: number;
  seller: string;
  returnPolicy: string;
  inStock: boolean;
  isVerified: boolean;
  tags: string[];
  link: string;
};

// --- Mock Data ---

const productDetails = {
  name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
  brand: "Sony",
  imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
  specs: [
    { label: "Battery", value: "30 Hours" },
    { label: "Driver", value: "30mm" },
    { label: "Weight", value: "250g" },
    { label: "Connectivity", value: "BT 5.2" },
  ]
};

const offers: RetailerOffer[] = [
  {
    id: 'amz',
    siteName: 'Amazon',
    brandColor: '#FF9900', // Amazon Orange (for accents)
    siteLogoColor: 'bg-[#FF9900]',
    price: 24999,
    originalPrice: 29990,
    currency: '₹',
    deliveryDays: 1,
    shippingCost: 'Free',
    rating: 4.8,
    totalReviews: 12500,
    seller: 'Appario Retail',
    returnPolicy: '7 Days',
    inStock: true,
    isVerified: true,
    tags: ['Fastest Delivery', 'Ranger Choice'],
    link: '#',
  },
  {
    id: 'flp',
    siteName: 'Flipkart',
    brandColor: '#2874F0', // Flipkart Blue
    siteLogoColor: 'bg-[#2874F0]',
    price: 24499,
    originalPrice: 29990,
    currency: '₹',
    deliveryDays: 3,
    shippingCost: 'Free',
    rating: 4.5,
    totalReviews: 8200,
    seller: 'SuperComNet',
    returnPolicy: '7 Days',
    inStock: true,
    isVerified: true,
    tags: ['Best Price'],
    link: '#',
  },
  {
    id: 'mee',
    siteName: 'Meesho',
    brandColor: '#D61F69', // Meesho Pink
    siteLogoColor: 'bg-[#D61F69]',
    price: 23999,
    originalPrice: 29990,
    currency: '₹',
    deliveryDays: 7,
    shippingCost: '₹50',
    rating: 3.9,
    totalReviews: 450,
    seller: 'TechWorld Local',
    returnPolicy: 'No Returns',
    inStock: true,
    isVerified: false,
    tags: [],
    link: '#',
  },
];

// --- Icons ---
const Icons = {
  ShieldCheck: () => <svg className="w-4 h-4 text-[#0D7377]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  ShieldWarn: () => <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Star: () => <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  TrendUp: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Filter: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  ExternalLink: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Bell: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  Sparkles: () => <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Truck: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
  Check: () => <svg className="w-3 h-3 text-[#1C3F3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
  X: () => <svg className="w-3 h-3 text-[#5A3E2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>,
};

// --- Main Page ---

export default function ComparePage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [watchlist, setWatchlist] = useState(false);
  const [alert, setAlert] = useState(false);
  // Default to the first offer (Amazon)
  const [selectedRetailer, setSelectedRetailer] = useState<RetailerOffer>(offers[0]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-[#0D4B4E] selection:text-white">
      
      {/* Navbar Placeholder */}
      <nav className="h-14 border-b border-slate-200 flex items-center px-6 bg-white sticky top-0 z-50 shadow-sm">
        <span className="font-bold text-[#083D41] tracking-wider">RANGER</span>
        <span className="mx-3 text-slate-300">/</span>
        <span className="text-sm font-bold text-slate-700">Compare</span>
      </nav>

      {/* Main Grid Layout */}
      <div className="max-w-[1800px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* --- LEFT SIDEBAR: Product Model & Specs --- */}
        <aside className="lg:col-span-3 sticky top-24 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            
            <div className="aspect-square w-full relative bg-slate-100 group overflow-hidden">
               <img 
                 src={productDetails.imageUrl} 
                 alt={productDetails.name} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/20">
                 3D Ready
               </div>
               <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <p className="text-[#4CD9C0] text-xs font-bold tracking-widest uppercase mb-1">{productDetails.brand}</p>
                  <h1 className="text-white font-bold text-lg leading-tight shadow-black drop-shadow-md">{productDetails.name}</h1>
               </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3 border-b border-slate-100">
               <button 
                onClick={() => setWatchlist(!watchlist)}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${watchlist ? 'bg-[#083D41] text-white border-[#083D41]' : 'bg-white text-slate-500 border-slate-200 hover:border-[#083D41] hover:text-[#083D41]'}`}>
                  {watchlist ? 'Added' : 'Watchlist'}
               </button>
               <button 
                onClick={() => setAlert(!alert)}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${alert ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-800 hover:text-slate-800'}`}>
                  <Icons.Bell /> {alert ? 'Alert On' : 'Set Alert'}
               </button>
            </div>

            <div className="p-4">
              <div className="flex gap-4 mb-4 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
                {['Overview', 'Specs', 'Reviews', 'Price History'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs font-bold whitespace-nowrap pb-2 border-b-2 transition-colors ${activeTab === tab ? 'text-[#083D41] border-[#083D41]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="space-y-2">
                {productDetails.specs.map((spec, i) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500 font-medium">{spec.label}</span>
                    <span className="text-slate-900 font-bold font-mono">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* --- MIDDLE SECTION: Comparison Dashboard --- */}
        <main className="lg:col-span-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 rounded-xl p-3 shadow-sm gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-500"><Icons.Filter /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Sort By</p>
                  <select className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer">
                    <option>Lowest Price</option>
                    <option>Highest Trust</option>
                    <option>Fastest Delivery</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                {['Verified Only', 'In Stock', 'Free Delivery'].map(f => (
                  <button key={f} className="whitespace-nowrap px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 hover:bg-[#083D41]/10 hover:text-[#083D41] hover:border-[#083D41]/30 transition-all">
                    {f}
                  </button>
                ))}
              </div>
          </div>

          {/* RETAILER CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offers.map((offer) => {
                const isActive = selectedRetailer.id === offer.id;
                // Dynamic styling for active card
                const cardStyle = isActive 
                    ? { borderColor: offer.brandColor, boxShadow: `0 0 0 1px ${offer.brandColor}` }
                    : {};

                return (
                    <div 
                        key={offer.id}
                        onClick={() => setSelectedRetailer(offer)} 
                        style={cardStyle}
                        className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 cursor-pointer group
                        ${isActive ? 'bg-white shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                    >
                    <div className="absolute -top-3 left-4 flex gap-2">
                        {offer.tags.map(tag => (
                        <span key={tag} className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border shadow-sm
                            ${tag.includes('Ranger') 
                                ? 'bg-[#083D41] text-white border-[#083D41]' 
                                : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                            {tag}
                        </span>
                        ))}
                    </div>

                    <div className="flex justify-between items-start mt-2 mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${offer.siteLogoColor} flex items-center justify-center text-[10px] font-bold text-white shadow-md`}>
                                {offer.siteName[0]}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 leading-tight">{offer.siteName}</h3>
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <span className="flex items-center text-amber-500 font-bold">
                                        {offer.rating} <Icons.Star />
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span>{offer.totalReviews.toLocaleString()} revs</span>
                                </div>
                            </div>
                        </div>
                        {isActive && (
                             <span style={{ backgroundColor: offer.brandColor }} className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full shadow-sm">
                                Selected
                             </span>
                        )}
                    </div>

                    <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">{offer.currency}{offer.price.toLocaleString()}</span>
                        <span className="text-sm text-slate-400 line-through font-medium">{offer.currency}{offer.originalPrice.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                        {offer.deliveryDays === 1 ? '⚡ One-Day Delivery' : `🚚 Delivers in ${offer.deliveryDays} days`} • {offer.shippingCost}
                        </p>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                            Compare
                        </button>
                        <button 
                            style={{ backgroundColor: isActive ? offer.brandColor : '#083D41' }}
                            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold text-white shadow-md transition-colors hover:brightness-90`}>
                            Visit Site <Icons.ExternalLink />
                        </button>
                    </div>
                    </div>
                );
              })}
              
              <div className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:text-[#083D41] hover:border-[#083D41]/50 hover:bg-[#083D41]/5 transition-all cursor-pointer min-h-[300px]">
                 <span className="text-4xl mb-2 font-light">+</span>
                 <span className="text-sm font-bold">Compare another URL</span>
              </div>
          </div>

          {/* Bottom Summary Section */}
          <div className="bg-[#083D41] rounded-2xl p-6 shadow-xl shadow-[#083D41]/10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

              <div className="flex items-center justify-between mb-4 relative z-10">
                 <h3 className="font-bold text-white">Ranger Analysis</h3>
                 <span className="text-xs text-emerald-100 font-bold bg-white/20 px-2 py-1 rounded border border-white/20">Live Data</span>
              </div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-lg text-white"><Icons.TrendUp /></div>
                <div>
                  <p className="text-sm text-emerald-50 leading-relaxed font-medium">
                    The best price is currently on <strong className="text-white">Meesho</strong> (₹23,999), but it comes with a lower trust score. 
                    For the best balance, Ranger recommends <strong className="text-white">Flipkart</strong>.
                  </p>
                  <div className="mt-4 w-full h-16 bg-black/20 rounded-lg relative overflow-hidden flex items-end px-2 gap-1 border border-white/10">
                    {[40, 60, 45, 70, 50, 65, 55, 80, 75, 60, 40].map((h, i) => (
                      <div key={i} className="flex-1 bg-white/40 hover:bg-white rounded-t-sm transition-all" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <p className="text-[10px] text-emerald-100/70 mt-2 text-right">30-Day Price Trend</p>
                </div>
              </div>
          </div>

        </main>

        {/* --- RIGHT SIDEBAR: AI REVIEW INTELLIGENCE --- */}
        <aside className="lg:col-span-3 sticky top-24 h-[calc(100vh-8rem)] flex flex-col">
          {/* Main Background set to Dark Teal (#053B3E) */}
          <div className="flex-1 bg-[#053B3E] border border-[#0A4F52] rounded-2xl overflow-hidden flex flex-col shadow-2xl text-white transition-colors duration-500">
            
            {/* AI Header - Clean dark teal header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#08484B]">
              <div className="flex items-center gap-2">
                <div 
                    style={{ backgroundColor: selectedRetailer.brandColor }}
                    className="p-1.5 rounded text-white shadow-[0_0_10px_currentColor] transition-colors duration-300"
                >
                  <Icons.Sparkles />
                </div>
                <div>
                    <h3 className="text-xs font-bold text-[#6CBEC3] uppercase tracking-wider">Review Intel</h3>
                    <h2 className="text-sm font-bold text-white">{selectedRetailer.siteName}</h2>
                </div>
              </div>
            </div>

            {/* Analysis Dashboard */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
               
               {/* 1. Summary Score */}
               <div className="mb-6">
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-xs text-[#8FB9BC] font-bold uppercase">Consolidated Sentiment</span>
                   <span className="text-2xl font-black text-[#4CD9C0] transition-colors">
                       {Math.round(selectedRetailer.rating * 20)}<span className="text-sm text-[#8FB9BC] font-normal">/100</span>
                   </span>
                 </div>
                 <div className="w-full bg-[#0A2A2C] rounded-full h-2 overflow-hidden">
                   {/* Progress bar gradient: Teal to Orange if Amazon, else uses brand color */}
                   <div 
                        style={{ background: `linear-gradient(90deg, #4CD9C0, ${selectedRetailer.brandColor})`, width: `${selectedRetailer.rating * 20}%` }}
                        className="h-full shadow-[0_0_10px_#4CD9C0] transition-all duration-500"
                   ></div>
                 </div>
               </div>

               {/* --- SECTION: SHIPPING REALITY CHECK --- */}
               <div className="bg-[#082F31] border border-[#0E5458] rounded-xl p-4 mb-6 relative overflow-hidden">
                 <div className="flex items-center gap-2 mb-3">
                    <div style={{ color: selectedRetailer.brandColor }}><Icons.Truck /></div>
                    <h4 className="text-xs font-bold text-[#FF9900] uppercase tracking-wide">Shipping Reality</h4>
                 </div>
                 
                 {/* Visual Bar: Late vs Early */}
                 <div className="relative h-2 bg-[#052022] rounded-full mb-2">
                    {/* The Bar - Gradient Cyan to Orange */}
                    <div 
                        className="absolute top-0 bottom-0 left-[10%] right-[30%] rounded-full opacity-90"
                        style={{ background: `linear-gradient(90deg, #22D3EE, #F97316)` }}
                    ></div>
                    {/* The Marker */}
                    <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)] border-2 border-[#082F31]"></div>
                 </div>
                 <div className="flex justify-between text-[9px] text-[#5A7D80] uppercase font-bold mb-3">
                    <span>Too Long</span>
                    <span className="text-white">Usually Early</span>
                 </div>

                 <p className="text-[11px] text-[#A6C8CB] leading-snug border-t border-[#134E52] pt-2">
                   "Most users on <strong className="text-[#4CD9C0]">{selectedRetailer.siteName}</strong> report delivery is {selectedRetailer.deliveryDays <= 3 ? 'surprisingly fast' : 'average speed'} for this pincode."
                 </p>
               </div>

               {/* 2. Pros & Cons */}
               <div className="grid grid-cols-1 gap-2 mb-6">
                 {/* Pros Card - Dark Cyan Background */}
                 <div className="bg-[#0D4B4E] border border-[#14666B] rounded-lg p-3">
                   <h4 className="text-[10px] font-bold text-[#4CD9C0] uppercase mb-2 flex items-center gap-1"><Icons.Check /> Top Pros</h4>
                   <ul className="text-[11px] text-[#CCECE9] space-y-1 ml-1">
                     <li>• World-class ANC</li>
                     <li>• 30h Battery Life verified</li>
                   </ul>
                 </div>
                 {/* Cons Card - Darker/Warmer Background for contrast */}
                 <div className="bg-[#0F292D] border border-[#F97316]/30 rounded-lg p-3">
                   <h4 className="text-[10px] font-bold text-[#F97316] uppercase mb-2 flex items-center gap-1"><Icons.X /> Top Complaints</h4>
                   <ul className="text-[11px] text-[#E0D3C9] space-y-1 ml-1">
                     <li>• Ears get warm (Summer)</li>
                     <li>• No folding hinge</li>
                   </ul>
                 </div>
               </div>

            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}