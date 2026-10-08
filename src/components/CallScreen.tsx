import React, { useState, useEffect, useRef } from 'react';
import { AISettings, AIMemoryEntry } from '../types';

interface CallScreenProps {
  userName: string;
  aiSettings: AISettings;
  onCallEnd: (memoryEntry?: AIMemoryEntry) => void;
  onBack: () => void;
}

type CallPhase = 'ringing' | 'greeting' | 'ask_pressure' | 'wait_pressure' | 'closing' | 'ended';

export default function CallScreen({ userName, aiSettings, onCallEnd, onBack }: CallScreenProps) {
  const [phase, setPhase] = useState<CallPhase>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [pressure, setPressure] = useState('');
  const [messages, setMessages] = useState<{text: string; isAI: boolean}[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const name = userName || 'дорогой друг';
  const aiName = aiSettings.aiName || 'Заботушка';

  useEffect(() => {
    const ringTimer = setTimeout(() => {
      setPhase('greeting');
      const greeting = `${aiSettings.greeting
        .replace('{name}', name)
        .replace('{aiName}', aiName)} Как вы себя сегодня чувствуете?`;
      setMessages([{ text: greeting, isAI: true }]);
      speak(greeting);
    }, 3000);

    return () => clearTimeout(ringTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'ringing' && phase !== 'ended') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = aiSettings.aiSpeed;
      utterance.pitch = aiSettings.aiVoice === 'female' ? 1.1 : 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleUserSubmit = () => {
    if (!userInput.trim()) return;
    
    const userMsg = userInput.trim();
    setMessages(prev => [...prev, { text: userMsg, isAI: false }]);
    setUserInput('');

    if (phase === 'greeting') {
      setTimeout(() => {
        const askPressure = `${name}, это хорошо! А не могли бы вы сейчас измерить давление? Пожалуйста, назовите мне результаты — верхнее и нижнее давление.`;
        setMessages(prev => [...prev, { text: askPressure, isAI: true }]);
        speak(askPressure);
        setPhase('wait_pressure');
      }, 1000);
    } else if (phase === 'wait_pressure') {
      setPressure(userMsg);
      setTimeout(() => {
        const confirmPressure = `Спасибо, ${name}! Давление ${userMsg} записано. Теперь, пожалуйста, не забудьте принять ваши таблетки по расписанию. Это очень важно для здоровья!`;
        setMessages(prev => [...prev, { text: confirmPressure, isAI: true }]);
        speak(confirmPressure);
        
        setTimeout(() => {
          const closing = `Хорошо, ${name}. Я записала всё в память. Берегите себя! До свидания!`;
          setMessages(prev => [...prev, { text: closing, isAI: true }]);
          speak(closing);
          setPhase('ended');
        }, 5000);
      }, 1500);
    }
  };

  const handleEndCall = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const entry: AIMemoryEntry = {
      date: new Date().toLocaleDateString('ru-RU'),
      pressure: pressure || 'не измерено',
      medications: phase === 'ended' ? 'приняты' : 'не подтверждено',
      notes: `Звонок длительностью ${formatDuration(callDuration)}`,
    };
    onCallEnd(entry);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-900 to-blue-700 text-white">
      {/* Call Info */}
      <div className="text-center pt-12 pb-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg animate-pulse">
          🤖
        </div>
        <h2 className="text-2xl font-bold">{aiName}</h2>
        <p className="text-blue-200 mt-1">
          {phase === 'ringing' ? '📞 Вызов...' : formatDuration(callDuration)}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl max-w-[85%] ${
              msg.isAI
                ? 'bg-white/20 backdrop-blur-sm ml-0'
                : 'bg-blue-500 ml-auto'
            }`}
          >
            <p className="text-base">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/20 backdrop-blur-sm">
        {(phase === 'wait_pressure' || phase === 'greeting') && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUserSubmit()}
              placeholder={
                phase === 'wait_pressure' 
                  ? 'Например: 120/80' 
                  : 'Напишите ответ...'
              }
              className="flex-1 p-3 text-lg bg-white/90 text-gray-800 rounded-full focus:outline-none"
            />
            <button
              onClick={handleUserSubmit}
              className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-xl"
            >
              ➤
            </button>
          </div>
        )}
        
        <button
          onClick={handleEndCall}
          className="w-full p-4 bg-red-500 hover:bg-red-600 rounded-full text-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          📞 Завершить звонок
        </button>
      </div>
    </div>
  );
}
