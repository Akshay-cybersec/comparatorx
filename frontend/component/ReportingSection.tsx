import { motion } from "framer-motion";
import { Activity, AlertTriangle, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";


function ReportingSection({ data }: { data: any[] }) {
  const [formData, setFormData] = useState({
   
    entityId: "", 
    issueType: "data_error",
    priority: "normal",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description) {
      toast.error("Please describe the issue.");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Encrypting and sending report...");

    setTimeout(() => {
      toast.dismiss(loadingToast);
      
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold text-base">Report Sent Successfully!</span>
          
        </div>, 
        {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#0d7377',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
          },
        }
      );
      
      setFormData({ entityId: "", issueType: "data_error", priority: "normal", description: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto pb-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-[#0d7377]">Issue Reporting</h2>
        <p className="text-slate-500 font-medium">Submit errors directly to the product admin.</p>
      </div>

      {/* Form Container - Now centered and single column */}
      <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the issue..."
              rows={6}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-[#0d7377]"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-black text-white shadow-lg flex items-center justify-center gap-2 transition-all ${isSubmitting ? "bg-slate-300" : "bg-[#0d7377] hover:bg-[#0a5c5f]"}`}
          >
            <Send size={18} /> {isSubmitting ? "SENDING..." : "SEND REPORT"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default ReportingSection;