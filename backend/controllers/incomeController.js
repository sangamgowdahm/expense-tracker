import Income from "../models/Income.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as xlsx from 'xlsx';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// Add income source code here
export const addIncome = async (req, res) => {
  const userId = req.user._id; // Use _id, not id

  try {
    const { icon, source, amount, date } = req.body;

    // Validate required fields
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "Source, amount, and date are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();

    res.status(200).json(newIncome);
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get incomes source code here
export const getIncomes = async (req, res) => {
  const userId = req.user._id; // Use _id, not id

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// delete income source code here
export const deleteIncome = async (req, res) => {

  try{
    await Income.findByIdAndDelete(req.params.id);
    res.json({
      message: "Income deleted successfully",
    });
  }
  catch (error) {
    console.error("Error deleting income:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// download income excel source code here




import fs from 'fs';

export const downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      // Format date to string before writing to Excel
      Date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    // Set column widths for better display
    ws['!cols'] = [
      { wch: 25 }, // Source
      { wch: 15 }, // Amount
      { wch: 15 }, // Date
    ];

    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const filePath = path.join(__dirname, "../uploads/income_details.xlsx");
    xlsx.writeFile(wb, filePath);

    // Ensure file exists before downloading
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
