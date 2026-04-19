import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";

interface RecentHistoryItem {
  delivery_id: string;
  route: string;
  amount: string;
  onPressView?: () => void;
}

export default function RecentHistoryTable({
  delivery_id,
  route,
  amount,
  onPressView,
}: RecentHistoryItem) {

  const router = useRouter();
  // const renderItem = ({ item }: { item: RecentHistoryItem }) => (
  //   <View className="flex-row items-center justify-between py-4 border-b border-gray-200 px-4">
  //     <Text className="w-[15%] text-sm text-gray-800">#{delivery_id?.slice(-4).toUpperCase()}</Text>
  //     <Text className="w-[45%] text-sm text-gray-800">{route?.slice(0, 20)}...</Text>
  //     <Text className="w-[20%] text-sm text-gray-800">{amount}</Text>
  //     <TouchableOpacity 
  //       onPress={() => router.push(`/screen/transporterscreen/tracking/TrackingDetail?id=${delivery_id}`)}
  //       className="w-[20%] bg-[#93C5FD] rounded-full py-1.5 items-center">
  //       <Text className="text-black font-bold text-xs">View</Text>
  //     </TouchableOpacity>
  //   </View>
  // );

  const handleNavigateToDetail = () => {
    if (!delivery_id) {
      console.error("No Delivery ID found for navigation");
      return;
    }
    router.push(`/screen/transporterscreen/tracking/TrackingDetail?id=${delivery_id}`);
  }

  return (
    <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <View className="flex-row items-center justify-between bg-gray-200 py-3 px-4">
        <Text className="w-[15%] text-md font-bold text-gray-600">ID</Text>
        <Text className="w-[45%] text-md font-bold text-gray-600">Route</Text>
        <Text className="w-[20%] text-md font-bold text-gray-600">Amount</Text>
        <Text className="w-[20%] text-md font-bold text-gray-600">Actions</Text>
      </View>

      <View className="flex-row items-center justify-between py-4 px-4">
        {/* Use slice to keep the ID small and clean in the UI */}
        <Text className="w-[15%] text-xs font-bold text-blue-600">
          #{delivery_id?.slice(-4).toUpperCase()}
        </Text>
        
        <Text className="w-[45%] text-sm text-gray-800" numberOfLines={2}>
          {route}
        </Text>
        
        <Text className="w-[20%] text-sm font-bold text-gray-900">
          {amount}
        </Text>
        
        <TouchableOpacity 
          onPress={handleNavigateToDetail}
          className="w-[20%] bg-blue-100 rounded-full py-2 items-center"
        >
          <Text className="text-blue-700 font-bold text-xs">View</Text>
        </TouchableOpacity>
      </View>
      {/* <View>
        <FlatList
          data={[{ delivery_id, route, amount, onPressView }]} // Replace with actual data array
          renderItem={({ item }) => renderItem({ item })}
          keyExtractor={(item) => item.delivery_id || item.route} // Use delivery_id or route as key
        />
      </View> */}
    </View>
  );
}
