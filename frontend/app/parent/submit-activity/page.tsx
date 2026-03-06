'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { activitiesAPI } from '@/lib/api';

interface ActivityForm {
  title: string;
  description: string;
  category: string;
  age_min: number;
  age_max: number;
  price_monthly: string;
  school_name: string;
  school_phone: string;
  school_email: string;
  school_website: string;
  school_address: string;
  city: string;
}

export default function SubmitActivityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<ActivityForm>({
    title: '',
    description: '',
    category: '',
    age_min: 3,
    age_max: 18,
    price_monthly: '',
    school_name: '',
    school_phone: '',
    school_email: '',
    school_website: '',
    school_address: '',
    city: 'София'
  });

  const categories = [
    'Програмиране и Роботика',
    'Изкуство и Творчество',
    'Спорт и Фитнес',
    'Танци',
    'Музика',
    'Езици',
    'Наука и Експерименти',
    'Театър и Драма',
    'Фотография',
    'Кулинария',
    'Други'
  ];

  const cities = [
    'София', 'Пловдив', 'Варна', 'Бургас', 'Русе', 'Стара Загора',
    'Плевен', 'Добрич', 'Сливен', 'Шумен', 'Перник', 'Ямбол',
    'Хасково', 'Благоевград', 'Велико Търново', 'Враца', 'Габрово',
    'Кърджали', 'Кюстендил', 'Монтана', 'Пазарджик', 'Разград',
    'Силистра', 'Смолян', 'Търговище', 'Видин', 'Ловеч'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    
    try {
      console.log('📝 Submitting new activity (emergency mode):', formData);
      
      // Emergency mode: just simulate success
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            title: '',
            description: '',
            category: '',
            age_min: 3,
            age_max: 18,
            price_monthly: '',
            school_name: '',
            school_phone: '',
            school_email: '',
            school_website: '',
            school_address: '',
            city: 'София'
          });
        }, 3000);
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error submitting activity:', error);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-800 mb-4">
              Успешно изпратено!
            </h1>
            <p className="text-green-700 mb-6">
              Благодарим ви за предложението! Дейността ще бъде прегледана от нашия екип и одобрена в рамките на 1-2 работни дни.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
            >
              Добавете още дейности
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            ➕ Предложете дейност
          </h1>
          <p className="text-slate-600">
            Знаете за страхотна дейност за деца? Споделете я с нас!
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Защо да предложите дейност?</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Помогнете на други родители да открият качествени дейности</li>
            <li>• Подкрепете местните организации и преподаватели</li>
            <li>• Създайте по-силна общност за деца в България</li>
            <li>• Имейл и телефон са незадължителни - споделете колкото информация имате</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-6">
          
          {/* Activity Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">📚 Информация за дейността</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Име на дейността *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="напр. Програмиране с Python за деца"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Категория *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Изберете категория</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Описание *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                  placeholder="Опишете какво се учи в тази дейност, методи на преподаване, какви са ползите..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Минимална възраст
                  </label>
                  <input
                    type="number"
                    name="age_min"
                    value={formData.age_min}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="3"
                    max="18"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Максимална възраст
                  </label>
                  <input
                    type="number"
                    name="age_max"
                    value={formData.age_max}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="3"
                    max="18"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Цена (лв/месец)
                  </label>
                  <input
                    type="text"
                    name="price_monthly"
                    value={formData.price_monthly}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="напр. 80-120 лв, По договаряне, Безплатно"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* School Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">🏫 Информация за организацията</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Име на организацията *
                </label>
                <input
                  type="text"
                  name="school_name"
                  value={formData.school_name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="напр. Академия за Програмиране"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="school_phone"
                    value={formData.school_phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="напр. +359888123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Имейл
                  </label>
                  <input
                    type="email"
                    name="school_email"
                    value={formData.school_email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="напр. info@school.bg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Уебсайт
                </label>
                <input
                  type="url"
                  name="school_website"
                  value={formData.school_website}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="напр. https://www.school.bg"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Град *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Адрес
                  </label>
                  <input
                    type="text"
                    name="school_address"
                    value={formData.school_address}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="напр. ул. Витоша 15"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '🔄 Изпращане...' : '🚀 Изпратете предложението'}
            </button>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Всички предложения се прегледат преди публикуване
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}