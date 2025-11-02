import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { HiOutlineLightBulb } from 'react-icons/hi'; // Pour l'icône IA

interface KPIProps {
  value: string;
  label: string;
  trend?: string;
  isGrowth?: boolean;
  isIA?: boolean;
}

const KPI: React.FC<KPIProps> = ({ value, label, trend, isGrowth, isIA }) => {
  const trendColor = isGrowth ? 'text-success-green' : 'text-text-muted';

  return (
    <div className="flex flex-col w-1/4">
      <div className={`text-4xl font-bold ${isGrowth ? 'text-success-green' : 'text-text-light'}`}>
        {isIA ? <HiOutlineLightBulb className="inline mr-2 text-warning-yellow" /> : null}
        {value}
      </div>
      <div className="text-sm text-text-muted mt-1">{label}</div>
      {trend && (
        <div className={`text-xs mt-1 flex items-center ${trendColor}`}>
          {trend !== 'Archiver' && (isGrowth ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />)}
          {trend}
        </div>
      )}
    </div>
  );
};

export default KPI;