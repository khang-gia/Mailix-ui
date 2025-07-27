<template>
    <div class="">
        <DepartmentListTabs v-model="tab" />
        <div class="">
          <DepartmentViewTabs :filters="mappingFilter[tab]" />
        </div>
    </div> 
</template>
<script setup>
const {  data: userInfo } = useAuth()

definePageMeta({
  title: 'Danh sách phòng ban'
})

const tab = ref(0)
const mappingFilter = {
  0: null,
}
</script>
