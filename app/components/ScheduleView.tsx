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
      <div className="bg-[#f0e5e5] rounded-2xl shadow-lg p-6 text-center border-4 border-gray-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Schedule</h2>
        <p className="text-gray-600 mb-4">No schedule created yet for today.</p>
        <button
          onClick={handleCreateSchedule}
          className="bg-[#6eb5b5] hover:bg-[#5a9a9a] text-white px-6 py-3 rounded-xl transition font-semibold"
        >
          Create Today's Schedule
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f0e5e5] rounded-2xl shadow-lg p-4 border-4 border-gray-600 h-fit flex flex-col">
      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 mb-4">
        {timeBlocks.map((block) => (
          <TimeBlockCard key={block.blockId} block={block} tasks={tasks} />
        ))}
      </div>
      <h2 className="text-xl font-bold text-gray-800 text-center pt-3 border-t-2 border-gray-400">
        Schedule
      </h2>
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

  const blockColor = block.blockType === 'Work' 
    ? 'bg-[#6eb5b5] border-gray-700' 
    : 'bg-[#d4a5a5] border-gray-700';
  const hoverColor = isOver ? 'ring-2 ring-blue-500' : '';

  return (
    <div
      ref={setNodeRef}
      className={`p-3 border-3 border-gray-700 rounded-xl ${blockColor} ${hoverColor} transition min-h-[60px] flex flex-col justify-center`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-semibold text-gray-900 text-sm">
          {formatTime(block.startTime)} - {formatTime(block.endTime)}
        </span>
        {block.isCompleted && (
          <span className="text-green-700 font-bold text-xs">✓</span>
        )}
      </div>
      
      {assignedTasks.length > 0 ? (
        <div className="space-y-1">
          {assignedTasks.map((task) => (
            <div key={task.taskId} className="text-xs text-gray-800 font-medium">
              {task.title}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-700 italic">Drop a Task here</p>
      )}
    </div>
  );
}
