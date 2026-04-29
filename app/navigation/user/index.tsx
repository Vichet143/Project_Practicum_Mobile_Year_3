import MakeCarousel from "@/components/Carousel";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";

export default function Index() {
  const { user } = useAuthStore();
  const displayName =
    user?.fullname || "No name";
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;

  const animateIn = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = (scale: Animated.Value) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1 }}>
      <View className="px-[1rem] pt-[2rem] flex-row">
        <View>
          <View className="">
            <Image
              source={{ uri: user?.photoURL }}
              className="w-[4.5rem] h-[4.5rem] rounded-full border-[#FF6347] border-2"
              resizeMode="cover"
            />
          </View>
        </View>
        <View className=" h-[4.5rem] justify-center ps-[1rem]">
          <Text className="text-lg font-bold">Hello, {displayName}</Text>
          <Pressable>
            <Text className="text-sm text-gray-400 capitalize">
              View Account
            </Text>
          </Pressable>
        </View>
      </View>
      <View className="px-[1rem] mt-[3rem]">
        <MakeCarousel />
      </View>
      <View className="items-center">
        <View className="px-[1rem] mt-[5rem] flex-row justify-between w-[95%]">
          <Pressable
            onPressIn={() => animateIn(scale1)}
            onPressOut={() => {
              animateOut(scale1);
              setTimeout(() => {
                router.push("/screen/createdelivery");
              }, 120);
            }}
          >
            <Animated.View
              style={{ transform: [{ scale: scale1 }] }}
              className="bg-[#EDE9E9] rounded-[1rem] py-[1rem] px-[1rem] w-[12rem] h-[9rem]"
            >
              <Text className="text-center font-bold">Delivery Now</Text>

              <View className="flex-1" />

              <View className="flex-row justify-between items-end">
                <Image
                  source={require("../../../assets/images/carouselimage/fast_forward.png")}
                />

                <Image
                  source={require("../../../assets/images/carouselimage/createdelivery 1.png")}
                  className="w-[3rem] h-[3rem]"
                  resizeMode="contain"
                />
              </View>
            </Animated.View>
          </Pressable>
          <Pressable
            onPressIn={() => animateIn(scale2)}
            onPressOut={() => {
              animateOut(scale2);
              setTimeout(() => {
                router.push("/screen/tracking");
              }, 120);
            }}
          >
            <Animated.View
              style={{ transform: [{ scale: scale2 }] }}
              className="bg-[#EDE9E9] rounded-[1rem] py-[1rem] px-[1rem] w-[12rem] h-[9rem]"
            >
              <Text className="text-center font-bold">Tracking Delivery</Text>
              <View className="flex-1"></View>
              <View className="flex-row justify-between items-end">
                <View>
                  <Image
                    source={require("../../../assets/images/carouselimage/fast_forward.png")}
                  />
                </View>

                <Image
                  source={require("../../../assets/images/carouselimage/onboardingphoto 2.png")}
                  className="w-[3rem] h-[3rem]"
                  resizeMode="contain"
                />
              </View>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
