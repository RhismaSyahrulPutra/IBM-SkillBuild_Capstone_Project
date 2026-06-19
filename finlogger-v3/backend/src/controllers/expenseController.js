import mongoose from "mongoose";
import Expense from "../models/expense.js";
import ExpenseCategory from "../models/expenseCategory.js";

// CREATE EXPENSE
export const createExpense = (req, res) => {
  const { user_id, description, amount, date, categoryName } = req.body;

  ExpenseCategory.findOne({ name: categoryName })
    .then((category) => {
      if (!category) {
        return res.status(400).json({
          error: "Category not found.",
        });
      }

      return Expense.create({
        user_id,
        description,
        amount,
        date,
        category_id: category._id,
      });
    })
    .then((expense) => {
      if (!expense) return;

      return res.status(201).json({
        id: expense._id,
        message: "Expense created successfully.",
      });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
          message: "Validation failed.",
          details: error.errors,
        });
      }

      console.error("Error creating expense:", error);

      return res.status(500).json({
        error: "Server error.",
      });
    });
};

// GET EXPENSES
export const getExpenses = (req, res) => {
  const { userId, month } = req.query;

  let dateFilter = {};

  if (month) {
    const [year, monthPart] = month.split("-");

    const startDate = new Date(Date.UTC(year, monthPart - 1, 1, 0, 0, 0));

    const endDate = new Date(Date.UTC(year, monthPart, 0, 23, 59, 59));

    dateFilter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  }

  const userFilter = userId ? { user_id: userId } : {};

  Expense.aggregate([
    {
      $match: {
        ...dateFilter,
        ...userFilter,
      },
    },
    {
      $lookup: {
        from: "expense_categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        date: 1,
        amount: 1,
        description: 1,
        categoryName: "$category.name",
      },
    },
    {
      $sort: {
        date: -1,
      },
    },
  ])
    .then((expenses) => {
      const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );

      return res.status(200).json({
        totalExpenses,
        expenses,
      });
    })
    .catch((error) => {
      console.error("Error fetching expenses:", error);

      return res.status(500).json({
        error: "Server error.",
      });
    });
};

// UPDATE EXPENSE
export const updateExpense = (req, res) => {
  const { description, amount, date, categoryName } = req.body;

  ExpenseCategory.findOne({ name: categoryName })
    .then((category) => {
      if (!category) {
        return res.status(400).json({
          error: "Category not found.",
        });
      }

      return Expense.findByIdAndUpdate(
        req.params.id,
        {
          description,
          amount,
          date,
          category_id: category._id,
        },
        { new: true },
      );
    })
    .then((updatedExpense) => {
      if (!updatedExpense) {
        return res.status(404).json({
          error: "Expense not found.",
        });
      }

      return res.status(200).json({
        message: "Expense updated successfully.",
      });
    })
    .catch((error) => {
      console.error("Error updating expense:", error);

      return res.status(500).json({
        error: "Server error.",
      });
    });
};

// DELETE EXPENSE
export const deleteExpense = (req, res) => {
  Expense.findByIdAndDelete(req.params.id)
    .then((expense) => {
      if (!expense) {
        return res.status(404).json({
          error: "Expense not found.",
        });
      }

      return res.status(200).json({
        message: "Expense deleted successfully.",
        deletedExpense: expense,
      });
    })
    .catch((error) => {
      console.error("Error deleting expense:", error);

      return res.status(500).json({
        error: "Server error.",
      });
    });
};
// GET EXPENSE SUMMARY
export const getExpenseSummary = (req, res) => {
  const { userId, month } = req.query;

  let dateFilter = {};

  if (month) {
    const [year, monthPart] = month.split("-");

    const startDate = new Date(Date.UTC(year, monthPart - 1, 1, 0, 0, 0));

    const endDate = new Date(Date.UTC(year, monthPart, 0, 23, 59, 59));

    dateFilter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  }

  const userFilter = userId ? { user_id: userId } : {};

  Expense.aggregate([
    {
      $match: {
        ...userFilter,
        ...dateFilter,
      },
    },
    {
      $lookup: {
        from: "expense_categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $group: {
        _id: "$category_id",
        categoryName: {
          $first: "$category.name",
        },
        categoryExpense: {
          $sum: "$amount",
        },
      },
    },
    {
      $group: {
        _id: null,
        totalExpense: {
          $sum: "$categoryExpense",
        },
        categories: {
          $push: {
            category_id: "$_id",
            categoryName: "$categoryName",
            categoryExpense: "$categoryExpense",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        categories: {
          $map: {
            input: "$categories",
            as: "cat",
            in: {
              categoryName: "$$cat.categoryName",
              percentage: {
                $multiply: [
                  {
                    $divide: ["$$cat.categoryExpense", "$totalExpense"],
                  },
                  100,
                ],
              },
            },
          },
        },
      },
    },
    {
      $unwind: "$categories",
    },
    {
      $replaceRoot: {
        newRoot: "$categories",
      },
    },
    {
      $sort: {
        categoryName: 1,
      },
    },
  ])
    .then((expenseSummary) => {
      expenseSummary.forEach((item) => {
        item.percentage = `${item.percentage.toFixed(2)}%`;
      });

      return res.status(200).json(expenseSummary);
    })
    .catch((error) => {
      console.error("Error fetching expense summary:", error);

      return res.status(500).json({
        error: "Server error.",
      });
    });
};
