<template>
    <div>
        <UserCreateUpdateProfileHr :is-update="true"/>
    </div>
</template>
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
definePageMeta({
  title: 'Cập nhật hồ sơ nhân sự'
})
</script>