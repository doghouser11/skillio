import Link from 'next/link';
import { Shield, Heart, MessageCircle } from 'lucide-react';

const CATEGORIES = [
  { name: 'Спорт на открито', slug: 'outdoor-sports', icon: '⚽', color: 'bg-green-50 hover:bg-green-100 border-green-200' },
  { name: 'Закрит спорт', slug: 'indoor-sports', icon: '🏀', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
  { name: 'Езици', slug: 'languages', icon: '🌍', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
  { name: 'Природни науки', slug: 'science', icon: '🔬', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
  { name: 'Изкуство', slug: 'art', icon: '🎨', color: 'bg-pink-50 hover:bg-pink-100 border-pink-200' },
  { name: 'Музика и танци', slug: 'music-dance', icon: '🎵', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Намерете перфектната дейност за вашето дете
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10">
            Свързваме родители с проверени специалисти — от спорт и езици до наука и изкуство.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schools" className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              Вижте организации
            </Link>
            <Link href="/register?role=school" className="border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              Регистрирайте се
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
          Разгледайте по категория
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/schools?category=${cat.slug}`}
              className={`${cat.color} border rounded-xl p-6 text-center transition-all duration-200 hover:shadow-md`}
            >
              <div className="text-4xl md:text-5xl mb-3">{cat.icon}</div>
              <div className="font-semibold text-gray-800 text-sm md:text-base">{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trust */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <Shield className="w-10 h-10 text-green-700 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Проверени специалисти</h3>
            <p className="text-gray-600 text-sm">Всички организации минават през одобрение</p>
          </div>
          <div className="p-6">
            <Heart className="w-10 h-10 text-green-700 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Безопасна платформа</h3>
            <p className="text-gray-600 text-sm">Създадена от родители, за родители</p>
          </div>
          <div className="p-6">
            <MessageCircle className="w-10 h-10 text-green-700 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Директна връзка</h3>
            <p className="text-gray-600 text-sm">Свържете се с 1 клик</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-green-700 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Предлагате дейности за деца?</h2>
          <p className="text-lg mb-8 opacity-90">Присъединете се безплатно и достигнете до повече семейства.</p>
          <Link href="/register?role=school" className="bg-white text-green-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Регистрирайте се безплатно
          </Link>
        </div>
      </div>
    </div>
  );
}
