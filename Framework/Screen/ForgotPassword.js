import { Alert, Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Theme } from '../Components/Theme'
import { sendPasswordResetEmail } from 'firebase/auth';
import { errorMessage } from '../Components/formatErrorMessage';
import { AppContext } from '../Components/globalVariables';
import { auth } from '../Firebase/Settings';
import { TextInput } from 'react-native-paper';


export function ForgotPassword({ navigation, }) {
    const { setPreloader } = useContext(AppContext)
    const [email, setEmail] = useState("")


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
        <SafeAreaView style={{ flex: 1 }} >
            <View style={styles.container}>

                <View style={styles.form}>
                    <Text style={styles.header}>Forgot Account Password</Text>
                    
                    <Text style={styles.text}>Please enter your account email, and a password reset link will be sent to your email.</Text>
                    
                  <TextInput
                    label={'Enter Email'}
                    autoCorrect={false}
                    autoCapitalize='none'
                    onChangeText={(inp) => setEmail(inp)}
                    left={<TextInput.Icon icon='account' color='green'/>}
                    mode="outlined"
                    activeOutlineColor='green'
                    
                />
                    <TouchableOpacity disabled={email === ""} onPress={sendEmail} style={styles.appBTN}>
                        <Text style={{ fontSize: 16,  fontFamily: Theme.fonts.text800, color:Theme.colors.light.bg2 }}>Send Link</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")} style={{ alignItems: "center", marginTop: 10, backgroundColor:"black", padding:7, borderRadius:20, borderColor:Theme.colors.green, borderWidth:3}}>
                    <Text style={{ fontSize: 16, color: Theme.colors.light.bg2, fontFamily: Theme.fonts.text600, padding:5 }}>Remember your password?</Text>
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
        color: Theme.colors.text1,
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
        borderWidth: 3,
        borderColor: Theme.colors.dark,
        padding: 12,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 40,
        backgroundColor: Theme.colors.green
    }
})