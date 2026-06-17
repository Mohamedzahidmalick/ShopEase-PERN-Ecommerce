import api from "./Api";

export const loginUser = async (data) => {
  try {
    const res = await api.post("/auth/login", data);

    const { token, role, user } = res.data; // ✅ FIX

    // save token
    localStorage.setItem(`${role}_token`, token);

    // save role
    localStorage.setItem("role", role);

    // save user id
    localStorage.setItem("user", JSON.stringify(user));

    return res.data; // contains user
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

export const registeruser = async (data) => {
  try {
    const res = await api.post("/auth/signup", data);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

export const sendOTP = async (data) => {
  try {
    const res = await api.post("/auth/send-otp", data);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "OTP sending failed";
  }
};

export const logout = () => {
  const role = localStorage.getItem("role");

  // Remove only that role's token
  if (role) {
    localStorage.removeItem(`${role}_token`);
  }

  localStorage.removeItem("role");
  localStorage.removeItem("user_id");
};

export const isAuthenticated = () => {
  const role = localStorage.getItem("role");
  const token = role ? localStorage.getItem( `${role}_token`) : null;

  return Boolean(token);
};
