import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axiosInstance from '../../../../axios-instance';

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
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
          label += `${tooltipItem.parsed} topics`;
          return label;
        }
      }
    },
    title: {
      display: true,
      text: 'Nombre des sujets PFE proposés par catégories',
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

export function PfeCategoriesPieChart() {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: '# of Proposed Topics',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',  // red
          'rgba(54, 162, 235, 0.7)',  // blue
          'rgba(255, 206, 86, 0.7)',  // yellow
          'rgba(75, 192, 192, 0.7)',  // green
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    axiosInstance.get('sujet/countByCategorie')
      .then(response => {
        const categories = Object.keys(response.data);
        const values = Object.values(response.data);
        setData({
          labels: categories,
          datasets: [
            {
              label: '# of Proposed Topics',
              data: values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',  // red
                'rgba(54, 162, 235, 0.7)',  // blue
                'rgba(255, 206, 86, 0.7)',  // yellow
                'rgba(75, 192, 192, 0.7)',  // green
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return <Pie data={data} options={options} />;
}

export default PfeCategoriesPieChart;
