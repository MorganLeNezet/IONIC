<template>
  <ion-list>
    <ion-item-sliding v-for="(task, index) in tasks" :key="index">
      <ion-item @click="viewTask(task, index)" :class="{ 'overdue': isOverdue(task.dueDate) }">
        <ion-label>
          <h2>{{ task.title }}</h2>
          <p>Catégorie: {{ task.category }}</p>
          <p>Statut: {{ task.status }}</p>
          <p>Date limite: {{ task.dueDate }}</p>
        </ion-label>
      </ion-item>
      <ion-item-options side="end">
        <ion-item-option color="danger" @click="presentAlert(index)">Delete</ion-item-option>
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

const props = defineProps<{
  tasks: { title: string; id: number; dueDate: string; category: string; status: string }[];
}>();

const emit = defineEmits<{
  (e: 'delete-task', index: number): void;
  (e: 'view-task', task: { title: string; id: number; dueDate: string; category: string; status: string }, index: number): void;
}>();

const showAlert = ref(false);
const taskIndex = ref<number | null>(null);

const presentAlert = (index: number) => {
  taskIndex.value = index;
  showAlert.value = true;
};

const closeAlert = () => {
  showAlert.value = false;
  taskIndex.value = null;
};

const deleteTask = () => {
  if (taskIndex.value !== null) {
    emit('delete-task', taskIndex.value);
    taskIndex.value = null;
    showAlert.value = false;
  }
};

const viewTask = (task: { title: string; id: number; dueDate: string; category: string; status: string }, index: number) => {
  emit('view-task', task, index);
};

const isOverdue = (dueDate: string) => {
  const today = new Date().toISOString().split('T')[0];
  return dueDate && dueDate < today;
};
</script>

<style scoped>
.overdue {
  --background: #ffcccc;
}
</style>