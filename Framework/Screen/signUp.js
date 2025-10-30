import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Theme } from '../Components/Theme';
import { Formik } from 'formik';
import * as yup from "yup";
import { auth, db } from '../Firebase/Settings';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AppContext } from '../Components/globalVariables';
import { doc, setDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../Context/ThemeContext';


const validation = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(20).required(),
  firstname: yup.string().min(2).max(20).required(),
  lastname: yup.string().min(2).max(20).required(),
  // username: yup.string().min(6).max(15).required(),
  // phone: yup.string().required(),
});

export function SignUp({ navigation }) {
  const { setUserUID, setPreloader } = useContext(AppContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor: theme === 'dark' ? '#1E1E1E' : '#ffffff' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight + 50}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              padding: 20,
              paddingBottom: 30, // space for keyboard
            }}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Formik
                initialValues={{
                  firstname: '',
                  lastname: '',
                  email: '',
                  // username: '',
                  password: '',
                  // phone: '',
                }}
                validationSchema={validation}
                onSubmit={(value) => {
                  setPreloader(true);
                  createUserWithEmailAndPassword(auth, value.email, value.password)
                    .then((data) => {
                      const { uid } = data.user;
                      setDoc(doc(db, 'users', uid), {
                        firstname: value.firstname,
                        lastname: value.lastname,
                        email: value.email,
                        // username: value.username,
                        userUID: uid,
                        image: null,
                        // phone: Number(value.phone),
                        role: 'user',
                      })
                        .then(() => {
                          setPreloader(false);
                          setUserUID(uid);
                          navigation.replace('HomeScreen');
                        })
                        .catch((e) => {
                          setPreloader(false);
                          console.log(e.code);
                        });
                    })
                    .catch((e) => {
                      setPreloader(false);
                      console.log(e);
                    });
                }}
              >
                {(prop) => (
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    {/* Header */}
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
                        source={require('../../assets/tiplogo2.png')}
                        style={{
                          width: 100,
                          height: 100,
                          backgroundColor: 'black',
                          borderRadius: 10,
                          alignSelf: 'center',
                          marginBottom: 10,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 24,
                          textAlign: 'center',
                          fontFamily: Theme.fonts.text800,
                          color: theme === 'dark' ? '#fff' : '#1E1E1E'
                        }}
                      >
                        Create New Account
                      </Text>
                      <Text
                        style={{
                          alignSelf: 'center',
                          fontFamily: Theme.fonts.text500,
                          fontSize: 14,
                          color: theme === 'dark' ? '#f8f8f8' : '#636363',
                          marginTop: 5,
                        }}
                      >
                        Fill form to create Account
                      </Text>
                    </View>

                    {/* First Name */}
                    <View style={styles.label}>
                      <TextInput
                        label={'Enter First Name'}
                        autoCorrect={false}
                        value={prop.values.firstname}
                        onChangeText={prop.handleChange('firstname')}
                        onBlur={prop.handleBlur('firstname')}
                        left={<TextInput.Icon icon="account" color={Theme.colors.green} />}
                        mode="outlined"
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
                        {prop.touched.firstname && prop.errors.firstname}
                      </Text>
                    </View>

                    {/* Last Name */}
                    <View style={styles.label}>
                      <TextInput
                        label={'Enter Last Name'}
                        autoCorrect={false}
                        mode="outlined"
                        onChangeText={prop.handleChange('lastname')}
                        left={<TextInput.Icon icon="account" color={Theme.colors.green} />}
                        onBlur={prop.handleBlur('lastname')}
                        value={prop.values.lastname}
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
                        {prop.touched.lastname && prop.errors.lastname}
                      </Text>
                    </View>

                    {/* Email */}
                    <TextInput
                      label={'Enter Email'}
                      autoCorrect={false}
                      mode="outlined"
                      autoCapitalize="none"
                      onChangeText={prop.handleChange('email')}
                      left={<TextInput.Icon icon="email" color={Theme.colors.green} />}
                      onBlur={prop.handleBlur('email')}
                      value={prop.values.email}
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

                    {/* Username */}
                    {/* <TextInput
                      label={'Create Username'}
                      autoCorrect={false}
                      mode="outlined"
                      activeOutlineColor="black"
                      autoCapitalize="none"
                      onChangeText={prop.handleChange('username')}
                      onBlur={prop.handleBlur('username')}
                      left={<TextInput.Icon icon="account-check" color="green" />}
                      value={prop.values.username}
                    />
                    <Text style={styles.errorText}>
                      {prop.touched.username && prop.errors.username}
                    </Text> */}

                    {/* Password */}
                    <TextInput
                      onChangeText={prop.handleChange('password')}
                      onBlur={prop.handleBlur('password')}
                      secureTextEntry={!passwordVisible}
                      value={prop.values.password}
                      autoCapitalize="none"
                      autoCorrect={false}
                      label={'Create Password'}
                      left={<TextInput.Icon icon="form-textbox-password" color={Theme.colors.green} />}
                      mode="outlined"
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
                    />
                    <Text style={styles.errorText}>
                      {prop.touched.password && prop.errors.password}
                    </Text>

                    {/* Phone */}
                    {/* <TextInput
                      label={'Enter Phone Number'}
                      autoCorrect={false}
                      mode="outlined"
                      activeOutlineColor="black"
                      autoCapitalize="none"
                      keyboardType="number-pad"
                      onChangeText={prop.handleChange('phone')}
                      onBlur={prop.handleBlur('phone')}
                      left={<TextInput.Icon icon="phone" color="green" />}
                      value={prop.values.phone}
                    />
                    <Text style={styles.errorText}>
                      {prop.touched.phone && prop.errors.phone}
                    </Text> */}

                    {/* Submit */}
                    <TouchableOpacity
                      onPress={() => {
                        Keyboard.dismiss();
                        prop.handleSubmit();
                      }}
                      style={styles.submitButton}
                    >
                      <Text style={styles.submitText}>Create Account</Text>
                    </TouchableOpacity>

                    {/* Already have account */}
                    <View style={styles.signInContainer}>
                      <Text style={{fontFamily: Theme.fonts.text600,color: theme === 'dark' ? '#fff' : '#1E1E1E',}}>Already have an account?</Text>
                      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={styles.signUpLink}>Sign in</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#ffffff00',
  },
  label: {
    marginTop: 0,
    marginBottom: 0,
  },
  errorText: {
    fontSize: 13,
    color: Theme.colors.red,
    fontFamily: Theme.fonts.text400,
  },
  submitButton: {
    backgroundColor: Theme.colors.green,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 18,
  },
  submitText: {
    fontFamily: Theme.fonts.text600,
    color: Theme.colors.light.bg,
    fontSize: 20,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 5,
  },
  signInText: {
    fontSize: 15,
    fontFamily: Theme.fonts.text500,
  },
  signUpLink: {
    color: Theme.colors.green,
    fontFamily: Theme.fonts.text600,
    marginLeft: 5,
  },
});
