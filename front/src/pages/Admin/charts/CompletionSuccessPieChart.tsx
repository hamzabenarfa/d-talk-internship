import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axiosInstance from '../../../../axios-instance';

ChartJS.register(ArcElement, Tooltip, Legend);

const fetchData = async () => {
  const [validStagesRes, nonValidStagesRes] = await Promise.all([
    axiosInstance.get('/valid-stages'),
    axiosInstance.get('/non-valid-stages'),
  ]);
  const validStages = validStagesRes.data;
  const nonValidStages = nonValidStagesRes.data;
  return { validStages, nonValidStages };
};

export function CompletionSuccessPieChart() {
  const [data, setData] = useState({
    labels: ['Succès', 'Échec'],
    datasets: [
      {
        label: 'Pourcentage de réussite',
        data: [0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',  // success - green
          'rgba(255, 99, 132, 0.7)',  // failure - red
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const getData = async () => {
      const { validStages, nonValidStages } = await fetchData();
      setData({
        labels: ['Succès', 'Échec'],
        datasets: [
          {
            label: 'Pourcentage de réussite',
            data: [validStages, nonValidStages],
            backgroundColor: [
              'rgba(75, 192, 192, 0.7)',  // success - green
              'rgba(255, 99, 132, 0.7)',  // failure - red
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    };

    getData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 14
          },
          color: '#333'
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(tooltipItem) {
            let label = tooltipItem.label || '';
            if (label) {
              label += ': ';
            }
            label += `${tooltipItem.raw}`;
            return label;
          }
        }
      },
      title: {
        display: true,
        text: 'Pourcentage des sujets complets avec succès par les candidats',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#333',
        padding: {
          top: 10,
          bottom: 30
        }
      }
    },
  };

  return <Pie data={data} options={options} />;
}

export default CompletionSuccessPieChart;
