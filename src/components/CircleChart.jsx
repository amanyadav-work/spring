import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const OrderDetailsChart = ({ dataOrders }) => {
  // Calculate amounts based on statuses
  const cancelledAmount = dataOrders
    .filter(order => order.status === 'Cancelled')
    .reduce((acc, order) => acc + order.amount, 0);
  const deliveredAmount = dataOrders
    .filter(order => order.status === 'Delivered')
    .reduce((acc, order) => acc + order.amount, 0);
  const pendingAmount = dataOrders
    .filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled')
    .reduce((acc, order) => acc + order.amount, 0);

  // Prepare chart data
  const chartData = {
    labels: ['Cancelled Orders', 'Delivered Orders', 'Pending Orders'],
    datasets: [{
      data: [cancelledAmount, deliveredAmount, pendingAmount],
      backgroundColor: ['red', 'green', 'gray'],
      borderColor: ['black', 'black', 'black'],
      borderWidth: 3
    }]
  };

  // Chart options to remove labels (legend)
  const chartOptions = {
    plugins: {
      legend: {
        display: false, // Disable legend display
      }
    }
  };

  return (
    <div className="flex justify-center">
      {/* Pie Chart */}
      <div className="w-44 h-44">
        <Pie data={chartData} options={chartOptions}  />
      </div>
    </div>
  );
};

export default OrderDetailsChart;
