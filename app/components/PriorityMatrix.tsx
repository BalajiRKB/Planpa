'use client';

import React from 'react';
import { useApp } from '@/src/context/AppContext';
import { getPriorityColor } from '@/src/utils/helpers';

export default function PriorityMatrix() {
  const { tasks } = useApp();

  // Eisenhower Matrix: Urgent/Important
  const urgentImportant = tasks.filter(t => t.priority === 'P1'); // Do First
  const notUrgentImportant = tasks.filter(t => t.priority === 'P2'); // Schedule
  const urgentNotImportant = tasks.filter(t => t.priority === 'P3'); // Delegate
  const notUrgentNotImportant = tasks.filter(t => t.priority === 'P4'); // Eliminate

  const QuadrantBox = ({ title, tasks, color }: { title: string; tasks: any[]; color: string }) => (
    <div className={`${color} p-3 rounded-xl border-2 border-gray-600`}>
      <h3 className="font-bold text-gray-900 mb-2 text-xs">{title}</h3>
      <div className="space-y-1">
        {tasks.length === 0 ? (
          <p className="text-xs text-gray-600">No tasks</p>
        ) : (
          tasks.map(task => (
            <div key={task.taskId} className="text-xs bg-white bg-opacity-60 p-1.5 rounded shadow-sm font-medium text-gray-900">
              {task.title}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-[#f0e5e5] rounded-2xl shadow-lg p-4 border-4 border-gray-600 flex-1 min-h-0 flex flex-col overflow-hidden">
      <h2 className="text-lg font-bold text-gray-900 mb-3 text-center pb-2 border-b-2 border-gray-400 shrink-0">
        Priority Matrix
      </h2>
      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0 overflow-y-auto">
        <QuadrantBox title="P1: Critical" tasks={urgentImportant} color="bg-red-400" />
        <QuadrantBox title="P2: Important" tasks={notUrgentImportant} color="bg-orange-400" />
        <QuadrantBox title="P3: Medium" tasks={urgentNotImportant} color="bg-yellow-400" />
        <QuadrantBox title="P4: Low" tasks={notUrgentNotImportant} color="bg-green-400" />
      </div>
    </div>
  );
}
