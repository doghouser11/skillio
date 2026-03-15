'use client';

import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [schoolCount, setSchoolCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const familyCount = 30; // Starting seed

  useEffect(() => {
    const API = 'https://api.skillio.live';
    fetch(`${API}/api/schools/`).then(r => r.json()).then(d => setSchoolCount(Array.isArray(d) ? d.length : 0)).catch(() => {});
    setActivityCount(8); // 8 категории дейности
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 max-w-full overflow-x-hidden">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-6">
          За <span className="text-[#2D5A27]">Skillio</span>
        </h1>
      </div>

      <div className="space-y-16">
        {/* Origin Story */}
        <div className="comic-card p-6 md:p-8" style={{backgroundColor: '#FDF6EC'}}>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-6 text-center">
            Как започна всичко
          </h2>
          <div className="prose max-w-none">
            <p className="text-base md:text-lg text-[#1A1A1A] leading-relaxed mb-6">
              <span className="text-2xl font-serif text-[#FFB1B1]">"</span>
              Започна от един лош контакт. Получих препоръка за треньор по тенис. 
              Оказа се разочарование. Нямаше къде да проверя реални мнения. Нямаше структура.
            </p>
            <p className="text-base md:text-lg text-[#1A1A1A] leading-relaxed text-center font-semibold">
              Така се роди Skillio.
              <span className="text-2xl font-serif text-[#FFB1B1]">"</span>
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="comic-card p-6 md:p-8" style={{backgroundColor: 'white'}}>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-6 text-center">
            Мисия
          </h2>
          <p className="text-base md:text-lg text-[#1A1A1A] text-center max-w-2xl mx-auto leading-relaxed">
            Skillio свързва родители с качествени извънкласни дейности — 
            на база <span className="font-semibold text-[#2D5A27]">прозрачност</span>, 
            <span className="font-semibold text-[#FFB1B1]"> реални отзиви</span> и 
            <span className="font-semibold text-[#2D5A27]"> локално търсене</span>.
          </p>
          <div className="mt-6 text-center">
            <span className="inline-block bg-[#2D5A27] text-white px-6 py-3 rounded-full text-lg font-semibold border-2 border-black">
              Безплатно - винаги ✨
            </span>
          </div>
        </div>

        {/* Mission & Progress */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 border-2 border-black">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">
              Градим Skillio заедно 🤝
            </h2>
            <p className="text-xl text-[#1A1A1A] max-w-3xl mx-auto leading-relaxed">
              Нашата мисия е да свържем всяко дете с неговия талант. 
              Виж колко близо сме до целта:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Activities Progress */}
            <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-lg">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🌱</div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Дейности</h3>
                <div className="text-3xl font-bold text-[#2D5A27] mb-1">{activityCount} / 12</div>
                <div className="text-sm text-gray-600">цели за годината</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 border border-black">
                <div 
                  className="bg-[#2D5A27] h-3 rounded-full border-r border-black" 
                  style={{width: `${Math.max((activityCount / 12) * 100, 1)}%`}}
                ></div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">Растем всеки ден!</div>
            </div>

            {/* Organizations Progress */}
            <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-lg">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🏫</div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Организации</h3>
                <div className="text-3xl font-bold text-[#2D5A27] mb-1">{schoolCount} / 500</div>
                <div className="text-sm text-gray-600">цели за годината</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 border border-black">
                <div 
                  className="bg-[#2D5A27] h-3 rounded-full border-r border-black" 
                  style={{width: `${Math.max((schoolCount / 500) * 100, 1)}%`}}
                ></div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">Качествени връзки</div>
            </div>

            {/* Families Progress */}
            <div className="bg-white rounded-3xl p-6 border-2 border-black shadow-lg">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">❤️</div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Семейства</h3>
                <div className="text-3xl font-bold text-[#2D5A27] mb-1">{familyCount} / 5000</div>
                <div className="text-sm text-gray-600">цели за годината</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 border border-black">
                <div 
                  className="bg-[#2D5A27] h-3 rounded-full border-r border-black" 
                  style={{width: `${Math.max((familyCount / 5000) * 100, 1)}%`}}
                ></div>
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">Общността расте!</div>
            </div>
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-3 bg-[#FFB1B1] px-6 py-3 rounded-3xl border-2 border-black">
              <span className="text-2xl">🏔️</span>
              <span className="font-bold text-[#1A1A1A]">Изкачваме планината заедно!</span>
            </div>
          </div>
        </div>

        {/* What We Solve */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Какво решаваме
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex items-start space-x-4">
              <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
                <span className="text-2xl">❌</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Няма информация</h3>
                <p className="text-gray-600">
                  Преди не можеше да провериш учители и организации. Разчиташе на препоръки от приятели.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Реални отзиви</h3>
                <p className="text-gray-600">
                  Сега четеш истински мнения от други родители за всяка организация и активност.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Хаотично търсене</h3>
                <p className="text-gray-600">
                  Facebook групи, Google търсения, обаждания наляво и надясно за да намериш нещо подходящо.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Структурирано търсене</h3>
                <p className="text-gray-600">
                  Филтри по възраст, град, цена, категория. Намираш точно това, което търсиш за 2 минути.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Promise */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Нашето обещание
          </h2>
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-block bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-4xl mb-4">💯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Винаги безплатно за родители</h3>
                <p className="text-gray-600">
                  Няма скрити такси. Няма премиум планове. Достъпът до информацията е право, не привилегия.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl mb-2">🔍</div>
                  <h4 className="font-semibold text-gray-900">Проверени партньори</h4>
                  <p className="text-sm text-gray-600">Всяка организация преминава през одит</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="text-2xl mb-2">💬</div>
                  <h4 className="font-semibold text-gray-900">Истински отзиви</h4>
                  <p className="text-sm text-gray-600">От реални родители за реални преживявания</p>
                </div>
              </div>
            </div>
            <div className="text-center pt-4">
              <div className="inline-flex items-center bg-blue-500 text-white px-6 py-3 rounded-full">
                <span className="mr-2">🇧🇬</span>
                Направено в България от родители, за родители
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Готови да започнете?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/activities"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Разгледайте дейности
            </a>
            <a
              href="/register"
              className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Създайте профил
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}