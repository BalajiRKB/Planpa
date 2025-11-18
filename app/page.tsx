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
        <div className="min-h-screen p-4 md:p-6">
          {/* Header */}
          <header className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-black text-white px-4 py-2 font-mono text-xl font-bold tracking-wider" style={{
                background: 'black',
                color: '#ff0000',
                textShadow: '0 0 10px rgba(255,0,0,0.5)',
                fontFamily: 'monospace',
                letterSpacing: '0.2em'
              }}>
                <span style={{color: '#ff0000'}}>P</span>
                <span style={{color: '#00ff00'}}>L</span>
                <span style={{color: '#0066ff'}}>A</span>
                <span style={{color: '#ffff00'}}>N</span>
                <span style={{color: '#ff00ff'}}>P</span>
                <span style={{color: '#00ffff'}}>A</span>
              </div>
            </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {/* Left Column: Schedule */}
            <div className="lg:col-span-1 order-1">
              <ScheduleView />
            </div>

            {/* Middle Column: Task Dump */}
            <div className="lg:col-span-1 order-2">
              <TaskDump />
            </div>

            {/* Right Column: Timer, Dashboard & Priority Matrix */}
            <div className="lg:col-span-1 space-y-4 order-3">
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
        </div>
      </DndContext>
    </ProtectedRoute>
  );
}
