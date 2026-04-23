import { useDeliveryStore } from "@/store/createDelivery";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Status =
  | "Pending"
  | "Picked up"
  | "Delivered"
  | "In Transit"
  | "Cancelled";

interface ContentItem {
  id: string;
  title: string;
  total: number;
  status: Status;
}

const STATUS_OPTIONS: (Status | "All")[] = [
  "All",
  "Pending",
  "Picked up",
  "In Transit",
  "Delivered",
  "Cancelled",
];

// Helper function to normalize status from API
const normalizeStatus = (status: string): Status => {
  const statusMap: Record<string, Status> = {
    pending: "Pending",
    picked_up: "Picked up",
    in_transit: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return statusMap[status.toLowerCase()] || "Pending";
};

export default function History() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<Status | "All">("All");
  const { deliveries, getDeliveryHistory, loading } = useDeliveryStore();

  // Fetch delivery history on mount
  useEffect(() => {
    getDeliveryHistory();
  }, [getDeliveryHistory]);

  // Map deliveries from store to ContentItem format
  const mappedDeliveries = useMemo(() => {
    return deliveries.map((delivery) => ({
      id: delivery.delivery_id,
      title: delivery.packageName,
      total: delivery.price,
      status: normalizeStatus(delivery.status),
    }));
  }, [deliveries]);

  // Compute the filtered list and the count
  const filteredData = useMemo(() => {
    if (selectedStatus === "All") {
      return mappedDeliveries;
    }
    return mappedDeliveries.filter((item) => item.status === selectedStatus);
  }, [selectedStatus, mappedDeliveries]);

  const availableCount = filteredData.length;

  const handleRefresh = () => {
    getDeliveryHistory();
  };

  return (
    <View className="w-full h-full px-[1rem] pt-[2rem]">
      {/* Status Filter */}
      <View className="w-full gap-2">
        {/* First Row */}
        <View className="w-full h-[3rem] flex-row gap-2">
          {STATUS_OPTIONS.slice(0, 3).map((status) => (
            <TouchableOpacity
              key={status}
              className={`flex-1 h-full items-center justify-center rounded-lg border ${
                selectedStatus === status
                  ? "bg-[#FF6347] border-[#FF6347]"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedStatus === status ? "text-white" : "text-gray-800"
                }`}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Second Row */}
        <View className="w-full h-[3rem] flex-row gap-2">
          {STATUS_OPTIONS.slice(3).map((status) => (
            <TouchableOpacity
              key={status}
              className={`flex-1 h-full items-center justify-center rounded-lg border ${
                selectedStatus === status
                  ? "bg-[#FF6347] border-[#FF6347]"
                  : "bg-white border-gray-300"
              }`}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedStatus === status ? "text-white" : "text-gray-800"
                }`}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-1 mt-[1rem] mb-[5rem]">
        {/* Order Lists */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-10">
              {loading ? (
                <ActivityIndicator size="large" color="#FF6347" />
              ) : (
                <>
                  <Text className="text-lg text-gray-500 mb-2">
                    No deliveries found
                  </Text>
                  <Text className="text-sm text-gray-400">
                    Pull down to refresh
                  </Text>
                </>
              )}
            </View>
          }
          renderItem={({ item }) => {
            return (
              <View className="w-full h-[5rem] mt-[1rem] px-[1rem] flex-row justify-between items-center bg-white border border-gray-400 rounded-lg">
                <View className="flex-col">
                  <Text className="text-lg font-medium">{item.title}</Text>
                  <View className="flex-row items-center gap-4">
                    <Text className="text-sm text-gray-500">
                      Total: ${item.total.toFixed(2)}
                    </Text>
                    <View
                      className={`px-2 py-1 rounded-full ${item.status === "Delivered" 
                        ? "bg-green-200" 
                        : item.status === "Pending" 
                        ? "bg-orange-200" 
                        : item.status === "Picked up" 
                        ? "bg-purple-200" 
                        : item.status === "In Transit" 
                        ? "bg-blue-200" 
                        : "bg-red-200"}`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          item.status === "Delivered"
                            ? "text-green-800"
                            : item.status === "Pending"
                            ? "text-orange-800"
                            : item.status === "Picked up"
                            ? "text-purple-800"
                            : item.status === "In Transit"
                            ? "text-blue-800"
                            : "text-red-800"
                        }`}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* View Button */}
                <TouchableOpacity
                  className="bg-[#FF6347] px-4 py-2 rounded-md"
                  onPress={() => router.push(`/screen/View?id=${item.id}`)}
                >
                  <Text className="text-white font-medium">View</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
