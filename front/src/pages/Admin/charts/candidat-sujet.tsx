import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axiosInstance from '../../../../axios-instance';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart options
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Nombre de candidatures reçues par sujet',
    },
  },
  scales: {
    y: { 
      beginAtZero: true, 
      title: {
        display: true, 
        text: 'Nombre de candidatures', 
        color: '#666', 
        font: {
          size: 14, 
          weight: 'bold', 
        },
      },
    },
    x: {
      title: {
        display: true,
        text: 'Sujet',
        color: '#666',
        font: {
          size: 1,
          weight: 'bold',
        },
      },
    },
  },
};

// Bar Chart Component
export function BarChartCandidatSujet() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    axiosInstance.get('/kpi/candidatureBySujet')
      .then(response => {
        const data = response.data;

        // Extract labels (subjects) and counts (number of applications)
        const labels = data.map(item => item.sujet);
        const counts = data.map(item => item.count);

        // Define dataset for the chart
        const dataset = {
          label: 'Nombre de candidatures',
          data: counts,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        };

        // Update chart data state
        setChartData({
          labels: labels,
          datasets: [dataset],
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return <Bar options={options} data={chartData} />;
}