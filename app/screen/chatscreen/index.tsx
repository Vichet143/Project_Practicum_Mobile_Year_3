import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { getuserByUid,getTransporterByid,useAuthStore } from "../../../store/authStore";
import {
    Chat,
    convertFirestoreTimestamp,
    useChatStore,
} from "../../../store/chatStore";

interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  status: string;
  unread: number;
  avatar: string;
  user_id: string;
  transporter_id: string;
}

interface ChatListProps {
  isTransporter?: boolean;
}

export default function ChatList({ isTransporter = false }: ChatListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { user } = useAuthStore();
  const { chats, loading, error, getUserChats, getTransporterChats } =
    useChatStore();

  useEffect(() => {
    if (user?.id) {
      if (isTransporter) {
        getTransporterChats(user.id);
      } else {
        getUserChats(user.id);
      }
    }
  }, [user, isTransporter, getUserChats, getTransporterChats]);

  // Group chats by conversation partner and get the latest message for each
  const chatItems: ChatItem[] = Object.values(
    chats.reduce((acc: Record<string, Chat>, chat: Chat) => {
      // For transporters, group by user_id; for users, group by transporter_id
      const conversationKey = isTransporter
        ? chat.user_id
        : chat.transporter_id;
      if (
        !acc[conversationKey] ||
        (chat.date?.toDate?.() || 0) >
          (acc[conversationKey].date?.toDate?.() || 0)
      ) {
        acc[conversationKey] = chat;
      }
      return acc;
    }, {}),
  ).map((chat: Chat) => ({
    id: chat.id,
    name: isTransporter
      ? `${chat.user?.fullname}`
      : `Transporter ${chat.transporter?.fullname}`, // TODO: Get real names from API
    lastMessage: chat.messages,
    time: chat.date
      ? convertFirestoreTimestamp(chat.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    status: "Online", // TODO: Get real status
    unread: 0, // TODO: Calculate unread messages
    avatar: isTransporter
      ? chat.user?.photoURL
      : chat.transporter?.photoURL,
    user_id: chat.user_id,
    transporter_id: chat.transporter_id,
  }));

  const filteredChats = chatItems.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({ item }: { item: ChatItem }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/screen/chatscreen/massage",
          params: {
            chatId: item.id,
            name: item.name,
            user_id: item.user_id,
            transporter_id: item.transporter_id,
            isTransporter: isTransporter ? "true" : "false",
          },
        })
      }
      className="flex-row items-center bg-white px-4 py-3 border-b border-[#EAECF0]"
    >
      <Image source={{ uri: item.avatar }} className="w-12 h-12 rounded-full" />
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-bold text-[#0F172A]">
            {item.name}
          </Text>
          <Text className="text-xs text-[#64748B]">{item.time}</Text>
        </View>
        <Text className="text-sm text-[#64748B] mt-1" numberOfLines={1}>
          {item.lastMessage}
        </Text>
        <Text className="text-[11px] text-[#94A3B8] mt-0.5">{item.status}</Text>
      </View>
      {item.unread > 0 && (
        <View className="ml-2 px-2 py-1 rounded-full bg-[#F43F5E]">
          <Text className="text-[11px] font-bold text-white">
            {item.unread}
          </Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <View className="flex-1 bg-[#F1F5F9]">
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-[#E2E8F0]">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-1 rounded-full bg-white shadow-sm"
        >
          <Ionicons name="chevron-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#0F172A]">Messages</Text>
        <Ionicons name="ellipsis-vertical" size={20} color="#334155" />
      </View>

      <View className="px-4 py-3 bg-white border-b border-[#E2E8F0]">
        <View className="flex-row items-center bg-[#F1F5F9] rounded-xl px-3 py-2 border border-[#E2E8F0]">
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            placeholderTextColor="#94A3B8"
            className="ml-2 flex-1 text-sm text-[#0F172A]"
          />
          <Ionicons name="filter" size={18} color="#94A3B8" />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-[#64748B]">Loading chats...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={() => {
              if (user?.id) {
                if (isTransporter) {
                  getTransporterChats(user.id);
                } else {
                  getUserChats(user.id);
                }
              }
            }}
            className="bg-[#14B8A6] px-4 py-2 rounded-lg"
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
