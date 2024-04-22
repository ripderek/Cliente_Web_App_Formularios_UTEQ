import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
export default function Circular({ datos }) {
  const COLORS = ["#0088FE", "#00C49F"];

  const data = [
    { name: "Secciones Erróneas", value: datos.r_secciones_erroneas || 0 },
    {
      name: "Secciones no Erróneas",
      value: datos.r_secciones_no_erroneas || 0,
    },
  ];

  return (
    <PieChart width={600} height={400}>
      <Pie
        dataKey="value"
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
