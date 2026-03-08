import Link from 'next/link';

const CATEGORIES = [
  { name: 'Спорт на открито', slug: 'outdoor-sports', icon: '⚽', desc: 'Футбол, тенис, лека атлетика и още' },
  { name: 'Закрит спорт', slug: 'indoor-sports', icon: '🏀', desc: 'Баскетбол, плуване, гимнастика' },
  { name: 'Езици', slug: 'languages', icon: '🌍', desc: 'Английски, немски, испански и други' },
  { name: 'Природни науки', slug: 'science', icon: '🔬', desc: 'Експерименти, роботика, програмиране' },
  { name: 'Изкуство', slug: 'art', icon: '🎨', desc: 'Рисуване, керамика, фотография' },
  { name: 'Музика и танци', slug: 'music-dance', icon: '🎵', desc: 'Пиано, китара, балет, модерни танци' },
];

export default function ActivitiesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Дейности</h1>
      <p className="text-gray-600 mb-10">Изберете категория и вижте организациите, които я предлагат.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            href={`/schools?category=${cat.slug}`}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-green-300 transition-all group"
          >
            <div className="text-4xl mb-4">{cat.icon}</div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-green-700 transition-colors">{cat.name}</h3>
            <p className="text-gray-500 text-sm">{cat.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/schools" className="text-green-700 hover:text-green-800 font-medium">
          Или разгледайте всички организации →
        </Link>
      </div>
    </div>
  );
}
