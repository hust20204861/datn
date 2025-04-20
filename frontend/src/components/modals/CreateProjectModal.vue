<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
  >
    <div class="w-full max-w-xl bg-gray-200 p-8 rounded-lg shadow-lg relative">
      <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">
        New Project
      </h1>
      <form @submit.prevent="newProject">
        <input
          v-model="name"
          type="text"
          placeholder="Name"
          required
          class="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="description"
          type="text"
          placeholder="Description"
          required
          class="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label for="members" class="block mb-2">Select Members</label>
        <select
          v-model="members"
          id="members"
          multiple
          class="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option
            v-for="user in users"
            :key="user._id"
            :value="user._id"
            class="bg-white hover:bg-gray-300"
          >
            {{ user.name }}
          </option>
        </select>
        <div class="w-full flex justify-between items-center">
          <button
            class="p-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
            @click="closeModal"
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
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-2xl text-gray-800 hover:text-gray-600"
      >
        <IconX class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { IconX } from "@tabler/icons-vue";
import emitter from "@/emitter";

import { createProject, getUsers } from "@/api/fetchApi";
export default {
  name: "CreateProject",
  components: {
    IconX,
  },
  setup(props, { emit }) {
    const name = ref("");
    const description = ref("");
    const members = ref([]);
    const users = ref([]);

    const newProject = async () => {
      const data = await createProject({
        name: name.value,
        description: description.value,
        members: members.value,
      });
      emitter.emit('NOTIFICATION', data)
      if (data.status === "Create project success") {
        emit("closeModal");
        emitter.emit('RELOAD_PROJECT')
      }
      // if (data.status === "Create project failed") {
      //   alert(data.error);
      // }
    };
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        users.value = data.users;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    const closeModal = () => {
      emit("closeModal");
    };
    onMounted(() => {
      fetchUsers();
    });
    return {
      name,
      description,
      members,
      newProject,
      closeModal,
      users,
    };
  },
};
</script>
