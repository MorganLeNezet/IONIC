<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Login</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label position="floating">Email</ion-label>
                <ion-input v-model="email" type="email" required></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Mot de passe</ion-label>
                <ion-input v-model="password" type="password" required></ion-input>
              </ion-item>
              <ion-button expand="full" @click="login">Connexion</ion-button>
              <ion-button expand="full" color="light" @click="goToRegister">Inscription</ion-button>
              <ion-text color="danger" v-if="errorMessage">{{ errorMessage }}</ion-text>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from '@vue/reactivity';
  import { useRouter } from 'vue-router';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonInput, IonButton, IonText } from '@ionic/vue';
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  
  const login = async () => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email.value, password.value);
      router.push('/home');
    } catch (error) {
      errorMessage.value = "Mauvais email ou mot de passe";
    }
  };
  
  const goToRegister = () => {
    router.push('/register');
  };
  </script>