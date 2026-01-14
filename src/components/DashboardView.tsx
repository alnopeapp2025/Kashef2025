import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Phone, MoreVertical, X } from "lucide-react";
import { Contact } from "../App";

interface DashboardViewProps {
  contacts: Contact[];
}

export function DashboardView({ contacts }: DashboardViewProps) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.includes(searchQuery) || contact.phone.includes(searchQuery)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-4 w-full h-full"
    >
      {/* Search Bar Area */}
      <div className="sticky top-0 z-20 pb-2">
        {!isSearchActive ? (
          <motion.button
            layoutId="search-bar"
            onClick={() => setIsSearchActive(true)}
            className="w-full bg-white/40 backdrop-blur-md border-2 border-transparent hover:bg-white/50 rounded-2xl py-4 px-4 flex items-center gap-3 text-black/50 shadow-sm transition-all group"
          >
            <Search className="w-5 h-5 group-hover:text-black transition-colors" />
            <span className="text-lg">اضغط للبحث في جهات الاتصال...</span>
          </motion.button>
        ) : (
          <motion.div 
            layoutId="search-bar"
            className="relative"
          >
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-black" />
            </div>
            <input
              autoFocus
              type="text"
              placeholder="ابحث بالاسم أو الرقم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-black/10 rounded-2xl py-4 pr-12 pl-12 text-lg focus:outline-none focus:border-black/30 shadow-lg"
            />
            <button 
              onClick={() => {
                setIsSearchActive(false);
                setSearchQuery("");
              }}
              className="absolute inset-y-0 left-0 pl-4 flex items-center text-black/40 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-lg font-bold">كل جهات الاتصال</h2>
          <span className="bg-black/5 px-3 py-1 rounded-full text-sm font-medium">
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
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer border border-white/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center text-black font-bold text-xl shadow-inner">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">{contact.name}</span>
                      <div className="flex items-center text-sm text-gray-500 gap-3">
                        <span className="flex items-center gap-1 dir-ltr">
                           {contact.phone} <Phone className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-black hover:bg-black/5 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-12 text-black/40"
              >
                <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>لا توجد نتائج مطابقة</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
