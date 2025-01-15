<template>
  <ion-list>
    <ion-item-sliding v-for="task in tasks" :key="task.id">
      <ion-item @click="emit('view-task', task)">
        <ion-label>
          <h2>{{ task.title }}</h2>
          <p>Catégorie: {{ task.category }}</p>
          <p>Statut: {{ task.status }}</p>
          <p>Date limite: {{ new Date(task.dueDate).toLocaleDateString() }}</p>
        </ion-label>
        <AudioPlay 
          v-if="task.audioData"
          :audioData="task.audioData"
          slot="end"
        />
      </ion-item>
      
      <ion-item-options side="end">
        <ion-item-option color="danger" @click="presentAlert(task.id)">
          <ion-icon slot="icon-only" :icon="trash"></ion-icon>
        </ion-item-option>
        <ion-item-option @click="emit('view-task', task)">
          <ion-icon slot="icon-only" :icon="create"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <ion-alert
      :is-open="showAlert"
      header="Confirmation"
      message="Voulez-vous vraiment supprimer cette tâche ?"
      :buttons="[
        { text: 'Annuler', role: 'cancel', handler: closeAlert },
        { text: 'Supprimer', handler: deleteTask }
      ]"
    />
  </ion-list>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { IonList, IonItem, IonLabel, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonAlert } from '@ionic/vue';
import { trash, create } from 'ionicons/icons';
import { Task } from '@/model/types';
import AudioPlay from './AudioPlay.vue';

const props = defineProps<{
  tasks: (Task & { id: string })[];
}>();

const emit = defineEmits<{
  (e: 'delete-task', id: string): void;
  (e: 'view-task', task: Task & { id: string }): void;
}>();

const showAlert = ref(false);
const taskId = ref<string | null>(null);

const presentAlert = (id: string) => {
  taskId.value = id;
  showAlert.value = true;
};

const closeAlert = () => {
  showAlert.value = false;
  taskId.value = null;
};

const deleteTask = () => {
  if (taskId.value) {
    emit('delete-task', taskId.value);
  }
  closeAlert();
};
</script>

