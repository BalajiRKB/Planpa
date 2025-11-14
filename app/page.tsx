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
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">PlanPA</h1>
              <p className="text-gray-600">Productivity Planning App - Balance work and rest with 40-minute blocks</p>
            </div>
            <div className="flex items-center gap-4">
              {authUser && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Welcome back,</p>
                  <p className="font-semibold text-gray-800">{authUser.name}</p>
                </div>
              )}
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Task Dump & Priority Matrix */}
          <div className="lg:col-span-1 space-y-6">
            <TaskDump />
            <PriorityMatrix />
          </div>

          {/* Middle Column: Schedule */}
          <div className="lg:col-span-1">
            <ScheduleView />
          </div>

          {/* Right Column: Timer & Dashboard */}
          <div className="lg:col-span-1 space-y-6">
            <Timer />
            <Dashboard />
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-600">
          <p>💡 Drag tasks from the Task Dump to your schedule blocks</p>
        </footer>
      </div>
    </DndContext>
    </ProtectedRoute>
  );
}
