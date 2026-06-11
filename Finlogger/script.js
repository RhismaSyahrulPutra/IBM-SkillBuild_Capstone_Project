// Overview Cards
function renderExpenseOverview() {
  document.getElementById("totalExpenses").textContent =
    `$${expenseData.totalExpenses}`;

  document.getElementById("income").textContent = `$${user.income}`;

  document.getElementById("balance").textContent =
    `$${user.income - expenseData.totalExpenses}`;
}

// Expense Summary Table
function renderExpenseSummary() {
  const summaryTableBody = document.querySelector("#expense-summary tbody");

  summaryTableBody.innerHTML = "";

  expenseSummaryData.forEach((expenseCat) => {
    const row = document.createElement("tr");

    const categoryCell = document.createElement("td");
    categoryCell.textContent = expenseCat.categoryName;

    const percentageCell = document.createElement("td");
    percentageCell.textContent = expenseCat.percentage;

    row.append(categoryCell, percentageCell);
    summaryTableBody.appendChild(row);
  });
}

// Date Formatter
function updateDateFormat(date) {
  const d1 = new Date(date);

  const month = d1.toLocaleString("en-US", {
    month: "short",
  });

  const day = d1.getDate();

  const dayOfWeek = d1.toLocaleString("en-US", {
    weekday: "short",
  });

  return `${month} ${day}, ${dayOfWeek}`;
}

// Category Dropdown
function setCategoryDropdown() {
  const categoryDropdown = document.getElementById("category");

  expenseCategories.categories.forEach((item) => {
    const option = document.createElement("option");

    option.text = item;
    option.value = item;

    categoryDropdown.appendChild(option);
  });
}

// Expense Details Table
function renderExpenseData() {
  const tableBody = document.querySelector("#expenseTable tbody");

  tableBody.innerHTML = "";

  expenseData.expenses.forEach((expense) => {
    const row = document.createElement("tr");

    // Date
    const dateCell = document.createElement("td");
    dateCell.textContent = updateDateFormat(expense.date);
    dateCell.className = "text-nowrap";

    // Description
    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = expense.description;

    // Amount
    const amountCell = document.createElement("td");
    amountCell.textContent = `$${expense.amount}`;

    // Actions
    const actionCell = document.createElement("td");
    actionCell.innerHTML = `
      <a href="#" class="me-2 expButton edit-link"
         data-mode="edit"
         data-expense='${JSON.stringify(expense)}'>
        <img src="./images/edit.png" alt="Edit" class="action-icon">
      </a>
      <a href="#" class="delete-link"
         data-bs-toggle="modal"
         data-bs-target="#deleteModal">
        <img src="./images/delete.png" alt="Delete" class="action-icon">
      </a>
    `;

    row.append(dateCell, descriptionCell, amountCell, actionCell);
    tableBody.appendChild(row);
  });
}

// Add / Edit Expense Modal
function addExpenseHandler() {
  $(".expButton").click(function (event) {
    event.preventDefault();

    const mode = $(this).data("mode");

    if (mode === "edit") {
      const expense = $(this).data("expense");

      $("#modalTitle").text("Edit Expense");
      $("#date").val(expense.date.split("T")[0]);
      $("#category").val(expense.categoryName);
      $("#description").val(expense.description);
      $("#amount").val(expense.amount);
      $("#expense-submit-btn").text("Save Changes");
    } else {
      $("#modalTitle").text("Add Expense");
      $("#expense-submit-btn").text("Submit");
      $("#expenseForm")[0].reset();
    }

    $("#expenseModal").modal("show");
  });
}

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  renderExpenseOverview();
  renderExpenseSummary();
  renderExpenseData();
  setCategoryDropdown();

  // Tombol edit dibuat secara dinamis
  addExpenseHandler();

  document.getElementById("monthFilter").value = "2020-01";
});
