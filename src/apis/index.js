
import axios from "axios";

const verifyUser = async (initData) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/api/auth/user`,
      { 
        initData,
        user: window.Telegram.WebApp.initDataUnsafe.user
      }
    );
    console.log("User verified:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};

export { verifyUser };