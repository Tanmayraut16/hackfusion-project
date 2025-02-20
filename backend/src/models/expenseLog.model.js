// backend/src/models/ExpenseLog.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const expenseLogSchema = new Schema(
  {
    budget: {
      type: Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount_spent: {
      type: Number,
      required: true,
    },
    proof_url: {
      type: String,
    },
    spent_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

export default model("ExpenseLog", expenseLogSchema);
