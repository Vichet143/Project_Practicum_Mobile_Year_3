import { useDeliveryStore } from "@/store/createDelivery";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const normalizeStatus = (status: string) =>
  status.toLowerCase().replace(/\s+/g, "_");

export default function Tracking() {
  const router = useRouter();
  const { deliveries, getDeliveryHistory, loading } = useDeliveryStore();

  useEffect(() => {
    getDeliveryHistory();
  }, [getDeliveryHistory]);

  const activeDeliveries = useMemo(() => {
    return deliveries.filter(
      (delivery) => normalizeStatus(delivery.status) !== "delivered",
    );
  }, [deliveries]);

  return (
    <View className="w-full h-full px-4 pt-4">
      <Text className="text-2xl font-bold text-gray-900">Track Delivery</Text>
      <Text className="text-sm text-gray-500 mt-1 mb-4">
        Ongoing deliveries only
      </Text>

      <FlatList
        data={activeDeliveries}
        keyExtractor={(item) => item.delivery_id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getDeliveryHistory} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            {loading ? (
              <ActivityIndicator size="large" color="#FF6347" />
            ) : (
              <Text className="text-gray-500 text-base">
                No active deliveries
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) =>
          normalizeStatus(item.status) !== "cancelled" ? (
            <View className="w-full mt-3 p-4 bg-white border border-gray-200 rounded-lg flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-base font-semibold text-gray-900">
                  {item.packageName}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Status: {item.status}
                </Text>
                <Text className="text-sm text-gray-500">
                  To: {item.recipientName}
                </Text>
              </View>

              <TouchableOpacity
                className="bg-[#FF6347] px-4 py-2 rounded-md"
                onPress={() =>
                  router.push(`/screen/View?id=${item.delivery_id}`)
                }
              >
                <Text className="text-white font-medium">View</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
}
