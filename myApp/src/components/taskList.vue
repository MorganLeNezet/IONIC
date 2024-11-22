<template>
    <ion-list>
      <ion-item v-for="(task, index) in tasks" :key="index">
        {{ task }}
        <ion-button @click="$emit('remove-task', index)" slot="end" color="danger">Remove</ion-button>
      </ion-item>
    </ion-list>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  import { IonList, IonItem, IonButton } from '@ionic/vue';
  
  const props = defineProps<{
    tasks: string[];
  }>();
  </script>