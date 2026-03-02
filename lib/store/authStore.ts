import { User } from '@/types/user';
import { create } from 'zustand';


interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearIsAuthenticated: () => void;
}

// Використовуємо подвійні дужки (currying) для коректної типізації, як вказано в ДЗ
export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => 
    set({ 
      user, 
      isAuthenticated: !!user 
    }),
    
  clearIsAuthenticated: () => 
    set({ 
      user: null, 
      isAuthenticated: false 
    }),
}));