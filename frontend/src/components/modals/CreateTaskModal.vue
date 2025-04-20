<template>
    <div
      class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
      v-if="onTaskModal"
    >
      <div class="w-full max-w-xl bg-gray-200 p-8 rounded-lg shadow-lg relative">
        <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">
          New Task
        </h1>
        <form @submit.prevent="newTask">
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
          <label for="assignedTo" class="block mb-2">AssignedTo</label>
          <select
            v-model="assignedTo"
            id="assignedTo"
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
          <button
            type="submit"
            class="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Create Task
          </button>
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
  import { ref, onMounted, onUnmounted, computed } from "vue";
  import { IconX } from "@tabler/icons-vue";
  
  import { createTask, getUsers, getMembersOfProject } from "@/api/fetchApi";
import emitter from "@/emitter";
  export default {
    name: "CreateTask",
    components: {
      IconX,
    },
    props: [
      'projectId'
    ],
    setup(props, { emit }) {
      const name = ref("");
      const description = ref("");
      const assignedTo = ref([]);
      const users = ref([]);
      const projectId = computed(() => props.projectId)
      const onTaskModal = ref(false)

      onMounted(async() => {
          init()
      })

      const init = () => {
          emitter.on('*', async(type, ev) => {
              switch (type) {
                  case 'OPEN_TASK_MODAL':
                    membersProject()

                    onTaskModal.value = true
                      break
              }
          })

      }
  
      const newTask = async () => {
        const startAt = new Date(); 

        const endAt = new Date(startAt);
        endAt.setDate(startAt.getDate() + 2);  

        console.log(assignedTo.value)

        const data = await createTask({
          projectId: projectId.value,
          name: name.value,
          description: description.value,
          assignedTo: assignedTo.value,
          status: 'TODO',
          dueDate: Date.now(),
          priority: 'HIGH',
          startAt: startAt,
          endAt: endAt,
          dependencies: [],
        });

        emitter.emit('NOTIFICATION', data)

        if (data.status === "success") {
            onTaskModal.value = false
            emitter.emit('RELOAD_TASK', projectId.value);
        }
        if (data.status === "failed") {
          alert(data.error);
        }
      };

      const membersProject = async () => {
        try {
          const data = await getMembersOfProject(projectId.value);
          console.log("MEMBERS", data)
          users.value = data.data.members;
        } catch (error) {
          console.error("Error fetching members:", error);
        }
      };

      const closeModal = () => {
        onTaskModal.value = false
      };
      onMounted(() => {
      });

      return {
        name,
        description,
        assignedTo,
        newTask,
        closeModal,
        users,
        onTaskModal,
      };
    },
  };
  </script>
  