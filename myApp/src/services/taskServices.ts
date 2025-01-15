import { auth, db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Task } from '@/model/types';

const getUserTasksCollection = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');
  return collection(db, 'users', userId, 'tasks');
};

const addTask = async (task: Task): Promise<void> => {
  console.log('Adding task:', task);
  const userId = auth.currentUser?.uid;
  console.log('Current user ID:', userId);
  
  if (!userId) {
    console.error('No user authenticated');
    throw new Error('User not authenticated');
  }

  const tasksCollection = collection(db, 'users', userId, 'tasks');
  console.log('Collection path:', `users/${userId}/tasks`);

  try {
    const docRef = await addDoc(tasksCollection, {
      ...task,
      userId: userId,
      createdAt: new Date().toISOString()
    });
    console.log('Document written with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

const getTasks = async (): Promise<(Task & { id: string })[]> => {
  const tasksCollection = getUserTasksCollection();
  const querySnapshot = await getDocs(tasksCollection);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Task & { id: string }));
};

const updateTask = async (id: string, updatedTask: Task): Promise<void> => {
  const tasksCollection = getUserTasksCollection();
  const taskDoc = doc(tasksCollection, id);
  const taskData = {
    title: updatedTask.title,
    dueDate: updatedTask.dueDate,
    category: updatedTask.category,
    status: updatedTask.status
  };
  await updateDoc(taskDoc, taskData);
};

const deleteTask = async (id: string): Promise<void> => {
  const tasksCollection = getUserTasksCollection();
  const taskDoc = doc(tasksCollection, id);
  await deleteDoc(taskDoc);
};

export { addTask, getTasks, updateTask, deleteTask };