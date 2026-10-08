import { User, UserAccount, CookieSession, AISettings, Medication } from '../types';

const USERS_KEY = 'zabota_users';
const ACCOUNTS_KEY = 'zabota_accounts';
const SESSION_KEY = 'zabota_session';
const COOKIE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

// Generate simple token
function generateToken(): string {
  return 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Get all registered users
export function getAllUsers(): User[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save all users
function saveAllUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get all accounts
function getAllAccounts(): Record<string, UserAccount> {
  try {
    const data = localStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// Save all accounts
function saveAllAccounts(accounts: Record<string, UserAccount>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

// Default AI settings
const defaultAISettings: AISettings = {
  aiName: 'Заботушка',
  aiPersonality: 'friendly',
  aiVoice: 'female',
  aiSpeed: 0.85,
  greeting: 'Здравствуйте, {name}! Это {aiName}, ваш заботливый помощник.',
};

// Register new user
export function registerUser(
  username: string,
  displayName: string,
  password: string,
  phone: string
): { success: boolean; error?: string; user?: User } {
  const users = getAllUsers();
  
  // Check if username exists
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: 'Пользователь с таким именем уже существует' };
  }

  const newUser: User = {
    id: 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    username: username.trim(),
    displayName: displayName.trim(),
    password,
    phone: phone.trim(),
    avatar: getRandomAvatar(),
    createdAt: Date.now(),
  };

  users.push(newUser);
  saveAllUsers(users);

  // Create account
  const accounts = getAllAccounts();
  accounts[newUser.id] = {
    user: newUser,
    aiSettings: { ...defaultAISettings },
    medications: [],
    aiChatMessages: [],
    memoryData: [],
    contacts: [],
    privateChats: {},
  };
  saveAllAccounts(accounts);

  return { success: true, user: newUser };
}

// Login user
export function loginUser(
  username: string,
  password: string
): { success: boolean; error?: string; user?: User } {
  const users = getAllUsers();
  const user = users.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Неверное имя пользователя или пароль' };
  }

  // Create session (cookie)
  const session: CookieSession = {
    userId: user.id,
    token: generateToken(),
    expiresAt: Date.now() + COOKIE_DURATION,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { success: true, user };
}

// Auto-login via cookie
export function autoLogin(): User | null {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    const session: CookieSession = JSON.parse(sessionStr);
    
    // Check if session expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    const users = getAllUsers();
    const user = users.find(u => u.id === session.userId);
    return user || null;
  } catch {
    return null;
  }
}

// Logout
export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

// Get user account
export function getUserAccount(userId: string): UserAccount | null {
  const accounts = getAllAccounts();
  return accounts[userId] || null;
}

// Save user account
export function saveUserAccount(account: UserAccount) {
  const accounts = getAllAccounts();
  accounts[account.user.id] = account;
  saveAllAccounts(accounts);
}

// Get user by ID
export function getUserById(userId: string): User | null {
  const users = getAllUsers();
  return users.find(u => u.id === userId) || null;
}

// Add contact
export function addContact(currentUserId: string, contactUserId: string) {
  const account = getUserAccount(currentUserId);
  if (!account) return;
  
  if (!account.contacts.includes(contactUserId)) {
    account.contacts.push(contactUserId);
    account.privateChats[contactUserId] = [];
    saveUserAccount(account);
  }
}

// Remove contact
export function removeContact(currentUserId: string, contactUserId: string) {
  const account = getUserAccount(currentUserId);
  if (!account) return;
  
  account.contacts = account.contacts.filter(id => id !== contactUserId);
  delete account.privateChats[contactUserId];
  saveUserAccount(account);
}

// Get random avatar
function getRandomAvatar(): string {
  const avatars = ['👤', '👩', '👨', '👵', '👴', '🧓', '👱', '👩‍🦰', '👨‍🦳', '👩‍🦱'];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

// Get all other users (for adding contacts)
export function getOtherUsers(currentUserId: string): User[] {
  return getAllUsers().filter(u => u.id !== currentUserId);
}
