<template>
    <div class="">
        <ContactListTabs v-model="tab" />
        <div class="">
          <ContactViewTabs :filters="mappingStatus[tab]" />
        </div>
    </div>
    
</template>
<script setup>
definePageMeta({
  title: 'Danh sách liên hệ'
})
const tab = ref(0)
const mappingStatus = {
  0: null,
  1: {'status':1},
  2: {'status':2},
  3: {'status':3},
  4: {'status':4},
  5: {'status':5},
}
</script>
