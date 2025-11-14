'use client';

import React from 'react';
import { useApp } from '@/src/context/AppContext';
import { formatTime } from '@/src/utils/helpers';
import { useDroppable } from '@dnd-kit/core';
import { TimeBlock } from '@/src/types';

export default function ScheduleView() {
  const { timeBlocks, tasks, schedule, createSchedule } = useApp();

  const handleCreateSchedule = () => {
    createSchedule(new Date());
  };

  if (!schedule) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Schedule</h2>
        <p className="text-gray-600 mb-4">No schedule created yet for today.</p>
        <button
          onClick={handleCreateSchedule}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition"
        >
          Create Today's Schedule
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Schedule</h2>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {timeBlocks.map((block) => (
          <TimeBlockCard key={block.blockId} block={block} tasks={tasks} />
        ))}
      </div>
    </div>
  );
}

function TimeBlockCard({ block, tasks }: { block: TimeBlock; tasks: any[] }) {
  const { assignTaskToBlock } = useApp();
  const { setNodeRef, isOver } = useDroppable({
    id: block.blockId,
    data: { type: 'block', block },
  });

  const assignedTasks = tasks.filter((task) => block.assignedTasks.includes(task.taskId));

  const blockColor = block.blockType === 'Work' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200';
  const hoverColor = isOver ? 'ring-2 ring-blue-400' : '';

  return (
    <div
      ref={setNodeRef}
      className={`p-3 border rounded-lg ${blockColor} ${hoverColor} transition`}
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="font-semibold text-gray-800">
            {formatTime(block.startTime)} - {formatTime(block.endTime)}
          </span>
          <span className="ml-2 text-sm text-gray-600">
            ({block.duration} min - {block.blockType})
          </span>
        </div>
        {block.isCompleted && (
          <span className="text-green-600 font-semibold">✓ Completed</span>
        )}
      </div>
      
      {assignedTasks.length > 0 ? (
        <div className="space-y-1">
          {assignedTasks.map((task) => (
            <div key={task.taskId} className="text-sm bg-white p-2 rounded border">
              {task.title}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">Drop a task here</p>
      )}
    </div>
  );
}
