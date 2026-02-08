import { Pressable, Text, View } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";

type TabBarBottomProps = {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  label: string;
  icons: Record<string, React.ComponentType<any>>;
};

export default function TabBarBottom({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  label,
  icons,
}: TabBarBottomProps) {
  const Icon = icons[routeName];
  const scale: any = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 },
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);

    const top = interpolate(scale.value, [1, 0], [0, 24]);

    return {
      transform: [{
        scale: scaleValue
      }],
      top
    }
  })

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [1, 0], [1, 0]);

    return {
      opacity,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      style={{ flex: 1 }}
    >
      <Animated.View
        className="w-full items-center pb-4"
        style={animatedIconStyle}
      >
        {Icon && (
          <Icon
            style={{
              width: 24,
              height: 24,
              tintColor: isFocused ? "#fff" : "#222",
            }}
          />
        )}
      </Animated.View>
      <Animated.Text
        style={[{ color: isFocused ? "#FF6347" : "#222", paddingBottom: 10}, animatedTextStyle]}
        className="text-center mt-1 font-bold"
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}
