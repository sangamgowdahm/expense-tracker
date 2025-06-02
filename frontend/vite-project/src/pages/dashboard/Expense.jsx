import React from 'react'
import { useState,useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/Modal';
import ExpenseOverview from '../../components/expense/ExpenseOverview';
import AddExpenseForm from '../../components/expense/AddExpenseForm';
import { toast } from 'react-hot-toast';

import ExpenseList from '../../components/expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';


const Expense = () => {


   useUserAuth();
    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);



     // Fetch expense data
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.error("Error fetching expense details:", error);
    } finally {
      setLoading(false);
    }
  };

 // Add Expense
  const handleAddExpense = async (expense) => {
    const { category , amount, date, icon } = expense;

    if(!category.trim()){
      toast.error("Expense category is required");
      return;
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("amount should be valid number greater than 0");
      return;
    }
    if(!date){
      toast.error("Date is required");
      return;
    }

try{
  await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
    category,
    amount,
    date,
    icon
  });
  setOpenAddExpenseModal(false);
  toast.success("Income added successfully");
  fetchExpenseDetails();

}catch(error){
  console.error("Error adding Expense:", error);
  toast.error("Failed to add Expense");
}

  };
  
 // Delete Income
const deleteExpense = async (id) => {
  try {
    await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

    setOpenDeleteAlert({ show: false, data: null });
    toast.success("Expense details deleted successfully");
    fetchExpenseDetails();
  } catch (error) {
    console.error(
      "Error deleting Expense:",
      error.response?.data?.message || error.message
    );
  }
};


  // Download income
  const handleDownloadExpenseDetails = async () => {
      
    try {
    const response = await axiosInstance.get(
      API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
      {
        responseType: "blob",
      }
    );

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expense_details.xlsx");

    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    window.URL.revokeObjectURL(url);
    toast.success("Expense report downloaded successfully");
  } catch (error) {
    console.error("Error downloading the expense report:", error);
    toast.error("Failed to download expense report");
  }





  };



useEffect(() => {
    fetchExpenseDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
          <div className='grid grid-cols-1 gap-6'>
            <div className=''>
              <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={()=> setOpenAddExpenseModal(true)}
              />
            </div>

            <ExpenseList
            transactions={expenseData}
            onDelete={(id)=>{
              setOpenDeleteAlert({show: true, data: id});
            }}
            onDownload={handleDownloadExpenseDetails}
            />
          </div>

<Modal 
isOpen={openAddExpenseModal}
onClose={() => setOpenAddExpenseModal(false)}
title="Add Expense">

<AddExpenseForm 
onAddExpense={handleAddExpense}
/>
</Modal>

<Modal
isOpen={openDeleteAlert.show} 
onClose={()=>setOpenDeleteAlert({show: false, data: null})}
title='Delete Income'>

<DeleteAlert
content="ARe you Sure you want to delete this income"
onDelete={() =>deleteExpense(openDeleteAlert.data)}
/>
</Modal>





      </div>
       </DashboardLayout>
  );
  
}

export default Expense
