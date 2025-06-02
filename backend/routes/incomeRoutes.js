import express from 'express';
import { getIncomes, addIncome, deleteIncome, downloadIncomeExcel } from '../controllers/incomeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to add a new income
router.post('/add', protect, addIncome);

// Route to get all incomes
router.get('/get', protect, getIncomes); 

// Route to download income data as Excel
router.get('/downloadexcel', protect, downloadIncomeExcel);

// Route to delete an income
router.delete('/:id', protect, deleteIncome);

export default router;
