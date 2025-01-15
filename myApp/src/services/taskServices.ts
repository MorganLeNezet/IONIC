import { auth, db, storage } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Task } from '@/model/types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const getUserTasksCollection = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');
  return collection(db, 'users', userId, 'tasks');
};

const addTask = async (task: Task): Promise<void> => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');
  
  if (task.audioData?.base64) {
    const sizeInMB = (task.audioData.base64.length * 0.75) / 1024 / 1024;
    if (sizeInMB > 1) {
      throw new Error('Audio file too large (max 1MB)');
    }
  }

  const tasksCollection = collection(db, 'users', userId, 'tasks');
  await addDoc(tasksCollection, {
    ...task,
    userId,
    createdAt: new Date().toISOString()
  });
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
  await updateDoc(taskDoc, {
    ...updatedTask,
    updatedAt: new Date().toISOString()
  });
};

const deleteTask = async (id: string): Promise<void> => {
  const tasksCollection = getUserTasksCollection();
  const taskDoc = doc(tasksCollection, id);
  await deleteDoc(taskDoc);
};

export const uploadAudio = async (audioBlob: Blob, taskId: string): Promise<string> => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');
  
  const storageRef = ref(storage, `audio/${userId}/${taskId}.mp3`);
  try {
    console.log('Uploading audio...');
    await uploadBytes(storageRef, audioBlob);
    console.log('Audio uploaded successfully');
    const downloadUrl = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error;
  }
};

export { addTask, getTasks, updateTask, deleteTask };