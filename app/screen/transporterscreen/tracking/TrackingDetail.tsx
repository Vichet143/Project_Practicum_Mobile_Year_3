import { useDeliveryStore } from "@/store/createDelivery";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const { width, height } = Dimensions.get("window");

export default function TrackingDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const deliveryId = params.id as string;
  const { getDeliveryById, updateTransporterStatus, loading } = useDeliveryStore();
  const [delivery, setDelivery] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadDeliveryDetails();
  }, [deliveryId]);

  const loadDeliveryDetails = async () => {
    if (deliveryId) {
      const data = await getDeliveryById(deliveryId);
      setDelivery(data);
    }
  };

  // --- NEW: Dynamic Status Handler ---
  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const success = await updateTransporterStatus(deliveryId, newStatus);
      if (success) {
        // Reload details to update UI and Map progress
        await loadDeliveryDetails();
        
        if (newStatus === "delivered") {
          Alert.alert("Success", "Delivery completed successfully!", [
            { text: "OK", onPress: () => router.back() }
          ]);
        }
      } else {
        Alert.alert("Error", "Failed to update status. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (!delivery) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  }

  // Map backend statuses to step numbers
  const getStatusStep = (status: string) => {
    const statusMap: Record<string, number> = {
      accepted: 0,
      picked_up: 1,
      in_transit: 2,
      delivered: 3,
    };
    return statusMap[status.toLowerCase()] || 0;
  };

  const currentStep = getStatusStep(delivery.status);

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <Stack.Screen options={{ title: "Tracking Detail" }} />
      <ScrollView className="flex-1">
        {/* Map View */}
        <View className="w-full h-[300px] bg-gray-200">
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ width: "100%", height: "100%" }}
            initialRegion={{
              latitude:
                (delivery.pickup.latitude + delivery.dropoff.latitude) / 2,
              longitude:
                (delivery.pickup.longitude + delivery.dropoff.longitude) / 2,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {/* Pickup Marker */}
            <Marker
              coordinate={{
                latitude: delivery.pickup.latitude,
                longitude: delivery.pickup.longitude,
              }}
              title="Pickup Location"
            >
              <View className="bg-orange-500 rounded-full p-2">
                <MaterialIcons name="location-on" size={24} color="white" />
              </View>
            </Marker>

            {/* Dropoff Marker */}
            <Marker
              coordinate={{
                latitude: delivery.dropoff.latitude,
                longitude: delivery.dropoff.longitude,
              }}
              title="Dropoff Location"
            >
              <View className="bg-yellow-500 rounded-full p-2">
                <MaterialIcons name="location-on" size={24} color="white" />
              </View>
            </Marker>

            {/* Route Line */}
            <Polyline
              coordinates={[
                {
                  latitude: delivery.pickup.latitude,
                  longitude: delivery.pickup.longitude,
                },
                {
                  latitude: delivery.dropoff.latitude,
                  longitude: delivery.dropoff.longitude,
                },
              ]}
              strokeColor={currentStep >= 2 ? "#FF6347" : "#CCCCCC"}
              strokeWidth={4}
            />
          </MapView>

          {/* Compass Button */}
          <TouchableOpacity className="absolute top-4 right-4 bg-white rounded-full p-2 shadow">
            <MaterialIcons name="my-location" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Driver Info Card */}
        <View className="mx-4 mt-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-200 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Image
              source={{
                uri: "https://ui-avatars.com/api/?name=Driver&size=128",
              }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold">{delivery.recipientName}</Text>
              <Text className="text-sm text-gray-500">Your Customer</Text>
            </View>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="bg-gray-100 rounded-full p-2">
              <Ionicons name="chatbubble-outline" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-full p-2">
              <Ionicons name="call-outline" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Tracker */}
        <View className="mx-4 mt-6 p-4 bg-white rounded-2xl shadow-sm">
          <Text className="text-base font-bold text-gray-800 mb-4">Delivery Progress</Text>
          <View className="flex-row items-center justify-between px-2">
            {[
              { icon: "assignment-turned-in", label: "Accepted" },
              { icon: "inventory", label: "Picked Up" },
              { icon: "motorcycle", label: "In Transit" },
              { icon: "check-circle", label: "Delivered" }
            ].map((step, index) => (
              <React.Fragment key={index}>
                <View className="items-center">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      currentStep >= index ? "bg-[#FF6347]" : "bg-gray-200"
                    }`}
                  >
                    <MaterialIcons name={step.icon as any} size={20} color={currentStep >= index ? "white" : "gray"} />
                  </View>
                </View>
                {index < 3 && (
                  <View className={`flex-1 h-1 mx-1 ${currentStep >= index + 1 ? "bg-[#FF6347]" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Order Details Card */}
        <View className="mx-4 mt-4 p-5 bg-white rounded-2xl shadow-sm mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Task Details</Text>
          
          <View className="flex-row justify-between mb-3 border-b border-gray-100 pb-3">
            <Text className="text-gray-500">Package Details</Text>
            <View className="items-end">
              <Text className="font-bold text-gray-800">{delivery.packageName}</Text>
              <Text className="text-xs text-gray-500">Size: {delivery.packageSize}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-3 border-b border-gray-100 pb-3">
            <Text className="text-gray-500">Recipient</Text>
            <View className="items-end">
              <Text className="font-bold text-gray-800">{delivery.recipientName}</Text>
              <Text className="text-sm text-blue-500">{delivery.recipientPhone}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-3 border-b border-gray-100 pb-3">
            <Text className="text-gray-500">Dropoff Address</Text>
            <Text className="font-medium text-gray-800 w-1/2 text-right">
              {delivery.dropoff.address}
            </Text>
          </View>

          {delivery.packageNote && (
            <View className="mt-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <Text className="text-xs text-yellow-800 font-bold mb-1">Note from sender:</Text>
              <Text className="text-sm text-yellow-900">{delivery.packageNote}</Text>
            </View>
          )}

          <View className="flex-row justify-between mt-4 pt-2">
            <Text className="text-gray-800 font-bold text-lg">Your Earnings</Text>
            <Text className="font-bold text-xl text-[#10B981]">
              ${delivery.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Dynamic Action Bottom Bar */}
      {currentStep < 3 && (
        <View className="p-4 bg-white border-t border-gray-200">
          {currentStep === 0 && (
            <TouchableOpacity
              onPress={() => handleUpdateStatus("picked_up")}
              disabled={updating}
              className={`py-4 rounded-xl items-center flex-row justify-center ${updating ? 'bg-orange-300' : 'bg-orange-500'}`}
            >
              {updating ? <ActivityIndicator color="white" className="mr-2" /> : <MaterialIcons name="inventory" size={20} color="white" className="mr-2" />}
              <Text className="text-white font-bold text-lg">Confirm Pickup</Text>
            </TouchableOpacity>
          )}

          {currentStep === 1 && (
            <TouchableOpacity
              onPress={() => handleUpdateStatus("in_transit")}
              disabled={updating}
              className={`py-4 rounded-xl items-center flex-row justify-center ${updating ? 'bg-blue-300' : 'bg-blue-500'}`}
            >
              {updating ? <ActivityIndicator color="white" className="mr-2" /> : <MaterialIcons name="motorcycle" size={20} color="white" className="mr-2" />}
              <Text className="text-white font-bold text-lg">Start Transit</Text>
            </TouchableOpacity>
          )}

          {currentStep === 2 && (
            <TouchableOpacity
              onPress={() => handleUpdateStatus("delivered")}
              disabled={updating}
              className={`py-4 rounded-xl items-center flex-row justify-center ${updating ? 'bg-green-300' : 'bg-[#10B981]'}`}
            >
               {updating ? <ActivityIndicator color="white" className="mr-2" /> : <MaterialIcons name="check-circle" size={20} color="white" className="mr-2" />}
              <Text className="text-white font-bold text-lg">Mark as Delivered</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}