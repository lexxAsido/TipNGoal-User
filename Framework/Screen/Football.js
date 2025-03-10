import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { AppContext } from '../Components/globalVariables';
import { getLiveScores, getUpcomingFixtures, getFullTimeResults } from './apiConfig';
import { Theme } from '../Components/Theme';

export default function Football() {
  const [liveScores, setLiveScores] = useState([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState([]);
  const [fullTimeResults, setFullTimeResults] = useState([]); 
  const [error, setError] = useState(null);
  const { preloader, setPreloader } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setPreloader(true);
    setError(null);
    try {
      const liveData = await getLiveScores();
      const fixtureData = await getUpcomingFixtures();
      const resultsData = await getFullTimeResults(); 

      // console.log("Live Scores Response:", liveData);
      // console.log("Upcoming Fixtures Response:", fixtureData);
      // console.log("Full-Time Results Response:", resultsData);

      if (liveData) setLiveScores(liveData);
      if (fixtureData) setUpcomingFixtures(fixtureData);
      if (resultsData) setFullTimeResults(resultsData);
    } catch (err) {
      console.error('Error fetching data:', err.message || err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setPreloader(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(); 

    // const interval = setInterval(() => {
    //   fetchData(); 
    // }, 50000);

    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log('Updated Live Scores:', liveScores);
  }, [liveScores]);

  const onRefresh = () => {
    console.log("Refreshing...");
    setRefreshing(true);
    fetchData();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sectionContainer}>
        <Text style={styles.header}>Live Scores</Text>
        {preloader ? (
          <Text style={styles.loadingText}>Loading live scores...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : liveScores.length > 0 ? (
          liveScores.map((match, index) => {
            console.log('Match Data:', match);
            const matchTime =
              match.status === 'IN_PLAY' && match.minute !== 'N/A'
                ? `${match.minute}'`
                : match.status === 'IN_PLAY'
                ? match.period
                : match.status;
            return (
              <View key={index} style={styles.matchCard}>
                <Text style={styles.teamNames}>
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </Text>
                <Text style={styles.matchDetails}>
                  {matchTime} - {match.score?.homeTeam ?? 0} : {match.score?.awayTeam ?? 0}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>No live scores available</Text>
        )}
      </View>

      

      <View style={styles.sectionContainer}>
        <Text style={styles.header}>Upcoming Fixtures</Text>
        {preloader ? (
          <Text style={styles.loadingText}>Loading upcoming fixtures...</Text>
        ) : upcomingFixtures.length > 0 ? (
          upcomingFixtures.map((match, index) => (
            <View key={index} style={styles.matchCard}>
              <Text style={styles.teamNames}>
                {match.homeTeam.name} vs {match.awayTeam.name}
              </Text>
              <Text style={styles.matchDetails}>
                {new Date(match.utcDate).toLocaleString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No upcoming fixtures</Text>
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.header}>Full-Time Results</Text>
        {preloader ? (
          <Text style={styles.loadingText}>Loading full-time results...</Text>
        ) : fullTimeResults.length > 0 ? (
          fullTimeResults.map((match, index) => (
            <View key={index} style={styles.matchCard}>
              <Text style={styles.teamNames}>
                {match.homeTeam.name} vs {match.awayTeam.name}
              </Text>
              <Text style={styles.matchDetails}>
                {match.score.homeTeam} - {match.score.awayTeam} (FT)
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No full-time results available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: Theme.colors.lightGreen,
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: "white",
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 10,
    borderRadius: 8,
    marginBottom: 18,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  matchCard: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#111010',
    borderRadius: 8,
    elevation: 3,
  },
  teamNames: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  matchDetails: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#000',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#888',
  },
});
