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

    <!-- Modal thay đổi mật khẩu -->
    <div 
      v-if="showPasswordModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closePasswordModal"
    >
      <div 
        class="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4 text-center">Thay đổi mật khẩu</h3>
        
        <form @submit.prevent="handleChangePassword">
          <!-- Mật khẩu hiện tại -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu hiện tại
            </label>
            <input 
              v-model="passwordForm.currentPassword"
              type="password" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Mật khẩu mới -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới
            </label>
            <input 
              v-model="passwordForm.newPassword"
              type="password" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Xác nhận mật khẩu mới -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu mới
            </label>
            <input 
              v-model="passwordForm.confirmPassword"
              type="password" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Thông báo lỗi -->
          <div v-if="passwordError" class="mb-4 text-red-500 text-sm">
            {{ passwordError }}
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              @click="closePasswordModal"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Hủy
            </button>
            <button 
              type="submit"
              :disabled="isChangingPassword"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ isChangingPassword ? 'Đang xử lý...' : 'Thay đổi' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { IconArrowLeft, IconEdit } from '@tabler/icons-vue';
import emitter from '@/emitter';
import { useI18n } from 'vue-i18n';

import {getUser, updateUser, changePasswordApi} from '@/api/fetchApi';

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

    // Modal state
    const showPasswordModal = ref(false);
    const isChangingPassword = ref(false);
    const passwordError = ref('');
    
    // Form data cho thay đổi mật khẩu
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    onMounted(async () => {
      const data = await getUser()


      console.log(data)
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

    // Mở modal thay đổi mật khẩu
    const changePassword = () => {
      showPasswordModal.value = true;
      passwordError.value = '';
      // Reset form
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    };

    // Đóng modal thay đổi mật khẩu
    const closePasswordModal = () => {
      showPasswordModal.value = false;
      passwordError.value = '';
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    };

    // Xử lý thay đổi mật khẩu
    const handleChangePassword = async () => {
      // Validation cơ bản
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordError.value = 'Mật khẩu mới và xác nhận mật khẩu không khớp';
        return;
      }

      if (passwordForm.value.newPassword.length < 6) {
        passwordError.value = 'Mật khẩu mới phải có ít nhất 6 ký tự';
        return;
      }

      if (passwordForm.value.currentPassword === passwordForm.value.newPassword) {
        passwordError.value = 'Mật khẩu mới phải khác mật khẩu hiện tại';
        return;
      }

      try {
        isChangingPassword.value = true;
        passwordError.value = '';

        const response = await changePasswordApi({
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword,
          username: username.value
        });
        
        console.log(response)
        // Thành công
        alert('Thay đổi mật khẩu thành công!');
        closePasswordModal();
        
      } catch (error) {
        console.error('Error changing password:', error);
        passwordError.value = 'Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng thử lại.';
      } finally {
        isChangingPassword.value = false;
      }
    };

    return { 
      t,
      name, 
      avatarUrl, 
      username, 
      defaultAvatar, 
      handleAvatarChange, 
      closeProfile, 
      updateProfile, 
      changePassword,
      showPasswordModal,
      closePasswordModal,
      passwordForm,
      passwordError,
      isChangingPassword,
      handleChangePassword
    };
  }
};
</script>

<style scoped>
/* Tùy chỉnh CSS nếu cần */
</style>
