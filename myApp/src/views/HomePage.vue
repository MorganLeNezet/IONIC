<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import TaskList from '@/components/TaskList.vue';
import { getTasks, deleteTask } from '@/services/taskServices';
import { onMounted } from '@vue/runtime-core';
import { Task } from '@/model/types';

const router = useRouter();
const tasks = ref<Task[]>([]);

const loadTasks = async () => {
  tasks.value = await getTasks();
};

const removeTask = async (id: string) => {
  await deleteTask(id);
  loadTasks();
};

const viewTask = (task: Task) => {
  router.push({ name: 'TaskDetail', params: { task: JSON.stringify(task) } });
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
      <TaskList :tasks="tasks" @delete-task="removeTask" @view-task="viewTask" />
    </ion-content>
  </ion-page>
</template>