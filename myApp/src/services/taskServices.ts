import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Task } from '@/model/types';

const tasksCollection = collection(db, 'tasks');

const addTask = async (task: Omit<Task, 'id'>): Promise<void> => {
  await addDoc(tasksCollection, task);
};

const getTasks = async (): Promise<Task[]> => {
  const querySnapshot = await getDocs(tasksCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Task));
};

const updateTask = async (id: string, updatedTask: Omit<Task, 'id'>): Promise<void> => {
  const taskDoc = doc(db, 'tasks', id);
  await updateDoc(taskDoc, updatedTask);
};

const deleteTask = async (id: string): Promise<void> => {
  const taskDoc = doc(db, 'tasks', id);
  await deleteDoc(taskDoc);
};

export { addTask, getTasks, updateTask, deleteTask };