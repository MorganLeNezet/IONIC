<script setup lang="ts">
import { ref, computed } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonSelect, IonSelectOption, IonItem, IonLabel } from '@ionic/vue';
import TaskList from '@/components/TaskList.vue';
import { getTasks, deleteTask } from '@/services/taskServices';
import { onMounted } from '@vue/runtime-core';
import { Task } from '@/model/types';
import { auth } from '@/services/firebaseConfig';
import { signOut } from 'firebase/auth';

const router = useRouter();
const tasks = ref<(Task & { id: string })[]>([]);
const statusFilter = ref('all');
const categoryFilter = ref('all');

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesStatus = statusFilter.value === 'all' || task.status === statusFilter.value;
    const matchesCategory = categoryFilter.value === 'all' || task.category === categoryFilter.value;
    return matchesStatus && matchesCategory;
  });
});

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
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label>Statut</ion-label>
              <ion-select v-model="statusFilter">
                <ion-select-option value="all">Tous</ion-select-option>
                <ion-select-option value="À faire">À faire</ion-select-option>
                <ion-select-option value="En cours">En cours</ion-select-option>
                <ion-select-option value="Terminé">Terminé</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label>Catégorie</ion-label>
              <ion-select v-model="categoryFilter">
                <ion-select-option value="all">Toutes</ion-select-option>
                <ion-select-option value="Cours">Cours</ion-select-option>
                <ion-select-option value="Personnel">Personnel</ion-select-option>
                <ion-select-option value="Travail">Travail</ion-select-option>
                <ion-select-option value="Maison">Maison</ion-select-option>
                <ion-select-option value="Autre">Autre</ion-select-option>
              </ion-select>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-button expand="full" @click="() => router.push('/add')">Ajouter une tâche</ion-button>
      <TaskList :tasks="filteredTasks" @delete-task="removeTask" @view-task="viewTask" />
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-grid {
  padding: 10px;
}
</style>