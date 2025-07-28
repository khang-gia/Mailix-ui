<template>
    <div class="">
        <div class="">
          <GroupViewTabs :filters="mappingFilter[tab]" />
        </div>
    </div> 
</template>
<script setup>
const {  data: userInfo } = useAuth()

definePageMeta({
  title: 'Danh sách nhóm'
})

const tab = ref(0)
const mappingFilter = {
  0: null,
}
</script>
