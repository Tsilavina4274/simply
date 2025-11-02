// RevenueChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueChartProps {
  data: { name: string; revenue: number }[];
}

const Chart = ({ data }: RevenueChartProps) => {
  return (
    
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#1900FFFF" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
  );
};

export default Chart;
