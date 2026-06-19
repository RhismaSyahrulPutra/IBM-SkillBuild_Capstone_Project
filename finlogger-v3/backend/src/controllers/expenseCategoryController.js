import ExpenseCategory from "../models/expenseCategory.js";

// GET ALL EXPENSE CATEGORIES
export const getAllExpenseCategories = (req, res) => {
  ExpenseCategory.find({}, "name")
    .then((categories) => {
      const categoryNames = categories.map((category) => category.name);

      return res.status(200).json({
        categories: categoryNames,
      });
    })
    .catch((error) => {
      console.error("Error fetching expense categories:", error);

      return res.status(500).json({
        error: "Server error.",
      });
    });
};
