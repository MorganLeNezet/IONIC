<template>
  <ion-list>
    <ion-item-sliding v-for="(task, index) in tasks" :key="task.id">
      <ion-item @click="viewTask(task)">
        <ion-label>
          <h2>{{ task.title }}</h2>
          <p>Catégorie: {{ task.category }}</p>
          <p>Statut: {{ task.status }}</p>
          <p>Date limite: {{ task.dueDate }}</p>
        </ion-label>
      </ion-item>
      <ion-item-options side="end">
        <ion-item-option color="danger" @click="presentAlert(task.id)">Delete</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
  <ion-alert
    :is-open="showAlert"
    header="Confirm"
    message="Are you sure you want to delete this task?"
    :buttons="[ 
      { text: 'Cancel', role: 'cancel', handler: closeAlert },
      { text: 'Delete', handler: deleteTask }
    ]"
  />
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonAlert } from '@ionic/vue';
import { Task } from '@/model/types';

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
</script>