'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Task, TimeBlock, Schedule, User, AppState, Priority, TaskStatus } from '@/src/types';
import { generateId, addMinutes } from '@/src/utils/helpers';

interface AppContextType extends AppState {
  addTask: (task: Omit<Task, 'taskId' | 'userId' | 'createdAt' | 'completedAt' | 'assignedBlockId'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  assignTaskToBlock: (taskId: string, blockId: string) => void;
  removeTaskFromBlock: (taskId: string) => void;
  createSchedule: (date: Date) => void;
  addTimeBlock: (block: Omit<TimeBlock, 'blockId' | 'createdAt'>) => void;
  startTimer: (blockId: string, duration: number) => void;
  stopTimer: () => void;
  completeBlock: (blockId: string) => void;
  setUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [activeTimer, setActiveTimer] = useState<AppState['activeTimer']>(null);

  const addTask = useCallback((taskData: Omit<Task, 'taskId' | 'userId' | 'createdAt' | 'completedAt' | 'assignedBlockId'>) => {
    const newTask: Task = {
      ...taskData,
      taskId: generateId(),
      userId: user?.userId || 'demo-user',
      createdAt: new Date(),
      completedAt: null,
      assignedBlockId: null,
    };
    setTasks(prev => [...prev, newTask]);
  }, [user]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.taskId === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.taskId !== taskId));
  }, []);

  const assignTaskToBlock = useCallback((taskId: string, blockId: string) => {
    setTasks(prev => prev.map(task =>
      task.taskId === taskId ? { ...task, assignedBlockId: blockId } : task
    ));
    setTimeBlocks(prev => prev.map(block =>
      block.blockId === blockId
        ? { ...block, assignedTasks: [...block.assignedTasks, taskId] }
        : block
    ));
  }, []);

  const removeTaskFromBlock = useCallback((taskId: string) => {
    const task = tasks.find(t => t.taskId === taskId);
    if (task?.assignedBlockId) {
      setTimeBlocks(prev => prev.map(block =>
        block.blockId === task.assignedBlockId
          ? { ...block, assignedTasks: block.assignedTasks.filter((id: string) => id !== taskId) }
          : block
      ));
    }
    setTasks(prev => prev.map(t =>
      t.taskId === taskId ? { ...t, assignedBlockId: null } : t
    ));
  }, [tasks]);

  const createSchedule = useCallback((date: Date) => {
    const newSchedule: Schedule = {
      scheduleId: generateId(),
      userId: user?.userId || 'demo-user',
      date,
      timeBlocks: [],
      totalPlannedTasks: 0,
    };
    setSchedule(newSchedule);
    
    // Auto-generate 8 work blocks (40 min) + 8 break blocks (5 min) for a full day
    const blocks: TimeBlock[] = [];
    let currentTime = new Date(date);
    currentTime.setHours(9, 0, 0, 0); // Start at 9 AM
    
    for (let i = 0; i < 8; i++) {
      // Work block
      const workBlock: TimeBlock = {
        blockId: generateId(),
        scheduleId: newSchedule.scheduleId,
        startTime: new Date(currentTime),
        endTime: addMinutes(currentTime, 40),
        duration: 40,
        blockType: 'Work',
        assignedTasks: [],
        isCompleted: false,
        createdAt: new Date(),
      };
      blocks.push(workBlock);
      currentTime = addMinutes(currentTime, 40);
      
      // Break block
      const breakBlock: TimeBlock = {
        blockId: generateId(),
        scheduleId: newSchedule.scheduleId,
        startTime: new Date(currentTime),
        endTime: addMinutes(currentTime, 5),
        duration: 5,
        blockType: 'Break',
        assignedTasks: [],
        isCompleted: false,
        createdAt: new Date(),
      };
      blocks.push(breakBlock);
      currentTime = addMinutes(currentTime, 5);
    }
    
    setTimeBlocks(blocks);
    setSchedule({ ...newSchedule, timeBlocks: blocks.map(b => b.blockId) });
  }, [user]);

  const addTimeBlock = useCallback((blockData: Omit<TimeBlock, 'blockId' | 'createdAt'>) => {
    const newBlock: TimeBlock = {
      ...blockData,
      blockId: generateId(),
      createdAt: new Date(),
    };
    setTimeBlocks(prev => [...prev, newBlock]);
    if (schedule) {
      setSchedule({ ...schedule, timeBlocks: [...schedule.timeBlocks, newBlock.blockId] });
    }
  }, [schedule]);

  const startTimer = useCallback((blockId: string, duration: number) => {
    setActiveTimer({
      blockId,
      startedAt: new Date(),
      duration,
    });
  }, []);

  const stopTimer = useCallback(() => {
    setActiveTimer(null);
  }, []);

  const completeBlock = useCallback((blockId: string) => {
    setTimeBlocks(prev => prev.map(block =>
      block.blockId === blockId ? { ...block, isCompleted: true } : block
    ));
    
    // Mark all tasks in this block as completed
    const block = timeBlocks.find(b => b.blockId === blockId);
    if (block) {
      setTasks(prev => prev.map(task =>
        block.assignedTasks.includes(task.taskId)
          ? { ...task, status: 'Completed' as TaskStatus, completedAt: new Date() }
          : task
      ));
    }
  }, [timeBlocks]);

  const value: AppContextType = {
    user,
    tasks,
    schedule,
    timeBlocks,
    activeTimer,
    addTask,
    updateTask,
    deleteTask,
    assignTaskToBlock,
    removeTaskFromBlock,
    createSchedule,
    addTimeBlock,
    startTimer,
    stopTimer,
    completeBlock,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
