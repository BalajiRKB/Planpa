'use client';

import React from 'react';
import { useApp } from '@/src/context/AppContext';
import { calculateTotalDuration } from '@/src/utils/helpers';

export default function Dashboard() {
  const { tasks, timeBlocks } = useApp();

  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const inProgressTasks = tasks.filter(t => t.status === 'InProgress');
  const completedBlocks = timeBlocks.filter(b => b.isCompleted);
  const totalPlannedDuration = calculateTotalDuration(tasks.filter(t => t.assignedBlockId));

  const stats = [
    { label: 'Total', value: tasks.length, color: 'bg-blue-500' },
    { label: 'Done', value: completedTasks.length, color: 'bg-green-500' },
    { label: 'Active', value: inProgressTasks.length, color: 'bg-yellow-500' },
    { label: 'Blocks', value: completedBlocks.length, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-[#f0e5e5] rounded-2xl shadow-lg p-4 border-4 border-gray-600">
      <h2 className="text-lg font-bold text-gray-900 mb-3 text-center pb-2 border-b-2 border-gray-400">
        Stats
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} text-white p-3 rounded-xl text-center shadow-md`}>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-xs font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#e8c7c7] p-3 rounded-xl border-2 border-gray-600">
        <h3 className="font-semibold text-gray-900 mb-2 text-sm">Insights</h3>
        <ul className="space-y-1 text-xs text-gray-800">
          <li>📊 Planned: {totalPlannedDuration} min</li>
          <li>⏱️ Avg: {tasks.length > 0 ? Math.round(calculateTotalDuration(tasks) / tasks.length) : 0} min</li>
          <li>🎯 Rate: {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%</li>
        </ul>
      </div>
    </div>
  );
}
