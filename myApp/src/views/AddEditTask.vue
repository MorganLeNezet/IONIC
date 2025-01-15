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

        <ion-item>
          <ion-label position="floating">Enregistrement vocal</ion-label>
          <ion-button 
             @click="handleRecording" 
            :color="isRecording ? 'danger' : 'primary'">
          <ion-icon :icon="isRecording ? stopCircle : mic"></ion-icon>
            {{ isRecording ? 'Stop' : 'Record' }}
          </ion-button>
        </ion-item>

        <ion-item v-if="audioUrl">
          <ion-label>Écouter l'enregistrement</ion-label>
          <audio controls>
        <source :src="audioUrl" type="audio/mp3">
          </audio>
       <ion-button slot="end" color="danger" @click="deleteAudio">
        <ion-icon :icon="trash"></ion-icon>
       </ion-button>
      </ion-item>

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
import { onMounted } from '@vue/runtime-core';
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
import { mic, stopCircle, trash } from 'ionicons/icons';
import { startRecording, stopRecording } from '@/services/voiceRecorderServices';
import { Task } from '@/model/types';


const audioUrl = ref<string | null>(null);

const router = useRouter();
const route = useRoute();
const isSubmitting = ref(false);
const isRecording = ref(false);

const task = ref<Task>({
  title: '',
  dueDate: new Date().toISOString(),
  category: '',
  status: 'À faire',
  audioData: undefined
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

onMounted(() => {
  if (route.params.task) {
    const parsedTask = JSON.parse(route.params.task as string);
    task.value = parsedTask;
    taskId.value = parsedTask.id;
    
    if (parsedTask.audioData) {
      try {
        const binaryString = window.atob(parsedTask.audioData.base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: parsedTask.audioData.mimeType });
        audioUrl.value = URL.createObjectURL(blob);
        
        console.log('Audio URL created:', audioUrl.value);
      } catch (error) {
        console.error('Error creating audio URL:', error);
      }
    }
  }
});

const handleRecording = async () => {
  try {
    if (!isRecording.value) {
      const started = await startRecording();
      isRecording.value = started;
    } else {
      const recordingData = await stopRecording();
      isRecording.value = false;
      
      if (recordingData && recordingData.recordDataBase64) {
        const audioData = {
          base64: recordingData.recordDataBase64,
          mimeType: recordingData.mimeType
        };
        task.value = { ...task.value, audioData };
        
        const blob = await fetch(`data:${recordingData.mimeType};base64,${recordingData.recordDataBase64}`).then(r => r.blob());
        audioUrl.value = URL.createObjectURL(blob);
      }
    }
  } catch (error) {
    console.error('Recording error:', error);
    isRecording.value = false;
  }
};


const deleteAudio = async () => {
  try {
    audioUrl.value = null;
    const { audioData, ...cleanTask } = task.value;
    task.value = cleanTask;

    if (isEditing.value && taskId.value) {
      await updateTask(taskId.value, {
        ...cleanTask,
        audioData: null
      });
    }
  } catch (error) {
    console.error('Error deleting audio:', error);
  }
};
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
ion-item {
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-top: 16px;
  --min-height: 75px;
  margin-bottom: 16px;
}

ion-label[position="floating"] {
  transform: translate3d(0, -45px, 0) scale(0.85);
  margin-bottom: 8px;
  --color: var(--ion-color-medium);
}

ion-input, ion-select {
  --padding-top: 16px;
  margin-top: 8px;
}

ion-datetime {
  --padding-top: 20px;
  margin-top: 12px;
  min-height: 60px;
}

</style>