import axios from "axios";

const API_KEY = "1551f90f7db1519fe203dfbfcdccf62d";
const BASE_URL = "https://v3.football.api-sports.io";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-apisports-key": API_KEY,
    Accept: "application/json",
  },
});

// 🟢 Fetch LIVE fixtures
export const getLiveFixtures = async () => {
  try {
    const response = await api.get("/fixtures", { params: { live: "all" } });
    return formatFixtures(response.data.response);
  } catch (error) {
    console.error("Error fetching live fixtures:", error.response?.data || error.message);
    return [];
  }
};

// 📅 Fetch TODAY fixtures
export const getTodayFixtures = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await api.get("/fixtures", { params: { date: today } });
    return formatFixtures(response.data.response);
  } catch (error) {
    console.error("Error fetching today's fixtures:", error.response?.data || error.message);
    return [];
  }
};

// 📅 Fetch TOMORROW fixtures
export const getTomorrowFixtures = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const tDate = tomorrow.toISOString().split("T")[0];

    const response = await api.get("/fixtures", { params: { date: tDate } });
    return formatFixtures(response.data.response);
  } catch (error) {
    console.error("Error fetching tomorrow's fixtures:", error.response?.data || error.message);
    return [];
  }
};

// ⚙️ Lineups
export const getLineups = async (fixtureId) => {
  try {
    const res = await api.get("/fixtures/lineups", { params: { fixture: fixtureId } });
    return res.data.response;
  } catch (error) {
    console.error("Error fetching lineups:", error.response?.data || error.message);
    return [];
  }
};

// ⚙️ Head-to-Head (✅ formatted)
export const getHeadToHead = async (homeId, awayId) => {
  try {
    const res = await api.get("/fixtures/headtohead", {
      params: { h2h: `${homeId}-${awayId}` },
    });

    const matches = res.data.response || [];

    // include richer match details
    return matches.map((item) => ({
      id: item.fixture.id,
      date: item.fixture.date,
      venue: item.fixture.venue?.name ?? "",
      status: item.fixture.status.short,
      homeTeam: item.teams.home,
      awayTeam: item.teams.away,
      goals: item.goals,
      winner: item.teams.home.winner
        ? item.teams.home.name
        : item.teams.away.winner
        ? item.teams.away.name
        : "Draw",
    }));
  } catch (error) {
    console.error("Error fetching head2head:", error.response?.data || error.message);
    return [];
  }
};


// ⚙️ Pre-Match Odds
export const getOdds = async (fixtureId) => {
  try {
    const res = await api.get("/odds", { params: { fixture: fixtureId } });
    return res.data.response;
  } catch (error) {
    console.error("Error fetching odds:", error.response?.data || error.message);
    return [];
  }
};

// ⚙️ Statistics
export const getStats = async (fixtureId) => {
  try {
    const res = await api.get("/fixtures/statistics", { params: { fixture: fixtureId } });
    return res.data.response;
  } catch (error) {
    console.error("Error fetching stats:", error.response?.data || error.message);
    return [];
  }
};

// ⚙️ Predictions
export const getPredictions = async (fixtureId) => {
  try {
    const res = await api.get("/predictions", { params: { fixture: fixtureId } });
    return res.data.response;
  } catch (error) {
    console.error("Error fetching predictions:", error.response?.data || error.message);
    return [];
  }
};

// ⚙️ Standings by Fixture
export const getStandingsByFixture = async (fixture) => {
  if (!fixture?.league?.id || !fixture?.date) {
    console.warn("⚠️ Missing league.id or fixture.date:", fixture);
    return [];
  }

  try {
    const season = new Date(fixture.date).getFullYear();
    console.log("🔍 Fetching standings for league:", fixture.league.id, "season:", season);

    const res = await api.get("/standings", {
      params: { league: fixture.league.id, season },
    });

    const table = res.data.response?.[0]?.league?.standings?.[0] || [];
    console.log("✅ Parsed standings length:", table.length);
    return table;
  } catch (error) {
    console.error("❌ Error fetching standings:", error.response?.data || error.message);
    return [];
  }
};

// ⚙️ Team Info
export const getTeamInfo = async (teamId) => {
  try {
    const res = await api.get("/teams", { params: { id: teamId } });
    return res.data.response[0];
  } catch (error) {
    console.error("Error fetching team info:", error.response?.data || error.message);
    return null;
  }
};

// 🧩 Helper: Consistent fixture formatter (✅ includes IDs)
const formatFixtures = (data) =>
  (data || []).map((item) => ({
    id: item.fixture.id,
    date: item.fixture.date,
    status: item.fixture.status.short,
    elapsed: item.fixture.status.elapsed,
    league: {
      id: item.league.id,
      name: item.league.name,
      logo: item.league.logo,
      country: item.league.country,
    },
    homeTeam: {
      id: item.teams.home.id,
      name: item.teams.home.name,
      logo: item.teams.home.logo,
    },
    awayTeam: {
      id: item.teams.away.id,
      name: item.teams.away.name,
      logo: item.teams.away.logo,
    },
    score: {
      home: item.goals.home ?? 0,
      away: item.goals.away ?? 0,
    },
  }));
