import { Table, Col } from "react-bootstrap";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useState } from "react";
import { useExpenseModal } from "../context/ExpenseModalContext";
import { useAppContext } from "../context/AppContext";

function updateDateFormat(date) {
  const d1 = new Date(date);
  const month = d1.toLocaleString("en-us", { month: "short" });
  const day = d1.getDate();
  const dayOfWeek = d1.toLocaleString("en-us", { weekday: "short" });

  return `${month} ${day}, ${dayOfWeek}`;
}

function ExpenseDetails({ data }) {
  const { handleShow } = useExpenseModal();
  const { setExpenseIdToBeDeleted } = useAppContext();

  const [showDM, setShowDM] = useState(false);

  const handleEdit = (event, expense) => {
    event.preventDefault();
    handleShow("edit", expense);
  };

  const handleDMShow = (event, expenseId) => {
    event.preventDefault();
    setShowDM(true);
    setExpenseIdToBeDeleted(expenseId);
  };

  const handleDMClose = () => {
    setShowDM(false);
  };

  const handleDelete = () => {
    // Add your delete logic here
    handleDMClose();
  };

  const tableItems = data.map((expense) => {
    return (
      <tr key={expense._id}>
        <td className="text-nowrap">{updateDateFormat(expense.date)}</td>

        <td>{expense.description}</td>

        <td>${expense.amount}</td>

        <td>
          <button
            type="button"
            className="me-2 edit expButton border-0 bg-transparent"
            onClick={(e) => handleEdit(e, expense)}
          >
            <img src="./images/edit.png" alt="Edit" />
          </button>

          <button
            type="button"
            className="delete border-0 bg-transparent"
            onClick={(e) => handleDMShow(e, expense._id)}
          >
            <img src="./images/delete.png" alt="Delete" />
          </button>
        </td>
      </tr>
    );
  });

  return (
    <Col md="8">
      <p className="heading">Expense Details</p>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th width="31%">DATE</th>
            <th width="31%">DESCRIPTION</th>
            <th width="31%">AMOUNT</th>
            <th width="7%" className="editDeleteTd"></th>
          </tr>
        </thead>

        <tbody>{tableItems}</tbody>
      </Table>

      {showDM && (
        <DeleteConfirmationModal
          showDM={showDM}
          handleDMClose={handleDMClose}
          handleDelete={handleDelete}
        />
      )}
    </Col>
  );
}

export default ExpenseDetails;
