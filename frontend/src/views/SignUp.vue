<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <Language class="fixed top-1 left-[93%]"/>
      <div class="w-full max-w-sm bg-gray-200 p-8 rounded-lg shadow-lg flex flex-col justify-center items-center">
        <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">
          {{t('14')}}
        </h1>
        <form @submit.prevent="signup">
            <input
            v-model="name"
            type="text"
            :placeholder= "$t('15')"
            required
            class="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
            class="w-full p-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >
          {{t('14')}}
          </button>
        </form>
        <RouterLink to="/" class="text-gray-500 underline hover:font-semibold mt-2">{{ t('19') }}</RouterLink>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from "vue-router";
  import { ref } from "vue";
  import { useI18n } from "vue-i18n";
  
  import { Signup } from "@/api/fetchApi";
  import Language from "@/components/header/Language.vue";
  export default {
    name: "SignIn",
    components:{
      Language
    },
    setup() {
      const name = ref("")
      const username = ref("");
      const password = ref("");
  
      const router = useRouter();
      const { t } = useI18n();
  
      const signup = async () => {
        const data = await Signup({name: name.value, username: username.value, password: password.value})
        console.log(name, username, password)
        if(data.status === 'success'){
          router.push('/')
        }
        if(data.status === 'failed'){
          alert(data.error)
        }
      }
      return {
        name,
        username,
        password,
        signup,
        t
      };
    },
  };
  </script>
  