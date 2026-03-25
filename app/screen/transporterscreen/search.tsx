import React from "react";
import { FlatList, Text, View } from "react-native";
import JobCard from "../../../components/transporter/JobCard";

// Mock data to simulate the available delivery jobs
const mockAvailableJobs = [
  { id: "1", from: "Boeung Kak", to: "Toul Kork", weight: "5kg", price: 10 },
  { id: "2", from: "Riverside", to: "BKK1", weight: "2kg", price: 5 },
  { id: "3", from: "Sen Sok", to: "Russian Mkt", weight: "10kg", price: 15 },
  { id: "4", from: "Daun Penh", to: "Chroy Changvar", weight: "1kg", price: 3 },
  { id: "5", from: "BKK3", to: "Tuol Tompoung", weight: "8kg", price: 12 },
  { id: "6", from: "Meanchey", to: "Pochentong", weight: "20kg", price: 25 },
  { id: "7", from: "Boeung Kak", to: "Toul Kork", weight: "5kg", price: 10 },
  { id: "8", from: "Riverside", to: "BKK1", weight: "2kg", price: 5 },
  { id: "9", from: "Sen Sok", to: "Russian Mkt", weight: "10kg", price: 15 },
  { id: "10", from: "Daun Penh", to: "Chroy Changvar", weight: "1kg", price: 3 },
  { id: "11", from: "BKK3", to: "Tuol Tompoung", weight: "8kg", price: 12 },
  { id: "12", from: "Meanchey", to: "Pochentong", weight: "20kg", price: 25 },
];

export default function TransporterSearchScreen() {
  const handleAcceptOrder = (id: string) => {
    // Placeholder function for when the back-end is ready
    console.log("Accepted job:", id);
  };

  return (
    <View className="flex-1 bg-[#F5F5F5] px-2 pt-6">
      {/* Header Area */}
      <View className="px-2 mb-4">
        <Text className="text-2xl font-bold text-black mb-3">Find Job</Text>
        <View className="h-[1px] bg-gray-400 w-full" />
      </View>

      {/* 2-Column Grid of Job Cards */}
      <FlatList
        data={mockAvailableJobs}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <JobCard
            from={item.from}
            to={item.to}
            weight={item.weight}
            price={item.price}
            onAccept={() => handleAcceptOrder(item.id)}
          />
        )}
      />
    </View>
  );
}
