<template>

    <FullCalendar ref="calendarRef" :options="calendarOptions" />
</template>
  
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const {  data: userInfo } = useAuth()

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'

const modalStore = useModalStore()
const { setCalendarCreateModal } = modalStore
const { calendarCreateType } = storeToRefs(modalStore)
const calendarRef = ref(null)
watch(calendarCreateType, (newValue) => {
  console.log('calendarCreateType changed:', newValue);
  const refreshArray = ['created', 'updated', 'removed'];
  if (newValue && refreshArray.includes(newValue)) {
    refetchEvents();
  }
});
const refetchEvents = () => {
  const calendarApi = calendarRef.value.getApi(); 
  calendarApi.refetchEvents(); 
};
const props = defineProps({
  events: {
      type: Array,
      default: []
  }
})
function formatDateInfo(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  const weekday = weekdays[date.getDay()]
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${weekday}, ${day} tháng ${month}`
}

const handleDateSelect = (selectInfo)  =>{
  let calendarApi = selectInfo.view.calendar
  calendarApi.unselect() 
  let startInfo = formatDateInfo(selectInfo.startStr)
  let endDate = new Date(selectInfo.endStr)
  endDate.setDate(endDate.getDate() - 1)
  let endInfo = formatDateInfo(endDate.toISOString().split('T')[0])
  let dateInfo = { 
    startStr: startInfo, 
    endStr: endInfo, 
    start_datetime:selectInfo.start, 
    end_datetime:endDate,
    is_all_day: selectInfo.allDay,
  }
  setCalendarCreateModal(true, 'createEvent', { ...dateInfo})
  // if (title) {
  //   calendarApi.addEvent({
  //     id: createEventId(),
  //     title,
  //     start: selectInfo.startStr,
  //     end: selectInfo.endStr,
  //     allDay: selectInfo.allDay
  //   })
  // }
}
const loadEvent = async(eventId) => {
  try {
      if (eventId) {
          const {data: response} = await useAPI().get(`system/schedule-events/${eventId}/`);
          if (response && response.value) {
              const eventInfo = {
                  ...response.value,
                  start_datetime: response.value.start_datetime ? response.value.start_datetime.replace(/Z$/, '') : response.value.start_datetime,
                  end_datetime: response.value.end_datetime ? response.value.end_datetime.replace(/Z$/, '') : response.value.end_datetime,
              }
              return eventInfo;
          } else {
              return null;
          }
      }
  } catch (error) {
      console.error('Error loading event:', error);
  }
}
const handleEventSelect = async (selectEvent)=> {
  const event = selectEvent.event
  let startInfo = formatDateInfo(event.startStr)
  let endInfo = formatDateInfo(event.endStr)
  const eventInfo = await loadEvent(event.id)
  const data = {
    // ...eventInfo,
    id: event.id,
    title: event.title,
    start_datetime: event.start,
    end_datetime: event.allDay && !event.end ? event.start : event.end,
    startStr: startInfo,
    endStr: event.allDay && !event.end ? startInfo : endInfo,
    is_all_day: event.allDay,
    participants: eventInfo.participants || [],
    description: eventInfo.description || '',
    user: eventInfo.user || userInfo.value,
  }
  setCalendarCreateModal(true, 'updateEvent', { ...data })
}
const calendarOptions = {
  locale:'vi',
  customButtons: {
    myCustomButton: {
      text: 'custom!',
      click: function() {
        alert('clicked the custom button!');
      }
    }
  },
  buttonText:{
    today: t('today'),
    month: t('month'),
    week: t('week'),
    day: t('day'),
  },
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'today prev,next',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  // events: [
  //   { title: 'Event 1', date: '2025-07-20' },
  //   { title: 'Meeting', start: '2025-07-21T10:00:00', end: '2025-07-21T12:00:00' }
  // ],
  eventSources: [

    // your event source
    {
      events: async function (fetchInfo, successCallback, failureCallback) {
        try {
          const params = {
            start: fetchInfo.startStr,
            end: fetchInfo.endStr,
          }

          const data = await useAPI().$get('system/schedule-events/', params)

          // Optional: store total count
          // totalEvents.value = data.count

          const mappedResults = data.results.map(event => ({
            ...event,
            allDay: event.is_all_day,
            start: event.start_datetime,
            end: event.end_datetime
          }))
          console.log('mappedResults', mappedResults)
          successCallback(mappedResults)
        } catch (err) {
          console.error('Failed to load events:', err)
          failureCallback(err)
        }
      },
      backgroundColor: 'red',   // an option!
      textColor: 'white' // an option!
    }

    // any other sources...

  ],
  editable: true,
  selectable: true,
  handleWindowResize:true,
  stickyHeaderDates:true,
  select: handleDateSelect,
  eventClick: handleEventSelect
}

  </script>