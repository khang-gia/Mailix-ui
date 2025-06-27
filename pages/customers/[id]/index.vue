<template>
    <div class="flex justify-center items-center">
        <CustomerCreateOrUpdate :is-update="true"/>
    </div>
</template>
<script setup>
definePageMeta({
  title: 'Cập nhật hồ sơ khách hàng',
})
</script>