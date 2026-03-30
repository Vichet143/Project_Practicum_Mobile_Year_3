import { create } from "zustand";
import { useAuthStore } from "./authStore";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/* ================= TYPES ================= */

interface Message {
  id: string;
  text: string;
  sender_type: "user" | "transporter";
  date?: any;
}

export interface Chat {
  id: string;
  user_id: string;
  transporter_id: string;
  messages: string; // This is actually a single message text
  sender_type: "user" | "transporter";
  date?: any;
  user?: any; // Optional, for display purposes
  transporter?: any; // Optional, for display purposes
}

interface CreateChatPayload {
  user_id: string;
  transporter_id: string;
  messages: string;
}

interface ChatStore {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;

  // Create a new chat message
  createChat: (payload: CreateChatPayload) => Promise<Chat | null>;

  // Get all chats for a user
  getUserChats: (user_id: string) => Promise<void>;

  // Get all chats for a transporter
  getTransporterChats: (transporter_id: string) => Promise<void>;

  // Set current chat for conversation view
  setCurrentChat: (chat: Chat | null) => void;

  // Clear error
  clearError: () => void;
}

const getToken = async () => {
  return await useAuthStore.getState().getValidToken();
};

/* ================= HELPERS ================= */

export const convertFirestoreTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date();

  // If it's already a Date object
  if (timestamp instanceof Date) return timestamp;

  // If it has toDate method (Firestore Timestamp object)
  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate();
  }

  // If it has _seconds (Firestore timestamp from API)
  if (timestamp._seconds !== undefined) {
    return new Date(timestamp._seconds * 1000);
  }

  // Otherwise try to parse as date
  return new Date(timestamp);
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  currentChat: null,
  loading: false,
  error: null,

  createChat: async (payload: CreateChatPayload) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        const message =
          typeof data === "object" && data?.message
            ? data.message
            : `Failed to create chat (${res.status})`;

        set({ loading: false, error: message });
        return null;
      }

      if (data.success && data.data) {
        const newChat = data.data;
        set((state) => ({
          chats: [newChat, ...state.chats],
          loading: false,
        }));
        return newChat;
      } else {
        set({ loading: false, error: "Unexpected response format" });
        return null;
      }
    } catch (error: any) {
      console.error("[createChat] Error:", error);
      const message =
        error.name === "AbortError"
          ? "Request timeout"
          : error.message || "Failed to create chat";
      set({ loading: false, error: message });
      return null;
    }
  },

  getUserChats: async (user_id: string) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${API_URL}/chat/user/${user_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        const message =
          typeof data === "object" && data?.message
            ? data.message
            : `Failed to get user chats (${res.status})`;

        set({ loading: false, error: message });
        return;
      }

      if (data.success && Array.isArray(data.data)) {
        // Sort chats by date (most recent first)
        const sortedChats = data.data.sort((a: Chat, b: Chat) => {
          const dateA = a.date?.toDate ? a.date.toDate().getTime() : 0;
          const dateB = b.date?.toDate ? b.date.toDate().getTime() : 0;
          return dateB - dateA;
        });

        set({
          chats: sortedChats,
          loading: false,
        });
      } else {
        set({ loading: false, error: "Unexpected response format" });
      }
    } catch (error: any) {
      console.error("[getUserChats] Error:", error);
      const message =
        error.name === "AbortError"
          ? "Request timeout"
          : error.message || "Failed to get user chats";
      set({ loading: false, error: message });
    }
  },

  getTransporterChats: async (transporter_id: string) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${API_URL}/chat/transporter/${transporter_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        const message =
          typeof data === "object" && data?.message
            ? data.message
            : `Failed to get transporter chats (${res.status})`;

        set({ loading: false, error: message });
        return;
      }

      if (data.success && Array.isArray(data.data)) {
        // Sort chats by date (most recent first)
        const sortedChats = data.data.sort((a: Chat, b: Chat) => {
          const dateA = a.date?.toDate ? a.date.toDate().getTime() : 0;
          const dateB = b.date?.toDate ? b.date.toDate().getTime() : 0;
          return dateB - dateA;
        });

        set({
          chats: sortedChats,
          loading: false,
        });
      } else {
        set({ loading: false, error: "Unexpected response format" });
      }
    } catch (error: any) {
      console.error("[getTransporterChats] Error:", error);
      const message =
        error.name === "AbortError"
          ? "Request timeout"
          : error.message || "Failed to get transporter chats";
      set({ loading: false, error: message });
    }
  },

  setCurrentChat: (chat: Chat | null) => {
    set({ currentChat: chat });
  },

  clearError: () => {
    set({ error: null });
  },
}));
