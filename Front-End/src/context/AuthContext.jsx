import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if a user is already logged in
  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch("/api/login/user");

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();

        setUser(data.success ? data.user : null);
      } catch (error) {
        console.error("Error checking logged in user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  // Save logged in user
  function login(userData) {
    setUser(userData);
  }

  // Update logged in user details
  function updateUser(updatedDetails) {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, ...updatedDetails } : null,
    );
  }

  // Log out user
  async function logout() {
    try {
      const response = await fetch("/api/header/logout", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok && data.success) setUser(null);

      return data;
    } catch (error) {
      console.error("Error logging out:", error);

      return {
        success: false,
        message: "Couldn't log out. Please try again.",
      };
    }
  }

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
