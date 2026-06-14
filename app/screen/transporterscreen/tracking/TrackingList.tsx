import { useRouter, useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
} from "react-native-heroicons/solid";
import TrackingListItem from "../../../../components/transporter/TrackingListItem";
import { useDeliveryStore } from "../../../../store/createDelivery";
// Define tab types
type TabType = "processing" | "completed";

export default function TrackingScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("processing");

  const {
    activeJobs,
    completedJobs,
    getTransporterActiveJobs,
    getTransporterHistory,
    loading,
  } = useDeliveryStore();

  // Define the refresh function with useCallback to prevent infinite loops
  const refreshData = useCallback(() => {
    if (activeTab === "processing") {
      getTransporterActiveJobs();
    } else {
      getTransporterHistory();
    }
  }, [activeTab, getTransporterActiveJobs, getTransporterHistory]);

  // This triggers whenever the user navigates TO this screen
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  useEffect(() => {
    refreshData();
  }, [activeTab, refreshData]);

  const currentData = activeTab === "processing" ? activeJobs : completedJobs;

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      {/* --- Header --- */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 rounded-full border border-gray-100 bg-gray-50">
          <Ionicons name="chevron-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Tracking List</Text>
        <TouchableOpacity className="p-2 rounded-full border border-gray-100 bg-gray-50">
          <EllipsisHorizontalIcon size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* --- Tab Buttons --- */}
      <View className="px-6 mt-4">
        <View className="flex-row bg-white border border-[#FF6B52] rounded-xl overflow-hidden">
          {(["processing", "completed"] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-4 items-center ${activeTab === tab ? "bg-[#FF6B52]" : "bg-white"}`}
            >
              <Text
                className={`font-bold capitalize ${activeTab === tab ? "text-white" : "text-gray-800"}`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* --- The List --- */}
      <View className="flex-1 px-6 mt-6">
        <FlatList
          data={currentData}
          keyExtractor={(item) => item.delivery_id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshData}
              colors={["#FF6B52"]}
            />
          }
          // Displays a message if the list is empty
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-lg text-gray-400">
                No {activeTab} orders found
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TrackingListItem
              location={item.dropoff?.address || "No Address"}
              price={`${item.price}$`}
              status={item.status}
              onPressView={() => router.push(`/screen/transporterscreen/tracking/TrackingDetail?id=${item.delivery_id}`)}
            />
          )}
        />
      </View>
    </View>
  );
}
