import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/Settings';
import { Theme } from '../Components/Theme';
import moment from 'moment';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useIsFocused } from '@react-navigation/native';
import { AppContext } from '../Components/globalVariables';
import { ThemeContext } from '../Context/ThemeContext';

// ✅ AdMob Banner ID
const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with your real banner ID

export function Tipngoal() {
  const [predictions, setPredictions] = useState([]);
  const [picks, setPicks] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [filteredPicks, setFilteredPicks] = useState([]);

  const { preloader, setPreloader, userInfo } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const isFocused = useIsFocused();

  const today = moment().startOf('day');
  const yesterday = moment(today).subtract(1, 'day');

  const bookies = useMemo(
    () => [
      { name: 'SportyBet', image: require('../../assets/sporty.jpg') },
      { name: 'BetKing', image: require('../../assets/betKing.png') },
      { name: 'Betano', image: require('../../assets/betano.png') },
      { name: 'Bet9ja', image: require('../../assets/bet9ja.png') },
      { name: 'Stake', image: require('../../assets/stake.jpg') },
      { name: 'Betway', image: require('../../assets/betway.png') },
    ],
    []
  );

  // 🔁 Fetch data from Firestore (runs on mount & when screen refocuses)
  const fetchData = useCallback(() => {
    setPreloader(true);
    const unsubGames = onSnapshot(collection(db, 'games'), (snap) => {
      setPredictions(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate(),
        }))
      );
    });

    const unsubPicks = onSnapshot(collection(db, 'picks'), (snap) => {
      setPicks(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          created: d.data().created?.toDate(),
        }))
      );
    });

    setPreloader(false);
    return () => {
      unsubGames();
      unsubPicks();
    };
  }, [setPreloader]);

  // ⏳ Run fetch when mounted & when focused again
  useEffect(() => {
    if (isFocused) {
      const unsub = fetchData();
      return () => unsub && unsub();
    }
  }, [isFocused, fetchData]);

  // 🧭 Track selected date state
const [selectedDate, setSelectedDate] = useState(today);

// 🔁 Filter by selected date
const filterDataByDate = useCallback(
  (date) => {
    setSelectedDate(date);
    const filteredPreds = predictions.filter((item) =>
      moment(item.createdAt).isSame(date, 'day')
    );
    const filteredPickItems = picks.filter((item) =>
      moment(item.created).isSame(date, 'day')
    );
    setFilteredPredictions(filteredPreds);
    setFilteredPicks(filteredPickItems);
  },
  [predictions, picks]
);

