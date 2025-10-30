import React, { useContext, useState } from 'react';
import {
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faSun,
  faMoon,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from '@expo/vector-icons';
import { AppContext } from '../Components/globalVariables';
import { deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../Firebase/Settings';
import { deleteUser } from 'firebase/auth';
import { getInitials } from '../../utils/getInitials';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { ThemeContext } from '../Context/ThemeContext';
import { AppBotton } from '../Components/AppButton';
import { Theme } from '../Components/Theme';

// ✅ AdMob IDs (auto switch between dev and prod)
const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy'; 
export default function Profile({ navigation }) {
  const { userInfo, setPreloader } = useContext(AppContext);
  const [modalVisibility, setModalVisibility] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const closeModal = () => setModalVisibility(!modalVisibility);

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

  const logout = () => {
    setPreloader(true);
    setTimeout(() => {
      setPreloader(false);
      navigation.replace('Onboarding');
    }, 3000);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme === 'dark' ? '#121212' : '#fff',
        // marginTop: 10,
      }}>
      <ScrollView
       
        showsVerticalScrollIndicator={false}>

        {/* ✅ User Info */}
        <View style={styles.container}>
          <View
            style={[
              styles.userInfo,
              {
                backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F0F0F0',
              },
            ]}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: theme === 'dark' ? '#00A86B' : '#000',
                },
              ]}>
              <Text style={styles.avatarText}>
                {getInitials(`${userInfo?.firstname} ${userInfo?.lastname}`)}
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: Theme.fonts.text700,
                  color: theme === 'dark' ? '#fff' : '#000',
                }}>
                {userInfo.firstname} {userInfo?.lastname}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: Theme.fonts.text400,
                  color: theme === 'dark' ? '#bbb' : '#555',
                }}>
                {userInfo?.email}
              </Text>
            </View>
          </View>
        </View>

        {/* ✅ Banner Ad */}
        <View style={{ alignItems: 'center' }}>
          <BannerAd
            unitId={BANNER_ID}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            onAdFailedToLoad={(error) => console.log('Ad failed to load:', error)}
          />
        </View>

        {/* ✅ Settings Cards */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F9F9F9',
            },
          ]}>
          {/* About */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Web', { uri: 'https://tip-n-goal-web.vercel.app/about' })
            }
            style={[styles.ProfileBtn, { borderBottomColor: theme === 'dark' ? '#333' : '#ccc' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign
                name="exclamation-circle"
                size={24}
                style={{ paddingRight: 10, color: theme === 'dark' ? '#fff' : '#000' }}
              />
              <Text
                style={{
                  fontFamily: Theme.fonts.text500,
                  fontSize: 16,
                  color: theme === 'dark' ? '#fff' : '#000',
                }}>
                About Us
              </Text>
            </View>
          </TouchableOpacity>

          {/* Help */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Web', { uri: 'https://tip-n-goal-web.vercel.app/contact' })
            }
            style={[styles.ProfileBtn, { borderBottomColor: theme === 'dark' ? '#333' : '#ccc' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Entypo
                name="help-with-circle"
                size={24}
                style={{ paddingRight: 10, color: theme === 'dark' ? '#fff' : '#000' }}
              />
              <Text
                style={{
                  fontFamily: Theme.fonts.text500,
                  fontSize: 16,
                  color: theme === 'dark' ? '#fff' : '#000',
                }}>
                Help & Feedback
              </Text>
            </View>
          </TouchableOpacity>

          {/* Terms */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Web', { uri: 'https://tip-n-goal-web.vercel.app/terms' })
            }
            style={[styles.ProfileBtn, { borderBottomColor: theme === 'dark' ? '#333' : '#ccc' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="format-list-text"
                size={24}
                style={{ paddingRight: 10, color: theme === 'dark' ? '#fff' : '#000' }}
              />
              <Text
                style={{
                  fontFamily: Theme.fonts.text500,
                  fontSize: 16,
                  color: theme === 'dark' ? '#fff' : '#000',
                }}>
                Terms of Use
              </Text>
            </View>
          </TouchableOpacity>

          {/* Privacy */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Web', { uri: 'https://tip-n-goal-web.vercel.app/privacy' })
            }
            style={[styles.ProfileBtn, { borderBottomColor: theme === 'dark' ? '#333' : '#ccc' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons
                name="policy"
                size={24}
                style={{ paddingRight: 10, color: theme === 'dark' ? '#fff' : '#000' }}
              />
              <Text
                style={{
                  fontFamily: Theme.fonts.text500,
                  fontSize: 16,
                  color: theme === 'dark' ? '#fff' : '#000',
                }}>
                Privacy Policy
              </Text>
            </View>
          </TouchableOpacity>

          {/* ✅ Dark Mode Toggle */}
          <TouchableOpacity
            style={[styles.ProfileBtn, { borderBottomColor: theme === 'dark' ? '#333' : '#ccc' }]}
            onPress={toggleTheme}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap:10 }}>
              <FontAwesomeIcon
                icon={theme === 'dark' ? faSun : faMoon}
                size={22}
                color="#00A86B"
                style={{ paddingRight: 10 }}
              />
              <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ Sign Out */}
      <View style={styles.signOutContainer}>
        <TouchableOpacity
          onPress={closeModal}
          style={{
            borderColor: theme === 'dark' ? '#fff' : '#000',
            backgroundColor: theme === 'dark' ? '#00A86B' : '#fff',
            borderWidth: 2,
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: 'center',
          }}>
          <Text style={{ color: theme === 'dark' ? '#fff' : '#000', fontWeight: '600' }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Logout Modal */}
      <Modal visible={modalVisibility} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: '#0e0f0e59' }}>
          <Pressable style={{ flex: 1 }} onPress={closeModal} />
          <View
            style={{
              height: 200,
              backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}>
            <View style={{ alignItems: 'flex-end', margin: 10 }}>
              <TouchableOpacity onPress={closeModal}>
                <FontAwesomeIcon icon={faXmark} size={24} color={theme === 'dark' ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Theme.fonts.text400,
                  color: theme === 'dark' ? '#fff' : '#000',
                }}>
                Are you sure you want to log out?
              </Text>
            </View>
            <View style={{ marginTop: 20, margin: 15 }}>
              <AppBotton
                onPress={() => {
                  closeModal();
                  logout();
                }}
                style={{
                  borderColor: '#00A86B',
                  backgroundColor: theme === 'dark' ? '#fff' : '#00A86B',
                  borderWidth: 2,
                }}
                textColor={theme === 'dark' ? '#000' : '#fff'}>
                Yes, Sign Out
              </AppBotton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 30 },
  ProfileBtn: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  signOutContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontFamily: Theme.fonts.text900,
  },
  userInfo: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 10,
    marginHorizontal: 14,
  },
});
