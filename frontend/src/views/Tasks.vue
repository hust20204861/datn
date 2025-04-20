<template>
    <BaseLayout>
        <template v-slot:header>
            <TaskHeader/>
        </template>
        <template v-slot:main>
            <div class="top-[2%] absolute left-[2%] w-[97%] h-[94%]">
                <TaskComponent/>
            </div>
        </template>
    </BaseLayout>
</template>

<script>
import { onMounted, ref } from 'vue';
import emitter from '@/emitter';

import BaseLayout from '@/components/layout/BaseLayout.vue';

import TaskHeader from '@/components/header/TaskHeader.vue';

import TaskComponent from '@/components/class/TaskComponent.vue';

import { getUserTasks } from '@/api/fetchApi';
export default {
    components: {
        BaseLayout,
        TaskHeader,
        TaskComponent
    },
    setup () {
        onMounted(() => {
            emitter.emit('USER_TASKS')
        })
        const tasksManager = ref(null);

        const fetchUserTasks = async () => {
      try {
        const data = await getUserTasks();
        tasksManager.value = data.tasks; 
        console.log(tasksManager.value)
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      }
    };
        fetchUserTasks();
        return { tasksManager }
    }
}
</script>