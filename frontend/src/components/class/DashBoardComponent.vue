<template>
      <ProjectDashBoard/>
</template>

<script>
import ListProjects from "../list/ListProjects.vue";
import ProjectDashBoard from '../list/ProjectDashBoard.vue';

export default {
components: {
  ListProjects,
  ProjectDashBoard
},
setup() {
  return {  }
},

};
</script>
