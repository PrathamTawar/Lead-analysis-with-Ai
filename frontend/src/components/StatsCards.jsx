import React from 'react';
import { Users, Zap, BarChart3, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`flex items-center justify-center w-12 h-12 ${bgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  </div>
);

const StatsCards = ({ stats }) => {
  const { total, high, medium, low, offers } = stats;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          title="Total Leads"
          value={total}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={Zap}
          title="High Intent"
          value={high}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={BarChart3}
          title="Medium Intent"
          value={medium}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
        />
        <StatCard
          icon={TrendingDown}
          title="Low Intent"
          value={low}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <StatCard
          icon={BarChart3}
          title="Products/Offers"
          value={offers}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>
    </div>
  );
};

export default StatsCards;