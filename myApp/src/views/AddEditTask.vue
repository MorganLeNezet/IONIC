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
      <form @submit.prevent="handleSubmit">
        <ion-list>
          <!-- Title Input -->
          <ion-item :class="{ 'has-error': v$.task.title.$error }">
            <ion-label position="floating">Titre</ion-label>
            <ion-input 
              v-model="task.title"
              @input="v$.task.title.$touch()"
              required
            ></ion-input>
          </ion-item>
          <div class="error-message" v-if="v$.task.title.$error">
            <span v-if="v$.task.title.required.$invalid">Le titre est requis</span>
            <span v-else-if="v$.task.title.minLength.$invalid">Minimum 3 caractères</span>
            <span v-else-if="v$.task.title.maxLength.$invalid">Maximum 18 caractères</span>
          </div>

          <!-- Due Date Input -->
          <ion-item :class="{ 'has-error': v$.task.dueDate.$error }">
            <ion-label position="floating">Date limite</ion-label>
            <ion-datetime
              v-model="task.dueDate"
              @ionChange="v$.task.dueDate.$touch()"
              display-format="DD/MM/YYYY"
            ></ion-datetime>
          </ion-item>
          <div class="error-message" v-if="v$.task.dueDate.$error">
            La date limite est requise
          </div>

          <!-- Category Select -->
          <ion-item :class="{ 'has-error': v$.task.category.$error }">
            <ion-label position="floating">Catégorie</ion-label>
            <ion-select 
              v-model="task.category"
              @ionChange="v$.task.category.$touch()"
            >
              <ion-select-option value="Cours">Cours</ion-select-option>
              <ion-select-option value="Personnel">Personnel</ion-select-option>
              <ion-select-option value="Travail">Travail</ion-select-option>
              <ion-select-option value="Maison">Maison</ion-select-option>
              <ion-select-option value="Autre">Autre</ion-select-option>
            </ion-select>
          </ion-item>
          <div class="error-message" v-if="v$.task.category.$error">
            La catégorie est requise
          </div>

          <!-- Status Select -->
          <ion-item :class="{ 'has-error': v$.task.status.$error }">
            <ion-label position="floating">Statut</ion-label>
            <ion-select 
              v-model="task.status"
              @ionChange="v$.task.status.$touch()"
            >
              <ion-select-option value="À faire">À faire</ion-select-option>
              <ion-select-option value="En cours">En cours</ion-select-option>
              <ion-select-option value="Terminé">Terminé</ion-select-option>
            </ion-select>
          </ion-item>
          <div class="error-message" v-if="v$.task.status.$error">
            Le statut est requis
          </div>
        </ion-list>

        <div class="ion-padding">
          <ion-button 
            expand="block" 
            type="submit" 
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Enregistrement...' : (isEditing ? 'Modifier' : 'Créer') }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from '@vue/reactivity';
import { useRouter, useRoute } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonList,
  IonButtons, IonBackButton, IonDatetime, IonSelect,
  IonSelectOption
} from '@ionic/vue';
import { addTask, updateTask } from '@/services/taskServices';

const router = useRouter();
const route = useRoute();
const isSubmitting = ref(false);

const task = ref({
  title: '',
  dueDate: new Date().toISOString(),
  category: '',
  status: 'À faire'
});

const taskId = ref<string | null>(null);
const isEditing = computed(() => !!taskId.value);

const rules = {
  task: {
    title: { 
      required,
      minLength: minLength(3),
      maxLength: maxLength(18)
    },
    dueDate: { required },
    category: { required },
    status: { required }
  }
};

const v$ = useVuelidate(rules, { task });

if (route.params.task) {
  const parsedTask = JSON.parse(route.params.task as string);
  task.value = parsedTask;
  taskId.value = parsedTask.id;
}

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  try {
    isSubmitting.value = true;
    
    if (isEditing.value && taskId.value) {
      await updateTask(taskId.value, task.value);
    } else {
      await addTask(task.value);
    }
    
    router.push('/home');
  } catch (error) {
    console.error('Error saving task:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.has-error {
  --border-color: var(--ion-color-danger);
}

.error-message {
  color: var(--ion-color-danger);
  font-size: 0.8rem;
  margin: 4px 16px;
}

ion-button {
  margin-top: 16px;
}
</style>