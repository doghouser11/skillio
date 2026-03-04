import Link from 'next/link';
import { ExternalLink, Star, Users } from 'lucide-react';

async function getActivities() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.skillio.live';
  try {
    // 🔥 КРИТИЧНО: Добавен /api prefix
    const res = await fetch(`${apiUrl}/api/activities`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      console.error('API Error:', res.status, res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Backend connection failed:", error);
    return [];
  }
}

async function getFeaturedSchools() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.skillio.live';
  try {
    const res = await fetch(`${apiUrl}/api/schools/featured`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      console.error('Featured Schools API Error:', res.status, res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Featured schools fetch failed:", error);
    return [];
  }
}

export default async function HomePage() {
  const [activities, featuredSchools] = await Promise.all([
    getActivities(),
    getFeaturedSchools()
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Открийте перфектната 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">
              дейност за детето си
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Свържете се с най-добрите училища и учители в България. 
            Помогнете на детето си да развие талантите си в безопасна и вдъхновяваща среда.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/activities"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Разгледай дейности
            </Link>
            <Link
              href="/register"
              className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200"
            >
              Регистрация за родители
            </Link>
          </div>
        </div>

        {/* Featured Activities */}
        {activities.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Популярни дейности в момента
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {activities.slice(0, 6).map((activity: any) => (
                <Link 
                  key={activity.id} 
                  href={`/activities/${activity.id}`}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-blue-600 mb-2 line-clamp-2">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {activity.category}
                    </span>
                    <span className="text-gray-500 font-medium">
                      {activity.price_monthly ? `${activity.price_monthly} лв./мес` : 'Безплатно'}
                    </span>
                  </div>
                  
                  {(activity.age_min || activity.age_max) && (
                    <div className="mt-3 text-xs text-gray-500">
                      Възраст: {activity.age_min && `от ${activity.age_min}г`} {activity.age_max && `до ${activity.age_max}г`}
                    </div>
                  )}
                </Link>
              ))}
            </div>
            
            <div className="mt-8">
              <Link 
                href="/activities"
                className="text-blue-500 hover:text-blue-600 font-semibold text-lg transition-colors duration-200"
              >
                Вижте всички дейности →
              </Link>
            </div>
          </div>
        )}

        {/* Featured Schools */}
        {featuredSchools.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Топ агенции и учители
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredSchools.slice(0, 6).map((school: any) => (
                <div key={school.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-green-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-green-600 line-clamp-1">
                          {school.name}
                        </h3>
                        {school.website && (
                          <a 
                            href={school.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-green-600 transition-colors"
                            title="Посети сайт"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {school.description || 'Професионални услуги за вашето дете'}
                      </p>
                      
                      {/* Rating and location */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          {school.average_rating > 0 ? (
                            <>
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-medium text-gray-700">
                                {school.average_rating.toFixed(1)}
                              </span>
                              <span className="text-gray-500">
                                ({school.review_count})
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">Нови</span>
                          )}
                        </div>
                        
                        <span className="text-gray-500 font-medium">
                          {school.city}
                        </span>
                      </div>

                      {/* Contact info */}
                      <div className="mt-3 space-y-1">
                        {school.phone && (
                          <a 
                            href={`tel:${school.phone}`}
                            className="text-xs text-blue-600 hover:underline block"
                          >
                            📞 {school.phone}
                          </a>
                        )}
                        {school.email && (
                          <a 
                            href={`mailto:${school.email}`}
                            className="text-xs text-blue-600 hover:underline block"
                          >
                            ✉️ {school.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-2 mt-4">
                    <Link
                      href={`/schools/${school.id}`}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                    >
                      Детайли
                    </Link>
                    {school.website && (
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        Сайт
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Link 
                href="/schools"
                className="text-green-500 hover:text-green-600 font-semibold text-lg transition-colors duration-200"
              >
                Вижте всички агенции →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl mx-4">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Защо родителите избират Skillio?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110">
                <span className="text-3xl text-white">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Персонализирано търсене</h3>
              <p className="text-gray-600 leading-relaxed">
                Филтрирайте по местоположение, възраст, категория и цена. 
                Намерете точно това, което търсите за вашето дете.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-400 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110">
                <span className="text-3xl text-white">🏫</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Проверени партньори</h3>
              <p className="text-gray-600 leading-relaxed">
                Всички училища и учители са внимателно проверени от нашия екип. 
                Четете отзиви от други родители.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-110">
                <span className="text-3xl text-white">📞</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Директна връзка</h3>
              <p className="text-gray-600 leading-relaxed">
                Изпратете запитване директно до училищата. 
                Те ще се свържат с вас с подробности и свободни места.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA for Schools */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white shadow-xl">
          <h2 className="text-4xl font-bold mb-6">
            Имате училище или организирате курсове?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Присъединете се към нашата платформа и се свържете с родители, 
            които търсят качествени извънкласни програми за своите деца.
          </p>
          <Link
            href="/register?role=school"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
          >
            Регистрирайте училището си
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Как работи?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Търсете", desc: "Намерете дейности по местоположение и възраст" },
              { step: "2", title: "Сравнете", desc: "Прегледайте детайли, цени и отзиви" },
              { step: "3", title: "Свържете се", desc: "Изпратете запитване към училищата" },
              { step: "4", title: "Започнете", desc: "Вашето дете започва новото си приключение" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}