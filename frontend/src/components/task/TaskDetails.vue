<template>
  <div class="w-full h-full flex relative p-1">
    <div v-if="data"
      class="w-2/3 h-full flex flex-col bg-white p-5 rounded-l-lg border-r-[1px] border-gray-300 relative"
    >
      <h1 class="text-[24px] font-semibold">{{ data.projectId.name }}</h1>

      <h1 class="w-full text-[14px] text-gray-500 text-overflow">
        {{ data.projectId.description }}
      </h1>

      <div class="w-full h-[70px] flex justify-start items-center mt-3">
        <div class="w-1/4 h-full p-2 border-[1px] border-gray-400 flex justify-start items-start font-semibold">Task Name</div>
        <div class="w-3/4 h-full p-2 border-[1px] border-gray-400 flex justify-start items-start overflow-hidden overflow-y-auto">
          {{ data.name }}
        </div>
      </div>

      <div class="w-full min-h-[70px] max-h-[140px] flex justify-start items-center">
        <div class="w-1/4 h-full p-2 border-[1px] border-gray-400 font-semibold">Description</div>
        <div class="w-3/4 h-full p-2 border-[1px] border-gray-400 overflow-hidden overflow-y-auto">
          {{ data.description }}
        </div>
      </div>

      <div class="w-full h-[70px] flex justify-start items-center">
        <div class="w-1/4 h-full p-2 border-[1px] border-gray-400 font-semibold">Manager</div>
        <div class="w-3/4 h-full p-2 border-[1px] border-gray-400 overflow-hidden overflow-y-auto">
          {{ data.projectId.manager.name }}
        </div>
      </div>

      <div class="w-full h-[70px] flex justify-start items-center">
        <div class="w-1/4 h-full p-2 border-[1px] border-gray-400 font-semibold">Assign To</div>
        <div class="w-3/4 h-full p-2 border-[1px] border-gray-400 overflow-hidden overflow-y-auto">
            <div v-for="user in data.assignedTo" :key="user._id" class="w-full h-full border-gray-400 overflow-hidden overflow-y-auto">
                {{ user.name }}
            </div>
        </div>
      </div>

      <div class="w-full h-[70px] flex justify-start items-center">
        <div class="w-1/4 h-full p-2 border-[1px] border-gray-400 font-semibold">Priority</div>
        <div class="w-3/4 h-full p-2 border-[1px] border-gray-400 overflow-hidden overflow-y-auto">
          {{ data.priority }}
        </div>
      </div>

      <div class="w-full h-[70px] flex justify-start items-center ">
        <div class="w-1/4 h-full p-2 border-[1px] border-gray-400 font-semibold">Status</div>
        <div class="w-3/4 h-full p-2 border-[1px] border-gray-400 flex justify-start items-start overflow-hidden overflow-y-auto relative group">
          <!-- <select 
            v-model="status" 
            class="bg-inherit focus:outline-none"
            :class="{
                'text-red-500': status === 'TODO',
                'text-green-500': status === 'DONE',
                'text-blue-500': status === 'IN_PROGRESS',
            }"
          >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
          </select>

          <button
            @click.prevent="UpdateTask(data.task._id, status)"
            class="absolute top-2 right-2 rounded-lg group"
          >
            <p class="opacity-0 text-gray-600 hover:text-blue-500 group-hover:font-semibold group-hover:opacity-100">
              Update
            </p>
          </button> -->
          {{ data.status }}
        </div>
      </div>

      <div class="w-full h-[70px] flex justify-start items-center">
        <div class="w-1/4 h-full p-2 border-[1px] border-gray-400 font-semibold">Create-At</div>
        <div class="w-3/4 h-full p-2 border-[1px] border-gray-400 overflow-hidden overflow-y-auto">
          {{ getDate(parseInt(data.dueDate)) }}
        </div>
      </div>

      <button
        @click.prevent="closeTaskDetail"
        class="p-2 px-4 border-[1px] border-black absolute left-2 bottom-2 rounded-lg group hover:bg-blue-300 hover:border-blue-300"
      >
      <p class="font-semibold text-black group-hover:text-white">
        Cancel
      </p>
      </button>

      <button
        @click.prevent="DeleteTask(data.task._id)"
        v-if="data.projectId.manager._id === userID"
        class="p-2 px-4 border-[1px] border-black absolute right-2 bottom-2 rounded-lg group hover:bg-red-500 hover:border-red-500"
      >
      <p class="font-semibold text-black group-hover:text-white">
        Delete
      </p>
      </button>
  
    </div>
    <div
      class="w-1/3 h-full flex flex-col bg-white p-3 rounded-r-lg border-l-[1px] border-gray-300"
    >
      <div class="w-full h-full relative flex flex-col">
        <h1 class="text-[24px] font-semibold p-2">Comments</h1>
        <div ref="chatContainer"
          class="w-full h-[calc(100%-130px)] overflow-hidden overflow-y-auto border-[1px] border-black rounded-md p-3 space-y-3"
        >
          <div v-for="(comment, index) in comments.comments" :key="index">
            <div
              class="flex flex-col justify-start"
              :class="
                comment.author._id == userID ? 'items-end' : 'items-start'
              "
            >
              <div
                class="flex justify-start items-center"
              >
              <p class="text-[16px] font-semibold mr-1" :class="comment.author._id == userID ? 'text-green-400' : 'text-blue-400'">
                {{ comment.author.name }}
              </p>
              <p class="text-[12px] text-gray-400">
                {{ getTime(comment.createdAt) }}
              </p>
              </div>

              <div
                class="flex justify-start items-center bg-blue-400 p-2 px-4 rounded-lg max-w-[600px] break-words text-[16px]"
                :class="
                  comment.author._id == userID ? 'bg-green-200' : 'bg-blue-200'
                "
              >
                {{ comment.content }}
              </div>
            </div>
          </div>
        </div>

        <div class="w-full flex items-center absolute bottom-1">
          <textarea
            v-model="content"
            placeholder="Comment here"
            class="w-full flex items-center p-2 border-[1px] border-gray-400 focus:outline-none focus:border-black rounded-xl"
            row="1"
             @keydown.enter.prevent="commentTask"
          ></textarea>
          <IconSend2
            size="24"
            @click="commentTask"
            class="text-blue-500 absolute right-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, nextTick, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";

