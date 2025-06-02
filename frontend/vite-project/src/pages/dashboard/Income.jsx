import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths"
import IncomeOverview from "../../components/income/IncomeOverview";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/income/AddIncomeForm";
import { toast } from "react-hot-toast";
import IncomeList from "../../components/income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";

const Income = () => {

  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  // Fetch income data
  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      if (response.data) {
        setIncomeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching income details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    if(!source.trim()){
      toast.error("Income source is required");
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
  await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
    source,
    amount,
    date,
    icon
  });
  setOpenAddIncomeModal(false);
  toast.success("Income added successfully");
  fetchIncomeDetails();

}catch(error){
  console.error("Error adding income:", error);
  toast.error("Failed to add income");
}

  };

  // Delete income
 // Delete Income
const deleteIncome = async (id) => {
  try {
    await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

    setOpenDeleteAlert({ show: false, data: null });
    toast.success("Income details deleted successfully");
    fetchIncomeDetails();
  } catch (error) {
    console.error(
      "Error deleting income:",
      error.response?.data?.message || error.message
    );
  }
};


  // Download income
  const handleDownloadIncomeDetails = async () => {
    try {
    const response = await axiosInstance.get(
      API_PATHS.INCOME.DOWNLOAD_INCOME,
      {
        responseType: "blob",
      }
    );

    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Income_details.xlsx");

    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    window.URL.revokeObjectURL(url);
    toast.success("Income report downloaded successfully");
  } catch (error) {
    console.error("Error downloading the Income report:", error);
    toast.error("Failed to download Income report");
  }
  
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />

            <IncomeList
            transactions={incomeData}
            onDelete={(id)=>{
              setOpenDeleteAlert({show: true, data: id});
            }}
            onDownload={handleDownloadIncomeDetails}
            />
          </div>
        </div>

<Modal
isOpen={openAddIncomeModal}
onClose={()=>setOpenAddIncomeModal(false)}
title='Add Income'
>
  <AddIncomeForm onAddIncome={handleAddIncome}/>
</Modal>

<Modal
isOpen={openDeleteAlert.show} 
onClose={()=>setOpenDeleteAlert({show: false, data: null})}
title='Delete Income'>

<DeleteAlert
content="ARe you Sure you want to delete this income"
onDelete={() =>deleteIncome(openDeleteAlert.data)}
/>
</Modal>

      </div>
    </DashboardLayout>
  );
};

export default Income;
