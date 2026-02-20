import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "./authStore";
import { auth } from "../firebaseConfig";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface Delivery {
  delivery_id: string;
  userId: string;
  recipientName: string;
  recipientPhone: string;
  pickup: LocationData;
  dropoff: LocationData;
  packageName: string;
  packageNote: string;
  packageSize: string;
  status: string;
  createdAt: any;
  updatedAt: any;
}

interface CreateDeliveryPayload {
  recipientName: string;
  recipientPhone: string;
  pickup: LocationData;
  dropoff: LocationData;
  packageName: string;
  packageNote: string;
  packageSize: "small" | "medium" | "large";
}

interface DeliveryStore {
  deliveries: Delivery[];
  loading: boolean;
  error: string | null;

  createDelivery: (payload: CreateDeliveryPayload) => Promise<boolean>;
  getDeliveryHistory: () => Promise<void>;
  getDeliveryById: (delivery_id: string) => Promise<Delivery | null>;
  updateDeliveryStatus: (
    delivery_id: string,
    status: string,
  ) => Promise<boolean>;
  cancelDelivery: (delivery_id: string) => Promise<boolean>;
}

const getToken = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return await currentUser.getIdToken(); 
  }
  return useAuthStore.getState().token; 
};

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  deliveries: [],
  loading: false,
  error: null,

  createDelivery: async (payload) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();

      console.log("=== DEBUG ===");
      console.log("Token:", token);
      console.log("API_URL:", API_URL);
      console.log("Payload:", JSON.stringify(payload));

      const res = await fetch(`${API_URL}/deliveries/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Status:", res.status);
      console.log("Response:", JSON.stringify(data));

      if (!res.ok) throw new Error(data.message);
      return true;
    } catch (err: any) {
      console.log("Catch Error:", err.message);
      set({ error: err.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getDeliveryHistory: async () => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/deliveries/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      set({ deliveries: data.deliveries });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  getDeliveryById: async (delivery_id) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/deliveries/${delivery_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data.delivery;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updateDeliveryStatus: async (delivery_id, status) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/deliveries/${delivery_id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  cancelDelivery: async (delivery_id) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/deliveries/${delivery_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
