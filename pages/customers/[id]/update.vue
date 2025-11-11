<template>
    <div class="flex justify-center items-center">
        <CustomerCreateOrUpdate :is-update="true"/>
    </div>
</template>
<script setup>
definePageMeta({
  title: 'Hồ sơ khách hàng',
})
const route = useRoute()
</script>