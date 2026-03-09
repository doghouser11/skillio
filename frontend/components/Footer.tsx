import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-semibold text-white">Skillio</span>
        </div>
        <p className="text-sm max-w-md mx-auto">
          Свързваме семейства с качествени извънкласни дейности.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/activities" className="hover:text-white transition-colors">Дейности</Link>
          <Link href="/schools" className="hover:text-white transition-colors">Организации</Link>
          <Link href="/about" className="hover:text-white transition-colors">За нас</Link>
          <Link href="/register" className="hover:text-white transition-colors">Регистрация</Link>
        </div>
        <div className="border-t border-gray-800 pt-6 text-xs space-y-3">
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">Условия за ползване</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Поверителност</Link>
            <a href="mailto:nikol_93_bg@proton.me" className="hover:text-white transition-colors">📧 Контакт</a>
          </div>
          <div>© {new Date().getFullYear()} Skillio. Направено с ❤️ в България</div>
        </div>
      </div>
    </footer>
  );
}
