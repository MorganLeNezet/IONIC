<template>
  <ion-item>
    <ion-input
      v-model="newTask"
      placeholder="ajouter une nouvelle tâche"
      @keyup.enter="addTask"
    ></ion-input>
    <ion-button @click="addTask" slot="end">Ajouter</ion-button>
  </ion-item>
  <ion-text color="danger" v-if="v$.newTask.$error" class="validation-error">
    <div v-if="v$.newTask.required.$invalid">Le titre est requis.</div>
    <div v-else-if="v$.newTask.minLength.$invalid">Minimum 3 caractères.</div>
    <div v-else-if="v$.newTask.maxLength.$invalid">Maximum 18 caractères.</div>
  </ion-text>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';
import { IonItem, IonInput, IonButton, IonText } from '@ionic/vue';

const newTask = ref('');
const emit = defineEmits(['add-task']);

const rules = {
  newTask: {
    required,
    minLength: minLength(3),
    maxLength: maxLength(18),
  },
};

const v$ = useVuelidate(rules, { newTask });

const addTask = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }

  emit('add-task', newTask.value.trim());
  newTask.value = '';
  v$.value.$reset();
};
</script>

