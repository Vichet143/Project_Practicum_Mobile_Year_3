import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { ChevronLeftIcon, EllipsisHorizontalIcon } from "react-native-heroicons/solid";
import TrackingListItem from "../../../../components/transporter/TrackingListItem";

// Define tab types
type TabType = 'processing' | 'completed';

interface OrderItem {
  id: string;
  location: string;
  price: string;
  status: 'pending' | 'completed';
}

export default function TrackingScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('processing');

  const processingData: OrderItem[] = [
    { id: '1', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
    { id: '2', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
    { id: '3', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
    { id: '4', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
    { id: '5', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
    { id: '6', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
    { id: '7', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
    { id: '8', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
    { id: '9', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
    { id: '10', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
    { id: '11', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
    { id: '12', location: 'Boeung Kak, Phnom Penh', price: '10$', status: 'pending' },
  ];

  const completedData: OrderItem[] = [
    { id: '5', location: 'Toul Kork, Phnom Penh', price: '15$', status: 'completed' },
  ];

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      {/* --- Header --- */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <TouchableOpacity 
          className="p-2 rounded-full border border-gray-100 bg-gray-50"
        >
          <ChevronLeftIcon size={22} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Tracking List</Text>
        <TouchableOpacity className="p-2 rounded-full border border-gray-100 bg-gray-50">
          <EllipsisHorizontalIcon size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* --- Tab Buttons --- */}
      <View className="px-6 mt-4">
        <View className="flex-row bg-white border border-[#FF6B52] rounded-xl overflow-hidden">
          {(['processing', 'completed'] as TabType[]).map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-4 items-center ${activeTab === tab ? 'bg-[#FF6B52]' : 'bg-white'}`}
            >
              <Text className={`font-bold capitalize ${activeTab === tab ? 'text-white' : 'text-gray-800'}`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* --- The List --- */}
      <View className="flex-1 px-6 mt-6">
        <FlatList<OrderItem>
          data={activeTab === 'processing' ? processingData : completedData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TrackingListItem 
              location={item.location} 
              price={item.price} 
              status={item.status}
              onPressView={() => console.log(`Viewing ${item.id}`)}
            />
          )}
        />
      </View>
    </View>
  );
};
