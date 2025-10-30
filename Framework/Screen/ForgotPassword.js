import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Theme } from '../Components/Theme'
import { sendPasswordResetEmail } from 'firebase/auth';
import { errorMessage } from '../Components/formatErrorMessage';
import { AppContext } from '../Components/globalVariables';
import { auth } from '../Firebase/Settings';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../Context/ThemeContext';



export function ForgotPassword({ navigation, }) {
    const { setPreloader } = useContext(AppContext)
    const [email, setEmail] = useState("")
      const { theme } = useContext(ThemeContext);


    function sendEmail() {
        setPreloader(true);
        sendPasswordResetEmail(auth, email)
            .then((a) => {
                console.log(a);
                setPreloader(false);
                Alert.alert("Password Reset", "A password reset email has been sent to your mail.");
            })
            .catch(e => {
                setPreloader(false);
                Alert.alert("Error!", errorMessage(e.code));
            })
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1E1E1E' : '#ffffff' }} >
            <View style={styles.container}>

                <View style={styles.form}>
                    <Text style={{fontSize: 23,
        fontFamily: Theme.fonts.text800,
        color: theme === 'dark' ? '#fff' : '#1E1E1E',
        marginBottom:20,
        textAlign:"center",
        borderBottomWidth:3,
        borderColor: Theme.colors.green}}
        >Forgot Account Password</Text>
                    
            <Text style={{fontSize: 16,
        fontFamily: Theme.fonts.text400,
        color: theme === 'dark' ? '#fff' : '#1E1E1E',
        marginBottom:28,
        }}>
                        Please enter your account email, and a password reset link will be sent to your email.
                        </Text>
                    
                  <TextInput
                    label={'Enter Email'}
                    autoCorrect={false}
                    autoCapitalize='none'
                    onChangeText={(inp) => setEmail(inp)}
                    left={<TextInput.Icon icon='account' color={Theme.colors.green}/>}
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
                    <TouchableOpacity disabled={email === ""} onPress={sendEmail} style={styles.appBTN}>
                        <Text style={{ fontSize: 16,  fontFamily: Theme.fonts.text800, color:Theme.colors.light.bg2 }}>Send Link</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")} style={{ alignItems: "center", marginTop: 10,  padding:7, borderRadius:20, }}>
                    <Text style={{ fontSize: 16, fontFamily: Theme.fonts.text600, padding:5, color: theme === 'dark' ? '#fff' : '#1E1E1E', }}>Remember your password?</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        // backgroundColor: Theme.colors.lightGreen,
        justifyContent:"center"
    },
    form: {
        
        justifyContent: "center",
        
    },
    header: {
        fontSize: 23,
        fontFamily: Theme.fonts.text800,
        // color: theme === 'dark' ? '#fff' : '#1E1E1E',
        marginBottom:20,
        textAlign:"center",
        borderBottomWidth:3,
        borderColor: Theme.colors.green
    },
    text: {
        fontSize: 16,
        fontFamily: Theme.fonts.text400,
        color: Theme.colors.text2
    },
    input: {
        borderColor: "gray",
        borderWidth: 1,
        padding: 8,
        marginBottom: 10,
        borderRadius: 10,
        width: "100%",
        fontSize: 18,
        borderColor:Theme.colors.dark
    },
    placeholder: {
        fontFamily: Theme.fonts.text700,
        marginTop: 10
    },
    error: {
        fontFamily: Theme.fonts.text400,
        color: "#d70000",
        marginStart: 7
    },
    appBTN: {
        // borderWidth: 3,
        // borderColor: Theme.colors.dark,
        padding: 12,
        marginVertical: 15,
        alignItems: 'center',
        borderRadius: 40,
        backgroundColor: Theme.colors.green
    }
})