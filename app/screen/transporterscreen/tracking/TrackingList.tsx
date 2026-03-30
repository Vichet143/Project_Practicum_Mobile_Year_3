import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { ChevronLeftIcon, EllipsisHorizontalIcon } from "react-native-heroicons/solid";
import TrackingListItem from "../../../../components/transporter/TrackingListItem";
import { useDeliveryStore } from "../../../../store/createDelivery";
// Define tab types
type TabType = 'processing' | 'completed';

export default function TrackingScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('processing');

  const { 
    activeJobs, 
    completedJobs,  
    getTransporterActiveJobs, 
    getTransporterHistory,
    loading
  } = useDeliveryStore();

  useEffect(() => {
      refreshData();
    }, [activeTab]);

  const refreshData = () => {
    if (activeTab === 'processing') {
      getTransporterActiveJobs();
    } else {
      getTransporterHistory();
    }
  };

  const currentData = activeTab === 'processing' ? activeJobs : completedJobs;

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
        <FlatList
          data={currentData}
          keyExtractor={(item) => item.delivery_id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          refreshControl={
              <RefreshControl refreshing={loading} onRefresh={refreshData} colors={['#FF6B52']} />
            }
            // Displays a message if the list is empty
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center mt-20">
                <Text className="text-lg text-gray-400">No {activeTab} orders found</Text>
              </View>
            }
          renderItem={({ item }) => (
            <TrackingListItem 
              location={item.dropoff?.address || "No Address"}
              price={`${item.price}$`}
              status={item.status}
              onPressView={() => console.log(`Viewing ${item.delivery_id}`)}
            />
          )}
        />
      </View>
    </View>
  );
};
