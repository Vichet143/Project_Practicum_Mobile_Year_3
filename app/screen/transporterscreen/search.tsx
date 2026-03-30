import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import JobCard from "../../../components/transporter/JobCard";
import { useDeliveryStore } from "../../../store/createDelivery";

interface MappedDelivery {
  delivery_id: string;
  from: string;
  to: string;
  weight: string;
  price: number;
}

export default function TransporterSearchScreen() {
  const router = useRouter();
  // const { deliveries, getAvailableDeliveries, acceptDelivery, loading } = useDeliveryStore();
  const error = useDeliveryStore((state) => state.error);
  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);

  const availableDeliveries = useDeliveryStore(
    (state) => state.availableDeliveries,
  );
  const getAvailableDeliveries = useDeliveryStore(
    (state) => state.getAvailableDeliveries,
  );
  const acceptDelivery = useDeliveryStore((state) => state.acceptDelivery);
  const loading = useDeliveryStore((state) => state.loading);

  // Fetch available deliveries on component mount
  useEffect(() => {
    getAvailableDeliveries();
  }, []);

  // Transform delivery data to match JobCard props
  const mappedDeliveries: MappedDelivery[] = (availableDeliveries || []).map(
    (delivery) => ({
      delivery_id: delivery.delivery_id,
      from: delivery.pickup?.address || "Unknown location",
      to: delivery.dropoff?.address || "Unknown location",
      weight: delivery.packageSize || "N/A",
      price: delivery.price || 0,
    }),
  );

  const handleAcceptOrder = async (delivery_id: string) => {
    try {
      setAcceptingOrderId(delivery_id);

      // Call the accept delivery function from store
      const success = await acceptDelivery(delivery_id);

      if (success) {
        // Show success alert
        Alert.alert("Success", "Order accepted successfully!", [
          {
            text: "View Order",
            onPress: () => {
              // Refresh the available deliveries list
              getAvailableDeliveries();
              // Navigate to tracking screen
              router.push("/navigation/transporter/tracking");
            },
          },
          {
            text: "Continue Searching",
            onPress: () => {
              // Refresh the available deliveries list to remove accepted order
              getAvailableDeliveries();
            },
          },
        ]);
      } else {
        // Show error alert
        Alert.alert(
          "Error",
          "Failed to accept order. Please check your connection and try again.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error("Accept order error:", error);
    } finally {
      setAcceptingOrderId(null);
    }
  };

  return (
    <View className="flex-1 bg-[#F5F5F5] px-2 pt-6">
      {/* Header Area */}
      <View className="px-2 mb-4">
        <Text className="text-2xl font-bold text-black mb-3">Find Job</Text>
        <View className="h-[1px] bg-gray-400 w-full" />
      </View>
      {/* Error state */}
      {error ? (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-lg font-bold text-center mb-2">
            Oops!
          </Text>
          <Text className="text-gray-600 text-center">{error}</Text>
        </View>
      ) : loading && availableDeliveries.length === 0 ? (
        /* Loading state */
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF6347" />
          <Text className="mt-4 text-gray-600">Loading available jobs...</Text>
        </View>
      ) : mappedDeliveries.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">
            No jobs available at the moment
          </Text>
          <Text className="text-sm text-gray-500 mt-2">
            Check back later for new delivery opportunities
          </Text>
        </View>
      ) : (
        /* 2-Column Grid of Job Cards */
        <FlatList
          data={mappedDeliveries}
          keyExtractor={(item) => item.delivery_id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1, maxWidth: '50%' }}>
              <JobCard
                delivery_id={item.delivery_id}
                from={item.from}
                to={item.to}
                weight={item.weight}
                price={item.price}
                isLoading={acceptingOrderId === item.delivery_id}
                onAccept={() => handleAcceptOrder(item.delivery_id)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}
