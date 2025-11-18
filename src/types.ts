// PlanPA TypeScript Types & Data Models

export type Priority = 'P1' | 'P2' | 'P3' | 'P4';
export type TaskStatus = 'Todo' | 'InProgress' | 'Completed' | 'Blocked';
export type BlockType = 'Work' | 'Break' | 'Buffer';

export interface User {
  userId: string;
  email: string;
  name: string;
  preferences: {
    defaultWorkDuration: number; // minutes
    defaultBreakDuration: number; // minutes
    timezone: string;
    notifications: boolean;
  };
  createdAt: Date;
}

export interface Task {
  taskId: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  estimatedDuration: number; // minutes
  status: TaskStatus;
  category: string;
  assignedBlockId: string | null;
  createdAt: Date;
  completedAt: Date | null;
}

export interface TimeBlock {
  blockId: string;
  scheduleId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // 40 or 5
  blockType: BlockType;
  assignedTasks: string[]; // task IDs
  isCompleted: boolean;
  isMissed?: boolean;
  createdAt: Date;
}

export interface Schedule {
  scheduleId: string;
  userId: string;
  date: Date;
  timeBlocks: string[]; // block IDs
  totalPlannedTasks: number;
}

// UI-specific types
export interface DragItem {
  id: string;
  type: 'task' | 'block';
}

export interface AppState {
  user: User | null;
  tasks: Task[];
  schedule: Schedule | null;
  timeBlocks: TimeBlock[];
  activeTimer: {
    blockId: string;
    startedAt: Date;
    duration: number;
  } | null;
}
