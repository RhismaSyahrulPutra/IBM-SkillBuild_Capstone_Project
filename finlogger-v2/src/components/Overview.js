import OverviewCard from "./OverviewCard.js";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useExpenseModal } from "../context/ExpenseModalContext.js";

function Overview({ month, handleMonthChange, totalExpenses, userIncome }) {
  const { handleShow } = useExpenseModal();

  return (
    <div>
      <Row>
        <Col md="6">
          <h5 className="mt-1 mb-2 overview-hd">OVERVIEW</h5>
        </Col>

        <Col md="6">
          <Button
            variant="primary"
            className="ml-4 float-end"
            onClick={() => handleShow("add")}
          >
            Add Expense
          </Button>

          <Form.Control
            type="month"
            id="monthFilter"
            defaultValue={month}
            onChange={handleMonthChange}
          />
        </Col>
      </Row>

      <Row>
        <Col md="4">
          <OverviewCard
            {...{
              cardIcon: "spending.png",
              cardText: "Expenses",
              cardTitle: totalExpenses,
            }}
          />
        </Col>

        <Col md="4">
          <OverviewCard
            {...{
              cardIcon: "income.png",
              cardText: "Monthly Income",
              cardTitle: userIncome,
            }}
          />
        </Col>

        <Col md="4">
          <OverviewCard
            {...{
              cardIcon: "balance.png",
              cardText: "Balance",
              cardTitle: userIncome - totalExpenses,
            }}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Overview;
