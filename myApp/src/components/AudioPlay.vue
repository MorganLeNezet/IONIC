<template>
    <ion-button 
      fill="clear"
      @click.stop="playAudio"
      :color="isPlaying ? 'danger' : 'primary'"
      class="audio-button"
    >
      <ion-icon :icon="isPlaying ? stopCircle : playCircle"></ion-icon>
    </ion-button>
  </template>
  
  <script setup lang="ts">
  import { ref } from '@vue/reactivity';
    import { defineProps, onUnmounted } from '@vue/runtime-core';
  import { IonButton, IonIcon } from '@ionic/vue';
  import { playCircle, stopCircle } from 'ionicons/icons';
  
  const props = defineProps<{
    audioData: {
      base64: string;
      mimeType: string;
    };
  }>();
  
  const isPlaying = ref(false);
  const audioElement = ref<HTMLAudioElement | null>(null);
  
  const playAudio = () => {
    if (isPlaying.value) {
      // Stop playing
      if (audioElement.value) {
        audioElement.value.pause();
        audioElement.value = null;
      }
      isPlaying.value = false;
    } else {
      // Play new audio
      const audio = new Audio(`data:${props.audioData.mimeType};base64,${props.audioData.base64}`);
      audio.onended = () => {
        isPlaying.value = false;
        audioElement.value = null;
      };
      audio.play();
      audioElement.value = audio;
      isPlaying.value = true;
    }
  };
  
  onUnmounted(() => {
    if (audioElement.value) {
      audioElement.value.pause();
      audioElement.value = null;
    }
  });
  </script>
  
  <style scoped>
  .audio-button {
    --padding-start: 8px;
    --padding-end: 8px;
  }
  </style>