<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Ma petite to do list</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <AddTask @add-task="addTask" />
      <TaskList :tasks="tasks" @remove-task="removeTask" @view-task="viewTask" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import AddTask from '@/components/AddTask.vue';
import TaskList from '@/components/TaskList.vue';

const router = useRouter();
const tasks = ref<{ title: string, description: string }[]>([]);

const addTask = (task: { title: string, description: string }) => {
  tasks.value.push(task);
};

const removeTask = (index: number) => {
  tasks.value.splice(index, 1);
};

const viewTask = (task: { title: string, description: string }) => {
  router.push({ name: 'TaskDetail', params: { task } });
};
</script>