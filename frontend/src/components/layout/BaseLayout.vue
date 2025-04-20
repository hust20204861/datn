<template>
    <BaseNav/>
    <div class="bg-gray-200">
        <div class="w-[85%] h-[10%] right-0 absolute top-0 flex items-center bg-gray-300">
            <slot name="header"></slot>
        </div>
        <div class="top-[10%] absolute right-0 w-[85%] h-[90%] bg-gray-200">
            <slot name="main"></slot>
        </div>
    </div>
</template>

<script>
import BaseNav from '@/components/BaseNav.vue';
export default {
    components:{
        BaseNav,
    }
}
</script>