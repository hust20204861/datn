<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-semibold text-center mb-6">
      Task Status Distribution
    </h2>
    <canvas
      id="taskStatusChart"
      class="mx-auto"
      width="600"
      height="400"
    ></canvas>

    <canvas
      id="taskMemberChart"
      class="mx-auto mt-10"
      width="400"
      height="400"
    ></canvas>

    <h2 class="text-xl font-semibold text-center mt-10">Project Members</h2>
    <table
      class="min-w-full table-auto border-collapse border border-gray-300 mt-4 mx-auto"
    >
      <thead>
        <tr class="bg-gray-100">
          <th class="px-4 py-2 border-b text-left">Name</th>
          <th class="px-4 py-2 border-b text-left">Username</th>
          <th class="px-4 py-2 border-b text-left">Number Of Tasks</th>
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
          <td class="px-4 py-2 border-b">{{ member.role || "N/A" }}</td>
        </tr>
        <tr class="odd:bg-white even:bg-gray-50">
          <td class="px-4 py-2 border-b">Add Member</td>
          <td class="px-4 py-2 border-b">None</td>
          <td class="px-4 py-2 border-b">None</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
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
import emitter from "@/emitter";
import { getProjectTask, getMembersOfProject } from "@/api/fetchApi";

export default {
  setup() {
    const tasks = ref([]);
    const projectMembers = ref([]);

    onMounted(() => {
      init();
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
      BarController
    );

    const init = () => {
      emitter.on("*", async (type, ev) => {
        switch (type) {
          case "PROJECT_DETAILS":
            const data = await getProjectTask(ev);
            const pj = await getMembersOfProject(ev);
            console.log(pj);
            tasks.value = data.tasks;
            projectMembers.value = pj.data.members;

            renderChart();
            renderMemberChart();
            break;

          case "RELOAD_TASK":
            const dataReload = await getProjectTask(ev);
            tasks.value = dataReload.tasks;
            renderChart();
            renderMemberChart();
            break;
        }
      });
    };

    const getStatusCount = (status) => {
      return tasks.value.filter(
        (task) => task.status === status && task.isOverdue === false
      ).length;
    };

    const getTasksFailed = () => {
      return tasks.value.filter((task) => task.isOverdue).length;
    };

    const getTaskCountByMember = (memberId) => {
      return tasks.value.filter((task) => task.assignedTo === memberId).length;
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

      // Tạo mới Chart.js
      new Chart(ctx, {
        type: "pie", // Đảm bảo rằng bạn đang sử dụng "pie" chart
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

                  const tasksForStatus = tasks.value.filter(
                    (task) => task.status === status
                  );
                  const taskNames = tasksForStatus
                    .map((task) => task.name)
                    .join(", ");
                  const assignees = tasksForStatus
                    .map((task) => task.assignedTo.map((user) => user.name))
                    .join(", ");

                  return `${status}: ${taskCount} tasks\nTasks: ${taskNames}\nAssigned to: ${assignees}`;
                },
              },
            },
          },
        },
      });
    };

    const renderMemberChart = () => {
      const memberNames = projectMembers.value.map((member) => member.name);
      const memberTaskCounts = projectMembers.value.map((member) =>
        getTaskCountByMember(member._id)
      );

      const memberData = {
        labels: memberNames,
        datasets: [
          {
            label: "Tasks Assigned",
            data: memberTaskCounts,
            backgroundColor: "#66b3ff",
            hoverBackgroundColor: "#3399ff",
          },
        ],
      };

      const ctx = document.getElementById("taskMemberChart").getContext("2d");

      new Chart(ctx, {
        type: "bar", // Sử dụng biểu đồ cột
        data: memberData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw} tasks`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    };

    return {
      getStatusCount,
      projectMembers,
    };
  },
};
</script>
