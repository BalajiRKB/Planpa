'use client';

import React from 'react';
import { useApp } from '@/src/context/AppContext';
import { calculateTotalDuration } from '@/src/utils/helpers';

export default function Dashboard() {
  const { tasks, timeBlocks } = useApp();

  // Task statistics
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const pendingTasks = tasks.filter(t => t.status === 'Todo' || t.status === 'Blocked');
  const inProgressTasks = tasks.filter(t => t.status === 'InProgress');
  const assignedTasks = tasks.filter(t => t.assignedBlockId);
  const unassignedTasks = tasks.filter(t => !t.assignedBlockId);
  
  // Time block statistics
  const completedBlocks = timeBlocks.filter(b => b.isCompleted);
  const missedBlocks = timeBlocks.filter(b => b.isMissed);
  const pendingBlocks = timeBlocks.filter(b => !b.isCompleted && !b.isMissed && b.assignedTasks.length > 0);
  const emptyBlocks = timeBlocks.filter(b => !b.isCompleted && !b.isMissed && b.assignedTasks.length === 0);
  
  // Calculate completion rate
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  
  // Calculate time statistics
  const totalPlannedDuration = calculateTotalDuration(assignedTasks);
  const completedDuration = calculateTotalDuration(completedTasks);
  const avgTaskDuration = tasks.length > 0 ? Math.round(calculateTotalDuration(tasks) / tasks.length) : 0;
  
  // Block completion rate
  const blocksWithTasks = timeBlocks.filter(b => b.assignedTasks.length > 0);
  const blockCompletionRate = blocksWithTasks.length > 0 
    ? Math.round((completedBlocks.length / blocksWithTasks.length) * 100) 
    : 0;

  const mainStats = [
    { label: 'Total Tasks', value: tasks.length, color: 'bg-[#85ABB0]', icon: '📋' },
    { label: 'Completed', value: completedTasks.length, color: 'bg-green-600', icon: '✅' },
    { label: 'Pending', value: pendingTasks.length + inProgressTasks.length, color: 'bg-yellow-600', icon: '⏳' },
    { label: 'Unassigned', value: unassignedTasks.length, color: 'bg-[#B1B1B1]', icon: '📥' },
  ];

  const blockStats = [
    { label: 'Completed', value: completedBlocks.length, color: 'bg-green-600', size: 'small' },
    { label: 'Pending', value: pendingBlocks.length, color: 'bg-yellow-600', size: 'small' },
    { label: 'Missed', value: missedBlocks.length, color: 'bg-red-600', size: 'small' },
    { label: 'Empty', value: emptyBlocks.length, color: 'bg-[#B1B1B1]', size: 'small' },
  ];

  return (
    <div className="bg-[#CDB4B4] rounded-2xl shadow-lg p-3 border-2 border-black h-full flex flex-col overflow-hidden">
      <h2 className="text-base font-bold text-gray-900 mb-2 text-center pb-2 border-b-2 border-black shrink-0">
        📊 Dashboard
      </h2>
      
      {/* Main Task Stats */}
      <div className="grid grid-cols-2 gap-2 mb-2 shrink-0">
        {mainStats.map((stat, index) => (
          <div key={index} className={`${stat.color} text-white p-2 rounded-xl text-center shadow-md border-2 border-black hover:scale-105 transition-transform duration-200`}>
            <div className="text-xs font-semibold opacity-90 mb-0.5">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Time Block Stats */}
      <div className="mb-2 shrink-0">
        <h3 className="font-semibold text-gray-900 mb-1.5 text-xs">⏰ Time Blocks</h3>
        <div className="grid grid-cols-4 gap-1.5">
          {blockStats.map((stat, index) => (
            <div key={index} className={`${stat.color} text-white p-1.5 rounded-lg text-center shadow-sm border border-black hover:scale-105 transition-transform`}>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-[10px] font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Panel */}
      <div className="bg-[#85ABB0] p-2.5 rounded-xl border-2 border-black shrink-0 flex-1 overflow-y-auto scrollbar-thin">
        <h3 className="font-bold text-gray-900 mb-2 text-xs border-b-2 border-black pb-1">� Insights</h3>
        <div className="space-y-2 text-xs text-gray-900">
          <div className="flex justify-between items-center bg-white/50 px-2 py-1 rounded border border-black/30">
            <span className="font-semibold">Completion Rate:</span>
            <span className="font-bold text-green-800">{completionRate}%</span>
          </div>
          <div className="flex justify-between items-center bg-white/50 px-2 py-1 rounded border border-black/30">
            <span className="font-semibold">Block Success:</span>
            <span className="font-bold text-blue-800">{blockCompletionRate}%</span>
          </div>
          <div className="flex justify-between items-center bg-white/50 px-2 py-1 rounded border border-black/30">
            <span className="font-semibold">Planned Time:</span>
            <span className="font-bold text-purple-800">{totalPlannedDuration} min</span>
          </div>
          <div className="flex justify-between items-center bg-white/50 px-2 py-1 rounded border border-black/30">
            <span className="font-semibold">Completed Time:</span>
            <span className="font-bold text-green-800">{completedDuration} min</span>
          </div>
          <div className="flex justify-between items-center bg-white/50 px-2 py-1 rounded border border-black/30">
            <span className="font-semibold">Avg Task:</span>
            <span className="font-bold text-orange-800">{avgTaskDuration} min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
