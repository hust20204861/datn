<template>
    <h1 class="font-bold text-[1.5rem] ml-[2%]">{{t('3')}}</h1>
</template>

<script>
import { useI18n } from 'vue-i18n';

    export default {
        setup() {
            const {t} = useI18n()
            return{ t }
        }
    }
</script>
