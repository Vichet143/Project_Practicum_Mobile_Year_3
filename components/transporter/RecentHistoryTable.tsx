import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";

interface RecentHistoryItem {
  delivery_id: string;
  route: string;
  amount: string;
  onPressView?: () => void;
}

interface RecentHistoryTableProps {
  data: RecentHistoryItem[];
}

export default function RecentHistoryTable({ data }: RecentHistoryTableProps) {

  const router = useRouter();
  const renderItem = ({ item }: { item: RecentHistoryItem }) => (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-200 px-4">
      <Text className="w-[15%] text-sm text-blue-500">#{item.delivery_id?.slice(-4).toUpperCase()}</Text>
      <Text className="w-[45%] text-sm text-gray-800">{item.route?.slice(0, 20)}...</Text>
      <Text className="w-[20%] text-sm font-bold text-gray-800">{item.amount}</Text>
      <TouchableOpacity 
        onPress={() => router.push(`/screen/transporterscreen/tracking/TrackingDetail?id=${item.delivery_id}`)}
        className="w-[20%] bg-[#93C5FD] rounded-full py-1.5 items-center">
        <Text className="text-black font-bold text-sm">View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <View className="flex-row items-center justify-between bg-gray-200 py-3 px-4">
        <Text className="w-[15%] text-md font-bold text-gray-600">ID</Text>
        <Text className="w-[45%] text-md font-bold text-gray-600">Route</Text>
        <Text className="w-[20%] text-md font-bold text-gray-600">Amount</Text>
        <Text className="w-[20%] text-md font-bold text-gray-600">Actions</Text>
      </View>
    
      <FlatList
        data={data}
        renderItem={({ item }) => renderItem({ item })}
        keyExtractor={(item) => item.delivery_id || item.delivery_id} 
        scrollEnabled={false}
      />
    </View>
  );
}
