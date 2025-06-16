<template>
    <div class="">
        <ContactListTabs v-model="tab" />
        <div class="">
          <ContactViewTabs :status="mappingStatus[tab]" />
        </div>
    </div>
    
</template>
<script setup>
definePageMeta({
  title: 'Danh sách liên hệ'
})
const tab = ref(0)
const mappingStatus = {
  0: 0,
  1: null,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
}
</script>
