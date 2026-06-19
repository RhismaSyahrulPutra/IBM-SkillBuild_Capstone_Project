import mongoose from "mongoose";

// Schema untuk collection expense_categories
const expenseCategorySchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
  },
  {
    collection: "expense_categories",
  },
);

// Model
const ExpenseCategory = mongoose.model(
  "ExpenseCategory",
  expenseCategorySchema,
);

// Export model
export default ExpenseCategory;
