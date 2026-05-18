import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

import Header from "../Components/Header";
import AddTransaction from "../Components/AddTransaction";
import TransactionList from "../Components/TransactionList";
import AIAdvisor from "../Components/Charts/AIAdvisor";
import ScenarioLab from "../Components/ScenarioLab";
import WeeklyStreak from "../Components/WeeklyStreak";
import ExportToolbar from "../Components/ExportToolbar";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import "./index.css";

const Calculator = ({ transactions, setTransactions, user, setUser }) => {
  const [incometype, setIncomeType] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [UsdRate, setUsdRate] = useState(0);
  const [Filter, setFilter] = useState("All");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { CurrConversion(); }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  async function CurrConversion() {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const result = await response.json();
      setUsdRate(result.rates.INR);
    } catch (err) {
      console.error("Currency fetch failed:", err);
    }
  }

  async function AddIncome() {
    if (!user) { alert("Please login first 🔐"); return; }

    let convertedAmount = Number(amount);
    if (currency === "USD") convertedAmount = Number(amount) * UsdRate;
    convertedAmount = Math.round(convertedAmount * 100) / 100;

    const obj = {
      Title: description,
      currencyType: currency,
      type: incometype,
      TransactionAmount: convertedAmount,
      category: category,
      userId: user.uid,
      createdAt: Date.now(),
    };

    try {
      const docRef = await addDoc(collection(db, "transactions"), obj);
      setTransactions((prev) => [...prev, { ...obj, id: docRef.id }]);
      setIncomeType("");
      setCurrency("INR");
      setAmount("");
      setDescription("");
      setCategory("");
    } catch (err) {
      console.error("Failed to add transaction:", err);
      alert("Failed to add transaction. Please try again.");
    }
  }

  const totalIncome = transactions.reduce(
    (acc, obj) => (obj.type === "income" ? acc + obj.TransactionAmount : acc), 0
  );
  const totalExpense = transactions.reduce(
    (acc, obj) => (obj.type === "expense" ? acc + obj.TransactionAmount : acc), 0
  );
  const totalBalance = totalIncome - totalExpense;

  const filterTransaction =
    Filter === "All"
      ? transactions
      : transactions.filter((obj) => obj.currencyType && obj.currencyType === Filter);

  async function DeleteTrans(id) {
    try {
      await deleteDoc(doc(db, "transactions", id));
      setTransactions((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete. Please try again.");
    }
  }

  const mappedTransactions = transactions.map((t) => ({
    description: t.Title || "",
    amount: t.TransactionAmount || 0,
    category: t.category || "Other",
    type: t.type,
  }));

  return (
    <div className="Container dashboard-with-advisor">
      <div className="page-hero">
        <h1>Budget Tracker</h1>
        <p>Track your income and expenses in multiple currencies</p>
      </div>

      <Header
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        UsdRate={UsdRate}
        onRefreshRate={CurrConversion}
      />

      <div className="Transaction_box">
        <div className="left-panel">
          <AddTransaction
            incometype={incometype}
            setIncomeType={setIncomeType}
            currency={currency}
            setCurrency={setCurrency}
            amount={amount}
            setAmount={setAmount}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            AddIncome={AddIncome}
            user={user}
          />
        </div>

        <div className="right-panel">
          <TransactionList
            filterTransaction={filterTransaction}
            setFilter={setFilter}
            DeleteTrans={DeleteTrans}
            activeFilter={Filter}
          />
        </div>
      </div>

      <section className="dashboard-insights-section" aria-label="Insights and exports">
        <div className="dashboard-insights-grid">
          <ScenarioLab baseIncome={totalIncome} baseExpense={totalExpense} />
          <WeeklyStreak transactions={transactions} />
          <div className="tool-card export-toolbar-card">
            <div className="tool-card-head">
              <h2 className="tool-card-title">Export reports</h2>
              <p className="tool-card-desc">Download your data as CSV or a PDF summary</p>
            </div>
            <ExportToolbar
              transactions={transactions}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              totalBalance={totalBalance}
            />
          </div>
        </div>
      </section>

      <section
        className="advisor-page-section"
        aria-labelledby="advisor-main-heading"
      >
        <AIAdvisor
          income={totalIncome}
          expenses={mappedTransactions}
        />
      </section>
    </div>
  );
};

export default Calculator;
