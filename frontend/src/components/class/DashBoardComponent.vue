<template>
  <div class="w-full h-full overflow-hidden overflow-y-auto">
      <ProjectDashBoard/>
      <CreateGroupModal/>
      <AddMembersToGroup/>
      <AddMemberToPJ/>
  </div>
</template>

<script>
import ListProjects from "../list/ListProjects.vue";
import ProjectDashBoard from '../list/ProjectDashBoard.vue';

import CreateGroupModal from '../modals/CreateGroupModal.vue';
import AddMembersToGroup from '../modals/AddMembersToGroup.vue';
import AddMemberToPJ from '../modals/AddMemberToPJ.vue';


export default {
components: {
  ListProjects,
  ProjectDashBoard,
  CreateGroupModal,
  AddMembersToGroup,
  AddMemberToPJ
},
setup() {
  return {  }
},

};
</script>
