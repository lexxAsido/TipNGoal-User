import { StatusBar } from 'expo-status-bar';
import { ImageBackground, LogBox, StyleSheet, Text, View } from 'react-native';
import Intro from './Framework/Screen/Intro';
import { Theme } from './Framework/Components/Theme';
import { useCallback, useEffect, useState } from 'react';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { 
  Montserrat_100Thin, Montserrat_200ExtraLight, Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium, 
  Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black } from '@expo-google-fonts/montserrat';
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { AppProvider } from './Framework/Components/globalVariables';
import { SignIn } from './Framework/Screen/SignIn';
import { SignUp } from './Framework/Screen/signUp';
import { StackNavigator } from './Framework/Navigation/Stack';
import { ForgotPassword } from './Framework/Screen/ForgotPassword';
import { Preloader } from './Framework/Components/Preloader';
import { HomeScreen } from './Framework/Screen/HomeScreen';
import Profile from './Framework/Screen/Profile';
import { EditProfile } from './Framework/Screen/EditProfile';
import { Tipngoal } from './Framework/Screen/TipNGoal';
import Feeds from './Framework/Screen/Feeds';




LogBox.ignoreLogs(["ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes, migrate to the 'deprecated-react-native-prop-types' package."])


export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({ Pacifico_400Regular });
        await Font.loadAsync({ Montserrat_100Thin });
        await Font.loadAsync({ Montserrat_200ExtraLight });
        await Font.loadAsync({ Montserrat_300Light });
        await Font.loadAsync({ Montserrat_400Regular });
        await Font.loadAsync({ Montserrat_500Medium });
        await Font.loadAsync({ Montserrat_600SemiBold });
        await Font.loadAsync({ Montserrat_700Bold });
        await Font.loadAsync({ Montserrat_800ExtraBold });
        await Font.loadAsync({ Montserrat_900Black });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


  return (
    <AppProvider style={styles.container}>
      
      <StackNavigator/> 
      <Preloader/>
      {/* <Tipngoal/> */}
      {/* <PostGames/> */}
    {/* <Profile/> */}
      
      
      {/* <Feeds/> */}
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.lightGreen,
    
  },
});
