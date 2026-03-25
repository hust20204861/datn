<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <Language class="fixed top-1 left-[93%]"/>
    <div class="w-full max-w-sm bg-gray-200 p-8 rounded-lg shadow-lg flex justify-center flex-col items-center">
      <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">
        {{t('4')}}
      </h1>
      <form @submit.prevent="signin">
        <input
          v-model="username"
          type="text"
          :placeholder= "$t('12')"
          required
          class="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="password"
          type="password"
          :placeholder= "$t('13')"
          required
          class="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
        {{t('4')}}
        </button>
      </form>
      <div class="mt-2 flex justify-center items-center">
        <p class="mr-1">{{t('20')}}</p>
        <RouterLink to="/signup" class="text-green-500 italic hover:font-semibold ">{{ t('14') }}</RouterLink>
      </div>
    </div>
  </div>
  <!-- <Notification/> -->
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { Signin } from "@/api/fetchApi";
import Language from "@/components/header/Language.vue";
import emitter from "@/emitter";
import Notification from "@/components/modals/Notification.vue";

export default {
  name: "SignIn",
  components:{
    Language,
    Notification
  },
  setup() {
    const username = ref("");
    const password = ref("");

    const router = useRouter();
    const { t } = useI18n();

    const signin = async () => {
      const data = await Signin({username: username.value, password: password.value})
      // emitter.emit('NOTIFICATION', data)
      console.log("USER DATA:",data)
      if(data.status === 'success'){
        localStorage.setItem('name', data.data.name)
        localStorage.setItem('userID', data.data._id)
        router.push('/dashboard')
      }
      // if(data.status === 'failed'){
      //   alert(data.error)
      // }
    }
    return {
      username,
      password,
      signin,
      t
    };
  },
};
</script>
