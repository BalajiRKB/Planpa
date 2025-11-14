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
    { label: 'Total Tasks', value: tasks.length, color: 'bg-blue-100 text-blue-700' },
    { label: 'Completed', value: completedTasks.length, color: 'bg-green-100 text-green-700' },
    { label: 'In Progress', value: inProgressTasks.length, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Completed Blocks', value: completedBlocks.length, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} p-4 rounded-lg text-center`}>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-800 mb-2">Productivity Insights</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📊 Total planned work: {totalPlannedDuration} minutes</li>
          <li>⏱️ Average task duration: {tasks.length > 0 ? Math.round(calculateTotalDuration(tasks) / tasks.length) : 0} min</li>
          <li>🎯 Completion rate: {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%</li>
        </ul>
      </div>
    </div>
  );
}
