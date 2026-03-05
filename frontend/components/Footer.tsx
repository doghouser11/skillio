import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Minimal Footer Content */}
        <div className="text-center space-y-12">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3">
            <span className="text-4xl">🎓</span>
            <span className="text-3xl font-light text-white">
              Skillio
            </span>
          </div>

          {/* Mission Statement */}
          <p className="text-lg font-light text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Свързваме семейства с качествени извънкласни дейности. 
            Просто, безопасно, ефективно.
          </p>

          {/* Quick Links - Minimal */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <Link href="/activities" className="text-slate-400 hover:text-emerald-400 transition-colors duration-300">
              Дейности
            </Link>
            <Link href="/schools" className="text-slate-400 hover:text-emerald-400 transition-colors duration-300">
              Специалисти
            </Link>
            <Link href="/about" className="text-slate-400 hover:text-emerald-400 transition-colors duration-300">
              За нас
            </Link>
            <Link href="/register" className="text-slate-400 hover:text-emerald-400 transition-colors duration-300">
              Регистрация
            </Link>
          </div>

          {/* Newsletter - Minimal */}
          <div className="max-w-md mx-auto">
            <h3 className="text-white font-normal mb-4">
              Научавайте първи за нови дейности
            </h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Вашият имейл"
                className="flex-1 px-4 py-3 rounded-full bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 border-0"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105">
                ✓
              </button>
            </div>
          </div>
        </div>

        {/* Bottom - Minimal */}
        <div className="border-t border-slate-700 pt-12 text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors duration-300">
              Условия за ползване
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors duration-300">
              Поверителност
            </a>
            <a href="mailto:nikol_bg_93@proton.me" className="hover:text-emerald-400 transition-colors duration-300">
              📧 Контакт
            </a>
          </div>
          
          <div className="text-xs text-slate-500 font-light">
            © {currentYear} Skillio. Направено с ❤️ в България
          </div>
        </div>
      </div>
    </footer>
  );
}