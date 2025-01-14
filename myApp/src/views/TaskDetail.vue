<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Détail de la tâche</ion-title>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label>
                <h2>{{ task.title }}</h2>
                <p>Catégorie: {{ task.category }}</p>
                <p>Statut: {{ task.status }}</p>
                <p>Date limite: {{ task.dueDate }}</p>
              </ion-label>
            </ion-item>
            <ion-button expand="full" @click="editTask">Modifier</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const task = ref<{ title: string; id: string; dueDate: string; category: string; status: string }>(JSON.parse(route.params.task as string));
const taskIndex = route.params.index;

const editTask = () => {
  router.push({
    name: 'EditTask',
    params: {
      task: JSON.stringify(task.value),
      index: taskIndex as string
    }
  });
};
</script>