# Kashef2025 - دليل النشر (Deployment Guide)

هذا المشروع مهيأ للنشر على **GitHub Pages**.

## الإعدادات الحالية
- **Base Path**: `/Kashef2025/` (في `vite.config.ts`)
- **Homepage**: `https://alnopeapp2025.github.io/Kashef2025/` (في `package.json`)

## خطوات النشر (Deploy)

بما أنك قمت بإعداد السكربتات، يمكنك نشر التحديثات بتشغيل أمر واحد فقط في التيرمينال الخاص بك (على جهازك المحلي):

```bash
npm run deploy
```
أو
```bash
yarn run deploy
```

### ماذا يفعل هذا الأمر؟
1. يقوم بتشغيل `predeploy` (الذي ينفذ `npm run build`) لإنشاء نسخة الإنتاج في مجلد `dist`.
2. يقوم بتشغيل `gh-pages -d dist` لرفع محتويات مجلد `dist` إلى فرع `gh-pages` في مستودع GitHub.

## ملاحظات هامة
- تأكد من وجود ملف `.nojekyll` في مجلد `public` (تمت إضافته بالفعل) لمنع GitHub من تجاهل الملفات.
- إذا واجهت مشاكل في الصلاحيات، تأكد من تسجيل الدخول لـ GitHub في التيرمينال الخاص بك.
