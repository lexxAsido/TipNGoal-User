import React, { useRef, useState,useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeContext } from "../../Context/ThemeContext";
import { Theme } from "../../Components/Theme";




const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Fast Livescore Updates",
    image: require("../../../assets/image8.png"),
    note: "Get real time livescore update across all leagues",
  },
  {
    id: "2",
    title: "Hottest Sports News",
    image: require("../../../assets/image7.png"),
    note: "Explore and stay updated with all the trending sports news",
  },
  {
    id: "3",
    title: "TipNGoal Predictions",
    image: require("../../../assets/image6.png"),
    note: "Get accurate betting predictions, straight from the best",
  },
];

const Onboarding = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate or close onboarding
      navigation?.replace("SignIn");
    }
  };

  const skipToEnd = () => {
    slidesRef.current.scrollToIndex({ index: slides.length - 1 });
  };

 const renderItem = ({ item }) => (
  <View style={[styles.slide, { width }]}>
    {/* Image + Fade */}
    <View style={styles.imageContainer}>
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
  colors={
    theme === 'dark'
      ? ['transparent', 'rgba(30,30,30,0.9)', '#1E1E1E'] 
      : ['transparent', 'rgba(255,255,255,0.9)', '#FFFFFF'] 
  }
  style={styles.gradientOverlay}
/>

    </View>

    


    {/* White text area */}
    <View style={{
      position: "absolute",
      bottom: 0,
      backgroundColor: theme === 'dark' ? '#1E1E1E' : '#ffffff',
      paddingVertical: 25,
      paddingHorizontal: 25,
      width: "100%",
      alignSelf: "center",
      alignItems: "center",
      zIndex:50
    }}>
        {/* Dots ABOVE the white text box */}
<View style={styles.paginationWrapper}>
  <View style={styles.dotsContainer}>
    {slides.map((_, i) => {
      const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

      const dotWidth = scrollX.interpolate({
        inputRange,
        outputRange: [8, 20, 8],
        extrapolate: "clamp",
      });

      const backgroundColor = scrollX.interpolate({
        inputRange,
        outputRange: ["#ccc", "#00C853", "#ccc"], // gray → green → gray
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          key={i.toString()}
          style={[
            styles.dot,
            {
              width: dotWidth,
              backgroundColor, // animated color
            },
          ]}
        />
      );
    })}
  </View>
</View>
      <Text style={{
        fontSize: 22,
    // fontWeight: "700",
    color: theme === 'dark' ? '#fff' : '#1E1E1E',
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Theme.fonts.text500
      }}>{item.title}</Text>
      <Text style={{
        fontSize: 15,
    color: theme === 'dark' ? '#fff' : '#1E1E1E',
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "600",
    fontFamily: Theme.fonts.text600
      }}>
        {item.note}</Text>
    </View>
  </View>
);



  return (
    <SafeAreaView style={{flex: 1,backgroundColor: theme === 'dark' ? '#1E1E1E' : '#ffffff'}}>
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        ref={slidesRef}
      />

      

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={skipToEnd}>
          <Text style={{
            color: theme === 'dark' ? '#fff' : '#000',
          fontSize: 16,
          fontFamily: Theme.fonts.text500
          }}
          >Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={scrollToNext}>
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  imageContainer: {
  flex: 0.8,
  width: "130%",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
//   overflow: "hidden",
  marginRight:70
},

image: {
  width: "150%",
  height: "150%",
  alignSelf: "center",
},

gradientOverlay: {
  position: "absolute",
  bottom: 0,
  height: 150,
  width: "100%",
},

paginationWrapper: {
  position: "absolute",
  bottom: 100, // 👈 adjust this to place dots higher/lower
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
},

dotsContainer: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
},

dot: {
  height: 8,
  borderRadius: 4,
  backgroundColor: "#00C853",
},

textBox: {
  position: "absolute",
  bottom: 10,
  backgroundColor: "rgba(255,255,255,0.95)",
  paddingVertical: 25,
  paddingHorizontal: 25,
  width: "100%",
  alignSelf: "center",
  alignItems: "center",
  zIndex:50
},
  title: {
    fontSize: 22,
    fontWeight: "700",
    
    textAlign: "center",
    marginBottom: 8,
    
  },
  note: {
    fontSize: 15,
    // color: "#00",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00C853",
    marginHorizontal: 4,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  skipText: {
    color: "#555",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#00C853",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
