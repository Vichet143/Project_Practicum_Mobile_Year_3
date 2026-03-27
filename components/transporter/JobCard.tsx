import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface JobCardProps {
  delivery_id?: string;
  from: string;
  to: string;
  weight: string;
  price: number;
  isLoading?: boolean;
  onAccept?: () => void;
}

export default function JobCard({
  delivery_id,
  from,
  to,
  weight,
  price,
  isLoading = false,
  onAccept,
}: JobCardProps) {
  return (
    <View className="bg-white rounded-[20px] p-4 m-2 shadow-sm border border-gray-100 flex-1">
      <View className="flex-row justify-between mb-4">
        <View className="flex-1 mr-2">
          <Text
            className="text-xs text-gray-800 font-medium mb-1"
            numberOfLines={1}
          >
            From: {from}
          </Text>
          <Text
            className="text-xs text-gray-800 font-medium mb-1"
            numberOfLines={1}
          >
            To: {to}
          </Text>
          <Text className="text-xs text-gray-800 font-medium" numberOfLines={1}>
            Weight: {weight}
          </Text>
        </View>
        <Text className="text-sm font-bold text-gray-900">${price}</Text>
      </View>
      <TouchableOpacity
        onPress={onAccept}
        disabled={isLoading}
        className={`py-2.5 rounded-full items-center mt-auto ${
          isLoading ? "bg-gray-300" : "bg-gray-200"
        }`}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#666" />
        ) : (
          <Text className="text-[10px] font-bold text-gray-800 tracking-wider">
            ACCEPT ORDER
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
