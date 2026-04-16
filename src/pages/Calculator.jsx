import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { categories } from "../Components/CategorySelector";

import Header from "../Components/Header";
import AddTransaction from "../Components/AddTransaction";
import TransactionList from "../Components/TransactionList";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import "./index.css";

const Calculator = ({ transactions, setTransactions, user, setUser }) => {
  const [incometype, setIncomeType] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [UsdRate, setUsdRate] = useState(0);
  const [Filter, setFilter] = useState("All");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // const navigate = useNavigate();

  useEffect(() => {
    CurrConversion();
  }, []);

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
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", user.uid),
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(data);
    };

    fetchData();
  }, [user]);

  if (loading) return <h2>Loading...</h2>;

  async function CurrConversion() {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    const result = await response.json();
    setUsdRate(result.rates.INR);
  }

  async function AddIncome() {
  if (!user) {
    alert("Please login first 🔐");
    return;
  }

  let ConvertedAmout = Number(amount);

  if (currency === "USD") {
    ConvertedAmout = Number(amount) * UsdRate;
  }

  ConvertedAmout = Math.round(ConvertedAmout * 100) / 100;

  const obj = {
    Title: description,
    currencyType: currency,
    type: incometype,
    TransactionAmount: ConvertedAmout,
    category: category,
    userId: user.uid,
  };

  const docRef = await addDoc(collection(db, "transactions"), obj);

  const newObj = {
    ...obj,
    id: docRef.id, 
  };

  setTransactions((prev) => [...prev, newObj]); 

  setIncomeType("");
  setCurrency("");
  setAmount("");
  setDescription("");
  setCategory("");
}

  const totalIncome = transactions.reduce(
    (acc, obj) => (obj.type === "income" ? acc + obj.TransactionAmount : acc),
    0,
  );
  const totalExpense = transactions.reduce(
    (acc, obj) => (obj.type === "expense" ? acc + obj.TransactionAmount : acc),
    0,
  );
  const totalBalance = totalIncome - totalExpense;

  const filterTransaction =
    Filter === "All"
      ? transactions
      : transactions.filter((obj) => obj.currencyType === Filter);

  async function DeleteTrans(id) {
  try {
    // if (typeof id !== "string") {
    //   alert("Old invalid transaction ❌ delete from Firebase manually");
    //   return;
    // }

    await deleteDoc(doc(db, "transactions", id));

    setTransactions((prev) =>
      prev.filter((item) => item.id !== id)
    );
  } catch (error) {
    console.error("Delete error:", error);
  }
}

  return (
    <div className="Container">
      <h1>Budget Tracker</h1>
      <p>Track your income and expenses in multiple currencies</p>

      <Header
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        UsdRate={UsdRate}
      />

      <div className="Transaction_box">
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
        <TransactionList
          filterTransaction={filterTransaction}
          setFilter={setFilter}
          DeleteTrans={DeleteTrans}
        />
      </div>
    </div>
  );
};

export default Calculator;
