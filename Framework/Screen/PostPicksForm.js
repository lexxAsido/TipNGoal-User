import React, { useContext, useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,} from 'react-native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../Firebase/Settings';
import { AppContext } from '../Components/globalVariables';
import { Theme } from '../Components/Theme';

export default function PostPicksForm({ navigation }) {
  const [leagueName, setLeagueName] = useState('');
  const [match, setMatch] = useState('');
  const [prediction, setPrediction] = useState('');
  const { setPreloader, userUID } = useContext(AppContext);

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
      // navigation.navigate('TipNGoal');
    } catch (error) {
      console.error("Error posting pick: ", error.message);
      setPreloader(false);
      Alert.alert('Error', 'Failed to post games.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post Your Picks</Text>

      {/* League Name */}
      <TextInput
        style={styles.input}
        placeholder="League Name"
        placeholderTextColor="#888"
        value={leagueName}
        onChangeText={setLeagueName}
      />

      {/* Match */}
      <TextInput
        style={styles.input}
        placeholder="Match"
        placeholderTextColor="#888"
        value={match}
        onChangeText={setMatch}
      />

      {/* Prediction */}
      <TextInput
        style={styles.input}
        placeholder="Prediction"
        placeholderTextColor="#888"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Theme.colors.lightGreen,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
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
