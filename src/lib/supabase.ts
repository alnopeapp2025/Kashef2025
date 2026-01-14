import { createClient } from '@supabase/supabase-js';

// استرجاع المتغيرات من البيئة
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// دالة للتحقق من صحة الرابط لتجنب توقف التطبيق
const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// استخدام قيم افتراضية آمنة لمنع توقف التطبيق عند عدم وجود الإعدادات
// هذا يسمح للواجهة بالعمل، ولكن الاتصال الفعلي سيفشل حتى يتم ضبط الإعدادات الصحيحة في ملف .env
const supabaseUrl = isValidUrl(envUrl) ? envUrl : 'https://placeholder.supabase.co';
const supabaseKey = envKey || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
