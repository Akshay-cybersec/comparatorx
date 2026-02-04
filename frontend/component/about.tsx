"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Database, Cpu, UserCheck, ChevronDown, ChevronUp, 
  Globe, ShieldCheck, Zap, Linkedin, Twitter, Github,
  Code2, GitBranch, Terminal
} from "lucide-react";
import { DM_Sans, Inter } from 'next/font/google';

// --- Fonts ---
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600'] });

// --- Mock Data ---
const TEAM = [
  { name: "Arjun Mehta", role: "Lead Developer", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop", bio: "Full-stack wizard passionate about AI and data aggregation." },
  { name: "Sana Khan", role: "UI/UX Designer", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop", bio: "Believes in simplifying complex data into beautiful interfaces." },
  { name: "Rohan Das", role: "Data Engineer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", bio: "Expert in scraping pipelines and real-time processing." },
];

const FAQS = [
  { q: "Is ComparatorX completely free to use?", a: "Yes, ComparatorX is 100% free for consumers. We may earn a small affiliate commission if you buy a product through our links, but this never affects our rankings." },
  { q: "How often is price data updated?", a: "We refresh our data in real-time for major retailers (Amazon, Flipkart) and every 24 hours for local service providers." },
  { q: "Can I trust the 'Best Value' score?", a: "Absolutely. Our ComparatorX Score is purely mathematical based on Price, Features, and Verified Reviews. No brand can pay to improve their score." },
  { q: "Do you cover services outside Mumbai?", a: "Currently, our 'Services' and 'Professionals' categories are live in Mumbai, Delhi, and Bangalore. Product comparison is available nationwide." },
];

const SOURCES = [
  { name: "Amazon", logo: "A" }, { name: "Flipkart", logo: "F" }, { name: "Croma", logo: "C" },
  { name: "Myntra", logo: "M" }, { name: "Practo", logo: "P" }, { name: "Justdial", logo: "J" },
  { name: "Google Maps", logo: "G" }, { name: "Yelp", logo: "Y" }
];

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className={`min-h-screen bg-[#F8F9FA] text-[#2B2D42] ${inter.className}`}>
      
      {/* --- 1. HERO / MISSION --- */}
      <section className="relative bg-[#0D7377] text-white pt-40 pb-32 px-6 overflow-hidden">
        {/* Animated Background Blobs */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14FFEC] rounded-full blur-[180px] opacity-20 pointer-events-none mix-blend-overlay" 
        />
        <motion.div 
          animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF6B6B] rounded-full blur-[150px] opacity-15 pointer-events-none mix-blend-overlay" 
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
           <motion.div 
             initial={{ opacity: 0, y: 30 }} 
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-[#14FFEC] text-sm font-bold mb-8 tracking-widest uppercase backdrop-blur-md shadow-xl"
           >
             Our Mission
           </motion.div>
           
           <motion.h1 
             initial={{ opacity: 0, y: 40 }} 
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1, duration: 0.8 }}
             className={`text-5xl md:text-7xl font-bold mb-8 leading-tight ${dmSans.className}`}
           >
             We democratize <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14FFEC] to-white">
               decision making.
             </span>
           </motion.h1>
           
           <motion.p 
             initial={{ opacity: 0, y: 40 }} 
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3, duration: 0.8 }}
             className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed"
           >
             In a world of information overload, ComparatorX cuts through the noise. We simplify data so you can choose with confidence—whether it’s a ₹500 haircut or a ₹50,000 phone.
           </motion.p>
        </div>
      </section>

      {/* --- 2. HOW WE AGGREGATE (Flowchart) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className={`text-3xl md:text-4xl font-bold mb-4 text-[#0D7377] ${dmSans.className}`}
          >
            From Chaos to Clarity
          </motion.h2>
          <p className="text-slate-500 text-lg">How ComparatorX turns raw internet data into your recommendation.</p>
        </div>

        <div className="relative">
           {/* Desktop Flow Line */}
           <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-slate-200 -translate-y-1/2 -z-10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#0D7377] via-[#14FFEC] to-[#0D7377]"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                viewport={{ once: true }}
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <FlowCard 
                icon={<Database className="w-8 h-8 text-blue-500" />}
                step="01"
                title="Aggregation"
                desc="We scrape and connect via APIs to 500+ sources including Amazon, Maps, and specialized directories."
                delay={0}
              />
              <FlowCard 
                icon={<Cpu className="w-8 h-8 text-[#0D7377]" />}
                step="02"
                title="The ComparatorX Engine"
                desc="Our AI filters fake reviews, normalizes prices, and calculates a weighted score for every item."
                isCentral
                delay={0.2}
              />
              <FlowCard 
                icon={<UserCheck className="w-8 h-8 text-[#FF6B6B]" />}
                step="03"
                title="Your Decision"
                desc="You get a clean, bias-free dashboard with one clear winner tailored to your preferences."
                delay={0.4}
              />
           </div>
        </div>
      </section>

      {/* --- 3. THE ALGORITHM EXPLAINED --- */}
      <section className="py-24 bg-white border-y border-slate-100 overflow-hidden">
         <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
               <div className="flex items-center gap-2 mb-4">
                 <Code2 className="w-6 h-6 text-[#FF6B6B]" />
                 <span className="font-bold text-[#FF6B6B] tracking-wider uppercase text-sm">Transparency</span>
               </div>
               <h2 className={`text-4xl font-bold mb-6 text-[#2B2D42] ${dmSans.className}`}>The "ComparatorX Score" Formula</h2>
               <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                 We don't just guess. Every product or service gets a score from 0-100 based on three core pillars. This formula adapts in real-time based on your personal slider settings.
               </p>
               
               <div className="space-y-6">
                  <AlgoItem 
                    icon={<Zap className="w-5 h-5" />} 
                    color="bg-yellow-100 text-yellow-700" 
                    title="Performance / Quality (50%)" 
                    desc="Based on verified specs and expert benchmarks." 
                    delay={0.1}
                  />
                  <AlgoItem 
                    icon={<ShieldCheck className="w-5 h-5" />} 
                    color="bg-blue-100 text-blue-700" 
                    title="Trust & Reviews (30%)" 
                    desc="Weighted average of user ratings, filtering out bot spam." 
                    delay={0.2}
                  />
                  <AlgoItem 
                    icon={<Globe className="w-5 h-5" />} 
                    color="bg-emerald-100 text-emerald-700" 
                    title="Value for Money (20%)" 
                    desc="Price compared to the category average and historical trends." 
                    delay={0.3}
                  />
               </div>
            </motion.div>

            {/* Visual Formula Representation */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}
              className="bg-[#2B2D42] rounded-3xl p-8 border border-slate-700 relative shadow-2xl"
            >
               <div className="absolute -top-6 -right-6 bg-[#FF6B6B] text-white px-6 py-3 rounded-2xl font-bold shadow-xl transform rotate-6 border-4 border-white">
                  Secret Sauce 🌶️
               </div>
               
               <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                 <Terminal className="w-5 h-5 text-[#14FFEC]" />
                 <span className="text-white/60 font-mono text-sm">algorithm.ts</span>
               </div>

               <div className="space-y-4 font-mono text-sm md:text-base text-white/90">
                  <div className="group flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:border-[#14FFEC]/50 transition-colors">
                    <span className="text-purple-400 mr-2">const</span> quality <span className="text-[#14FFEC] mx-2">=</span> specs.cpu + specs.ram;
                  </div>
                  <div className="group flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:border-[#14FFEC]/50 transition-colors">
                    <span className="text-purple-400 mr-2">const</span> trust <span className="text-[#14FFEC] mx-2">=</span> reviews.filter(<span className="text-yellow-400">!isBot</span>);
                  </div>
                  <div className="group flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:border-[#14FFEC]/50 transition-colors">
                    <span className="text-purple-400 mr-2">const</span> value <span className="text-[#14FFEC] mx-2">=</span> (avgPrice - currentPrice);
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <span className="text-slate-400">// Calculate Final Score</span>
                    <div className="p-4 bg-gradient-to-r from-[#0D7377] to-[#0A5E61] text-white rounded-xl mt-2 text-center font-bold shadow-lg">
                       return (quality + trust + value) / 3;
                    </div>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* --- 4. DATA SOURCES --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto bg-[#F8F9FA]">
         <h2 className={`text-2xl font-bold text-center mb-10 text-slate-400 ${dmSans.className}`}>Trusted by aggregating data from</h2>
         <div className="flex flex-wrap justify-center gap-6">
            {SOURCES.map((s, i) => (
               <motion.div 
                 key={s.name}
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.05 }}
                 whileHover={{ y: -5, borderColor: "#0D7377", boxShadow: "0 10px 20px rgba(13, 115, 119, 0.1)" }}
                 className="flex items-center gap-3 bg-white px-6 py-4 rounded-full border border-slate-200 shadow-sm transition-all duration-300 cursor-default"
               >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">{s.logo}</div>
                  <span className="font-bold text-slate-700">{s.name}</span>
               </motion.div>
            ))}
            <div className="px-6 py-4 text-slate-400 font-bold flex items-center gap-2">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" />
              + 500 more
            </div>
         </div>
      </section>

      {/* --- 5. TEAM --- */}
      <section className="py-24 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className={`text-4xl font-bold mb-4 text-[#2B2D42] ${dmSans.className}`}>Built by Engineers</h2>
               <p className="text-slate-500 text-lg">The team behind the TSEC Hackathon project.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               {TEAM.map((member, i) => (
                  <motion.div 
                    key={member.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-lg hover:shadow-2xl hover:shadow-[#0D7377]/10 transition-all duration-500 group relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-gradient-to-b from-[#0D7377]/0 to-[#0D7377]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     
                     <div className="w-32 h-32 mx-auto bg-slate-200 rounded-full mb-6 overflow-hidden border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-500">
                        <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                     </div>
                     <h3 className="font-bold text-2xl text-[#2B2D42] mb-1">{member.name}</h3>
                     <p className="text-[#0D7377] font-bold text-sm mb-4 uppercase tracking-wide">{member.role}</p>
                     <p className="text-slate-500 text-sm leading-relaxed mb-8">{member.bio}</p>
                     
                     {/* Social Icons Reveal */}
                     <div className="flex justify-center gap-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <SocialIcon icon={<Linkedin className="w-5 h-5" />} />
                        <SocialIcon icon={<Github className="w-5 h-5" />} />
                        <SocialIcon icon={<Twitter className="w-5 h-5" />} />
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* --- 6. FAQ --- */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
         <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold text-[#2B2D42] ${dmSans.className}`}>Frequently Asked Questions</h2>
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

function FlowCard({ icon, step, title, desc, isCentral, delay }: any) {
   return (
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -10 }}
        className={`relative bg-white p-10 rounded-[2rem] border ${isCentral ? 'border-[#0D7377] shadow-2xl shadow-[#0D7377]/10 z-10' : 'border-slate-200 shadow-lg'} text-center transition-all duration-300`}
      >
         <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8 shadow-sm ${isCentral ? 'bg-[#0D7377]/10 text-[#0D7377]' : 'bg-slate-50 text-slate-600'}`}>
            {React.cloneElement(icon, { size: 32 })}
         </div>
         <div className="absolute top-8 right-8 text-7xl font-bold text-slate-100 -z-10 select-none">{step}</div>
         <h3 className={`text-2xl font-bold mb-4 text-[#2B2D42] ${dmSans.className}`}>{title}</h3>
         <p className="text-slate-500 leading-relaxed">{desc}</p>
      </motion.div>
   );
}

function AlgoItem({ icon, color, title, desc, delay }: any) {
   return (
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ delay }}
        className="flex gap-5 p-4 rounded-2xl hover:bg-[#F8F9FA] transition-colors"
      >
         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${color}`}>
            {icon}
         </div>
         <div>
            <h4 className="font-bold text-[#2B2D42] text-lg mb-1">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
         </div>
      </motion.div>
   );
}

function SocialIcon({ icon }: any) {
   return (
      <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#0D7377] hover:border-[#0D7377] transition-all duration-200 shadow-sm">
         {icon}
      </a>
   );
}

function FAQItem({ question, answer }: any) {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <motion.div 
        layout
        className={`bg-white border ${isOpen ? 'border-[#0D7377] shadow-md' : 'border-slate-200'} rounded-2xl overflow-hidden transition-colors duration-300`}
      >
         <button 
           onClick={() => setIsOpen(!isOpen)}
           className="w-full flex items-center justify-between p-6 text-left"
         >
            <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-[#0D7377]' : 'text-[#2B2D42]'}`}>{question}</span>
            <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-[#0D7377] text-white rotate-180' : 'bg-slate-100 text-slate-500'}`}>
               <ChevronDown className="w-5 h-5" />
            </div>
         </button>
         <AnimatePresence>
            {isOpen && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }} 
                 animate={{ height: "auto", opacity: 1 }} 
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
               >
                  <div className="p-6 pt-0 text-slate-500 leading-relaxed">
                     {answer}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </motion.div>
   );
}