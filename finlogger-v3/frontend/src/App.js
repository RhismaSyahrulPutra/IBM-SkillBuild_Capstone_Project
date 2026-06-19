import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./App.css";

import Header from "./components/Header";
import Overview from "./components/Overview";
import ExpenseSummary from "./components/ExpenseSummary";
import ExpenseDetails from "./components/ExpenseDetails";

import { ExpenseModalProvider } from "./context/ExpenseModalContext";
import { Container, Row } from "react-bootstrap";

import { user } from "./data";
import { AppProvider, useAppContext } from "./context/AppContext";

// AppContent component
function AppContent() {
  const {
    month,
    expenseSummaryData,
    expenseDetailsData,
    totalExpenses,
    setMonth,
  } = useAppContext();

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <div className="App">
      <Header />
      <ExpenseModalProvider>
        <Container fluid="lg">
          <div>
            <Overview
              month={month}
              handleMonthChange={handleMonthChange}
              totalExpenses={totalExpenses}
              userIncome={user.income}
            />
          </div>
          <Row className="tbl-container">
            {/* render ExpenseSummary if expenseSummaryData data exists*/}
            {expenseSummaryData ? (
              <ExpenseSummary data={expenseSummaryData} />
            ) : (
              <div>Loading Expense Summary data...</div>
            )}
            {/* render ExpenseDetails if expenseDetailsData data exists*/}
            {expenseDetailsData ? (
              <ExpenseDetails
                data={
                  expenseDetailsData.expenses ||
                  expenseDetailsData.data ||
                  expenseDetailsData
                }
              />
            ) : (
              <div>Loading Expense Details data...</div>
            )}
          </Row>
        </Container>
      </ExpenseModalProvider>
    </div>
  );
}

// App component
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
