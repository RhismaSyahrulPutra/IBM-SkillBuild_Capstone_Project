import React, { createContext, useContext, useState, useEffect } from "react";
import {
  expenseSummaryData as summaryData,
  expenseData,
  expenseCategories as categoriesData,
} from "../data";
import ToastNotification from "../components/ToastNotification";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [month, setMonth] = useState("2020-01");
  const [expenseSummaryData, setExpenseSummaryData] = useState(null);
  const [expenseDetailsData, setExpenseDetailsData] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenseCategories, setExpenseCategories] = useState(null);
  const [expenseIdToBeDeleted, setExpenseIdToBeDeleted] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (message) => {
    setToast({ show: true, message: message });
  };
  const hideToast = () => {
    setToast({ show: true, message: "" });
  };

  const fetchExpenseCategories = async () => {
    try {
      const response = await fetch("http://localhost:3001/expenses/categories");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setExpenseCategories(data.categories);
    } catch (error) {
      console.error("Error fetching Expense Categories:", error);
    }
  };
  const fetchExpenseData = async () => {
    try {
      const responseSummary = await fetch(
        `http://localhost:3001/expenses/summary?userId=USER_1&month=${month}`,
      );
      if (!responseSummary.ok) {
        throw new Error(`HTTP error! Status: ${responseSummary.status}`);
      }
      const dataSummary = await responseSummary.json();
      setExpenseSummaryData(dataSummary);
    } catch (error) {
      console.error("Error Fetching Summary Data:", error);
    }
    try {
      const responseDetails = await fetch(
        `http://localhost:3001/expenses?userId=USER_1&month=${month}`,
      );
      if (!responseDetails.ok) {
        throw new Error(`HTTP error! Status: ${responseDetails.status}`);
      }
      const dataDetails = await responseDetails.json();
      setExpenseDetailsData(dataDetails);
      setTotalExpenses(dataDetails.totalExpenses);
    } catch (error) {
      console.error("Error Fetching Expense Details Data:", error);
    }
  };

  useEffect(() => {
    fetchExpenseData();
  }, [month]);

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  return (
    <AppContext.Provider
      value={{
        month,
        expenseSummaryData,
        expenseDetailsData,
        totalExpenses,
        expenseCategories,
        expenseIdToBeDeleted,
        setMonth,
        setExpenseIdToBeDeleted,
        fetchExpenseData,
        showToast,
      }}
    >
      {children}
      <ToastNotification
        show={toast.show}
        message={toast.message}
        onClose={hideToast}
      />
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
