<template>
    <div class="">
        <UserTabs v-model="tab" />
        <div class="">
          <UserHrTab/>
        </div>
    </div>
    
</template>
<script setup>
definePageMeta({
  title: 'Danh sách nhân sự'
})
const tab = ref(0)
</script>
