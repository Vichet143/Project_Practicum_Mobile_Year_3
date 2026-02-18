
import React, { useRef, useEffect, useState } from "react";
import { View, FlatList, Dimensions, StyleSheet, Image } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const banner1 = require("../assets/images/carouselimage/banner1.png");
const banner2 = require("../assets/images/carouselimage/banner22.png");
const banner3 = require("../assets/images/carouselimage/banner3.png");

const DATA = [
  { id: "1", image: banner1 },
  { id: "2", image: banner2 },
  { id: "3", image: banner3 }
];

export default function MakeCarousel() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % DATA.length;
      setCurrentIndex(nextIndex);

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 3000); 

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={{ marginTop: 20 }}>
      <FlatList
        ref={flatListRef}
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 30,
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
