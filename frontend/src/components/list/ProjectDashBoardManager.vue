<template>
  <div class="container mx-auto p-4">
    <div class="flex items-center justify-between">
      <button @click.prevent="closeTask">
        <IconArrowLeft size="30" class="text-neutral-950" />
      </button>
      <h2 class="text-2xl font-semibold text-center mb-6">
        Task Status Distribution
      </h2>
      <div></div>
    </div>

    <div class="flex items-center justify-between">
      <div>
        <button @click="exportChartToPDF" class="btn-export-pdf">
            Export PDF
          </button>
      </div>
      <button  class="p-3 relative">
        <div class="flex justify-center items-center">
          <input
            type="datetime-local"
            v-model="selectedStartDate"
            @change="filterTasksByDate()"
            class="rounded-md mr-2"
          />
          <input
            type="datetime-local"
            v-model="selectedEndDate"
            @change="filterTasksByDate()"
            class="rounded-md mr-2"
          />

          <p class="text-center mr-3">{{memberSelected}}</p>
          <IconFilter @click.prevent="onShowFilter" size="30" class="text-neutral-950" />

        </div>
        <template v-if="onShow">
          <div class="w-[200px] max-h-[200px] overflow-y-auto rounded-xl border bg-white absolute top-10 right-0 z-[50] transition-all duration-300">
            <div
              v-for="(member) in projectMembers"
              :key="member._id"
              class="w-full h-[40px] p-1 rounded-xl hover:bg-neutral-400"
            >
              <button
                @click.prevent="filterTasksMember(member)"
                class="w-full h-full text-left px-6"
              >
                {{ member.name }}
              </button>
            </div>
            <button  
              @click.prevent="allTasksMember()"
              class="w-full h-[40px] p-1 rounded-xl hover:bg-neutral-400">
              <p class="w-full h-full text-left px-6">All</p>
            </button>
          </div>
        </template>
      </button>

    </div>
    
    <canvas
      id="taskStatusChart"
      class="mx-auto"
      width="600"
      height="400"
    ></canvas>

    <div class="flex items-center justify-between">
      <div></div>
      <h2 class="text-xl font-semibold text-center mt-10">Project Members</h2>
      <button class="flex items-center justify-center" @click.prevent="showCreateGroupModal">
        <IconPlus size="20" class="mr-2" />
        Create group
      </button>
    </div>
    

    <div v-for="(group, index) in groupsProject" :key="index">
      <table
      class="min-w-full table-auto border-collapse border border-gray-300 mt-4 mx-auto"
    >
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 border-b text-left">{{ group.name }}</th>
          <th class="px-4 py-2 border-b text-left">Name</th>
          <th class="px-4 py-2 border-b text-left">Username</th>
          <th class="px-4 py-2 border-b text-left">Position</th>
          <th class="px-4 py-2 border-b text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(member, index) in group.members"
          :key="member._id"
          class="odd:bg-white even:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ index+1 }}</td>
          <td class="px-4 py-2 border-b">{{ member.name }}</td>
          <td class="px-4 py-2 border-b">{{ member.username }}</td>
          <td class="px-4 py-2 border-b">{{ group.lead && group.lead._id == member._id ? "Leader" : "Member" }}</td>
          <td class="px-4 py-2 border-b">
            <button 
              v-if="!group.lead || group.lead._id != member._id" 
              @click.prevent="selectGroupLeader({groupId: group._id, userId:member._id})">
              Select to Leader
            </button>
            <button 
              v-else
              @click.prevent="deleteLeader(group._id)">
              Delete Leader
            </button>
            </td>
        </tr>
        <tr class="odd:bg-white even:bg-gray-50">
          <td class="px-4 py-2 border-b">
            <button @click.prevent="showAddMembersToGroupModal(group._id)"  class="w-full h-full flex justify-start item-center">
              <IconPlus size="20" class="mr-2" />
              <p>Add Member</p>
            </button>
          </td>
          <td class="px-4 py-2 border-b">None</td>
          <td class="px-4 py-2 border-b">None</td>
          <td class="px-4 py-2 border-b">None</td>
          <td class="px-4 py-2 border-b">None</td>
        </tr>
      </tbody>
    </table>
    </div>
    <table
      class="min-w-full table-auto border-collapse border border-gray-300 mt-4 mx-auto"
    >
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 border-b text-left">Name</th>
          <th class="px-4 py-2 border-b text-left">Username</th>
          <th class="px-4 py-2 border-b text-left">Position</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="member in projectMembers"
          :key="member._id"
          class="odd:bg-white even:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ member.name }}</td>
          <td class="px-4 py-2 border-b">{{ member.username }}</td>
          <td class="px-4 py-2 border-b">{{ member.role || "Thành viên" }}</td>
        </tr>
        <tr class="odd:bg-white even:bg-gray-50">
          <td class="px-4 py-2 border-b">
            <button class="w-full h-full flex justify-start item-center">
              <IconPlus size="20" class="mr-2" />
              <p>Add Member</p>
            </button>
          </td>
          <td class="px-4 py-2 border-b">None</td>
          <td class="px-4 py-2 border-b">None</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PieController,
  BarElement,
  CategoryScale,
  LinearScale,
  BarController,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import emitter from "@/emitter";
