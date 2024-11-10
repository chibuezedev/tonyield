import axios from "axios";

const verifyUser = async (initData) => {
  try {
    const response = await axios.post(`http://localhost:3001/api/auth/user`, {
      initData,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};

const claimRewards = async (level, reward, initData) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/game/claim-rewards`,
      {
        level,
        reward,
        initData,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error claiming rewards:", error);
    throw error;
  }
};

export { verifyUser, claimRewards };
