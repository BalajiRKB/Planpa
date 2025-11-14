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
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Focus Timer</h2>
        <p className="text-gray-600">No active timer. Start a work block from your schedule!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Focus Timer</h2>
      <div className="mb-4">
        <div className="text-6xl font-bold text-blue-600 mb-2">
          {formatTime(timeLeft)}
        </div>
        <p className="text-gray-600">
          {currentBlock?.blockType === 'Work' ? '🎯 Work Session' : '☕ Break Time'}
        </p>
      </div>
      <button
        onClick={stopTimer}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition"
      >
        Stop Timer
      </button>
    </div>
  );
}
