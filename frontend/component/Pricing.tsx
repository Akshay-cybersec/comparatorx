"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Zap, Shield, Crown, CreditCard, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { DM_Sans, Inter } from "next/font/google";

// --- Fonts ---
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

// --- Types ---
type Plan = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  period: string;
  features: string[];
  notIncluded: string[];
  icon: React.ReactNode;
  highlight?: boolean;
  badge?: string;
  color: string;
  buttonColor: string;
  buttonText: string;
};

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free",
      subtitle: "For casual browsing",
      price: "₹0",
      period: "/ forever",
      features: [
        "3 Comparisons per day",
        "Basic Search Filters",
        "Community Reviews",
        "Standard Support",
      ],
      notIncluded: [
        "Price History Tracking",
        "Ad-free Experience",
        "ComparatorX AI Analysis",
      ],
      icon: <Shield className="w-6 h-6" />,
      color: "bg-white border-slate-200 text-slate-900",
      buttonColor: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      buttonText: "Get Started",
    },
    {
      id: "monthly",
      name: "Monthly",
      subtitle: "Flexible, pay as you go",
      price: "₹499",
      period: "/ month",
      features: [
        "Unlimited Comparisons",
        "ComparatorX AI Analysis",
        "Real-time Price Alerts",
        "Ad-free Experience",
        "Priority Support",
      ],
      notIncluded: ["Bulk Data Export", "API Access"],
      icon: <Zap className="w-6 h-6 text-[#0D7377]" />,
      color: "bg-white border-[#0D7377]/30 text-slate-900",
      buttonColor: "bg-white border-2 border-[#0D7377] text-[#0D7377] hover:bg-teal-50",
      buttonText: "Subscribe Monthly",
    },
    {
      id: "yearly",
      name: "Yearly",
      subtitle: "Best value for power users",
      price: "₹3,999",
      period: "/ year",
      highlight: true,
      badge: "SAVE 33%",
      features: [
        "All Monthly Features",
        "ComparatorX AI Analysis",
        "Advanced Price History",
        "Early Access to Deals",
        "Dedicated Support",
      ],
      notIncluded: [],
      icon: <Crown className="w-6 h-6 text-white" />,
      color: "bg-[#0D7377] border-[#0D7377] text-white",
      buttonColor: "bg-[#FF6B6B] text-white hover:bg-[#ff5252] shadow-lg shadow-[#FF6B6B]/30",
      buttonText: "Subscribe Yearly",
    },
  ];

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const closeCheckout = () => {
    setSelectedPlan(null);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className={`py-24 px-6 bg-[#F8F9FA] ${inter.className} overflow-hidden relative`}>
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${dmSans.className} text-4xl md:text-5xl font-bold text-[#0D7377] mb-6`}
          >
            Simple Plans. Transparent Pricing.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500"
          >
            Unlock the full power of ComparatorX. Choose the commitment that works for you.
          </motion.p>
        </div>

        {/* --- Cards Grid --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 items-center"
        >
          {plans.map((plan) => (
            <PriceCard key={plan.id} plan={plan} onSelect={handleSelectPlan} />
          ))}
        </motion.div>

        {/* --- Footer Note --- */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> Secure payment processing. Cancel anytime.
          </p>
        </div>
      </div>

      {/* --- CHECKOUT MODAL --- */}
      <AnimatePresence>
        {selectedPlan && (
          <CheckoutModal plan={selectedPlan} onClose={closeCheckout} />
        )}
      </AnimatePresence>

    </section>
  );
}

// --- Individual Card Component ---
function PriceCard({ plan, onSelect }: { plan: Plan; onSelect: (p: Plan) => void }) {
  const isDark = plan.highlight;
  const textColor = isDark ? "text-white" : "text-slate-900";
  const subTextColor = isDark ? "text-white/70" : "text-slate-500";
  const checkColor = isDark ? "text-[#FF6B6B]" : "text-[#0D7377]";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.8 } },
      }}
      whileHover={{ y: -12 }}
      className={`relative p-8 rounded-[2rem] border-2 shadow-xl flex flex-col h-full ${plan.color} ${
        plan.highlight ? "shadow-[#0D7377]/30 scale-105 z-10 ring-4 ring-[#0D7377]/10" : "shadow-slate-100 border-slate-100"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF6B6B] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wider uppercase">
          {plan.badge}
        </div>
      )}

      <div className="mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isDark ? "bg-white/10" : "bg-[#0D7377]/10"}`}>
          {plan.icon}
        </div>
        <h3 className={`${dmSans.className} text-2xl font-bold ${textColor}`}>
          {plan.name}
        </h3>
        <p className={`text-sm mt-1 font-medium ${subTextColor}`}>{plan.subtitle}</p>
      </div>

      <div className="mb-8 pb-8 border-b border-current border-opacity-10">
        <div className="flex items-baseline">
          <span className={`text-5xl font-extrabold ${textColor} tracking-tight`}>
            {plan.price}
          </span>
          <span className={`text-sm font-medium ml-2 ${subTextColor}`}>{plan.period}</span>
        </div>
      </div>

      <div className="flex-grow space-y-4 mb-8">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <Check className={`w-5 h-5 shrink-0 ${checkColor}`} />
            <span className={`text-sm font-medium ${isDark ? "text-white/90" : "text-slate-600"}`}>
              {feature}
            </span>
          </div>
        ))}
        {plan.notIncluded.map((feature, i) => (
          <div key={i} className="flex items-start gap-3 opacity-50">
            <X className={`w-5 h-5 shrink-0 ${isDark ? "text-white/30" : "text-slate-300"}`} />
            <span className={`text-sm ${isDark ? "text-white/40" : "text-slate-400"}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelect(plan)}
        className={`w-full py-4 rounded-xl font-bold text-sm transition-all transform active:scale-95 ${plan.buttonColor}`}
      >
        {plan.buttonText}
      </button>
    </motion.div>
  );
}

// --- CHECKOUT MODAL COMPONENT ---
function CheckoutModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Close modal after showing success
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  // If "Free" plan, show simple success immediately or different view
  const isFree = plan.id === "free";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        {/* Left Side: Order Summary */}
        <div className="md:w-5/12 bg-slate-50 p-8 flex flex-col border-r border-slate-100">
          <h3 className={`${dmSans.className} text-xl font-bold text-slate-800 mb-6`}>Order Summary</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-sm text-[#0D7377]">
              {plan.icon}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-lg">{plan.name} Plan</p>
              <p className="text-slate-500 text-sm">{plan.period.replace('/', 'Billed ')}</p>
            </div>
          </div>

          <div className="space-y-4 mb-auto">
            {plan.features.slice(0, 3).map((f, i) => (
              <div key={i} className="flex gap-2 text-sm text-slate-600">
                <Check className="w-4 h-4 text-[#0D7377]" /> {f}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200 mt-6">
            <div className="flex justify-between items-end">
              <span className="text-slate-500 font-medium">Total due today</span>
              <span className="text-3xl font-bold text-[#0D7377]">{plan.price}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="md:w-7/12 p-8 bg-white relative">
          
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Check className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome to ComparatorX!</h3>
              <p className="text-slate-500">Your subscription is active.</p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="h-full flex flex-col">
              <div className="mb-8">
                <h3 className={`${dmSans.className} text-xl font-bold text-slate-800 mb-1`}>
                  {isFree ? "Create Account" : "Payment Details"}
                </h3>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Secure 256-bit SSL encryption
                </p>
              </div>

              <div className="space-y-4 mb-6">
                 {/* Email */}
                 <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                    <input required type="email" placeholder="you@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-[#0D7377] transition-colors" />
                 </div>

                 {!isFree && (
                   <>
                     {/* Card Number */}
                     <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-[#0D7377] transition-colors font-mono" />
                        </div>
                     </div>

                     <div className="flex gap-4">
                       <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Expiry</label>
                          <input required type="text" placeholder="MM/YY" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-[#0D7377] transition-colors font-mono" />
                       </div>
                       <div className="flex-1">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">CVC</label>
                          <input required type="text" placeholder="123" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-[#0D7377] transition-colors font-mono" />
                       </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Cardholder Name</label>
                        <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:border-[#0D7377] transition-colors" />
                     </div>
                   </>
                 )}
              </div>

              <div className="mt-auto pt-4">
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#0D7377] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#095558] transition-all shadow-lg shadow-[#0D7377]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      {isFree ? "Complete Sign Up" : `Pay ${plan.price}`}
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}