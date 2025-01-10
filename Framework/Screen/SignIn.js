import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState, } from 'react'
import { Theme } from '../Components/Theme.js';
import { Button, } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from "yup"
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../Firebase/Settings.js';
import { errorMessage } from '../Components/formatErrorMessage.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowDown, faArrowRight, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { AppContext } from '../Components/globalVariables.js';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';


const validation = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(20).required()
})

export function SignIn({ navigation }) {
  const { setUserUID, setPreloader } = useContext(AppContext);
  const [ passwordVisible, setPasswordVisible ] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.black }}>
      <View style={styles.container}>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(value) => {
            setPreloader(true)
            signInWithEmailAndPassword(auth, value.email, value.password)
              .then((data) => {
                // console.log(data.user.uid);
                setPreloader(false)
                setUserUID(data.user.uid)
                navigation.replace("HomeScreen");
              })
              .catch(e => {
                setPreloader(false)
                console.log(e)
                Alert.alert("Access denied!", errorMessage(e.code));
              })
          }}
          validationSchema={validation}
        >
          {(prop) => {
            return (
              <View style={{ flex: 1, justifyContent: "center", }}>


                <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 3, marginBottom: 10 }}>
                  <Text style={{ alignItems: "center", textAlign: "center", fontSize: 30, fontFamily: Theme.fonts.text900, color: Theme.colors.green }}>Login </Text>
                  <FontAwesomeIcon icon={faArrowRightToBracket} size={28} color='green' />
                </View>

                <View>

                  <TextInput
                    placeholder="Enter Email"
                    placeholderTextColor={Theme.colors.green}
                    style={styles.inputButton}
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={prop.handleChange("email")}
                    onBlur={prop.handleBlur("email")}
                    value={prop.values.email}
                  />
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.email && prop.errors.email}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", padding:13, backgroundColor:"white",borderWidth: 2,borderRadius: 20 }}>

                  <TextInput
                    placeholder="Enter Password"
                    placeholderTextColor={Theme.colors.green}
                    style={{}}
                    autoCapitalize='none'
                    autoComplete='off'
                    autoCorrect={false}
                    secureTextEntry={!passwordVisible}
                    keyboardType='default'
                    onChangeText={prop.handleChange("password")}
                    onBlur={prop.handleBlur("password")}
                    value={prop.values.password}
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  
                  >
                    <FontAwesomeIcon
                      icon={passwordVisible ? faEye : faEyeSlash}
                      size={20}
                      color={Theme.colors.black}
                    />
                  </TouchableOpacity>
                </View>
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.password && prop.errors.password}</Text>


                <TouchableOpacity onPress={() => { navigation.navigate("ForgotPassword") }}>
                  <Text style={{ color: Theme.colors.light.bg2, fontFamily: Theme.fonts.text700, alignSelf: "flex-end", padding: 6 }} >Forgot Password?</Text>
                </TouchableOpacity>



                <TouchableOpacity
                  // onPress={() => { navigation.navigate("HomeScreen") }}
                  onPress={prop.handleSubmit}
                  style={styles.btn}>
                  <Text style={{ fontSize: 20, fontFamily: Theme.fonts.text900, color: Theme.colors.green }}>SignIn</Text>
                  <Animatable.View animation="zoomInRight" iterationCount="infinite">
                    <FontAwesomeIcon icon={faArrowRight} color="white" />
                  </Animatable.View>

                </TouchableOpacity>




              </View>
            )
          }}

        </Formik>
      </View>
      <View style={{ marginVertical: 50, justifyContent: "center", flexDirection: "column", gap: 4 }}>


        <Animatable.View animation="bounceIn" iterationCount="infinite">
          <FontAwesomeIcon icon={faArrowDown} size={20} style={{ color: Theme.colors.light.bg2, alignSelf: "center" }} />
        </Animatable.View>




        <TouchableOpacity
          onPress={() => { navigation.navigate("SignUp") }}
          style={{ backgroundColor: "black", padding: 10, borderRadius: 20, alignItems: "center", marginHorizontal: 10, justifyContent: "flex-end", borderColor: Theme.colors.green, borderWidth: 2 }}>
          <Text style={{ color: Theme.colors.lightGreen, fontFamily: Theme.fonts.text900, fontSize: 20 }}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    // marginTop: StatusBar.currentHeight,
    backgroundColor: "#ffffff00",
  },
  input: {
    borderColor: Theme.colors.primary,
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 30,
    fontSize: 15,
    marginTop: 10

  },
  label: {
    marginBottom: 0
  },
  inputButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 20,
    padding: 15,
    marginVertical: 2
  },
  btn: {
    backgroundColor: Theme.colors.black,
    borderWidth: 2,
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    borderColor: Theme.colors.green
    // marginBottom: 30,

  },
})