import express from "express";

import * as expenseController from "../controllers/expenseController.js";
import * as expenseCategoryController from "../controllers/expenseCategoryController.js";

const router = express.Router();

// Create expense
router.post("/", expenseController.createExpense);
router.put("/:id", expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);
router.get("/", expenseController.getExpenses);
router.get("/summary", expenseController.getExpenseSummary);
router.get("/categories", expenseCategoryController.getAllExpenseCategories);

export default router;
