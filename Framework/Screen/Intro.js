
import {  ImageBackground, StyleSheet, Text, View } from 'react-native';
import { AppBotton } from '../Components/AppButton';
import * as Animatable from 'react-native-animatable';
import { Button } from 'react-native-paper';

export default function Intro ({navigation}) {
  return (
    <View style={{flex:1}}>
        <ImageBackground source={require("../../assets/bg2.jpg")} style={styles.bg}>
        <View style={styles.container}>
                <Animatable.View animation="pulse" iterationCount="infinite" style={{flexDirection:"row", justifyContent:"space-around"}}>
            {/* <AppBotton onPress={()=>{navigation.navigate("SignIn")}}>
                GET STARTED
                </AppBotton> */}
                <Button  icon="login" mode="contained" buttonColor='black' onPress={() => navigation.navigate('SignIn')}>LogIn</Button>
                <Button  icon="account" mode="contained" buttonColor='green' onPress={() => navigation.navigate('SignUp')}>Sign Up</Button>
                    </Animatable.View>
                    
            
        </View>
        </ImageBackground>
    </View>
      
    
  );
}

const styles = StyleSheet.create({
    bg: {width: '100%',height: '100%',resizeMode: 'cover',flex:1,},
    container: {flex: 1,justifyContent: 'flex-end',padding: 20,paddingBottom: 40,}
  })

