
import { Button, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { AppBotton } from '../Components/AppButton';
import { Theme } from '../Components/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import * as Animatable from 'react-native-animatable';

export default function Intro ({navigation}) {
  return (
    <View style={{flex:1}}>
        <ImageBackground source={require("../../assets/bg2.jpg")} style={styles.bg}>
        <View style={styles.container}>
                <Animatable.View animation="pulse" iterationCount="infinite">
            <AppBotton onPress={()=>{navigation.navigate("SignIn")}}>
                GET STARTED
                </AppBotton>
                    </Animatable.View>
                    
            
        </View>
        </ImageBackground>
    </View>
      
    
  );
}

const styles = StyleSheet.create({
    bg: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      flex:1,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: 20,
      paddingBottom: 40,
      
    }
  })

