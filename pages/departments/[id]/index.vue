<template>
    <div class="flex justify-center items-center">
        <DepartmentCreateOrUpdate :is-update="true"/>
    </div>
</template>
<script setup>
definePageMeta({
  title: 'Cập nhật phòng ban',
})
</script>