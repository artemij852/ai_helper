import React, { useState } from 'react';
import { Contact, Message } from '../types';

interface ContactsPageProps {
  contacts: Contact[];
  chatMessages: Record<string, Message[]>;
  onSendMessage: (contactId: string, text: string) => void;
  onBack: () => void;
}

export default function ContactsPage({ contacts, chatMessages, onSendMessage, onBack }: ContactsPageProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && selectedContact) {
      onSendMessage(selectedContact.id, input.trim());
      setInput('');
    }
  };



  if (selectedContact) {
    const msgs = chatMessages[selectedContact.id] || [];
    return (
      <div className="flex flex-col h-full bg-gray-100">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 flex items-center gap-3 shadow-md">
          <button onClick={() => setSelectedContact(null)} className="text-2xl p-1">←</button>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
            {selectedContact.avatar}
          </div>
          <div>
            <h2 className="font-bold text-lg">{selectedContact.name}</h2>
            <p className="text-xs text-green-200">{selectedContact.phone}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              <p className="text-3xl mb-2">💬</p>
              <p>Начните переписку с {selectedContact.name}</p>
            </div>
          )}
          {msgs.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-green-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md'
                }`}
              >
                <p className="text-base">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-green-200' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white p-3 border-t flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Напишите сообщение..."
            className="flex-1 p-3 text-lg border-2 border-gray-200 rounded-full focus:border-green-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl hover:bg-green-700 active:scale-95 transition-all"
          >
            ➤
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center gap-3 shadow-md">
        <button onClick={onBack} className="text-2xl p-1">←</button>
        <h1 className="text-xl font-bold">Контакты</h1>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => setSelectedContact(contact)}
            className="w-full flex items-center gap-3 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
              {contact.avatar}
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg text-gray-800">{contact.name}</h3>
              <p className="text-sm text-gray-500 truncate">
                {contact.lastMessage || 'Нажмите, чтобы написать'}
              </p>
            </div>
            <div className="text-gray-400 text-sm">
              {chatMessages[contact.id]?.length > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {chatMessages[contact.id].length}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
