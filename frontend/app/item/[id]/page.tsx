'use client';

import React, { useState } from 'react';


type RetailerOffer = {
  id: string;
  siteName: string;
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

const productDetails = {
  name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
  brand: "Sony",
  // CHANGED: Light, clean gradient instead of dark
  imageGradient: "bg-gradient-to-br from-slate-100 via-white to-slate-200",
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
    siteLogoColor: 'bg-[#FF9900]', // Amazon Orange
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
    siteLogoColor: 'bg-[#2874F0]', // Flipkart Blue
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
    siteLogoColor: 'bg-[#D61F69]', // Meesho Pink
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

// --- Icons (Updated Colors for Light Theme) ---
const Icons = {
  ShieldCheck: () => <svg className="w-4 h-4 text-[#0D7377]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  ShieldWarn: () => <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Star: () => <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  TrendUp: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Bot: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Send: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Filter: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  ExternalLink: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Bell: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
};

// --- Reusable Components ---

const RetailerCard = ({ offer }: { offer: RetailerOffer }) => {
  const discount = Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100);

  return (
    // CHANGED: bg-white, border-slate-200, shadow-sm, text-slate-900
    <div className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 group
      ${offer.tags.includes('Ranger Choice') 
        ? 'bg-white border-[#0D7377] shadow-[0_0_15px_rgba(13,115,119,0.15)] ring-1 ring-[#0D7377]/20' 
        : 'bg-white border-slate-200 hover:border-[#0D7377]/50 hover:shadow-md'}`}
    >
      
      {/* Badges */}
      <div className="absolute -top-3 left-4 flex gap-2">
        {offer.tags.map(tag => (
          // CHANGED: Teal/Coral accents
          <span key={tag} className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border shadow-sm
            ${tag.includes('Ranger') 
                ? 'bg-[#0D7377] text-white border-[#0D7377]' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
            {tag}
          </span>
        ))}
      </div>

      {/* Header: Logo & Title */}
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
        {/* Verification Badge */}
        <div className="flex flex-col items-end">
           {offer.isVerified ? (
             <span className="flex items-center gap-1 text-[10px] text-[#0D7377] font-bold bg-[#0D7377]/10 px-1.5 py-0.5 rounded border border-[#0D7377]/20">
               <Icons.ShieldCheck /> Verified
             </span>
           ) : (
             <span className="flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
               <Icons.ShieldWarn /> Unverified
             </span>
           )}
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{offer.currency}{offer.price.toLocaleString()}</span>
          <span className="text-sm text-slate-400 line-through font-medium">{offer.currency}{offer.originalPrice.toLocaleString()}</span>
          <span className="text-xs font-bold text-[#FF6B6B]">({discount}% OFF)</span>
        </div>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {offer.deliveryDays === 1 ? '⚡ One-Day Delivery' : `🚚 Delivers in ${offer.deliveryDays} days`} • {offer.shippingCost}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-500 mb-5 pb-5 border-b border-slate-100">
        <div className="flex justify-between">
          <span>Seller:</span> <span className="text-slate-700 font-medium truncate max-w-[80px]">{offer.seller}</span>
        </div>
        <div className="flex justify-between">
          <span>Return:</span> <span className={offer.returnPolicy === 'No Returns' ? 'text-red-500 font-bold' : 'text-slate-700 font-medium'}>{offer.returnPolicy}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
           Add to Compare
        </button>
        <button className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all
          ${offer.id === 'mee' ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-[#0D7377] hover:bg-[#0a5c5f] text-white shadow-md shadow-[#0D7377]/20'}`}>
           Visit Site <Icons.ExternalLink />
        </button>
      </div>
    </div>
  );
};

const ChatMessage = ({ text, isUser }: { text: string; isUser?: boolean }) => (
  <div className={`flex w-full mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed border font-medium ${
      isUser 
        ? 'bg-slate-100 border-slate-200 text-slate-700 rounded-br-none' 
        : 'bg-[#0D7377]/10 border-[#0D7377]/20 text-[#0D7377] rounded-bl-none'
    }`}>
      {text}
    </div>
  </div>
);

// --- Main Page Component ---

