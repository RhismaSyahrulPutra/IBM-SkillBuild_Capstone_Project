import React, { createContext, useContext, useState } from "react";
import ExpenseModal from "../components/ExpenseModal";

const ExpenseModalContext = createContext();

export const ExpenseModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [modalData, setModalData] = useState({
    _id: "",
    description: "",
    amount: 0,
    date: "",
    categoryName: "",
  });

  const handleShow = (mode, data) => {
    setShowModal(true);
    setModalMode(mode);
    setModalData(data);
  };

  const handleClose = () => {
    setShowModal(false);
    setModalMode(null);
    setModalData({
      _id: "",
      description: "",
      amount: 0,
      date: "",
      categoryName: "",
    });
  };

  return (
    <ExpenseModalContext.Provider
      value={{
        showModal,
        modalMode,
        modalData,
        handleShow,
        handleClose,
      }}
    >
      {children}
      {showModal && <ExpenseModal />}
    </ExpenseModalContext.Provider>
  );
};

export const useExpenseModal = () => {
  return useContext(ExpenseModalContext);
};
