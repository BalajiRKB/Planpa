'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { formatTime } from '@/src/utils/helpers';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { TimeBlock } from '@/src/types';

export default function ScheduleView() {
  const { timeBlocks, tasks, schedule, createSchedule } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Scroll to current time block whenever time updates or schedule changes
  useEffect(() => {
    if (timeBlocks.length > 0) {
      const now = currentTime.getTime();
      const currentBlockIndex = timeBlocks.findIndex(block => {
        const blockStart = new Date(block.startTime).getTime();
        const blockEnd = new Date(block.endTime).getTime();
        return now >= blockStart && now < blockEnd;
      });

      if (currentBlockIndex !== -1) {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(`block-${timeBlocks[currentBlockIndex].blockId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else {
        // If no current block, find the next upcoming block
        const nextBlockIndex = timeBlocks.findIndex(block => {
          const blockStart = new Date(block.startTime).getTime();
          return now < blockStart;
        });

        if (nextBlockIndex !== -1) {
          setTimeout(() => {
            const element = document.getElementById(`block-${timeBlocks[nextBlockIndex].blockId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      }
    }
  }, [timeBlocks, schedule, currentTime]);

  const handleCreateSchedule = () => {
    createSchedule(new Date());
  };

  const scrollToCurrentTime = () => {
    if (timeBlocks.length > 0) {
      const now = currentTime.getTime();
      const currentBlockIndex = timeBlocks.findIndex(block => {
        const blockStart = new Date(block.startTime).getTime();
        const blockEnd = new Date(block.endTime).getTime();
        return now >= blockStart && now < blockEnd;
      });

      if (currentBlockIndex !== -1) {
        const element = document.getElementById(`block-${timeBlocks[currentBlockIndex].blockId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        const nextBlockIndex = timeBlocks.findIndex(block => {
          const blockStart = new Date(block.startTime).getTime();
          return now < blockStart;
        });

        if (nextBlockIndex !== -1) {
          const element = document.getElementById(`block-${timeBlocks[nextBlockIndex].blockId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }
  };

  if (!schedule) {
    return (
      <div className="bg-[#CDB4B4] rounded-2xl shadow-lg p-6 text-center border-2 border-black">
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
    <div className="bg-[#CDB4B4] rounded-2xl shadow-lg p-3 border-2 border-black h-full flex flex-col">
      {/* Current Time Indicator - Clickable */}
      <button
        onClick={scrollToCurrentTime}
        className="bg-[#85ABB0] rounded-lg px-3 py-2 mb-2 text-center border-2 border-black shrink-0 hover:bg-[#6eb5b5] hover:shadow-md transition-all duration-200 cursor-pointer w-full group"
        title="Click to scroll to current time"
      >
        <p className="text-sm font-bold text-gray-900 group-hover:scale-105 transition-transform">
          🕐 {formatTime(currentTime)}
        </p>
      </button>

      <div className="space-y-2 flex-1 overflow-y-auto pr-1 mb-3 scrollbar-thin">
        {timeBlocks.map((block, index) => (
          <TimeBlockCard 
            key={block.blockId} 
            block={block} 
            tasks={tasks} 
            index={index}
            currentTime={currentTime}
          />
        ))}
      </div>
      <h2 className="text-base font-bold text-gray-800 text-center pt-2 border-t-2 border-black shrink-0">
        📅 Schedule
      </h2>
    </div>
  );
}

function TimeBlockCard({ block, tasks, index, currentTime }: { block: TimeBlock; tasks: any[]; index: number; currentTime: Date }) {
  const { assignTaskToBlock, completeBlock, uncompleteBlock, markBlockAsMissed, startTimer } = useApp();
  const { setNodeRef, isOver } = useDroppable({
    id: block.blockId,
    data: { type: 'block', block },
  });

  const assignedTasks = tasks.filter((task) => block.assignedTasks.includes(task.taskId));

  // Determine if this block is current, past, or future
  const blockStart = new Date(block.startTime).getTime();
  const blockEnd = new Date(block.endTime).getTime();
  const now = currentTime.getTime();
  
  const isCurrentBlock = now >= blockStart && now < blockEnd;
  const isPastBlock = now >= blockEnd;
  const isFutureBlock = now < blockStart;

  // Determine status: completed, missed, pending (has tasks), or empty
  const hasAssignedTasks = assignedTasks.length > 0;
  const status = block.isMissed ? 'missed' : block.isCompleted ? 'completed' : hasAssignedTasks ? 'pending' : 'empty';

  // Notification for block start
  useEffect(() => {
    if (isCurrentBlock && hasAssignedTasks && !block.isCompleted && !block.isMissed) {
      // Check if we should show notification (within first minute of block)
      const timeSinceStart = now - blockStart;
      if (timeSinceStart < 60000) { // Within first minute
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('PlanPA - Time Block Started!', {
            body: `${block.blockType} session: ${assignedTasks.map(t => t.title).join(', ')}`,
            icon: '/Planpa-Logo.png',
            tag: block.blockId,
          });
        }
      }
    }
  }, [isCurrentBlock, hasAssignedTasks, block, assignedTasks, now, blockStart]);

  // Alternate colors: #85ABB0 and #B1B1B1, but highlight if task is assigned
  const baseColor = index % 2 === 0 ? '#85ABB0' : '#B1B1B1';
  
  // Special styling for current block
  let blockColor = '';
  if (isCurrentBlock && hasAssignedTasks && !block.isCompleted) {
    blockColor = 'bg-yellow-400 border-yellow-600 shadow-lg ring-2 ring-yellow-500 animate-pulse';
  } else if (hasAssignedTasks && !block.isCompleted && !block.isMissed) {
    blockColor = index % 2 === 0 
      ? 'bg-[#6eb5b5] border-[#5a9a9a] shadow-md' 
      : 'bg-[#9a9a9a] border-[#808080] shadow-md';
  } else {
    blockColor = index % 2 === 0 
      ? 'bg-[#85ABB0]' 
      : 'bg-[#B1B1B1]';
  }
  
  const hoverColor = isOver ? 'ring-2 ring-blue-500' : '';

  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === 'completed') {
      completeBlock(block.blockId);
    } else if (newStatus === 'missed') {
      markBlockAsMissed(block.blockId);
    } else if (newStatus === 'pending') {
      uncompleteBlock(block.blockId);
    }
  };

  // Handle quick start timer
  const handleQuickStart = () => {
    startTimer(block.blockId, block.duration);
  };

  // Status badge color
  const getStatusColor = () => {
    if (status === 'completed') return 'bg-green-600 text-white';
    if (status === 'missed') return 'bg-red-600 text-white';
    if (status === 'pending') return 'bg-yellow-500 text-black';
    return 'bg-gray-400 text-white';
  };

  return (
    <div
      id={`block-${block.blockId}`}
      ref={setNodeRef}
      className={`p-3 border-2 border-black rounded-xl ${blockColor} ${hoverColor} transition-all duration-200 ${
        hasAssignedTasks ? 'min-h-[60px]' : 'min-h-10'
      } flex flex-col justify-center relative group hover:shadow-md`}
    >
      {/* Current Time Indicator */}
      {isCurrentBlock && (
        <>
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full"></div>
        </>
      )}

      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-gray-900 ${hasAssignedTasks ? 'text-sm' : 'text-xs'}`}>
            {formatTime(block.startTime)} - {formatTime(block.endTime)}
          </span>
          {isCurrentBlock && (
            <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded border border-red-600 animate-pulse">
              LIVE
            </span>
          )}
        </div>
        {hasAssignedTasks && (
          <div className="flex items-center gap-1.5">
            {isCurrentBlock && !block.isCompleted && (
              <button
                onClick={handleQuickStart}
                className="text-xs font-bold px-2.5 py-1 rounded bg-blue-600 text-white border border-black hover:bg-blue-700 transition-all hover:scale-105 shadow-sm"
                title="Start Timer"
              >
                ▶️
              </button>
            )}
            <select
              value={status}
              onChange={handleStatusChange}
              onClick={(e) => e.stopPropagation()}
              className={`text-xs font-bold px-2 py-1 rounded border-2 border-black cursor-pointer ${getStatusColor()} hover:opacity-90 transition-all`}
            >
              <option value="pending">⏳ Pending</option>
              <option value="completed">✅ Done</option>
              <option value="missed">❌ Missed</option>
            </select>
          </div>
        )}
      </div>
      
      {assignedTasks.length > 0 ? (
        <div className="space-y-1.5">
          {assignedTasks.map((task) => (
            <DraggableScheduleTask 
              key={task.taskId} 
              task={task}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-700 italic opacity-50 group-hover:opacity-70 transition-opacity">
          Drop a task here...
        </p>
      )}
    </div>
  );
}

// Draggable task component for schedule
function DraggableScheduleTask({ task }: { task: any }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `schedule-${task.taskId}`,
    data: { type: 'task', task },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`text-sm text-gray-900 font-bold bg-white/40 px-2.5 py-2 rounded-lg border-2 border-black/30 shadow-sm cursor-move hover:bg-white/70 hover:shadow-md hover:scale-[1.02] transition-all active:scale-95 ${
        isDragging ? 'opacity-50 rotate-2 shadow-lg' : ''
      }`}
    >
      <span className="select-none">{task.title}</span>
    </div>
  );
}