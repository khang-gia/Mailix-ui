<template>
   <div class="">
        <TitleListTabs v-model="tab" />
        <div class="">
          <TitleViewTabs :filters="mappingFilter[tab]" />
        </div>
    </div> 
</template>
<script setup>
const {  data: userInfo } = useAuth()

definePageMeta({
  title: 'Danh sách chức vụ'
})
const tab = ref(0)
const mappingFilter = {
  0: null,
  1: {'status':2},
  2: {'assigned_to__isnull':false},
  3: {'assigned_to__isnull':true},
  4: {'assigned_to':userInfo.value.id},
  5: {'type_of_customer':1},
}
</script>
