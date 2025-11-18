'use client';

import React, { useEffect } from 'react';
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
  const { assignTaskToBlock, setUser } = useApp();
  const { user: authUser, logout } = useAuth();

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

    const taskId = active.id as string;
    const blockId = over.id as string;

    // Assign task to the dropped block
    assignTaskToBlock(taskId, blockId);
  };

  return (
    <ProtectedRoute>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="h-screen flex flex-col p-4 md:p-6 overflow-hidden">
          {/* Header */}
          <header className="mb-4 flex justify-end items-center shrink-0">
            <div className="flex items-center gap-4">
              {authUser && (
                <div className="text-right">
                  <p className="text-sm text-gray-700 opacity-80">Welcome back,</p>
                  <p className="font-semibold text-gray-900">{authUser.name}</p>
                </div>
              )}
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-md"
              >
                Logout
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto flex-1 overflow-hidden w-full">
            {/* Left Column: Schedule */}
            <div className="lg:col-span-1 order-1 h-full">
              <ScheduleView />
            </div>

            {/* Middle Column: Task Dump */}
            <div className="lg:col-span-1 order-2 h-full">
              <TaskDump />
            </div>

            {/* Right Column: Timer, Dashboard & Priority Matrix */}
            <div className="lg:col-span-1 flex flex-col gap-4 order-3 h-full overflow-hidden">
              <Timer />
              <Dashboard />
              <PriorityMatrix />
            </div>
          </div>

          {/* Settings Icon */}
          <div className="fixed bottom-6 left-6">
            <button className="w-12 h-12 bg-gray-700 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* PLANPA Logo */}
          <div className="fixed bottom-6 right-6">
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
