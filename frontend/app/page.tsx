import Link from 'next/link';
import { ExternalLink, Star, Users } from 'lucide-react';

async function getActivities() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.skillio.live';
  try {
    // Emergency endpoint - bypass CORS issues
    const res = await fetch(`${apiUrl}/api/emergency/activities`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      console.error('Emergency API Error:', res.status, res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Emergency backend connection failed:", error);
    return [];
  }
}

async function getFeaturedSchools() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.skillio.live';
  try {
    // Emergency endpoint - bypass CORS issues  
    const res = await fetch(`${apiUrl}/api/emergency/schools`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) {
      console.error('Emergency Schools API Error:', res.status, res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Emergency schools fetch failed:", error);
    return [];
  }
}

export default async function HomePage() {
  const [activities, featuredSchools] = await Promise.all([
    getActivities(),
    getFeaturedSchools()
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section - Headspace Inspired */}
      <div className="text-center pt-16 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-slate-800 mb-6 leading-[1.1] tracking-tight">
            Намерете перфектната
            <span className="block text-emerald-600 font-normal">
              дейност за вашето дете
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-emerald-700 mb-6 leading-relaxed max-w-3xl mx-auto font-normal">
            Свързваме семейства с качествени извънкласни дейности. 
            Просто, безопасно, ефективно.
          </p>
          
          <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
            От танци и спорт до програмиране и езици - открийте подходящия 
            учител, треньор или студио за вашето дете.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/activities"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center min-w-[200px]"
            >
              Започнете сега
            </Link>
            <Link
              href="/schools"
              className="w-full sm:w-auto text-slate-600 hover:text-emerald-600 px-8 py-4 text-lg font-medium transition-all duration-300 text-center underline underline-offset-4"
            >
              Разгледайте специалисти
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              Проверени специалисти
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              Безопасна платформа
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              Директна връзка
            </span>
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

      {/* Benefits Section - Headspace Style */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-light text-slate-800 mb-6">
              Защо майките ни избират?
            </h2>
            <p className="text-lg text-slate-600 font-light max-w-2xl mx-auto">
              Опростяваме процеса, за да имате повече време за важното
            </p>
          </div>
          
          <div className="space-y-20">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-2xl font-normal text-slate-800 mb-4">
                  Намерете бързо и лесно
                </h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Без безкрайни търсения и телефонни обаждания. 
                  Всичко на едно място - филтрирайте по възраст, местоположение и бюджет.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="w-full h-64 bg-emerald-50 rounded-3xl flex items-center justify-center">
                  <span className="text-6xl text-emerald-300">🎯</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-2xl font-normal text-slate-800 mb-4">
                  Спокойствие и сигурност
                </h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Всички учители, треньори и студиа са проверени. Четете отзиви от други майки 
                  и направете информиран избор.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="w-full h-64 bg-slate-50 rounded-3xl flex items-center justify-center">
                  <span className="text-6xl text-slate-300">🛡️</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h3 className="text-2xl font-normal text-slate-800 mb-4">
                  Директна връзка
                </h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Изпратете запитване с 1 клик. Учителят или студиото ще се свърже с вас директно 
                  за подробности и свободни места.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="w-full h-64 bg-blue-50 rounded-3xl flex items-center justify-center">
                  <span className="text-6xl text-blue-300">💬</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA for Schools - Soft Style */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl sm:text-4xl font-light text-slate-800 mb-6">
            Предлагате дейности за деца?
          </h2>
          <p className="text-lg text-slate-600 mb-10 font-light leading-relaxed">
            Свържете се с родители, които активно търсят качествени програми 
            за своите деца
          </p>
          <Link
            href="/register?role=school"
            className="inline-flex items-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Присъединете се безплатно
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>

      {/* How It Works - Minimal */}
      <div className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-light text-slate-800 mb-4">
              Как работи?
            </h2>
            <p className="text-lg text-slate-600 font-light">
              Три прости стъпки до идеалната дейност
            </p>
          </div>
          
          <div className="space-y-16">
            {[
              { emoji: "🔍", title: "Търсете и филтрирайте", desc: "Намерете дейности по локация, възраст и интереси на детето си" },
              { emoji: "💬", title: "Свържете се директно", desc: "Изпратете запитване с 1 клик - без формуляри и телефонни обаждания" },
              { emoji: "🎉", title: "Започвайте", desc: "Детето ви започва новото си приключение в проверена и безопасна среда" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 text-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{item.emoji}</span>
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <h3 className="text-xl font-normal text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-600 font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}