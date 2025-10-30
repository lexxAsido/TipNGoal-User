// Livescore.js
import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeContext } from "../Context/ThemeContext";
import {
  getLiveFixtures,
  getTodayFixtures,
  getUpcomingFixtures,
  getLineups,
  getHeadToHead,
  getOdds,
  getStats,
  getPredictions,
  getStandings,
  getStandingsByFixture
} from "./apiConfig"; 
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';


// Replace TestIds with your real AdMob ID later
const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy"; // <- replace with your real banner id

// CACHE TTL (ms)
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// --- Small utilities ---
const formatTime = (iso) => {
  try {
    const d = new Date(iso);
    // show date and time concisely, locale-aware
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return { date, time };
  } catch (e) {
    return { date: "", time: "" };
  }
};

const cacheKeyFor = (tab) => `@livescore_${tab}`;

// --- Fixture Card ---
const FixtureCard = React.memo(({ fixture, colors, onPressFixture, onPressLeague }) => {
  const { date, time } = formatTime(fixture.date);

  return (
    <TouchableOpacity onPress={() => onPressFixture(fixture)} activeOpacity={0.85}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          onPress={() => onPressLeague(fixture.league)}
          style={styles.leagueRowTouchable}
          activeOpacity={0.8}
        >
          <Image source={{ uri: fixture.league.logo }} style={styles.leagueLogo} />
          <Text style={[styles.leagueName, { color: colors.subText }]} numberOfLines={1}>
            {fixture.league.name}
          </Text>
        </TouchableOpacity>

        <View style={styles.teamRow}>
          <View style={styles.team}>
            <Image source={{ uri: fixture.homeTeam.logo }} style={styles.teamLogo} />
            <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={1}>
              {fixture.homeTeam.name}
            </Text>
          </View>

          <View style={styles.centerBox}>
            <Text style={[styles.score, { color: colors.text }]}>
              {fixture.score.home} - {fixture.score.away}
            </Text>

            <Text style={[styles.timeBadge, { color: colors.subText }]}>
              {fixture.status === "NS" ? `${date} ${time}` : fixture.status === "FT" ? "FT" : `${fixture.elapsed}'`}
            </Text>
          </View>

          <View style={styles.team}>
            <Image source={{ uri: fixture.awayTeam.logo }} style={styles.teamLogo} />
            <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={1}>
              {fixture.awayTeam.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// --- Standings Table ---
const StandingsTable = React.memo(({ standings, colors }) => {
  if (!standings || !standings.length) {
    return <Text style={{ color: colors.subText, padding: 12 }}>No standings available.</Text>;
  }

  return (
    <View style={[styles.standingsBox, { backgroundColor: colors.card }]}>
      <View style={styles.standingsHeader}>
        <Text style={[styles.stColPos, { color: colors.subText }]}>#</Text>
        <Text style={[styles.stColTeam, { color: colors.subText }]}>Team</Text>
        <Text style={[styles.stColPts, { color: colors.subText }]}>Pts</Text>
      </View>

      {standings.map((row) => (
        <View key={row.team.id} style={styles.standingsRow}>
          <Text style={[styles.stColPos, { color: colors.text }]}>{row.rank}</Text>

          <View style={styles.stColTeamRow}>
            <Image source={{ uri: row.team.logo }} style={styles.teamLogoSmall} />
            <Text numberOfLines={1} style={[styles.teamNameSmall, { color: colors.text }]}>
              {row.team.name}
            </Text>
          </View>

          <Text style={[styles.stColPts, { color: colors.text }]}>{row.points}</Text>
        </View>
      ))}
    </View>
  );
});

// --- Main Livescore Component ---
const Livescore = () => {
  const { theme } = useContext(ThemeContext);
  const [tab, setTab] = useState("today"); // live | today | tomorrow | standings
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // fixture details modal state
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [detailTab, setDetailTab] = useState(""); // lineups|h2h|odds|stats|predictions
  const [detailContent, setDetailContent] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // standings modal state (when league tapped)
  const [standingsModalVisible, setStandingsModalVisible] = useState(false);
  const [standingsData, setStandingsData] = useState(null);
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);

  const colors = useMemo(
    () => ({
      background: theme === "dark" ? "#121212" : "#ffffff",
      card: theme === "dark" ? "#1E1E1E" : "#f6f6f6",
      text: theme === "dark" ? "#ffffff" : "#000000",
      subText: theme === "dark" ? "#aaaaaa" : "#555555",
      accent: "#28a745",
    }),
    [theme]
  );

  // Utility: load & cache
  const loadAndCache = useCallback(async (key, fetcher) => {
    const cacheKey = cacheKeyFor(key);
    const now = Date.now();
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.timestamp && now - parsed.timestamp < CACHE_TTL && parsed.data) {
          return parsed.data;
        }
      }
    } catch (e) {
      // ignore cache read errors
    }

    // fetch fresh
    const fresh = await fetcher();
    try {
      await AsyncStorage.setItem(cacheKey, JSON.stringify({ data: fresh, timestamp: now }));
    } catch (e) {
      // ignore cache write errors
    }
    return fresh;
  }, []);

  const fetchFixturesForTab = useCallback(async (currentTab) => {
    setLoading(true);
    try {
      if (currentTab === "live") {
        const data = await loadAndCache("live", getLiveFixtures);
        setFixtures(data || []);
      } else if (currentTab === "today") {
        const data = await loadAndCache("today", getTodayFixtures);
        setFixtures(data || []);
      } else if (currentTab === "tomorrow") {
        // compute tomorrow's date range by calling api wrapper for upcoming but we can filter
        const data = await loadAndCache("upcoming", getUpcomingFixtures);
        // filter for tomorrow only (local timezone)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tDate = tomorrow.toISOString().split("T")[0];
        const onlyTomorrow = (data || []).filter((f) => f.date?.startsWith(tDate));
        setFixtures(onlyTomorrow);
      } else if (currentTab === "standings") {
        // For standings tab we show nothing in fixture list; normally you'll tap league to view standings
        setFixtures([]);
      }
    } catch (err) {
      console.error("fetchFixturesForTab error", err);
      setFixtures([]);
    } finally {
      setLoading(false);
    }
  }, [loadAndCache]);

  useEffect(() => {
    fetchFixturesForTab(tab);
  }, [tab, fetchFixturesForTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await AsyncStorage.removeItem(cacheKeyFor(tab));
      await fetchFixturesForTab(tab);
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  }, [tab, fetchFixturesForTab]);

  // Prefetch logos for visible fixtures (small optimization)
  useEffect(() => {
    (async () => {
      try {
        const urls = fixtures.flatMap((f) => [f.homeTeam.logo, f.awayTeam.logo, f.league.logo]);
        urls.forEach((u) => Image.prefetch?.(u));
      } catch (e) {}
    })();
  }, [fixtures]);

  // --- Fixture tap -> open details modal
  const openFixture = useCallback((fixture) => {
    setSelectedFixture(fixture);
    setDetailTab("");
    setDetailContent(null);
  }, []);

  // --- Load detail data for selected fixture
  const loadDetail = useCallback(
  async (type) => {
    if (!selectedFixture) return;
    setDetailLoading(true);
    setDetailTab(type);
    setDetailContent(null);
    try {
      let d = null;
      if (type === "lineups") d = await getLineups(selectedFixture.id);
      if (type === "h2h") d = await getHeadToHead(selectedFixture.homeTeam.id, selectedFixture.awayTeam.id);
      if (type === "odds") d = await getOdds(selectedFixture.id);
      if (type === "stats") d = await getStats(selectedFixture.id);
      if (type === "predictions") d = await getPredictions(selectedFixture.id);
      if (type === "standings") d = await getStandingsByFixture(selectedFixture);
      setDetailContent(d);
    } catch (err) {
      console.error("loadDetail error", err);
      setDetailContent(null);
    } finally {
      setDetailLoading(false);
    }
  },
  [selectedFixture]
);


  // --- League tap -> fetch standings and show modal
  const openLeagueStandings = useCallback(
    async (league) => {
      setSelectedLeague(league);
      setStandingsLoading(true);
      setStandingsModalVisible(true);
      setStandingsData(null);
      try {
        // you must pass league id and season to getStandings; if your getStandings wrapper requires season param, adjust accordingly.
        // Try to guess season from fixture date or default to current year.
        const season = new Date().getFullYear();
        const s = await getStandings(league.id, season);
        setStandingsData(s || []);
      } catch (err) {
        console.error("openLeagueStandings", err);
        setStandingsData([]);
      } finally {
        setStandingsLoading(false);
      }
    },
    []
  );

  // --- Render modal content for details
  const renderDetailContent = useCallback(() => {
    if (!detailContent) {
      return <Text style={{ color: colors.subText, padding: 8 }}>Select a tab to load data.</Text>;
    }

    // lineups returns array etc - adapt to your API response shape
    if (detailTab === "lineups") {
      // some wrappers return an array of teams
      const arr = Array.isArray(detailContent) ? detailContent : detailContent.response ?? detailContent;
      // try a few variants
      if (!arr || arr.length === 0) return <Text style={{ color: colors.subText }}>No lineups available.</Text>;
      return arr.map((teamGroup, idx) => (
        <View key={idx} style={{ marginBottom: 8 }}>
          <Text style={{ color: colors.text, fontWeight: "700", marginBottom: 6 }}>
            {teamGroup.team?.name ?? teamGroup.name ?? `Team ${idx + 1}`}
          </Text>
          {(teamGroup.startXI || teamGroup.lineups || []).map((p, i) => {
            const player = p.player ?? p;
            return (
              <Text key={i} style={{ color: colors.subText }}>
                {player.number ? `${player.number} ` : ""}{player.name ?? player.player?.name}
              </Text>
            );
          })}
        </View>
      ));
    }

    
    if (detailTab === "h2h") {
  const arr = Array.isArray(detailContent) ? detailContent : [];
  if (!arr.length)
    return <Text style={{ color: colors.subText }}>No head-to-head matches found.</Text>;

  return arr.map((m, i) => {
    const date = new Date(m.date).toLocaleDateString();
    const winnerColor =
      m.winner === m.homeTeam?.name
        ? "#4CAF50"
        : m.winner === m.awayTeam?.name
        ? "#f44336"
        : colors.subText;

    const homeName = m.homeTeam?.name ?? "TBD";
    const awayName = m.awayTeam?.name ?? "TBD";
    const homeGoals = m.goals?.home ?? 0;
    const awayGoals = m.goals?.away ?? 0;

    return (
      <View key={i} style={{ marginBottom: 10 }}>
        <Text style={{ color: colors.text, fontWeight: "600" }}>
          {date} • {m.venue || "—"}
        </Text>
        <Text style={{ color: colors.text }}>
          {homeName} {homeGoals} - {awayGoals} {awayName}
        </Text>
        <Text style={{ color: winnerColor, fontSize: 12, marginTop: 2 }}>
          Winner: {m.winner || "N/A"}
        </Text>
      </View>
    );
  });
}


    if (detailTab === "odds") {
      const arr = Array.isArray(detailContent) ? detailContent : detailContent.response ?? detailContent;
      if (!arr || arr.length === 0) return <Text style={{ color: colors.subText }}>No odds available.</Text>;
      // assume array of bookmakers
      return arr.map((bk, i) => (
        <View key={i} style={{ marginBottom: 8 }}>
          <Text style={{ color: colors.text, fontWeight: "700" }}>{bk.bookmaker ?? bk.bookmaker?.name ?? bk.bookmaker_name ?? `Bookmaker ${i+1}`}</Text>
          {(bk.bets || bk.odds || []).map((bet, j) => (
            <Text key={j} style={{ color: colors.subText }}>
              {bet.label ?? bet.name}: {bet.value ?? JSON.stringify(bet)}
            </Text>
          ))}
        </View>
      ));
    }

    if (detailTab === "stats") {
      const arr = Array.isArray(detailContent) ? detailContent : detailContent.response ?? detailContent;
      if (!arr || arr.length === 0) return <Text style={{ color: colors.subText }}>No stats available.</Text>;
      // format stats (API-Football returns array of { team: { id }, statistics: [...] })
      return arr.map((teamStat, idx) => (
        <View key={idx} style={{ marginBottom: 8 }}>
          <Text style={{ color: colors.text, fontWeight: "700" }}>{teamStat.team?.name ?? `Team ${idx+1}`}</Text>
          {(teamStat.statistics || []).map((s, i) => (
            <Text key={i} style={{ color: colors.subText }}>
              {s.type}: {s.value}
            </Text>
          ))}
        </View>
      ));
    }

    if (detailTab === "predictions") {
      const obj = Array.isArray(detailContent) ? detailContent[0] : detailContent;
      if (!obj) return <Text style={{ color: colors.subText }}>No predictions available.</Text>;
      return (
        <View>
          <Text style={{ color: colors.text, marginBottom: 6 }}>Advice: {obj.advice ?? obj.predictions?.advice ?? "N/A"}</Text>
          <Text style={{ color: colors.subText }}>Winner: {obj.predictions?.winner?.name ?? obj.winner?.name ?? "N/A"}</Text>
        </View>
      );
    }
    if (detailTab === "standings") {
  const arr = Array.isArray(detailContent) ? detailContent : [];
  if (!arr || arr.length === 0)
    return <Text style={{ color: colors.subText }}>No standings available.</Text>;

  return (
    <View style={{ marginBottom: 12 }}>
      <StandingsTable standings={arr} colors={colors} />
    </View>
  );
}


    return <Text style={{ color: colors.subText }}>Select a tab.</Text>;
  }, [detailContent, detailTab, colors]);

  // --- Render
  const gradientColors = theme === "dark" ? ["#0d0d0d", "#141414"] : ["#ffffff", "#f5f5f5"];
  const listEmpty = !loading && fixtures.length === 0;

  return (
    <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
      <View style={[styles.container]}>
        {/* Tabs */}
        <View style={styles.tabs}>
          {[
            { key: "live", label: "LIVE" },
            { key: "today", label: "TODAY" },
            // { key: "tomorrow", label: "TOMORROW" },
            // { key: "standings", label: "STANDINGS" },
          ].map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => setTab(t.key)}
              style={[styles.tabButton, tab === t.key && styles.tabActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, { color: tab === t.key ? colors.accent : colors.subText }]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
        ) : tab === "standings" ? (
          <View style={{ paddingHorizontal: 12 }}>
            <Text style={{ color: colors.subText, marginVertical: 8 }}>
              Tap a league's badge on any fixture to view its standings.
            </Text>
            <FlatList
              data={fixtures}
              keyExtractor={(item) => `${item.id}`}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openLeagueStandings(item.league)}>
                  <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.leagueRowTouchable}>
                      <Image source={{ uri: item.league.logo }} style={styles.leagueLogo} />
                      <Text style={[styles.leagueName, { color: colors.text }]}>{item.league.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={{ color: colors.subText }}>No league previews available.</Text>}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
          </View>
        ) : (
          <FlatList
  data={
    fixtures.flatMap((f, i) =>
      (i + 1) % 8 === 0
        ? [f, { type: "ad", key: `ad-${i}` }] // insert ad after every 8th fixture
        : [f]
    )
  }
  keyExtractor={(item, index) =>
    item.type === "ad" ? item.key : item.id.toString()
  }
  renderItem={({ item }) => {
    if (item.type === "ad") {
      return (
        <View style={{ marginVertical: 10, alignItems: "center" }}>
          <BannerAd
            unitId={BANNER_ID}
            size={BannerAdSize.MEDIUM_RECTANGLE}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>
      );
    }

    // Normal fixture card
    return (
      <FixtureCard
        fixture={item}
        colors={colors}
        onPressFixture={openFixture}
        onPressLeague={(league) => openLeagueStandings(league)}
      />
    );
  }}
  initialNumToRender={8}
  maxToRenderPerBatch={8}
  windowSize={10}
  removeClippedSubviews={Platform.OS === "android"}
  getItemLayout={(_, index) => ({ length: 110, offset: 110 * index, index })}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
  ListEmptyComponent={
    listEmpty ? (
      <Text
        style={{
          color: colors.subText,
          textAlign: "center",
          marginTop: 40,
        }}
      >
        No fixtures available.
      </Text>
    ) : null
  }
  contentContainerStyle={{ paddingBottom: 80 }}
/>

        )}

        {/* Fixture Details Modal */}
        <Modal visible={!!selectedFixture} transparent animationType="slide" onRequestClose={() => setSelectedFixture(null)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {selectedFixture?.homeTeam?.name} vs {selectedFixture?.awayTeam?.name}
                  </Text>
                  <Text style={{ color: colors.subText, fontSize: 12 }}>
                    {formatTime(selectedFixture?.date).date} {formatTime(selectedFixture?.date).time}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedFixture(null)}>
                  <Text style={{ color: "#ff4444", fontSize: 18 }}>✖</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailTabs}>
  {["lineups", "h2h", "stats", "predictions", "standings"].map((d) => (

                  <TouchableOpacity
                    key={d}
                    onPress={() => loadDetail(d)}
                    style={[styles.detailTabBtn, detailTab === d && { backgroundColor: colors.accent }]}
                  >
                    <Text style={{ color: detailTab === d ? "#fff" : colors.subText, fontSize: 10,}}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ height: 220 }}>
                {detailLoading ? (
                  <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 24 }} />
                ) : (
                  <ScrollView style={{ paddingTop: 8 }}>{renderDetailContent()}</ScrollView>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* Standings Modal */}
        <Modal visible={standingsModalVisible} transparent animationType="slide" onRequestClose={() => setStandingsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {selectedLeague?.logo ? <Image source={{ uri: selectedLeague.logo }} style={styles.leagueLogo} /> : null}
                  <Text style={[styles.modalTitle, { color: colors.text, marginLeft: 8 }]}>{selectedLeague?.name ?? "Standings"}</Text>
                </View>
                <TouchableOpacity onPress={() => setStandingsModalVisible(false)}>
                  <Text style={{ color: "#ff4444", fontSize: 18 }}>✖</Text>
                </TouchableOpacity>
              </View>

              {standingsLoading ? (
                <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 24 }} />
              ) : (
                <ScrollView style={{ maxHeight: 420, marginTop: 8 }}>
                  <StandingsTable standings={standingsData || []} colors={colors} />
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

export default React.memo(Livescore);

// --- styles ---
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 12, paddingTop: 10 },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    // visual indicator handled by text color
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
  },
  
  card: {
    borderRadius: 12,
    marginVertical: 6,
    padding: 10,
    elevation: 2,
  },

  leagueRowTouchable: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  leagueLogo: { width: 18, height: 18, marginRight: 8, borderRadius: 4 },
  leagueName: { fontSize: 12, fontWeight: "600" },

  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  team: { alignItems: "center", width: "35%" },
  teamLogo: { width: 42, height: 42, borderRadius: 22, marginBottom: 6 },
  teamName: { fontSize: 13, textAlign: "center" },

  centerBox: { alignItems: "center", width: "30%" },
  score: { fontSize: 18, fontWeight: "700" },
  timeBadge: { fontSize: 12, marginTop: 4 },

  // standings
  standingsBox: { borderRadius: 10, marginTop: 6, overflow: "hidden" },
  standingsHeader: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderColor: "#333" },
  standingsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 0.5, borderColor: "#333", alignItems: "center" },
  stColPos: { width: 24, textAlign: "left" },
  stColTeam: { flex: 1 },
  stColTeamRow: { flexDirection: "row", alignItems: "center" },
  teamLogoSmall: { width: 22, height: 22, borderRadius: 12, marginRight: 8 },
  teamNameSmall: { fontSize: 13 },

  stColPts: { width: 40, textAlign: "right" },

  // modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 18,
  },
  modalBox: {
    borderRadius: 14,
    padding: 14,
    maxHeight: "85%",
    backgroundColor: "#fff",
  },
  modalTitle: { fontSize: 16, fontWeight: "700" },

  detailTabs: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  detailTabBtn: {
    flex: 1,
    paddingVertical: 5,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "transparent",
    alignItems: "center",
    fontSize: 10
  },
});
