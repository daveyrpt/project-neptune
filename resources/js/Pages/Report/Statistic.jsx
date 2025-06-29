import { Head } from '@inertiajs/react'
import React, { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const dummyStats = {
  '2025': {
    '1': { kebakaran: 24, 'khidmat-khas': 32, 'khidmat-kemanusiaan': 15 },
    '2': { kebakaran: 18, 'khidmat-khas': 25, 'khidmat-kemanusiaan': 12 },
    '3': { kebakaran: 30, 'khidmat-khas': 28, 'khidmat-kemanusiaan': 19 },
    '4': { kebakaran: 35, 'khidmat-khas': 34, 'khidmat-kemanusiaan': 22 },
    '5': { kebakaran: 38, 'khidmat-khas': 29, 'khidmat-kemanusiaan': 18 },
    '6': { kebakaran: 52, 'khidmat-khas': 40, 'khidmat-kemanusiaan': 26 },
    '7': { kebakaran: 47, 'khidmat-khas': 36, 'khidmat-kemanusiaan': 24 },
    '8': { kebakaran: 29, 'khidmat-khas': 21, 'khidmat-kemanusiaan': 16 },
    '9': { kebakaran: 33, 'khidmat-khas': 30, 'khidmat-kemanusiaan': 20 },
    '10': { kebakaran: 39, 'khidmat-khas': 35, 'khidmat-kemanusiaan': 23 },
    '11': { kebakaran: 42, 'khidmat-khas': 38, 'khidmat-kemanusiaan': 25 },
    '12': { kebakaran: 40, 'khidmat-khas': 33, 'khidmat-kemanusiaan': 21 },
  },
  '2024': {
    '1': { kebakaran: 12, 'khidmat-khas': 15, 'khidmat-kemanusiaan': 7 },
    '2': { kebakaran: 14, 'khidmat-khas': 18, 'khidmat-kemanusiaan': 9 },
    '3': { kebakaran: 19, 'khidmat-khas': 21, 'khidmat-kemanusiaan': 11 },
    '4': { kebakaran: 22, 'khidmat-khas': 25, 'khidmat-kemanusiaan': 13 },
    '5': { kebakaran: 25, 'khidmat-khas': 22, 'khidmat-kemanusiaan': 12 },
    '6': { kebakaran: 28, 'khidmat-khas': 27, 'khidmat-kemanusiaan': 15 },
    '7': { kebakaran: 23, 'khidmat-khas': 20, 'khidmat-kemanusiaan': 14 },
    '8': { kebakaran: 18, 'khidmat-khas': 17, 'khidmat-kemanusiaan': 10 },
    '9': { kebakaran: 20, 'khidmat-khas': 23, 'khidmat-kemanusiaan': 13 },
    '10': { kebakaran: 27, 'khidmat-khas': 26, 'khidmat-kemanusiaan': 16 },
    '11': { kebakaran: 29, 'khidmat-khas': 30, 'khidmat-kemanusiaan': 18 },
    '12': { kebakaran: 26, 'khidmat-khas': 28, 'khidmat-kemanusiaan': 17 },
  }
}



export default function StatisticsIndex({ auth }) {
  const [selectedYear, setSelectedYear] = useState('2025')

  const months = [...Array(12)].map((_, i) =>
    new Date(0, i).toLocaleString('ms-MY', { month: 'long' })
  )

  const getCategoryData = (category) =>
    [...Array(12)].map((_, i) => dummyStats[selectedYear]?.[i + 1]?.[category] || 0)

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: 'Kebakaran',
        data: getCategoryData('kebakaran'),
        backgroundColor: '#f87171',
        stack: 'stack-1',
      },
      {
        label: 'Khidmat Khas',
        data: getCategoryData('khidmat-khas'),
        backgroundColor: '#60a5fa',
        stack: 'stack-1',
      },
      {
        label: 'Khidmat Kemanusiaan',
        data: getCategoryData('khidmat-kemanusiaan'),
        backgroundColor: '#fbbf24',
        stack: 'stack-1',
      },
    ],
  }

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: { size: 14, weight: 'bold' },
        },
      },
      title: {
        display: true,
        text: `Statistik Kes untuk Tahun ${selectedYear}`,
        font: { size: 18, weight: 'bold' },
        color: '#1f2937',
      },
    },
    layout: {
      padding: 20,
    },
    animation: {
      duration: 800,
      easing: 'easeOutBounce',
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: '#4b5563', font: { size: 12 } },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: { color: '#4b5563', font: { size: 12 } },
      },
    },
  }

  return (
    <AuthenticatedLayout user={auth.user} currentRoute="/statistic">
      <Head title="Statistik Tahunan" />
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Statistik Tahunan Mengikut Kategori</h1>

        <div className="mb-4 flex items-center gap-4 ">
          <label className="block text-sm font-medium text-gray-700 w">Tahun</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border rounded px-2 py-1 mt-1 w-24"
          >
            {Object.keys(dummyStats).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
