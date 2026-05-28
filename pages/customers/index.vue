<template>
    <div class="">
        <CustomerListTabs v-model="tab" />
        <div class="">
          <CustomerViewTabs :filters="mappingStatus[tab]" />
        </div>
    </div>
    
</template>
<script setup>
const {  data: userInfo } = useAuth()

definePageMeta({
  title: 'Danh sách khách hàng'
})
const tab = ref(0)
const mappingStatus = {
  0: null,
  1: {'curator':userInfo.value.id},
  2: {'curator__isnull':false},
  3: {'curator__isnull':true},
  4: {'type_of_customer':1},
  5: {'type_of_customer':2},
  6: {'deleted': 'true'},
}
</script>
