import axios from 'axios';

const API_KEY = 'b0e2a1d229dc4d94ab47936fffbb986c';
const BASE_URL = 'https://api.football-data.org/v4';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Auth-Token': API_KEY,
  },
});

export const getLiveScores = async () => {
  try {
    const response = await api.get('/matches', {
      params: {
        status: 'LIVE', // Filter for live matches only
        competitions: 'PL,PD,SA,CL,BL1,FL1,ELC,PPL,CLI,BSA',
      },
    });

    // Map the matches to extract the required properties
    return (response.data.matches || []).map((match) => ({
      id: match?.id || 'N/A',
      homeTeam: {
        name: match?.homeTeam?.name || 'Unknown Team',
      },
      awayTeam: {
        name: match?.awayTeam?.name || 'Unknown Team',
      },
      score: {
        homeTeam: match?.score?.fullTime?.homeTeam ?? 0, // Handle potential null values
        awayTeam: match?.score?.fullTime?.awayTeam ?? 0,
      },
      minute: match?.minute || 'N/A', // Extract minute if available
      status: match?.status || 'Unknown', // Include status (e.g., LIVE)
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
    throw new Error('Failed to fetch live scores. Please try again.');
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

    // Map the matches to extract relevant fixture data
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
