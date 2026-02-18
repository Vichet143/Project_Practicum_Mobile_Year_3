import { View, Image, LayoutChangeEvent} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import TabBarBottom from "./TabBarBottom";
import { useState } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const img: any = {
    index: (props: any) => (
      <Image source={require("../assets/images/tabbar/Home.png")} {...props} />
    ),
    history: (props: any) => (
      <Image source={require("../assets/images/tabbar/history.png")} {...props} />
    ),
    createdelivery: (props: any) => (
      <Image source={require("../assets/images/tabbar/create.png")} {...props} />
    ),
    chat: (props: any) => (
      <Image source={require("../assets/images/tabbar/chat.png")} {...props} />
    ),
    profile: (props: any) => (
      <Image source={require("../assets/images/tabbar/profile.png")} {...props} />
    ),
  };

  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayot = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width
    });
  };

  const tabPositionX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }]
    }
  })

  return (
    <SafeAreaView className="items-center flex w-full">
      <View
        onLayout={onTabbarLayot}
        className="absolute bottom-12 flex-row shadow-xl bg-white justify-between items-center py-2 w-[90%] rounded-[1rem] h-[4rem]"
      >
        <Animated.View
          style={[animatedStyle,{
            position: 'absolute',
            borderRadius: 30,
            marginHorizontal: 19,
            marginVertical: -12,
            height: dimensions.height - 5,
            width: buttonWidth - 40,
            backgroundColor: '#FF6347',
            marginBottom: 40
          }]}
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

            // <TouchableOpacity
            //   key={route.name}
            //   accessibilityRole="button"
            //   accessibilityState={isFocused ? { selected: true } : {}}
            //   accessibilityLabel={options.tabBarAccessibilityLabel}
            //   onPress={onPress}
            //   onLongPress={onLongPress}
            //   style={{ flex: 1 }}
            // >
            //   <View className="w-full items-center">
            //     {img[route.name]({
            //         style: {
            //           tintColor: isFocused ? "#673ab7" : "#222",
            //         },
            //       })}
            //   </View>
            //   <Text
            //     style={{ color: isFocused ? "#673ab7" : "#222" }}
            //     className=" text-center"
            //   >
            //     {label}
            //   </Text>
            // </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
