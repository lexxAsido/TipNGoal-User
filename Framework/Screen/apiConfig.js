import axios from 'axios';

const API_KEY = 'b0e2a1d229dc4d94ab47936fffbb986c';
const BASE_URL = 'https://api.football-data.org/v4';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Auth-Token': API_KEY,
  },
});

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => new Date().toISOString().split('T')[0];

/**
 * Fetches only live matches that are currently being played.
 */
export const getLiveScores = async () => {
  try {
    const response = await api.get('/matches', {
      params: {
        status: 'LIVE,IN_PLAY,PAUSED', // Only ongoing matches
        competitions: 'PL,PD,SA,CL,BL1,FL1,ELC,PPL,CLI,BSA',
      },
    });

    console.log('Live Matches:', response.data.matches);

    return (response.data.matches || []).map((match) => ({
      id: match?.id || 'N/A',
      homeTeam: { name: match?.homeTeam?.name || 'Unknown Team' },
      awayTeam: { name: match?.awayTeam?.name || 'Unknown Team' },
      score: {
        homeTeam: match?.score?.fullTime?.homeTeam ?? match?.score?.halfTime?.homeTeam ?? 0,
        awayTeam: match?.score?.fullTime?.awayTeam ?? match?.score?.halfTime?.awayTeam ?? 0,
      },
      minute: match?.minute ?? 'N/A',
      period: match?.status === 'IN_PLAY' ? '2nd Half' : '1st Half',
      status: match?.status || 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching live scores:', error);
    throw new Error('Failed to fetch live scores.');
  }
};

/**
 * Fetches full-time results of all matches played today.
 */
export const getFullTimeResults = async () => {
  try {
    const response = await api.get('/matches', {
      params: {
        dateFrom: getTodayDate(),
        dateTo: getTodayDate(),
        status: 'FINISHED', // Fetch only completed matches
        competitions: 'PL,PD,SA,CL,BL1,FL1,ELC,PPL,CLI,BSA',
      },
    });

    if (!response.data.matches || response.data.matches.length === 0) {
      // console.log('No full-time results found for today.');
      return [];
    }

    console.log('Full-Time Results:', response.data.matches);

    return response.data.matches.map((match) => ({
      id: match?.id ?? 'N/A',
      homeTeam: { name: match?.homeTeam?.name ?? 'Unknown Team' },
      awayTeam: { name: match?.awayTeam?.name ?? 'Unknown Team' },
      score: {
        homeTeam: match?.score?.fullTime?.homeTeam ?? 0,
        awayTeam: match?.score?.fullTime?.awayTeam ?? 0,
      },
      status: match?.status ?? 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching full-time results:', error.message);
    return []; // Return an empty array to prevent UI crashes
  }
};


export const getUpcomingFixtures = async () => {
  try {
    const response = await api.get('/matches', {
      params: {
        status: 'SCHEDULED',
        competitions: 'PL,PD,SA,CL,BL1,FL1,ELC,PPL,CLI,BSA',
      },
    });

    console.log('Upcoming Fixtures Data:', response.data); // ✅ Log full API response

    return (response.data.matches || []).map((match) => ({
      id: match?.id || 'N/A',
      homeTeam: {
        name: match?.homeTeam?.name || 'Unknown Team',
      },
      awayTeam: {
        name: match?.awayTeam?.name || 'Unknown Team',
      },
      utcDate: match?.utcDate || 'N/A',
    }));
  } catch (error) {
    if (error.response) {
      console.error(
        'Response error:',
        error.response.status,
        error.response.data.message || error.response.data
      );
    } else if (error.request) {
      console.error('Request error: No response received', error.request);
    } else {
      console.error('General error:', error.message);
    }
    throw new Error('Failed to fetch upcoming fixtures. Please try again.');
  }
};
