import React from "react";
import { ScrollView, View, Text } from "react-native";
import StatsCard from "../../../components/transporter/StatsCard";
import RecentHistoryTable from "../../../components/transporter/RecentHistoryTable";
import { useAuthStore } from "@/store/authStore";

export default function TransporterDashboard() {
  const { user } = useAuthStore();

  return (
    <ScrollView 
      className="flex-1 bg-[#F5F5F5]"
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header section (dashboard) */}
      <View className="mb-4">
        <Text className="text-2xl font-bold text-black mb-1">Dashboard</Text>
        <Text className="text-sm text-gray-600 font-medium">
          Welcome back{user?.fullname ? `, ${user.fullname}` : ""}!
        </Text>
      </View>

      <View className="h-[1px] bg-gray-300 w-full mb-6" />

      {/* Stats Cards */}
      <View className="flex-row justify-between mb-8 overflow-visible">
        <StatsCard
          value="75"
          label="Earnings"
          trend="4% (30 days)"
          iconName="receipt"
          iconColor="#10B981"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          value="357"
          label="Total Delivered"
          trend="4% (30 days)"
          iconName="cube"
          iconColor="#10B981"
          iconBgColor="bg-green-100"
        />
      </View>

      <View className="h-[1px] bg-gray-300 w-full mb-6" />

      {/* Recent History Table */}
      <RecentHistoryTable />
    </ScrollView>
  );
}
