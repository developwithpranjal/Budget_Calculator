import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Components/Router.jsx";
import "./pages/index.css";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(undefined); // ⚠️ very important

  // 🔥 Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u ? u : null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router
      transactions={transactions}
      setTransactions={setTransactions}
      user={user}
      setUser={setUser}
    />
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);