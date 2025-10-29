//UserContext.jsx
// import React, { createContext, useState } from "react";

// export const UserContext = createContext();

// export default function UserContextProvider(props) {
//   const [userInfo, setUserInfo] = useState({
//     userId: "",
//     email: "",
//     userName: "", // This can remain empty initially
//   });

//   return (
//     <UserContext.Provider value={{ userInfo, setUserInfo }}>
//       {props.children}
//     </UserContext.Provider>
//   );
// }

//UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
export const UserContext = createContext();
export default function UserContextProvider({ children }) {
  const [userInfo, setUserInfoState] = useState({
    userId: null,
    email: "",
    token: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) {
      setUserInfoState(JSON.parse(savedUser));
      setLoading(false);
    } else {
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        clearUserInfo();
        return;
      }

      const response = await fetch("https://www.stacklycloud.com/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const userData = {
          userId: data.id || null,
          email: data.email || "",
          token,
        };
        setUserInfo(userData);
      } else {
        clearUserInfo();
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      clearUserInfo();
    } finally {
      setLoading(false);
    }
  };

  const setUserInfo = (userData) => {
    const fullUserData = {
      ...userData,
      token: userData.token || localStorage.getItem("token") || "",
    };
    setUserInfoState(fullUserData);
    localStorage.setItem("userInfo", JSON.stringify(fullUserData));

    // Keep token in sync separately (helps with fetch calls)
    if (fullUserData.token) {
      localStorage.setItem("token", fullUserData.token);
    }
  };

  const clearUserInfo = () => {
    setUserInfoState({
      userId: null,
      email: "",
      token: "",
    });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, clearUserInfo, loading }}
    >
      {children}
    </UserContext.Provider>
  );
}



