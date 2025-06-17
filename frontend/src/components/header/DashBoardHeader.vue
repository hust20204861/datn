<template>
    <div class="flex items-center">
        <div class="flex flex-row justift-center items-center absolute left-[5%]">
            <h1 class="font-bold text-[3rem]">{{name}}</h1>
            <button @click.prevent="toggleProfile">
                <IconEdit class="mt-[22px] ml-2"/>
            </button>
        </div>
        <Language class="absolute left-[90%] top-1/2 -translate-y-1/2"/>
    </div>
</template>

<script>
import { IconEdit } from '@tabler/icons-vue';
import Language from './Language.vue';

import emitter from '@/emitter';

    export default {
        components:{
            Language,
            IconEdit
        },
        setup() {
            const name = localStorage.getItem('name')

            const toggleProfile = () => {
                emitter.emit('PROFILE')
            }
            return { name, toggleProfile }
        },  
    }
</script>
