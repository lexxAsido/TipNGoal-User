import React, { useContext, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Theme } from '../../Components/Theme.js';
import { TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from "yup";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase/Settings.js';
import { errorMessage } from '../../Components/formatErrorMessage.js';
import { AppContext } from '../../Components/globalVariables.js';
import { ThemeContext } from '../../Context/ThemeContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faSun,
  faMoon,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

const validation = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(20).required()
});

export function SignIn({ navigation }) {
  const { setUserUID, setPreloader } = useContext(AppContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1E1E1E' : '#ffffff' }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 15 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            
{/* ✅ Dark Mode Toggle */}
          <TouchableOpacity
            style={{ marginTop: 10,alignSelf: "flex-end", }}
            onPress={toggleTheme}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap:10 }}>
              <FontAwesomeIcon
                icon={theme === 'dark' ? faSun : faMoon}
                size={22}
                color="#24C55E"
                style={{ paddingRight: 10 }}
              />
              <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </View>
          </TouchableOpacity>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validation}
              onSubmit={(value) => {
                setPreloader(true);
                signInWithEmailAndPassword(auth, value.email, value.password)
                  .then((data) => {
                    setPreloader(false);
                    setUserUID(data.user.uid);
                    navigation.replace("HomeScreen");
                  })
                  .catch(e => {
                    setPreloader(false);
                    Alert.alert("Access denied!", errorMessage(e.code));
                  });
              }}
            >
              {(prop) => (
                <View style={{ justifyContent: "center", flex:0.8 }}>
                  <View
                    style={{
                      elevation: 10,
                      shadowColor: Theme.colors.green,
                      shadowOffset: { width: 2, height: 10 },
                      shadowOpacity: 1,
                      shadowRadius: 4,
                      marginBottom: 10,
                    }}
                  >
                    <Image
                      source={require("../../../assets/tiplogo2.png")}
                      style={{
                        width: 100,
                        height: 100,
                        backgroundColor: "black",
                        borderRadius: 10,
                        alignSelf: "center",
                        marginBottom: 10,
                      }}
                    />
                    <Text
                      style={{
                        alignSelf: "center",
                        fontFamily: Theme.fonts.text600,
                        fontSize: 20,
                        color: theme === 'dark' ? '#fff' : '#1E1E1E'
                      }}
                    >
                      Welcome Back
                    </Text>
                    <Text
                      style={{
                        alignSelf: "center",
                        fontFamily: Theme.fonts.text500,
                        fontSize: 14,
                        color: theme === 'dark' ? '#f8f8f8' : '#636363',
                        marginTop: 10,
                      }}
                    >
                      Sign into your account
                    </Text>
                  </View>

                  {/* Email Input */}
                  <View>
                    <TextInput
  label="Enter Email"
  value={prop.values.email}
  onChangeText={prop.handleChange("email")}
  mode="outlined"
  left={<TextInput.Icon icon="account" color={Theme.colors.green} />}
  activeOutlineColor={Theme.colors.green}
  textColor={theme === 'dark' ? '#ffffff' : '#000000'}
  outlineColor={theme === 'dark' ? '#555' : '#ccc'}
  placeholderTextColor={theme === 'dark' ? '#aaa' : '#666'}
  theme={{
    colors: {
      background: theme === 'dark' ? '#1E1E1E' : '#ffffff',
      surface: theme === 'dark' ? '#1E1E1E' : '#ffffff',
      text: theme === 'dark' ? '#ffffff' : '#000000',
      placeholder: theme === 'dark' ? '#aaa' : '#666',
      primary: Theme.colors.green,
    },
  }}
/>

                    <Text style={styles.errorText}>
                      {prop.touched.email && prop.errors.email}
                    </Text>
                  </View>

                  {/* Password Input */}
                  <TextInput
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    onBlur={prop.handleBlur("password")}
                    secureTextEntry={!passwordVisible}
                    label="Enter Password"
                    value={prop.values.password}
                    onChangeText={prop.handleChange("password")}
                    left={<TextInput.Icon icon="form-textbox-password" color={Theme.colors.green} />}
                    right={
                      <TextInput.Icon
                        icon={passwordVisible ? 'eye-off' : 'eye'}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        color={Theme.colors.green}
                      />
                    }
  activeOutlineColor={Theme.colors.green}
  textColor={theme === 'dark' ? '#ffffff' : '#000000'}
  outlineColor={theme === 'dark' ? '#555' : '#ccc'}
  placeholderTextColor={theme === 'dark' ? '#aaa' : '#666'}
  theme={{
    colors: {
      background: theme === 'dark' ? '#1E1E1E' : '#ffffff',
      surface: theme === 'dark' ? '#1E1E1E' : '#ffffff',
      text: theme === 'dark' ? '#ffffff' : '#000000',
      placeholder: theme === 'dark' ? '#aaa' : '#666',
      primary: Theme.colors.green,
    },
  }}
                    mode="outlined"
                  />
                  <Text style={styles.errorText}>
                    {prop.touched.password && prop.errors.password}
                  </Text>

                  {/* Forgot Password */}
                  <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={{fontFamily: Theme.fonts.text600,alignSelf: "flex-start",padding: 6,marginBottom: 5,
                    color: theme === 'dark' ? '#fff' : '#1E1E1E'}}>Forgot Password?</Text>
                  </TouchableOpacity>

                  {/* Sign In Button */}
                  <TouchableOpacity onPress={prop.handleSubmit} style={styles.btn}>
                    <Text style={styles.btnText}>Sign in</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={{fontFamily: Theme.fonts.text600,color: theme === 'dark' ? '#fff' : '#1E1E1E',}}>Don't have an Account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.signUpLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 30,
  },
  btn: {
    backgroundColor: Theme.colors.green,
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  btnText: {
    fontSize: 20,
    fontFamily: Theme.fonts.text600,
    color: Theme.colors.light.bg,
  },
  forgotPassword: {
    fontFamily: Theme.fonts.text600,
    alignSelf: "flex-start",
    padding: 6,
    marginBottom: 5,
    // color: theme === 'dark' ? '#fff' : '#1E1E1E'
  },
  errorText: {
    fontSize: 13,
    color: Theme.colors.red,
    fontFamily: Theme.fonts.text400,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    alignItems: "center",
  },
  signUpText: {
    fontFamily: Theme.fonts.text600,
    color: "#333",
  },
  signUpLink: {
    color: Theme.colors.green,
    fontFamily: Theme.fonts.text600,
    marginLeft: 5,
  },
});
