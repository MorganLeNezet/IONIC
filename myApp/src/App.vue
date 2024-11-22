<template>
  <ion-app>
    <ion-header>
      <ion-toolbar>
        <ion-title>Ma petite to do list</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <AddTask @add="addTask" />
      <TaskList :tasks="tasks" @delete="removeTask" />
    </ion-content>
  </ion-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import TaskList from '@/components/TaskList.vue';
import AddTask from '@/components/AddTask.vue';

const tasks = ref<string[]>([]);

const add = (task: string) => {
  tasks.value.push(task);
};

const delete = (index: number) => {
  tasks.value.splice(index, 1);
};
</script>