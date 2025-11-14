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
    <div className={`${color} p-4 rounded-lg`}>
      <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
      <div className="space-y-1">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">No tasks</p>
        ) : (
          tasks.map(task => (
            <div key={task.taskId} className="text-sm bg-white p-2 rounded shadow-sm">
              {task.title}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Priority Matrix</h2>
      <div className="grid grid-cols-2 gap-4">
        <QuadrantBox title="P1: Urgent & Important" tasks={urgentImportant} color="bg-red-50" />
        <QuadrantBox title="P2: Not Urgent & Important" tasks={notUrgentImportant} color="bg-orange-50" />
        <QuadrantBox title="P3: Urgent & Not Important" tasks={urgentNotImportant} color="bg-yellow-50" />
        <QuadrantBox title="P4: Not Urgent & Not Important" tasks={notUrgentNotImportant} color="bg-green-50" />
      </div>
    </div>
  );
}
