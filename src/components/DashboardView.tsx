import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Phone, MoreVertical, X, User } from "lucide-react";
import { Contact } from "../App";
import { Button } from "./ui/Button";

interface DashboardViewProps {
  contacts: Contact[];
}

export function DashboardView({ contacts }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.includes(searchQuery) || contact.phone.includes(searchQuery)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full relative"
    >
      {/* Sticky Search Header */}
      <div className="sticky top-0 z-30 pb-4 pt-2 -mx-4 px-4 bg-[#FFD700]/95 backdrop-blur-sm transition-all">
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
              className="w-full h-full bg-white border-2 border-black/5 rounded-xl pr-10 pl-10 text-base focus:outline-none focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
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
            className="px-6 rounded-xl shadow-sm"
            onClick={() => {
              // Optional: Add specific search logic here if needed beyond real-time filtering
              console.log("Searching for:", searchQuery);
            }}
          >
            بحث
          </Button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        <div className="flex items-center justify-between mb-4 px-1 mt-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5" />
            جهات الاتصال
          </h2>
          <span className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {filteredContacts.length}
          </span>
        </div>

        <motion.div layout className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer border border-black/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black font-bold text-lg border border-black/5">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{contact.name}</span>
                      <div className="flex items-center text-sm text-gray-500 gap-2 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span className="dir-ltr font-medium">{contact.phone}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-black/5 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center text-black/40"
              >
                <div className="bg-black/5 p-4 rounded-full mb-4">
                  <Search className="w-8 h-8 opacity-40" />
                </div>
                <p className="font-medium">لا توجد نتائج مطابقة</p>
                <p className="text-sm mt-1 opacity-60">جرب البحث بكلمات مختلفة</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
