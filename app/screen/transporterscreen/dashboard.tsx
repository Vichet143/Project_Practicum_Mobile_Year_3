import React, { useEffect, useMemo } from "react";
import { View, Text, FlatList, ActivityIndicator, ScrollView } from "react-native";
import StatsCard from "../../../components/transporter/StatsCard";
import RecentHistoryTable from "../../../components/transporter/RecentHistoryTable";
import { useAuthStore } from "@/store/authStore";
import { useDeliveryStore } from "../../../store/createDelivery";

export default function TransporterDashboard() {
  const { user } = useAuthStore();

  const { completedJobs, getTransporterHistory, loading } = useDeliveryStore();
  
   useEffect(() => {
    getTransporterHistory();
  }, []);

  // Calculate real stats based on history
  const totalEarnings = useMemo(() => 
    completedJobs.reduce((sum, job) => sum + (parseFloat(`${job.price}`) || 0), 0), 
    [completedJobs]
  );

  const recentHistoryData = useMemo(() => 
    completedJobs.slice(0, 5).map((job) => ({
      delivery_id: job.delivery_id,
      route: job.dropoff?.address || "Unknown",
      amount: `${job.price}$`
    })), 
    [completedJobs]
  );

  return (
      <ScrollView className="flex-1 bg-[#F5F5F5]" showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-6">
        <View className="mb-4">
          <Text className="text-2xl font-bold text-black mb-1">Dashboard</Text>
          <Text className="text-sm text-gray-600 font-medium">
            Welcome back{user?.fullname ? `, ${user.fullname}` : ""}!
          </Text>
        </View>

        <View className="h-[1px] bg-gray-300 w-full mb-6" />

        {/* Stats Cards */}
        <View className="flex-row justify-between mb-8">
          <StatsCard
            value={`${totalEarnings}$`}
            label="Total Earnings"
            trend="Live"
            iconName="receipt"
            iconColor="#10B981"
            iconBgColor="bg-green-100"
          />
          <StatsCard
            value={completedJobs.length.toString()}
            label="Total Delivered"
            trend="Lifetime"
            iconName="cube"
            iconColor="#10B981"
            iconBgColor="bg-green-100"
          />
        </View>

        <View className="h-[1px] bg-gray-300 w-full mb-6" />
        <Text className="text-lg font-bold text-black mb-4">Recent History</Text>

        {/* Single Table with All Items */}
        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator color="#10B981" />
          </View>
        ) : recentHistoryData.length > 0 ? (
          <RecentHistoryTable data={recentHistoryData} />
        ) : (
          <Text className="text-center py-10">No recent deliveries found.</Text>
        )}
      </View>
    </ScrollView>
  );
}
