<template>
  <div v-if="onShow"
    class="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center"
  >
    <div class="w-full max-w-xl bg-gray-200 p-8 rounded-lg shadow-lg relative">
      <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">
        ADD MEMBER
      </h1>
      <form @submit.prevent="addMember">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          required
          class="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="w-full flex justify-between items-center">
          <button
            class="p-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
            @click.prevent="hide"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="p-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
        
      </form>
      <!-- <button
        @click="closeModal"
        class="absolute top-4 right-4 text-2xl text-gray-800 hover:text-gray-600"
      >
        <IconX class="w-6 h-6" />
      </button> -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { IconX } from "@tabler/icons-vue";
import emitter from "@/emitter";

import { AddMemberToProject } from "@/api/fetchApi";
export default {
  name: "AddMemberToPJ",
  components: {
    IconX,
  },
  setup() {
    const username = ref("");
    const projectId = ref(null)

    const onShow = ref(false)

    onMounted(() => {
        init()
    })

    const init = () => {
        emitter.on('*', async(type, ev) => {
            switch (type) {
                case 'OPEN_ADD_MEMBERS_TO_PROJECT':
                    onShow.value = true
                    projectId.value = ev.projectId
                    break
            }
        })

    }

    const addMember = async () => {
      const data = await AddMemberToProject({
        username: username.value,
        projectId: projectId.value
      });
      
      console.log(data)
      if (data.status === "Add member success") {
        hide()
        emitter.emit('NOTIFICATION', data)
        emitter.emit('RELOAD_PROJECT')
        emitter.emit('RELOAD_GROUPS')
      }
      if (data.status === "failed") {
        emitter.emit('NOTIFICATION', data)
      }
    };

    const show = () => {
        onShow.value = true
    }

    const hide = () => {
        onShow.value = false
    }

    return {
      username,
      addMember,
      show,
      hide,
      onShow
    };
  },
};
</script>
