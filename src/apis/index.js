import axios from "axios";

const verifyUser = async (initData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/auth/user`,
      { initData }
    );
    console.log("User verified:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};

export { verifyUser };
