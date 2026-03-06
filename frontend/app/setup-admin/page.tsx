'use client';

import { useState, useEffect } from 'react';
import { adminSetupAPI } from '@/lib/api';

export default function SetupAdminPage() {
  const [email, setEmail] = useState('nikol_bg_93@proton.me');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [setupStatus, setSetupStatus] = useState<any>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await adminSetupAPI.getStatus();
      setSetupStatus(response.data);
    } catch (error) {
      console.error('Error checking setup status:', error);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('❌ Паролите не съвпадат');
      return;
    }

    if (password.length < 12) {
      setMessage('❌ Паролата трябва да е поне 12 символа');
      return;
    }

    setIsCreating(true);
    setMessage('');

    try {
      const response = await adminSetupAPI.createMasterAdmin({
        email,
        password,
        confirm_password: confirmPassword
      });

      setMessage(`✅ Master admin създаден успешно! Email: ${response.data.email}`);
      setPassword('');
      setConfirmPassword('');
      await checkSetupStatus();
    } catch (error: any) {
      setMessage(`❌ Грешка: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('❌ Паролите не съвпадат');
      return;
    }

    if (password.length < 12) {
      setMessage('❌ Паролата трябва да е поне 12 символа');
      return;
    }

    setIsResetting(true);
    setMessage('');

    try {
      const response = await adminSetupAPI.resetMasterPassword({
        email,
        password,
        confirm_password: confirmPassword
      });

      setMessage(`✅ Паролата е сменена успешно! Email: ${response.data.email}`);
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage(`❌ Грешка: ${error.response?.data?.detail || error.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#FDF6EC'}}>
      <div className="max-w-md w-full">
        <div className="comic-card p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🔐</div>
            <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-2">
              Admin Setup
            </h1>
            <p className="text-[#1A1A1A]">
              Production Security Configuration
            </p>
          </div>

          {setupStatus && (
            <div className="mb-6 comic-card p-4" style={{backgroundColor: 'white'}}>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Setup Status:</h3>
              <div className="space-y-1 text-sm">
                <div>Total Admins: <strong>{setupStatus.total_admins}</strong></div>
                <div>Master Admin Exists: <strong>{setupStatus.master_admin_exists ? '✅ Yes' : '❌ No'}</strong></div>
                <div>Setup Complete: <strong>{setupStatus.setup_complete ? '✅ Yes' : '❌ No'}</strong></div>
              </div>
            </div>
          )}

          {!setupStatus?.setup_complete ? (
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Master Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl border-2 border-black focus:outline-none focus:border-[#2D5A27]"
                  required
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Password (минимум 12 символа)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl border-2 border-black focus:outline-none focus:border-[#2D5A27]"
                  required
                  minLength={12}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl border-2 border-black focus:outline-none focus:border-[#2D5A27]"
                  required
                  minLength={12}
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="comic-button w-full px-6 py-4 text-lg font-semibold"
              >
                {isCreating ? '🔄 Създаване...' : '🔐 Създай Master Admin'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-center text-[#2D5A27] font-semibold mb-4">
                ✅ Master Admin съществува
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  New Password (минимум 12 символа)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl border-2 border-black focus:outline-none focus:border-[#2D5A27]"
                  required
                  minLength={12}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl border-2 border-black focus:outline-none focus:border-[#2D5A27]"
                  required
                  minLength={12}
                />
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="comic-button w-full px-6 py-4 text-lg font-semibold"
              >
                {isResetting ? '🔄 Обновяване...' : '🔄 Смени Парола'}
              </button>
            </form>
          )}

          {message && (
            <div className="mt-4 p-3 rounded-3xl border-2 border-black text-center font-semibold text-[#1A1A1A]" 
                 style={{backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da'}}>
              {message}
            </div>
          )}

          <div className="text-center mt-6">
            <a href="/" className="text-[#2D5A27] hover:underline font-semibold">
              ← Обратно към сайта
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}