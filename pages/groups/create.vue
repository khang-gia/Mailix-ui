<template>
    <div class="flex justify-center items-center">
      <GroupCreateOrUpdate />
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
definePageMeta({
  title: 'Tạo nhóm',
})
</script>