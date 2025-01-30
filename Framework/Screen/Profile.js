import React, { useContext, useState } from 'react';
import { Image, Modal, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Theme } from '../Components/Theme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight, faUserCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { AppBotton } from '../Components/AppButton';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppContext } from '../Components/globalVariables';
import { deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../Firebase/Settings';
import { deleteUser } from 'firebase/auth';



export default function Profile({navigation}) {
  const { userInfo, setPreloader } = useContext(AppContext);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);

  const closeModal = () => {setModalVisibility(!modalVisibility);};

  const closeDeleteModal = () => {
    setDeleteModalVisibility(!deleteModalVisibility);
  };

  const handleAccountDeletion = async () => {
    setPreloader(true);
    try {
      const user = auth.currentUser;
      if (user) {
        
        await deleteDoc(doc(db, 'users', user.uid));
      
        await deleteUser(user);
        setPreloader(false);
        navigation.replace('Intro');
      }
    } catch (error) {
      setPreloader(false);
      console.error('Error deleting account:', error);
    }
  };

  function logout() {
      setPreloader(true);
      setTimeout(() => {
          setPreloader(false);
          navigation.replace("Intro");
      }, 3000);
  }

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.lightGreen, marginTop:10 }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={{ flexDirection: "row", gap: 20, justifyContent: "center", backgroundColor: Theme.colors.light.bg2, padding: 10, borderColor: Theme.colors.black, borderWidth: 3, borderRadius:10 }}>
            <Image
              style={{ width: 70, height: 70, borderRadius: 50, borderColor:Theme.colors.black, borderWidth:4}}
              source={require("../../assets/avatar.jpg")}
            />
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 22, fontFamily: Theme.fonts.text700, color: Theme.colors.black }}>{userInfo.firstname} {userInfo?.lastname}</Text>
              <Text style={{ fontSize: 15, fontFamily: Theme.fonts.text400, color: Theme.colors.black }}>{userInfo?.email}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("EditProfile")}
                style={{ borderColor: Theme.colors.black, backgroundColor: Theme.colors.green, borderWidth: 1, padding: 5, paddingHorizontal: 10, borderRadius: 100, width: 130, height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                <FontAwesomeIcon icon={faUserCircle} color={Theme.colors.black} />
                <Text style={{ fontSize: 13, alignItems: 'center', fontWeight: 'bold', marginLeft: 5, color: Theme.colors.black }}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

            <View style={{marginTop:60}}>

                          <TouchableOpacity onPress={() => navigation.navigate("Web", { uri: "https://tip-n-goal-web.vercel.app/about" })} style={styles.ProfileBtn}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <AntDesign name="user" size={24} style={{ paddingRight: 10, color: Theme.colors.light.text2 }} />
                                <Text style={{ fontFamily: Theme.fonts.text500, fontSize: 16 }}>About Us</Text>
                            </View>
                            <FontAwesomeIcon icon={faAngleRight} size={20} color={Theme.colors.light.text2} />
                        </TouchableOpacity>

                          <TouchableOpacity onPress={() => navigation.navigate("Web", { uri: "https://tip-n-goal-web.vercel.app/contact" })} style={styles.ProfileBtn}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <AntDesign name="message1" size={24} style={{ paddingRight: 10, color: Theme.colors.light.text2 }} />
                                <Text style={{ fontFamily: Theme.fonts.text500, fontSize: 16 }}>Help & Feedback</Text>
                            </View>
                            <FontAwesomeIcon icon={faAngleRight} size={20} color={Theme.colors.light.text2} />
                        </TouchableOpacity>


                        <TouchableOpacity onPress={() => navigation.navigate("Web", { uri: "https://tip-n-goal-web.vercel.app/terms" })}  style={styles.ProfileBtn}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <MaterialCommunityIcons name='format-list-text' size={24} style={{ paddingRight: 10, color: Theme.colors.light.text2 }} />
                                <Text style={{ fontFamily: Theme.fonts.text500, fontSize: 16 }}>Terms of Use</Text>
                            </View>
                            <FontAwesomeIcon icon={faAngleRight} size={20} color={Theme.colors.light.text2} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("Web", { uri: "https://tip-n-goal-web.vercel.app/privacy" })} style={styles.ProfileBtn}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <AntDesign name="Safety" size={24} style={{ paddingRight: 10, color: Theme.colors.light.text2 }} />
                                <Text style={{ fontFamily: Theme.fonts.text500, fontSize: 16 }}>Privacy Policy</Text>
                            </View>
                            <FontAwesomeIcon icon={faAngleRight} size={20} color={Theme.colors.light.text2} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.ProfileBtn}
                        onPress={() => setDeleteModalVisibility(true)}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Ionicons name='trash-outline' size={24} style={{ paddingRight: 10, color: Theme.colors.red, }} />
                                <Text style={{ fontFamily: Theme.fonts.text500, fontSize: 16, color: Theme.colors.red, }}>Delete Account</Text>
                            </View>
                            <FontAwesomeIcon icon={faAngleRight} size={20} color={Theme.colors.light.text2} />
                        </TouchableOpacity>
                        <Modal
        visible={deleteModalVisibility}
        animationType="slide"
        transparent={true}
      >
        <View style={{ flex: 1, backgroundColor: '#db0b1d59' }}>
          <Pressable style={{ flex: 1 }} onPress={closeDeleteModal} />
          <View
            style={{
              height: 200,
              backgroundColor: Theme.colors.red,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              // margin:10,
            }}
          >
            <View style={{ alignItems: 'flex-end', margin: 10 }}>
              <TouchableOpacity onPress={closeDeleteModal}>
                <FontAwesomeIcon icon={faXmark} size={24} color={Theme.colors.light.bg2} />
              </TouchableOpacity>
            </View>
            <View>
              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontFamily: Theme.fonts.text700, color: Theme.colors.light.bg1, textAlign:"center", paddingHorizontal:8, }}>Your account will be deleted permanently! Is that okay?</Text>
              </View>
              <View style={{ marginTop: 20, margin: 15 }}>
                <Text
                  onPress={handleAccountDeletion}
                  style={{
                    borderColor: Theme.colors.black,
                    backgroundColor: Theme.colors.light.bg2,
                    borderWidth: 2,
                    color: Theme.colors.red,
                    textAlign:"center",
                    fontSize:20,
                    fontFamily:Theme.fonts.text700,
                    paddingVertical:5
                  }}>
                  Yes, Delete
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

            </View>
      </ScrollView>
  


      <View style={styles.signOutContainer}>
        <AppBotton onPress={closeModal} style={{ borderColor: Theme.colors.green, backgroundColor: "white", borderWidth: 2 }}>Sign Out</AppBotton>
        <Text style={{ fontSize: 13, color: Theme.colors.black, fontFamily: Theme.fonts.text800, textAlign: "center", marginTop: 10 }}>TipNGoal Version: v1.0.1</Text>
      </View>

      <Modal
        visible={modalVisibility}
        animationType="slide"
        transparent={true}>
        <View style={{ flex: 1, backgroundColor: "#0e0f0e59" }}>
          <Pressable style={{ flex: 1 }} onPress={closeModal} />
          <View style={{ height: 200, backgroundColor: Theme.colors.black, borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
            <View style={{ alignItems: 'flex-end', margin: 10 }}>
              <TouchableOpacity onPress={closeModal}>
                <FontAwesomeIcon icon={faXmark} size={24} color={Theme.colors.light.bg2} />
              </TouchableOpacity>
            </View>
            <View>
              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 16, fontFamily: Theme.fonts.text400, color: Theme.colors.light.bg2 }}>Are you sure you want to log out?</Text>
              </View>
              <View style={{ marginTop: 20, margin: 15 }}>
                <AppBotton onPress={() => { closeModal(); logout(); }} style={{ borderColor: Theme.colors.green, backgroundColor: Theme.colors.light.bg2, borderWidth: 2 }} textColor={Theme.colors.red}>
                  Yes, Sign Out
                </AppBotton>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,padding: 20,marginTop: 30,},
  ProfileBtn: {padding: 10,flexDirection: 'row',alignItems: 'center',justifyContent: "space-between",borderRadius: 10,marginBottom: 10,borderColor: Theme.colors.green,borderBottomWidth: 1},
  signOutContainer: {position: "absolute",bottom: 20,left: 0,right: 0,paddingHorizontal: 20,},
});
