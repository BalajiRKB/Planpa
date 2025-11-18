'use client';

import React, { useState } from 'react';
import { useApp } from '@/src/context/AppContext';
import { Priority, TaskStatus } from '@/src/types';
import { getPriorityColor, getStatusColor } from '@/src/utils/helpers';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskDump() {
  const { tasks, addTask, deleteTask, updateTask } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'P3' as Priority,
    estimatedDuration: 40,
    status: 'Todo' as TaskStatus,
    category: 'General',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(formData);
    setFormData({
      title: '',
      description: '',
      priority: 'P3' as Priority,
      estimatedDuration: 40,
      status: 'Todo' as TaskStatus,
      category: 'General',
    });
    setShowForm(false);
  };

  const unassignedTasks = tasks.filter(task => !task.assignedBlockId);

  return (
    <div className="bg-[#d4a5a5] rounded-2xl shadow-lg p-6 border-4 border-gray-600 h-fit min-h-[400px] flex flex-col">
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#6eb5b5] hover:bg-[#5a9a9a] text-white px-4 py-2 rounded-xl transition font-semibold text-sm"
        >
          + Add Task
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-[#e8c7c7] rounded-xl border-2 border-gray-600">
          <input
            type="text"
            placeholder="Task title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full mb-2 p-2 border-2 border-gray-600 rounded-lg bg-white"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full mb-2 p-2 border-2 border-gray-600 rounded-lg bg-white"
            rows={3}
          />
          <div className="grid grid-cols-3 gap-2 mb-2">
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="p-2 border-2 border-gray-600 rounded-lg bg-white"
            >
              <option value="P1">P1 (Urgent)</option>
              <option value="P2">P2 (High)</option>
              <option value="P3">P3 (Medium)</option>
              <option value="P4">P4 (Low)</option>
            </select>
            <input
              type="number"
              placeholder="Duration (min)"
              value={formData.estimatedDuration}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) })}
              className="p-2 border-2 border-gray-600 rounded-lg bg-white"
              min="5"
              step="5"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="p-2 border-2 border-gray-600 rounded-lg bg-white"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold">
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2 flex-1 flex flex-col justify-center">
        {unassignedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="w-20 h-20 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium text-sm">Your task dump is empty...</p>
            <p className="text-gray-600 text-xs mt-1">press + to add task</p>
          </div>
        ) : (
          unassignedTasks.map((task) => (
            <TaskCard key={task.taskId} task={task} onDelete={deleteTask} onUpdate={updateTask} />
          ))
        )}
      </div>
      <h2 className="text-xl font-bold text-gray-900 text-center pt-4 mt-4 border-t-2 border-gray-600">
        Task Dump
      </h2>
    </div>
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
