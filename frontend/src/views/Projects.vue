<template>
    <BaseLayout>
        <template v-slot:header>
            <ProjectHeader/>
        </template>
        <template v-slot:main>
            <div class="top-[2%] absolute left-[2%] w-[97%] h-[94%]">
                <ProjectComponent/>
            </div>
        </template>
    </BaseLayout>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import emitter from '@/emitter';

import BaseLayout from '@/components/layout/BaseLayout.vue';

import ProjectHeader from '@/components/header/ProjectHeader.vue';

import ProjectComponent from '@/components/class/ProjectComponent.vue';

import { getProjectsManager, getProjectsMember } from '@/api/fetchApi';


export default {
    components: {
        BaseLayout,
        ProjectHeader,
        ProjectComponent,
    },
    setup () {
        onMounted(() => {
            console.log(":::::MOUNT PROJECTS")
        })
        return { }
    }
}
</script>