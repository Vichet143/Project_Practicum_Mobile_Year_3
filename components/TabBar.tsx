import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { Image, LayoutChangeEvent, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import TabBarBottom from "./TabBarBottom";

type TabBarProps = BottomTabBarProps & {
  accentColor?: string;
  role?: "user" | "transporter";
};

export function TabBar({
  state,
  descriptors,
  navigation,
  accentColor = "#FF6347",
  role = "user",
}: TabBarProps) {
  const img: any = {
    index: (props: any) => (
      <Image source={require("../assets/images/tabbar/Home.png")} {...props} />
    ),
    history: (props: any) => (
      <Image
        source={require("../assets/images/tabbar/history.png")}
        {...props}
      />
    ),
    createdelivery: (props: any) => (
      <Image
        source={require("../assets/images/tabbar/create.png")}
        {...props}
      />
    ),
    chat: (props: any) => (
      <Image source={require("../assets/images/tabbar/chat.png")} {...props} />
    ),
    profile: (props: any) => (
      <Image
        source={require("../assets/images/tabbar/profile.png")}
        {...props}
      />
    ),
    tracking: (props: any) => (
      <Image source={require("../assets/images/tabbar/map.png")} {...props} />
    ),
    search: (props: any) => (
      <Image
        source={require("../assets/images/tabbar/search.png")}
        {...props}
      />
    ),
  };

  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayot = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);
  useEffect(() => {
    tabPositionX.value = buttonWidth * state.index;
  }, [buttonWidth, state.index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <SafeAreaView style={{ alignItems: "center", width: "100%" }}>
      <View
        onLayout={onTabbarLayot}
        style={{
          position: "absolute",
          bottom: 48,
          flexDirection: "row",
          backgroundColor: role === "transporter" ? "#FFFFFF" : "#FFFFFF",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: role === "transporter" ? 8 : 8,
          width: "90%",
          borderRadius: role === "transporter" ? 20 : 24,
          height: role === "transporter" ? 70 : 70,
          shadowOpacity: role === "transporter" ? 0.4 : 0.3,
          shadowRadius: 20,
          elevation: 15,
          borderWidth: 1,
          borderColor:
            role === "transporter"
              ? "rgba(255, 107, 55, 0.1)"
              : "rgba(0, 0, 0, 0.05)",
        }}
      >
        <Animated.View
          style={[
            animatedStyle,
            {
              position: "absolute",
              borderRadius: role === "transporter" ? 30 : 30,
              marginHorizontal: role === "transporter" ? 9.7 : 18.6,
              marginVertical: role === "transporter" ? -10 : -9,
              height: dimensions.height - (role === "transporter" ? 15 : 17),
              width: buttonWidth - (role === "transporter" ? 22 : 40),
              backgroundColor: accentColor,
              marginBottom: role === "transporter" ? 40 : 40,
              shadowColor: accentColor,
              shadowOffset: {
                width: 0,
                height: role === "transporter" ? 8 : 6,
              },
              shadowOpacity: role === "transporter" ? 0.6 : 0.5,
              shadowRadius: role === "transporter" ? 15 : 12,
              elevation: role === "transporter" ? 12 : 10,
            },
          ]}
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label: any =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            tabPositionX.value = withSpring(buttonWidth * index, {
              duration: 1500,
            });
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarBottom
              key={route.name}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name}
              label={label}
              icons={img}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
}