import emitter from "@/emitter";
import {
  IconClockHour4,
  IconHourglassEmpty,
  IconX,
  IconSend2,
  IconPlus
} from "@tabler/icons-vue";

import { getTaskDetail, getComments, createComment, updateTask, deleteTask } from "@/api/fetchApi";
import CreateTaskModal from "../modals/CreateTaskModal.vue";

import socket from "@/api/socket";

export default {
  components: {
    RouterLink,
    IconClockHour4,
    IconHourglassEmpty,
    IconX,
    IconSend2,
    IconPlus,
    CreateTaskModal
  },
  setup() {
    const onTaskDetails = ref(false);
    const Id = ref(null);
    const data = ref(null);
    const comments = ref([]);
    const status = ref('')
    const content = ref('')
    const route = useRoute()

    const chatContainer = ref(null);

    const scrollToBottom = () => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    };

        onMounted(() => {
          init()
        })

        const init = () => {
            emitter.on('*', (type, ev) => {
                switch (type) {
                    case 'TASK_DETAILS':
                      console.log(ev)
                        taskDetail(ev)
                        break

                }
            })

        }

    const taskDetail = async (taskId) => {
      const response = await getTaskDetail(taskId);

      data.value = response.task
      console.log(":::::DATA TASK",response)

      comments.value = await getComments(taskId);

      console.log("comment", comments.value, typeof(comments.value))

      nextTick(() => {
        scrollToBottom();
      });

      Id.value = taskId;

      status.value = data.value.status

      socket.off("new-comment");
      socket.emit("join-task", taskId);
      socket.on("new-comment", (comment) => {
        if (comment.task === taskId) {
          comments.value.comments.push(comment);
          nextTick(() => {
            scrollToBottom();
          });
        }
      });

    };

    const closeTaskDetail = () => {
        emitter.emit('CLOSE_TASK_DETAILS')
    };
    const userID = localStorage.getItem("userID");

    const commentTask = async () => {
      const taskId = Id.value;
      const data = await createComment({ content: content.value, taskId });
      if(data.error == null){
          taskDetail(taskId);
          content.value = ''
      }else return
    };

    const UpdateTask = async(taskId, status) => {
      const data = await updateTask({taskId, status})
      emitter.emit('NOTIFICATION', data)
      return
    }
    const DeleteTask = async(taskId) => {
      const data = await deleteTask(taskId);
      emitter.emit('NOTIFICATION', data)
      emitter.emit('reload-task');
      closeTaskDetail()
      return
    }

    const toggleTaskModal = () => {
      emitter.emit('on-taskmodal')
    }

    const getDate = (time) => {
        const date = new Date(time);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');       
        const hours = String(date.getHours()).padStart(2, '0');    
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${hours}:${minutes}:${seconds}  ${day}-${month}-${year}`
    }
    const getTime = (time) => {
        const date = new Date(time);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');       
        const hours = String(date.getHours()).padStart(2, '0');    
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${hours}:${minutes}`
    }
    return {
      taskDetail,
      data,
      onTaskDetails,
      closeTaskDetail,
      comments,
      userID,
      commentTask,
      UpdateTask, status, content, route,
      toggleTaskModal,
      getDate,
      getTime,
      DeleteTask,
      chatContainer,
      scrollToBottom,
    };
  },
};
</script>
