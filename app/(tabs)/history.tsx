import { Text, View, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useMemo } from 'react';

type Status = "Delivered" | "In Transit" | "Cancelled";

  interface ContentItem {
    id: string;
    title: string;
    total: number;
    status: Status;
  }

  const Mock_Data: ContentItem[] = [
    { id: "1", title: "Clothes", total: 120.50, status: "Delivered" },
    { id: "2", title: "Electronics", total: 89.99, status: "In Transit" },
    { id: "3", title: "Books", total: 45.25, status: "Cancelled" },
    { id: "4", title: "Home Decor", total: 200.00, status: "Delivered" },
    { id: "5", title: "Kitchenware", total: 67.75, status: "In Transit" },
  ]

  const STATUS_OPTIONS: (Status | "All")[] = ["All", "Delivered", "In Transit", "Cancelled"];

export default function History() {

  const [selectedStatus, setSelectedStatus] = useState<Status | "All">("All");

  // Compute the filtered list and the count
  const filteredData = useMemo(() => {
    if (selectedStatus === "All") {
      return Mock_Data;
    }
    return Mock_Data.filter(item => item.status === selectedStatus);
  }, [selectedStatus]);
  
  const availableCount = filteredData.length;



  return (
    <View className="w-full h-full px-[1rem] pt-[2rem]">

      {/* Status Filter */}
      <View className="w-full h-[3rem] flex-row gap-2 items-center justify-center">
        {STATUS_OPTIONS.map((status) => (
          <TouchableOpacity
            key={status}
            className={`flex-1 h-full items-center justify-center rounded-lg border ${
              selectedStatus === status ? "bg-[#FF6347] border-[#FF6347]" : "bg-white border-gray-300"
            }`}
            onPress={() => setSelectedStatus(status)}
          >
            <Text className={`text-lg font-medium ${
              selectedStatus === status ? "text-white" : "text-gray-800"
            }`}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-col items-center gap-6 mt-[1rem] p-[1rem]">

        {/* Order Lists */}
        <FlatList 
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View className="w-full h-[5rem] mt-[1rem] px-[1rem] flex-row justify-between items-center bg-white border border-gray-400 rounded-lg">
            <View className="flex-col">
              <Text className="text-lg font-medium">{item.title}</Text>
              <View className="flex-row items-center gap-4">
                <Text className="text-sm text-gray-500">Total: ${item.total.toFixed(2)}</Text>
                <View className={`px-2 py-1 rounded-full ${item.status === "Delivered" ? "bg-green-200" : item.status === "In Transit" ? "bg-yellow-200" : "bg-red-200"}`}>
                  <Text className={`text-xs font-medium ${
                    item.status === "Delivered" ? "text-green-800" : item.status === "In Transit" ? "text-yellow-800" : "text-red-800"
                  }`}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* View Button */}
            <TouchableOpacity className="bg-[#FF6347] px-4 py-2 rounded-md">
              <Text className="text-white font-medium">View</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      </View>
    </View>
  )
}