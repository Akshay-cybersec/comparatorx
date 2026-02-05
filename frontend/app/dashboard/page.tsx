"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Search, ChevronLeft, ChevronRight, SlidersHorizontal, 
  MapPin, Star, X, Heart, History, Navigation, ArrowLeft, Mic, 
  GitCompare, Youtube, MessageSquare, CheckCircle2, TrendingUp, Globe, Activity, ArrowRight,
  MessageCircle, User, Clock, Sparkles, Trophy, Quote, Bot, Send, ShoppingBag, Target, BrainCircuit, ExternalLink
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
  { "id": "ChIJwZEqFuqAhYARni9P_qStdco", "name": "Rupsa R. Yee, M.D.", "rating": 4.8, "user_ratings_total": 95, "address": "1100 Van Ness Avenue, San Francisco", "distance": 0.012, "score": 107.39, "open_now": true, "category": "doctor", "price": 180, "reason": "High rating, very close to you, currently open", "img": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400" }
];

// --- 2. HARDCODED AI BOT RESPONSE ---
const MOCK_AI_RESPONSE = {
  "ai_used": true,
  "ai_model": "zero-shot-transformer",
  "ai_enhanced": true,
  "intent": "product_search",
  "confidence": 0.28824097514152525,
  "entities": {
    "product": "dress",
    "size": "age 2-4 years",
    "color": "black",
    "brand": null,
    "gender": "kids"
  },
  "query_used": "kids dress size age 2-4 years black buy online",
  "reasoning": "Ranked by ecommerce domain preference and matches for product, color, size, and brand.",
  "results": [
    {
      "title": "TEEVOS Girls Black Cotton Blend Frock",
      "link": "https://www.amazon.in",
      "snippet": "Amazon.in",
      "price": "₹899"
    },
    {
      "title": "Superminis Sleeveless Cotton Dress",
      "link": "https://www.nykaafashion.com",
      "snippet": "Nykaa Fashion",
      "price": "₹1,250"
    },
    {
      "title": "YK Kids- Girls Flutter Sleeve Dress",
      "link": "https://www.myntra.com",
      "snippet": "Myntra",
      "price": "₹749"
    }
  ]
};

