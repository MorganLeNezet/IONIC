<script setup lang="ts">
import { ref } from 'vue';
import { IonApp, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import TaskList from './components/TaskList.vue';
import AddTask from './components/AddTask.vue';

const tasks = ref<string[]>([]);

const addTask = (task: string) => {
  tasks.value.push(task);
};

const removeTask = (index: number) => {
  tasks.value.splice(index, 1);
};
</script>