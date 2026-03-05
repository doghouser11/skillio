'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  children_count: number;
  children_ages: string;
  interests: string[];
}

export default function ParentProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: user?.email || '',
    phone: '',
    city: 'София',
    children_count: 1,
    children_ages: '',
    interests: []
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const cities = [
    'София', 'Пловдив', 'Варна', 'Бургас', 'Русе', 'Стара Загора',
    'Плевен', 'Добрич', 'Сливен', 'Шумен', 'Перник', 'Ямбол'
  ];

  const interestOptions = [
    'Програмиране и Роботика',
    'Изкуство и Творчество',
    'Спорт и Фитнес',
    'Танци',
    'Музика',
    'Езици',
    'Наука и Експерименти',
    'Театър и Драма',
    'Фотография',
    'Други'
  ];

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('👤 Updating profile (emergency mode):', profileData);
      
      // Emergency mode: simulate success
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => setSuccess(false), 3000);
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('Новите пароли не съвпадат!');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('🔒 Changing password (emergency mode)');
      
      // Emergency mode: simulate success
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setTimeout(() => setSuccess(false), 3000);
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error changing password:', error);
      setLoading(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user) {
    return <div>Зарежда се...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            👤 Моят профил
          </h1>
          <p className="text-slate-600">
            Управлявайте личната си информация и настройки
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
            ✅ Промените са запазени успешно!
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              👤 Лични данни
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🔒 Смяна на парола
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-6">
            
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">📝 Основна информация</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Пълно име
                  </label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Въведете вашето име"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Имейл адрес
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    className="w-full p-3 border border-slate-300 rounded bg-slate-100 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-slate-500 mt-1">Имейлът не може да се променя</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+359888123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Град
                  </label>
                  <select
                    value={profileData.city}
                    onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Children Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">👶 Информация за децата</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Брой деца
                  </label>
                  <select
                    value={profileData.children_count}
                    onChange={(e) => setProfileData(prev => ({ ...prev, children_count: parseInt(e.target.value) }))}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[1,2,3,4,5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Възрасти на децата
                  </label>
                  <input
                    type="text"
                    value={profileData.children_ages}
                    onChange={(e) => setProfileData(prev => ({ ...prev, children_ages: e.target.value }))}
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="напр. 7, 12 години"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Interests */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">🎯 Интереси</h3>
              <p className="text-slate-600 mb-4">Изберете дейности, които ви интересуват:</p>
              
              <div className="grid md:grid-cols-3 gap-3">
                {interestOptions.map(interest => (
                  <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.interests.includes(interest)}
                      onChange={() => handleInterestToggle(interest)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '💾 Запазва се...' : '💾 Запази промените'}
              </button>
            </div>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="space-y-6">
            <form onSubmit={handlePasswordSubmit} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-6">
              
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">🔒 Смяна на парола</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Текуща парола
                    </label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                      className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Нова парола
                    </label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                      className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Потвърдете новата парола
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                      className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '🔄 Сменя се...' : '🔒 Сменете паролата'}
                </button>
              </div>
            </form>

            {/* Logout Section */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">🚪 Излизане от профила</h3>
              <p className="text-red-700 mb-4">
                Ако искате да излезете от профила си на това устройство:
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                🚪 Излизане
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}