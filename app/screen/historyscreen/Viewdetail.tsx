import { useDeliveryStore } from "@/store/createDelivery";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const { width, height } = Dimensions.get("window");

export default function Viewdetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const deliveryId = params.id as string;
  const { getDeliveryById, cancelDelivery, loading } = useDeliveryStore();
  const [delivery, setDelivery] = useState<any>(null);

  useEffect(() => {
    loadDeliveryDetails();

    // Create a timer to fetch updates every 5 seconds while the user is on this screen
    const interval = setInterval(() => {
      // Only poll if the order isn't finished yet
      if (delivery?.status !== 'delivered' && delivery?.status !== 'completed') {
        loadDeliveryDetails();
      }
    }, 5000);

    // Clean up the timer when the user leaves the screen to save battery/data
    return () => clearInterval(interval);
  }, [deliveryId, delivery?.status]);

  const loadDeliveryDetails = async () => {
    if (deliveryId) {
      const data = await getDeliveryById(deliveryId);
      setDelivery(data);
    }
  };

  const handleCancelOrder = async () => {
    if (deliveryId) {
      const success = await cancelDelivery(deliveryId);
      if (success) {
        router.back();
      }
    }
  };

  if (!delivery) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  }

  const getStatusStep = (status: string) => {
    const statusMap: Record<string, number> = {
      pending: 0,
      accepted: 0,
      picked_up: 1,
      in_transit: 2,
      delivered: 3,
    };
    return statusMap[status.toLowerCase().replace(" ", "_")] || 0;
  };

  const currentStep = getStatusStep(delivery.status);

  return (
    <View className="flex-1 bg-white">
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

        {/* Driver Info Section */}
        {currentStep > 0 ? (
          <View className="mx-4 mt-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-200 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Image
                source={{
                  uri: "https://ui-avatars.com/api/?name=Driver&size=128",
                }}
                className="w-12 h-12 rounded-full"
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold">{delivery.transporterName}</Text>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text className="text-xs text-gray-600 ml-1">
                    4.9 (1,000+)
                  </Text>
                </View>
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
        ) : (
          <View className="mx-4 mt-4 p-4 bg-yellow-100 rounded-2xl">
            <Text className="text-center text-yellow-800 font-medium">
              Finding Driver...
            </Text>
          </View>
        )}

        {/* Progress Tracker */}
        <View className="mx-4 mt-6 mb-4">
          <View className="flex-row items-center justify-between px-2">
            {/* Step 1: Order Placed */}
            <View className="items-center">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  currentStep >= 0 ? "bg-[#FF6347]" : "bg-gray-300"
                }`}
              >
                <MaterialIcons name="shopping-cart" size={20} color="white" />
              </View>
            </View>

            <View
              className={`flex-1 h-1 mx-1 ${currentStep >= 1 ? "bg-[#FF6347]" : "bg-gray-300"}`}
            />

            {/* Step 2: Picked Up */}
            <View className="items-center">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  currentStep >= 1 ? "bg-[#FF6347]" : "bg-gray-300"
                }`}
              >
                <MaterialIcons name="local-shipping" size={20} color="white" />
              </View>
            </View>

            <View
              className={`flex-1 h-1 mx-1 ${currentStep >= 2 ? "bg-[#FF6347]" : "bg-gray-300"}`}
            />

            {/* Step 3: In Transit */}
            <View className="items-center">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  currentStep >= 2 ? "bg-[#FF6347]" : "bg-gray-300"
                }`}
              >
                <MaterialIcons name="motorcycle" size={20} color="white" />
              </View>
            </View>

            <View
              className={`flex-1 h-1 mx-1 ${currentStep >= 3 ? "bg-[#FF6347]" : "bg-gray-300"}`}
            />

            {/* Step 4: Delivered */}
            <View className="items-center">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  currentStep >= 3 ? "bg-[#FF6347]" : "bg-gray-300"
                }`}
              >
                <MaterialIcons name="check-circle" size={20} color="white" />
              </View>
            </View>
          </View>
        </View>

        {/* Estimated Delivery Time */}
        <View className="mx-4 mt-4 flex-row items-center justify-between">
          <Text className="text-base font-medium text-gray-700">
            Estimated Delivery Time
          </Text>
          <Text className="text-base font-semibold">10:25</Text>
        </View>

        {/* My Order Section */}
        <View className="mx-4 mt-4 flex-row items-center justify-between">
          <Text className="text-base font-medium text-gray-700">My Order</Text>
          <TouchableOpacity className="border border-[#FF6347] rounded-full px-4 py-1">
            <Text className="text-[#FF6347] text-sm font-medium">Details</Text>
          </TouchableOpacity>
        </View>

        {/* Order Details */}
        <View className="mx-4 mt-3 p-4 bg-gray-50 rounded-xl">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Package:</Text>
            <Text className="font-medium">{delivery.packageName}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Recipient:</Text>
            <Text className="font-medium">{delivery.recipientName}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Phone:</Text>
            <Text className="font-medium">{delivery.recipientPhone}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Total:</Text>
            <Text className="font-semibold text-[#FF6347]">
              ${delivery.price.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Cancel Order Button */}
        {currentStep < 3 && (
          <TouchableOpacity
            className="mx-4 mt-6 mb-8 bg-white rounded-lg py-3 shadow-lg border border-gray-100"
            onPress={handleCancelOrder}
            disabled={loading}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-center text-[#FF6347] text-base font-semibold">
              Cancel Order
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
