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

interface StatusConfig {
  delivery_id?: string;
  packageName: string;
  status: string;
  recipientName: string;
  onPressView: () => void;
}

export default function Tracking({} : StatusConfig) {

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

  const statusState = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return { label: 'Accepted', color: 'text-blue-800', backgroundColor: 'bg-blue-200' };
      case 'picked_up':
        return { label: 'Picked Up', color: 'text-purple-800', backgroundColor: 'bg-purple-200' };
      case 'in_transit':
        return { label: 'In Transit', color: 'text-blue-800', backgroundColor: 'bg-blue-200' };
      case 'delivered':
      case 'completed':
        return { label: 'Completed', color: 'text-green-800', backgroundColor: 'bg-green-200' };
      case 'pending':
        return { label: 'Pending', color: 'text-orange-800', backgroundColor: 'bg-orange-200' };
      default:
        return { label: status, color: 'text-gray-800', backgroundColor: 'bg-gray-200' };
    }
  };

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
                <View className="flex-row items-center gap-4">
                  <Text className="text-sm text-gray-500">
                    Total: {item.price}$
                  </Text>
                  <View className={`px-2 py-1 ${statusState(item.status).color} ${statusState(item.status).backgroundColor} rounded-full`}>
                    <Text className={`text-sm ${statusState(item.status).color}`}>
                      {statusState(item.status).label}
                    </Text>
                  </View>
                </View>
                <Text className="text-sm text-gray-500">
                  Recipient: {item.recipientName}
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
