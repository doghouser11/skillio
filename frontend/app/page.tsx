import Link from 'next/link';
import { ExternalLink, Star, Users, Heart, Sparkles, Target, Shield, MessageCircle, Search, Zap } from 'lucide-react';

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
    <div className="min-h-screen max-w-full overflow-x-hidden bg-gray-50">
      {/* Hero Section - Clean Style */}
      <div className="text-center pt-16 md:pt-20 pb-16 md:pb-24 px-4 md:px-6 bg-white">
        
        
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-[#1A1A1A] leading-tight mb-8">
            Намерете перфектната дейност
            <span className="block">
              за вашето дете!
            </span>
          </h1>
          
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg md:text-2xl text-[#1A1A1A] mb-6 leading-relaxed font-medium">
              Свързваме майки с качествени специалисти 
            </p>
            <p className="text-base md:text-xl text-[#1A1A1A] leading-relaxed opacity-80">
              От танци и спорт до програмиране и езици - всичко проверено и безопасно ✨
            </p>
          </div>
          
          <div className="flex flex-col gap-4 md:flex-row md:gap-6 justify-center items-center mb-12 md:mb-16">
            <Link
              href="/activities"
              className="clean-button w-full md:w-auto px-8 py-3 text-lg font-semibold text-center"
            >
              Започнете сега
            </Link>
            <Link
              href="/schools"
              className="w-full md:w-auto text-[#2D5A27] hover:text-white bg-white border-2 border-[#2D5A27] px-6 py-3 text-lg font-semibold transition-colors duration-200 text-center rounded-lg hover:bg-[#2D5A27]"
            >
              Вижте организации
            </Link>
          </div>
          
          {/* Trust indicators - Mobile Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-[#1A1A1A] text-base md:text-lg font-medium max-w-4xl mx-auto">
            <span className="flex items-center gap-3 comic-card px-4 md:px-6 py-3">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#2D5A27]" />
              Проверени специалисти
            </span>
            <span className="flex items-center gap-3 comic-card px-4 md:px-6 py-3">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-[#FFB1B1]" />
              Безопасна платформа
            </span>
            <span className="flex items-center gap-3 comic-card px-4 md:px-6 py-3">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-[#2D5A27]" />
              Директна връзка
            </span>
          </div>
        </div>

        {/* Featured Activities */}
        {activities.length > 0 ? (
          <div className="mb-16 md:mb-20 px-4 md:px-6">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] mb-8 md:mb-12 text-center">
              🌟 Популярни дейности
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
              {activities.slice(0, 6).map((activity: any) => (
                <Link 
                  key={activity.id} 
                  href={`/activities/${activity.id}`}
                  className="clean-card p-6 hover:shadow-md transition-all duration-200 block relative group"
                >
                  {/* Heart Icon */}
                  <div className="absolute top-6 right-6">
                    <Heart className="w-6 h-6 text-[#FFB1B1] group-hover:fill-current transition-all duration-200" />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-bold text-2xl text-[#2D5A27] mb-4 line-clamp-2">
                      {activity.title}
                    </h3>
                    <p className="text-[#1A1A1A] text-base line-clamp-3 mb-4 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-base mb-4">
                    <span className="bg-[#2D5A27] text-white px-4 py-2 rounded-3xl font-semibold border-2 border-black">
                      {activity.category}
                    </span>
                    <span className="text-[#1A1A1A] font-bold text-lg">
                      {activity.price_monthly || 'Безплатно'}
                    </span>
                  </div>
                  
                  {(activity.age_min || activity.age_max) && (
                    <div className="text-base text-[#1A1A1A] font-medium">
                      🎂 {activity.age_min && `от ${activity.age_min}г`} {activity.age_max && `до ${activity.age_max}г`}
                    </div>
                  )}
                </Link>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                href="/activities"
                className="clean-button px-10 py-4 text-xl font-semibold"
              >
                Вижте всички дейности
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-16 md:mb-20 px-4 md:px-6">
            <div className="clean-card p-12 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                В момента няма активни дейности
              </h2>
              <p className="text-gray-600 text-lg">
                Бъдете първи и добавете вашата дейност!
              </p>
            </div>
          </div>
        )}

        {/* Featured Schools */}
        {featuredSchools.length > 0 && (
          <div className="mb-16 md:mb-20 px-4 md:px-6">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] mb-8 md:mb-12 text-center">
              👩‍🏫 Топ организации
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
              {featuredSchools.slice(0, 6).map((school: any) => (
                <div key={school.id} className="clean-card p-6 hover:shadow-md transition-all duration-200 relative group">
                  {/* Heart Icon */}
                  <div className="absolute top-6 right-6">
                    <Heart className="w-6 h-6 text-[#FFB1B1] group-hover:fill-current transition-all duration-200" />
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-2xl text-[#2D5A27] line-clamp-2 pr-8">
                        {school.name}
                      </h3>
                      {school.website && (
                        <a 
                          href={school.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#1A1A1A] hover:text-[#2D5A27] transition-colors"
                          title="Посети сайт"
                        >
                          <ExternalLink className="w-6 h-6 stroke-2" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-[#1A1A1A] text-base line-clamp-3 mb-4 leading-relaxed">
                      {school.description || 'Професионални услуги за вашето дете'}
                    </p>
                  </div>
                  
                  {/* Rating and location */}
                  <div className="flex items-center justify-between text-base mb-4">
                    <div className="flex items-center space-x-2">
                      {school.rating && school.rating > 0 ? (
                        <>
                          <Star className="w-5 h-5 text-[#FFB1B1] fill-current" />
                          <span className="font-bold text-[#1A1A1A]">
                            {school.rating}
                          </span>
                          <span className="text-[#1A1A1A]">
                            ({school.reviews_count || 0})
                          </span>
                        </>
                      ) : (
                        <span className="text-[#FFB1B1] text-base font-medium">🆕 Ново</span>
                      )}
                    </div>
                    
                    <span className="text-[#1A1A1A] font-bold text-lg">
                      📍 {school.city}
                    </span>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-2 mb-6">
                    {school.phone && (
                      <a 
                        href={`tel:${school.phone}`}
                        className="text-base text-[#2D5A27] hover:underline block font-medium"
                      >
                        📞 {school.phone}
                      </a>
                    )}
                    {school.email && (
                      <a 
                        href={`mailto:${school.email}`}
                        className="text-base text-[#2D5A27] hover:underline block font-medium"
                      >
                        ✉️ {school.email}
                      </a>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex justify-center">
                    {school.website ? (
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="clean-button px-6 py-3 text-base font-semibold"
                      >
                        Посети сайт
                      </a>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        Няма налична информация
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                href="/schools"
                className="comic-button px-10 py-4 text-xl font-semibold inline-flex items-center gap-3"
              >
                Вижте всички организации <Target className="w-6 h-6" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Benefits Section - Comic Style */}
      <div className="py-16 md:py-32" style={{backgroundColor: 'white'}}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl font-semibold text-[#1A1A1A] mb-6 md:mb-8">
              Защо майките ни обичат?
            </h2>
            <p className="text-lg md:text-2xl text-[#1A1A1A] max-w-3xl mx-auto leading-relaxed">
              Опростяваме процеса, за да имате повече време за важното ✨
            </p>
          </div>
          
          <div className="space-y-16 md:space-y-24">
            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
              <div className="lg:w-1/2 text-center lg:text-left">
                <div className="mb-6 md:mb-8">
                  <Search className="w-16 h-16 md:w-20 md:h-20 text-[#2D5A27] mx-auto lg:mx-0 stroke-2" />
                </div>
                <h3 className="text-2xl md:text-4xl font-semibold text-[#1A1A1A] mb-4 md:mb-6">
                  Намерете бързо и лесно
                </h3>
                <p className="text-lg md:text-xl text-[#1A1A1A] leading-relaxed">
                  Без безкрайни търсения и телефонни обаждания! 
                  Всичко на едно място - филтрирайте по възраст, местоположение и бюджет.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="comic-card h-60 md:h-80 flex items-center justify-center relative overflow-hidden">
                  <Target className="w-24 h-24 md:w-32 md:h-32 text-[#FFB1B1] stroke-2" />
                  <div className="absolute top-4 right-4 md:top-6 md:right-6">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-[#2D5A27]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row-reverse items-center gap-8 md:gap-16">
              <div className="lg:w-1/2 text-center lg:text-left">
                <div className="mb-6 md:mb-8">
                  <Shield className="w-16 h-16 md:w-20 md:h-20 text-[#FFB1B1] mx-auto lg:mx-0 stroke-2" />
                </div>
                <h3 className="text-2xl md:text-4xl font-semibold text-[#1A1A1A] mb-4 md:mb-6">
                  Спокойствие и сигурност
                </h3>
                <p className="text-lg md:text-xl text-[#1A1A1A] leading-relaxed">
                  Всички учители, треньори и студиа са проверени! Четете отзиви от други майки 
                  и направете информиран избор.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="comic-card h-60 md:h-80 flex items-center justify-center relative overflow-hidden">
                  <Heart className="w-24 h-24 md:w-32 md:h-32 text-[#2D5A27] stroke-2" />
                  <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                    <Star className="w-6 h-6 md:w-8 md:h-8 text-[#FFB1B1] fill-current" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
              <div className="lg:w-1/2 text-center lg:text-left">
                <div className="mb-6 md:mb-8">
                  <MessageCircle className="w-16 h-16 md:w-20 md:h-20 text-[#2D5A27] mx-auto lg:mx-0 stroke-2" />
                </div>
                <h3 className="text-2xl md:text-4xl font-semibold text-[#1A1A1A] mb-4 md:mb-6">
                  Директна връзка
                </h3>
                <p className="text-lg md:text-xl text-[#1A1A1A] leading-relaxed">
                  Изпратете запитване с 1 клик! Учителят или студиото ще се свърже с вас директно 
                  за подробности и свободни места.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="comic-card h-60 md:h-80 flex items-center justify-center relative overflow-hidden">
                  <Zap className="w-24 h-24 md:w-32 md:h-32 text-[#FFB1B1] stroke-2" />
                  <div className="absolute top-4 right-4 md:top-6 md:right-6">
                    <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-[#2D5A27]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA for Schools - Comic Style */}
      <div className="py-16 md:py-32" style={{backgroundColor: '#FDF6EC'}}>
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6 relative">
          {/* Decorative elements - Hidden on mobile */}
          <div className="hidden md:block absolute -top-10 -left-10">
            <Sparkles className="w-12 h-12 text-[#FFB1B1] stroke-2" />
          </div>
          <div className="hidden md:block absolute -top-5 -right-8">
            <Target className="w-10 h-10 text-[#2D5A27] stroke-2" />
          </div>
          
          <h2 className="text-3xl md:text-6xl font-semibold text-[#1A1A1A] mb-6 md:mb-8 leading-tight">
            Предлагате дейности за деца?
          </h2>
          <p className="text-lg md:text-2xl text-[#1A1A1A] mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto">
            Свържете се с майки, които активно търсят качествени програми 
            за своите деца! 🚀
          </p>
          <Link
            href="/register?role=school"
            className="comic-button px-8 py-4 md:px-12 md:py-6 text-lg md:text-2xl font-semibold inline-flex items-center gap-3 md:gap-4"
          >
            🎉 Присъединете се безплатно
            <Zap className="w-6 h-6 md:w-8 md:h-8" />
          </Link>
        </div>
      </div>

      {/* How It Works - Comic Style */}
      <div className="py-16 md:py-32" style={{backgroundColor: 'white'}}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl font-semibold text-[#1A1A1A] mb-6 md:mb-8">
              Как работи?
            </h2>
            <p className="text-lg md:text-2xl text-[#1A1A1A]">
              Три прости стъпки до идеалната дейност! ✨
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[
              { 
                icon: Search, 
                number: "1", 
                title: "Търсете и филтрирайте", 
                desc: "Намерете дейности по локация, възраст и интереси на детето си" 
              },
              { 
                icon: MessageCircle, 
                number: "2", 
                title: "Свържете се директно", 
                desc: "Изпратете запитване с 1 клик - без формуляри и телефонни обаждания" 
              },
              { 
                icon: Sparkles, 
                number: "3", 
                title: "Започвайте", 
                desc: "Детето ви започва новото си приключение в проверена и безопасна среда" 
              }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="comic-card p-6 md:p-8 h-full relative hover:-translate-y-2 transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 md:-top-6 left-6 md:left-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FFB1B1] border-2 border-black rounded-full flex items-center justify-center">
                      <span className="text-lg md:text-xl font-bold text-[#1A1A1A]">{item.number}</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 md:pt-8">
                    <item.icon className="w-12 h-12 md:w-16 md:h-16 text-[#2D5A27] mx-auto mb-4 md:mb-6 stroke-2" />
                    <h3 className="text-xl md:text-2xl font-semibold text-[#1A1A1A] mb-3 md:mb-4">{item.title}</h3>
                    <p className="text-base md:text-lg text-[#1A1A1A] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 md:mt-16">
            <Link
              href="/activities"
              className="comic-button px-8 py-4 md:px-12 md:py-6 text-lg md:text-2xl font-semibold inline-flex items-center gap-3 md:gap-4"
            >
              🚀 Започнете сега
              <Heart className="w-6 h-6 md:w-8 md:h-8" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}