const DETAILED_MAPPING: Record<string, any> = {
  "ChIJ-0phpY6AhYARE_FYalDygAI": {
    "youtube_summary": "Expert in facelifts, mommy makeovers, and gynecomastia for 30+ years.",
    "top_review": "Top quality care and results.",
    "website": "http://dr-delgado.com"
  },
  "default": {
    "youtube_summary": "General medical practice with verified credentials.",
    "top_review": "Professional staff and efficient check-in.",
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
  const [userReviews, setUserReviews] = useState<Record<string, any>>({});
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [activeCommentItem, setActiveCommentItem] = useState<any>(null);

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

  const openCommentModal = (item: any) => {
    setActiveCommentItem(item);
    setCommentModalOpen(true);
  };

  const saveComment = async (text: string, rating: number) => {
    if (!activeCommentItem) return;
    const newReview = { text, rating, date: new Date().toLocaleDateString() };
    setUserReviews(prev => ({
      ...prev,
      [activeCommentItem.id]: [...(prev[activeCommentItem.id] || []), newReview]
    }));
    toast.success("Review submitted!");
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
          <NavItem icon={<Bot />} label="Personalised AI Bot" active={activeTab === "ai-bot"} sidebarOpen={sidebarOpen} onClick={() => setActiveTab("ai-bot")} />
        </nav>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute -right-3 top-24 bg-white border border-slate-200 rounded-full p-1.5 hover:text-[#ff6b6b] shadow-sm">
          {sidebarOpen ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
        </button>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white border-b border-slate-200 px-8 py-4 z-20 shrink-0">
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
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#f8fcfc]">
          <div className="max-w-7xl mx-auto h-full">
            {(activeTab === 'dashboard' || activeTab === 'favorites') && (
              <>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className={`text-3xl font-bold text-[#0d7377] ${dmSans.className}`}>{activeTab === "favorites" ? "Your Favorites" : "Find, Compare, Decide"}</h2>
                    <p className="text-slate-500 font-medium mt-1">Showing verified data for San Francisco area</p>
                  </div>
                  <div className="bg-[#ff6b6b]/10 text-[#ff6b6b] px-4 py-2 rounded-xl text-sm font-black tracking-wide">{filteredItems.length} RESULTS</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => (
                      <ItemCard key={item.id} item={item} isFavorite={favorites.includes(item.id)} hasComments={!!userReviews[item.id]?.length} onFavoriteToggle={() => toggleFavorite(item.id)} onDetailsClick={() => handleCompareDetails(item)} onCommentClick={() => openCommentModal(item)} />
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
            {activeTab === 'compare' && <CompareSection data={API_DATA} />}
            {activeTab === 'ai-bot' && <AIBotInterface />}
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
                {/* ... existing filter content ... */}
                <button onClick={()=>setFilterDrawerOpen(false)} className="w-full py-4 bg-[#ff6b6b] text-white rounded-2xl font-black tracking-widest shadow-xl shadow-[#ff6b6b]/20 mt-6">APPLY FILTERS</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CommentModal isOpen={commentModalOpen} onClose={() => setCommentModalOpen(false)} item={activeCommentItem} comments={activeCommentItem ? (userReviews[activeCommentItem.id] || []) : []} onSave={saveComment} />
    </div>
  );
}

// --- SUB-COMPONENT: AI BOT INTERFACE (WITH NEURAL DESIGN) ---
function AIBotInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([
    { role: 'bot', text: "Hello! I can help you find specific products using my Zero-Shot Transformer model. What are you looking for today?", type: 'text' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input, type: 'text' }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', data: MOCK_AI_RESPONSE, type: 'ai_result' }]);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex-1 bg-white rounded-[40px] shadow-2xl shadow-[#0d7377]/5 border border-slate-100 overflow-hidden flex flex-col">
        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30 scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-[#ff6b6b]' : 'bg-white border border-slate-200 text-[#0d7377]'}`}>
                    {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} />}
                  </div>
                  {msg.type === 'text' ? (
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#0d7377] text-white rounded-tr-none' : 'bg-white text-slate-600 rounded-tl-none border border-slate-100'}`}>
                      {msg.text}
                    </div>
                  ) : (
                    <AIResponseCard data={msg.data} />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#0d7377]"><Bot size={18} className="animate-pulse" /></div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1"><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span></div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask NeuralSearch AI..." className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#0d7377]/20 focus:bg-white transition-all outline-none text-sm font-medium shadow-inner" />
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
            <button onClick={handleSend} className="w-14 h-14 bg-[#0d7377] text-white rounded-2xl flex items-center justify-center hover:bg-[#0b5c5f] transition-all shadow-lg shadow-[#0d7377]/20"><Send size={20} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AIResponseCard({ data }: any) {
  return (
    <div className="w-full space-y-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5"><BrainCircuit size={80} /></div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge icon={<Target size={12}/>} text={data.intent.replace('_', ' ')} color="bg-blue-50 text-blue-600" />
          <Badge icon={<Sparkles size={12}/>} text={`${(data.confidence * 100).toFixed(1)}% confidence`} color="bg-amber-50 text-amber-600" />
        </div>
        <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Neural Reasoning</p><p className="text-xs text-slate-600 italic leading-relaxed">{data.reasoning}</p></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(data.entities).map(([key, val]) => val && (
                <div key={key} className="bg-white border border-slate-100 rounded-lg p-2 shadow-sm"><p className="text-[9px] font-black text-slate-300 uppercase">{key}</p><p className="text-xs font-bold text-[#0d7377]">{val as string}</p></div>
            ))}
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
        {data.results.map((item: any, i: number) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="min-w-[260px] bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between group">
            <div>
                <div className="h-28 bg-slate-50 rounded-xl mb-3 flex items-center justify-center relative"><ShoppingBag size={32} className="text-slate-200" /><div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-[9px] font-black text-[#0d7377] shadow-sm">{item.snippet}</div></div>
                <h4 className="font-bold text-slate-800 text-xs leading-tight mb-2 line-clamp-2">{item.title}</h4>
                <p className="text-base font-black text-slate-900 mb-3">{item.price}</p>
            </div>
            <a href={item.link} target="_blank" className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-[#ff6b6b] hover:text-white transition-all uppercase tracking-widest">View <ExternalLink size={12} /></a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- SHARED UI COMPONENTS ---
function Badge({ icon, text, color }: any) {
  return <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-2 ${color}`}>{icon} {text}</div>;
}

function NavItem({ icon, label, active = false, sidebarOpen, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center p-3 rounded-2xl cursor-pointer transition-all ${active ? "bg-[#ff6b6b]/10 text-[#ff6b6b]" : "text-slate-400 hover:bg-slate-50 hover:text-[#0d7377]"} ${!sidebarOpen && "justify-center"}`}>
      {React.cloneElement(icon, { size: 20 })}
      {sidebarOpen && <span className="ml-4 font-black text-[11px] uppercase tracking-widest">{label}</span>}
    </div>
  );
}

function ItemCard({ item, isFavorite, onFavoriteToggle, onDetailsClick, onCommentClick, hasComments }: any) {
  return (
    <motion.div layout className="bg-white rounded-[32px] border border-slate-100 p-4 shadow-sm hover:shadow-xl transition-all flex flex-col group relative">
      <div className="relative h-44 rounded-[24px] overflow-hidden mb-4">
        <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-100">
          <Star size={12} className="text-[#0d7377] fill-[#0d7377]" />
          <span className="text-xs font-black text-[#0d7377]">{item.rating}</span>
        </div>
      </div>
      <div className="flex-1 px-1">
          <h3 className="font-bold text-[#2B2D42] text-sm leading-tight mb-2 h-10 line-clamp-2">{item.name}</h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-slate-400"><MapPin size={12}/><p className="text-[10px] font-semibold truncate">{item.address}</p></div>
            <div className="text-[#0d7377] font-black text-[9px] tracking-widest bg-[#0d7377]/5 w-fit px-2 py-1 rounded-lg uppercase">{item.distance} KM AWAY</div>
          </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onDetailsClick} className="flex-1 py-3 bg-[#0d7377] text-white rounded-2xl text-[9px] font-black tracking-widest uppercase shadow-md shadow-[#0d7377]/20">Compare</button>
        <button onClick={onCommentClick} className="relative p-3 border border-slate-100 rounded-2xl text-slate-400 hover:text-[#0d7377] transition-all"><MessageCircle size={18} />{hasComments && <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff6b6b] rounded-full border border-white"></span>}</button>
        <button onClick={onFavoriteToggle} className={`p-3 border rounded-2xl transition-all ${isFavorite ? "bg-[#ff6b6b] border-[#ff6b6b] text-white" : "text-slate-300 hover:text-[#ff6b6b]"}`}><Heart size={18} className={isFavorite ? "fill-white" : ""} /></button>
      </div>
    </motion.div>
  );
}

function CommentModal({ isOpen, onClose, item, comments, onSave }: any) {
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-[#0d7377]">Patient Reviews</h3>
            <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-[#ff6b6b]"><X size={18}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[300px]">
          {comments.map((c: any, i: number) => (
            <div key={i} className="flex gap-3 bg-slate-50 p-3 rounded-2xl">
              <User size={14} className="text-[#0d7377] shrink-0 mt-1" />
              <div><div className="flex gap-1 mb-1">{[...Array(5)].map((_, idx) => <Star key={idx} size={10} className={idx < c.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />)}</div><p className="text-xs text-slate-700 font-medium">{c.text}</p></div>
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-slate-100 bg-white">
            <div className="flex gap-2 mb-3 justify-center">{[1,2,3,4,5].map(s => <button key={s} onClick={()=>setRating(s)}><Star size={20} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-100"} /></button>)}</div>
            <div className="flex gap-2"><input type="text" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Write review..." value={newComment} onChange={(e)=>setNewComment(e.target.value)} /><button onClick={()=>{onSave(newComment, rating); setNewComment(""); setRating(0); onClose();}} className="px-4 py-2 bg-[#0d7377] text-white rounded-xl text-xs font-bold uppercase tracking-wider">Send</button></div>
        </div>
      </motion.div>
    </div>
  );
}

function CompareSection({ data }: { data: any[] }) { return <div className="p-20 text-center text-slate-400 italic">Select items from dashboard to start comparison analysis.</div>; }
function CompareRow({ label, icon, data, highlight = false }: any) { return null; }