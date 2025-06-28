<template>
    <div class="flex justify-center items-center">
      <ContactCreateOrUpdate />
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
definePageMeta({
  title: 'Tạo mới liên hệ',
})
</script>