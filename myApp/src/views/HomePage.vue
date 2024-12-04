<!-- HomePage.vue -->
<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import AddTask from '@/components/AddTask.vue';
import TaskList from '@/components/TaskList.vue';

const router = useRouter();
const tasks = ref<{ title: string }[]>([]);

const addTask = (task: string) => {
  tasks.value.push({ title: task });
};

const removeTask = (index: number) => {
  tasks.value.splice(index, 1);
};

const viewTask = (task: { title: string }) => {
  router.push({ name: 'TaskDetail', params: { task: JSON.stringify(task) } });
};

const updateTask = (updatedTask: { title: string }) => {
  const index = tasks.value.findIndex(task => task.title === updatedTask.title);
  if (index !== -1) {
    tasks.value[index] = updatedTask;
  }
};

const saveTask = (updatedTask: { title: string }) => {
  const index = tasks.value.findIndex(task => task.title === updatedTask.title);
  if (index !== -1) {
    tasks.value[index] = updatedTask;
  } else {
    tasks.value.push(updatedTask);
  }
};
</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Ma petite to do list</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <AddTask @add-task="addTask" />
      <TaskList :tasks="tasks" @delete-task="removeTask" @view-task="viewTask" @save-task="saveTask" />
    </ion-content>
  </ion-page>
</template>