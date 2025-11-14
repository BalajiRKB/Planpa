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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Task Dump</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          + Add Task
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            placeholder="Task title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full mb-2 p-2 border rounded"
            rows={3}
          />
          <div className="grid grid-cols-3 gap-2 mb-2">
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="p-2 border rounded"
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
              className="p-2 border rounded"
              min="5"
              step="5"
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {unassignedTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks yet. Add one to get started!</p>
        ) : (
          unassignedTasks.map((task) => (
            <TaskCard key={task.taskId} task={task} onDelete={deleteTask} onUpdate={updateTask} />
          ))
        )}
      </div>
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
      className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            <span className="text-xs text-gray-500">{task.estimatedDuration} min</span>
          </div>
          <h3 className="font-semibold text-gray-800">{task.title}</h3>
          {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
          <span className="text-xs text-gray-500 mt-1 inline-block">{task.category}</span>
        </div>
        <button
          onClick={() => onDelete(task.taskId)}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
