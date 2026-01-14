import { motion } from "framer-motion";
import { ShieldCheck, CloudUpload, Smartphone, ArrowDown } from "lucide-react";
import { Button } from "./ui/Button";

interface PermissionViewProps {
  onGrant: () => void;
  isSyncing: boolean;
}

export function PermissionView({ onGrant, isSyncing }: PermissionViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center flex-1 py-12 text-center gap-8"
    >
      {/* Illustration */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150" />
        <div className="relative bg-white/40 backdrop-blur-md p-8 rounded-full shadow-xl shadow-black/5 border border-white/50">
          <CloudUpload className="w-16 h-16 text-black/80" />
        </div>
        
        {/* Floating Icons */}
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute -right-4 -top-2 bg-black text-yellow-400 p-2 rounded-full shadow-lg"
        >
          <Smartphone className="w-5 h-5" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
          className="absolute -left-4 bottom-2 bg-white text-black p-2 rounded-full shadow-lg"
        >
          <ShieldCheck className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Text */}
      <div className="space-y-3 max-w-xs">
        <h2 className="text-2xl font-bold">مطلوب إذن الوصول</h2>
        <p className="text-black/60 leading-relaxed">
          للبدء في استخدام التطبيق والبحث، نحتاج إلى إذن للوصول لجهات الاتصال لرفعها وتأمينها في قاعدة البيانات.
        </p>
      </div>

      {/* Action */}
      <div className="w-full space-y-4">
        <Button 
          onClick={onGrant} 
          isLoading={isSyncing}
          className="w-full text-lg py-6 shadow-xl shadow-black/10 hover:shadow-black/20"
          size="lg"
        >
          {isSyncing ? "جاري المعالجة..." : "منح الإذن والمزامنة"}
        </Button>
        
        {!isSyncing && (
          <p className="text-xs text-black/40 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            بياناتك مشفرة وآمنة 100%
          </p>
        )}
      </div>
    </motion.div>
  );
}
