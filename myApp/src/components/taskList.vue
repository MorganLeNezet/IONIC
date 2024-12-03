<template>
  <ion-list>
    <ion-item-sliding v-for="(task, index) in tasks" :key="index">
      <ion-item @click="viewTask(task)">
        {{ task.title }}
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
    buttons="[{ text: 'Cancel', role: 'cancel' }, { text: 'Delete', handler: deleteTask }]"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { IonList, IonItem, IonItemSliding, IonItemOptions, IonItemOption, IonAlert } from '@ionic/vue';

const props = defineProps<{
  tasks: { title: string, description: string }[];
}>();

const emit = defineEmits(['delete-task', 'view-task']);
const showAlert = ref(false);
const taskIndex = ref<number | null>(null);

const presentAlert = (index: number) => {
  taskIndex.value = index;
  showAlert.value = true;
};

const deleteTask = () => {
  if (taskIndex.value !== null) {
    emit('delete-task', taskIndex.value);
    showAlert.value = false;
  }
};

const viewTask = (task: { title: string, description: string }) => {
  emit('view-task', task);
};
</script>