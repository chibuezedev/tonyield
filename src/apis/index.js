import axios from "axios";

const verifyUser = async (initData) => {
  try {
    const response = await axios.post("/api/auth/user", { initData });
    console.log("User verified:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};

export { verifyUser };