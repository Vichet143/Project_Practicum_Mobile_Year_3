import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../../store/authStore";
import {
  cancelPayment,
  createPayment,
  verifyPayment,
} from "../../../store/payment";

type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export default function Payment() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get delivery_id and amount from route params
  const delivery_id = params.delivery_id as string;
  const amount = parseFloat(params.amount as string);

  const { user, getValidToken } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [expirationTime, setExpirationTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const pollingIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Initialize payment on mount
  useEffect(() => {
    if (!delivery_id || !amount || !user) {
      setError("Missing required payment information");
      setLoading(false);
      return;
    }

    initializePayment();

    return () => {
      // Cleanup intervals on unmount
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Start countdown timer
  useEffect(() => {
    if (expirationTime && status === "pending") {
      timerIntervalRef.current = setInterval(() => {
        const now = new Date();
        const remaining = Math.max(
          0,
          Math.floor((expirationTime.getTime() - now.getTime()) / 1000),
        );
        setTimeRemaining(remaining);

        if (remaining === 0) {
          setStatus("expired");
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
        }
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [expirationTime, status]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getValidToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const result = await createPayment(
        {
          delivery_id,
          user_id: user!.id,
          amount,
          currency: "USD",
          description: `Payment for delivery ${delivery_id}`,
        },
        token,
      );

      if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to create payment");
      }

      setPaymentId(result.data.payment_id);
      setQrCode(result.data.qr_code);
      setExpirationTime(new Date(result.data.expiration));
      setStatus("pending");

      // Start polling for payment status
      startPolling(result.data.payment_id);
    } catch (err: any) {
      setError(err.message || "Failed to initialize payment");
      setStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (paymentId: string) => {
    // Poll every 3 seconds
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const token = await getValidToken();
        if (!token) {
          throw new Error("Authentication token not found");
        }
        const result = await verifyPayment(paymentId, token);
        console.log("Polling result:", result);
        console.log(paymentId);
        console.log(token);
        console.log(result.success);
        console.log(result.data);

        if (result.success && result.data) {
          const newStatus = result.data.status;
          console.log("New status detected:", newStatus);
          setStatus(newStatus);

          // Stop polling if payment is resolved
          if (
            newStatus === "paid" ||
            newStatus === "failed" ||
            newStatus === "expired"
          ) {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
          }
        } else {
          console.log("Polling failed:", result.message);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Payment",
      "Are you sure you want to cancel this payment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            const token = await getValidToken();
            if (paymentId && token) {
              await cancelPayment(paymentId, token);
            }
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
            }
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            // Navigate back to user home after canceling
            router.replace("/navigation/user");
          },
        },
      ],
    );
  };

  const handleRetry = () => {
    initializePayment();
  };

  const handleContinue = () => {
    // Navigate to user history after successful payment
    router.replace("/navigation/user/history");
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Creating payment...</Text>
      </View>
    );
  }

  console.log("status" + status);
  // Error state
  if (error && status === "failed") {
    return (
      <View style={styles.container}>
        <Ionicons name="close-circle" size={80} color="#FF3B30" />
        <Text style={styles.statusTitle}>Payment Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Paid state
  if (status === "paid") {
    return (
      <View style={styles.container}>
        <Ionicons name="checkmark-circle" size={80} color="#34C759" />
        <Text style={styles.statusTitle}>Payment Successful!</Text>
        <Text style={styles.amountText}>${amount.toFixed(2)} USD</Text>
        <Text style={styles.successMessage}>
          Your payment has been confirmed
        </Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Expired state
  if (status === "expired") {
    return (
      <View style={styles.container}>
        <Ionicons name="time-outline" size={80} color="#FF9500" />
        <Text style={styles.statusTitle}>Payment Expired</Text>
        <Text style={styles.expiredText}>
          The QR code has expired. Please create a new payment.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Create New Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pending state - Show QR code
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan to Pay</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Amount */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountValue}>${amount.toFixed(2)} USD</Text>
        </View>

        {/* QR Code */}
        {qrCode && (
          <View style={styles.qrContainer}>
            <Image
              source={{ uri: qrCode }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Pay:</Text>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.instructionText}>
              Open your Bakong app or any KHQR-compatible banking app
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.instructionText}>Scan the QR code above</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.instructionText}>
              Confirm the payment amount
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.instructionText}>Complete the transaction</Text>
          </View>
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#FF9500" />
          <Text style={styles.timerText}>
            QR expires in: {formatTime(timeRemaining)}
          </Text>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.statusText}>Waiting for payment...</Text>
        </View>

        {/* Cancel button */}
        <TouchableOpacity
          style={styles.cancelButtonBottom}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel Payment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  amountContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
  },
  qrContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrImage: {
    width: 280,
    height: 280,
  },
  instructionsContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    flex: 1,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9500",
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  amountText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  errorText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  expiredText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
    minWidth: 200,
  },
  continueButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: 200,
    marginBottom: 12,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: 200,
  },
  cancelButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButtonBottom: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
});
