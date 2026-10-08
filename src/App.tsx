import React, { useState, useEffect } from 'react';
import { Settings, Message, Contact, Medication, MemoryEntry } from './types';
import { getAIResponse } from './utils/aiResponses';
import { recipesData } from './data/recipes';
import ChatPage from './components/ChatPage';
import CallScreen from './components/CallScreen';
import ContactsPage from './components/ContactsPage';
import RecipesPage from './components/RecipesPage';
import SettingsPage from './components/SettingsPage';
import MedicationsPage from './components/MedicationsPage';

type Page = 'home' | 'chat' | 'call' | 'contacts' | 'recipes' | 'settings' | 'medications';

const defaultSettings: Settings = {
  phoneNumber: '+7 (999) 123-45-67',
  userName: 'Мария Ивановна',
  aiName: 'Заботушка',
  memoryPhone: '+7 (999) 765-43-21',
  memoryData: [],
};

const defaultContacts: Contact[] = [
  { id: '1', name: 'Дочь Анна', phone: '+7 (999) 111-22-33', avatar: '👩' },
  { id: '2', name: 'Сын Пётр', phone: '+7 (999) 222-33-44', avatar: '👨' },
  { id: '3', name: 'Подруга Галина', phone: '+7 (999) 333-44-55', avatar: '👵' },
  { id: '4', name: 'Врач Ирина', phone: '+7 (999) 444-55-66', avatar: '👩‍⚕️' },
  { id: '5', name: 'Соседка Валентина', phone: '+7 (999) 555-66-77', avatar: '🧓' },
];

const defaultMedications: Medication[] = [
  { id: '1', name: 'Лозартан', time: '08:00', dosage: '1 таблетка утром', enabled: true },
  { id: '2', name: 'Аспирин', time: '13:00', dosage: '1 таблетка после обеда', enabled: true },
  { id: '3', name: 'Витамин D', time: '09:00', dosage: '1 капсула', enabled: true },
];

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultValue;
}

