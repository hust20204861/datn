<template>
  <div class="w-full h-full overflow-hidden overflow-y-auto">
    <div class="container mx-auto p-4">
      <div class="flex items-center justify-between">
        <button @click.prevent="closeProfile">
          <IconArrowLeft size="30" class="text-neutral-950" />
        </button>
        <h2 class="text-2xl font-semibold text-center mb-6">
          {{t('23')}}
        </h2>
        <div></div>
      </div>

      <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div class="flex items-center space-x-6">
          <!-- Avatar -->
          <div class="w-[120px] aspect-ratio-1 relative">
            <img 
              :src="avatarUrl || defaultAvatar" 
              alt="User Avatar" 
              class="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <input 
              type="file" 
              accept="image/*" 
              @change="handleAvatarChange" 
              class="mt-2"
            />
          </div>

          <div>
            <input 
              v-model="name" 
              type="text" 
              class="text-2xl font-semibold text-gray-800 border-b-2 focus:outline-none"
              placeholder="Enter your name"
            />
            <p class="text-gray-600">{{ username }}</p>
          </div>
        </div>

        <div class="mt-6 text-center space-x-6">
          <button 
            @click="updateProfile"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {{t('21')}}
          </button>

          <button 
            @click="changePassword"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {{t('22')}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { IconArrowLeft, IconEdit } from '@tabler/icons-vue';
import emitter from '@/emitter';
import { useI18n } from 'vue-i18n';

import {getUser, updateUser} from '@/api/fetchApi';

export default {
  components: {
    IconArrowLeft,
    IconEdit
  },
  setup() {
    const avatarUrl = ref(null);
    const name = ref('van');
    const username = ref('van');

    const {t} = useI18n()

    onMounted(async () => {
      const data = await getUser()
      name.value = data.user.name
      username.value = data.user.username
      avatarUrl.value = data.user.avatar_url
    })

    // Đặt avatar mặc định
    const defaultAvatar = 'https://via.placeholder.com/150';

    // Thao tác khi tải lên ảnh đại diện
    const handleAvatarChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          avatarUrl.value = reader.result; // Cập nhật avatar mới
        };
        reader.readAsDataURL(file);
      }
    };

    // Đóng trang profile
    const closeProfile = () => {
      emitter.emit('DASHBOARD');
    };

    const updateProfile = async () => {
      try {
        const data = {
            name: name.value,
            avatar_url: avatarUrl.value, 
        }
        const response = await updateUser(JSON.stringify(data))
        console.log("DATA", response)
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    };

    // Thay đổi mật khẩu
    const changePassword = () => {
      alert('Chức năng thay đổi mật khẩu sẽ được thực hiện ở đây.');
    };

    return { t,name, avatarUrl, username, defaultAvatar, handleAvatarChange, closeProfile, updateProfile, changePassword };
  }
};
</script>

<style scoped>
/* Tùy chỉnh CSS nếu cần */
</style>
