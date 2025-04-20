<template>
    <div class="w-full h-full overflow-hidden overflow-y-auto">
        <div class="grid grid-cols-3 gap-5" v-if="!onTask && activeTab == 1">
            <div v-for="(item, index) in projects" :key="index" class="w-full h-full bg-white mb-5 rounded-xl flex items-center justify-start group relative">
                <button @click="projectTasks(item._id)" class="w-full h-full px-3 flex items-center justify-start">
                    <p class="font-semibold text-xl">{{ item.name }}</p>
                </button>
            </div>
        </div>

        <CreateTaskModal :projectId="pjId"/>
        <ProjectManager v-show="onTask && activeTab == 1"/>

        <TaskDetailsVue v-show="activeTab == 2"/>
        
        <Notification/>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { IconClockHour4, IconHourglassEmpty, IconTrash } from '@tabler/icons-vue'

import emitter from '@/emitter';

import { getProjectsManager, getProjectsMember } from '@/api/fetchApi';

import { getProjectTask, deleteProject } from '@/api/fetchApi';
import Notification from '../modals/Notification.vue';
import ProjectManager from './ProjectManager.vue';
import CreateTaskModal from '../modals/CreateTaskModal.vue';

import TaskDetailsVue from '../task/TaskDetails.vue';

export default {
    components: {
        CreateTaskModal,
        RouterLink,
        IconClockHour4, 
        IconHourglassEmpty,
        IconTrash,
        Notification,
        ProjectManager,
        TaskDetailsVue
    },
    setup(props) {
        const onTask = ref(false);
        const pjId = ref('')
        const projects = ref([])

        const activeTab = ref(1)

        onMounted(() => {
            fetchProjectsMember()

            init()
        })

        const init = () => {
            emitter.on('*', async(type, ev) => {
                switch (type) {
                    case 'RELOAD_PROJECT':
                        await fetchProjectsMember()
                        break
                    case 'TASK_DETAILS':
                        activeTab.value = 2
                        break
                    case 'CLOSE_TASK_DETAILS':
                        activeTab.value = 1
                        break
                    case 'CLOSE_PJ_MANAGER':
                        onTask.value = false
                        break
                }
            })

        }

        const fetchProjectsMember = async () => {
            try {
                const data = await getProjectsMember();

                projects.value = data.projects; 
            } catch (error) {
                console.error("Error fetching projects:", error.message);
            }
        };

        const projectTasks = async(projectId) => {
            pjId.value = projectId

            onTask.value = true

            emitter.emit('PJ_DETAILS', {projectId, isManager: false})
        }

        const closeTask = () => {
            onTask.value = false
        }

        return { onTask, closeTask, pjId, projects, projectTasks, activeTab }
    }
}
</script>