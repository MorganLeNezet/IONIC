<template>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position="floating">Title</ion-label>
              <ion-input v-model="task.title" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Description</ion-label>
              <ion-textarea v-model="task.description" required></ion-textarea>
            </ion-item>
            <ion-button expand="full" @click="saveTask">Save</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonTextarea, IonButton } from '@ionic/vue';
  
  const router = useRouter();
  const task = ref<{ title: string, description: string }>({ title: '', description: '' });
  
  const saveTask = () => {
    if (task.value.title && task.value.description) {
      // Emit event or save task to store
      router.push('/home');
    } else {
      // Show validation error
    }
  };
  </script>