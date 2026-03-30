
export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">سياسات الطلبات والتوصيل</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">1. تجهيز الطلبات</h2>
        <p className="text-gray-700 leading-relaxed">
          - يتم تجهيز الطلبات خلال <span className="font-semibold">من يوم إلى ثلاثة أيام عمل</span>.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          - قد تختلف مدة التوصيل حسب موقع العميل.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          - يجب تأكيد الطلب <span className="font-semibold">هاتفياً</span> قبل عملية الشحن.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          - يتوفر التوصيل إلى جميع محافظات جمهورية مصر العربية.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">2. العناية بالمنتجات</h2>
        <p className="text-gray-700 leading-relaxed">
          - يُفضَّل غسل المنتج من الداخل بدرجة حرارة منخفضة.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          - يُمنع استخدام الكلور أو المنظفات القوية.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          - يُكوى المنتج على درجة حرارة منخفضة للحفاظ على جودة الطباعة.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          - منتجاتنا صُممت لتدوم طويلاً؛ فاحرص على العناية بها كما تستحق.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">3. سياسة الاستبدال والاسترجاع</h2>
        <p className="text-gray-700 leading-relaxed">
          - يسمح باستبدال المنتج خلال <span className="font-semibold">ثلاثة أيام</span> من تاريخ الاستلام.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          - يُشترط أن يكون المنتج غير مستخدم، وغير مغسول، وفي حالته الأصلية مرفقًا بطاقة التعريف.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          - لا يُتاح الاسترجاع النقدي؛ ويقتصر الأمر على الاستبدال أو الحصول على رصيد للشراء لاحقًا.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          - يتحمل العميل رسوم الشحن في حالة الاستبدال، إلا إذا كان المنتج يعاني من عيب تصنيعي.
        </p>
      </section>

      <p className="text-gray-500 mt-12 text-center">
        © 2026 جميع الحقوق محفوظة لمتجر BLANKO
      </p>
    </div>
  );
}