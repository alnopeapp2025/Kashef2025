import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Phone, MoreVertical, X, User, CloudUpload, ShieldCheck, Smartphone, CheckCircle2 } from "lucide-react";
import { Contact } from "../App";
import { Button } from "./ui/Button";

interface DashboardViewProps {
  contacts: Contact[];
  hasPermission: boolean;
  isSyncing: boolean;
  onGrantPermission: () => void;
  onUpload: () => void;
  onSearch: (query: string) => void;
  uploadProgress: number;
  uploadedCount: number;
  totalToUpload: number;
}

export function DashboardView({ 
    contacts, 
    hasPermission, 
    isSyncing, 
    onGrantPermission,
    onUpload,
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
      {/* 1. Search Section (Updated Layout) */}
      <div className="sticky top-0 z-30 pt-2 bg-[#FFD700] pb-2 flex flex-col gap-3">
        {/* Input Box */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-black/40 group-focus-within:text-black transition-colors" />
          </div>
          <input
            type="text"
            placeholder="ابحث بالاسم أو الرقم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
            className="w-full bg-white border-2 border-black/5 rounded-xl pr-10 pl-10 text-base focus:outline-none focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all shadow-sm py-3"
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

        {/* Search Button (Below Input) */}
        <Button 
          className="w-full rounded-xl shadow-sm bg-black text-yellow-400 hover:bg-gray-900 py-3 text-lg"
          onClick={handleSearchClick}
        >
          بحث في القاعدة
        </Button>
      </div>

      {/* 2. Sync/Permission Section (Separated Logic) */}
      <div className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-sm mb-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-black/5 p-2 rounded-full">
              <CloudUpload className="w-5 h-5 text-black/70" />
          </div>
          <div className="flex-1">
              <h3 className="font-bold text-sm">مزامنة البيانات</h3>
              <p className="text-xs text-black/60">
                {!hasPermission ? "مطلوب إذن الوصول أولاً" : "جاهز لرفع الأسماء"}
              </p>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {!hasPermission ? (
            <motion.div
                key="permission-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <Button 
                    onClick={onGrantPermission} 
                    className="w-full shadow-md bg-white text-black hover:bg-gray-50 border border-black/10"
                    variant="ghost"
                >
                    <ShieldCheck className="w-4 h-4 ml-2" />
                    منح صلاحية الوصول لجهات الاتصال
                </Button>
            </motion.div>
          ) : (
            <motion.div
                key="upload-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
            >
                {!isSyncing ? (
                    <Button 
                        onClick={onUpload} 
                        className="w-full shadow-md"
                        variant="primary"
                    >
                        <CloudUpload className="w-4 h-4 ml-2" />
                        رفع الأسماء للقاعدة
                    </Button>
                ) : (
                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs font-bold px-1">
                            <span>جاري الرفع...</span>
                            <span>{uploadedCount} / {totalToUpload}</span>
                        </div>
                        <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-black"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                )}
                
                {!isSyncing && (
                    <div className="flex items-center justify-center gap-1 text-[10px] text-green-700 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>تم منح الصلاحية بنجاح</span>
                    </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Contacts List (Results Only) */}
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar min-h-[200px]">
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
                    {searchQuery ? "غير موجود في قاعدة البيانات" : "القائمة فارغة"}
                </p>
                <p className="text-sm mt-1 opacity-60 max-w-[200px]">
                    {searchQuery ? "تأكد من الرقم أو الاسم وحاول مرة أخرى" : "استخدم البحث أعلاه للعثور على الأسماء في قاعدة البيانات"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
