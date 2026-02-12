import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
}

interface RegisterResult {
  success?: boolean;
  message?: string;
  user?: User;
  token?: string;
}

interface LoginResult {
  success?: boolean;
  message?: string;
  user?: User;
  token?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  register: (
    fullname: string,
    phone_number: string,
    email: string,
    password: string,
  ) => Promise<RegisterResult>;

  login: (email: string, password: string) => Promise<LoginResult>;

  logout: () => void;
}

const API_KEY = process.env.EXPO_PUBLIC_API_URL;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  
  register: async (fullname, phone_number, email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${API_KEY}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, phone_number, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Registration failed",
        };
      }

      set({ user: data.user, token: data.token, isLoading: false });

      return { success: true, user: data.user, token: data.token };
    } catch (error: any) {
      set({ error: error.message || "Something went wrong", isLoading: false });
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${API_KEY}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      set({ user: data.user, token: data.token, isLoading: false });

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        user: data.user,
        token: data.token,
        message: "Login successful",
      };
    } catch (error: any) {
      set({ error: error.message || "Something went wrong", isLoading: false });
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  },

  logout: async () => {
    set({ user: null, token: null });
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  },
}));
