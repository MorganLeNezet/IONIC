<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import TaskList from '@/components/TaskList.vue';
import { getTasks, deleteTask } from '@/services/taskServices';
import { onMounted } from '@vue/runtime-core';
import { Task } from '@/model/types';
import { auth } from '@/services/firebaseConfig';
import { signOut } from 'firebase/auth';

const router = useRouter();
const tasks = ref<(Task & { id: string })[]>([]);

const loadTasks = async () => {
  tasks.value = await getTasks();
};

const removeTask = async (id: string) => {
  await deleteTask(id);
  loadTasks();
};

const viewTask = (task: Task & { id: string }) => {
  router.push({ name: 'EditTask', params: { task: JSON.stringify(task) } });
};

const logout = async () => {
  await signOut(auth);
  router.push('/login');
};

onMounted(() => {
  loadTasks();
});
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Ma petite to do list</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">
            Déconnexion
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-button expand="full" @click="() => router.push('/add')">Ajouter une tâche</ion-button>
      <TaskList :tasks="tasks" @delete-task="removeTask" @view-task="viewTask" />
    </ion-content>
  </ion-page>
</template>