// ⚡ Automatically show today’s data when loaded
useEffect(() => {
  filterDataByDate(selectedDate);
}, [predictions, picks, selectedDate, filterDataByDate]);

  // ✅ Update match outcome
  const updateOutcome = async (id, outcome, collectionName) => {
    if (userInfo?.role !== 'admin') {
      Alert.alert('Access Denied', 'Only admins can update outcomes.');
      return;
    }
    try {
      const ref = doc(db, collectionName, id);
      await updateDoc(ref, { Outcome: outcome });
      Alert.alert('✅ Success', `Outcome set to ${outcome}`);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to update outcome.');
    }
  };

  // 🎨 Dynamic theme
  const stylesDynamic = useMemo(
    () => ({
      bg: { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
      card: { backgroundColor: isDark ? '#2A2A2A' : '#F6F6F6' },
      text: { color: isDark ? '#EDEDED' : '#171717' },
      subText: { color: isDark ? '#AAAAAA' : '#555555' },
      border: { borderColor: isDark ? '#444' : '#4caf50' },
    }),
    [isDark]
  );

  const renderCard = ({ item, type }) => {
    const bookie = bookies.find(
      (b) => b.name.toLowerCase() === item.betCompany?.toLowerCase()
    );

    return (
      <View style={[styles.card, stylesDynamic.card]}>
        {type === 'predictions' ? (
          <>
            <View style={styles.rowBetween}>
              <View style={styles.rowCenter}>
                <FontAwesome name="user" size={20} color="#4caf50" />
                <Text style={[styles.punterName, stylesDynamic.text]}>
                  {item.punterName}
                </Text>
              </View>
              {bookie ? (
                <Image
                  source={bookie.image}
                  style={styles.bookieLogo}
                  resizeMode="contain"
                />
              ) : (
                <Text style={[styles.sub, stylesDynamic.subText]}>
                  {item.betCompany}
                </Text>
              )}
            </View>

            <View style={styles.rowCenter}>
              <MaterialCommunityIcons
                name="ticket-confirmation-outline"
                size={20}
                color={isDark ? '#fff' : '#000'}
              />
              <Text style={[styles.match, stylesDynamic.text]}>
                {item.betCodes}
              </Text>
            </View>

            <View style={styles.rowBetween}>
              <Text style={[styles.prediction, stylesDynamic.subText]}>
                {item.odds} odds
              </Text>
              <View style={styles.rowCenter}>
                <Text style={[styles.outcomeLabel, stylesDynamic.subText]}>
                  Outcome:{' '}
                </Text>
                {item.Outcome === 'Win' ? (
                  <FontAwesome name="check-circle" size={22} color="green" />
                ) : item.Outcome === 'Lose' ? (
                  <FontAwesome name="times-circle" size={22} color="red" />
                ) : (
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={26}
                    color="#F8BD00"
                  />
                )}
              </View>
            </View>

            {userInfo?.role === 'admin' && (
              <>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => updateOutcome(item.id, 'Win', 'games')}
                >
                  <Text style={styles.updateButtonText}>Set Outcome to Win</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => updateOutcome(item.id, 'Lose', 'games')}
                >
                  <Text style={styles.updateButtonText}>Set Outcome to Lose</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        ) : (
          <>
            <View style={styles.rowCenter}>
              <Ionicons name="football" size={20} color="#4caf50" />
              <Text style={[styles.leagueName, stylesDynamic.text]}>
                {item.leagueName}
              </Text>
            </View>
            <View style={styles.rowCenter}>
              <MaterialCommunityIcons
                name="soccer-field"
                size={22}
                color={isDark ? '#fff' : '#000'}
              />
              <Text style={[styles.match, stylesDynamic.text]}>
                {item.match}
              </Text>
            </View>

            <View style={styles.rowBetween}>
              <Text style={[styles.prediction, stylesDynamic.subText]}>
                Prediction: {item.prediction}
              </Text>
              <View style={styles.rowCenter}>
                <Text style={[styles.outcomeLabel, stylesDynamic.subText]}>
                  Outcome:{' '}
                </Text>
                {item.Outcome === 'Win' ? (
                  <FontAwesome name="check-circle" size={22} color="green" />
                ) : item.Outcome === 'Lose' ? (
                  <FontAwesome name="times-circle" size={22} color="red" />
                ) : (
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={26}
                    color="#F8BD00"
                  />
                )}
              </View>
            </View>

            {userInfo?.role === 'admin' && (
              <>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => updateOutcome(item.id, 'Win', 'picks')}
                >
                  <Text style={styles.updateButtonText}>Set Outcome to Win</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => updateOutcome(item.id, 'Lose', 'picks')}
                >
                  <Text style={styles.updateButtonText}>Set Outcome to Lose</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>
    );
  };

  // 🪄 Render with ad every 2 cards
  const renderItem = ({ item, index }) => (
    <>
      {item.punterName
        ? renderCard({ item, type: 'predictions' })
        : renderCard({ item, type: 'picks' })}
      {(index + 1) % 2 === 0 && (
        <View style={{ alignSelf: 'center', marginVertical: 8 }}>
          <BannerAd
            unitId={BANNER_ID}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        </View>
      )}
    </>
  );

  return (
    <ScrollView style={[stylesDynamic.bg, { flex: 1, padding: 10 }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000', marginTop: 20 }]}>
        TipNGoal Predictions
      </Text>

      <View style={styles.dateFilterContainer}>
        <TouchableOpacity
          style={[styles.dateButton, stylesDynamic.border]}
          onPress={() => filterDataByDate(yesterday)}
        >
          <FontAwesome name="calendar" size={13} color="#4caf50" />
          <Text style={[styles.dateButtonText, stylesDynamic.text]}>
            Yesterday’s Predictions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dateButton, stylesDynamic.border]}
          onPress={() => filterDataByDate(today)}
        >
          <FontAwesome name="calendar" size={13} color="#4caf50" />
          <Text style={[styles.dateButtonText, stylesDynamic.text]}>
            Today’s Predictions
          </Text>
        </TouchableOpacity>
      </View>

      {preloader ? (
        <ActivityIndicator size="large" color={Theme.colors.green} />
      ) : (
        <FlatList
          data={[...filteredPredictions, ...filteredPicks]}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
}

/* ------------------------- STYLES ------------------------- */
const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  dateButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dateButtonText: { fontSize: 13 },
  list: { paddingBottom: 20 },
  card: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  punterName: { fontSize: 16, fontWeight: 'bold' },
  leagueName: { fontSize: 16, fontWeight: 'bold' },
  match: { fontSize: 15, fontWeight: 'bold' },
  prediction: { fontSize: 13, marginTop: 4 },
  outcomeLabel: { fontSize: 13, fontWeight: 'bold' },
  updateButton: {
    backgroundColor: '#1dbf73',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookieLogo: { width: 40, height: 40, borderRadius: 20 },
});
