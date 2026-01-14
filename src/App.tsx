import { useState } from "react";
import { Toaster, toast } from "sonner";
import { User } from "lucide-react";
import { DashboardView } from "./components/DashboardView";
import { supabase } from "./lib/supabase";

// 1. تحديث الواجهة لتطابق الجدول في الصورة (Cashif)
export interface Contact {
  id?: number; // اختياري عند الرفع، إجباري عند القراءة
  name: string;
  phone: string;
  device_id?: string | null;
  created_at?: string;
}

// محاكاة لجهات الاتصال
const generateMockContacts = (count: number): Contact[] => {
  const names = ["محمد", "أحمد", "سارة", "خالد", "نورة", "فيصل", "ريم", "عبدالله", "فهد", "منى", "سلطان", "جواهر"];
  const families = ["العتيبي", "القحطاني", "الشمري", "الدوسري", "المالكي", "الزهراني", "الغامدي", "السبيعي", "المطيري"];
  const mockDeviceId = `device_${Math.floor(Math.random() * 100000)}`;

  return Array.from({ length: count }).map((_, i) => ({
    name: `${names[i % names.length]} ${families[i % families.length]}`,
    phone: `05${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    device_id: mockDeviceId
  }));
};

export default function App() {
  const [hasPermission, setHasPermission] = useState(false); // هل تم منح الإذن؟
  const [isSyncing, setIsSyncing] = useState(false); // هل جاري الرفع؟
  const [contacts, setContacts] = useState<Contact[]>([]); // نتائج البحث
  
  // Sync Progress States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalToUpload, setTotalToUpload] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  // دالة البحث الحقيقي في Supabase
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setContacts([]); 
      return;
    }

    // إزالة التنبيهات السابقة لتسريع الشعور بالاستجابة
    toast.dismiss();
    const toastId = toast.loading("جاري البحث...");

    try {
      // البحث في جدول Cashif
      const { data, error } = await supabase
        .from('Cashif')
        .select('*')
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(20);

      toast.dismiss(toastId);

      if (error) {
        console.error("Supabase search error:", error);
        throw error;
      }

      if (data && data.length > 0) {
        setContacts(data as Contact[]);
        // toast.success(`تم العثور على ${data.length} نتيجة`); // تم تقليل الإشعارات لسرعة التصفح
      } else {
        setContacts([]);
        toast.info("لم يتم العثور على نتائج في القاعدة");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.dismiss(toastId);
      toast.error("خطأ في الاتصال");
    }
  };

  // 1. طلب الإذن فقط
  const handleGrantPermission = () => {
    const toastId = toast.loading("جاري طلب الصلاحية...");
    setTimeout(() => {
        setHasPermission(true);
        toast.dismiss(toastId);
        toast.success("تم منح الصلاحية. يمكنك الآن رفع الأسماء.");
    }, 800);
  };

  // 2. الرفع للقاعدة (المزامنة)
  const handleUploadContacts = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    setUploadProgress(0);
    setUploadedCount(0);
    
    try {
      const contactsToUpload = generateMockContacts(20);
      setTotalToUpload(contactsToUpload.length);
      
      const batchSize = 5; 
      let currentUploaded = 0;

      for (let i = 0; i < contactsToUpload.length; i += batchSize) {
        const batch = contactsToUpload.slice(i, i + batchSize);
        
        const { error } = await supabase.from('Cashif').insert(batch);
        
        if (error) {
            console.error("Error inserting batch:", error);
        }

        currentUploaded += batch.length;
        const safeCount = Math.min(currentUploaded, contactsToUpload.length);
        setUploadedCount(safeCount);
        setUploadProgress(Math.round((safeCount / contactsToUpload.length) * 100));
        
        await new Promise((resolve) => setTimeout(resolve, 100)); // تقليل التأخير لتسريع العملية
      }

      toast.success("تم رفع الأسماء لقاعدة البيانات بنجاح!");
      
      // هام: لا نقوم بتحديث الـ contacts هنا.
      // القائمة تظل فارغة أو تعرض نتائج البحث السابق فقط.
      // يجب على المستخدم البحث لرؤية الأسماء من القاعدة.

    } catch (error) {
      console.error("Sync error:", error);
      toast.error("حدث خطأ أثناء الرفع");
    } finally {
      setIsSyncing(false);
      setTimeout(() => {
        setUploadProgress(0);
        setUploadedCount(0);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFD700] text-black font-['Cairo',_sans-serif] p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      <Toaster position="top-center" richColors />
      
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-md flex flex-col gap-4 relative z-10 h-full min-h-[80vh]">
        
        {/* Header - Updated Version to v.6 */}
        <header className="flex items-center justify-between pt-4 pb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">كاشف الأرقام <span className="text-sm font-normal opacity-70">v. 6</span></h1>
            <p className="text-black/60 font-medium text-sm mt-1">
              {hasPermission ? "جاهز للبحث والمزامنة" : "مطلوب إذن الوصول"}
            </p>
          </div>
          <div className="bg-black/5 p-3 rounded-2xl backdrop-blur-sm">
            <User className="w-6 h-6" />
          </div>
        </header>

        <DashboardView 
            contacts={contacts} 
            hasPermission={hasPermission}
            isSyncing={isSyncing}
            onGrantPermission={handleGrantPermission}
            onUpload={handleUploadContacts}
            onSearch={handleSearch}
            uploadProgress={uploadProgress}
            uploadedCount={uploadedCount}
            totalToUpload={totalToUpload}
        />

      </main>
    </div>
  );
}
