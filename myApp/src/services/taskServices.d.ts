
import { Task } from '../model/types';

declare module '@/services/taskService' {
  
    export const addTask: (task: Omit<Task, 'id'>) => Promise<void>;
    export const getTasks: () => Promise<Task[]>;
    export const updateTask: (id: string, updatedTask: Omit<Task, 'id'>) => Promise<void>;
    export const deleteTask: (id: string) => Promise<void>;
    export const uploadAudio: (audioBlob: Blob, taskId: string) => Promise<string>;
  }