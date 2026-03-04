import Link from 'next/link';

// Функция за извикване на реалните данни от Python бекенда
async function getActivities() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.skillio.live';
  try {
    const res = await fetch(`${apiUrl}/activities`, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Backend connection failed:", error);
    return [];
  }
}

export default async function HomePage() {
  // Вземаме данните от бекенда преди рендериране
  const activities = await getActivities();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          <h1>HELLO FROM CLOUD V2 - [07:27]</h1>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover extracurricular activities, connect with schools, and help your child 
          explore their interests in a safe and engaging environment.
        </p>
        
        {/* СЕКЦИЯ ЗА РЕАЛНИ ДАННИ (Добавена под Hero) */}
        {activities.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Latest Activities from Backend:</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.slice(0, 3).map((activity: any) => (
                <div key={activity.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-blue-600">{activity.title || activity.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Link
            href="/activities"
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600"
          >
            Browse Activities
          </Link>
          <Link
            href="/register"
            className="border border-blue-500 text-blue-500 px-8 py-3 rounded-lg text-lg hover:bg-blue-50"
          >
            Join as Parent
          </Link>
        </div>
      </div>

      {/* Features Grid - Запазваме го, за да не се губи структурата */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="text-center p-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Find Activities</h3>
          <p className="text-gray-600">
            Browse activities by location, age group, and category. 
            Filter to find exactly what your child needs.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏫</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Trusted Schools</h3>
          <p className="text-gray-600">
            All schools are verified by our team. Read reviews from other 
            parents to make informed decisions.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📞</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy Contact</h3>
          <p className="text-gray-600">
            Send interest requests directly to schools. They&apos;ll contact you 
            with availability and next steps.
          </p>
        </div>
      </div>

      {/* CTA for Schools */}
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Are You a School or Activity Provider?
        </h2>
        <p className="text-gray-600 mb-6">
          Join our platform to showcase your activities and connect with parents 
          looking for quality extracurricular programs.
        </p>
        <Link
          href="/register?role=school"
          className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-600 inline-block"
        >
          Register Your School
        </Link>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              1
            </div>
            <h4 className="font-semibold mb-2">Browse</h4>
            <p className="text-sm text-gray-600">Find activities by location and age</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              2
            </div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p className="text-sm text-gray-600">Send interest request to schools</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              3
            </div>
            <h4 className="font-semibold mb-2">Connect</h4>
            <p className="text-sm text-gray-600">Schools respond with details</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
              4
            </div>
            <h4 className="font-semibold mb-2">Enroll</h4>
            <p className="text-sm text-gray-600">Start your child&apos;s journey</p>
          </div>
        </div>
      </div>
    </div>
  );
}
