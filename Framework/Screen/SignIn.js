import { Alert, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState, } from 'react'
import { Theme } from '../Components/Theme.js';
import { Button, TextInput, } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from "yup"
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/Settings.js';
import { errorMessage } from '../Components/formatErrorMessage.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowDown, faArrowRight, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { AppContext } from '../Components/globalVariables.js';



const validation = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(20).required()
})

export function SignIn({ navigation }) {
  const { setUserUID, setPreloader } = useContext(AppContext);
  const [ passwordVisible, setPasswordVisible ] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.greenLight }}>
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
              <View style={{ flex: 1, justifyContent: "center",  }}>


                <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 3, marginBottom: 10 }}>
                  <Text style={{ alignItems: "center", textAlign: "center", fontSize: 30, fontFamily: Theme.fonts.text900, color: Theme.colors.black }}>Welcome </Text>
                  <FontAwesomeIcon icon={faArrowRightToBracket} size={28}  />
                </View>

                <View>
                  <TextInput
                    label={'Enter Email'}
                    autoCorrect={false}
                    autoCapitalize='none'
                     value={prop.values.email}
                     onChangeText={prop.handleChange("email")}
                    left={<TextInput.Icon icon='account' color='green'/>}
                    mode="outlined"
                    activeOutlineColor='green'
                    
                />
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.email && prop.errors.email}</Text>
                </View>
                <TextInput
                    activeOutlineColor='green'
                    autoCapitalize='none'
                    autoComplete='off'
                    autoCorrect={false}
                    onBlur={prop.handleBlur("password")}
                    secureTextEntry={!passwordVisible}
                    label={'Enter Password'}
                    value={prop.values.password}
                    onChangeText={prop.handleChange("password")}
                    left={<TextInput.Icon icon='form-textbox-password'color='green'/>}
                    right={<TextInput.Icon icon={passwordVisible ? 'eye-off' : 'eye'} onPress={() => setPasswordVisible(!passwordVisible)} color='green'/>}
                    mode="outlined"
                />
                  <Text style={{ fontSize: 13, color: Theme.colors.red, fontFamily: Theme.fonts.text400 }}>{prop.touched.password && prop.errors.password}</Text>


                <TouchableOpacity onPress={() => { navigation.navigate("ForgotPassword") }}>
                  <Text style={{  fontFamily: Theme.fonts.text700, alignSelf: "flex-end", padding: 6, marginBottom: 5}} >Forgot Password?</Text>
                </TouchableOpacity>



                <TouchableOpacity
                  // onPress={() => { navigation.navigate("HomeScreen") }}
                  onPress={prop.handleSubmit}
                  style={styles.btn}>
                  <Text style={{ fontSize: 20, fontFamily: Theme.fonts.text900, color: 'black' }}>
                  <Animatable.View animation="zoomInRight" iterationCount="infinite">
                    <FontAwesomeIcon icon={faArrowRight}  />
                  </Animatable.View>
                  Log In</Text>
                </TouchableOpacity>




              </View>
            )
          }}

        </Formik>
      </View>
      <View style={{ marginVertical: 50, justifyContent: "center", flexDirection: "column", gap: 4 }}>

        <TouchableOpacity
          onPress={() => { navigation.navigate("SignUp") }}
          style={{ backgroundColor: "white", padding: 10, borderRadius: 20, alignItems: "center", marginHorizontal: 10, justifyContent: "flex-end", borderColor: Theme.colors.green, borderWidth: 2 }}>
          <Text style={{  fontFamily: Theme.fonts.text900, fontSize: 20 }}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {flex: 1,padding: 15,backgroundColor: "#ffffff00",},
  input: {borderColor: Theme.colors.primary,borderWidth: 1,padding: 5,paddingHorizontal: 15,borderRadius: 30,fontSize: 15,marginTop: 10},
  label: {marginBottom: 0},
  inputButton: {backgroundColor: "white",borderWidth: 2,borderRadius: 20,padding: 15,marginVertical: 2},
  btn: {backgroundColor: Theme.colors.green,borderWidth: 2,borderRadius: 20,padding: 12,alignItems: "center",flexDirection: "row",justifyContent: "center",gap: 6,borderColor: "black"},
})