import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SupportScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Help & Support" }} />

      <ScrollView className="p-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</Text>
        
        <FaqItem 
          q="How do I change my delivery address?" 
          a="You can easily update your delivery address before the order is marked as 'Picked Up'. Go to Tracking, view the details, and select 'Edit Address'." 
        />
        <FaqItem 
          q="When will I receive my package?" 
          a="Delivery times depend on the package weight and distance. You can track your driver live in the Tracking tab." 
        />
        <FaqItem 
          q="What forms of payment do you accept?" 
          a="We currently support direct card payments powered by Stripe, as well as select digital wallets." 
        />

        <View className="h-[1px] bg-gray-200 my-6" />

        <Text className="text-xl font-bold text-gray-800 mb-2">Still need help?</Text>
        <Text className="text-gray-500 mb-6">Send us a message and our support team will get back to you within 24 hours.</Text>

        <TextInput
          value={message}
          onChangeText={setMessage}
          className="w-full bg-gray-50 p-4 rounded-2xl text-black border border-gray-200 h-32 mb-6"
          placeholder="Type your message here..."
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity className="w-full bg-[#FF6347] p-4 rounded-xl items-center shadow-sm mb-12">
          <Text className="text-white font-bold text-lg">Send Message</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <View className="mb-3 border border-gray-100 rounded-xl overflow-hidden">
      <TouchableOpacity 
        onPress={() => setOpen(!open)} 
        className="bg-gray-50 p-4 flex-row justify-between items-center"
      >
        <Text className="font-bold text-gray-800 flex-1 pr-4">{q}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color="#FF6347" />
      </TouchableOpacity>
      {open && (
        <View className="p-4 bg-white border-t border-gray-100">
          <Text className="text-gray-600 leading-relaxed">{a}</Text>
        </View>
      )}
    </View>
  );
}
