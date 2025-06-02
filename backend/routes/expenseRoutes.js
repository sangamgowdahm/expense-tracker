import express from 'express';
import { getAllExpenses, addExpense, deleteExpense, downloadExpenseExcel } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to add a new income
router.post('/add', protect, addExpense);

// Route to get all incomes
router.get('/get', protect, getAllExpenses); 

// Route to download income data as Excel
router.get('/downloadexcel', protect, downloadExpenseExcel);

// Route to delete an income
router.delete('/:id', protect, deleteExpense);

export default router;