function saveToStorage(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [settings, setSettings] = useState<Settings>(() => loadFromStorage('settings', defaultSettings));
  const [chatMessages, setChatMessages] = useState<Message[]>(() => loadFromStorage('chatMessages', []));
  const [contacts] = useState<Contact[]>(defaultContacts);
  const [contactChats, setContactChats] = useState<Record<string, Message[]>>(() => loadFromStorage('contactChats', {}));
  const [medications, setMedications] = useState<Medication[]>(() => loadFromStorage('medications', defaultMedications));

  // Save to localStorage on changes
  useEffect(() => { saveToStorage('settings', settings); }, [settings]);
  useEffect(() => { saveToStorage('chatMessages', chatMessages); }, [chatMessages]);
  useEffect(() => { saveToStorage('contactChats', contactChats); }, [contactChats]);
  useEffect(() => { saveToStorage('medications', medications); }, [medications]);

  // Medication reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      medications.forEach(med => {
        if (med.enabled && med.time === currentTime) {
          const reminder: Message = {
            id: Date.now().toString(),
            text: `⏰ Напоминание: пора принять "${med.name}" (${med.dosage})!`,
            sender: 'system',
            timestamp: Date.now(),
          };
          setChatMessages(prev => [...prev, reminder]);
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [medications]);

  const handleSendMessage = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };
    setChatMessages(prev => [...prev, userMsg]);

    // AI response with delay
    setTimeout(() => {
      const aiText = getAIResponse(text, settings);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const handleContactMessage = (contactId: string, text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };
    setContactChats(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), userMsg],
    }));

    // Auto reply
    setTimeout(() => {
      const replies = [
        'Привет! Как дела? 😊',
        'Хорошо, спасибо! А у тебя?',
        'Не забудь принять таблетки!',
        'Давай созвонимся завтра?',
        'Береги себя! ❤️',
        'Я сегодня пойду в аптеку, тебе что-нибудь принести?',
        'Как давление? Измерила?',
        'Отлично! Рада за тебя!',
      ];
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: 'ai',
        timestamp: Date.now(),
      };
      setContactChats(prev => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), reply],
      }));
    }, 1500);
  };

  const handleCallEnd = (memoryEntry?: MemoryEntry) => {
    if (memoryEntry) {
      setSettings(prev => ({
        ...prev,
        memoryData: [...prev.memoryData, memoryEntry],
      }));
    }
    setPage('home');
  };

  // Home Screen
  if (page === 'home') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center shadow-lg">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto mb-3 shadow-md">
            🤖
          </div>
          <h1 className="text-2xl font-bold">{settings.aiName}</h1>
          <p className="text-blue-200 text-sm mt-1">Ваш заботливый помощник</p>
        </div>

        {/* Quick Status */}
        <div className="px-4 py-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
            <p className="text-base text-gray-700">
              👋 Здравствуйте, <strong>{settings.userName}</strong>!
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Сегодня у вас {medications.filter(m => m.enabled).length} таблеток по расписанию
            </p>
          </div>
        </div>

        {/* Main Menu */}
        <div className="flex-1 px-4 pb-4 space-y-3 overflow-y-auto">
          <button
            onClick={() => setPage('chat')}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all border border-gray-100"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              💬
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg text-gray-800">Чат с ИИ</h3>
              <p className="text-sm text-gray-500">Поговорите с {settings.aiName}</p>
            </div>
            <span className="text-gray-400 text-xl">→</span>
          </button>

          <button
            onClick={() => setPage('call')}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all border border-gray-100"
          >
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              📞
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg text-gray-800">Позвонить ИИ</h3>
              <p className="text-sm text-gray-500">Проверка давления и таблеток</p>
            </div>
            <span className="text-gray-400 text-xl">→</span>
          </button>

          <button
            onClick={() => setPage('contacts')}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all border border-gray-100"
          >
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
              👥
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg text-gray-800">Контакты</h3>
              <p className="text-sm text-gray-500">Переписка с близкими</p>
            </div>
            <span className="text-gray-400 text-xl">→</span>
          </button>

          <button
            onClick={() => setPage('medications')}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all border border-gray-100"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
              💊
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg text-gray-800">Таблетки</h3>
              <p className="text-sm text-gray-500">Расписание приёма</p>
            </div>
            <span className="text-gray-400 text-xl">→</span>
          </button>

          <button
            onClick={() => setPage('recipes')}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all border border-gray-100"
          >
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
              🍽️
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg text-gray-800">Рецепты</h3>
              <p className="text-sm text-gray-500">Полезная еда для здоровья</p>
            </div>
            <span className="text-gray-400 text-xl">→</span>
          </button>

          <button
            onClick={() => setPage('settings')}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all border border-gray-100"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              ⚙️
            </div>
            <div className="text-left flex-1">
              <h3 className="font-bold text-lg text-gray-800">Настройки</h3>
              <p className="text-sm text-gray-500">Телефон, имя, память</p>
            </div>
            <span className="text-gray-400 text-xl">→</span>
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t shadow-lg">
          <div className="flex justify-around py-2">
            <button onClick={() => setPage('chat')} className="flex flex-col items-center p-2 text-blue-600">
              <span className="text-xl">💬</span>
              <span className="text-xs font-semibold">Чат</span>
            </button>
            <button onClick={() => setPage('call')} className="flex flex-col items-center p-2 text-gray-500">
              <span className="text-xl">📞</span>
              <span className="text-xs">Звонок</span>
            </button>
            <button onClick={() => setPage('contacts')} className="flex flex-col items-center p-2 text-gray-500">
              <span className="text-xl">👥</span>
              <span className="text-xs">Контакты</span>
            </button>
            <button onClick={() => setPage('recipes')} className="flex flex-col items-center p-2 text-gray-500">
              <span className="text-xl">🍽️</span>
              <span className="text-xs">Рецепты</span>
            </button>
            <button onClick={() => setPage('settings')} className="flex flex-col items-center p-2 text-gray-500">
              <span className="text-xl">⚙️</span>
              <span className="text-xs">Ещё</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'chat') {
    return (
      <ChatPage
        settings={settings}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'call') {
    return (
      <CallScreen
        settings={settings}
        onCallEnd={handleCallEnd}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'contacts') {
    return (
      <ContactsPage
        contacts={contacts}
        chatMessages={contactChats}
        onSendMessage={handleContactMessage}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'recipes') {
    return (
      <RecipesPage
        recipes={recipesData}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'settings') {
    return (
      <SettingsPage
        settings={settings}
        onSave={setSettings}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'medications') {
    return (
      <MedicationsPage
        medications={medications}
        onSave={setMedications}
        onBack={() => setPage('home')}
      />
    );
  }

  return null;
}
