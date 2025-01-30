import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../Components/globalVariables';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../Components/Theme';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/Settings';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from 'react-native-paper';



export function Tipngoal() {
  const [predictions, setPredictions] = useState([]);
  const [picks, setPicks] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [filteredPicks, setFilteredPicks] = useState([]);
  const { preloader, setPreloader } = useContext(AppContext);

  const today = moment().startOf('day');
  const yesterday = moment(today).subtract(1, 'day');
  const before = moment(today).subtract(2, 'day');


  const updateOutcome = async (id, outcome) => {
    try {
      const pickRef = doc(db, 'picks', id);
      await updateDoc(pickRef, { Outcome: outcome });
      Alert.alert('Success', `Outcome set to ${outcome}`);
    } catch (error) {
      console.error('Error updating outcome: ', error);
      Alert.alert('Error', 'Failed to update outcome.');
    }
  };

  const updateGamesOutcome = async (id, outcome) => {
    try {
      const gameRef = doc(db, 'games', id);
      await updateDoc(gameRef, { Outcome: outcome });
      Alert.alert('Success', `Game outcome set to ${outcome}`);
    } catch (error) {
      console.error('Error updating game outcome:', error);
      Alert.alert('Error', 'Failed to update game outcome.');
    }
  };
  useEffect(() => {
    setPreloader(true);

    const unsubscribePredictions = onSnapshot(
      collection(db, 'games'),
      (snapshot) => {
        const games = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }));
        setPredictions(games);
      }
    );

    const unsubscribePicks = onSnapshot(
      collection(db, 'picks'),
      (snapshot) => {
        const picksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created: doc.data().created?.toDate(),
        }));
        setPicks(picksData);
      }
    );

    setPreloader(false);

    return () => {
      unsubscribePredictions();
      unsubscribePicks();
    };
  }, [setPreloader]);

  const filterDataByDate = (date) => {
    const filteredPreds = predictions.filter((item) =>
      moment(item.createdAt).isSame(date, 'day')
    );
    const filteredPickItems = picks.filter((item) =>
      moment(item.created).isSame(date, 'day')
    );
    setFilteredPredictions(filteredPreds);
    setFilteredPicks(filteredPickItems);
  };

  const renderItem = ({ item, type }) => (
    <View style={styles.card}>
      {type === 'predictions' ? (
        <>
          <Text style={styles.punterName}>Punter: {item.punterName}</Text>
          <Text style={styles.match}>Bet Codes: {item.betCodes}</Text>
          <Text style={styles.prediction}>Odds: {item.odds}</Text>
          <Text style={styles.date}>Bookies: {item.betCompany}</Text>
          <View style={styles.iconContainer}>
            {item.Outcome === 'Win' ? (
              <FontAwesome name="check-circle" size={24} color="green" />
            ) : item.Outcome === 'Lose' ? (
              <FontAwesome name="times-circle" size={24} color="red" />
            ) : (
              <Text style={styles.noOutcome}>Outcome: Pending</Text>
            )}
          </View>

        </>
      ) : (
        <>
          <Text style={styles.leagueName}>League: {item.leagueName}</Text>
          <Text style={styles.match}>Match: {item.match}</Text>
          <Text style={styles.prediction}>Prediction: {item.prediction}</Text>
          <View style={styles.iconContainer}>
            {item.Outcome === 'Win' ? (
              <FontAwesome name="check-circle" size={24} color="green" />
            ) : item.Outcome === 'Lose' ? (
              <FontAwesome name="times-circle" size={24} color="red" />
            ) : (
              <Text style={styles.noOutcome}>Outcome: Pending</Text>
            )}
          </View>

        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>TipNGoal Games</Text>
        <View style={styles.dateFilterContainer}>

          <Animatable.View animation="pulse" iterationCount="infinite">
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => filterDataByDate(before)}>
                 <FontAwesome name="calendar" size={13} color="green" />
              <Text style={styles.dateButtonText}>
                {before.format('D MMM YYYY')}
              </Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View animation="pulse" iterationCount="infinite">
            <TouchableOpacity style={styles.dateButton} onPress={() => filterDataByDate(yesterday)}>
            <FontAwesome name="calendar" size={13} color="green" />
              <Text style={styles.dateButtonText}>{yesterday.format('D MMM YYYY')}</Text>
            </TouchableOpacity>
              

          </Animatable.View>

          <Animatable.View animation="pulse" iterationCount="infinite">

            <TouchableOpacity style={styles.dateButton} onPress={() => filterDataByDate(today)}>
            <FontAwesome name="calendar" size={13} color="green" />
              <Text style={styles.dateButtonText}>{today.format('D MMM YYYY')}</Text>
            </TouchableOpacity>

          
          </Animatable.View>
        </View>

        {preloader ? (
          <ActivityIndicator size="large" color={Theme.colors.green} />
        ) : (
          <FlatList
            data={[...filteredPredictions, ...filteredPicks]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              item.punterName
                ? renderItem({ item, type: 'predictions' })
                : renderItem({ item, type: 'picks' })
            }
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: Theme.colors.lightGreen,padding: 10,},
  title: {fontSize: 24,fontWeight: 'bold',textAlign: 'center',marginVertical: 10,backgroundColor: Theme.colors.green,paddingVertical: 4,borderWidth:2, borderColor:"#101110"},
  dateFilterContainer: {flexDirection: 'row',justifyContent: 'space-around',marginVertical: 10,},
  dateButton: {padding: 10,borderRadius: 5,borderWidth:1, borderColor:"#4caf50", flexDirection:"row", gap:3, alignItems:"center" },
  dateButtonText: {color: Theme.colors.black,},
  list: {paddingBottom: 20,},
  card: {backgroundColor: '#ffffff',borderRadius: 10,padding: 15,marginBottom: 10,elevation: 3,shadowColor: '#000000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 4,},
  punterName: {fontSize: 18,fontWeight: 'bold',color: '#4caf50',},
  leagueName: {fontSize: 18,fontFamily: Theme.fonts.text800,color: '#4caf50',},
  match: {fontSize: 16,color: '#151615',marginTop: 5,fontWeight: 'bold',},
  prediction: {fontSize: 16,color: '#151615',marginTop: 5,fontFamily: Theme.fonts.text600,},
  date: {fontSize: 14,color: '#777',marginTop: 5,},
  updateButton: {backgroundColor: "#1dbf73",padding: 10,borderRadius: 8,marginTop: 10,},
  updateButtonText: {color: "#fff",fontWeight: "bold",textAlign: "center",},
  iconContainer: {flexDirection: 'row',alignItems: 'center',marginVertical: 10,},
  noOutcome: {fontSize: 14,color: '#777',},
});
