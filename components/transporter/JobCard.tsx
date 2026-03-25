import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface JobCardProps {
  from: string;
  to: string;
  weight: string;
  price: number;
  onAccept?: () => void;
}

export default function JobCard({
  from,
  to,
  weight,
  price,
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
        className="bg-gray-200 py-2.5 rounded-full items-center mt-auto"
      >
        <Text className="text-[10px] font-bold text-gray-800 tracking-wider">
          ACCEPT ORDER
        </Text>
      </TouchableOpacity>
    </View>
  );
}
