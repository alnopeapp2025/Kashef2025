import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Phone, MoreVertical, X, User, CloudUpload, ShieldCheck, Smartphone } from "lucide-react";
import { Contact } from "../App";
import { Button } from "./ui/Button";

interface DashboardViewProps {
  contacts: Contact[];
  hasPermission: boolean;
  isSyncing: boolean;
  onSync: () => void;
  onSearch: (query: string) => void;
  uploadProgress: number;
  uploadedCount: number;
  totalToUpload: number;
}

export function DashboardView({ 
    contacts, 
    hasPermission, 
    isSyncing, 
    onSync, 
    onSearch,
    uploadProgress,
    uploadedCount,
    totalToUpload
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    onSearch(searchQuery);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full relative gap-4"
    >
      {/* 1. Search Section (Always Visible) */}
      <div className="sticky top-0 z-30 pt-2 bg-[#FFD700] pb-2">
        <div className="flex items-stretch gap-2">
          {/* Search Input Box */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black/40 group-focus-within:text-black transition-colors" />
            </div>
            <input
              type="text"
              placeholder="ابحث بالاسم أو الرقم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
              className="w-full h-full bg-white border-2 border-black/5 rounded-xl pr-10 pl-10 text-base focus:outline-none focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all shadow-sm py-3"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-black/40 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <Button 
            className="px-6 rounded-xl shadow-sm bg-black text-yellow-400 hover:bg-gray-900"
            onClick={handleSearchClick}
          >
            بحث
          </Button>
        </div>
      </div>

      {/* 2. Sync/Permission Button (Visible if not synced yet) */}
      <AnimatePresence>
        {!hasPermission && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-black/5 p-2 rounded-full">
                    <CloudUpload className="w-5 h-5 text-black/70" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-sm">مزامنة جهات الاتصال</h3>
                    <p className="text-xs text-black/60">رفع الأسماء لقاعدة البيانات (Cashif)</p>
                </div>
              </div>
              
              {!isSyncing ? (
                <Button 
                    onClick={onSync} 
                    className="w-full shadow-md"
                    variant="primary"
                >
                    منح الإذن والمزامنة
                </Button>
              ) : (
                <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs font-bold px-1">
                        <span>جاري الرفع لـ Supabase...</span>
                        <span>{uploadedCount} / {totalToUpload}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-black"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <div className="text-center text-[10px] text-black/50 font-medium">
                        {uploadProgress}% مكتمل
                    </div>
                </div>
              )}
              
              {!isSyncing && (
                <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-black/40">
                    <ShieldCheck className="w-3 h-3" />
                    <span>اتصال آمن ومشفر</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Contacts List */}
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar min-h-[300px]">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5" />
            النتائج
          </h2>
          {contacts.length > 0 && (
            <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {contacts.length}
            </span>
          )}
        </div>

        <motion.div layout className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <motion.div
                  key={contact.id || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer border border-black/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black font-bold text-lg border border-black/5 shrink-0">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-gray-900 truncate">{contact.name}</span>
                      <div className="flex items-center text-sm text-gray-500 gap-2 mt-0.5">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span className="dir-ltr font-medium truncate">{contact.phone}</span>
                      </div>
                      {contact.device_id && (
                         <div className="flex items-center text-[10px] text-gray-400 gap-1 mt-1">
                            <Smartphone className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">{contact.device_id}</span>
                         </div>
                      )}
                    </div>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-black/5 rounded-full transition-colors shrink-0">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center text-black/40 bg-white/20 rounded-3xl border border-white/30 backdrop-blur-sm mx-2"
              >
                <div className="bg-white/40 p-4 rounded-full mb-4 shadow-inner">
                  <Search className="w-8 h-8 opacity-40" />
                </div>
                <p className="font-bold text-black/60">
                    {searchQuery ? "غير موجود في قاعدة البيانات" : "لا توجد نتائج"}
                </p>
                <p className="text-sm mt-1 opacity-60 max-w-[200px]">
                    {!hasPermission 
                        ? "قم بالمزامنة أولاً لملء قاعدة البيانات" 
                        : searchQuery ? "جرب البحث برقم أو اسم آخر" : "ابدأ البحث أعلاه"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
