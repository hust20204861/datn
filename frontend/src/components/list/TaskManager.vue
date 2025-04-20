<template>
        <div 
            class="w-full max-h-full flex flex-row overflow-hidden overflow-x-auto justify-start space-x-5 relative" >
            <div ref='Column1'
                class="w-[400px] max-h-full p-4 rounded-lg overflow-hidden overflow-y-auto bg-gray-300 space-y-3 flex-shrink-0 relative"
                @dragover.prevent
                @drop="onDrop('TODO')"
                @dragover="handleDragEnter('TODO')"
                >  

                <div class="w-full p-2 justify-center items-center">
                    <p class="text-[30px] text-center">Todo</p>
                </div>
                <div
                    v-for="task in todoTasks"
                    :key="task._id"
                    :draggable="true"
                    :resizable="false"
                    @dragstart="onDragStart(task, 'TODO')"
                    @click.prevent="taskDetails(task._id)"
                    class="w-full h-[44px] bg-gray-400 border-gray-300 rounded-xl flex justify-center items-center mb-3 hover:bg-gray-500 hover:border-black border-2"
                >
                    <div class="w-full h-full flex justify-between items-center">
                        <IconPointFilled :class="task.priority == 'LOW' ? 'text-green-400' : task.priority == 'MEDIUM' ? 'text-yellow-400' : 'text-red-500'" />
                        <p>{{ task.name }}</p>
                        <IconDots class="text-blue-400 opacity-0 group-hover:opacity-100 hover:text-red-500"/>
                    </div>
                </div>
                <button v-if="onProject" @click.prevent="showCreateTaskModal" class="w-full h-[44px] bg-gray-400 border-gray-300 rounded-xl flex justify-center items-center mb-3 hover:bg-gray-500 hover:border-black border-2">
                    <p>new task</p>
                </button>
            </div>

            <div ref="Column2"
                class="w-[400px] max-h-full p-4 rounded-lg overflow-hidden overflow-y-auto bg-blue-300 space-y-3 flex-shrink-0 relative"
                @dragover.prevent
                @drop="onDrop('IN_PROGRESS')"
                @dragover="handleDragEnter('IN_PROGRESS')"
                >  
                    <div class="w-full p-2 justify-center items-center">
                        <p class="text-[30px] text-center">Process</p>
                    </div>
                <div
                    v-for="task in doingTasks"
                    :key="task._id"
                    :draggable="true"
                    :resizable="false"
                    @dragstart="onDragStart(task, 'IN_PROGRESS')"
                    @click.prevent="taskDetails(task._id)"
                    class="w-full h-[44px] bg-blue-400 rounded-xl flex justify-center items-center mb-3"
                >

                    <div class="w-full h-full flex justify-between items-center">
                        <IconPointFilled :class="task.priority == 'LOW' ? 'text-green-400' : task.priority == 'MEDIUM' ? 'text-yellow-400' : 'text-red-500'" />
                        <p>{{ task.name }}</p>
                        <button class="p-2 opacity-0 group-hover:opacity-100">
                            <IconDots size="20" class="text-black" />
                        </button>
                    </div>
                </div>
            </div>

            <div ref="Column3"
                class="w-[400px] max-h-full p-4 rounded-lg overflow-hidden overflow-y-auto bg-green-300 space-y-3 flex-shrink-0 relative"
                @dragover.prevent
                @drop="onDrop('DONE')"
                @dragover="handleDragEnter('DONE')"
                >  
                    <div class="w-full p-2 justify-center items-center">
                        <p class="text-[30px] text-center">Done</p>
                    </div>
                <div
                    v-for="task in doneTasks"
                    :key="task._id"
                     :draggable="true"
                    :resizable="false"
                    @dragstart="onDragStart(task, 'DONE')"
                    @click.prevent="taskDetails(task._id)"
                    class="w-full h-[44px] bg-green-400 rounded-xl flex justify-center items-center mb-3"
                >

                    <div class="w-full h-full flex justify-between items-center">
                        <IconPointFilled :class="task.priority == 'LOW' ? 'text-green-400' : task.priority == 'MEDIUM' ? 'text-yellow-400' : 'text-red-500'" />
                        <p>{{ task.name }}</p>
                        <IconDots class="text-blue-400 opacity-0 group-hover:opacity-100 hover:text-red-500"/>
                    </div>
                </div>
            </div>

        </div>
</template>

