<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ isEditing ? 'Modifier la tâche' : 'Nouvelle tâche' }}</ion-title>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position="floating">Titre</ion-label>
              <ion-input 
                v-model="task.title" 
                required
                :class="{ 'ion-invalid': v$.task.title.$error }"
              ></ion-input>
              <ion-note slot="error" v-if="v$.task.title.$error">
                <span v-if="v$.task.title.required.$invalid">Le titre est requis</span>
                <span v-else-if="v$.task.title.minLength.$invalid">Minimum 3 caractères</span>
                <span v-else-if="v$.task.title.maxLength.$invalid">Maximum 18 caractères</span>
              </ion-note>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Date limite</ion-label>
              <ion-datetime v-model="task.dueDate" display-format="YYYY-MM-DD"></ion-datetime>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Catégorie</ion-label>
              <ion-select v-model="task.category">
                <ion-select-option value="Travail">Travail</ion-select-option>
                <ion-select-option value="Personnel">Personnel</ion-select-option>
                <ion-select-option value="Autre">Autre</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Statut</ion-label>
              <ion-select v-model="task.status">
                <ion-select-option value="À faire">À faire</ion-select-option>
                <ion-select-option value="En cours">En cours</ion-select-option>
                <ion-select-option value="Terminé">Terminé</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-button expand="full" @click="saveTask">Enregistrer</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { computed, onMounted } from '@vue/runtime-core';
import { useRouter, useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonBackButton, IonNote, IonDatetime, IonSelect, IonSelectOption } from '@ionic/vue';
import { addTask, updateTask } from '@/services/taskServices';

const router = useRouter();
const route = useRoute();

const task = ref({ title: '', id: '', dueDate: '', category: '', status: 'À faire' });

const taskIndex = route.params.index ? parseInt(route.params.index as string) : -1;
const isEditing = computed(() => taskIndex !== -1);

const rules = {
  task: {
    title: { 
      required,
      minLength: minLength(3),
      maxLength: maxLength(18)
    }
  }
};

const v$ = useVuelidate(rules, { task });

onMounted(() => {
  if (route.params.task && route.params.index) {
    const parsedTask = JSON.parse(route.params.task as string);
    task.value = parsedTask;
  }
});

const saveTask = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) {
    return;
  }

  if (isEditing.value) {
    await updateTask(task.value.id, task.value);
  } else {
    await addTask(task.value);
  }

  router.push({ name: 'Home' });
};
</script>