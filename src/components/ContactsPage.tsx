import React, { useState } from 'react';
import { User, Message } from '../types';
import { getOtherUsers, addContact, removeContact } from '../utils/auth';

interface ContactsPageProps {
  currentUser: User;
  contacts: string[]; // user IDs
  chatMessages: Record<string, Message[]>;
  onSendMessage: (contactId: string, text: string) => void;
  onContactsChange: (contacts: string[]) => void;
  onBack: () => void;
}

export default function ContactsPage({
  currentUser,
  contacts,
  chatMessages,
  onSendMessage,
  onContactsChange,
  onBack,
}: ContactsPageProps) {
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [input, setInput] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const otherUsers = getOtherUsers(currentUser.id);
  const contactUsers = otherUsers.filter(u => contacts.includes(u.id));
  const availableUsers = otherUsers.filter(u => !contacts.includes(u.id));

  const handleSend = () => {
    if (input.trim() && selectedContact) {
      onSendMessage(selectedContact.id, input.trim());
      setInput('');
    }
  };

  const handleAddContact = (userId: string) => {
    const newContacts = [...contacts, userId];
    onContactsChange(newContacts);
    addContact(currentUser.id, userId);
    setShowAdd(false);
  };

  const handleRemoveContact = (userId: string) => {
    const newContacts = contacts.filter(id => id !== userId);
    onContactsChange(newContacts);
    removeContact(currentUser.id, userId);
    if (selectedContact?.id === userId) {
      setSelectedContact(null);
    }
  };

  // Chat view with selected contact
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
          <div className="flex-1">
            <h2 className="font-bold text-lg">{selectedContact.displayName}</h2>
            <p className="text-xs text-green-200">@{selectedContact.username}</p>
          </div>
          <button
            onClick={() => handleRemoveContact(selectedContact.id)}
            className="text-red-300 hover:text-red-100 text-sm px-2 py-1"
            title="Удалить контакт"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              <p className="text-3xl mb-2">💬</p>
              <p>Начните переписку с {selectedContact.displayName}</p>
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

  // Contact list view
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center gap-3 shadow-md">
        <button onClick={onBack} className="text-2xl p-1">←</button>
        <h1 className="text-xl font-bold flex-1">Контакты</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-white/20 px-3 py-1 rounded-lg text-sm font-semibold"
        >
          {showAdd ? '✕ Закрыть' : '➕ Добавить'}
        </button>
      </div>

      {/* Add Contact Panel */}
      {showAdd && (
        <div className="bg-white border-b p-4">
          <h3 className="font-bold text-base text-gray-700 mb-3">Доступные пользователи:</h3>
          {availableUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Нет других зарегистрированных пользователей.<br/>
              <span className="text-sm">Попросите близких зарегистрироваться в приложении!</span>
            </p>
          ) : (
            <div className="space-y-2">
              {availableUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{user.displayName}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                  <button
                    onClick={() => handleAddContact(user.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    + Добавить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {contactUsers.length === 0 && !showAdd && (
          <div className="text-center text-gray-400 mt-16 px-6">
            <p className="text-5xl mb-4">👥</p>
            <p className="text-lg font-semibold">Пока нет контактов</p>
            <p className="text-sm mt-2">
              Нажмите «Добавить» чтобы найти других пользователей приложения
            </p>
          </div>
        )}
        {contactUsers.map((contact) => {
          const lastMsg = chatMessages[contact.id]?.slice(-1)[0];
          return (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className="w-full flex items-center gap-3 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                {contact.avatar}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-lg text-gray-800">{contact.displayName}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {lastMsg ? lastMsg.text : 'Нажмите, чтобы написать'}
                </p>
              </div>
              {chatMessages[contact.id]?.length > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {chatMessages[contact.id].length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
