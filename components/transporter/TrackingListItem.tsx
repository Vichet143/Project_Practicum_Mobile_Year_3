import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Define the shape of the data for this component
interface TrackingListItemProps {
  location: string;
  price: string;
  status: 'pending' | 'completed';
  onPressView?: () => void;
}

export default function TrackingListItem({ location, price, status, onPressView }: TrackingListItemProps) {
  const statusColor = status === 'completed' ? 'text-green-500' : 'text-orange-400';
  const statusLabel = status === 'completed' ? 'Completed' : 'Pending';
  return (
    <View className="flex-row justify-between items-center bg-white p-4 rounded-xl mb-3 border border-gray-100 shadow-sm">
      <View className="flex-1">
        <Text className="text-gray-800 text-sm font-semibold mb-1" numberOfLines={1}>
          {location}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-black font-bold text-sm mr-2">{price}</Text>
          <Text className={`text-xs font-medium ${statusColor}`}>{statusLabel}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={onPressView}
        activeOpacity={0.7}
        className="bg-[#FF6B52] px-6 py-2 rounded-full"
      >
        <Text className="text-white font-bold text-xs">View</Text>
      </TouchableOpacity>
    </View>
  );
};