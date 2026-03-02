const API_URL = process.env.EXPO_PUBLIC_API_URL;

type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export interface CreatePaymentPayload {
  delivery_id: string;
  user_id: string;
  amount: number;
  currency: "USD";
  description?: string;
  fromAccount?: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  message?: string;
  data?: {
    payment_id: string;
    qr_code: string;
    qr_string: string;
    qr_md5: string;
    transaction_id: string;
    expiration: string;
    amount: number;
    currency: string;
  };
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  data?: {
    status: PaymentStatus;
    paid_at: string | null;
    bakong_hash: string;
    amount: number;
    currency: string;
    qr_code: string;
    qr_string: string;
    qr_expiration: string;
  };
}

type VerifyPaymentData = NonNullable<VerifyPaymentResponse["data"]>;

// ── Create a new payment and get QR code ──
export const createPayment = async (
  payload: CreatePaymentPayload,
  token: string,
): Promise<CreatePaymentResponse> => {
  try {
    const res = await fetch(`${API_URL}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      let errorMessage = `Failed to create payment (${res.status})`;

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // JSON parse failed, use default message
        }
      } else {
        const text = await res.text();
        console.error("Non-JSON error response:", text.substring(0, 200));
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    const data: CreatePaymentResponse = await res.json();
    return data;
  } catch (error: any) {
    console.error("Create payment error:", error);
    return {
      success: false,
      message: error.message || "Network error occurred",
    };
  }
};

// ── Verify / poll payment status ──
export const verifyPayment = async (
  payment_id: string,
  token: string,
): Promise<VerifyPaymentResponse> => {
  try {
    const res = await fetch(`${API_URL}/payment/${payment_id}/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      let errorMessage = `Failed to verify payment (${res.status})`;

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // JSON parse failed, use default message
        }
      } else {
        const text = await res.text();
        console.error("Non-JSON error response:", text.substring(0, 200));
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    const backendData = await res.json();
    const normalizedData: VerifyPaymentData | undefined =
      backendData?.status && typeof backendData.status === "string"
        ? backendData
        : backendData?.data?.status &&
            typeof backendData.data.status === "string"
          ? backendData.data
          : undefined;

    if (!normalizedData) {
      return {
        success: false,
        message: "Invalid verify payment response format",
      };
    }

    return {
      success: true,
      data: normalizedData,
    };
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return {
      success: false,
      message: error.message || "Network error occurred",
    };
  }
};

// ── Cancel a payment ──
export const cancelPayment = async (
  payment_id: string,
  token: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch(`${API_URL}/payments/${payment_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message || "Failed to cancel payment",
      };
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error occurred",
    };
  }
};
