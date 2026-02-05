"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Download, Share2, Star, MapPin, 
  Dumbbell, Waves, ExternalLink, ChevronUp,
  MessageSquare, AlertTriangle,
  Car, Lightbulb, Users, Loader2
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';
import { apiPost } from "@/lib/api";

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

export default function CompareDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
      // 1. Get initial data from LocalStorage (from Dashboard)
      const stored = localStorage.getItem("comparison_item");
      if (!stored) {
        router.push("/dashboard"); // Redirect if no data
        return;
      }
      const parsedItem = JSON.parse(stored);
      setItem(parsedItem);

      // 2. Call your POST API with the stored data
      try {
        const isProduct = (parsedItem.category || "").toLowerCase() === "product";
        const entityId = isProduct
          ? (parsedItem.product_url || parsedItem.url || parsedItem.id)
          : (parsedItem.place_id || parsedItem.id);
        const data = await apiPost<any>("/api/crawleragen", {
          name: parsedItem.name,
          category: parsedItem.category,
          place_id: isProduct ? null : (parsedItem.place_id || parsedItem.id),
          entity_id: entityId,
          include_transcripts: true,
          max_transcripts: 2,
          price: parsedItem.price,
          extra: isProduct ? { product_url: parsedItem.product_url || parsedItem.url } : undefined
        });
        setApiData(data.results || data);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [router]);

  if (loading || !item) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F4F7F7]">
        <Loader2 className="animate-spin text-[#0D7377] mb-4" size={48} />
        <p className={`text-[#0D7377] font-bold ${dmSans.className}`}>Generating Intelligence Report...</p>
      </div>
    );
  }

  // Dynamic values based on either API or LocalStorage
  const displayRating = apiData?.rating || item.rating;
  const displayScore = apiData?.score || item.score || 85;

  return (
    <div className={`min-h-screen bg-[#F4F7F7] text-[#2B2D42] ${inter.className}`}>
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 sticky top-0 z-50 w-full">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-[#0D7377] hover:text-white transition-all group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Back</span>
            </button>
            <div>
              <h1 className={`text-xl font-bold text-[#0D7377] ${dmSans.className}`}>Report</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Analysis for ID: {item.id}</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
             <button
               onClick={() => {
                 const mapsUrl = apiData?.google_place?.url || item?.google_maps_url;
                 if (mapsUrl) window.open(mapsUrl, "_blank", "noopener,noreferrer");
               }}
               className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all font-bold text-sm"
             >
                <Share2 size={16} /> Open in Maps
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 space-y-8">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 relative group min-h-[500px]">
            <div className="absolute inset-0 rounded-[48px] overflow-hidden">
              {!imgError ? (
                <img
                  src={item.img || item.image}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                  alt={item.name}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0d7377]/10 to-[#ff6b6b]/10 text-[#0d7377] font-black text-4xl">
                  {(item.name || "?").slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase border border-white/30">Verified {item.category}</span>
                  <span className="bg-[#0D7377] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase">Instant Analysis</span>
                </div>
                <h2 className={`text-4xl font-bold text-white ${dmSans.className}`}>{item.name}</h2>
                <p className="text-white/80 flex items-center gap-2 text-sm">
                  <MapPin size={16} /> {item.address}
                </p>
              </div>
            </div>
          </div>

          {/* SCORE PANEL */}
          <div className="lg:col-span-5 bg-white rounded-[48px] p-10 shadow-xl shadow-slate-200/50 flex flex-col border border-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Decision Score</p>
                <h3 className="text-6xl font-black text-[#0D7377]">{Math.round(displayScore)}<span className="text-2xl opacity-50">%</span></h3>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 text-orange-500 font-bold text-xl mb-1">
                  <Star size={24} className="fill-current" /> {displayRating}
                </div>
                <p className="text-xs text-slate-400 font-medium">{item.user_ratings_total} reviews</p>
              </div>
            </div>

            <div className="bg-[#F0F9F9] rounded-3xl p-6 mb-8 border border-[#0D7377]/10">
              <p className="text-[10px] font-black text-[#0D7377] uppercase tracking-widest mb-4">Primary Reason</p>
              <div className="flex items-start gap-3 text-xs font-semibold text-slate-700 leading-relaxed italic">
                <Lightbulb size={18} className="text-[#0D7377] shrink-0" />
                "{item.reason}"
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <HighlightCard icon={<Car size={18}/>} text="Easy Access" />
              <HighlightCard icon={<Waves size={18}/>} text="Top Cleanliness" />
              <HighlightCard icon={<Dumbbell size={18}/>} text="Modern Facility" />
              <HighlightCard icon={<Users size={18}/>} text="Highly Trusted" />
            </div>

            <button className="w-full mt-auto bg-[#2B2D42] text-white py-5 rounded-[24px] font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#0D7377] transition-all">
              Contact Provider <ExternalLink size={18} />
            </button>
          </div>
        </section>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#0D7377]/10 rounded-2xl text-[#0D7377]"><MessageSquare size={24} /></div>
                <h3 className="text-2xl font-bold">Expert Insights</h3>
              </div>
              <div className="space-y-6">
                <InsightCard 
                  author="AI Analyzer" 
                  tag="Efficiency" 
                  text={`Based on ${item.user_ratings_total} data points, this ${item.category} maintains a consistent score of ${displayRating}.`} 
                />
                <InsightCard 
                  author="Local Guide" 
                  tag="Location" 
                  text={`Perfectly situated at ${item.address}, which is within ${item.distance} KM of your current coordinates.`} 
                />
              </div>
            </div>

            <div className="bg-[#FFF5F5] rounded-[48px] p-10 border border-red-100">
               <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-100 rounded-2xl text-red-600"><AlertTriangle size={24} /></div>
                <h3 className="text-2xl font-bold text-red-900">Critical Metrics</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CautionCard feature="Price Point" issue={`Estimated cost of ₹${item.price} per visit.`} />
                <CautionCard feature="Status" issue={item.open_now ? "Currently Open - High Demand" : "Currently Closed"} />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <h4 className="text-lg font-bold mb-8">Performance Indices</h4>
              <div className="space-y-8">
                <MetricBar label="Rating Reliability" value={item.rating * 20} color="#0D7377" />
                <MetricBar label="Distance Score" value={95} color="#0D7377" />
                <MetricBar label="Value for Money" value={75} color="#0D7377" />
                <MetricBar label="Pricing Index" value={(item.price / 10)} color="#FF6B6B" />
              </div>
            </div>

            <div className="bg-[#2B2D42] rounded-[40px] p-8 text-white shadow-xl shadow-slate-300">
              <h4 className="text-lg font-bold mb-6 flex items-center justify-between">
                Quick Specs <ChevronUp size={20} className="text-slate-500" />
              </h4>
              <div className="space-y-3">
                <SpecRow label="Category" value={item.category} />
                <SpecRow label="Distance" value={`${item.distance} KM`} />
                <SpecRow label="Pricing" value={`₹${item.price}`} />
                <SpecRow label="Review Count" value={item.user_ratings_total} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function HighlightCard({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
      <div className="text-[#0D7377]">{icon}</div>
      <span className="text-xs font-bold text-slate-600">{text}</span>
    </div>
  );
}

function InsightCard({ author, tag, text }: { author: string, tag: string, text: string }) {
  return (
    <div className="group p-8 rounded-[32px] bg-[#F9FBFC] border border-slate-50 hover:border-[#0D7377]/20 transition-all">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#0D7377]">{author[0]}</div>
          <div>
            <p className="text-sm font-bold text-slate-800">{author}</p>
            <p className="text-[10px] font-bold text-[#0D7377] uppercase tracking-widest">{tag}</p>
          </div>
        </div>
      </div>
      <p className="text-slate-600 italic leading-relaxed">"{text}"</p>
    </div>
  );
}

function CautionCard({ feature, issue }: { feature: string, issue: string }) {
  return (
    <div className="bg-white/50 p-6 rounded-3xl border border-red-100">
      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">{feature}</p>
      <p className="text-sm font-medium text-red-800 leading-snug">{issue}</p>
    </div>
  );
}

function SpecRow({ label, value }: { label: string, value: any }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-bold text-white capitalize">{value}</span>
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{Math.min(Math.round(value), 100)}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(value, 100)}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}
