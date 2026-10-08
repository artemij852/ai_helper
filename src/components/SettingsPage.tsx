import React, { useState, useEffect } from 'react';
import { Settings, MemoryEntry } from '../types';

interface SettingsPageProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onBack: () => void;
}

export default function SettingsPage({ settings, onSave, onBack }: SettingsPageProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center gap-3 shadow-md">
        <button onClick={onBack} className="text-2xl p-1">
          ←
        </button>
        <h1 className="text-xl font-bold">Настройки</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Phone Number */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            📞 Ваш номер телефона
          </label>
          <p className="text-sm text-gray-500 mb-2">
            ИИ будет звонить на этот номер для напоминания о таблетках
          </p>
          <input
            type="tel"
            value={localSettings.phoneNumber}
            onChange={(e) => setLocalSettings({ ...localSettings, phoneNumber: e.target.value })}
            className="w-full p-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        {/* User Name */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            👤 Ваше имя
          </label>
          <p className="text-sm text-gray-500 mb-2">
            ИИ будет обращаться к вам по этому имени
          </p>
          <input
            type="text"
            value={localSettings.userName}
            onChange={(e) => setLocalSettings({ ...localSettings, userName: e.target.value })}
            className="w-full p-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Мария Ивановна"
          />
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

        {/* Memory Phone */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            🧠 Номер для отправки данных памяти
          </label>
          <p className="text-sm text-gray-500 mb-2">
            На этот номер будут отправляться данные о давлении и приёме таблеток
          </p>
          <input
            type="tel"
            value={localSettings.memoryPhone}
            onChange={(e) => setLocalSettings({ ...localSettings, memoryPhone: e.target.value })}
            className="w-full p-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="+7 (999) 765-43-21"
          />
        </div>

        {/* Memory Data */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            📋 История записей памяти
          </h3>
          {localSettings.memoryData.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Пока нет записей</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {localSettings.memoryData.map((entry, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-sm font-semibold text-blue-700">{entry.date}</p>
                  <p className="text-sm">Давление: {entry.pressure}</p>
                  <p className="text-sm">Таблетки: {entry.medications}</p>
                  {entry.notes && <p className="text-sm text-gray-600">Заметки: {entry.notes}</p>}
                </div>
              ))}
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
          {saved ? '✓ Сохранено!' : '💾 Сохранить настройки'}
        </button>
      </div>
    </div>
  );
}
