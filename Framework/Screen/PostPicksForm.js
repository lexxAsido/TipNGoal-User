import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../Firebase/Settings';
import { AppContext } from '../Components/globalVariables';
import { Theme } from '../Components/Theme';
import { ThemeContext } from '../Context/ThemeContext'; // ✅ Add this

export default function PostPicksForm({ navigation }) {
  const [leagueName, setLeagueName] = useState('');
  const [match, setMatch] = useState('');
  const [prediction, setPrediction] = useState('');
  const { setPreloader, userUID } = useContext(AppContext);
  const { theme } = useContext(ThemeContext); // ✅ Access current theme

  // ✅ Dark mode color scheme
  const isDark = theme === 'dark';
  const colors = {
    background: isDark ? '#121212' : '#ffffff',
    text: isDark ? '#f5f5f5' : '#333',
    subText: isDark ? '#aaaaaa' : '#888',
    inputBg: isDark ? '#1E1E1E' : '#fff',
    border: isDark ? '#333' : '#ccc',
  };

  const handlePicks = async () => {
    if (!leagueName || !match || !prediction) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    setPreloader(true);
    try {
      await addDoc(collection(db, 'picks'), {
        leagueName,
        match,
        prediction,
        userId: userUID,
        created: Timestamp.fromDate(new Date()),
      });
      setPreloader(false);
      Alert.alert('Success', 'Your pick has been posted!');
      setLeagueName('');
      setMatch('');
      setPrediction('');
    } catch (error) {
      console.error('Error posting pick: ', error.message);
      setPreloader(false);
      Alert.alert('Error', 'Failed to post games.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Post Your Picks</Text>

      {/* League Name */}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
        ]}
        placeholder="League Name"
        placeholderTextColor={colors.subText}
        value={leagueName}
        onChangeText={setLeagueName}
      />

      {/* Match */}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
        ]}
        placeholder="Match"
        placeholderTextColor={colors.subText}
        value={match}
        onChangeText={setMatch}
      />

      {/* Prediction */}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
        ]}
        placeholder="Prediction"
        placeholderTextColor={colors.subText}
        value={prediction}
        onChangeText={setPrediction}
      />

      {/* Post Picks Button */}
      <TouchableOpacity style={styles.button} onPress={handlePicks}>
        <Text style={styles.buttonText}>Post Picks</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ Styles remain consistent
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 20,
    borderBottomColor: Theme.colors.green,
    borderBottomWidth: 4,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1dbf73',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
