import { expenseCategories } from "../data";
import { useExpenseModal } from "../context/ExpenseModalContext";
import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";

function ExpenseModal() {
  const { showModal, modalMode, modalData, handleClose } = useExpenseModal();
  const [validated, setValidated] = useState(false);
  const categories = expenseCategories.categories.map((item) => {
    return (
      <option value={item} key={item}>
        {item}
      </option>
    );
  });
  const handleSubmit = (event) => {
    const form = document.getElementById("expenseForm");
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    setValidated(false);

    if (modalMode === "add") {
      console.log("Submit Expense");
    } else {
      console.log("Save Expense");
    }
    handleClose();
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
