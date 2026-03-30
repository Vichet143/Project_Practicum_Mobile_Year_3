import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaViewBase } from "react-native";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuthStore } from "../../../store/authStore";
import {
    convertFirestoreTimestamp,
    useChatStore,
} from "../../../store/chatStore";

interface Message {
  id: string;
  text: string;
  type: "sent" | "received";
  time: string;
  timeMs?: number;
  isPending?: boolean;
}

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const name = (params?.name as string) || "Chat";
  const user_id = params?.user_id as string;
  const transporter_id = params?.transporter_id as string;
  const isTransporter = params?.isTransporter === "true";

  const { user } = useAuthStore();
  const {
    chats,
    loading,
    error,
    createChat,
    getUserChats,
    getTransporterChats,
    currentChat,
    setCurrentChat,
  } = useChatStore();

  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  // Determine the current user's role
  const currentUserRole = user?.role === "transporter" ? "transporter" : "user";

  // Find all messages for this conversation (between user and transporter)
  const conversationMessages = chats.filter(
    (chat: any) =>
      chat.transporter_id === transporter_id && chat.user_id === user_id,
  );

  // Transform messages from the conversation
  const messages: Message[] = conversationMessages
    .map((chat: any) => {
      const dateObject = convertFirestoreTimestamp(chat.date);
      return {
        id: chat.id,
        text: chat.messages,
        type: (chat.sender_type === currentUserRole ? "sent" : "received") as
          | "sent"
          | "received",
        time: dateObject.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timeMs: dateObject.getTime(),
      };
    })
    .sort((a: Message, b: Message) => (a.timeMs ?? 0) - (b.timeMs ?? 0));

  const mergedMessages = [...messages, ...localMessages].sort(
    (a, b) => (a.timeMs ?? 0) - (b.timeMs ?? 0),
  );

  useEffect(() => {
    if (isTransporter && transporter_id && user?.id === transporter_id) {
      getTransporterChats(transporter_id);
    } else if (!isTransporter && user_id && user?.id === user_id) {
      getUserChats(user_id);
    }
  }, [
    user_id,
    transporter_id,
    isTransporter,
    user,
    getUserChats,
    getTransporterChats,
  ]);

  const sendMessage = async () => {
    const text = message.trim();
    if (!text || !user_id || !transporter_id) return;

    const pendingId = `pending-${Date.now()}`;
    const now = new Date();

    const pendingMessage: Message = {
      id: pendingId,
      text,
      type: "sent",
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeMs: now.getTime(),
      isPending: true,
    };

    setLocalMessages((prev) => [...prev, pendingMessage]);
    setMessage("");

    try {
      await createChat({
        user_id,
        transporter_id,
        messages: text,
      });

      if (isTransporter && transporter_id) {
        getTransporterChats(transporter_id);
      } else if (user_id) {
        getUserChats(user_id);
      }
    } catch (err) {
      console.error("sendMessage error", err);
    } finally {
      setLocalMessages((prev) => prev.filter((m) => m.id !== pendingId));
    }
  };

  return (
    < View className="flex-1 bg-[#F1F5F9]">
      <View className="flex-row items-center justify-between bg-white px-4 py-3 border-b border-[#E2E8F0] shadow-sm">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-1 rounded-full bg-white"
        >
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-[#E2E8F0] items-center justify-center mr-2" />
          <View>
            <Text className="text-lg font-bold text-[#0F172A]">{name}</Text>
            <Text className="text-xs text-[#94A3B8]">Online</Text>
          </View>
        </View>

        <Ionicons name="ellipsis-vertical" size={22} color="#334155" />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-[#64748B]">Loading messages...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={() => {
              if (isTransporter && transporter_id) {
                getTransporterChats(transporter_id);
              } else if (user_id) {
                getUserChats(user_id);
              }
            }}
            className="bg-[#14B8A6] px-4 py-2 rounded-lg"
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="px-4 py-2">
          {loading ? (
            <Text className="text-xs text-[#64748B]">Syncing messages...</Text>
          ) : null}
          {error ? <Text className="text-xs text-red-500">{error}</Text> : null}
        </View>
      )}

      <FlatList
        data={mergedMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View
            className={`max-w-[80%] mb-2 p-3 rounded-2xl shadow-sm ${
              item.type === "sent"
                ? "self-end bg-[#14B8A6]"
                : "self-start bg-white"
            }`}
          >
            <Text
              className={item.type === "sent" ? "text-white" : "text-[#0F172A]"}
            >
              {item.text}
            </Text>
            <Text
              className={`text-[10px] mt-1 ${
                item.type === "sent" ? "text-[#D1FAE5]" : "text-[#94A3B8]"
              }`}
            >
              {item.time}
            </Text>
          </View>
        )}
      />

      <View className="flex-row items-center px-3 py-2 bg-white border-t border-[#E2E8F0]">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          placeholderTextColor="#94A3B8"
          className="flex-1 bg-[#F1F5F9] rounded-full px-4 py-3 text-sm text-[#0F172A]"
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="ml-2 rounded-full bg-[#14B8A6] p-3"
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
