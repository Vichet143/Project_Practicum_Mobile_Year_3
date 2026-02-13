import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebaseConfig";

const API_KEY = process.env.EXPO_PUBLIC_API_URL;

/* ================= TYPES ================= */

interface User {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  verificationId: string | null;

  register: (
    fullname: string,
    phone_number: string,
    email: string,
    password: string,
  ) => Promise<AuthResult>;

  sendOTP: (phone: string, recaptcha: any) => Promise<AuthResult>;
  verifyOTP: (code: string) => Promise<AuthResult>;

  logout: () => Promise<void>;
}
/* ================= STORE ================= */

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  verificationId: null,

  /* -------- REGISTER -------- */
  register: async (fullname, phone_number, email, password) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`${API_KEY}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          phone_number,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        set({ isLoading: false });
        return { success: false, message: data.message };
      }

      set({ isLoading: false });
      return { success: true, user: data.user };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { success: false, message: err.message };
    }
  },

  /* -------- SEND OTP -------- */
  
  sendOTP: async (phone, recaptcha) => {
    try {
      set({ isLoading: true, error: null });

      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(phone, recaptcha);

      set({ verificationId, isLoading: false });
      return { success: true };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { success: false, message: err.message };
    }
  },

  /* -------- VERIFY OTP -------- */
  verifyOTP: async (code) => {
    try {
      set({ isLoading: true, error: null });

      const { verificationId } = get();
      if (!verificationId) {
        throw new Error("OTP not requested");
      }

      const credential = PhoneAuthProvider.credential(verificationId, code);

      const userCred = await signInWithCredential(auth, credential);
      const token = await userCred.user.getIdToken();

      // 🔐 Send token to backend
      const res = await fetch(`${API_KEY}/auth/login`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      set({
        user: data.user,
        token,
        isLoading: false,
      });

      return { success: true, user: data.user, token };
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return { success: false, message: err.message };
    }
  },

  /* -------- LOGOUT -------- */
  logout: async () => {
    set({ user: null, token: null });
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  },
}));
