"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Copy, 
  CheckCircle2, 
  Filter, 
  MoreVertical,
  Grid,
  List
} from "lucide-react";
import { storageApi } from "@/lib/api/storage";
import { supabase } from "@/lib/supabase/client";


export default function MediaManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const buckets = ["blog-images", "course-thumbnails", "website-media"];
  const [selectedBucket, setSelectedBucket] = useState(buckets[0]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from(selectedBucket).list();
      if (error) throw error;
      
      const enrichedFiles = data.map(file => {
        const { data: { publicUrl } } = supabase.storage.from(selectedBucket).getPublicUrl(file.name);
        return { ...file, publicUrl };
      });

      setFiles(enrichedFiles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedBucket]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await storageApi.uploadFile(selectedBucket, `${Date.now()}-${file.name}`, file);
      alert("File uploaded successfully!");
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      try {
        const { error } = await supabase.storage.from(selectedBucket).remove([fileName]);
        if (error) throw error;
        setFiles(files.filter(f => f.name !== fileName));
      } catch (err) {
        console.error(err);
        alert("Failed to delete file.");
      }
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 font-heading">Media Manager</h1>
          <p className="text-gray-500 font-medium text-sm">Upload and manage your website's visual assets.</p>
        </div>
        <div className="flex gap-4">
          <label className="px-5 py-3 rounded-2xl bg-[#8b5cf6] text-white font-bold text-sm shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer">
            {uploading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Upload size={18} />}
            <span>{uploading ? "Uploading..." : "Upload Asset"}</span>
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-gray-100 p-6 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl w-fit">
          {buckets.map((bucket) => (
            <button
              key={bucket}
              onClick={() => setSelectedBucket(bucket)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedBucket === bucket
                  ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {bucket.replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-[#8b5cf6] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-[#8b5cf6] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="bg-gray-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none w-64"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-[#8b5cf6]/20 border-t-[#8b5cf6] rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {files.map((file) => (
                <div key={file.id} className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="aspect-square relative bg-gray-50">
                    <img 
                      src={file.publicUrl} 
                      alt={file.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleCopy(file.publicUrl)}
                        className="p-2.5 rounded-xl bg-white text-gray-900 hover:bg-[#8b5cf6] hover:text-white transition-all shadow-lg"
                        title="Copy Public URL"
                      >
                        {copied === file.publicUrl ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(file.name)}
                        className="p-2.5 rounded-xl bg-white text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                        title="Delete Asset"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold text-gray-900 truncate mb-1">{file.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{(file.metadata?.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">File Name</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Size</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                          <img src={file.publicUrl} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm font-bold text-gray-900">{file.name}</td>
                      <td className="px-8 py-4 text-sm font-medium text-gray-500">{(file.metadata?.size / 1024 / 1024).toFixed(2)} MB</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleCopy(file.publicUrl)}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#8b5cf6] hover:bg-purple-50 transition-all"
                          >
                            {copied === file.publicUrl ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                          </button>
                          <button 
                            onClick={() => handleDelete(file.name)}
                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {files.length === 0 && (
            <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
              <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No assets found</h3>
              <p className="text-gray-500 font-medium mb-6">Start by uploading your first visual asset.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
