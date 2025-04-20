<template>
    <div class="w-full h-full overflow-hidden overflow-y-auto">
        <div class="grid grid-cols-3 gap-5" v-if="activeTab == 1">
            <div v-for="(item, index) in projects" :key="index" class="w-full h-full bg-white mb-5 rounded-xl flex items-center justify-start group relative">
                <button @click="projectTasks(item._id)" class="w-full h-full px-3 flex items-center justify-start">
                    <p class="font-semibold text-xl">{{ item.name }}</p>
                </button>
                <button @click="DeleteProject(item._id)" class="p-3 py-7 absolute right-0">
                    <IconTrash class="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"/>
                </button>
            </div>
        </div>

        <ProjectDashBoardManager v-show="activeTab == 2"/>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { onMounted, ref } from 'vue';
import { IconClockHour4, IconHourglassEmpty, IconTrash } from '@tabler/icons-vue'

import emitter from '@/emitter';

import { getProjectsManager, getProjectsMember } from '@/api/fetchApi';

import { getProjectTask, deleteProject } from '@/api/fetchApi';
import Notification from '../modals/Notification.vue';

import ProjectDashBoardManager from './ProjectDashBoardManager.vue';
export default {
    components: {
        RouterLink,
        IconClockHour4, 
        IconHourglassEmpty,
        IconTrash,
        Notification,
        ProjectDashBoardManager
    },
    setup(props) {
        const pjId = ref('')
        const projects = ref([])

        const activeTab = ref(1)

        onMounted(() => {
            fetchProjectsManager()

            init()
        })

        const init = () => {
            emitter.on('*', async(type, ev) => {
                switch (type) {
                    case 'RELOAD_PROJECT':
                        await fetchProjectsManager()
                        break
                    case 'PROJECT_DETAILS':
                        activeTab.value = 2
                        break
                    case 'CLOSE_PROJECT_DETAILS':
                        activeTab.value = 1
                        break
                }
            })

        }

        const fetchProjectsManager = async () => {
            try {
                const data = await getProjectsManager();

                projects.value = data.projects; 
            } catch (error) {
                console.error("Error fetching projects:", error.message);
            }
        };

        const projectTasks = async(projectId) => {
            pjId.value = projectId

            emitter.emit('PROJECT_DETAILS', projectId)
        }

        const DeleteProject = async(projectId) => {
            const data = await deleteProject(projectId);
            emitter.emit('NOTIFICATION', data)
            if(data.status == 'success'){
                emitter.emit("RELOAD_PROJECT")
            }
        }

        return { pjId,projects, projectTasks, DeleteProject, activeTab }
    }
}
</script>