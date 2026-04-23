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
  transporterId?: string;
  transporterName?: string;
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
  availableDeliveries: Delivery[]; // Used ONLY for the "Find Job" search screen
  activeJobs: Delivery[];
  completedJobs: Delivery[];
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

  // --- 3. TRANSPORTER ACTIONS ---
  getAvailableDeliveries: () => Promise<void>;
  acceptDelivery: (delivery_id: string) => Promise<boolean>;
  getTransporterActiveJobs: () => Promise<void>;
  getTransporterHistory: () => Promise<void>;
  updateTransporterStatus: (
    delivery_id: string,
    status: string
  ) => Promise<boolean>;
}

const getToken = async () => {
  return await useAuthStore.getState().getValidToken();
};

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  deliveries: [],
  availableDeliveries: [],
  activeJobs: [],
  completedJobs: [],
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

  // Fetch orders that need a driver
  getAvailableDeliveries: async () => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      // Assuming your backend has an endpoint for this. 
      // If not, you'll need to create one!
      const res = await fetch(`${API_URL}/deliveries/transporter/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      // console.log("🔥 BACKEND RESPONSE:", data); // Look at your terminal!

      if (!res.ok) throw new Error(data.message);

      // Bulletproof way to extract the array, regardless of backend format
      const extractedArray = Array.isArray(data) ? data : (data.deliveries || data.data || []);

      set({ availableDeliveries: extractedArray });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // Driver accepts the order
  acceptDelivery: async (delivery_id) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      // This endpoint needs to tie the logged-in transporter's ID to the delivery
      const res = await fetch(`${API_URL}/deliveries/${delivery_id}/accept`, {
        method: "POST", // or PATCH, depending on your backend
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Instantly remove the accepted job from the available list so it disappears from UI
      set((state) => ({
        availableDeliveries: state.availableDeliveries.filter((d) => d.delivery_id !== delivery_id)
      }));

      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  getTransporterActiveJobs: async () => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      // This endpoint should return jobs where transporterId matches the logged-in user
      const res = await fetch(`${API_URL}/deliveries/transporter/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // We store these separately from "availableDeliveries"
      set({ activeJobs: data.deliveries || [] });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  getTransporterHistory: async () => {
    set({ loading: true });
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/deliveries/transporter/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      set({ completedJobs: data.deliveries || [] });
    } finally {
      set({ loading: false });
    }
  },

  // --- Dedicated Transporter Status Update ---
  updateTransporterStatus: async (delivery_id, status) => {
    set({ loading: true, error: null });
    try {
      const token = await getToken();
      
      // We use a specific endpoint for transporters to avoid 403 Forbidden errors
      // from the user-check logic.
      const res = await fetch(`${API_URL}/deliveries/${delivery_id}/transporter-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      console.log("Fetch result:", res);
      const data = await res.json();
      
      if (!res.ok) {
        // This will now catch "You are not the assigned transporter" from your backend
        throw new Error(data.message || "Failed to update driver status");
      }

      return true;
    } catch (err: any) {
      console.error("Driver Status Error:", err.message);
      set({ error: err.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
