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

// Helper to generate mock contacts for simulation
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
      setContacts([]); // Clear results if empty
      return;
    }

    try {
      // البحث في Supabase
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
      // Fallback for demo if Supabase is not connected
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
      // 1. Simulate Permission Request
      toast.info("جاري طلب إذن الوصول لجهات الاتصال...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // 2. Simulate Fetching Contacts from Phone
      const contactsToUpload = generateMockContacts(50); // Simulating 50 contacts
      setTotalToUpload(contactsToUpload.length);
      
      // 3. Uploading to Supabase in Batches
      const batchSize = 10;
      let currentUploaded = 0;

      for (let i = 0; i < contactsToUpload.length; i += batchSize) {
        const batch = contactsToUpload.slice(i, i + batchSize);
        
        // محاولة الرفع لـ Supabase
        try {
            const { error } = await supabase.from('contacts').insert(batch);
            if (error) {
                // إذا فشل الرفع (بسبب عدم وجود اتصال حقيقي)، نكمل المحاكاة فقط للعرض
                console.warn("Supabase insert failed (expected if not connected):", error);
            }
        } catch (e) {
            console.warn("Upload error", e);
        }

        // Update Progress
        currentUploaded += batch.length;
        setUploadedCount(Math.min(currentUploaded, contactsToUpload.length));
        setUploadProgress(Math.round((currentUploaded / contactsToUpload.length) * 100));
        
        // Delay for visual effect
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setHasPermission(true);
      toast.success("تمت المزامنة بنجاح");
      
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("حدث خطأ أثناء المزامنة");
    } finally {
      setIsSyncing(false);
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
        setUploadedCount(0);
      }, 2000);
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
