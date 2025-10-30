import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { Text, View, TextInput, Alert, TouchableOpacity, Image, Pressable, ScrollView, StyleSheet, Dimensions, ImageBackground, } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faCameraRetro, faImage, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-native";
import { } from "react-native";
import { Theme } from "../Components/Theme";
import * as Imagepicker from "expo-image-picker"
import { AppBotton } from '../Components/AppButton';
import { AppContext } from "../Components/globalVariables";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Settings";
import { errorMessage } from "../Components/formatErrorMessage";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";



export function EditProfile({ navigation }) {
    const { setPreloader, userInfo, userUID } = useContext(AppContext);
    const [image, setImage] = useState(null);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [preVisibility, setpreVisibility] = useState(false);
    const [imageMD, setimageMD] = useState(false);
    const [firstname, setfirstname] = useState(userInfo.firstname);
    const [lastname, setlastname] = useState(userInfo.lastname);
    const [address, setaddress] = useState(userInfo.address);
    const [phone, setphone] = useState(userInfo.phone);
    const [username, setusername] = useState(userInfo.username);
    const { width = 360 } = Dimensions.get("window"); // safer for Hermes




    useEffect(() => {
       

    }, []);

    const closeModal = () => {
        setModalVisibility(!modalVisibility);
    };
    const previewModal = () => {
        setpreVisibility(!preVisibility);
    };

    const imageModal = () => {
        setimageMD(!imageMD);
    };


    async function picker() {
        const result = await Imagepicker.launchImageLibraryAsync({
            mediaType: Imagepicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 4],
            quality: 1,
        })
        if (!result.canceled) {
            const { uri } = result.assets[0];
            setImage(uri)
            previewModal();
        }
    }

    function updateUser() {
        setPreloader(true);
        const data = { firstname, lastname, phone, address };
        updateDoc(doc(db, "users", userUID), data)
            .then(() => {
                setPreloader(false);
                Alert.alert("Update Profile", "User information has been updated successfully");
            })
            .catch(e => {
                setPreloader(false);
                console.log(e)
                Alert.alert("Access denied!", errorMessage(e.code));
            })
    }


    return (
        <View style={styles.container}>
            <View style={styles.body}>
                {/* <ScrollView > */}
                <ImageBackground source={require("../../assets/home2.jpg" )} style={{height:180}}>
                    <View style={{ position: "relative" }}>
                        <Pressable onPress={imageModal}>
                            <Image source={require("../../assets/user.png")}
                                style={styles.ProfileImage} />
                        </Pressable>
                        <TouchableOpacity onPress={closeModal} style={[styles.BtnIcon, { right: width / 2 - 60 }]}>
                            <FontAwesomeIcon icon={faCameraRetro} color="#16171D" size={15} />
                        </TouchableOpacity>
                     </View>
                </ImageBackground>

                <ScrollView>
                    <View style={styles.formContainer}>
                        <Text style={styles.signupText}>First Name</Text>
                        <TextInput
                            style={styles.inputStyle}
                            keyboardType="default"
                            placeholder="First name"
                            autoCapitalize="words"
                            mode="outlined"
                            onChangeText={(text) => setfirstname(text.trim())}
                            value={firstname}
                        />

                        <Text style={styles.signupText}>Last Name</Text>
                        <TextInput
                            style={styles.inputStyle}
                            keyboardType="default"
                            placeholder="Last name"
                            mode="outlined"
                            autoCapitalize="words"
                            onChangeText={(text) => setlastname(text.trim())}
                            value={lastname}
                        />

                        <Text style={styles.signupText}>Phone Number</Text>
                        <TextInput
                            style={styles.inputStyle}
                            keyboardType="number-pad"
                            placeholder="Phone"
                            mode="outlined"
                            onChangeText={(text) => setphone(text)}
                            value={phone}
                        />

                        <Text style={styles.signupText}>Address</Text>
                        <TextInput
                            style={styles.inputStyle}
                            keyboardType="default"
                            placeholder="Address"
                            mode="outlined"
                            onChangeText={(text) => setaddress(text)}
                            value={address}
                        />
                        <Text style={styles.signupText}>Email Address</Text>
                        <TextInput
                            style={styles.inputStyle}
                            keyboardType="default"
                            placeholder="Email Address"
                            mode="outlined"
                            value={userInfo.email}
                            editable={false}
                        />
                        <View style={{ marginTop: 10 }}>
                            <AppBotton onPress={updateUser}>Update Profile</AppBotton>
                        </View>
                        {/* ✅ Banner Ad */}
                               {/* ✅ Banner Ad */}
                                           <View style={{ width: "100%" , alignSelf: "center", backgroundColor: "transparent", marginVertical: 3 }}>
                                                               <BannerAd
                                                                 unitId={TestIds.BANNER} 
                                                                 size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                                                                 onAdFailedToLoad={(error) => console.log("Ad failed to load:", error)}
                                                               />
                                                             </View>
                    </View>
                </ScrollView>
            </View>


         
            <Modal
                visible={modalVisibility}
                animationType="slide"
                transparent={true}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <Pressable style={{ flex: 1 }} onPress={closeModal} >
                    </Pressable>
                    <View style={{ backgroundColor: "#16171D", height: 170, borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                        <View style={{ alignItems: "flex-end", margin: 10 }}>
                            <TouchableOpacity onPress={closeModal}>
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    size={24}
                                    color={Theme.colors.primary}
                                />
                            </TouchableOpacity>
                        </View>
                        <View>

                            <TouchableOpacity onPress={() => {
                                closeModal(); picker()
                            }}>
                                <View style={{ margin: 10, marginTop: 0, padding: 5, flexDirection: "row", }}>
                                    <FontAwesomeIcon
                                        icon={faImage}
                                        color={Theme.colors.primary}
                                        size={25}
                                    />
                                    <Text style={{ fontSize: 15, paddingLeft: 5, color: "white" }}>Gallery</Text>
                                </View>
                            </TouchableOpacity>
                            <View
                                style={{
                                    borderBottomColor: Theme.colors.primary,
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                    margin: 10, marginTop: 0
                                }}
                            />
                            <TouchableOpacity onPress={() => {
                                closeModal()
                            }}>
                                <View style={{ margin: 10, marginTop: 0, padding: 5, flexDirection: "row" }}>
                                    <FontAwesomeIcon
                                        icon={faCameraRetro}
                                        color={Theme.colors.primary}
                                        size={25}
                                    />
                                    <Text style={{ fontSize: 15, paddingLeft: 5, color: "white" }}>
                                        Camera
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>
            </Modal>

            {/* <====================> Preview Image before Uploading <====================> */}
            <Modal
                visible={preVisibility}
                transparent={true}
            >
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <Pressable style={{ flex: 1 }} onPress={previewModal} >
                    </Pressable>
                    <View style={{ backgroundColor: "#16171D", height: 500, borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                        <View style={{ alignItems: "flex-end", margin: 10 }}>
                            <TouchableOpacity onPress={previewModal}>
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    size={24}
                                    color="grey"
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "center", padding: 5, justifyContent: "center" }}>
                            <Image source={{ uri: image }} style={{ width: 300, height: 300, borderRadius: 400, }} />
                        </View>
                        <TouchableOpacity onPress={() => { previewModal(); }}
                            style={[styles.getStarted, { marginHorizontal: 10 }]}>
                            <Text style={{ fontFamily: Theme.fonts.text500, fontSize: 16, }}>Upload Image</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ============================> Profile Modal <============================ */}
            <Modal
                visible={imageMD}
                animationType="slide"
                transparent={true}
            >
                <View style={{ flex: 1, backgroundColor: "#16171df4" }}>
                    <Pressable style={{ flex: 1 }} onPress={imageModal} >
                    </Pressable>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Image source={require("../../assets/user.png")}
                            style={{ width: width - 5, height: width - 5 }}
                        />
                    </View>
                    <Pressable style={{ flex: 1 }} onPress={imageModal} >
                    </Pressable>
                </View>
            </Modal>
        </View >
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.lightGreen,
    },
    body: {
        flex: 1,
        marginHorizontal: 12,
    },
    ProfileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: Theme.colors.primary,
        borderWidth: 2,
        alignSelf: "center",
        marginTop: 10,
    },
    BtnIcon: {
        backgroundColor: Theme.colors.primary,
        padding: 8,
        borderRadius: 50,
        position: "absolute",
        bottom: 0,
        
        zIndex: 10,
        elevation: 4,
    },
    formContainer: {
        padding: 15,
        marginTop: 20,
        backgroundColor: "#ffffff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    signupText: {
        color: "#434355",
        marginBottom: 6,
        fontSize: 16,
        fontWeight: "600",
    },
    inputStyle: {
        borderColor: "#ccc",
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    getStarted: {
        backgroundColor: Theme.colors.primary,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginTop: 20,
    },
    header: {
        position: "relative",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 15,
        backgroundColor: Theme.colors.green,
        padding: 10,
        borderRadius: 8,
    },
    calenderIcon: {
        backgroundColor: Theme.colors.primary,
        position: "absolute",
        padding: 8,
        top: 4,
        right: 4,
        borderRadius: 90,
    },
    login: {
        flexDirection: "row",
    },
    terms: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center",
    },
    errorMessage: {
        color: "red",
    },
    textBelow: {
        alignItems: "center",
    },
});
