<template>
    <div class="w-[10%] h-[94%] left-0 top-[6%] absolute bg-gray-100 ">
        <div class="w-full h-full flex flex-col justify-between">
            <div>
                <div class="p-[10px]">
                    <RouterLink to="/dashboard" :class="{'flex items-center font-bold text-gray-400 hover:text-gray-600' : route.path !== '/dashboard',
                                                        'flex items-center font-bold text-gray-600 hover:text-gray-600' : route.path === '/dashboard'}" >
                                                    <IconHome class="mr-2"/>{{t('1')}}</RouterLink>
                </div>
                <div class="p-[10px]">
                    <RouterLink to="/projects" :class="{'flex items-center font-bold text-gray-400 hover:text-gray-600' : route.path !== '/projects',
                                                    'flex items-center font-bold text-gray-600 hover:text-gray-600' : route.path === '/projects'}" >
                                                    <IconChalkboard class="mr-2"/>{{t('2')}}</RouterLink>
                </div>
                <div class="p-[10px]">
                    <RouterLink to="/tasks" :class="{'flex items-center font-bold text-gray-400 hover:text-gray-600' : route.path !== '/tasks',
                                                    'flex items-center font-bold text-gray-600 hover:text-gray-600' : route.path === '/tasks'}" >
                                                    <IconStack3 class="mr-2"/>{{t('3')}}</RouterLink>
                </div>  
            </div>

            <div class="p-[15px] bottom-0 left-0">
                <RouterLink to="/" class="flex items-center justify-start text-gray-400 hover:text-red-500 font-bold"><IconLogout size="24" class="mr-2"/>{{t('8')}}</RouterLink>
            </div>
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