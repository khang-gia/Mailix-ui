<template>
    <div class="flex justify-center items-center">
      <DepartmentCreateOrUpdate />
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
definePageMeta({
  title: 'Tạo mới phòng ban',
})
</script>