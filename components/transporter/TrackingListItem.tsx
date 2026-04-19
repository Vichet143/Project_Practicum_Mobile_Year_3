import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Define the shape of the data for this component
interface TrackingListItemProps {
  delivery_id?: string;
  location: string;
  price: string;
  status: string;
  onPressView?: () => void;
}

export default function TrackingListItem({ 
  delivery_id, 
  location, 
  price, 
  status, 
  onPressView 
}: TrackingListItemProps) {

  // Create a dynamic mapping for statuses
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return { label: 'Accepted', color: 'text-blue-500' };
      case 'picked_up':
        return { label: 'Picked Up', color: 'text-purple-500' };
      case 'in_transit':
        return { label: 'In Transit', color: 'text-cyan-500' };
      case 'delivered':
      case 'completed':
        return { label: 'Completed', color: 'text-green-500' };
      case 'pending':
        return { label: 'Pending', color: 'text-orange-400' };
      default:
        return { label: status, color: 'text-gray-400' };
    }
  };
  
  const { label, color } = getStatusConfig(status);
  
  return (
    <View className="flex-row justify-between items-center bg-white p-4 rounded-xl mb-3 border border-gray-100 shadow-sm">
      <View className="flex-1">
        <Text className="text-gray-800 text-md font-semibold mb-1" numberOfLines={1}>
          {location}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-black font-bold text-md mr-3">{price}</Text>
          <Text className={`text-sm font-medium ${color}`}>{label}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={onPressView}
        activeOpacity={0.7}
        className="bg-[#FF6B52] px-6 py-2 rounded-full"
      >
        <Text className="text-white font-bold text-md">View</Text>
      </TouchableOpacity>
    </View>
  );
};