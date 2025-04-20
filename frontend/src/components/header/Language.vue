<template>  
    <div class="flex justify-center items-center rounded-full">
        <div v-if="currentLanguage==='vi'" class="flex items-center">
            <button @click="changeLanguage('en')" class="w-[50px] h-[50px] rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold mr-2" >
                <img src="../../assets/vietnamflag.png" alt="" class="w-full h-full rounded-full object-cover">
            </button>
            <p class="font-semibold">{{ $t('11') }}</p>
        </div>

        <div v-if="currentLanguage==='en'" class="flex items-center">
            <button @click="changeLanguage('vi')" class="w-[50px] h-[50px] rounded-full bg-teal-500 hover:bg-teal-600 text-white font-semibold mr-2" >
                <img src="../../assets/usflag.png" alt="" class="w-full h-full rounded-full object-cover">
            </button>
            <p class="font-semibold">{{ $t('10') }}</p>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
     export default {
        setup() {
            const currentLanguage = ref(localStorage.getItem('language') || 'en');

            const { locale, t } = useI18n();
            const changeLanguage = (language) => {
                locale.value = language;
                localStorage.setItem('language', language)
                currentLanguage.value = language
            } 

            return { changeLanguage, t, currentLanguage }
        }
     }
</script>