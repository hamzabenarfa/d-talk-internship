import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axiosInstance from '../../../../axios-instance';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

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

export const TacheRapport: React.FC = () => {
  const [data, setData] = useState({
    labels: ['Non Validées', 'Validées'],
    datasets: [
      {
        label: 'Taches',
        data: [0, 0],
        borderColor: 'rgba(53, 162, 235, 0.9)',
        backgroundColor: 'rgb a(53, 162, 235, 0.5)',
        fill: false,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('task/valide-nonvalide');
        const rawData = response.data;
        setData({
          labels: ['Non Validées', 'Validées'],
          datasets: [
            {
              label: 'Taches',
              data: [rawData.nonValideCount, rawData.valideCount],
              borderColor: 'rgba(53, 162, 235, 0.9)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    };

    fetchData();
  }, []);

  return <Line options={options} data={data} />;
};

export default TacheRapport;
