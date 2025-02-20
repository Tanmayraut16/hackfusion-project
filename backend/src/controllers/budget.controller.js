import Budget from "../models/budget.model.js";
import ExpenseLog from "../models/expenseLog.model.js";

/**
 * Create a new budget allocation.
 * Expected req.body:
 * {
 *   category,         // "event", "department", or "mess"
 *   amount,
 *   allocated_by,     // ObjectId of the allocator
 *   allocatedByModel  // "Faculty" or "Admin"
 * }
 */
export const createBudget = async (req, res) => {
  try {
    const { category, amount, allocated_by, allocatedByModel } = req.body;

    const budget = new Budget({
      category,
      amount,
      allocated_by,
      allocatedByModel,
    });
    await budget.save();
    return res.status(201).json({ success: true, data: budget });
  } catch (error) {
    console.error("Error in createBudget:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get all budgets.
 */
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().populate("allocated_by");
    return res.status(200).json({ success: true, data: budgets });
  } catch (error) {
    console.error("Error in getBudgets:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get a single budget by its ID.
 */
export const getBudgetById = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findById(id).populate("allocated_by");
    if (!budget) {
      return res
        .status(404)
        .json({ success: false, error: "Budget not found" });
    }
    return res.status(200).json({ success: true, data: budget });
  } catch (error) {
    console.error("Error in getBudgetById:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Create a new expense log for a given budget.
 * Expected req.body:
 * {
 *   description,
 *   amount_spent,
 *   proof_url  // optional
 * }
 */
export const createExpenseLog = async (req, res) => {
  try {
    const { id } = req.params; // Budget ID
    const { description, amount_spent, proof_url } = req.body;

    // Fetch the budget document from the Budget schema
    const budget = await Budget.findById(id);
    if (!budget) {
      return res
        .status(404)
        .json({ success: false, error: "Budget not found" });
    }

    // Retrieve the allocated amount from the budget schema
    const allocatedAmount = budget.amount;

    // Validate that the expense does not exceed the allocated budget
    if (amount_spent > allocatedAmount) {
      return res.status(400).json({
        success: false,
        error: "Expense amount exceeds allocated budget",
      });
    }

    // Check if a duplicate expense log already exists for the same budget
    const existingExpense = await ExpenseLog.findOne({
      budget: id,
      description,
      amount_spent,
      proof_url,
    });
    if (existingExpense) {
      return res.status(400).json({
        success: false,
        error: "Duplicate expense log exists for this budget",
      });
    }

    // Create the expense log using the provided data
    const expenseLog = new ExpenseLog({
      budget: id,
      description,
      amount_spent,
      proof_url,
    });
    await expenseLog.save();

    // (Optional) Update the budget's remaining amount if you want to track expenses
    // For example:
    // budget.amount = allocatedAmount - amount_spent;
    // await budget.save();

    return res.status(201).json({ success: true, data: expenseLog });
  } catch (error) {
    console.error("Error in createExpenseLog:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Get all expense logs for a specific budget.
 */
export const getExpenseLogs = async (req, res) => {
  try {
    const { id } = req.params; // Budget ID
    const logs = await ExpenseLog.find({ budget: id });
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("Error in getExpenseLogs:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getAllExpenseLogs = async (req, res) => {
  try {
    const logs = await ExpenseLog.find();
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("Error in getAllExpenseLogs:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
