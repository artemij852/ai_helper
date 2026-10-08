export interface User {
  id: string;
  username: string;
  displayName: string;
  password: string;
  phone: string;
  avatar: string;
  createdAt: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system' | string; // string for real user IDs
  senderName?: string;
  timestamp: number;
}

export interface AIMemoryEntry {
  date: string;
  pressure: string;
  medications: string;
  notes: string;
}

export interface AISettings {
  aiName: string;
  aiPersonality: string;
  aiVoice: 'female' | 'male';
  aiSpeed: number;
  greeting: string;
}

export interface Medication {
  id: string;
  name: string;
  time: string;
  dosage: string;
  enabled: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  image: string;
  ingredients: string[];
  steps: string[];
  time: string;
  servings: number;
}

export interface UserAccount {
  user: User;
  aiSettings: AISettings;
  medications: Medication[];
  aiChatMessages: Message[];
  memoryData: AIMemoryEntry[];
  contacts: string[]; // IDs of other users
  privateChats: Record<string, Message[]>; // chat with each contact
}

export interface CookieSession {
  userId: string;
  token: string;
  expiresAt: number;
}
