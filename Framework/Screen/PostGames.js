import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Theme } from '../Components/Theme';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../Firebase/Settings';
import { AppContext } from '../Components/globalVariables';
import PostPicksForm from './PostPicksForm';
import PostArticleForm from '../Components/PostArticleForm';
import { ThemeContext } from '../Context/ThemeContext';

export default function PostBetForm({ navigation }) {
  const [punterName, setPunterName] = useState('');
  const [betCodes, setBetCodes] = useState('');
  const [odds, setOdds] = useState('');
  const [betCompany, setBetCompany] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const { setPreloader, userUID } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);

  // Bookies data
  const bookies = useMemo(() => [
    { id: 1, name: 'SportyBet', image: require('../../assets/sporty.jpg') },
    { id: 2, name: 'BetKing', image: require('../../assets/betKing.png') },
    { id: 3, name: 'Betano', image: require('../../assets/betano.png') },
    { id: 4, name: 'Bet9ja', image: require('../../assets/bet9ja.png') },
    { id: 5, name: 'Stake', image: require('../../assets/stake.jpg') },
    { id: 6, name: 'Betway', image: require('../../assets/betway.png') },
  ], []);

  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#121212' : '#ffffff',
    text: isDark ? '#f5f5f5' : '#0b0c0c',
    subText: isDark ? '#b3b3b3' : '#555',
    inputBg: isDark ? '#1E1E1E' : '#fff',
    border: isDark ? '#333' : '#ccc',
    modalBg: isDark ? '#2a2a2a' : '#fff',
  };

  const handleGames = async () => {
    if (!punterName || !betCodes || !betCompany || !odds) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    if (isNaN(odds)) {
      Alert.alert('Error', 'Odds must be a number');
      return;
    }

    setPreloader(true);
    try {
      await addDoc(collection(db, 'games'), {
        punterName,
        betCodes,
        odds,
        betCompany,
        userId: userUID,
        createdAt: Timestamp.fromDate(new Date()),
      });
      setPreloader(false);
      Alert.alert('Success', 'Your bet has been posted!');
      setPunterName('');
      setBetCodes('');
      setBetCompany('');
      setOdds('');
      navigation.navigate('TipNGoal');
    } catch (error) {
      console.error(error);
      setPreloader(false);
      Alert.alert('Error', 'Failed to post games.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.bg }]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginTop: 40, marginHorizontal: 20 }}>
            <Text style={[styles.title, { color: colors.text }]}>
              Post Your Sure Games
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter Punter Name"
              placeholderTextColor={colors.subText}
              value={punterName}
              onChangeText={setPunterName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              placeholder="Enter Bet Codes"
              placeholderTextColor={colors.subText}
              value={betCodes}
              onChangeText={setBetCodes}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              placeholder="Total Odds"
              placeholderTextColor={colors.subText}
              value={odds}
              onChangeText={setOdds}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[styles.selectInput, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.selectText, { color: betCompany ? colors.text : colors.subText }]}>
                {betCompany || 'Select Bookie'}
              </Text>
            </TouchableOpacity>

            {/* MODAL */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                  <View style={[styles.modalContent, { backgroundColor: colors.modalBg }]}>
                    <FlatList
                      data={bookies}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[styles.modalItem, { borderBottomColor: colors.border }]}
                          onPress={() => {
                            setBetCompany(item.name);
                            setModalVisible(false);
                          }}
                        >
                          <Image source={item.image} style={styles.bookieImage} />
                          <Text style={[styles.modalText, { color: colors.text }]}>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

            <TouchableOpacity style={styles.button} onPress={handleGames}>
              <Text style={styles.buttonText}>Post Games</Text>
            </TouchableOpacity>
          </View>

          {/* Extra Forms */}
          <PostPicksForm />
          <PostArticleForm />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ✅ Optimized shared styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 20,
    borderBottomColor: Theme.colors.green,
    borderBottomWidth: 4,
    textAlign: 'center',
    marginTop:20
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  selectInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 15,
  },
  selectText: { fontSize: 16 },
  button: { marginTop: 10 },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#1dbf73',
    paddingVertical: 15,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000066',
  },
  modalContent: {
    width: '80%',
    borderRadius: 8,
    padding: 20,
    maxHeight: '60%',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  bookieImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 15,
    resizeMode: 'contain',
  },
  modalText: { fontSize: 18 },
});
