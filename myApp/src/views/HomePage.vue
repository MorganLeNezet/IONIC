<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { onMounted, watch } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButton
} from '@ionic/vue';

import TaskList from '@/components/TaskList.vue';

const router = useRouter();
const route = useRoute();
const tasks = ref<{ title: string; id: number; dueDate: string; category: string; status: string }[]>([]);

const loadTasks = () => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
};

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value));
};

watch(
  () => route.params,
  (params) => {
    if (params.updatedTask && params.taskIndex) {
      const updatedTask = JSON.parse(params.updatedTask as string);
      const index = parseInt(params.taskIndex as string);
      
      if (index >= 0 && index < tasks.value.length) {
        tasks.value[index] = updatedTask;
        saveTasks();
      }
      
      router.replace({ path: '/home' });
    }
  }
);

const addTask = (task: string) => {
  tasks.value.push({ title: task, id: Date.now(), dueDate: '', category: '', status: 'À faire' });
  saveTasks();
};

const removeTask = (index: number) => {
  tasks.value.splice(index, 1);
  saveTasks();
};

const viewTask = (task: { title: string; id: number; dueDate: string; category: string; status: string }, index: number) => {
  router.push({ 
    name: 'TaskDetail', 
    params: { 
      task: JSON.stringify(task), 
      index: index.toString() 
    } 
  });
};

onMounted(() => {
  loadTasks();
});
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Ma petite to do list</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-button expand="full" @click="() => router.push('/add')">Ajouter une tâche</ion-button>
      <TaskList 
        :tasks="tasks" 
        @delete-task="removeTask" 
        @view-task="viewTask" 
      />
    </ion-content>
  </ion-page>
</template>