<template>
    <div class="flex justify-center items-center">
        <ContactCreateOrUpdate :is-update="true"/>
    </div>
</template>
<script setup>
definePageMeta({
  title: 'Hồ sơ liên hệ',
})
const route = useRoute()
</script>