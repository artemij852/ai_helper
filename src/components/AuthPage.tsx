import React, { useState } from 'react';
import { registerUser, loginUser } from '../utils/auth';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = loginUser(username, password);
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Ошибка входа');
      }
      setLoading(false);
    }, 500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Введите имя пользователя');
      return;
    }
    if (!displayName.trim()) {
      setError('Введите ваше имя');
      return;
    }
    if (!password.trim()) {
      setError('Введите пароль');
      return;
    }
    if (password.length < 4) {
      setError('Пароль должен быть не менее 4 символов');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (!phone.trim()) {
      setError('Введите номер телефона');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = registerUser(username, displayName, password, phone);
      if (result.success && result.user) {
        // Auto-login after registration
        const loginResult = loginUser(username, password);
        if (loginResult.success && loginResult.user) {
          onLogin(loginResult.user);
        }
      } else {
        setError(result.error || 'Ошибка регистрации');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-600 to-blue-800">
      {/* Logo */}
      <div className="text-center pt-12 pb-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-xl">
          🤖
        </div>
        <h1 className="text-3xl font-bold text-white">Забота</h1>
        <p className="text-blue-200 mt-1">ИИ-помощник для здоровья</p>
      </div>

      {/* Form */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-6 overflow-y-auto">
        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 rounded-lg text-base font-bold transition-all ${
              mode === 'login' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600'
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-3 rounded-lg text-base font-bold transition-all ${
              mode === 'register' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600'
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-red-600 text-base text-center">⚠️ {error}</p>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">
                👤 Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Введите имя пользователя"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">
                🔒 Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Введите пароль"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 bg-blue-600 text-white rounded-xl text-xl font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? '⏳ Вход...' : '🚪 Войти'}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">
                👤 Имя пользователя (логин)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Придумайте логин"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">
                📝 Ваше имя
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Как к вам обращаться?"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">
                📞 Номер телефона
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">
                🔒 Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Придумайте пароль"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">
                🔒 Повторите пароль
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Повторите пароль"
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 bg-green-600 text-white rounded-xl text-xl font-bold shadow-md hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? '⏳ Регистрация...' : '✨ Зарегистрироваться'}
            </button>
          </form>
        )}

        {/* Info */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-700 text-center">
            🔐 Ваши данные хранятся безопасно.<br/>
            Вход выполняется автоматически при повторном посещении.
          </p>
        </div>
      </div>
    </div>
  );
}
