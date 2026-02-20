import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LocationPicker from "@/components/LocationPicker";
import { useDeliveryStore } from "../../../store/createDelivery";
import { useRouter } from "expo-router";

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

export default function Create() {
  const [pickup, setPickup] = useState<LocationData | undefined>();
  const [dropoff, setDropoff] = useState<LocationData | undefined>();
  const [packageName, setPackageName] = useState("");
  const [packageNote, setPackageNote] = useState("");
  const [packageSize, setPackageSize] = useState<"small" | "medium" | "large">(
    "small",
  );

  const { createDelivery, loading } = useDeliveryStore();
  const router = useRouter();

  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");

  const handleSubmit = async () => {
    if (!recipientName) return Alert.alert("Please enter recipient name");
    if (!recipientPhone) return Alert.alert("Please enter recipient contact");
    if (!pickup) return Alert.alert("Please select a pickup location");
    if (!dropoff) return Alert.alert("Please select a dropoff location");
    if (!packageName) return Alert.alert("Please enter package name");

    const success = await createDelivery({
      recipientName,
      recipientPhone,
      pickup,
      dropoff,
      packageName,
      packageNote,
      packageSize,
    });

    if (success) {
      Alert.alert("Success", "Delivery created!", [
        { text: "OK", onPress: () => router.push("/(tabs)/history") },
      ]);
    } else {
      Alert.alert("Error", "Failed to create delivery. Please try again.");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#f5f5f5] p-4"
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >

      <Text className="text-base font-bold text-[#333] mb-2.5 mt-1.5">
        Recipient Info
      </Text>

      <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm elevation-2">
        <Text className="text-[13px] text-[#666] mb-1.5 mt-1">Full Name</Text>
        <View className="flex-row items-center bg-[#f9f9f9] rounded-xl border border-[#eee] mb-3 px-2.5">
          <Ionicons
            name="person-outline"
            size={18}
            color="#FF6347"
            className="mr-2"
          />
          <TextInput
            className="flex-1 text-sm text-[#333] py-2.5 ml-2"
            placeholder="e.g. John Doe"
            placeholderTextColor="#bbb"
            value={recipientName}
            onChangeText={setRecipientName}
          />
        </View>

        <Text className="text-[13px] text-[#666] mb-1.5 mt-1">
          Phone Number
        </Text>
        <View className="flex-row items-center bg-[#f9f9f9] rounded-xl border border-[#eee] mb-3 px-2.5">
          <Ionicons
            name="call-outline"
            size={18}
            color="#FF6347"
            className="mr-2"
          />
          <TextInput
            className="flex-1 text-sm text-[#333] py-2.5 ml-2"
            placeholder="e.g. +855 12 345 678"
            placeholderTextColor="#bbb"
            value={recipientPhone}
            onChangeText={setRecipientPhone}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <Text className="text-base font-bold text-[#333] mb-2.5 mt-1.5">
        Locations
      </Text>

      <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm elevation-2">
        <View className="flex-row items-start gap-2.5">
          <View className="w-3 h-3 rounded-full bg-[#4CAF50] mt-1.5" />
          <View className="flex-1">
            <Text className="text-xs text-[#999] mb-1 ml-1">Pickup</Text>
            <LocationPicker
              label="Pickup Location"
              value={pickup}
              onChange={setPickup}
            />
          </View>
        </View>

        <View className="w-0.5 h-5 border border-dashed border-[#ddd] ml-[5px] my-1" />

        <View className="flex-row items-start gap-2.5">
          <View className="w-3 h-3 rounded-full bg-[#FF6347] mt-1.5" />
          <View className="flex-1">
            <Text className="text-xs text-[#999] mb-1 ml-1">Dropoff</Text>
            <LocationPicker
              label="Dropoff Location"
              value={dropoff}
              onChange={setDropoff}
            />
          </View>
        </View>
      </View>

      <Text className="text-base font-bold text-[#333] mb-2.5 mt-1.5">
        Package Details
      </Text>

      <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm elevation-2">
        <Text className="text-[13px] text-[#666] mb-1.5 mt-1">
          Package Name
        </Text>
        <TextInput
          className="bg-[#f9f9f9] rounded-xl border border-[#eee] px-3.5 py-2.5 text-sm text-[#333] mb-3"
          placeholder="e.g. Clothes, Electronics"
          placeholderTextColor="#bbb"
          value={packageName}
          onChangeText={setPackageName}
        />

        <Text className="text-[13px] text-[#666] mb-1.5 mt-1">
          Note (optional)
        </Text>
        <TextInput
          className="bg-[#f9f9f9] rounded-xl border border-[#eee] px-3.5 py-2.5 text-sm text-[#333] mb-3 h-20"
          style={{ textAlignVertical: "top" }}
          placeholder="Special instructions for the driver..."
          placeholderTextColor="#bbb"
          value={packageNote}
          onChangeText={setPackageNote}
          multiline
          numberOfLines={3}
        />

        <Text className="text-[13px] text-[#666] mb-1.5 mt-1">
          Package Size
        </Text>
        <View className="flex-row gap-2.5 mt-1">
          {(["small", "medium", "large"] as const).map((size) => (
            <TouchableOpacity
              key={size}
              className={`flex-1 flex-row items-center justify-center gap-1.5 border-[1.5px] border-[#FF6347] rounded-xl py-2.5 ${
                packageSize === size ? "bg-[#FF6347]" : ""
              }`}
              onPress={() => setPackageSize(size)}
            >
              <Ionicons
                name={
                  size === "small"
                    ? "cube-outline"
                    : size === "medium"
                      ? "cube"
                      : "albums-outline"
                }
                size={20}
                color={packageSize === size ? "#fff" : "#FF6347"}
              />
              <Text
                className={`font-semibold text-[13px] ${
                  packageSize === size ? "text-white" : "text-[#FF6347]"
                }`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Summary ── */}
      {pickup && dropoff && (
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm elevation-2">
          <Text className="text-base font-bold text-[#333] mb-2.5 mt-1.5">
            Summary
          </Text>

          {recipientName !== "" && (
            <View className="flex-row items-center gap-2 mb-1.5">
              <Ionicons name="person" size={16} color="#FF6347" />
              <Text className="flex-1 text-[13px] text-[#555]">
                {recipientName}
                {recipientPhone ? `  •  ${recipientPhone}` : ""}
              </Text>
            </View>
          )}

          <View className="flex-row items-center gap-2 mb-1.5">
            <Ionicons name="location" size={16} color="#4CAF50" />
            <Text className="flex-1 text-[13px] text-[#555]" numberOfLines={1}>
              {pickup.address}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 mb-1.5">
            <Ionicons name="location" size={16} color="#FF6347" />
            <Text className="flex-1 text-[13px] text-[#555]" numberOfLines={1}>
              {dropoff.address}
            </Text>
          </View>
        </View>
      )}

      {/* ── Submit ── */}
      <TouchableOpacity
        className={`bg-[#FF6347] rounded-2xl py-4 flex-row items-center justify-center gap-2 elevation-3 ${
          loading ? "opacity-60" : ""
        }`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Ionicons name="bicycle-outline" size={20} color="#fff" />
        <Text className="text-white text-base font-bold">
          {loading ? "Creating..." : "Create Delivery"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