import { 
  getProjectTask, 
  getMembersOfProject,
  GetGroupsOfProject,
  SelectGroupLeader,
  DeleteLeader
} from "@/api/fetchApi";

import { IconArrowLeft, IconFilter, IconPlus } from "@tabler/icons-vue";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  components: {
    IconArrowLeft, 
    IconFilter, 
    IconPlus
  },
  setup() {
    const tasks = ref([]);
    const tasksChart = ref([]);
    const projectMembers = ref([]);
    const memberSelected = ref('All Members');

    const projectId = ref(null)

    const groupsProject = ref([])

    const selectedStartDate = ref("");
    const selectedEndDate = ref("");
    const memberSelectedId = ref(null);

    const onShow = ref(false);

    let chartInstance = null; 

    onMounted(() => {
      init();
    });

    watch(tasksChart, (n, o) => {
      renderChart();
    });

    Chart.register(
      ArcElement,
      Tooltip,
      Legend,
      Title,
      PieController,
      BarElement,
      CategoryScale,
      LinearScale,
      BarController,
      ChartDataLabels
    );

    const init = () => {
      emitter.on("*", async (type, ev) => {
        switch (type) {
          case "PROJECT_DETAILS":
            const data = await getProjectTask(ev);
            const pj = await getMembersOfProject(ev);
            const groups = await GetGroupsOfProject({projectId: ev})
            groupsProject.value = groups.groups
            console.log(groups)

            projectId.value = ev

            console.log(pj);

            tasks.value = data.tasks;
            tasksChart.value = data.tasks;
            projectMembers.value = pj.data.members;

              const startDates = tasks.value.map(task => new Date(task.startAt));
              const endDates = tasks.value.map(task => new Date(task.endAt));

              const minStartDate = new Date(Math.min(...startDates));
              const maxEndDate = new Date(Math.max(...endDates));

              selectedStartDate.value = minStartDate.toISOString().slice(0, 16); // Cắt để chỉ lấy 'YYYY-MM-DDTHH:MM'
              selectedEndDate.value = maxEndDate.toISOString().slice(0, 16); 

            // renderChart();
            break;

          case "RELOAD_TASK":
            const dataReload = await getProjectTask(ev);
            tasks.value = dataReload.tasks;
            tasksChart.value = dataReload.tasks;

            renderChart();
            break;
          case "RELOAD_GROUPS":
            const groupsReload = await GetGroupsOfProject({projectId: projectId.value})
            groupsProject.value = groupsReload.groups
            break
        }
      });
    };

    const onShowFilter = () => {
      onShow.value = !onShow.value;
    };

    const getStatusCount = (status) => {
      return tasksChart.value.filter(
        (task) => task.status === status && task.isOverdue === false
      ).length;
    };

    const getTasksFailed = () => {
      return tasksChart.value.filter((task) => task.isOverdue).length;
    };

    const renderChart = () => {
      const statusData = {
        labels: ["DONE", "IN_PROGRESS", "TODO", "FAILED"],
        datasets: [
          {
            data: [
              getStatusCount("DONE"),
              getStatusCount("IN_PROGRESS"),
              getStatusCount("TODO"),
              getTasksFailed(),
            ],
            backgroundColor: ["#99ff99", "#66b3ff", "#ff9999", "#D1D5DB"],
            hoverBackgroundColor: ["#66ff66", "#3399ff", "#ff6666", "#D1D5DB"],
          },
        ],
      };

      const ctx = document.getElementById("taskStatusChart").getContext("2d");

      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = new Chart(ctx, {
        type: "pie", 
        data: statusData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  // return `${tooltipItem.label}: ${tooltipItem.raw} tasks`;
                  const status = tooltipItem.label;
                  const taskCount = tooltipItem.raw;

                  const tasksForStatus = tasksChart.value.filter(
                    (task) => task.status === status
                  );
                  const taskNames = tasksForStatus
                    .map((task) => task.name)
                    .join(", ");
                  const assignees = tasksForStatus
                    .map((task) => task.assignedTo.map((user) => user.name))
                    .join(", ");

                  return `${status}: ${taskCount} tasks`;
                },
              },
            },
            datalabels: {
          // Hiển thị số lượng và phần trăm trên từng phần của biểu đồ
          formatter: (value, context) => {
            const percentage = ((value / tasksChart.value.length) * 100).toFixed(2);

              if(percentage==0.00){
                return null
              }

              return `${value} (${percentage}%)`;
            },
            color: '#fff', // Màu sắc của chữ
            font: {
              weight: 'bold',
              size: 14,
            },
          },
          },
        },
      });
    };

    const filterTasksMember = (member) => {
      tasksChart.value = tasks.value.filter(task => task.assignedTo.some(user => user._id === member._id))
      
      memberSelected.value = member.name
      memberSelectedId.value = member._id

      filterTasksByDate()
    }

    const allTasksMember = () => {
      tasksChart.value = tasks.value

      memberSelected.value = 'All Members'
      memberSelectedId.value = null

      filterTasksByDate()
    }

    const filterTasksByDate = () => {
      tasksChart.value = tasks.value
      if (selectedStartDate.value) {
        const startDate = new Date(selectedStartDate.value);
        tasksChart.value = tasksChart.value.filter((task) => {
          const taskStartAt = new Date(task.startAt);
          return taskStartAt >= startDate;
        });
      } 
      if (selectedEndDate.value) {
        const endDate = new Date(selectedEndDate.value);
        tasksChart.value = tasksChart.value.filter((task) => {
          const taskEndAt = new Date(task.endAt);
          return taskEndAt <= endDate;
        });
      } 
      console.log(memberSelectedId.value)
      if(memberSelectedId.value){
        tasksChart.value = tasksChart.value.filter(task => task.assignedTo.some(user => user._id === memberSelectedId.value))
      }
      console.log(tasksChart.value)

    };

    const closeTask = () => {
      emitter.emit("CLOSE_PROJECT_DETAILS");
    };

    const showCreateGroupModal = () => {
      emitter.emit("OPEN_CREATE_GROUP", projectId.value);
    }

    const showAddMembersToGroupModal = (groupId) => {
      console.log(":::::OPEN ADD MEMBERS",groupId)
      emitter.emit("OPEN_ADD_MEMBERS_TO_GROUP", {groupId: groupId, members: projectMembers.value})
    }

    const selectGroupLeader = async({groupId, userId}) => {
      const response = await SelectGroupLeader({groupId, userId})
      emitter.emit('NOTIFICATION', response)
      if(response.status == 'success'){
        emitter.emit("RELOAD_GROUPS")
      }
    }

    const deleteLeader = async(groupId) => {
      const response = await DeleteLeader({groupId})
      emitter.emit('NOTIFICATION', response)
      if(response.status == 'success'){
        emitter.emit("RELOAD_GROUPS")
      }
    }

    const exportChartToPDF = async () => {
      const canvas = document.getElementById("taskStatusChart");
      
      // Dùng html2canvas convert canvas thành ảnh (nếu bạn chỉ lấy canvas thì có thể dùng canvas.toDataURL() cũng được)
      const canvasImage = canvas.toDataURL("image/png", 1.0);
      console.log(canvasImage);

      // Tạo file pdf
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height], // Kích thước bằng canvas
      });

      // Thêm ảnh vào pdf, tọa độ (0,0), rộng và cao bằng canvas
      pdf.addImage(canvasImage, "PNG", 0, 0, canvas.width, canvas.height);

      // Tải file pdf
      pdf.save("task-status-chart.pdf");
    };

    return {
      getStatusCount,
      projectMembers,
      onShowFilter,
      onShow,
      filterTasksMember,
      allTasksMember,
      memberSelected,
      filterTasksByDate,
      selectedStartDate,
      selectedEndDate,
      closeTask,
      showCreateGroupModal,
      groupsProject,
      showAddMembersToGroupModal,
      selectGroupLeader,
      deleteLeader,
      exportChartToPDF
    };
  },
};
</script>
