import React from 'react';
import {
  TooltipProps, // Common tooltip props from Recharts
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { Payload } from 'recharts/types/component/DefaultTooltipContent'; // Correct way to import Payload

// Define a custom tooltip component that handles payload safely
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    // Check if payload is an array and not undefined/null before accessing
    const item = payload[0]; // Access the first item in the payload array
    return (
      <div className="custom-tooltip bg-white p-4 border border-gray-200 rounded shadow-md">
        <p className="label text-sm font-semibold">{`${label}`}</p>
        <p className="intro text-primary-500 text-sm">{`${item.name} : ${item.value}`}</p>
        {/* You can add more details from other payload items if needed */}
      </div>
    );
  }

  return null;
};

// Example Chart Component using CustomTooltip
interface ChartData {
  name: string;
  value: number;
}

interface ChartProps {
  data: ChartData[];
  dataKey: string;
  title: string;
}

export default function RechartsChart({ data, dataKey, title }: ChartProps) {
  return (
    <div className="w-full h-80 bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip content={<CustomTooltip />} /> {/* Use the custom tooltip */}
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}