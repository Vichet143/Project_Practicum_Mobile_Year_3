import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

const mockData = [
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
  { id: "1", route: "Boeung Kak, Phnom Penh", amount: "10$" },
];

export default function RecentHistoryTable() {
  const renderItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-200 px-4">
      <Text className="w-[10%] text-sm text-gray-800">{item.id}</Text>
      <Text className="w-[50%] text-sm text-gray-800">{item.route}</Text>
      <Text className="w-[20%] text-sm text-gray-800">{item.amount}</Text>
      <TouchableOpacity className="w-[20%] bg-[#93C5FD] rounded-full py-1.5 items-center">
        <Text className="text-black font-bold text-xs">View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <Text className="text-lg font-bold text-gray-800 px-5 pt-5 pb-3">
        Recent History
      </Text>
      <View className="flex-row items-center justify-between bg-gray-200 py-3 px-4">
        <Text className="w-[10%] text-xs font-bold text-gray-600">ID</Text>
        <Text className="w-[50%] text-xs font-bold text-gray-600">Route</Text>
        <Text className="w-[40%] text-xs font-bold text-gray-600">Amount</Text>
      </View>
      <View>
        {mockData.map((item, index) => (
          <View key={index}>
            {renderItem({ item })}
          </View>
        ))}
      </View>
    </View>
  );
}
