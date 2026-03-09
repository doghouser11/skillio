'use client';

import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    google?: any;
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';

interface OAuthButtonsProps {
  role?: string;
  onError?: (msg: string) => void;
}

export default function OAuthButtons({ role = 'parent', onError }: OAuthButtonsProps) {
  const { oauthLogin } = useAuth();
  const router = useRouter();

  const handleOAuthSuccess = useCallback(async (provider: string, token: string) => {
    try {
      await oauthLogin(provider, token, role);
      router.push('/');
    } catch (err: any) {
      onError?.(err.message || 'OAuth грешка');
    }
  }, [oauthLogin, role, router, onError]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          if (response.credential) handleOAuthSuccess('google', response.credential);
        },
      });
      window.google?.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: '100%', text: 'continue_with', locale: 'bg' }
      );
    };
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [handleOAuthSuccess]);

  useEffect(() => {
    if (!FACEBOOK_APP_ID) return;
    window.fbAsyncInit = () => {
      window.FB?.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: false, version: 'v19.0' });
    };
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/bg_BG/sdk.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);

  const handleFacebookLogin = () => {
    window.FB?.login((response: any) => {
      if (response.authResponse?.accessToken) handleOAuthSuccess('facebook', response.authResponse.accessToken);
    }, { scope: 'email,public_profile' });
  };

  if (!GOOGLE_CLIENT_ID && !FACEBOOK_APP_ID) return null;

  return (
    <div className="space-y-3">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-50 text-gray-500">или продължете с</span></div>
      </div>
      {GOOGLE_CLIENT_ID && <div id="google-signin-btn" className="flex justify-center" />}
      {FACEBOOK_APP_ID && (
        <button type="button" onClick={handleFacebookLogin} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
          <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Продължи с Facebook
        </button>
      )}
    </div>
  );
}
