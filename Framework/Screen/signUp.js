import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Button, Switch, TextInput } from 'react-native-paper';
import { Theme } from '../Components/Theme';
import { Formik } from 'formik';
import * as yup from "yup";
import { auth, db } from '../Firebase/Settings';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AppContext } from '../Components/globalVariables';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { doc, setDoc } from 'firebase/firestore';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';


const validation = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(20).required(),
  firstname: yup.string().min(2).max(20).required(),
  lastname: yup.string().min(2).max(20).required(),
  username: yup.string().min(6).max(15).required(),
  phone: yup.string().required(),
})

export function SignUp({ navigation }) {
  const { setUserUID, setPreloader } = useContext(AppContext);
  const [passwordVisible, setPasswordVisible ] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Theme.colors.greenLight }}>
      <View style={styles.container}>

        <Formik
          initialValues={{ firstname: "", lastname: "", email: "", username: "", password: "" }}
          onSubmit={(value) => {
            setPreloader(true)
            createUserWithEmailAndPassword(auth, value.email, value.password).then((data) => {
              const { uid } = data.user;
              
              setDoc(doc(db, "users", uid), {
                firstname: value.firstname,
                lastname: value.lastname,
                email: value.email,
                username: value.username,
                userUID: uid,
                image: null,
                phone: Number([]),
                role: "user",
              }).then((data) => {
                setPreloader(false)
                setUserUID(uid)
                navigation.replace("HomeScreen")
              }).catch(e => {
                setPreloader(false)
                console.log(e.code)
              })
            }).catch(e => {
              setPreloader(false)
              console.log(e)
            })
          }}
          validationSchema={validation}
        >
          {(prop) => {
            return (
              <View style={{ flex: 1, justifyContent: "center", }}>
                <Text style={{  fontSize:35, textAlign: "center", 
                     fontFamily: Theme.fonts.text800, marginBottom:10, }}>Create Account</Text>
                <View style={styles.label}>
                  
                  
                 <TextInput
                    label={'Enter First Name'}
                    autoCorrect={false}
                    value={prop.values.firstname}
                    onChangeText={prop.handleChange('firstname')}
                    onBlur={prop.handleBlur("firstname")}
                    left={<TextInput.Icon icon='account' color='green'/>}
                    mode="outlined"
                    activeOutlineColor='green'
                    
                />
                 
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.firstname && prop.errors.firstname}</Text>

                </View>
                <View style={styles.label}>
                  <TextInput
                    label={'Enter Last Name'}
                    autoCorrect={false}
                    mode="outlined"
                    activeOutlineColor='green'
                    onChangeText={prop.handleChange('lastname')}
                    left={<TextInput.Icon icon='account' color="green" />}
                    onBlur={prop.handleBlur("lastname")}
                    value={prop.values.lastname}
                  />
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.lastname && prop.errors.lastname}</Text>

                </View>
                
                  <TextInput
                    // placeholder='Enter E-mail'
                    label={'Enter Email'}
                    autoCorrect={false}
                    mode="outlined"
                    activeOutlineColor='green'
                    autoCapitalize='none'
                    onChangeText={prop.handleChange('email')}
                    left={<TextInput.Icon icon='email' color="green" />}
                    onBlur={prop.handleBlur("email")}
                    value={prop.values.email}
                  />
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.email && prop.errors.email}</Text>
               
                  <TextInput
                    label={'Create UserName'}
                    autoCorrect={false}
                    mode="outlined"
                    activeOutlineColor='green'
                    autoCapitalize='none'
                    onChangeText={prop.handleChange('username')}
                    onBlur={prop.handleBlur("username")}
                    left={<TextInput.Icon icon='account-check' color="green" />}
                    value={prop.values.username}
                  />
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.username && prop.errors.username}</Text>

               

      
    <TextInput
      onChangeText={prop.handleChange('password')}
      onBlur={prop.handleBlur("password")}
      secureTextEntry={!passwordVisible}
      value={prop.values.password}
      autoCapitalize="none" 
      autoCorrect={false}
     label={'Create Password'} 
      left={<TextInput.Icon icon='form-textbox-password'color='green'/>}
      mode="outlined"
      activeOutlineColor='green'
      // left={<TextInput.Icon icon='form-textbox-password'color='green'/>}
      right={<TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} color='green'/>}
    />

<Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>
  {prop.touched.password && prop.errors.password}
</Text>

                
                  <TextInput
                    label={'Enter Phone Number'}
                    autoCorrect={false}
                    mode="outlined"
                    activeOutlineColor='green'
                    autoCapitalize='none'
                    onChangeText={prop.handleChange('phone')}
                    onBlur={prop.handleBlur("phone")}
                    left={<TextInput.Icon icon='phone' color="green" />}
                    value={prop.values.phone}
                  />
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.phone && prop.errors.phone}</Text>
               
                <TouchableOpacity
                    onPress={prop.handleSubmit}
                    style={{ backgroundColor: Theme.colors.green, padding: 10, borderRadius: 20, alignItems: "center", borderWidth: 2, marginTop:18 }}>
                    <Text style={{  fontFamily: Theme.fonts.text900, fontSize: 20,  }}>Sign Up</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 15, marginVertical: 30, fontFamily: Theme.fonts.text500,  }}>Already have an account?</Text>
                  
                  <View>
                    <Animatable.View animation="flash" iterationCount="infinite">
                    <Button mode='text' textColor='green' onPress={() => { navigation.navigate("SignIn") }}>Login Here
                    <FontAwesomeIcon icon={faThumbsUp} size={25} />
                  </Button>
                    </Animatable.View>
                  </View>
                </View>
              </View>
            )
          }}
        </Formik>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {flex: 1,padding: 20,marginTop: StatusBar.currentHeight,backgroundColor: "#ffffff00",},
  input: {borderColor: Theme.colors.primary,borderWidth: 1,padding: 5,paddingHorizontal: 15,borderRadius: 30,fontSize: 17,},
  label: {marginTop:0,marginBottom: 0,},
  inputButton: {backgroundColor: "white",borderWidth: 2,borderColor: Theme.colors.green,padding: 10,marginVertical: 2,},
})