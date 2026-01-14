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

// محاكاة لجهات الاتصال (لأن المتصفح لا يملك صلاحية الوصول لجهات الاتصال الحقيقية)
const generateMockContacts = (count: number): Contact[] => {
  const names = ["محمد", "أحمد", "سارة", "خالد", "نورة", "فيصل", "ريم", "عبدالله", "فهد", "منى", "سلطان", "جواهر"];
  const families = ["العتيبي", "القحطاني", "الشمري", "الدوسري", "المالكي", "الزهراني", "الغامدي", "السبيعي", "المطيري"];
  
  // إنشاء معرف جهاز وهمي لهذه الجلسة
  const mockDeviceId = `device_${Math.floor(Math.random() * 100000)}`;

  return Array.from({ length: count }).map((_, i) => ({
    name: `${names[i % names.length]} ${families[i % families.length]}`,
    phone: `05${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
    device_id: mockDeviceId
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

  // 2. دالة البحث الحقيقي في Supabase
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setContacts([]); 
      return;
    }

    const toastId = toast.loading("جاري البحث...");

    try {
      // البحث في جدول Cashif عن الاسم أو الرقم
      const { data, error } = await supabase
        .from('Cashif')
        .select('*')
        .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(20); // تحديد عدد النتائج

      toast.dismiss(toastId);

      if (error) {
        console.error("Supabase search error:", error);
        throw error;
      }

      if (data && data.length > 0) {
        setContacts(data as Contact[]);
        toast.success(`تم العثور على ${data.length} نتيجة`);
      } else {
        setContacts([]);
        toast.info("لم يتم العثور على نتائج مطابقة");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.dismiss(toastId);
      toast.error("حدث خطأ في الاتصال بقاعدة البيانات");
    }
  };

  // 3. دالة المزامنة والرفع الحقيقي
  const handleRequestPermission = async () => {
    if (isSyncing || hasPermission) return;
    
    setIsSyncing(true);
    setUploadProgress(0);
    setUploadedCount(0);
    
    try {
      // محاكاة طلب الإذن (شكلياً)
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // توليد بيانات للمزامنة (بديلة عن سحب جهات الاتصال الحقيقية)
      const contactsToUpload = generateMockContacts(20); // رفع 20 اسم للتجربة
      setTotalToUpload(contactsToUpload.length);
      
      // الرفع لـ Supabase (جدول Cashif) على دفعات
      const batchSize = 5; 
      let currentUploaded = 0;

      for (let i = 0; i < contactsToUpload.length; i += batchSize) {
        const batch = contactsToUpload.slice(i, i + batchSize);
        
        // الرفع الفعلي
        const { error } = await supabase.from('Cashif').insert(batch);
        
        if (error) {
            console.error("Error inserting batch:", error);
            toast.error(`فشل رفع بعض الأسماء: ${error.message}`);
            // لا نوقف العملية بالكامل، نحاول اكمال الباقي
        }

        // تحديث شريط التقدم
        currentUploaded += batch.length;
        const safeCount = Math.min(currentUploaded, contactsToUpload.length);
        setUploadedCount(safeCount);
        setUploadProgress(Math.round((safeCount / contactsToUpload.length) * 100));
        
        // تأخير بسيط لرؤية التقدم
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      setHasPermission(true);
      toast.success("تمت المزامنة ورفع الأسماء لقاعدة البيانات بنجاح!");
      
      // تحديث القائمة بالأسماء التي تم رفعها للتو لرؤيتها
      setContacts(contactsToUpload);

    } catch (error) {
      console.error("Sync error:", error);
      toast.error("حدث خطأ غير متوقع أثناء المزامنة");
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
      
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="w-full max-w-md flex flex-col gap-4 relative z-10 h-full min-h-[80vh]">
        
        {/* Header - Updated Title */}
        <header className="flex items-center justify-between pt-4 pb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">كاشف الأرقام <span className="text-sm font-normal opacity-70">v. 2</span></h1>
            <p className="text-black/60 font-medium text-sm mt-1">
              {hasPermission ? "متصل بقاعدة البيانات" : "بحث ومزامنة سحابية"}
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
