<template>
    <div class="flex justify-center items-center">
        <WorkCreateOrUpdate :is-update="true"/>
    </div>
</template>
<script setup>
definePageMeta({
  title: 'Hồ sơ công việc',
})
const route = useRoute()
</script>