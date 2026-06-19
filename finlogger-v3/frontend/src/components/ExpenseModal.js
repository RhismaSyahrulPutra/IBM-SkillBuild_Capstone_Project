import { expenseCategories } from "../data";
import { useExpenseModal } from "../context/ExpenseModalContext";
import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";

function ExpenseModal() {
  const { showModal, modalMode, modalData, handleClose } = useExpenseModal();
  const [validated, setValidated] = useState(false);
  const { expenseCategories, fetchExpenseData, showToast } = useAppContext();

  const categories = expenseCategories.categories.map((item) => {
    return (
      <option value={item} key={item}>
        {item}
      </option>
    );
  });
  // Prepare expense data for API call

  const handleSubmit = (event) => {
    const form = document.getElementById("expenseForm");
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    setValidated(false);

    // Prepare expense data for API call
    const expenseData = {
      user_id: "USER_1",
      description: document.getElementById("expenseDescription").value,
      amount: parseFloat(document.getElementById("expenseAmount").value),
      date: document.getElementById("expenseFormDate").value,
      categoryName: document.getElementById("expenseCategoryName").value,
    };

    // Set API Url and method based on modalMode
    const apiURL =
      modalMode === "add"
        ? "http://localhost:3001/expenses"
        : `http://localhost:3001/expenses/${modalData._id}`;

    const method = modalMode === "add" ? "POST" : "PUT";

    // Make API call to add or edit expense
    fetch(apiURL, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log(
          modalMode === "add"
            ? "Expense submitted successfully:"
            : "Expense saved successfully:",
          result,
        );
        showToast(
          modalMode === "add"
            ? "Expense submitted successfully!"
            : "Expense saved successfully!",
        );
        fetchExpenseData();
        handleClose();
      })
      .catch((error) => {
        console.error(
          modalMode === "add"
            ? "Error submitting expense:"
            : "Error saving expense:",
          error,
        );
        showToast(
          modalMode === "add"
            ? "Error submitting expense!"
            : "Error saving expense!",
        );
      });
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalMode === "add" ? "Add Expense" : "Edit Expense"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} id="expenseForm">
          <Form.Group controlId="expenseForm.dateInput" className="mb-1">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              required
              defaultValue={
                modalMode === "add" ? "" : modalData.date.split("T")[0]
              }
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid date.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="expenseForm.category" className="mb-1">
            <Form.Label>Category</Form.Label>
            <Form.Select
              defaultValue={modalMode === "add" ? "" : modalData.categoryName}
              required
            >
              <option value="">--Select Category--</option>
              {categories}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select a category.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="expenseForm.description" className="mb-1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description"
              required
              defaultValue={modalMode === "add" ? "" : modalData.description}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a description.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="expenseForm.amount" className="mb-1">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount"
              required
              defaultValue={modalMode === "add" ? "" : modalData.amount}
            />
            <Form.Control.Feedback type="invalid">
              Please provide an amount.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" onClick={handleSubmit}>
          {modalMode === "add" ? "Submit" : "Save Changes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ExpenseModal;
