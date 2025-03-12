<template>
  <div class="relative inline-flex hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-900 rounded-lg">
    <UPopover v-model:open="isOpen">
      <UChip :show="hasNewNotification || hasNewSysNotification">
        <UButton variant="link" color="gray" icon="i-heroicons-bell" aria-label="notification" />
      </UChip>
      <template #panel>
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 py-1.5 rounded overflow-hidden w-80">
          <div class="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-2 flex justify-between border-b border-slate-200 dark:border-slate-600">
            <div class="flex">
              <UChip :show="hasNewNotification">
                <a href="#" class="col-1" :class="{'text-primary-500': active==1}" @click.stop="showNotiWithType(1)" >Bài viết</a>
              </UChip>
              <hr class="w-px h-4 bg-slate-200 dark:bg-slate-600 border-slate-200 dark:border-slate-600 mx-2" />
              <UChip :show="hasNewSysNotification">
                <a href="#" class="col-1" :class="{'text-primary-500': active==2}" @click.stop="showNotiWithType(2)">Hệ thống</a> 
              </UChip>
            </div>
            <div>
              <a href="#" class="font-normal" @click.stop="markAllRead">
                <Icon name="tabler:checks"></Icon>
                Đã đọc
              </a>
            </div>
          </div>

          <div class="p-2 overflow-y-auto" style="max-height: calc(100svh - 150px);">
            <div v-if="active===1">
              <div v-if="!notifications.results.length">
                Hiện tại chưa có thông báo nào!
              </div>
              <div v-else>
                <div v-for="noti in notifications.results" :key="noti" class="border-b border-slate-200 dark:border-slate-600 last:border-0 mb-2 pb-1 last:mb-0 last:pb-0">
                  <div class="font-bold">{{noti.title}}</div>
                  <span class="block text-sm">{{noti.message}}</span>
                  <div class="flex justify-between text-xs">
                    <div>
                      <Icon name="heroicons:calendar-16-solid"></Icon>
                      {{new Date(noti.created_at).toLocaleDateString()}}
                    </div>
                    <NuxtLink v-if="noti.link_to" :to="`/bai-viet${noti.link_to}`" class="text-primary-500" @click="isOpen=false">
                      <Icon name="heroicons:eye"></Icon>
                      Xem
                    </NuxtLink>
                  </div> 
                </div>
              </div>
            </div>
            <div v-if="active===2">
              <div v-if="!sysNotifications.results.length">
                Hiện tại chưa có thông báo mới!
              </div>
              <div v-else>
                <div v-for="noti in sysNotifications.results" :key="noti" class="border-b border-slate-200 dark:border-slate-600 last:border-0 mb-2 pb-1 last:mb-0 last:pb-0">
                  <div class="font-bold">📣 {{noti.title}}</div>
                  <span class="block text-sm" v-html="noti.message"></span>
                  <div class="flex justify-between text-xs">
                    <div>
                      <Icon name="heroicons:calendar-16-solid"></Icon>
                      {{new Date(noti.created_at).toLocaleDateString()}}
                    </div>
                    <NuxtLink v-if="noti.link_to" :to="noti.link_to" class="text-primary-500" @click="isOpen=false">
                      <Icon name="heroicons:link-16-solid"></Icon>
                      Thử ngay
                    </NuxtLink>
                  </div> 
                
                </div>
              </div>
            </div>
          </div>
        </div> 
      </template>
    </UPopover>

    
  </div>
</template>

<script setup>
import { useViewStore } from '@/stores/view'
import { storeToRefs } from 'pinia'
import _ from 'lodash'
const dayjs = useDayjs()
const toast = useToast()
const viewStore = useViewStore()
const { readTime } = storeToRefs(viewStore)

const props = defineProps({})
  
const active = ref(1)
const isOpen = ref(false)
const {data: sysNotifications} = await useAPI().get('/core/system_notifications/')

const {data: notifications} = await useAPI().get('/consult/notifications/')

const getLatestNoti = () => {
  if (notifications.value && notifications.value.results.length) {
    return notifications.value.results[0]
  }
  return null
}

const getLatestSysNoti = () => {
  if (sysNotifications.value && sysNotifications.value.results.length) {
    return sysNotifications.value.results[0]
  }
  return null
}

const hasNewNotification = computed(() => {
  const _latestObj = getLatestNoti()
  if (_latestObj) {
    if (!readTime.value) return true  
    return new Date(readTime.value) < new Date(_latestObj.created_at)
  }
  return false
})

const hasNewSysNotification = computed(() => {
  const _latestObj = getLatestSysNoti()
  if (_latestObj) {
    if (!readTime.value) return true  
    return new Date(readTime.value) < new Date(_latestObj.created_at)
  }
  return false
})
  

const showNotiWithType = (val) => {
  active.value = val
  markRead(val)
  
}
const markRead = (val) => {
  if (val === 1) {
    const latestNoti = getLatestNoti()
    if (latestNoti && (latestNoti.created_at > readTime.value || !readTime.value)) {
      viewStore.setReadTime(latestNoti.created_at)
    }
  } else {
    const latestNoti = getLatestSysNoti()
    if (latestNoti && (latestNoti.created_at > readTime.value || !readTime.value)) {
      viewStore.setReadTime(latestNoti.created_at)
    }
  }
}
const markAllRead = () => {
  markRead(1)
  markRead(2)
}


const checkAndShowPopup = () => {
  if (sysNotifications.value && sysNotifications.value.results.length) {
      const popupNoti = _.find(sysNotifications.value.results, (item) => item.show_popup && dayjs() < dayjs(item.popup_time))
      if (popupNoti) {
        const option = {
          title: popupNoti.title,
          description: popupNoti.message,
          timeout: 30*1000
        }
        if (popupNoti.image) {
          option.avatar = popupNoti.image
        } else {
          option.icon = 'i-heroicons-fire-16-solid'
        }
        toast.add(option)
      }
    }
}

onMounted(() => {
  // after 5s check if there is a notification need to show a toast
  setTimeout(() => {
    checkAndShowPopup()
  }, 5000)
})
</script>