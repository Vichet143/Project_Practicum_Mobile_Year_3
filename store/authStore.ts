import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { auth } from "../firebaseConfig";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/* ================= TYPES ================= */

interface User {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
  photoURL: string;
  role?: string;
  roles?: string;
  password?: string;
}

const normalizeUser = (user: any): User => {
  if (!user) return user;

  const normalizedRole = user.role || user.roles;
  return {
    ...user,
    role: normalizedRole,
    roles: user.roles || normalizedRole,
  };
};

interface AuthState {
  user: User | null;
  token: string | null;
  verificationId: string | null;

  isLoading: boolean;
  error: string | null;

  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  register: (
    fullname: string,
    phone: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;

  sendOTP: (
    phone: string,
    recaptcha: any,
  ) => Promise<{ success: boolean; message?: string }>;

  verifyOTP: (code: string) => Promise<{ success: boolean; message?: string }>;

  getValidToken: (forceRefresh?: boolean) => Promise<string | null>;

  logout: () => Promise<void>;
}

/* ================= STORE ================= */

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      verificationId: null,

      isLoading: false,
      error: null,

      _hasHydrated: false,
      setHasHydrated: (value: boolean) => set({ _hasHydrated: value }),

      /* -------- REGISTER -------- */
      register: async (fullname, phone_number, email, password) => {
        try {
          set({ isLoading: true, error: null });

          const res = await fetch(`${API_URL}/auth/register`, {
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

          set({ isLoading: false });

          if (!res.ok) {
            return { success: false, message: data.message };
          }

          return { success: true };
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

          const verificationId = await provider.verifyPhoneNumber(
            phone,
            recaptcha,
          );

          set({
            verificationId,
            isLoading: false,
          });

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

          // 🔐 Firebase credential
          const credential = PhoneAuthProvider.credential(verificationId, code);

          const userCred = await signInWithCredential(auth, credential);

          // 🔐 Firebase ID token
          const firebaseToken = await userCred.user.getIdToken();

          // 🔐 Send token to backend
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${firebaseToken}`,
            },
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Login failed");
          }

          set({
            user: normalizeUser(data.user),
            token: firebaseToken,
            isLoading: false,
          });

          return { success: true };
        } catch (err: any) {
          set({ isLoading: false, error: err.message });
          return { success: false, message: err.message };
        }
      },

      getValidToken: async (forceRefresh = false) => {
        try {
          const currentUser = auth.currentUser;

          if (!currentUser) {
            return get().token;
          }

          const freshToken = await currentUser.getIdToken(forceRefresh);

          if (freshToken && freshToken !== get().token) {
            set({ token: freshToken });
          }

          return freshToken;
        } catch (err: any) {
          set({ error: err?.message || "Failed to refresh token" });
          return get().token;
        }
      },

      /* -------- LOGOUT -------- */
      logout: async () => {
        await signOut(auth);

        set({
          user: null,
          token: null,
          verificationId: null,
        });
      },
    }),
    {
      name: "auth-storage",

      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const getuserByUid = async (uid: string) => {
  try {
    const res = await fetch(`${API_URL}/users/${uid}`, {
      method: "GET",
    });

    if (!res.ok) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const data = await res.json();
    return {
      success: true,
      user: normalizeUser(data.user),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getTransporterByid = async (transporter_id: string) => {
  try {
    const res = await fetch(`${API_URL}/transporters/${transporter_id}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch transporters");
    }

    const data = await res.json();
    return {
      success: true,
      transporters: data.transporters,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateUserProfile = async (
  uid: string,
  fullname: string,
  email: string,
  password: string,
  photoURL: string,
  phone_number: string,
  roles: string,
) => {
  try {
    console.log(`${API_URL}/auth/updateprofile/${uid}`);
    const res = await fetch(`${API_URL}/auth/updateprofile/${uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname,
        phone_number,
        photoURL,
        email,
        password,
        roles,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let parsed: any = null;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch (e) {
        parsed = null;
      }
      throw new Error(
        parsed?.message || parsed?.error || text || "Failed to update profile",
      );
    }

    const data = await res.json();
    return {
      success: true,
      user: normalizeUser(data.user),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
