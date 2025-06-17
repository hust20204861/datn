<template>
    <BaseLayout>
        <template v-slot:header>
            <DashBoardHeader/>
        </template>
                <template v-slot:main>
            <div class="top-[2%] absolute left-[2%] w-[97%] h-[94%]">
                <DashBoardComponent v-if="tab == 1"/>
                <ProfileComponent v-if="tab == 2"/>
            </div>
        </template>
    </BaseLayout>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue';

import DashBoardHeader from '@/components/header/DashBoardHeader.vue';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import DashBoardComponent from '../components/class/DashBoardComponent.vue';
import ProfileComponent from '../components/class/ProfileComponent.vue';

import emitter from '@/emitter';
export default {
    components : {
        DashBoardHeader,
        BaseLayout,
        DashBoardComponent,
        ProfileComponent
    },
    setup () {
        const role = localStorage.getItem('role');

        const tab = ref(1)

        onMounted(() => {
            init();
        });

        const init = () => {
            emitter.on("*", async (type, ev) => {
                switch (type) {
                case "PROFILE":
                    tab.value = 2
                    break;
                case "DASHBOARD":
                    tab.value = 1
                    break;
                }
                
            });
        };

        return { role , tab}
    }
}
</script>