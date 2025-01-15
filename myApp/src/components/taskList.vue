<template>
  <ion-list>
    <ion-item-sliding v-for="task in tasks" :key="task.id">
      <ion-item @click="viewTask(task)">
        <ion-label>
          <h2>{{ task.title }}</h2>
          <p>Catégorie: {{ task.category }}</p>
          <p>Statut: {{ task.status }}</p>
          <p>Date limite: {{ new Date(task.dueDate).toLocaleDateString() }}</p>
        </ion-label>
        <ion-button 
          v-if="task.audioData"
          slot="end" 
          fill="clear"
          @click.stop="playAudio(task.audioData, task.id)"
          :color="currentPlayingId === task.id ? 'danger' : 'primary'"
          class="audio-button"
        >
          <ion-icon :icon="currentPlayingId === task.id ? stopCircle : playCircle"></ion-icon>
        </ion-button>
      </ion-item>
      <ion-item-options side="end">
        <ion-item-option color="danger" @click="presentAlert(task.id)">Delete</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
    <ion-alert
      :is-open="showAlert"
      header="Confirm"
      message="Are you sure you want to delete this task?"
      :buttons="[ 
        { text: 'Cancel', role: 'cancel', handler: closeAlert },
        { text: 'Delete', handler: deleteTask }
      ]"
    />
  </ion-list>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { IonList, IonItem, IonLabel, IonButton, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonAlert } from '@ionic/vue';
import { playCircle, stopCircle } from 'ionicons/icons';
import { Task } from '@/model/types';

const currentPlayingId = ref<string | null>(null);
const audioElement = ref<HTMLAudioElement | null>(null);

const props = defineProps<{
  tasks: Task[];
}>();

const emit = defineEmits<{
  (e: 'delete-task', id: string): void;
  (e: 'view-task', task: Task): void;
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
  if (taskId.value !== null) {
    emit('delete-task', taskId.value);
    taskId.value = null;
    showAlert.value = false;
  }
};

const viewTask = (task: Task) => {
  emit('view-task', task);
};

const playAudio = (audioData: { base64: string; mimeType: string }, taskId: string) => {
  if (currentPlayingId.value === taskId) {
    // Stop playing
    if (audioElement.value) {
      audioElement.value.pause();
      audioElement.value = null;
    }
    currentPlayingId.value = null;
  } else {
    // Stop previous audio if playing
    if (audioElement.value) {
      audioElement.value.pause();
    }
    
    // Play new audio
    const audio = new Audio(`data:${audioData.mimeType};base64,${audioData.base64}`);
    audio.onended = () => {
      currentPlayingId.value = null;
      audioElement.value = null;
    };
    audio.play();
    audioElement.value = audio;
    currentPlayingId.value = taskId;
  }
};
</script>

<style scoped>
.audio-button {
  font-size: 2rem;
}

ion-item-sliding {
  margin-bottom: 4px;
}
</style>

