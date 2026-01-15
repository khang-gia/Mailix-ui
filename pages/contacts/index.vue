<template>
    <div class="">
        <ContactListTabs v-model="tab" v-model:viewMode="viewMode" />
        <div class="">
          <!-- List View -->
          <ContactViewTabs v-if="viewMode === 'list'" :filters="mappingStatus[tab]" />
          
          <!-- Kanban View -->
          <ContactKanbanViewTabs v-else />
        </div>
    </div>
    
</template>
<script setup>
definePageMeta({
  title: 'Danh sách liên hệ'
})
const tab = ref(0)
const viewMode = ref('list')

const mappingStatus = {
  0: null,
  1: {'status':1},
  2: {'status':2},
  3: {'status':3},
  4: {'status':4},
  5: {'status':5},
  6: {'status':6},
  7: {'status':7},
  8: {'status':8},
}
</script>
