'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/src/context/AppContext';

export default function Timer() {
  const { activeTimer, stopTimer, completeBlock, timeBlocks, startTimer } = useApp();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!activeTimer) {
      setTimeLeft(0);
      return;
    }

    // Calculate initial time left
    const endTime = new Date(activeTimer.startedAt).getTime() + activeTimer.duration * 60 * 1000;
    const now = Date.now();
    const initialRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
    setTimeLeft(initialRemaining);
    
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        // Timer finished
        completeBlock(activeTimer.blockId);
        stopTimer();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, stopTimer, completeBlock]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentBlock = activeTimer 
    ? timeBlocks.find(b => b.blockId === activeTimer.blockId)
    : null;

  // Get next pending block
  const nextBlock = timeBlocks.find(b => !b.isCompleted && !b.isMissed && b.assignedTasks.length > 0);

  const handleStartTimer = () => {
    if (nextBlock) {
      startTimer(nextBlock.blockId, nextBlock.duration);
    }
  };

  if (!activeTimer) {
    return (
      <div className="bg-[#CDB4B4] rounded-2xl shadow-lg p-6 text-center border-2 border-black flex flex-col items-center justify-center shrink-0" style={{ minHeight: '200px', maxHeight: '250px' }}>
        <div className="mb-3">
          <div className="text-7xl font-bold text-gray-900 mb-2 font-mono">--:--</div>
          <p className="text-gray-800 text-sm font-semibold">No active timer</p>
        </div>
        {nextBlock && (
          <button
            onClick={handleStartTimer}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition font-semibold text-sm border-2 border-black shadow-md"
          >
            Start Next Block ({nextBlock.duration} min)
          </button>
        )}
      </div>
    );
  }

  const progress = activeTimer.duration > 0 
    ? ((activeTimer.duration * 60 - timeLeft) / (activeTimer.duration * 60)) * 100 
    : 0;

  return (
    <div className="bg-[#CDB4B4] rounded-2xl shadow-lg p-6 text-center border-2 border-black flex flex-col items-center justify-center shrink-0" style={{ minHeight: '200px', maxHeight: '250px' }}>
      <div className="mb-3 w-full">
        <div className="text-7xl font-bold text-gray-900 font-mono tracking-tight mb-2">
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-300 rounded-full h-2 mb-2 border border-black">
          <div 
            className="bg-green-600 h-full rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-gray-900 text-sm font-semibold">
          {currentBlock?.blockType === 'Work' ? '🎯 Work Session' : '☕ Break Time'}
        </p>
      </div>
      <button
        onClick={stopTimer}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-xl transition font-semibold text-sm border-2 border-black shadow-md"
      >
        Stop Timer
      </button>
    </div>
  );
}
