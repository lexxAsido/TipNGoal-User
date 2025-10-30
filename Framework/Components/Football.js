import React, { useContext, useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import {
  getLiveFixtures,
  getTodayFixtures,
  getUpcomingFixtures,
  getLineups,
  getHeadToHead,
  getOdds,
  getStats,
  getPredictions,
} from "./apiConfig";
import { ThemeContext } from "../Context/ThemeContext";

const FixtureCard = memo(({ item, onPress, colors }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.leagueRow}>
        <Image source={{ uri: item.league.logo }} style={styles.leagueLogo} />
        <Text style={[styles.leagueName, { color: colors.text }]}>
          {item.league.name}
        </Text>
      </View>

      <View style={styles.teamRow}>
        <View style={styles.team}>
          <Image source={{ uri: item.homeTeam.logo }} style={styles.teamLogo} />
          <Text style={[styles.teamName, { color: colors.text }]}>
            {item.homeTeam.name}
          </Text>
        </View>

        <View style={styles.scoreBox}>
          <Text style={[styles.score, { color: colors.text }]}>
            {item.score.home} - {item.score.away}
          </Text>
          <Text style={[styles.status, { color: colors.subText }]}>
            {item.status === "FT"
              ? "FT"
              : item.elapsed
              ? `${item.elapsed}'`
              : item.status}
          </Text>
        </View>

        <View style={styles.team}>
          <Image source={{ uri: item.awayTeam.logo }} style={styles.teamLogo} />
          <Text style={[styles.teamName, { color: colors.text }]}>
            {item.awayTeam.name}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
));


