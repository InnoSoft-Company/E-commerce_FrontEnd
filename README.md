# BLANKO Frontend — Next.js

## المتطلبات
- Node.js 18+
- Backend يعمل على http://localhost:8000

## التشغيل

```bash
cd ecommerce-fixed
npm install
npm run dev
```

الموقع يفتح على: http://localhost:3000

## الإعدادات

`.env.local` (موجود بالفعل):
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## الصفحات
- `/` — الصفحة الرئيسية
- `/shop` — المتجر
- `/product/[id]` — تفاصيل المنتج
- `/cart` — السلة
- `/checkout` — الدفع
- `/orders` — طلباتي
- `/wishlist` — المفضلة
- `/profile` — الملف الشخصي
- `/login` — تسجيل الدخول
- `/register` — إنشاء حساب
- `/admin` — لوحة التحكم (admin فقط)
