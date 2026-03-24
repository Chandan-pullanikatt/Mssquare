"use client";

import { useState, useEffect } from "react";
import { 
  HelpCircle, 
  Shield, 
  Plus, 
  Trash2, 
  Save, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { websiteApi } from "@/lib/api/website";

export default function FAQLegalManagement() {
  const [activeTab, setActiveTab] = useState<"faq" | "legal">("faq");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [faqContent, setFaqContent] = useState<any[]>([]);
  const [legalContent, setLegalContent] = useState<any>({
    terms: "",
    privacy: "",
    refund: ""
  });
  const [selectedLegalPage, setSelectedLegalPage] = useState<"terms" | "privacy" | "refund">("terms");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [faqData, termsData, privacyData, refundData] = await Promise.all([
          websiteApi.getSection("landing_faq"),
          websiteApi.getSection("terms_and_conditions"),
          websiteApi.getSection("privacy_policy"),
          websiteApi.getSection("refund_policy")
        ]);

        if (faqData?.content_json) {
            setFaqContent(faqData.content_json.items || []);
        }
        
        setLegalContent({
          terms: termsData?.content_json || null,
          privacy: privacyData?.content_json || null,
          refund: refundData?.content_json || null
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === "faq") {
        await websiteApi.updateSection("landing_faq", {
            badge: "FAQ",
            title: "Common Questions",
            items: faqContent
        });
      } else {
        const sectionMap = {
            terms: "terms_and_conditions",
            privacy: "privacy_policy",
            refund: "refund_policy"
        };
        const sectionName = sectionMap[selectedLegalPage];
        await websiteApi.updateSection(sectionName, legalContent[selectedLegalPage]);
      }
      alert("Changes saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const addFaq = () => {
    setFaqContent([...faqContent, { question: "New Question", answer: "Enter answer here..." }]);
  };

  const removeFaq = (index: number) => {
    setFaqContent(faqContent.filter((_, i) => i !== index));
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    const newFaq = [...faqContent];
    if (direction === 'up' && index > 0) {
      [newFaq[index], newFaq[index - 1]] = [newFaq[index - 1], newFaq[index]];
    } else if (direction === 'down' && index < newFaq.length - 1) {
      [newFaq[index], newFaq[index + 1]] = [newFaq[index + 1], newFaq[index]];
    }
    setFaqContent(newFaq);
  };

  if (loading) return <div className="p-8 text-center">Loading management...</div>;

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-heading">FAQ & Legal</h1>
          <p className="text-gray-500 font-medium text-sm">Manage frequently asked questions and legal documentation.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("faq")}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "faq" ? "bg-white text-[#8b5cf6] shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <HelpCircle size={18} />
          FAQ Items
        </button>
        <button
          onClick={() => setActiveTab("legal")}
          className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "legal" ? "bg-white text-[#8b5cf6] shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Shield size={18} />
          Legal Pages
        </button>
      </div>

      {activeTab === "faq" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Manage Questions</h2>
            <button
              onClick={addFaq}
              className="px-4 py-2 rounded-xl bg-purple-50 text-[#8b5cf6] font-bold text-xs hover:bg-purple-100 transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {faqContent.map((faq, index) => (
              <div key={index} className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm group hover:border-[#8b5cf6]/20 transition-all">
                <div className="flex items-start justify-between gap-6 mb-6">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => moveFaq(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded bg-gray-50 text-gray-400 hover:text-[#8b5cf6] disabled:opacity-0 transition-all"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button 
                        onClick={() => moveFaq(index, 'down')}
                        disabled={index === faqContent.length - 1}
                        className="p-1 rounded bg-gray-50 text-gray-400 hover:text-[#8b5cf6] disabled:opacity-0 transition-all"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={faq.question}
                        onChange={(e) => {
                          const newFaq = [...faqContent];
                          newFaq[index].question = e.target.value;
                          setFaqContent(newFaq);
                        }}
                        className="w-full bg-transparent border-none p-0 text-lg font-bold text-gray-900 focus:ring-0"
                        placeholder="Enter Question"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeFaq(index)}
                    className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <textarea 
                  value={faq.answer}
                  onChange={(e) => {
                    const newFaq = [...faqContent];
                    newFaq[index].answer = e.target.value;
                    setFaqContent(newFaq);
                  }}
                  rows={4}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium text-gray-600 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all resize-none"
                  placeholder="Enter Answer"
                />
              </div>
            ))}

            {faqContent.length === 0 && (
              <div className="py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No FAQ items found</h3>
                <p className="text-gray-500 font-medium mb-6">Start by adding your first frequently asked question.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-2">
            {(["terms", "privacy", "refund"] as const).map((page) => (
              <button
                key={page}
                onClick={() => setSelectedLegalPage(page)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold capitalize transition-all ${
                  selectedLegalPage === page ? "bg-white text-[#8b5cf6] shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  {page} Policy
                </div>
                <ArrowRight size={14} />
              </button>
            ))}
            <div className="p-4 bg-amber-50 rounded-2xl mt-8">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <AlertCircle size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Editor Note</span>
              </div>
              <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                Markdown is supported for legal pages. Use # for headers and * for bullets.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-8 capitalize">Edit {selectedLegalPage} Policy</h2>
              <textarea 
                value={typeof legalContent[selectedLegalPage] === 'object' ? JSON.stringify(legalContent[selectedLegalPage], null, 2) : legalContent[selectedLegalPage]}
                onChange={(e) => {
                    let value = e.target.value;
                    try {
                        value = JSON.parse(e.target.value);
                    } catch (err) {
                        // Keep as string if not valid JSON
                    }
                    setLegalContent({...legalContent, [selectedLegalPage]: value});
                }}
                rows={25}
                className="w-full bg-gray-50 border-none rounded-[2rem] p-8 text-sm font-mono text-gray-700 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all resize-none leading-relaxed"
                placeholder={`Write your legal ${selectedLegalPage} here...`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