const Football = () => {
  const [fixtures, setFixtures] = useState([]);
  const [visibleFixtures, setVisibleFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  const currentColors = {
    background: theme === "dark" ? "#121212" : "#ffffff",
    card: theme === "dark" ? "#1E1E1E" : "#f6f6f6",
    text: theme === "dark" ? "#ffffff" : "#000000",
    subText: theme === "dark" ? "#aaaaaa" : "#555555",
    accent: "#28a745",
    modalBg: theme === "dark" ? "#222222" : "#ffffff",
  };

  const renderModalContent = useCallback(() => {
  if (!modalContent || !modalContent.data) {
    return <Text style={{ color: currentColors.text, textAlign: "center" }}>No data available</Text>;
  }

  const { type, data } = modalContent;

  switch (type) {
    case "lineups":
      return (
        <View>
          {data.lineups ? (
            <>
              <Text style={[styles.sectionHeader, { color: currentColors.text }]}>Lineups</Text>
              {data.lineups.map((team, i) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <Text style={[styles.subHeader, { color: currentColors.text }]}>
                    {team.team.name}
                  </Text>
                  {team.startXI?.map((p, j) => (
                    <Text key={j} style={{ color: currentColors.subText }}>
                      {p.player.name} ({p.player.number})
                    </Text>
                  ))}
                </View>
              ))}
            </>
          ) : (
            <Text style={{ color: currentColors.subText }}>No lineup info.</Text>
          )}
        </View>
      );

    case "h2h":
      return (
        <View>
          <Text style={[styles.sectionHeader, { color: currentColors.text }]}>Head to Head</Text>
          {data.length > 0 ? (
            data.map((match, i) => (
              <Text key={i} style={{ color: currentColors.subText }}>
                {match.homeTeam.name} {match.score.fulltime.home} - {match.score.fulltime.away} {match.awayTeam.name}
              </Text>
            ))
          ) : (
            <Text style={{ color: currentColors.subText }}>No previous meetings found.</Text>
          )}
        </View>
      );

    case "odds":
      return (
        <View>
          <Text style={[styles.sectionHeader, { color: currentColors.text }]}>Odds</Text>
          {data.length ? (
            data.map((book, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={[styles.subHeader, { color: currentColors.text }]}>{book.bookmaker_name}</Text>
                {book.bets?.map((b, j) => (
                  <Text key={j} style={{ color: currentColors.subText }}>
                    {b.label}: {b.value}
                  </Text>
                ))}
              </View>
            ))
          ) : (
            <Text style={{ color: currentColors.subText }}>No odds data found.</Text>
          )}
        </View>
      );

    case "predictions":
      return (
        <View>
          <Text style={[styles.sectionHeader, { color: currentColors.text }]}>Predictions</Text>
          {data && data.predictions ? (
            <>
              <Text style={{ color: currentColors.subText }}>Winner: {data.predictions.winner?.name || "N/A"}</Text>
              <Text style={{ color: currentColors.subText }}>Advice: {data.predictions.advice || "N/A"}</Text>
            </>
          ) : (
            <Text style={{ color: currentColors.subText }}>No prediction data.</Text>
          )}
        </View>
      );

    default:
      return <Text style={{ color: currentColors.subText }}>Select a tab to view details.</Text>;
  }
}, [modalContent, currentColors]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const live = await getLiveFixtures();
        const today = await getTodayFixtures();
        const upcoming = await getUpcomingFixtures();
        const combined = [...live, ...today, ...upcoming];
        setFixtures(combined);
        setVisibleFixtures(combined.slice(0, 20));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const loadMoreFixtures = useCallback(() => {
    if (loadingMore || visibleFixtures.length >= fixtures.length) return;
    setLoadingMore(true);

    setTimeout(() => {
      const nextItems = fixtures.slice(visibleFixtures.length, visibleFixtures.length + 20);
      setVisibleFixtures((prev) => [...prev, ...nextItems]);
      setLoadingMore(false);
    }, 400);
  }, [loadingMore, visibleFixtures, fixtures]);

  const openModal = useCallback((match) => {
    setSelectedMatch(match);
    setModalContent(null);
    setActiveTab("");
  }, []);

  const onClose = useCallback(() => {
    setSelectedMatch(null);
    setModalContent(null);
    setActiveTab("");
  }, []);

  const loadModalData = useCallback(async (type) => {
    if (!selectedMatch) return;
    setModalLoading(true);
    setActiveTab(type);
    let data = null;
    try {
      if (type === "lineups") data = await getLineups(selectedMatch.id);
      if (type === "h2h")
        data = await getHeadToHead(
          selectedMatch.homeTeam.id,
          selectedMatch.awayTeam.id
        );
      if (type === "odds") data = await getOdds(selectedMatch.id);
      if (type === "stats") data = await getStats(selectedMatch.id);
      if (type === "predictions") data = await getPredictions(selectedMatch.id);
      setModalContent({ type, data });
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  }, [selectedMatch]);

  const renderItem = useCallback(
    ({ item }) => (
      <FixtureCard item={item} onPress={openModal} colors={currentColors} />
    ),
    [openModal, currentColors]
  );

  if (loading)
    return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} size="large" />;

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.header, { color: currentColors.text }]}>⚽ Livescores</Text>

      <FlatList
        data={visibleFixtures}
        scrollEnabled={false}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        onEndReached={loadMoreFixtures}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={{ marginVertical: 20 }} size="small" color="#28a745" />
          ) : null
        }
      />

      {/* MODAL */}
      <Modal
        visible={!!selectedMatch}
        animationType="fade"
        transparent
        onRequestClose={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalBox, { backgroundColor: currentColors.modalBg }]}>
            <TouchableOpacity onPress={onClose} style={{ alignSelf: "flex-end" }}>
              <Text style={[styles.closeBtn, { color: "#ff4444" }]}>✖</Text>
            </TouchableOpacity>

            <Text style={[styles.modalHeader, { color: currentColors.text }]}>
              {selectedMatch?.homeTeam.name} vs {selectedMatch?.awayTeam.name}
            </Text>

            <View style={styles.modalButtons}>
              {["lineups", "h2h", "odds", "predictions"].map((btn) => (
                <TouchableOpacity
                  key={`tab-${btn}`}
                  onPress={() => loadModalData(btn)}
                  style={[
                    styles.modalBtn,
                    {
                      backgroundColor:
                        activeTab === btn ? "#d32f2f" : currentColors.accent,
                    },
                  ]}
                >
                  <Text style={styles.modalBtnText}>{btn.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {modalLoading ? (
              <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#007bff" />
            ) : (
              <ScrollView
                style={styles.modalContent}
                contentContainerStyle={{ paddingBottom: 10 }}
              >
                {renderModalContent()}

              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default memo(Football); // 👈 memoize entire screen

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: { padding: 12, borderRadius: 10, marginBottom: 10, elevation: 2 },
  leagueRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  leagueLogo: { width: 20, height: 20, marginRight: 8 },
  leagueName: { fontSize: 14, fontWeight: "600" },
  teamRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  team: { alignItems: "center", width: "35%" },
  teamLogo: { width: 40, height: 40, borderRadius: 20, marginBottom: 4 },
  teamName: { fontSize: 13, textAlign: "center" },
  scoreBox: { alignItems: "center", width: "20%" },
  score: { fontSize: 18, fontWeight: "bold" },
  status: { fontSize: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalBox: {
    borderRadius: 16,
    width: "98%",
    maxHeight: "55%",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  modalBtn: { padding: 8, borderRadius: 8 },
  modalBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  closeBtn: { fontSize: 20, fontWeight: "bold" },
});
