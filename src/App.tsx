import { useState } from "react";
import { Toaster, toast } from "sonner";
import { User } from "lucide-react";
import { DashboardView } from "./components/DashboardView";

// Types
export interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

// Mock Data
const MOCK_CONTACTS: Contact[] = [
  { id: 1, name: "أحمد محمد", phone: "050 123 4567", email: "ahmed@example.com" },
  { id: 2, name: "سارة علي", phone: "055 987 6543", email: "sara@example.com" },
  { id: 3, name: "خالد عبدالله", phone: "054 321 0987", email: "khaled@example.com" },
  { id: 4, name: "نورة سعد", phone: "056 789 0123", email: "noura@example.com" },
  { id: 5, name: "فيصل عمر", phone: "059 111 2233", email: "faisal@example.com" },
  { id: 6, name: "ريم القحطاني", phone: "053 444 5566", email: "reem@example.com" },
];

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleRequestPermission = async () => {
    if (isSyncing || hasPermission) return;
    
    setIsSyncing(true);
    
    // بدء العملية في الخلفية (دون تعطيل الواجهة)
    const syncProcess = async () => {
        // 1. Simulate Permission Request
        toast.info("جاري طلب الإذن...");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // 2. Simulate Fetching
        toast.loading("جاري جلب جهات الاتصال...");
        // نظهر البيانات للمستخدم بمجرد "جلبها" حتى لو الرفع لسا شغال
        setContacts(MOCK_CONTACTS); 
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 3. Simulate Uploading to DB (Background)
        toast.loading("جاري رفع البيانات للسحابة...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setHasPermission(true);
        setIsSyncing(false);
        toast.success("تمت المزامنة والرفع بنجاح!");
    };

    // تنفيذ العملية
    syncProcess();
  };

  return (
    <div className="min-h-screen bg-[#FFD700] text-black font-['Cairo',_sans-serif] p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="w-full max-w-md flex flex-col gap-4 relative z-10 h-full min-h-[80vh]">
        
        {/* Header */}
        <header className="flex items-center justify-between pt-4 pb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">كاشف الأرقام</h1>
            <p className="text-black/60 font-medium text-sm mt-1">
              {hasPermission ? "متصل بالسحابة" : "مزامنة ونسخ احتياطي"}
            </p>
          </div>
          <div className="bg-black/5 p-3 rounded-2xl backdrop-blur-sm">
            <User className="w-6 h-6" />
          </div>
        </header>

        {/* Unified View */}
        <DashboardView 
            contacts={contacts} 
            hasPermission={hasPermission}
            isSyncing={isSyncing}
            onSync={handleRequestPermission}
        />

      </main>
    </div>
  );
}
