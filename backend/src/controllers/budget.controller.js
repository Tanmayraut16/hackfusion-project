import mongoose from "mongoose";
import Budget from "../models/budget.model.js";
import Expense from "../models/expenseLog.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
    }

    const userId = req.user._id; // Ensure req.user is properly set

    const {title, category, amount, allocatedByModel } = req.body;

    if (!category || !amount || !allocatedByModel) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const budget = new Budget({
      title,
      category,
      amount,
      allocated_by: userId,
      allocatedByModel,
    });

    await budget.save();
    return res.status(201).json({ success: true, data: budget });
  } catch (error) {
    console.error("Error in createBudget:", error);
    return res.status(500).json({ success: false, error: error.message });
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
    const budgetId = req.params.id;
    // Ensure ID format is valid
    if (!mongoose.Types.ObjectId.isValid(budgetId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Budget ID" });
    }

    // Fetch budget
    const budget = await Budget.findById(budgetId);
    // console.log(budget);
    if (!budget) {
      return res
        .status(404)
        .json({ success: false, message: "Budget not found" });
    }

    // Fetch related expenses
    const expenses = await Expense.find({ budget: budgetId });
    
    // Return data
    res.json({
      success: true,
      data: {
        ...budget.toObject(),
        expenses,
      },
    });
  } catch (error) {
    console.error("Error fetching budget:", error.message); // Log the error
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const createExpenseLog = async (req, res) => {
  try {
    const { id } = req.params; // Budget ID
    console.log(id);
    
    const { description, amount_spent } = req.body;

    const file = file;
    

    // Validate amount_spent
    if (isNaN(amount_spent) || amount_spent <= 0) {
      return res.status(400).json({ success: false, error: "Invalid expense amount" });
    }

    // Validate file upload
    if (!file) {
      return res.status(400).json({ success: false, error: "Proof file is required" });
    }

    // const fileBuffer = getDataUri(file);
    const result = await uploadOnCloudinary(file.path);
    logger.info("Cloudinary upload result:", result);

    // Handle Cloudinary upload failure
    if (!result || !result.secure_url) {
      return res.status(500).json({ success: false, error: "File upload failed" });
    }

    // Fetch the budget document
    const budget = await Budget.findById(id);
    if (!budget) {
      return res.status(404).json({ success: false, error: "Budget not found" });
    }

    // Validate expense limit
    if (amount_spent > budget.amount) {
      return res.status(400).json({
        success: false,
        error: "Expense amount exceeds allocated budget",
      });
    }

    

    // Create and save the expense log
    const expenseLog = new Expense({
      budget: id,
      description,
      amount_spent,
      proof_url: result.url,
    });

    await expenseLog.save();

    // Update the budget amount 
    budget.amount -= amount_spent;
    await budget.save();

  
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
    const logs = await Expense.find({ budget: id });
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("Error in getExpenseLogs:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getAllExpenseLogs = async (req, res) => {
  try {
    const logs = await Expense.find();
    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("Error in getAllExpenseLogs:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export const updateBudgetStatus = async (req, res) => {
  try {
    const { id, status } = req.body; // Get ID and status from request body

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const budget = await Budget.findById(id);
    if (!budget) return res.status(404).json({ error: "Budget not found" });

    budget.status = status;
    await budget.save();

    res.status(200).json({ message: `Budget successfully ${status}`, budget });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
