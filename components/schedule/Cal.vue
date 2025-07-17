<template>

    <FullCalendar :options="calendarOptions" />
</template>
  
<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useModalStore } from '@/stores/modal'
const modalStore = useModalStore()
const { setCalendarCreateModal } = modalStore
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
  console.log('selectInfo',selectInfo )
  // let title = prompt('Please enter a new title for your event')
  let calendarApi = selectInfo.view.calendar
  calendarApi.unselect() // clear date selection
  let startInfo = formatDateInfo(selectInfo.startStr)
  let endDate = new Date(selectInfo.endStr)
  endDate.setDate(endDate.getDate() - 1)
  let endInfo = formatDateInfo(endDate.toISOString().split('T')[0])
  let dateInfo = { startStr: startInfo, endStr: endInfo, start:selectInfo.start, end:endDate }
  setCalendarCreateModal(true, 'schedules', { ...dateInfo})
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
const handleEventSelect = (selectEvent)=> {
  console.log('selectEvent',selectEvent)
  const event = selectEvent.event
  let startInfo = formatDateInfo(event.startStr)
  let endInfo = formatDateInfo(event.endStr)
  const data = {
    title: event.title,
    start: event.start,
    end: event.end,
    startStr: startInfo,
    endStr: endInfo
  }
  setCalendarCreateModal(true, 'schedules', { ...data })
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
            start: event.start_datetime?.replace(/Z$/, ''),
            end: event.end_datetime?.replace(/Z$/, '')
          }))

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