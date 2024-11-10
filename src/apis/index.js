import axios from "axios";

const verifyUser = async (initData, user) => {
  try {
    const response = await axios.post(`http://localhost:3001/api/auth/user`, {
      initData,
      user,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};

export { verifyUser };
