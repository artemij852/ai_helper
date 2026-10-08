import React, { useState, useRef, useEffect } from 'react';
import { Message, AISettings } from '../types';

interface ChatPageProps {
  aiName: string;
  userName: string;
  aiSettings: AISettings;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

export default function ChatPage({ aiName, userName, aiSettings, messages, onSendMessage, onBack }: ChatPageProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center gap-3 shadow-md">
        <button onClick={onBack} className="text-2xl p-1">←</button>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
          🤖
        </div>
        <div>
          <h2 className="font-bold text-lg">{aiName}</h2>
          <p className="text-xs text-blue-200">в сети</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-lg">Напишите {aiName}!</p>
            <p className="text-sm">Она поможет с таблетками и здоровьем</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : msg.sender === 'system'
                  ? 'bg-yellow-100 text-yellow-800 rounded-bl-md border border-yellow-200'
                  : 'bg-white text-gray-800 rounded-bl-md'
              }`}
            >
              <p className="text-base leading-relaxed">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-3 border-t flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Напишите сообщение..."
          className="flex-1 p-3 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl hover:bg-blue-700 active:scale-95 transition-all"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