<script>
import { onMounted, ref } from "vue";

import { getUserTasks, updateTask } from '@/api/fetchApi';

import emitter from '@/emitter'

import Vue3DraggableResizable from 'vue3-draggable-resizable'
import { IconPointFilled, IconDots } from '@tabler/icons-vue'

export default {

    components: {
        Vue3DraggableResizable,
        IconPointFilled,
        IconDots
    },
  setup() {
    const onProject = ref(false);
    const userTasks = ref([]);

    const todoTasks = ref([]);
    const doingTasks = ref([]);
    const doneTasks = ref([]);

    const Column1 = ref(null);
    const Column2 = ref(null);
    const Column3 = ref(null);

    let draggTask = null
    let originStatus = null

    onMounted(async() => {
       
        init()
    })


        const init = () => {
            emitter.on('*', async(type, ev) => {
                switch (type) {
                    case 'PJ_DETAILS':
                      console.log(ev)
                        todoTasks.value = ev.filter(task => task.status === 'TODO');
                        doingTasks.value = ev.filter(task => task.status === 'IN_PROGRESS');
                        doneTasks.value = ev.filter(task => task.status === 'DONE');

                        onProject.value = true
                        console.log(todoTasks.value, doingTasks.value, doneTasks.value)
                        break
                    case 'USER_TASKS':
                       await fetchUserTasks();

                        console.log(userTasks.value)
                        todoTasks.value = userTasks.value.filter(task => task.status === 'TODO');
                        doingTasks.value = userTasks.value.filter(task => task.status === 'IN_PROGRESS');
                        doneTasks.value = userTasks.value.filter(task => task.status === 'DONE');

                        onProject.value = false
                        break
                }
            })

        }

    const fetchUserTasks = async () => {
      try {
        const data = await getUserTasks();
        console.log(data)

        userTasks.value = data.tasks; 
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      }
    };

    const updateTaskStatus = async(taskId, status) => {
      try {
        const data = await updateTask({taskId, status})
        console.log(data)
      } catch (error) {
        console.error("Error updating task:", error.message);
      }
    };

    const onDragStart = (task, status) => {
        draggTask = task
        originStatus = status
        console.log(draggTask, originStatus)
    }

    const onDrop = async(column) => {
        console.log(column, draggTask)
        if(originStatus == column) {
            console.log("HANDLE SORT ONDROP")
        return;
        }

        if (originStatus === 'TODO') {
            todoTasks.value = todoTasks.value.filter(t => t._id !== draggTask._id);
        } else if (originStatus === 'IN_PROGRESS') {
            doingTasks.value = doingTasks.value.filter(t => t._id !== draggTask._id);
        } else if (originStatus === 'DONE') {
            doneTasks.value = doneTasks.value.filter(t => t._id !== draggTask._id);
        }

        draggTask.status = column;

        if (column === 'TODO') {
            todoTasks.value.push(draggTask);
            updateTaskStatus(draggTask._id, 'TODO')
        } else if (column === 'IN_PROGRESS') {
            doingTasks.value.push(draggTask);
            updateTaskStatus(draggTask._id, 'IN_PROGRESS')
        } else if (column === 'DONE') {
            doneTasks.value.push(draggTask);
            updateTaskStatus(draggTask._id, 'DONE')
         }
    };

    const handleDragEnter = (column) => {
        let container;
        if(column == 1) {
            container = Column1.value
        } else if(column == 2) {
            container = Column2.value
        } else if(column == 3) {
            container = Column3.value
        }
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const containerScrollWidth = container.scrollWidth;
        const containerClientWidth = container.clientWidth;
        const distanceFromLeft = containerRect.left;
        const distanceFromRight = containerRect.right;

        if (distanceFromLeft <= 50) {
          container.scrollLeft -= 10;
        } else if (distanceFromRight >= containerClientWidth - 50) {
          container.scrollLeft += 10;
        }
      }
    }

    const taskDetails = (taskId) => {
        emitter.emit('TASK_DETAILS', taskId)
        console.log(taskId)
    }

    const showCreateTaskModal = () => {
        emitter.emit('on-taskmodal')
    }

    return {
        todoTasks,
        doingTasks,
        doneTasks,
        onDrop,
        onDragStart,
        Column1,
        Column2,
        Column3,
        handleDragEnter,
        userTasks,
        taskDetails,
        onProject,
        showCreateTaskModal
    };
  },
};
</script>
