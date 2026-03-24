import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatsCardProps {
  value: string;
  label: string;
  trend: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
}

export default function StatsCard({
  value,
  label,
  trend,
  iconName,
  iconColor,
  iconBgColor,
}: StatsCardProps) {
  return (
    <View className="flex-1 bg-white p-4 rounded-3xl min-h-[6rem] justify-center shadow-sm border border-gray-100 mx-1">
      <View className="flex-row items-center">
        <View
          className={`w-12 h-12 rounded-full justify-center items-center ${iconBgColor} mr-3`}
        >
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <View>
          <Text className="text-3xl font-bold text-gray-800">{value}</Text>
          <Text className="text-xs text-gray-500 mt-1">{label}</Text>
          <Text className="text-[10px] text-[#22C55E] mt-1 font-semibold">
            ↑ {trend}
          </Text>
        </View>
      </View>
    </View>
  );
}
