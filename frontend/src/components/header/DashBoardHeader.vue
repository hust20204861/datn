<template>
    <div class="flex items-center">
        <div class="flex flex-row justift-center items-center absolute left-4">
            <h1 class="font-bold text-[1.5rem] mr-1">{{name}}</h1>
            <button @click.prevent="toggleProfile" class="w-4 h-4 flex items-start justify-center">
                <IconEdit class=""/>
            </button>
        </div>
        <Language class="absolute left-[93%] top-1/2 -translate-y-1/2"/>
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
