"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Database, Cpu, UserCheck, ChevronDown, ChevronUp, 
  Globe, ShieldCheck, Zap, Search, Linkedin, Twitter, Github 
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

// --- Fonts ---
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

// --- Mock Data ---
const TEAM = [
  { name: "Arjun Mehta", role: "Lead Developer", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200", bio: "Full-stack wizard passionate about AI and data aggregation." },
  { name: "Sana Khan", role: "UI/UX Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", bio: "Believes in simplifying complex data into beautiful interfaces." },
  { name: "Rohan Das", role: "Data Engineer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", bio: "Expert in scraping pipelines and real-time processing." },
];

const FAQS = [
  { q: "Is Ranger completely free to use?", a: "Yes, Ranger is 100% free for consumers. We may earn a small affiliate commission if you buy a product through our links, but this never affects our rankings." },
  { q: "How often is price data updated?", a: "We refresh our data in real-time for major retailers (Amazon, Flipkart) and every 24 hours for local service providers." },
  { q: "Can I trust the 'Best Value' score?", a: "Absolutely. Our Ranger Score is purely mathematical based on Price, Features, and Verified Reviews. No brand can pay to improve their score." },
  { q: "Do you cover services outside Mumbai?", a: "Currently, our 'Services' and 'Professionals' categories are live in Mumbai, Delhi, and Bangalore. Product comparison is available nationwide." },
];

const SOURCES = [
  { name: "Amazon", logo: "A" }, { name: "Flipkart", logo: "F" }, { name: "Croma", logo: "C" },
  { name: "Myntra", logo: "M" }, { name: "Practo", logo: "P" }, { name: "Justdial", logo: "J" },
  { name: "Google Maps", logo: "G" }, { name: "Yelp", logo: "Y" }
];

export default function AboutPage() {
  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-[#2B2D42] ${inter.className}`}>
      
      {/* --- 1. HERO / MISSION --- */}
      <section className="bg-[#0D7377] text-white py-24 px-6 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#14FFEC] rounded-full blur-[150px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF6B6B] rounded-full blur-[150px] opacity-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
           <motion.span 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
             className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-[#14FFEC] text-sm font-bold mb-6 tracking-wide uppercase"
           >
             Our Mission
           </motion.span>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
             className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${dmSans.className}`}
           >
             We democratize decision making.
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
             className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
           >
             In a world of information overload, Ranger cuts through the noise. We aggregate, analyze, and simplify data so you can choose with confidence—whether it’s a ₹500 haircut or a ₹50,000 phone.
           </motion.p>
        </div>
      </section>

      {/* --- 2. HOW WE AGGREGATE (Flowchart) --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold mb-4 ${dmSans.className}`}>From Chaos to Clarity</h2>
          <p className="text-slate-500">How Ranger turns raw internet data into your recommendation.</p>
        </div>

        <div className="relative">
           {/* Desktop Flow Line (Hidden on Mobile) */}
           <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 -z-10">
              <motion.div 
                className="h-full bg-[#14FFEC] shadow-[0_0_10px_#14FFEC]"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <FlowCard 
                icon={<Database className="w-8 h-8 text-blue-500" />}
                step="01"
                title="Aggregation"
                desc="We scrape and connect via APIs to 500+ sources including Amazon, Maps, and specialized directories."
              />
              <FlowCard 
                icon={<Cpu className="w-8 h-8 text-[#0D7377]" />}
                step="02"
                title="The Ranger Engine"
                desc="Our AI filters fake reviews, normalizes prices, and calculates a weighted score for every item."
                isCentral
              />
              <FlowCard 
                icon={<UserCheck className="w-8 h-8 text-[#FF6B6B]" />}
                step="03"
                title="Your Decision"
                desc="You get a clean, bias-free dashboard with one clear winner tailored to your preferences."
              />
           </div>
        </div>
      </section>

      {/* --- 3. THE ALGORITHM EXPLAINED --- */}
      <section className="py-20 bg-white border-y border-slate-100">
         <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className={`text-3xl font-bold mb-6 ${dmSans.className}`}>The "Ranger Score" Formula</h2>
               <p className="text-slate-600 mb-6 leading-relaxed">
                 We don't just guess. Every product or service gets a score from 0-100 based on three core pillars. This formula adapts in real-time based on your personal slider settings.
               </p>
               
               <div className="space-y-4">
                  <AlgoItem 
                    icon={<Zap className="w-5 h-5" />} 
                    color="bg-yellow-100 text-yellow-700" 
                    title="Performance / Quality (50%)" 
                    desc="Based on verified specs and expert benchmarks." 
                  />
                  <AlgoItem 
                    icon={<ShieldCheck className="w-5 h-5" />} 
                    color="bg-blue-100 text-blue-700" 
                    title="Trust & Reviews (30%)" 
                    desc="Weighted average of user ratings, filtering out bot spam." 
                  />
                  <AlgoItem 
                    icon={<Globe className="w-5 h-5" />} 
                    color="bg-emerald-100 text-emerald-700" 
                    title="Value for Money (20%)" 
                    desc="Price compared to the category average and historical trends." 
                  />
               </div>
            </div>

            {/* Visual Formula Representation */}
            <div className="bg-[#F8F9FA] rounded-3xl p-8 border border-slate-200 relative">
               <div className="absolute -top-4 -right-4 bg-[#FF6B6B] text-white px-4 py-2 rounded-lg font-bold shadow-lg transform rotate-3">
                  Secret Sauce 🌶️
               </div>
               <div className="space-y-4 font-mono text-sm md:text-base">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                    <span>const <span className="text-purple-600">quality</span> = specs.cpu + specs.ram;</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                    <span>const <span className="text-blue-600">trust</span> = reviews.filter(r =&gt; !r.isBot);</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200">
                    <span>const <span className="text-emerald-600">value</span> = (avgPrice - currentPrice);</span>
                  </div>
                  <div className="p-4 bg-[#0D7377] text-white rounded-xl mt-4 text-center font-bold shadow-lg shadow-[#0D7377]/20">
                     return (quality + trust + value) / 3;
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- 4. DATA SOURCES --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
         <h2 className={`text-2xl font-bold text-center mb-10 text-slate-400 ${dmSans.className}`}>Trusted by aggregating data from</h2>
         <div className="flex flex-wrap justify-center gap-6">
            {SOURCES.map((s) => (
               <div key={s.name} className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm hover:border-[#0D7377] transition-colors cursor-default">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{s.logo}</div>
                  <span className="font-bold text-slate-700">{s.name}</span>
               </div>
            ))}
            <div className="px-6 py-3 text-slate-400 font-medium">+ 500 more</div>
         </div>
      </section>

      {/* --- 5. TEAM --- */}
      <section className="py-20 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className={`text-3xl font-bold mb-4 ${dmSans.className}`}>Built by Engineers</h2>
               <p className="text-slate-500">The team behind the TSEC Hackathon project.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {TEAM.map((member) => (
                  <div key={member.name} className="bg-[#F8F9FA] rounded-2xl p-6 text-center border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                     <div className="w-24 h-24 mx-auto bg-slate-200 rounded-full mb-4 overflow-hidden border-4 border-white shadow-md">
                        <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                     </div>
                     <h3 className="font-bold text-xl text-[#2B2D42]">{member.name}</h3>
                     <p className="text-[#0D7377] font-medium text-sm mb-3">{member.role}</p>
                     <p className="text-slate-500 text-sm leading-relaxed mb-6">{member.bio}</p>
                     
                     <div className="flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <SocialIcon icon={<Linkedin className="w-4 h-4" />} />
                        <SocialIcon icon={<Github className="w-4 h-4" />} />
                        <SocialIcon icon={<Twitter className="w-4 h-4" />} />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- 6. FAQ --- */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
         <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${dmSans.className}`}>Frequently Asked Questions</h2>
         </div>
         <div className="space-y-4">
            {FAQS.map((faq, i) => (
               <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
         </div>
      </section>

    </div>
  );
}

// --- SUB COMPONENTS ---

function FlowCard({ icon, step, title, desc, isCentral }: any) {
   return (
      <div className={`relative bg-white p-8 rounded-3xl border ${isCentral ? 'border-[#0D7377] shadow-xl shadow-[#0D7377]/10 z-10' : 'border-slate-200'} text-center`}>
         <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${isCentral ? 'bg-[#0D7377]/10' : 'bg-slate-50'}`}>
            {icon}
         </div>
         <div className="absolute top-6 right-6 text-6xl font-bold text-slate-100 -z-10">{step}</div>
         <h3 className={`text-xl font-bold mb-3 ${dmSans.className}`}>{title}</h3>
         <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      </div>
   );
}

function AlgoItem({ icon, color, title, desc }: any) {
   return (
      <div className="flex gap-4">
         <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
            {icon}
         </div>
         <div>
            <h4 className="font-bold text-[#2B2D42]">{title}</h4>
            <p className="text-sm text-slate-500">{desc}</p>
         </div>
      </div>
   );
}

function SocialIcon({ icon }: any) {
   return (
      <a href="#" className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0D7377] hover:border-[#0D7377] transition-colors">
         {icon}
      </a>
   );
}

function FAQItem({ question, answer }: any) {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
         <button 
           onClick={() => setIsOpen(!isOpen)}
           className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
         >
            <span className="font-bold text-[#2B2D42]">{question}</span>
            {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
         </button>
         <AnimatePresence>
            {isOpen && (
               <motion.div 
                 initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                 className="overflow-hidden"
               >
                  <div className="p-5 pt-0 text-slate-500 leading-relaxed text-sm">
                     {answer}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}