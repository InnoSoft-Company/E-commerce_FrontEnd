
import { FaFacebookF, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">اتصل بنا - BLANKO</h1>

      <p className="text-gray-700 leading-relaxed text-lg mb-8 text-center">
        يمكنك التواصل معنا عبر أي من الطرق التالية، وسنحرص على الرد عليك في أسرع وقت ممكن:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {/* الفيسبوك */}
        <a
          href="https://www.facebook.com/BLANKOshop" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FaFacebookF size={30} className="mx-auto mb-2" />
          <span className="block font-semibold">Facebook</span>
        </a>

        {/* واتساب */}
        <a
          href="https://wa.me/201234567890" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600 transition"
        >
          <FaWhatsapp size={30} className="mx-auto mb-2" />
          <span className="block font-semibold">WhatsApp</span>
        </a>

        {/* الهاتف */}
        <a
          href="tel:+201097182681" 
          className="bg-gray-800 text-white p-6 rounded-lg shadow hover:bg-gray-900 transition"
        >
          <FaPhoneAlt size={30} className="mx-auto mb-2" />
          <span className="block font-semibold">الهاتف</span>
        </a>
      </div>

      <p className="text-gray-500 mt-12 text-center">
        © 2026 جميع الحقوق محفوظة لمتجر BLANKO
      </p>
    </div>
  );
}