import React from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  isIncreasing?: boolean;
  linkTo?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  isIncreasing,
  linkTo,
  color = 'default',
}) => {
  // Define color classes based on the color prop
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-ceyora-clay/10 text-ceyora-clay';
      case 'secondary':
        return 'bg-ocean-mist/10 text-ocean-mist';
      case 'success':
        return 'bg-palm-green/10 text-palm-green';
      case 'warning':
        return 'bg-amber-500/10 text-amber-500';
      default:
        return 'bg-ceyora-clay/10 text-ceyora-clay';
    }
  };

  const Card = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex items-center">
        {icon && <div className={`p-3 rounded-full mr-3 ${getColorClasses()}`}>{icon}</div>}
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

  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        <Card />
      </Link>
    );
  }

  return <Card />;
};

export default StatCard;