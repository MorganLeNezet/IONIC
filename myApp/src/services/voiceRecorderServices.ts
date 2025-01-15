import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Capacitor } from '@capacitor/core';
import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export const initRecorder = async () => {
  try {
    const canRecord = await VoiceRecorder.canDeviceVoiceRecord();
    console.log('Can device record?', canRecord.value);

    const permission = await VoiceRecorder.requestAudioRecordingPermission();
    console.log('Permission status:', permission.value);

    const hasPermission = await VoiceRecorder.hasAudioRecordingPermission();
    console.log('Has permission?', hasPermission.value);

    return permission.value;
  } catch (error) {
    console.error('Error initializing recorder:', error);
    return false;
  }
};

export const startRecording = async () => {
  try {
    const platform = Capacitor.getPlatform();
    console.log('Current platform:', platform);

    const hasPermission = await VoiceRecorder.hasAudioRecordingPermission();
    if (!hasPermission.value) {
      console.error('No recording permission');
      return false;
    }

    await VoiceRecorder.startRecording();
    console.log('Recording started');
    return true;
  } catch (error) {
    console.error('Recording error:', error);
    return false;
  }
};

export const stopRecording = async () => {
  try {
    console.log('Stopping recording...');
    const result = await VoiceRecorder.stopRecording();
    console.log('Recording stopped:', result);
    return result.value;
  } catch (error) {
    console.error('Stop recording error:', error);
    return null;
  }
};

export const uploadAudio = async (audioBlob: Blob, taskId: string): Promise<string> => {
  const storageRef = ref(storage, `audio/${taskId}.mp3`);
  await uploadBytes(storageRef, audioBlob);
  return await getDownloadURL(storageRef);
};