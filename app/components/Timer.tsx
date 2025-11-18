'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/src/context/AppContext';

export default function Timer() {
  const { activeTimer, stopTimer, completeBlock, timeBlocks } = useApp();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!activeTimer) {
      setTimeLeft(0);
      return;
    }

    const endTime = new Date(activeTimer.startedAt).getTime() + activeTimer.duration * 60 * 1000;
    
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

  if (!activeTimer) {
    return (
      <div className="bg-[#d4a5a5] rounded-2xl shadow-lg p-6 text-center border-2 border-black flex items-center justify-center shrink-0" style={{ minHeight: '200px', maxHeight: '250px' }}>
        <div>
          <div className="text-7xl font-bold text-gray-900 mb-2 font-mono">5:00</div>
          <p className="text-gray-700 text-sm">No active timer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#d4a5a5] rounded-2xl shadow-lg p-6 text-center border-2 border-black flex flex-col items-center justify-center shrink-0" style={{ minHeight: '200px', maxHeight: '250px' }}>
      <div className="mb-2">
        <div className="text-7xl font-bold text-gray-900 font-mono tracking-tight">
          {formatTime(timeLeft)}
        </div>
        <p className="text-gray-800 text-sm mt-2 font-medium">
          {currentBlock?.blockType === 'Work' ? '🎯 Work Session' : '☕ Break Time'}
        </p>
      </div>
      <button
        onClick={stopTimer}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-xl transition font-semibold text-sm mt-2"
      >
        Stop Timer
      </button>
    </div>
  );
}
