import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🎓</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Skillio
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base">
              Най-голямата платформа за детски извънкласни дейности в България. 
              Свързваме семейства с качествени образователни програми.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Бърз достъп</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/activities" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1">
                  Всички дейности
                </Link>
              </li>
              <li>
                <Link href="/schools" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1">
                  Партньорски училища
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1">
                  За нас
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1">
                  Регистрация
                </Link>
              </li>
            </ul>
          </div>

          {/* For Parents */}
          <div>
            <h3 className="text-lg font-semibold mb-4">За родители</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register?role=parent" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1">
                  Създай профил
                </Link>
              </li>
              <li>
                <Link href="/activities" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1">
                  Търси дейности
                </Link>
              </li>
              <li>
                <Link href="/schools" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base block py-1">
                  Прегледай училища
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup - Mobile Optimized */}
        <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Получавайте новини за нови дейности</h3>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              Бъдете първи, които ще научат за нови партньори и интересни курсове
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Вашият имейл адрес"
                className="flex-1 px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg sm:rounded-l-none sm:rounded-r-lg font-semibold transition-colors duration-200 text-sm sm:text-base">
                Записване
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Mobile Optimized */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-gray-400 text-xs sm:text-sm text-center lg:text-left">
              © {currentYear} Skillio. Всички права запазени. Направено в България 🇧🇬
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 whitespace-nowrap">
                Условия за ползване
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 whitespace-nowrap">
                Политика за поверителност
              </a>
              <a href="mailto:nikol_bg_93@proton.me" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 whitespace-nowrap">
                📧 nikol_bg_93@proton.me
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}