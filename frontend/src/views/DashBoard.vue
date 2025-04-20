<template>
    <BaseLayout>
        <template v-slot:header>
            <DashBoardHeader/>
        </template>
                <template v-slot:main>
            <div class="top-[2%] absolute left-[2%] w-[97%] h-[94%]">
                <DashBoardComponent/>
            </div>
        </template>
    </BaseLayout>
</template>

<script>
import DashBoardHeader from '@/components/header/DashBoardHeader.vue';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import DashBoardComponent from '../components/class/DashBoardComponent.vue';
export default {
    components : {
        DashBoardHeader,
        BaseLayout,
        DashBoardComponent
    },
    setup () {
        const role = localStorage.getItem('role');
        return { role }
    }
}
</script>