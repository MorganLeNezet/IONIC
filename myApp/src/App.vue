<template>
  <ion-app>
    <ion-header>
      <ion-toolbar>
        <ion-title>Ma petite to do list</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <router-view />
    </ion-content>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
</script>