import React, { createContext, useContext, useState, useEffect } from "react";
import {
  expenseSummaryData as summaryData,
  expenseData,
  expenseCategories as categoriesData,
} from "../data";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [month, setMonth] = useState("2020-01");
  const [expenseSummaryData, setExpenseSummaryData] = useState(null);
  const [expenseDetailsData, setExpenseDetailsData] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenseCategories, setExpenseCategories] = useState(null);
  const [expenseIdToBeDeleted, setExpenseIdToBeDeleted] = useState(null);

  const fetchExpenseCategories = async () => {
    setExpenseCategories(categoriesData.categories);
  };

  const fetchExpenseData = async () => {
    setExpenseSummaryData(summaryData);
    setTotalExpenses(expenseData.totalExpenses);
    setExpenseDetailsData(expenseData.expenses);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
