<template>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <h2>{{ task.title }}</h2>
            <p>{{ task.description }}</p>
            <ion-button expand="full" @click="editTask">Edit</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { IonContent, IonGrid, IonRow, IonCol, IonButton } from '@ionic/vue';
  
  const route = useRoute();
  const router = useRouter();
  const task = ref<{ title: string, description: string }>(JSON.parse(route.params.task as string));
  
  const editTask = () => {
    router.push({ name: 'EditTask', params: { task: JSON.stringify(task.value) } });
  };
  </script>