import { X } from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-[500px] overflow-hidden shadow-2xl anim-fup">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
          <h3 className="text-[1.2rem] font-bold text-white font-heading">Request a Quote</h3>
          <button 
            onClick={onClose}
            className="text-muted hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form className="p-6 flex flex-col gap-4 text-left" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8rem] text-muted font-medium">Full Name <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              className="bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-white text-[0.9rem] focus:outline-none focus:border-primary-cyan/50 transition-colors" 
              placeholder="John Doe"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8rem] text-muted font-medium">Company <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              className="bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-white text-[0.9rem] focus:outline-none focus:border-primary-cyan/50 transition-colors" 
              placeholder="Your Company Inc."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8rem] text-muted font-medium">Project Type <span className="text-red-500">*</span></label>
            <select 
              required
              className="bg-card border border-border rounded-md px-3 py-2.5 text-foreground text-[0.9rem] focus:outline-none focus:border-primary-cyan/50 transition-colors"
            >
              <option value="" disabled selected>Select a service</option>
              <option value="product_engineering">Product Engineering</option>
              <option value="ai_implementation">AI Implementation</option>
              <option value="cto_service">CTO-as-a-Service</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.8rem] text-muted font-medium">Budget Range <span className="text-red-500">*</span></label>
            <select 
              required
              className="bg-card border border-border rounded-md px-3 py-2.5 text-foreground text-[0.9rem] focus:outline-none focus:border-primary-cyan/50 transition-colors"
            >
              <option value="" disabled selected>Select budget</option>
              <option value="<10k">Under $10,000</option>
              <option value="10k-50k">$10,000 - $50,000</option>
              <option value="50k-100k">$50,000 - $100,000</option>
              <option value=">100k">$100,000+</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 mb-2">
            <label className="text-[0.8rem] text-muted font-medium">Brief Description <span className="text-red-500">*</span></label>
            <textarea 
              required
              rows={4}
              className="bg-white/5 border border-border rounded-md px-3 py-2 text-foreground text-[0.9rem] focus:outline-none focus:border-primary-cyan/50 transition-colors resize-none" 
              placeholder="Tell us about your project goals and timeframe..."
            ></textarea>
          </div>

          <button 
            type="submit"
            className="hover-btn w-full bg-primary-cyan hover:bg-primary-cyan/80 text-white font-semibold py-3 rounded-md transition-all duration-200"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
