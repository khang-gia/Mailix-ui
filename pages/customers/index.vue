<template>
    <div class="">
        <CustomerListTabs v-model="tab" />
        <div class="">
          <CustomerViewTabs :filter="mappingStatus[tab]" />
        </div>
    </div>
    
</template>
<script setup>
definePageMeta({
  title: 'Danh sách khách hàng'
})
const tab = ref(0)
const mappingStatus = {
  0: null,
  1: 1,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
}
</script>
