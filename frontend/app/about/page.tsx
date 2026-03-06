export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          За <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Skillio</span>
        </h1>
      </div>

      <div className="space-y-16">
        {/* Origin Story */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Как започна всичко
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              <span className="text-2xl font-serif text-amber-600">"</span>
              Започна от един лош контакт. Получих препоръка за треньор по тенис. 
              Оказа се разочарование. Нямаше къде да проверя реални мнения. Нямаше структура.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed text-center font-semibold">
              Така се роди Skillio.
              <span className="text-2xl font-serif text-amber-600">"</span>
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Мисия
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto leading-relaxed">
            Skillio свързва родители с качествени извънкласни дейности — 
            на база <span className="font-semibold text-blue-600">прозрачност</span>, 
            <span className="font-semibold text-purple-600"> реални отзиви</span> и 
            <span className="font-semibold text-green-600"> локalno търсене</span>.
          </p>
          <div className="mt-6 text-center">
            <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-semibold">
              Безплатно - винаги
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600 font-medium">Дейности</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-purple-600 mb-2">200+</div>
            <div className="text-gray-600 font-medium">Партньорски организации</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-green-600 mb-2">5000+</div>
            <div className="text-gray-600 font-medium">Щастливи семейства</div>
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