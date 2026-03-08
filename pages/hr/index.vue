<template>
  <div class="">
    <UserListTabs v-model="tab" />
    <div class="">
      <UserHrTab :filters="mappingFilter[tab]" />
    </div>
  </div>

</template>
<script setup>
const { data: userInfo } = useAuth()

definePageMeta({
  title: 'Danh sách nhân sự'
})
const tab = ref(0)
const mappingFilter = {
  0: { 'status': 0 },
  1: null,
  2: { 'status': 1 },
  3: { 'status': 2 },
  4: { 'status': 3 },
  5: { 'status': 4 },
  6: { 'deleted': 'true' },
}
</script>
