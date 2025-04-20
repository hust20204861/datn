<template>
    <div class="flex items-center">
        <h1 class="font-bold text-[3rem] ml-[2%] absolute">{{t('2')}}</h1>

        <button v-show="onShow" class="p-3 bg-green-600 text-white hover:bg-green-700 rounded-xl ml-9 absolute right-10 flex items-center justify-center" @click="createProject">
            <IconPlus size="24" class="text-white mr-2"/>
            {{t('5')}}
        </button>

        <CreateProjectModal v-if="createProjectModal" @closeModal="closeModal"/>
        <!-- <CreateTaskModal/> -->
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import emitter from '@/emitter';

import CreateProjectModal from '../modals/CreateProjectModal.vue';
import CreateTaskModal from '../modals/CreateTaskModal.vue';

import { IconPlus } from '@tabler/icons-vue';
export default {
    components:{
        CreateProjectModal, CreateTaskModal, IconPlus
    },
    setup () {
        const { t } = useI18n();
        const createProjectModal = ref(false);

        const onShow = ref(true)

        onMounted(() => {
            init()

        })

        const init = () => {
            emitter.on('*', async(type, ev) => {
                switch (type) {
                    case 'PJ_DETAILS':
                        onShow.value = false
                        break
                }
            })

        }
        const createProject = () => {
            createProjectModal.value = true;
        }
        const closeModal = () => {
           createProjectModal.value = false;
        };
        return { createProject, createProjectModal, closeModal, t, onShow }
    }
}
</script>
