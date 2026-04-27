<template>
  <div>
    <WorkListTabs v-model="tab" v-model:viewMode="viewMode" />
    <div class="">
      <!-- List View Tabs -->
      <WorkViewTabs v-if="viewMode === 'list'" :filters="listFilterTabs[tab]" />

      <!-- Kanban View Tabs -->
      <WorkKanbanViewTabs v-else />
    </div>
  </div>

</template>
<script setup>
const { data: userInfo } = useAuth()

definePageMeta({
  title: 'Danh sách công việc'
})
const tab = ref(0)
const viewMode = ref('list')

const listFilterTabs = {
  0: null,
  1: { 'status': 4 },
  2: { 'assigned_to__isnull': false },
  3: { 'assigned_to__isnull': true },
  4: { 'assigned_by': userInfo.value.id },
  5: { 'type_of_customer': 1 },
}
</script>
