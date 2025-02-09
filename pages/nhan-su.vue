<template>
    <div class="px-2">
        <UserTabs v-model="tab" />
    </div>
</template>
<script setup>
definePageMeta({
  title: 'Hồ sơ nhân sự'
})
const tab = ref(0)
</script>
