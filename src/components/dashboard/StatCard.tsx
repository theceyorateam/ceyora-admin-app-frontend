import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  isIncreasing?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  isIncreasing,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        {icon && <div className="p-3 rounded-full bg-ceyora-clay/10 text-ceyora-clay mr-3">{icon}</div>}
        <div>
          <p className="text-sm font-medium text-ocean-mist">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-teakwood-brown">{value}</p>
          {change && (
            <p className={`text-sm ${isIncreasing ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;