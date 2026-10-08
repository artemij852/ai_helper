import React, { useState } from 'react';
import { Medication } from '../types';

interface MedicationsPageProps {
  medications: Medication[];
  onSave: (medications: Medication[]) => void;
  onBack: () => void;
}

export default function MedicationsPage({ medications, onSave, onBack }: MedicationsPageProps) {
  const [localMeds, setLocalMeds] = useState<Medication[]>(medications);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newDosage, setNewDosage] = useState('');

  const addMedication = () => {
    if (!newName.trim()) return;
    const med: Medication = {
      id: Date.now().toString(),
      name: newName.trim(),
      time: newTime,
      dosage: newDosage.trim() || '1 таблетка',
      enabled: true,
    };
    setLocalMeds([...localMeds, med]);
    setNewName('');
    setNewTime('08:00');
    setNewDosage('');
    setShowAdd(false);
  };

  const toggleMed = (id: string) => {
    setLocalMeds(localMeds.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const removeMed = (id: string) => {
    setLocalMeds(localMeds.filter(m => m.id !== id));
  };

  const handleSave = () => {
    onSave(localMeds);
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 flex items-center gap-3 shadow-md">
        <button onClick={onBack} className="text-2xl p-1">←</button>
        <h1 className="text-xl font-bold">💊 Таблетки</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Info */}
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className="text-purple-800 text-base">
            📋 Здесь вы можете указать время приёма таблеток. ИИ напомнит вам о них!
          </p>
        </div>

        {/* Medication List */}
        {localMeds.length === 0 && !showAdd && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-5xl mb-3">💊</p>
            <p className="text-lg">Нет таблеток в расписании</p>
            <p className="text-sm">Добавьте первую таблетку</p>
          </div>
        )}

        {localMeds.map((med) => (
          <div
            key={med.id}
            className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all ${
              med.enabled ? 'border-purple-200' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{med.enabled ? '💊' : '⚪'}</span>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{med.name}</h3>
                  <p className="text-sm text-gray-500">{med.dosage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                  {med.time}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => toggleMed(med.id)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  med.enabled
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {med.enabled ? '✓ Включено' : '○ Выключено'}
              </button>
              <button
                onClick={() => removeMed(med.id)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {/* Add Form */}
        {showAdd && (
          <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-purple-300">
            <h3 className="font-bold text-lg mb-3">➕ Новая таблетка</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-600">Название</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-3 text-lg border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Например: Лозартан"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Время приёма</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-3 text-lg border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Дозировка</label>
                <input
                  type="text"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  className="w-full p-3 text-lg border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Например: 1 таблетка после еды"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addMedication}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-bold text-lg"
                >
                  ✓ Добавить
                </button>
                <button
                  onClick={() => setShowAdd(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold text-lg"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Button */}
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full p-4 bg-purple-600 text-white rounded-xl text-xl font-bold shadow-md hover:bg-purple-700 active:scale-95 transition-all"
          >
            ➕ Добавить таблетку
          </button>
        )}

        {/* Save Button */}
        {localMeds.length > 0 && (
          <button
            onClick={handleSave}
            className="w-full p-4 bg-green-600 text-white rounded-xl text-xl font-bold shadow-md hover:bg-green-700 active:scale-95 transition-all"
          >
            💾 Сохранить расписание
          </button>
        )}
      </div>
    </div>
  );
}
