<template>
    <div class="flex-grow-1 p-8">
        <schedule-cal />
    </div>
    <!-- <RickTextEditor /> -->
    
</template>
<script setup>
const {  data: userInfo } = useAuth()

definePageMeta({
  title: 'Lập lịch'
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
const reload = ref(false)
const totalEvents = ref(0)
const events = computedAsync(async () => {
  const data = await useAPI().$get('system/schedule-events/', { 
    ...params.value,
  })
  totalEvents.value = data.count
  
  const mappedResults = data.results.map(event => ({
    ...event,
    start: event.start_datetime ? event.start_datetime.replace(/Z$/, '') : event.start_datetime,
    end: event.end_datetime ? event.end_datetime.replace(/Z$/, '') : event.end_datetime,
  }))
  
  return mappedResults
}) 
</script>
