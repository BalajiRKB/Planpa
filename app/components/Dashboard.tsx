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
    <div className="bg-[#f0e5e5] rounded-2xl shadow-lg p-3 border-2 border-black h-full flex flex-col overflow-hidden">
      <h2 className="text-base font-bold text-gray-900 mb-2 text-center pb-2 border-b-2 border-black shrink-0">
        Stats
      </h2>
      <div className="grid grid-cols-2 gap-2 mb-2 shrink-0">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} text-white p-2 rounded-xl text-center shadow-md`}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#e8c7c7] p-2 rounded-xl border-2 border-black shrink-0">
        <h3 className="font-semibold text-gray-900 mb-1 text-xs">Insights</h3>
        <ul className="space-y-0.5 text-xs text-gray-800">
          <li>📊 Planned: {totalPlannedDuration} min</li>
          <li>⏱️ Avg: {tasks.length > 0 ? Math.round(calculateTotalDuration(tasks) / tasks.length) : 0} min</li>
          <li>🎯 Rate: {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%</li>
        </ul>
      </div>
    </div>
  );
}
