import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const NotapprovedSellerAC = createContext();//AC => auth controller

export const NotapprovedSellerACProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //  FETCH FROM BACKEND
  const fetchUser = async () => {
    try {
      const token =
        localStorage.getItem("seller_token") ||
        localStorage.getItem("admin_token") ||
        localStorage.getItem("buyer_token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await axios.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);

      //  update localStorage also
      localStorage.setItem("user", JSON.stringify(res.data));

    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(); // 🔥 THIS IS THE KEY FIX
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};