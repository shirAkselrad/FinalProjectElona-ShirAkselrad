import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //checking if there is any logged in user while the web starts
  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch("/api/login/user");
        if (!response.ok) {
          setUser(null);
          return;
        }
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else setUser(null);
      } catch (error) {
        console.log(
          "Error in checking if there is  already a logged in user, error: ",
          error,
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  //saving user details after login
  function login(userData) {
    setUser(userData);
  }

  //logout user
  async function logout() {
    try {
      const response = await fetch("/api/header/logout", {
        method: "GET",
      });
      if (!response.ok) console.error("http error, status: ", response.status);
      const data = await response.json();
      if (data.success) setUser(null);

      return data;
    } catch (error) {
      console.error("error logging out the user, error: ", error);
    }
  }
  const isAuthenticated = user !== null;
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
