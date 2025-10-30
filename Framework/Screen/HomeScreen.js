import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
  memo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  RefreshControl,
  FlatList,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "../Components/Theme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Profile from "./Profile";
import { AppContext } from "../Components/globalVariables";
import Football from "../Components/Football";
import { Tipngoal } from "./TipNGoal";
import Feeds from "./Feeds";
import Punters from "./Punters";
import PostGames from "./PostGames";
import Gossip from "./Gossips";
import { ThemeContext } from "../Context/ThemeContext";
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import Livescore from "../Components/Livescore";

const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"; // <- replace with your real banner id
const INTERSTITIAL_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz"; // <- replace with your real interstitial id

// ✅ Interstitial Ad
const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
  requestNonPersonalizedAdsOnly: true,
});
// ✅ Memoized Image Item
const CarouselItem = memo(({ image, width,height }) => (
  <View style={{ width, alignItems: "center" }}>
    <Image
      source={image}
      style={{
        width: width * 0.9,
        height,
        borderRadius: 15,
        resizeMode: "contain",
      }}
    />
  </View>
));

// ✅ Memoized Pagination Dots
const PaginationDots = memo(({ length, currentIndex }) => (
  <View style={styles.paginationContainer}>
    {Array.from({ length }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          {
            backgroundColor:
              i === currentIndex ? Theme.colors.green : "#999",
          },
        ]}
      />
    ))}
  </View>
));

function Home() {
  const { width } = Dimensions.get("window");
  const height = width * 0.55;
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useContext(ThemeContext);
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();

  const carouselLinks = [
    require("../../assets/image1.png"),
    require("../../assets/image2.png"),
    require("../../assets/image4.png"),
    require("../../assets/image3.png"),
  ];

  // ✅ Prefetch images
  useEffect(() => {
    carouselLinks.forEach((img) => {
      const uri = Image.resolveAssetSource(img).uri;
      Image.prefetch(uri);
    });
  }, []);

  // ✅ Auto-scroll carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselLinks.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselLinks.length]);

  // ✅ Load & show interstitial ad after 5 minutes
useEffect(() => {
  // 🕐 Wait 5 minutes before first ad
  const timer = setTimeout(() => {
    interstitial.load();
  }, 4 * 60 * 1000); // 4 minutes in milliseconds

  // 🎯 Show ad once it’s loaded
  const unsubscribe = interstitial.addAdEventListener(
    AdEventType.LOADED,
    () => interstitial.show()
  );

  // 🧹 Cleanup on unmount
  return () => {
    clearTimeout(timer);
    unsubscribe();
  };
}, []);


  // ✅ Combine all sections into one list
  const sections = [
    { type: "carousel" },
    { type: "pagination" },
    { type: "ad" },
    { type: "football" },
  ];

  const renderSection = ({ item }) => {
    switch (item.type) {
      // case "carousel":
      //   return (
      //     <FlatList
      //       data={carouselLinks}
      //       ref={flatListRef}
      //       keyExtractor={(_, i) => i.toString()}
      //       renderItem={({ item }) => (
      //         <CarouselItem image={item} width={width} height={height} />
      //       )}
      //       horizontal
      //       pagingEnabled
      //       showsHorizontalScrollIndicator={false}
      //       onScroll={(e) => {
      //         const index = Math.round(
      //           e.nativeEvent.contentOffset.x / width
      //         );
      //         setCurrentIndex(index);
      //       }}
      //       scrollEventThrottle={16}
      //       style={{ marginTop: 40 }}
      //     />
      //   );

      // case "pagination":
      //   return (
      //     <PaginationDots
      //       length={carouselLinks.length}
      //       currentIndex={currentIndex}
      //     />
      //   );

      case "ad":
        return (
          <View
            style={{
              width: "100%",
              alignSelf: "center",
              backgroundColor: "transparent",
              marginTop: 48,
            }}
          >
            <Text style={{fontFamily: Theme.fonts.text600,
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 24,
    color:theme === "dark" ? "#ffffff" : "#1E1E1E"
    }}>
              Livescores
              </Text>
            <BannerAd
              unitId={BANNER_ID}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              onAdFailedToLoad={(error) =>
                console.log("Ad failed to load:", error)
              }
            />
          </View>
        );

      case "football":
        return <Livescore />;

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme === "dark" ? "#1E1E1E" : "#ffffff" }}>
  <FlatList
    data={sections}
    keyExtractor={(item) => item.type}
    renderItem={renderSection}
    refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom: 40, // moderate padding only
    }}
  />
</View>

  );
}


// ✅ Memoize Home
const MemoizedHome = memo(Home);

// ✅ Bottom Tabs
const Tab = createBottomTabNavigator();

export function HomeScreen() {
  const { userInfo } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      lazy={true}
      detachInactiveScreens={false}
      screenOptions={({ route }) => ({
        unmountOnBlur: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let size = focused ? 28 : 23;
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "TipNGoal":
              iconName = focused ? "football" : "football-outline";
              break;
            case "Punters":
              iconName = "bar-chart";
              break;
            case "Feeds":
              iconName = "newspaper-outline";
              break;
            case "Gossip":
              iconName = "bonfire";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
            case "PostGames":
              iconName = "accessibility";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // ✅ Fix #1: Proper height + readable labels
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
          borderTopColor: theme === 'dark' ? '#222' : '#ddd',
          elevation: 10,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom - 2 : 8,
          paddingTop: 6,
          // marginHorizontal:6,
          // borderRadius:28
        },
        
        tabBarLabelStyle: {
          fontFamily: Theme.fonts.text600,
          fontSize: 11,
          marginBottom: 3,
        },

        tabBarActiveTintColor: Theme.colors.green,
        tabBarInactiveTintColor: theme === 'dark' ? '#fff' : '#333',
        // tabBarActiveTintColor: Theme.colors.green,
        // tabBarInactiveTintColor: theme === 'dark' ? '#fff' : '#333',
        headerShown: false,
      })}
      sceneContainerStyle={{
        flex: 1,
        backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff',
      }}
    >
      <Tab.Screen name="Home" component={MemoizedHome} />
      <Tab.Screen name="Feeds" component={Feeds} options={{ title: "News" }} />
      <Tab.Screen name="Gossip" component={Gossip} options={{ title: "Gossips" }} />
      <Tab.Screen name="TipNGoal" component={Tipngoal} options={{ title: "TipNGoal" }} />
      <Tab.Screen name="Punters" component={Punters} options={{ title: "Punters" }} />
      {userInfo?.role === "admin" && (
        <Tab.Screen
          name="PostGames"
          component={PostGames}
          options={{ title: "Let's Play" }}
        />
      )}
      <Tab.Screen name="Profile" component={Profile} options={{ title: "Account" }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
