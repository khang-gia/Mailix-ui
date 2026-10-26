<template>
    <div>
        <UserCreateUpdateProfileHr :is-update="true"/>
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
definePageMeta({
  title: 'Cập nhật hồ sơ nhân sự',
  middleware: [
    function () {
      const { can } = usePermission()
      const route = useRoute()
      if (!can('core/profile_hrs/', 'update')) {
        return navigateTo(`/hr/${route.params.id}`)
      }
    }
  ]
})
</script>