export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          За <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Skillio</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Ние създадохме Skillio, за да свържем родители с най-добрите извънкласни дейности в България
        </p>
      </div>

      <div className="space-y-16">
        {/* Mission */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Нашата мисия
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto leading-relaxed">
            Да помогнем на всяко дете да открие своите таланти и да развие уменията си 
            в безопасна, вдъхновяваща и професионална среда.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600 font-medium">Дейности</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-purple-600 mb-2">200+</div>
            <div className="text-gray-600 font-medium">Партньорски училища</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-4xl font-bold text-green-600 mb-2">5000+</div>
            <div className="text-gray-600 font-medium">Щастливи семейства</div>
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Нашите ценности
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Качество</h3>
                <p className="text-gray-600">
                  Всички партньори са внимателно подбрани и проверени от нашия екип
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 rounded-full p-3 flex-shrink-0">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Доверие</h3>
                <p className="text-gray-600">
                  Изграждаме дългосрочни отношения, основани на прозрачност и отворена комуникация
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 rounded-full p-3 flex-shrink-0">
                <span className="text-2xl">🌟</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Иновация</h3>
                <p className="text-gray-600">
                  Постоянно развиваме платформата за по-добро потребителско преживяване
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 rounded-full p-3 flex-shrink-0">
                <span className="text-2xl">❤️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Грижа</h3>
                <p className="text-gray-600">
                  Всяко дете заслужава възможността да развие пълния си потенциал
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-gray-50 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Нашият екип
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            Ние сме група от родители, педагози и технологични ентусиасти, 
            обединени от общата цел да подобрим образованието в България.
          </p>
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-500 text-white px-6 py-3 rounded-full">
              <span className="mr-2">🇧🇬</span>
              Направено в България с любов
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