// import React from "react";
// import CustomTooltip from "./CustomTooltip";
// import CustomLegend from "./CustomLegend.jsx";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const CustomPieChart = ({
//   data,
//   label,
//   totalAmount,
//   colors,
//   showTextAnchor,
// }) => {
//   return (
//     <ResponsiveContainer width="100%" height={380}>
//       <PieChart>
//         <Pie
//           data={data}
//           dataKey="amount"
//           nameKey="name"
//           cx="50%"
//           cy="50%"
//           outerRadius={130}
//           innerRadius={100}
//           labelLine={false}
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//           ))}
//         </Pie>

//         <Tooltip content={<CustomTooltip />} />
//         <Legend content={<CustomLegend />} />

//         {showTextAnchor && (
//           <>
//             <text
//               x="50%"
//               y="50%"
//               textAnchor="middle"
//               dominantBaseline="middle"
//               fill="#666"
//               fontSize="14px"
//             >
//               {label}
//             </text>
//             <text
//               x="50%"
//               y="50%"
//               dy="20"
//               textAnchor="middle"
//               dominantBaseline="middle"
//               fill="#333"
//               fontWeight="600"
//               fontSize="24px"
//             >
//               {totalAmount}
//             </text>
//           </>
//         )}
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };

// export default CustomPieChart;


import React from "react";
import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend.jsx";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CustomPieChart = ({
  data,
  // Accept either of these two pairs for center text:
  centerLabel,   // preferred for clarity
  centerValue,
  label,         // fallback for backward compatibility
  totalAmount,   // fallback for backward compatibility
  colors,
  showTextAnchor,
}) => {
  // Normalize the center text props
  const displayLabel = centerLabel || label || "";
  const displayValue = centerValue || totalAmount || "";

  return (
    <div className="relative w-full h-[380px]">
      {/* Center text */}
      {showTextAnchor && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-gray-600">{displayLabel}</p>
          <p className="text-2xl font-semibold text-gray-800">{displayValue}</p>
        </div>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={130}
            innerRadius={100}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