export default function ComparePage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [watchlist, setWatchlist] = useState(false);
  const [alert, setAlert] = useState(false);

  return (
    // CHANGED: bg-neutral-950 -> bg-[#F8F9FA] (Light Background)
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-[#FF6B6B] selection:text-white">
      
      {/* Navbar Placeholder */}
      <nav className="h-14 border-b border-slate-200 flex items-center px-6 bg-white sticky top-0 z-50 shadow-sm">
        <span className="font-bold text-[#0D7377] tracking-wider">RANGER</span>
        <span className="mx-3 text-slate-300">/</span>
        <span className="text-sm font-bold text-slate-700">Compare</span>
      </nav>

      {/* Main Grid Layout */}
      <div className="max-w-[1800px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* --- LEFT SIDEBAR: Product Model & Specs --- */}
        <aside className="lg:col-span-3 sticky top-24 space-y-4">
          
          {/* Product Preview Card */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* 3D Model Placeholder */}
            <div className={`aspect-square w-full relative group ${productDetails.imageGradient}`}>
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center">
                    <div className="text-4xl font-black text-slate-300/50 tracking-widest">3D VIEW</div>
                    <button className="mt-2 text-xs bg-white/50 hover:bg-white/80 backdrop-blur px-3 py-1 rounded-full text-slate-700 border border-white/50 transition-colors font-bold shadow-sm">
                      Rotate Model
                    </button>
                 </div>
               </div>
               {/* Overlay Info */}
               <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/10 to-transparent">
                  <p className="text-[#0D7377] text-xs font-bold tracking-widest uppercase mb-1">{productDetails.brand}</p>
                  <h1 className="text-slate-800 font-bold text-lg leading-tight">{productDetails.name}</h1>
               </div>
            </div>

            {/* Actions */}
            <div className="p-4 grid grid-cols-2 gap-3 border-b border-slate-100">
               <button 
                onClick={() => setWatchlist(!watchlist)}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${watchlist ? 'bg-[#FF6B6B] text-white border-[#FF6B6B]' : 'bg-white text-slate-500 border-slate-200 hover:border-[#FF6B6B] hover:text-[#FF6B6B]'}`}>
                  {watchlist ? 'Added' : 'Watchlist'}
               </button>
               <button 
                onClick={() => setAlert(!alert)}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${alert ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-800 hover:text-slate-800'}`}>
                  <Icons.Bell /> {alert ? 'Alert On' : 'Set Alert'}
               </button>
            </div>

            {/* Tabs & Specs */}
            <div className="p-4">
              <div className="flex gap-4 mb-4 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
                {['Overview', 'Specs', 'Reviews', 'Price History'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs font-bold whitespace-nowrap pb-2 border-b-2 transition-colors ${activeTab === tab ? 'text-[#0D7377] border-[#0D7377]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
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
          
          {/* Filter Bar */}
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
                 <button key={f} className="whitespace-nowrap px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 hover:bg-[#0D7377]/10 hover:text-[#0D7377] hover:border-[#0D7377]/30 transition-all">
                   {f}
                 </button>
               ))}
             </div>
          </div>

          {/* RETAILER CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {offers.map((offer) => (
               <RetailerCard key={offer.id} offer={offer} />
             ))}
             
             {/* Dynamic "Add More" Placeholder */}
             <div className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:text-[#0D7377] hover:border-[#0D7377]/50 hover:bg-[#0D7377]/5 transition-all cursor-pointer min-h-[300px]">
                <span className="text-4xl mb-2 font-light">+</span>
                <span className="text-sm font-bold">Compare another URL</span>
             </div>
          </div>

          {/* Bottom Summary Section */}
          <div className="bg-[#0D7377] rounded-2xl p-6 shadow-xl shadow-[#0D7377]/10 text-white relative overflow-hidden">
             {/* Decorative Circle */}
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
                   {/* Fake Chart Bars */}
                   {[40, 60, 45, 70, 50, 65, 55, 80, 75, 60, 40].map((h, i) => (
                     <div key={i} className="flex-1 bg-white/40 hover:bg-white rounded-t-sm transition-all" style={{ height: `${h}%` }}></div>
                   ))}
                 </div>
                 <p className="text-[10px] text-emerald-100/70 mt-2 text-right">30-Day Price Trend</p>
               </div>
             </div>
          </div>

        </main>

        {/* --- RIGHT SIDEBAR: AI Assistant --- */}
        <aside className="lg:col-span-3 sticky top-24 h-[calc(100vh-8rem)] flex flex-col">
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-lg">
            
            {/* AI Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <div className="bg-[#0D7377] p-2 rounded-lg text-white shadow-md shadow-[#0D7377]/20">
                <Icons.Bot />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Ranger Assistant</h3>
                <p className="text-[10px] text-[#0D7377] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#0D7377] rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
               <ChatMessage text="I've analyzed the listings. Do you prioritize speed or price?" />
               <ChatMessage text="Price, but I don't trust unverified sellers." isUser />
               <ChatMessage text="Understood. Based on that, Flipkart is your best option. It is ₹500 cheaper than Amazon and is a Verified Seller." />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 pb-2 bg-white">
              <div className="flex flex-wrap gap-2">
                {['Is Meesho safe?', 'Price history?', 'Alternatives?'].map(txt => (
                  <button key={txt} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 font-bold px-2 py-1.5 rounded-lg hover:bg-[#0D7377] hover:text-white hover:border-[#0D7377] transition-colors">
                    {txt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ask about this product..." 
                  className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-10 py-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#0D7377] focus:ring-1 focus:ring-[#0D7377]"
                />
                <button className="absolute right-2 top-2.5 text-[#0D7377] p-1 hover:bg-[#0D7377]/10 rounded transition-colors">
                  <Icons.Send />
                </button>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
}