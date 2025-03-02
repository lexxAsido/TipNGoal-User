import React, { useEffect, useState, useContext } from 'react';
import { ImageBackground,ScrollView, Text, View,StyleSheet,Dimensions,TouchableOpacity,Image,RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../Components/Theme';
import * as Animatable from 'react-native-animatable';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import Profile from './Profile';
import { AppContext } from '../Components/globalVariables';
import Football from './Football';
import { getLiveScores, getUpcomingFixtures } from './apiConfig';
import Carousel from 'react-native-reanimated-carousel';
import { Tipngoal } from './TipNGoal';
import Feeds from './Feeds';


function Home() {
  const { width, height } = Dimensions.get("screen");
  const [liveScores, setLiveScores] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [error, setError] = useState(null);
  const { preloader, setPreloader } = useContext(AppContext);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setPreloader(true);
        const liveScoresData = await getLiveScores();
        const fixturesData = await getUpcomingFixtures();
        setLiveScores(liveScoresData);
        setFixtures(fixturesData);
      } catch (error) {
        setError("Could not fetch data. Please try again later.");
      } finally {
        setPreloader(false);
      }
    };
    fetchData();
  }, []);

  
  const carouselLinks = [
    'https://static0.givemesportimages.com/wordpress/wp-content/uploads/2024/01/the-30-best-football-teams-in-the-world-ranked-image.jpeg',
    'https://gku.swr.mybluehost.me/website_d4eaa78c/wp-content/uploads/2019/08/Screen-Shot-2019-08-15-at-15.26.39-1.png',
    'https://a1.espncdn.com/combiner/i?img=%2Fphoto%2F2024%2F1203%2Fr1423057_1296x729_16%2D9.jpg',
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.lightGreen }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground source={require("../../assets/home.jpg")} style={{ height: height / 2, width: "100%" }}>
       
          <LinearGradient
            start={{ x: 0, y: 1.5 }} 
            end={{ x: 1.5, y: 0 }}
            colors={["#11111069", "#a4e21310"]}
            style={{
              flex: 1,
              justifyContent: "space-between",
            }}
          > 
            <View style={{ width: "100%" }}>
              <Carousel
                loop
                width={width}
                height={450}
                autoPlay={true}
                data={carouselLinks}
                renderItem={({ index }) => (
                  <Image
                    style={{ width: '100%', height: height / 2, borderRadius: 10, resizeMode: "contain" }}
                    source={{ uri: carouselLinks[index] }}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Animatable.View animation="bounceIn" iterationCount="infinite" style={{ flexDirection: 'column', alignItems: "center" }}>
                <LinearGradient
                  colors={[Theme.colors.black, Theme.colors.green]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 10, alignItems: 'center', borderRadius: 20 }}
                >
                  <TouchableOpacity>
                    <Text style={[styles.header]}>TipNGoal Predictions</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Animatable.View>
            </View>
          </LinearGradient>
        </ImageBackground>
        <Football />
      </ScrollView>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let size = focused ? 28 : 23;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          }  
          
          if (route.name === 'TipNGoal') {
            iconName = focused ? 'football' : 'football-outline';
          } 
          if (route.name === 'Feeds') {
            iconName = focused ? 'bonfire' : 'bonfire';
          } 
          else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Theme.colors.green,
        tabBarInactiveTintColor: Theme.colors.black,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Feeds" component={Feeds} options={{ title: "News & Hot" }} />
      <Tab.Screen name="TipNGoal" component={Tipngoal} options={{ title: "Sure Odds" }} />
      
      <Tab.Screen name="Profile" component={Profile} options={{ title: "Account" }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    fontFamily: Theme.fonts.text900,
    color: Theme.colors.light.bg2,
  },
});
