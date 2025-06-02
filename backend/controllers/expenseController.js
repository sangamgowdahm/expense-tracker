import Expense from "../models/Expense.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as xlsx from 'xlsx';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// Add Expense source code here
export const addExpense = async (req, res) => {
  const userId = req.user._id; 

  try {
    const { icon, category, amount, date } = req.body;

    // Validate required fields
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "Source, amount, and date are required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();

    res.status(200).json(newExpense);
  } catch (error) {
    console.error("Error adding Expense:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get incomes source code here
export const getAllExpenses = async (req, res) => {
  const userId = req.user._id; // Use _id, not id

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// delete expense source code here
export const deleteExpense = async (req, res) => {

  try{
    await Expense.findByIdAndDelete(req.params.id);
    res.json({
      message: "Expense deleted successfully",
    });
  }
  catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// download income excel source code here

import fs from "fs";

export const downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel with formatted date
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    // Set column widths for better visibility
    ws['!cols'] = [
      { wch: 25 }, // Category
      { wch: 15 }, // Amount
      { wch: 15 }, // Date
    ];

    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const filePath = path.join(__dirname, "../uploads/expense_details.xlsx");
    xlsx.writeFile(wb, filePath);

    fs.exists(filePath, (exists) => {
      if (exists) {
        res.download(filePath);
      } else {
        res.status(500).json({ message: "File not created" });
      }
    });

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};