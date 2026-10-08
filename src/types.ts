export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: number;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  lastMessage?: string;
}

export interface Medication {
  id: string;
  name: string;
  time: string;
  dosage: string;
  enabled: boolean;
}

export interface Settings {
  phoneNumber: string;
  userName: string;
  aiName: string;
  memoryPhone: string;
  memoryData: MemoryEntry[];
}

export interface MemoryEntry {
  date: string;
  pressure: string;
  medications: string;
  notes: string;
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
