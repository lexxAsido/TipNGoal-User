
import {  ImageBackground, StyleSheet, Text, View } from 'react-native';
import { AppBotton } from '../Components/AppButton';
import { Button } from 'react-native-paper';

export default function Intro ({navigation}) {
  return (
    <View style={{flex:1}}>
        <ImageBackground source={require("../../assets/bg2.jpg")} style={styles.bg}>
        <View style={styles.container}>
                <View  style={{flexDirection:"row", justifyContent:"space-around"}}>
                <Button  icon="login" mode="contained" buttonColor='black' onPress={() => navigation.navigate('SignIn')}>LogIn</Button>
                <Button  icon="account" mode="contained" buttonColor='green' onPress={() => navigation.navigate('SignUp')}>Sign Up</Button>
                    </View>
                    
            
        </View>
        </ImageBackground>
    </View>
      
    
  );
}

const styles = StyleSheet.create({
    bg: {width: '100%',height: '100%',resizeMode: 'cover',flex:1,},
    container: {flex: 1,justifyContent: 'flex-end',padding: 20,paddingBottom: 40,}
  })

