<template>
  <ion-content>
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label position="floating">Title</ion-label>
            <ion-input v-model="task.title" required></ion-input>
          </ion-item>
          <ion-button expand="full" @click="saveTask">Save</ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { useRouter, useRoute } from 'vue-router';
import { IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';

const router = useRouter();
const route = useRoute();
const task = ref<{ title: string }>(route.params.task ? JSON.parse(route.params.task as string) : { title: '' });

const emit = defineEmits(['save-task']);

const saveTask = () => {
  if (task.value.title) {
    emit('save-task', task.value);
    router.push('/home');
  } else {
    // Show validation error
  }
};
</script>