import React, { useState, useEffect } from 'react';
import { User, Message, Medication, AIMemoryEntry, AISettings, UserAccount } from './types';
import { getAIResponse } from './utils/aiResponses';
import { recipesData } from './data/recipes';
import { autoLogin, getUserAccount, saveUserAccount, logout } from './utils/auth';
import AuthPage from './components/AuthPage';
import ChatPage from './components/ChatPage';
import CallScreen from './components/CallScreen';
import ContactsPage from './components/ContactsPage';
import RecipesPage from './components/RecipesPage';
import SettingsPage from './components/SettingsPage';
import MedicationsPage from './components/MedicationsPage';

type Page = 'auth' | 'home' | 'chat' | 'call' | 'contacts' | 'recipes' | 'settings' | 'medications';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [page, setPage] = useState<Page>('auth');
  const [loading, setLoading] = useState(true);

  // Auto-login on mount
  useEffect(() => {
    const user = autoLogin();
    if (user) {
      setCurrentUser(user);
      const acc = getUserAccount(user.id);
      if (acc) {
        setAccount(acc);
        setPage('home');
      }
    }
    setLoading(false);
  }, []);

  // Save account on changes
  useEffect(() => {
    if (account) {
      saveUserAccount(account);
    }
  }, [account]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    const acc = getUserAccount(user.id);
    if (acc) {
      setAccount(acc);
    }
    setPage('home');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setAccount(null);
    setPage('auth');
  };

  // AI Chat message handler
  const handleAISendMessage = (text: string) => {
    if (!account || !currentUser) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };

    const newMessages = [...account.aiChatMessages, userMsg];
    setAccount({ ...account, aiChatMessages: newMessages });

    // AI response with delay
    setTimeout(() => {
      const aiText = getAIResponse(text, currentUser.displayName, account.aiSettings);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: Date.now(),
      };
      setAccount(prev => {
        if (!prev) return prev;
        return { ...prev, aiChatMessages: [...prev.aiChatMessages, aiMsg] };
      });
    }, 1000);
  };

  // Contact message handler
  const handleContactMessage = (contactId: string, text: string) => {
    if (!account) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: Date.now(),
    };

    const existingChats = account.privateChats[contactId] || [];
    const updatedChats = {
      ...account.privateChats,
      [contactId]: [...existingChats, userMsg],
    };

    setAccount({ ...account, privateChats: updatedChats });
  };

  // Call end handler
  const handleCallEnd = (memoryEntry?: AIMemoryEntry) => {
    if (!account || !memoryEntry) {
      setPage('home');
      return;
    }
    setAccount({
      ...account,
      memoryData: [...account.memoryData, memoryEntry],
    });
    setPage('home');
  };

  // Save AI settings
  const handleSaveAISettings = (settings: AISettings) => {
    if (!account) return;
    setAccount({ ...account, aiSettings: settings });
  };

  // Save medications
  const handleSaveMedications = (medications: Medication[]) => {
    if (!account) return;
    setAccount({ ...account, medications });
    setPage('home');
  };

  // Update contacts
  const handleContactsChange = (contacts: string[]) => {
    if (!account) return;
    setAccount({ ...account, contacts });
  };

  // Medication reminders
  useEffect(() => {
    if (!account) return;
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      account.medications.forEach(med => {
        if (med.enabled && med.time === currentTime) {
          const reminder: Message = {
            id: Date.now().toString() + Math.random(),
            text: `⏰ Напоминание: пора принять "${med.name}" (${med.dosage})!`,
            sender: 'system',
            timestamp: Date.now(),
          };
          setAccount(prev => {
            if (!prev) return prev;
            return { ...prev, aiChatMessages: [...prev.aiChatMessages, reminder] };
          });
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [account?.medications]);

  // Loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-blue-600">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🤖</div>
          <p className="text-xl">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Auth page
  if (page === 'auth' || !currentUser || !account) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // Home Screen
  if (page === 'home') {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-md">
                {currentUser.avatar}
              </div>
              <div>
                <h1 className="text-lg font-bold">{currentUser.displayName}</h1>
                <p className="text-xs text-blue-200">Добро пожаловать!</p>
              </div>
            </div>
            <button
              onClick={() => setPage('settings')}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* AI Card */}
        <div className="px-4 pt-4">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                🤖
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg text-gray-800">{account.aiSettings.aiName}</h2>
                <p className="text-sm text-gray-500">Ваш ИИ-помощник • онлайн</p>
              </div>
              <button
                onClick={() => setPage('chat')}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold"
              >
                Написать
              </button>
            </div>
          </div>
        </div>

        {/* Quick Status */}
        <div className="px-4 py-3">
          <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
            <p className="text-sm text-purple-700">
              💊 Сегодня: {account.medications.filter(m => m.enabled).length} таблеток по расписанию
              {account.memoryData.length > 0 && ` • 📋 Записей: ${account.memoryData.length}`}
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
              <h3 className="font-bold text-lg text-gray-800">Чат с {account.aiSettings.aiName}</h3>
              <p className="text-sm text-gray-500">Поговорите с вашим помощником</p>
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
              <p className="text-sm text-gray-500">Переписка с пользователями</p>
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
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t shadow-lg">
          <div className="flex justify-around py-2">
            <button onClick={() => setPage('home')} className="flex flex-col items-center p-2 text-blue-600">
              <span className="text-xl">🏠</span>
              <span className="text-xs font-semibold">Главная</span>
            </button>
            <button onClick={() => setPage('chat')} className="flex flex-col items-center p-2 text-gray-500">
              <span className="text-xl">💬</span>
              <span className="text-xs">ИИ</span>
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
              <span className="text-xs">Настройки</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (page === 'chat') {
    return (
      <ChatPage
        aiName={account.aiSettings.aiName}
        userName={currentUser.displayName}
        aiSettings={account.aiSettings}
        messages={account.aiChatMessages}
        onSendMessage={handleAISendMessage}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'call') {
    return (
      <CallScreen
        userName={currentUser.displayName}
        aiSettings={account.aiSettings}
        onCallEnd={handleCallEnd}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'contacts') {
    return (
      <ContactsPage
        currentUser={currentUser}
        contacts={account.contacts}
        chatMessages={account.privateChats}
        onSendMessage={handleContactMessage}
        onContactsChange={handleContactsChange}
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
        user={currentUser}
        aiSettings={account.aiSettings}
        memoryData={account.memoryData}
        onSaveAISettings={handleSaveAISettings}
        onLogout={handleLogout}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'medications') {
    return (
      <MedicationsPage
        medications={account.medications}
        onSave={handleSaveMedications}
        onBack={() => setPage('home')}
      />
    );
  }

  return null;
}
