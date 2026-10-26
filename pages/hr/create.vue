<template>
    <div>
        <UserCreateUpdateProfileHr />
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

definePageMeta({
  title: 'Tạo hồ sơ nhân sự mới',
  middleware: [
    function () {
      const { can } = usePermission()
      if (!can('core/profile_hrs/', 'create')) {
        return navigateTo('/hr')
      }
    }
  ]
})
</script>