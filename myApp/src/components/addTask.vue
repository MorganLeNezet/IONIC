<template>
    <ion-item>
      <ion-input v-model="newTask" placeholder="Add a new task" @keyup.enter="addTask" />
      <ion-button @click="addTask" slot="end">Ajouter</ion-button>
    </ion-item>
  </template>
  
  <script setup lang="ts">
  import { ref, defineEmits } from 'vue';
  import { IonItem, IonInput, IonButton } from '@ionic/vue';
  
  const newTask = ref<string>('');
  const emit = defineEmits(['add-task']);
  
  const addTask = () => {
    if (newTask.value.trim() !== '') {
      emit('add-task', newTask.value);
      newTask.value = '';
    }
  };
  </script>
  
  <style scoped>
  /* Ajoutez ici vos styles personnalisés */
  </style>