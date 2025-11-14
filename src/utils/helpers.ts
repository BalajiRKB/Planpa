// PlanPA Utility Helpers
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const generateId = (): string => uuidv4();

export const formatTime = (date: Date | string): string => {
  return dayjs(date).format('HH:mm');
};

export const formatDate = (date: Date | string): string => {
  return dayjs(date).format('MMM DD, YYYY');
};

export const addMinutes = (date: Date, minutes: number): Date => {
  return dayjs(date).add(minutes, 'minute').toDate();
};

export const isToday = (date: Date | string): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    P1: 'bg-red-500',
    P2: 'bg-orange-500',
    P3: 'bg-yellow-500',
    P4: 'bg-green-500',
  };
  return colors[priority] || 'bg-gray-500';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    Todo: 'bg-gray-200 text-gray-700',
    InProgress: 'bg-blue-200 text-blue-700',
    Completed: 'bg-green-200 text-green-700',
    Blocked: 'bg-red-200 text-red-700',
  };
  return colors[status] || 'bg-gray-200 text-gray-700';
};

export const calculateTotalDuration = (tasks: { estimatedDuration: number }[]): number => {
  return tasks.reduce((sum, task) => sum + task.estimatedDuration, 0);
};

export const splitTaskIntoBlocks = (durationMinutes: number, blockSize: number = 40): number => {
  return Math.ceil(durationMinutes / blockSize);
};
