<template>
    <div class="flex justify-center items-center">
        <ContactCreateOrUpdate :is-update="true"/>
    </div>
</template>
<script setup>
definePageMeta({
  title: 'Cập nhật hồ sơ liên hệ',
})
</script>