import { Table, Col } from "react-bootstrap";

function ExpenseSummary({ data }) {
  console.log("Length of data:", data.length);
  const tableItems = data.map((dataRow) => {
    return (
      <tr key={dataRow.categoryName}>
        <td>{dataRow.categoryName}</td>
        <td>{dataRow.percentage}</td>
      </tr>
    );
  });

  return (
    <Col md="4">
      <p className="heading">Expense Summary</p>

      <Table striped bordered hover id="expense-summary">
        <thead>
          <tr>
            <th>EXPENSE CATEGORY</th>
            <th>%</th>
          </tr>
        </thead>

        <tbody>{tableItems}</tbody>
      </Table>
    </Col>
  );
}

export default ExpenseSummary;
