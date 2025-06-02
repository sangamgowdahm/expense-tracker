export const validateEmail = (email) => {
  const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export const getInitials = (name) => {
  if (!name) return "";
  const words = name.split(" ");
  let initials = "";

  for(let i=0;i<Math.min(words.length,2);i++){
    initials+=words[i][0];

  }
return initials.toUpperCase();
};


export const addThousandsSeparators = (num) => {
if(num==null || isNaN(num)) return "";


const[integerPart,fractionalPart] = num.toString().split(".");
const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

return fractionalPart 
  ? `${formattedInteger}.${fractionalPart}` 
  : formattedInteger;

}


export const onDelete = (e) => {
  e.stopPropagation(); // Prevent event bubbling if needed
  console.log("Delete clicked");
  // Add your actual delete logic here (like showing a confirm dialog or calling an API)
};


export const prepareExpenseBarChartData =(data=[])=> {

  const chartData =data.map((item)=>({
    category:item?.category,
    amount:item?.amount,
  }));
  return chartData;
}


import moment from "moment";

export const prepareIncomeBarChartData = (data = []) => {
  const storedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = storedData.map((item) => ({
    month: moment(item?.date).format("Do MMMM"),
    amount: item?.amount || 0,
    category: item?.category || "Uncategorized",
  }));

  return chartData;
};



export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMMM"),
    amount: item?.amount || 0,
    category: item?.category || "Uncategorized",
  }));

  return chartData;
};
