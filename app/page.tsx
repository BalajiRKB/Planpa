'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useApp } from '@/src/context/AppContext';
import { useAuth, getStoredUser } from '@/src/hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import TaskDump from './components/TaskDump';
import ScheduleView from './components/ScheduleView';
import PriorityMatrix from './components/PriorityMatrix';
import Timer from './components/Timer';
import Dashboard from './components/Dashboard';

export default function Home() {
  const router = useRouter();
  const { assignTaskToBlock, setUser, removeTaskFromBlock } = useApp();
  const { user: authUser, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  // Load authenticated user
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Extract task ID (handle both 'schedule-taskId' and plain 'taskId' formats)
    const taskId = activeId.startsWith('schedule-') 
      ? activeId.replace('schedule-', '') 
      : activeId;

    // If dropping back to TaskDump
    if (overId === 'task-dump') {
      removeTaskFromBlock(taskId);
      return;
    }

    // If dragging from schedule to schedule (moving between blocks)
    if (activeId.startsWith('schedule-')) {
      // Remove from current block
      removeTaskFromBlock(taskId);
      // Assign to new block
      assignTaskToBlock(taskId, overId);
    } else {
      // Normal drag from TaskDump to schedule
      assignTaskToBlock(taskId, overId);
    }
  };

  return (
    <ProtectedRoute>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="h-screen flex flex-col p-3 overflow-hidden pb-24">
          <div className="grid grid-cols-3 gap-3 flex-1 overflow-hidden">
            {/* Left Column: Schedule */}
            <div className="h-full overflow-hidden">
              <ScheduleView />
            </div>

            {/* Middle Column: Task Dump */}
            <div className="h-full overflow-hidden">
              <TaskDump />
            </div>

            {/* Right Column: Timer, Dashboard & Priority Matrix */}
            <div className="h-full flex flex-col gap-3 overflow-hidden">
              <Timer />
              <div className="flex-1 overflow-hidden">
                <Dashboard />
              </div>
            </div>
          </div>

          {/* Settings Menu - Bottom Left */}
          <div className="fixed bottom-6 left-6 z-50">
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="w-12 h-12 bg-gray-700 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-2xl border-2 border-black overflow-hidden min-w-40">
                  <button
                    onClick={() => {
                      router.push('/profile');
                      setShowSettings(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 transition flex items-center gap-2 text-gray-800 border-b border-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowSettings(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition flex items-center gap-2 text-red-600 font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PLANPA Logo - Bottom Right */}
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-black px-6 py-3 rounded-xl shadow-2xl">
              <img 
                src="/Planpa-Logo.png" 
                alt="PlanPA Logo" 
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </DndContext>
    </ProtectedRoute>
  );
}
