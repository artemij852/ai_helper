import React, { useState } from 'react';
import { User, AISettings, AIMemoryEntry } from '../types';
import { logout } from '../utils/auth';

interface SettingsPageProps {
  user: User;
  aiSettings: AISettings;
  memoryData: AIMemoryEntry[];
  onSaveAISettings: (settings: AISettings) => void;
  onLogout: () => void;
  onBack: () => void;
}

export default function SettingsPage({ user, aiSettings, memoryData, onSaveAISettings, onLogout, onBack }: SettingsPageProps) {
  const [localSettings, setLocalSettings] = useState<AISettings>(aiSettings);
  const [saved, setSaved] = useState(false);
  const [showMemory, setShowMemory] = useState(false);

  const handleSave = () => {
    onSaveAISettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gray-700 text-white p-4 flex items-center gap-3 shadow-md">
        <button onClick={onBack} className="text-2xl p-1">←</button>
        <h1 className="text-xl font-bold">Настройки</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* User Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">👤 Ваш профиль</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Имя:</span>
              <span className="font-semibold">{user.displayName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Логин:</span>
              <span className="font-semibold">@{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Телефон:</span>
              <span className="font-semibold">{user.phone}</span>
            </div>
          </div>
        </div>

        {/* AI Name */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            🤖 Имя помощника
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Дайте имя вашему ИИ-помощнику
          </p>
          <input
            type="text"
            value={localSettings.aiName}
            onChange={(e) => setLocalSettings({ ...localSettings, aiName: e.target.value })}
            className="w-full p-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Заботушка"
          />
        </div>

        {/* AI Personality */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            🎭 Характер помощника
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Выберите стиль общения
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'friendly', name: 'Дружелюбный', emoji: '😊' },
              { id: 'formal', name: 'Вежливый', emoji: '🎩' },
              { id: 'caring', name: 'Заботливый', emoji: '🤗' },
              { id: 'cheerful', name: 'Весёлый', emoji: '😄' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setLocalSettings({ ...localSettings, aiPersonality: p.id })}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  localSettings.aiPersonality === p.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{p.emoji}</span>
                <p className="text-sm font-semibold mt-1">{p.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* AI Voice */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            🔊 Голос помощника
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setLocalSettings({ ...localSettings, aiVoice: 'female' })}
              className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${
                localSettings.aiVoice === 'female'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <span className="text-2xl">👩</span>
              <p className="text-sm font-semibold mt-1">Женский</p>
            </button>
            <button
              onClick={() => setLocalSettings({ ...localSettings, aiVoice: 'male' })}
              className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${
                localSettings.aiVoice === 'male'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <span className="text-2xl">👨</span>
              <p className="text-sm font-semibold mt-1">Мужской</p>
            </button>
          </div>
        </div>

        {/* AI Speed */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            ⏱️ Скорость речи
          </label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={localSettings.aiSpeed}
            onChange={(e) => setLocalSettings({ ...localSettings, aiSpeed: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Медленно</span>
            <span>Нормально</span>
            <span>Быстро</span>
          </div>
        </div>

        {/* Greeting */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            👋 Приветствие при звонке
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Используйте {'{name}'} и {'{aiName}'} для подстановки
          </p>
          <textarea
            value={localSettings.greeting}
            onChange={(e) => setLocalSettings({ ...localSettings, greeting: e.target.value })}
            className="w-full p-3 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            rows={3}
            placeholder="Здравствуйте, {name}! Это {aiName}..."
          />
        </div>

        {/* Memory */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <button
            onClick={() => setShowMemory(!showMemory)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="text-lg font-semibold text-gray-700">
              🧠 Память ({memoryData.length} записей)
            </h3>
            <span className="text-xl">{showMemory ? '▲' : '▼'}</span>
          </button>
          {showMemory && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {memoryData.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Пока нет записей</p>
              ) : (
                memoryData.map((entry, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-sm font-semibold text-blue-700">{entry.date}</p>
                    <p className="text-sm">Давление: {entry.pressure}</p>
                    <p className="text-sm">Таблетки: {entry.medications}</p>
                    {entry.notes && <p className="text-sm text-gray-600">{entry.notes}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full p-4 text-xl font-bold rounded-xl shadow-md transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          {saved ? '✓ Сохранено!' : '💾 Сохранить настройки ИИ'}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full p-4 bg-red-100 text-red-600 rounded-xl text-lg font-bold hover:bg-red-200 active:scale-95 transition-all"
        >
          🚪 Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
