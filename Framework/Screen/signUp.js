import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Button, Switch } from 'react-native-paper';
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
})

export function SignUp({ navigation }) {
  const { setUserUID, setPreloader } = useContext(AppContext);
  const [passwordVisible, setPasswordVisible ] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Theme.colors.black }}>
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
                <Text style={{ fontFamily:Theme.fonts.text800, fontSize:35, color:Theme.colors.light.bg2, textAlign: "center", 
                     fontFamily: Theme.fonts.text600, marginBottom:20, }}>Create Account</Text>
                <View style={styles.label}>
                  <Text style={{ fontFamily: Theme.fonts.text700, color:Theme.colors.light.bg2 }}>First Name</Text>
                  <TextInput
                    
                    placeholderTextColor={Theme.colors.greenDark}
                    style={styles.inputButton}
                    onChangeText={prop.handleChange('firstname')}
                    onBlur={prop.handleBlur("firstname")}
                    value={prop.values.firstname}
                  />
                 
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.firstname && prop.errors.firstname}</Text>

                </View>
                <View style={styles.label}>
                  <Text style={{ fontFamily: Theme.fonts.text700, color:Theme.colors.light.bg2 }}>Last Name</Text>
                  <TextInput
                    
                    placeholderTextColor={Theme.colors.greenDark}
                    style={styles.inputButton}
                    onChangeText={prop.handleChange('lastname')}
                    onBlur={prop.handleBlur("lastname")}
                    value={prop.values.lastname}
                  />
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.lastname && prop.errors.lastname}</Text>

                </View>
                <View style={styles.label}>
                  <Text style={{ fontFamily: Theme.fonts.text700, color:Theme.colors.light.bg2 }}>E-mail</Text>
                  <TextInput
                    // placeholder='Enter E-mail'
                    placeholderTextColor={Theme.colors.greenDark}
                    style={styles.inputButton}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={prop.handleChange('email')}
                    onBlur={prop.handleBlur("email")}
                    value={prop.values.email}
                  />
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.email && prop.errors.email}</Text>


                </View>
                

                <View style={[styles.label, {}]}>
                  <Text style={{ fontFamily: Theme.fonts.text700, color:Theme.colors.light.bg2 }}>Username</Text>
                  <TextInput
                    // placeholder='Enter Username'
                    placeholderTextColor={Theme.colors.greenDark}
                    style={styles.inputButton}
                    onChangeText={prop.handleChange('username')}
                    onBlur={prop.handleBlur("username")}
                    value={prop.values.username}
                  />
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.username && prop.errors.username}</Text>

                </View>

                <View style={styles.label}>
  <Text style={{ fontFamily: Theme.fonts.text700, color: Theme.colors.light.bg2 }}>Password</Text>
  <View style={{
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    padding: 2,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Theme.colors.green,
  }}>
    <TextInput
      style={{ // flex: 1, 
        padding: 10, fontFamily: Theme.fonts.text500, color: Theme.colors.black,}}
      onChangeText={prop.handleChange('password')}
      onBlur={prop.handleBlur("password")}
      secureTextEntry={!passwordVisible}
      value={prop.values.password}
      autoCapitalize="none" 
      autoCorrect={false}
      placeholder="Enter Password"
      placeholderTextColor={Theme.colors.light.bg2} 
    />
    <TouchableOpacity
      onPress={() => setPasswordVisible(!passwordVisible)}
      style={{ marginHorizontal: 10 }}
    >
      <FontAwesomeIcon
        icon={passwordVisible ? faEye : faEyeSlash}
        size={20}
        color={Theme.colors.black}
      />
    </TouchableOpacity>
  </View>
</View>
<Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>
  {prop.touched.password && prop.errors.password}
</Text>

                <View style={styles.label}>
                  <Text style={{ fontFamily: Theme.fonts.text700, color:Theme.colors.light.bg2 }}>Phone</Text>
                  <TextInput
                    
                    placeholderTextColor={Theme.colors.greenDark}
                    style={styles.inputButton}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={prop.handleChange('phone')}
                    onBlur={prop.handleBlur("phone")}
                    value={prop.values.phone}
                  />
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.email && prop.errors.email}</Text>
                </View>
                <TouchableOpacity
                    onPress={prop.handleSubmit}
                    style={{ backgroundColor: Theme.colors.green, padding: 10, borderRadius: 20, alignItems: "center"}}>
                    <Text style={{ color: Theme.colors.light.bg2, fontFamily: Theme.fonts.text900, fontSize: 20 }}>SignUp</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 15, marginVertical: 30, fontFamily: Theme.fonts.text500, color:Theme.colors.light.bg2 }}>Already have an account?</Text>
                  
                  <View>
                    <Animatable.View animation="flash" iterationCount="infinite">
                    <Button mode='text' textColor={Theme.colors.green} onPress={() => { navigation.navigate("SignIn") }}>Login Here
                    <FontAwesomeIcon icon={faThumbsUp} size={25} style={{color:Theme.colors.green}}/>
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
  container: {
    flex: 1,
    padding: 20,
    marginTop: StatusBar.currentHeight,
    backgroundColor: "#ffffff00",
  },
  input: {
    borderColor: Theme.colors.primary,
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 30,
    fontSize: 17,
  },

  label: {
    marginTop:0,
    marginBottom: 0,
  },
  inputButton: {
    backgroundColor: "white",
    borderWidth: 2,
    // borderEndEndRadius: 30,
    // borderBottomLeftRadius: 30,
    borderColor: Theme.colors.green,
    padding: 10,
    marginVertical: 2,

  },
})