import { footballApi } from './apiConfig';

export const fetchLiveScores = async () => {
    try {
      const response = await footballApi.get('/matches', {
        params: {
          status: 'LIVE',
          competitions: 'PL,SA,BL1,CL,FL1,PD,ELC,DED,CLI,BSA', 
        },
      });
      return response.data.matches;
    } catch (error) {
      console.error("Error fetching live scores:", error);
    }
  };
  
  export const fetchFixtures = async () => {
    try {
      const response = await footballApi.get('/matches', {
        params: {
          status: 'SCHEDULED',
          competitions: 'PL,SA,BL1,CL,FL1,PD,ELC,DED,CLI,BSA', 
        },
      });
      return response.data.matches;
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    }
  };
  


  


