import { useState } from "react";
import { Toaster, toast } from "sonner";
import { User } from "lucide-react";
import { DashboardView } from "./components/DashboardView";
import { supabase } from "./lib/supabase";

// Types
export interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

// Helper to generate mock contacts for simulation (للمحاكاة فقط حتى يتم الربط الفعلي)
const generateMockContacts = (count: number): Omit<Contact, 'id'>[] => {
  const names = ["محمد", "أحمد", "سارة", "خالد", "نورة", "فيصل", "ريم", "عبدالله", "فهد", "منى"];
  const families = ["العتيبي", "القحطاني", "الشمري", "الدوسري", "المالكي", "الزهراني", "الغامدي", "السبيعي"];
  
  return Array.from({ length: count }).map((_, i) => ({
    name: `${names[i % names.length]} ${families[i % families.length]}`,
    phone: `05${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    email: `user${i}@example.com`
  }));
};

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  
  // Sync Progress States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  // Search Functionality
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setContacts([]); 
      return;
    }

    try {
      // البحث في Supabase في جدول contacts
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%`);

      if (error) throw error;

      if (data) {
        setContacts(data as Contact[]);
        if (data.length === 0) {
          toast.info("غير موجود");
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      // رسالة توضيحية في حال لم يتم الربط بعد
      toast.error("تأكد من ربط Supabase للبحث الفعلي");
    }
  };

  // Sync Functionality
  const handleRequestPermission = async () => {
    if (isSyncing || hasPermission) return;
    
    setIsSyncing(true);
    setUploadProgress(0);
    setUploadedCount(0);
    
    try {
      // 1. محاكاة طلب الإذن
      // toast.info("جاري طلب إذن الوصول..."); // تم إزالتها للتركيز على شريط التقدم
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // 2. تجهيز البيانات (محاكاة جلب الأسماء من الهاتف)
      const contactsToUpload = generateMockContacts(50); 
      setTotalToUpload(contactsToUpload.length);
      
      // 3. الرفع لـ Supabase على دفعات
      const batchSize = 5; // تقليل الدفعة لرؤية التقدم بوضوح
      let currentUploaded = 0;

      for (let i = 0; i < contactsToUpload.length; i += batchSize) {
        const batch = contactsToUpload.slice(i, i + batchSize);
        
        // محاولة الرفع الفعلي
        try {
            await supabase.from('contacts').insert(batch);
        } catch (e) {
            // نتجاهل الخطأ هنا لكي يستمر شريط التقدم في العرض (وضع تجريبي)
            console.warn("Supabase insert warning:", e);
        }

        // تحديث شريط التقدم
        currentUploaded += batch.length;
        const safeCount = Math.min(currentUploaded, contactsToUpload.length);
        setUploadedCount(safeCount);
        setUploadProgress(Math.round((safeCount / contactsToUpload.length) * 100));
        
        // تأخير بسيط للمؤثرات البصرية
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setHasPermission(true);
      toast.success("تمت المزامنة بنجاح");
      
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("حدث خطأ أثناء المزامنة");
    } finally {
      setIsSyncing(false);
      // إعادة تعيين التقدم بعد فترة بسيطة
      setTimeout(() => {
        setUploadProgress(0);
        setUploadedCount(0);
      }, 3000);
    }
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
            onSearch={handleSearch}
            uploadProgress={uploadProgress}
            uploadedCount={uploadedCount}
            totalToUpload={totalToUpload}
        />

      </main>
    </div>
  );
}
