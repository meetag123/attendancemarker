
// import React, { useEffect, useState } from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
// import axiosconfig from '../axiosconfig';

// const COLORS = ['#00C49F', '#FF8042'];

// const Summary = () => {
//   const [summaryData, setSummaryData] = useState([]);

//   useEffect(() => {
//   axiosconfig.get('/summary')
//     .then(res => {
//     //   console.log("API response:", res.data);
//     //   setSummaryData(Array.isArray(res.data) ? res.data : []);
//     setSummaryData(res.data)
//     })
//     .catch(err => console.error("Error fetching summary", err));
// }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//       {summaryData.map((employee) => (
//         <div key={employee.employeeId} className="border rounded-xl shadow-md p-4">
//           <h3 className="text-xl font-semibold mb-4">{employee.name}</h3>
//           <PieChart width={200} height={200}>
//             <Pie
//               data={[
//                 { name: 'Present', value: employee.presentCount },
//                 { name: 'Absent', value: employee.absentCount },
//               ]}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={70}
//               label
//             >
//               {COLORS.map((color, i) => (
//                 <Cell key={i} fill={color} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Summary;
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axiosconfig from '../axiosconfig';

const COLORS = ['#00C49F', '#FF8042'];

const Summary = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    axiosconfig.get('/summary')
      .then(res => {
        setSummaryData(res.data);
        if (res.data.length > 0) {
          setSelectedEmployeeId(res.data[0].employeeId); // auto-select first
        }
      })
      .catch(err => console.error("Error fetching summary", err));
  }, []);

  const selectedEmployee = summaryData.find(e => e.employeeId === selectedEmployeeId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="employee" className="font-semibold text-lg">Select Employee:</label>
        <select
          id="employee"
          className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-200"
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
          value={selectedEmployeeId }
        >
          {summaryData.map((employee) => (
            <option key={employee.employeeId} value={employee.employeeId}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      {selectedEmployee && (
        <div className="max-w-md mx-auto border rounded-2xl shadow-lg p-6 bg-white transition hover:shadow-2xl">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">{selectedEmployee.name}'s Attendance</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={[
                { name: 'Present', value: selectedEmployee.presentCount },
                { name: 'Absent', value: selectedEmployee.absentCount },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {COLORS.map((color, i) => (
                <Cell key={i} fill={color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default Summary;
