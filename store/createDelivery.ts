import { create } from "zustand";
import { useAuthStore } from "./authStore";

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
  price: number;
  status: string;
  createdAt: any;
  updatedAt: any;
  paymentStatus: string;
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

  // Returns delivery_id string on success, null on failure
  createDelivery: (payload: CreateDeliveryPayload) => Promise<string | null>;
  getDeliveryHistory: () => Promise<void>;
  getDeliveryById: (delivery_id: string) => Promise<Delivery | null>;
  updateDeliveryStatus: (
    delivery_id: string,
    status: string,
  ) => Promise<boolean>;
  cancelDelivery: (delivery_id: string) => Promise<boolean>;
}

const getToken = async () => {
  return await useAuthStore.getState().getValidToken();
};

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  deliveries: [],
  loading: false,
  error: null,

  createDelivery: async (payload) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${API_URL}/deliveries/create`, {
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
            : `Failed to create delivery (${res.status})`;
        throw new Error(message);
      }

      // Return the delivery_id from the response
      const deliveryId =
        (typeof data === "object" ? data.delivery_id : null) ??
        (typeof data === "object" ? data.delivery?.delivery_id : null) ??
        (typeof data === "object" ? data.data?.delivery_id : null) ??
        (typeof data === "object" ? data.id : null) ??
        null;

      return deliveryId;
    } catch (err: any) {
      const message =
        err?.name === "AbortError"
          ? "Request timeout. Please check your internet/backend and try again."
          : err?.message || "Failed to create delivery";
      set({ error: message });
      return null;
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
