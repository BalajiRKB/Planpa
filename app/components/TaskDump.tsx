'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Priority, TaskStatus } from '@/src/types';
import { getPriorityColor, getStatusColor } from '@/src/utils/helpers';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskDump() {
  const { tasks, addTask, deleteTask, updateTask } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<Priority>('P3');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'P3' as Priority,
    estimatedDuration: 40,
    status: 'Todo' as TaskStatus,
    category: 'General',
  });

  // Keyboard shortcut to open modal (Alt+N)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Open modal with Alt+N
      if (e.altKey && e.key.toLowerCase() === 'n' && !showModal) {
        e.preventDefault();
        setShowModal(true);
      }
      // ESC to close
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showModal]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Check if title is filled
    if (!formData.title.trim()) {
      alert('Please fill in the task title');
      return;
    }
    
    addTask({ ...formData, priority: selectedPriority });
    setFormData({
      title: '',
      description: '',
      priority: 'P3' as Priority,
      estimatedDuration: 40,
      status: 'Todo' as TaskStatus,
      category: 'General',
    });
    setSelectedPriority('P3');
    setShowModal(false);
  };

  const handlePriorityClick = (priority: Priority) => {
    setSelectedPriority(priority);
    // Auto-submit if title is filled
    if (formData.title.trim()) {
      handleSubmit();
    }
  };

  const unassignedTasks = tasks.filter(task => !task.assignedBlockId);

  return (
    <>
      <div className="bg-[#d4a5a5] rounded-2xl shadow-lg p-3 border-4 border-gray-600 h-full flex flex-col">
        <div className="space-y-2 flex-1 flex flex-col justify-center overflow-y-auto">
          {unassignedTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="w-20 h-20 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium text-sm">Your task dump is empty...</p>
              <p className="text-gray-600 text-xs mt-1">press Alt+N to add task</p>
            </div>
          ) : (
            unassignedTasks.map((task) => (
              <TaskCard key={task.taskId} task={task} onDelete={deleteTask} onUpdate={updateTask} />
            ))
          )}
        </div>
        <h2 className="text-lg font-bold text-gray-900 text-center pt-2 mt-3 border-t-2 border-gray-600 shrink-0">
          Task Dump
        </h2>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* Priority Buttons on the Right */}
            <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handlePriorityClick('P1')}
                className={`w-20 h-14 rounded-xl flex items-center justify-center transition shadow-lg ${
                  selectedPriority === 'P1' ? 'bg-red-600 ring-4 ring-red-300' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 9V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4H4l8 11 8-11h-6z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handlePriorityClick('P2')}
                className={`w-20 h-14 rounded-xl flex items-center justify-center transition shadow-lg ${
                  selectedPriority === 'P2' ? 'bg-green-600 ring-4 ring-green-300' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 9V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4H4l8 11 8-11h-6z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handlePriorityClick('P3')}
                className={`w-20 h-14 rounded-xl flex items-center justify-center transition shadow-lg ${
                  selectedPriority === 'P3' ? 'bg-yellow-400 ring-4 ring-yellow-200' : 'bg-yellow-400 hover:bg-yellow-500'
                }`}
              >
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 9V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4H4l8 11 8-11h-6z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handlePriorityClick('P4')}
                className={`w-20 h-14 rounded-xl flex items-center justify-center transition shadow-lg ${
                  selectedPriority === 'P4' ? 'bg-blue-600 ring-4 ring-blue-300' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 9V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4H4l8 11 8-11h-6z" />
                </svg>
              </button>
            </div>

            {/* Main Modal */}
            <div className="bg-[#d4a5a5] rounded-3xl shadow-2xl w-[500px] border-4 border-gray-700">
              <form onSubmit={handleSubmit} className="p-8">
                <h2 className="text-5xl font-bold text-center text-gray-900 mb-8">New Task</h2>
                
                <input
                  type="text"
                  placeholder="Task"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mb-4 p-4 border-3 border-gray-700 rounded-2xl bg-[#6eb5b5] text-gray-900 placeholder-gray-600 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                  required
                  autoFocus
                />
                
                <textarea
                  placeholder="Task Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-4 border-3 border-gray-700 rounded-2xl bg-[#6eb5b5] text-gray-900 placeholder-gray-600 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
                  rows={4}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TaskCard({ task, onDelete, onUpdate }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.taskId,
    data: { type: 'task', task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 bg-[#e8c7c7] border-2 border-gray-700 rounded-xl hover:shadow-lg transition cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold text-white ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className="text-xs text-gray-700 font-medium">{task.estimatedDuration} min</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">{task.title}</h3>
          {task.description && <p className="text-xs text-gray-700 mt-1">{task.description}</p>}
        </div>
        <button
          onClick={() => onDelete(task.taskId)}
          className="ml-2 text-red-600 hover:text-red-800 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
