import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const trendData = [
  { day: "01", value: 20 },
  { day: "05", value: 30 },
  { day: "10", value: 50 },
  { day: "15", value: 35 },
  { day: "20", value: 60 },
  { day: "25", value: 40 },
  { day: "30", value: 70 },
];

interface TrendItemProps {
  name: string;
  change: string;
  alert: boolean;
  avatarUrl: string;
}

const TrendItem: React.FC<TrendItemProps> = ({ name, change, alert, avatarUrl }) => (
  <div className="flex items-center justify-between p-3 rounded-md bg-[#1D1E22] hover:bg-[#2C2D32] transition-all duration-300 cursor-pointer hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-indigo-500/10">
    <div className="flex items-center">
      <img
        src={avatarUrl}
        alt={name}
        className="w-8 h-8 rounded-full mr-3 bg-indigo-400 border-2 border-indigo-500 hover:scale-110 transition-transform duration-300"
      />
      <span className="text-sm text-white font-medium">{name}</span>
    </div>
    {alert ? (
      <div className="w-5 h-5 flex items-center justify-center bg-red-600 rounded-full text-white font-bold text-xs animate-pulse">
        !
      </div>
    ) : (
      <span className="text-xs font-semibold text-green-400">{change}</span>
    )}
  </div>
);

const TrendChartTile = () => (
  <div className="bg-[#1D1E22] p-5 rounded-lg shadow-md h-[320px] flex flex-col justify-between hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-3">Trends & prediction</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2C2D32" />
          <XAxis dataKey="day" stroke="#555" fontSize={10} />
          <YAxis stroke="#555" fontSize={10} />
          <Tooltip contentStyle={{ backgroundColor: "#1D1E22", border: "1px solid #2C2D32" }} />
          <Line type="monotone" dataKey="value" stroke="#00BFFF" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <p className="text-sm font-semibold text-gray-300 mt-2">
      Trends & prediction <span className="text-green-500 animate-pulse">+17%</span>
    </p>
  </div>
);

const TrendListTile = () => (
  <div className="bg-[#1D1E22] p-5 rounded-lg shadow-md hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
    <h3 className="text-sm font-semibold text-gray-300 mb-3">Trends & prediction</h3>
    <div className="space-y-2">
      <TrendItem name="Sarah K." change="+78%" alert={false} avatarUrl="https://placehold.co/24x24/9F7AEA/ffffff?text=SK" />
      <TrendItem name="John D." change="" alert={true} avatarUrl="https://placehold.co/24x24/FF0000/ffffff?text=JD" />
      <TrendItem name="Alex P." change="+32%" alert={false} avatarUrl="https://placehold.co/24x24/00FF88/ffffff?text=AP" />
    </div>
  </div>
);

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);
  return (
    <button
      onClick={() => setIsOn(!isOn)}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ${
        isOn ? "bg-indigo-500" : "bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          isOn ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
};

const CommissionStructureTile = () => (
  <div className="bg-[#1D1E22] p-5 rounded-lg h-[320px] shadow-md hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-white">Payment</h2>
      <button className="bg-[#48484E] text-white text-xs font-bold py-2 px-4 rounded-md uppercase hover:bg-indigo-600 transition-colors duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
        Valide
      </button>
    </div>

    <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase">Commission Structure</h3>
    <div className="space-y-4 mb-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="w-3 h-3 border-2 border-gray-500 rounded-full mr-3"></span>
          <span className="text-sm text-white">Revenu</span>
        </div>
        <ToggleSwitch />
      </div>
      <div className="flex items-center">
        <span className="w-3 h-3 border-2 border-white bg-white rounded-full mr-3"></span>
        <span className="text-sm text-white">Description</span>
      </div>
    </div>

    <div className="flex justify-between text-xs text-gray-400 pt-3 border-t border-[#2C2D32]">
      <div>
        <p>Plateforme</p>
        <p className="mt-1 text-white font-semibold">18%</p>
        <p>Premium</p>
      </div>
      <div className="text-right">
        <p>Plateforme</p>
        <div className="flex space-x-2 mt-1 justify-end text-2xl">
          <span className="hover:scale-110 transition-transform">💳</span>
          <span className="hover:scale-110 transition-transform">🅿️</span>
          <span className="hover:scale-110 transition-transform">₿</span>
        </div>
      </div>
    </div>
  </div>
);

const BalanceTableTile = () => (
  <div className="bg-[#1D1E22] p-5 h-[255px] rounded-lg shadow-md hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
    <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase">Commission Structure</h3>
    <div className="flex justify-between items-center mb-5">
      <div>
        <p className="text-xs text-gray-400 uppercase">Current balance</p>
        <p className="text-2xl font-bold text-white mt-1">$1508.75</p>
      </div>
      <button className="bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors hover:shadow-lg hover:shadow-blue-500/30">
        Payant
      </button>
    </div>

    <div className="overflow-x-auto text-xs">
      <table className="min-w-full">
        <thead className="text-gray-500 uppercase border-b border-[#2C2D32]">
          <tr>
            <th className="py-2 pr-4 text-left">Invoice ID</th>
            <th className="py-2 pr-4 text-left">Amount</th>
            <th className="py-2 pr-4 text-left">Date</th>
            <th className="py-2 pr-4 text-left">Premium</th>
            <th className="py-2 pr-4 text-left">Note</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-white hover:bg-[#2C2D32] transition-all cursor-pointer">
            <td className="py-2 pr-4">INV 2023 -007</td>
            <td className="py-2 pr-4">$2.1000</td>
            <td className="py-2 pr-4 text-gray-400">Paid</td>
            <td className="py-2 pr-4 text-gray-400">Payant</td>
            <td className="py-2 pr-4">
              <span className="bg-green-700/30 text-green-400 px-2 py-0.5 rounded-md font-medium">
                Paid
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-[#121317] text-white font-sans">
      <header className="sticky top-0 z-20 bg-[#1D1E22]/90 backdrop-blur-md p-4 flex justify-between items-center shadow-md">

        <h1 className="text-2xl font-bold tracking-wide">AI INSHITS & FINANCE</h1>
        <div className="flex space-x-3">
          <button className="text-sm font-semibold py-2 px-4 rounded-md border border-gray-600 hover:bg-[#2C2D32] hover:shadow-md transition-all duration-300">
            New invoice
          </button>
          <button className="text-sm font-semibold py-2 px-4 rounded-md bg-white text-black hover:bg-gray-200 hover:shadow-lg transition-all duration-300">
            Download
          </button>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-6">
          <TrendChartTile />
          <TrendListTile />
        </div>
        <div className="flex flex-col space-y-6">
          <CommissionStructureTile />
          <BalanceTableTile />
        </div>
      </main>
    </div>
  );
}
