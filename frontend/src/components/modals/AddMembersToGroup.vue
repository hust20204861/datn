<template>
  <div v-if="onShow" class="fixed inset-0 bg-black bg-opacity-60 z-[100] flex items-center justify-center">
    <div class="w-full max-w-xl bg-gray-200 p-8 rounded-lg shadow-lg relative">
      <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">
        Add Members
      </h1>
      <form @submit.prevent="confirm">
        <div class="overflow-x-auto mb-4">
          <table class="min-w-full table-auto">
            <thead>
              <tr class="bg-gray-300">
                <th class="px-4 py-2">Select</th>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Username</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in membersProject" :key="member._id">
                <td class="px-4 py-2">
                  <input
                    type="checkbox"
                    :value="member._id"
                    v-model="selectedMembers"
                    class="form-checkbox"
                  />
                </td>
                <td class="px-4 py-2">{{ member.name }}</td>
                <td class="px-4 py-2">{{ member.username }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
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
    </div>
  </div>
</template>


<script>
import { ref, onMounted, watch } from "vue";
import { IconX } from "@tabler/icons-vue";
import emitter from "@/emitter";

import { AddMemberToGroup } from "@/api/fetchApi";
export default {
  name: "AddMembersToGroup",
  components: {
    IconX,
  },
  setup() {
    const membersProject = ref([]);
    const selectedMembers = ref([]);
    const groupId = ref(null);

    const onShow = ref(false)

    onMounted(() => {
        console.log(":::::MOUNTED ADD MEMBERS TO GROUP")
        init()
    })

    watch(selectedMembers, (n, o) => {
        console.log(n, o)
    })

    const init = () => {
        emitter.on('*', async(type, ev) => {
            switch (type) {
                case 'OPEN_ADD_MEMBERS_TO_GROUP':
                    onShow.value = true
                    groupId.value = ev.groupId
                    membersProject.value = ev.members
                    break
                case 'CLOSE_ADD_MEMBERS_TO_GROUP':
                    onShow.value = false
                    break
            }
        })

    }

    const confirm = async () => {
      const data = await AddMemberToGroup({
        userIds: selectedMembers.value,
        groupId: groupId.value,
      });
      emitter.emit('NOTIFICATION', data)
      console.log(data)
      if (data.status === "success") {
        hide()
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
        membersProject,
        selectedMembers,
        confirm,
        groupId,
        show,
        hide,
        onShow
    };
  },
};
</script>
