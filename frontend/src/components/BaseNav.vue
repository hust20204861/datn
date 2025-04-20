<template>
    <div class="w-[15%] h-screen left-0">
        <h1 class="flex justify-center items-center pt-5 pb-5 font-semibold text-[20px]">{{t('9')}}, {{name}}</h1>
        <div class="p-[20px]">
            <RouterLink to="/dashboard" :class="{'flex items-center font-bold text-gray-400 hover:text-gray-600 ml-5' : route.path !== '/dashboard',
                                                 'flex items-center font-bold text-gray-600 hover:text-gray-600 ml-5' : route.path === '/dashboard'}" >
                                             <IconHome class="mr-2"/>{{t('1')}}</RouterLink>
        </div>
        <div class="p-[20px]">
            <RouterLink to="/projects" :class="{'flex items-center font-bold text-gray-400 hover:text-gray-600 ml-5' : route.path !== '/projects',
                                             'flex items-center font-bold text-gray-600 hover:text-gray-600 ml-5' : route.path === '/projects'}" >
                                             <IconChalkboard class="mr-2"/>{{t('2')}}</RouterLink>
        </div>
        <div class="p-[20px]">
            <RouterLink to="/tasks" :class="{'flex items-center font-bold text-gray-400 hover:text-gray-600 ml-5' : route.path !== '/tasks',
                                             'flex items-center font-bold text-gray-600 hover:text-gray-600 ml-5' : route.path === '/tasks'}" >
                                             <IconStack3 class="mr-2"/>{{t('3')}}</RouterLink>
        </div>
        <div class="p-[20px] absolute bottom-0 flex justify-center w-[15%]">
            <RouterLink to="/" class="flex items-center justify-center text-gray-400 hover:text-red-500 font-bold"><IconLogout size="24" class="mr-2"/>{{t('8')}}</RouterLink>
        </div>
    </div>
</template>

<script>
import { IconHome, IconChalkboard, IconLogout, IconStack3 } from '@tabler/icons-vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default {
  components: { IconHome, IconChalkboard, IconLogout, IconStack3
   },
  setup () {
    const { t } = useI18n();
    const name = localStorage.getItem('name')
    const route = useRoute();
    const role = localStorage.getItem('role');
    return { role, route, name, t }
  }
};
</script>