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
      text: 'Nombre de taches validées et non validées',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Nombre de taches',
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
        text: 'Type de tache',
        color: '#666',
        font: {
          size: 14,
          weight: 'bold',
        },
      },
    },
  },
};

// Component
export const TacheRapport: React.FC = () => {
  const [data, setData] = useState({
    labels: ['Non Validées', 'Validées'],
    datasets: [
      {
        label: 'Taches',
        data: [0, 0], // Initial data
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(53, 162, 235, 0.6)'], // Colors for bars
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(53, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('kpi/valide-nonvalide');
        const rawData = response.data;

        // Update state with fetched data
        setData({
          labels: ['Non Validées', 'Validées'],
          datasets: [
            {
              label: 'Taches',
              data: [rawData.nonValideCount, rawData.valideCount],
              backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(53, 162, 235, 0.6)'],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(53, 162, 235, 1)'],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    };

    fetchData();
  }, []);

  return <Bar options={options} data={data} />;
};

export default TacheRapport;